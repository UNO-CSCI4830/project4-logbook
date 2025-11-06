'use client'
import { useRouter } from 'next/navigation'
import { Appliance } from '@/lib/models/Appliance';
import { ApplianceService } from '@/lib/services/ApplianceService';
import { ApplianceForm } from '../shared/ApplianceForm';

const service = new ApplianceService();

export default function AppliancePage() {
    const router = useRouter();

    async function onSubmit(a: Appliance) {
        const saved = await service.create(a);
        router.push(`/list/appliances/${saved.id}/view`)
    }

    return (
        <section className="bg-white rounded-md flex-1 m-4 mt-0 p-4">
            <h1 className="text-xl font-semibold"></h1>
            <ApplianceForm onSubmit={onSubmit} />
        </section>
    );
}
