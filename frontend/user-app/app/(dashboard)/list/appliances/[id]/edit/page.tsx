'use client';
import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { Appliance } from '@/lib/models/Appliance';
import { ApplianceService } from '@/lib/services/ApplianceService';
import { ApplianceForm } from '../../shared/ApplianceForm';
import { useAlertRefresh } from '@/contexts/AlertContext';

const service = new ApplianceService();

export default function EditAppliancePage() {
    const id = Number(useParams()?.id);
    const router = useRouter();
    const { triggerRefresh } = useAlertRefresh();
    const [initial, setInitial] = useState<Appliance | null>(null);

    // Fetch appliance data - refetch on every mount and when id changes
    useEffect(() => {
        (async () => {
            const data = await service.get(id);
            setInitial(data);
        })();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [id]);

    async function onSubmit(patch: Appliance) {
        await service.update(id, patch);
        triggerRefresh(); // Update navbar alert count
        router.push(`/list/appliances/${id}/view`);
    }

    if (!initial) return <div className="text-gray-500 p-4">Loading…</div>;

    return (
        <section className="bg-white rounded-md flex-1 m-4 mt-0 p-4">
            <h1 className="text-xl font-semibold">Edit Appliance</h1>
            <ApplianceForm initial={initial} onSubmit={onSubmit} />
        </section>
    );
}
