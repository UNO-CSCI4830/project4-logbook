'use client';
import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { Appliance } from '@/lib/models/Appliance';
import { ApplianceService } from '@/lib/services/ApplianceService';
import { ApplianceForm } from '../../shared/ApplianceForm';

const service = new ApplianceService();

export default function EditAppliancePage() {
    const id = Number(useParams()?.id);
    const router = useRouter();
    const [initial, setInitial] = useState<Appliance | null>(null);

    useEffect(() => {
        (async () => setInitial(await service.get(id)))();
    }, [id]);

    async function onSubmit(patch: Appliance) {
        await service.update(id, patch);
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
