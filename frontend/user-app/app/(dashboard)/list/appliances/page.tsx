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

const service = new ApplianceService();
const api = new ApiClient();

export default function AppliancesPage() {
    const [items, setItems] = useState<Appliance[]>([]);
    const [loading, setLoading] = useState(true);
    const [deleteing, setDeleteing] = useState<number | null>(null);
    const [error, setError] = useState<string>();
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

    const columns = [
        { header: "Appliance", accessor: "appliance" },
        { header: "Brand", accessor: "brand" },
        { header: "Model", accessor: "model" },
        { header: "Category", accessor: "category" },
        { header: "Alert Date", accessor: "alertDate" },
        { header: "Status", accessor: "status" },
        { header: "Actions", accessor: "actions", className: "" },
    ];

    const getStatusBadge = (appliance: Appliance) => {
        if (!appliance.alertDate) return null;

        const status = appliance.alertStatus || 'ACTIVE';
        const colors = {
            ACTIVE: 'bg-green-100 text-green-800',
            SNOOZED: 'bg-yellow-100 text-yellow-800',
            CANCELLED: 'bg-gray-100 text-gray-800'
        };

        return (
            <div className="flex flex-col gap-1">
                <span className={`px-2 py-1 rounded text-sm font-medium w-fit ${colors[status as keyof typeof colors]}`}>
                    {status}
                </span>
                {status === 'SNOOZED' && appliance.snoozeUntil && (
                    <span className="text-xs text-gray-600">
                        until {new Date(appliance.snoozeUntil + 'T00:00:00').toLocaleDateString()}
                    </span>
                )}
            </div>
        );
    };

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
                {getStatusBadge(appliance) || '—'}
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
                    <TableSearch />
                    <div className="flex items-center gap-4 self-end">
                      <button className="w-8 h-8 flex items-center justify-center rounded-full bg-yellow-500">
                        <Image src="/filter.png" alt="" width={14} height={14} />
                      </button>
                      <button className="w-8 h-8 flex items-center justify-center rounded-full bg-yellow-500">
                        <Image src="/quicksort.png" alt="" width={14} height={14} />
                      </button>
                      <Link href="/list/appliances/new" className="w-8 h-8 flex items-center justify-center rounded-full bg-yellow-500">
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

            {!loading && !error && <Table columns={columns} renderRow={renderRow} data={items} />}
            {/* PAGINATION */}
            <Pagination />
        </section>
    );
}
