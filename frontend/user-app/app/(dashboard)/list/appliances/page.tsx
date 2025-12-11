'use client';
import { useEffect, useState, useRef } from "react";
import { Appliance } from '@/lib/models/Appliance';
import { ApplianceService } from '@/lib/services/ApplianceService';
import Table from '@/components/Table';
import TableSearch from '@/components/TableSearch';
import Link from 'next/link';
import Image from 'next/image';
import Pagination from "@/components/Pagination";
import { useToast } from '@/contexts/ToastContext';
import { useAlertRefresh } from '@/contexts/AlertContext';
import { ApiClient } from '@/lib/services/ApiClient';
import FilterDropdown from '@/components/FilterDropdown';
import SortDropdown from '@/components/SortDropdown';
import TaskColorBadge from '@/components/TaskColorBadge';

const service = new ApplianceService();
const api = new ApiClient();

const ITEMS_PER_PAGE = 10;

export default function AppliancesPage() {
    const [items, setItems] = useState<Appliance[]>([]);
    const [loading, setLoading] = useState(true);
    const [deleteing, setDeleteing] = useState<number | null>(null);
    const [error, setError] = useState<string>();
    const [searchQuery, setSearchQuery] = useState("");
    const [currentPage, setCurrentPage] = useState(1);
    const [showFilterDropdown, setShowFilterDropdown] = useState(false);
    const [selectedCategory, setSelectedCategory] = useState<string>("all");
    const [selectedStatus, setSelectedStatus] = useState<string>("all");
    const [sortField, setSortField] = useState<string>("name");
    const [sortOrder, setSortOrder] = useState<"asc" | "desc">("asc");
    const [showSortDropdown, setShowSortDropdown] = useState(false);
    const { showToast } = useToast();
    const { triggerRefresh } = useAlertRefresh();
    const alertsChecked = useRef(false);

    async function refresh() {
        try {
            setLoading(true);
            setItems(await service.list());
        } catch (error: any) {
            setError(error.message);
        } finally {
            setLoading(false);
        }
    }

    async function checkAlerts() {
        if (alertsChecked.current) return; // Prevent duplicate calls
        alertsChecked.current = true;

        try {
            const userId = 1; // Hardcoded for now
            const response = await api.http.get(`/api/${userId}/appliances/alerts`);
            const alertAppliances = response.data;

            if (alertAppliances.length > 0) {
                // Get the list of alert IDs we've already shown today
                const today = new Date().toDateString();
                const shownAlertsKey = `shownAlerts_${today}`;
                const shownAlertsJson = localStorage.getItem(shownAlertsKey);
                const shownAlertIds = shownAlertsJson ? JSON.parse(shownAlertsJson) : [];

                // Filter to only new alerts we haven't shown yet today
                const newAlerts = alertAppliances.filter((a: any) => !shownAlertIds.includes(a.id));

                if (newAlerts.length > 0) {
                    const applianceNames = newAlerts.map((a: any) => a.name).join(', ');
                    const message = newAlerts.length === 1
                        ? `Maintenance alert: ${applianceNames} is due for service!`
                        : `Maintenance alerts: ${applianceNames} are due for service!`;

                    showToast(message, 'warning', 10000);

                    // Mark these alerts as shown
                    const updatedShownIds = [...shownAlertIds, ...newAlerts.map((a: any) => a.id)];
                    localStorage.setItem(shownAlertsKey, JSON.stringify(updatedShownIds));
                }
            }
        } catch (error: any) {
            console.error('Failed to check alerts:', error);
        }
    }

    useEffect(() => {
        refresh();
        checkAlerts();
    }, []);

    // Reset to first page when search query changes
    useEffect(() => {
        setCurrentPage(1);
    }, [searchQuery, selectedCategory, selectedStatus]);

    async function onDelete(id?: number) {
        if (!id) return;
        if (!confirm('Delete this appliance?')) return;
        setDeleteing(id);
        try {
            await service.delete(id);
            await refresh();
            triggerRefresh(); // Update navbar alert count
        } catch (error: any) {
            alert('Failed to delete: ' + error.message);
        }finally {
            setDeleteing(null);
        }
    }

    // Get unique categories for filter dropdown
    const uniqueCategories = Array.from(new Set(items.map(item => item.category).filter(Boolean))) as string[];

    // Filter items based on search query, category, and status
    const filteredItems = items.filter((appliance) => {
        // Search filter
        const query = searchQuery.toLowerCase();
        const matchesSearch = !query || (
            appliance.name?.toLowerCase().includes(query) ||
            appliance.brand?.toLowerCase().includes(query) ||
            appliance.model?.toLowerCase().includes(query) ||
            appliance.category?.toLowerCase().includes(query)
        );

        // Category filter
        const matchesCategory = selectedCategory === "all" || appliance.category === selectedCategory;

        // Status filter
        let matchesStatus = true;
        if (selectedStatus !== "all") {
            if (selectedStatus === "ACTIVE") {
                matchesStatus = appliance.alertStatus === "ACTIVE";
            } else if (selectedStatus === "SNOOZED") {
                matchesStatus = appliance.alertStatus === "SNOOZED";
            } else if (selectedStatus === "CANCELLED") {
                matchesStatus = appliance.alertStatus === "CANCELLED";
            } else if (selectedStatus === "NO_ALERT") {
                matchesStatus = !appliance.alertDate;
            }
        }

        return matchesSearch && matchesCategory && matchesStatus;
    });

    // Sort filtered items
    const sortedItems = [...filteredItems].sort((a, b) => {
        let aValue: any;
        let bValue: any;

        switch (sortField) {
            case 'name':
                aValue = a.name?.toLowerCase() || '';
                bValue = b.name?.toLowerCase() || '';
                break;
            case 'brand':
                aValue = a.brand?.toLowerCase() || '';
                bValue = b.brand?.toLowerCase() || '';
                break;
            case 'category':
                aValue = a.category?.toLowerCase() || '';
                bValue = b.category?.toLowerCase() || '';
                break;
            case 'alertDate':
                aValue = a.alertDate ? new Date(a.alertDate).getTime() : 0;
                bValue = b.alertDate ? new Date(b.alertDate).getTime() : 0;
                break;
            default:
                aValue = a.name?.toLowerCase() || '';
                bValue = b.name?.toLowerCase() || '';
        }

        if (aValue < bValue) return sortOrder === 'asc' ? -1 : 1;
        if (aValue > bValue) return sortOrder === 'asc' ? 1 : -1;
        return 0;
    });

    // Calculate pagination
    const totalPages = Math.ceil(sortedItems.length / ITEMS_PER_PAGE);
    const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
    const endIndex = startIndex + ITEMS_PER_PAGE;
    const paginatedItems = sortedItems.slice(startIndex, endIndex);

    const handlePageChange = (page: number) => {
        setCurrentPage(page);
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    const columns = [
        { header: "Appliance", accessor: "appliance" },
        { header: "Brand", accessor: "brand" },
        { header: "Model", accessor: "model" },
        { header: "Category", accessor: "category" },
        { header: "Alert Date", accessor: "alertDate" },
        { header: "Status", accessor: "status" },
        { header: "Actions", accessor: "actions", className: "" },
    ];

    const renderRow = (appliance: Appliance) => (
        <tr key={appliance.id} className="border-b border-gray-200 even:bg-slate-50 text-sm hover:bg-purple-300">
            <td className="p-4 align-middle">
                <Link href={`/list/appliances/${appliance.id}/view`} className="font-bold hover:underline flex items-center gap-1">
                    {appliance.name}
                    {appliance.recurringInterval && appliance.recurringInterval !== 'NONE' && (
                        <span className="text-purple-600" title={`Recurring: ${appliance.recurringInterval}`}>🔄</span>
                    )}
                </Link>
            </td>
            <td className="p-4 align-middle">{appliance.brand || '—'}</td>
            <td className="p-4 align-middle">{appliance.model || '—'}</td>
            <td className="p-4 align-middle">{appliance.category || '—'}</td>
            <td className="p-4 align-middle">
                {appliance.alertDate
                    ? new Date(appliance.alertDate + 'T00:00:00').toLocaleDateString()
                    : '—'}
            </td>
            <td className="p-4 align-middle">
                <TaskColorBadge
                    alertDate={appliance.alertDate}
                    snoozeUntil={appliance.snoozeUntil}
                    alertStatus={appliance.alertStatus}
                />
            </td>
            <td className="p-4 align-middle text-right">
                <div className="flex items-center gap-2">
                    <Link href={`/list/appliances/${appliance.id}/edit`}>
                        <button className="w-7 h-7 flex items-center justify-center rounded-full bg-purple-300 hover:bg-gray-200">
                            <Image src="/edit.png" alt="" width={14} height={14} />
                        </button>
                    </Link>
                    <button className="w-7 h-7 flex items-center justify-center rounded-full bg-yellow-500 hover:bg-gray-200" onClick={() => onDelete(appliance.id)}
                    disabled={deleteing === appliance.id}>
                        {deleteing === appliance.id ? (
                            <span className="text-xs">...</span>
                        ) : (
                        <Image src="/delete.png" alt="" width={14} height={14} />
                        )}
                    </button>
                </div>
            </td>
        </tr>
    );
    
   /* Additional code for adding more information.
   <td className="p-4">{appliance.serialNumber || '—'}</td>
            <td className="p-4">{appliance.purchaseDate || '—'}</td>
            <td className="p-4">{appliance.warrantyMonths ? `${appliance.warrantyMonths} months` : '—'}</td>
            <td className="p-4">{appliance.conditionText || '—'}</td>
            <td className="p-4">{appliance.notes || '—'}</td> */

    return (
        <section className="bg-white rounded-md flex-1 m-4 mt-0 p-4">
            {/* HEADER */}
            <div className="flex items-center justify-between">
                <h1 className="hidden md:block text-lg font-semibold">All Appliances</h1>
                <div className="flex flex-col md:flex-row items-center gap-4 w-full md:w-auto">
                    <TableSearch value={searchQuery} onChange={setSearchQuery} />
                    <div className="flex items-center gap-4 self-end">
                      <FilterDropdown
                        show={showFilterDropdown}
                        onToggle={() => setShowFilterDropdown(!showFilterDropdown)}
                        selectedCategory={selectedCategory}
                        selectedStatus={selectedStatus}
                        categories={uniqueCategories}
                        onCategoryChange={setSelectedCategory}
                        onStatusChange={setSelectedStatus}
                        onClearAll={() => {
                          setSelectedCategory("all");
                          setSelectedStatus("all");
                        }}
                        resultCount={filteredItems.length}
                      />
                      
                      <SortDropdown
                        show={showSortDropdown}
                        onToggle={() => setShowSortDropdown(!showSortDropdown)}
                        sortField={sortField}
                        sortOrder={sortOrder}
                        onFieldChange={setSortField}
                        onOrderChange={setSortOrder}
                      />
                      
                      <Link href="/list/appliances/new" className="w-8 h-8 flex items-center justify-center rounded-full bg-yellow-500 hover:bg-yellow-600">
                        <Image src="/create.png" alt="Add Appliance" width={14} height={14} />
                      </Link>
                    </div>
                </div>
            </div>

            {/* DATA */}
            {loading && <div className="text-gray-500 mt-4">Loading…</div>}
            
            {error && (
                <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mt-4">
                    <strong>Error:</strong> {error}
                </div>
            )}

            {!loading && !error && (
                <>
                    {filteredItems.length === 0 ? (
                        <div className="text-gray-500 mt-4 text-center py-8">
                            {searchQuery ? `No appliances found matching "${searchQuery}"` : 'No appliances found'}
                        </div>
                    ) : (
                        <>
                            <Table columns={columns} renderRow={renderRow} data={paginatedItems} />
                            <div className="mt-2 text-sm text-gray-600 px-4">
                                Showing {startIndex + 1}-{Math.min(endIndex, filteredItems.length)} of {filteredItems.length} appliances
                            </div>
                        </>
                    )}
                </>
            )}

            {/* PAGINATION */}
            {!loading && !error && filteredItems.length > 0 && (
                <Pagination 
                    currentPage={currentPage}
                    totalPages={totalPages}
                    onPageChange={handlePageChange}
                />
            )}
        </section>
    );
}
