'use client';
import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { Appliance } from '@/lib/models/Appliance';
import { ApplianceService } from '@/lib/services/ApplianceService';

const service = new ApplianceService();

export default function ViewAppliancePage() {
    const id = Number(useParams()?.id);
    const router = useRouter();
    const [appliance, setAppliance] = useState<Appliance | null>(null);

    useEffect(() => {
        (async () => setAppliance(await service.get(id)))();
    }, [id]);

    if (!appliance) return <div className="text-gray-500 p-4">Loading…</div>;

    const fieldClass = "bg-gray-50 p-3 rounded-md";
    const labelClass = "block text-sm font-medium text-gray-600 mb-1";
    const valueClass = "text-gray-900 font-medium";

    return (
        <section className="bg-white rounded-md flex-1 m-4 mt-0 p-4">
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-2xl font-semibold">Appliance Details</h1>
                <div className="flex gap-3">
                    <Link
                        href={`/list/appliances/${id}/edit`}
                        className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600"
                    >
                        Edit
                    </Link>
                    <Link
                        href="/list/appliances"
                        className="px-4 py-2 bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300"
                    >
                        Back to List
                    </Link>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className={fieldClass}>
                    <label className={labelClass}>Appliance</label>
                    <div className={valueClass}>{appliance.name || '—'}</div>
                </div>

                <div className={fieldClass}>
                    <label className={labelClass}>Category</label>
                    <div className={valueClass}>{appliance.category || '—'}</div>
                </div>

                <div className={fieldClass}>
                    <label className={labelClass}>Brand</label>
                    <div className={valueClass}>{appliance.brand || '—'}</div>
                </div>

                <div className={fieldClass}>
                    <label className={labelClass}>Model</label>
                    <div className={valueClass}>{appliance.model || '—'}</div>
                </div>

                <div className={fieldClass}>
                    <label className={labelClass}>Serial Number</label>
                    <div className={valueClass}>{appliance.serialNumber || '—'}</div>
                </div>

                <div className={fieldClass}>
                    <label className={labelClass}>Purchase Date</label>
                    <div className={valueClass}>
                        {appliance.purchaseDate
                            ? new Date(appliance.purchaseDate + 'T00:00:00').toLocaleDateString()
                            : '—'
                        }
                    </div>
                </div>

                <div className={fieldClass}>
                    <label className={labelClass}>Warranty</label>
                    <div className={valueClass}>
                        {appliance.warrantyMonths 
                            ? `${appliance.warrantyMonths} months` 
                            : '—'
                        }
                    </div>
                </div>

                <div className={fieldClass}>
                    <label className={labelClass}>Condition</label>
                    <div className={valueClass}>{appliance.conditionText || '—'}</div>
                </div>

                <div className={fieldClass}>
                    <label className={labelClass}>Maintenance Alert Date</label>
                    <div className={valueClass}>
                        {appliance.alertDate
                            ? new Date(appliance.alertDate + 'T00:00:00').toLocaleDateString()
                            : '—'
                        }
                    </div>
                </div>

                <div className={`${fieldClass} md:col-span-2`}>
                    <label className={labelClass}>Notes</label>
                    <div className={valueClass} style={{ whiteSpace: 'pre-wrap' }}>
                        {appliance.notes || '—'}
                    </div>
                </div>
            </div>
        </section>
    );
}
