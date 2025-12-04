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
import { ApiClient } from '@/lib/services/ApiClient';

const service = new ApplianceService();
const api = new ApiClient();

export default function AppliancesPage() {
    const [items, setItems] = useState<Appliance[]>([]);
    const [loading, setLoading] = useState(true);
    const [deleteing, setDeleteing] = useState<number | null>(null);
    const [error, setError] = useState<string>();
    const { showToast } = useToast();
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
                const applianceNames = alertAppliances.map((a: any) => a.name).join(', ');
                const message = alertAppliances.length === 1
                    ? `Maintenance alert: ${applianceNames} is due for service!`
                    : `Maintenance alerts: ${applianceNames} are due for service!`;

                showToast(message, 'warning', 10000);
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
        { header: "Actions", accessor: "actions", className: "" },
    ];

    const renderRow = (appliance: Appliance) => (
        <tr key={appliance.id} className="border-b border-gray-200 even:bg-slate-50 text-sm hover:bg-purple-300">
            <td className="flex items-center gap-4 p-4">
                <Link href={`/list/appliances/${appliance.id}/view`} className="font-bold hover:underline">
                    {appliance.name}
                </Link>
            </td>
            <td className="p-4">{appliance.brand || '—'}</td>
            <td className="p-4">{appliance.model || '—'}</td>
            <td className="p-4">{appliance.category || '—'}</td>
            <td className="p-4">
                {appliance.alertDate
                    ? new Date(appliance.alertDate + 'T00:00:00').toLocaleDateString()
                    : '—'}
            </td>
            <td className="p-4 text-right">
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
