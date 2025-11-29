'use client';
import { useState } from 'react';
import { Appliance } from '@/lib/models/Appliance';
import Link from 'next/link';

export interface ApplianceFormProps {
    initial?: Appliance;
    onSubmit: (a: Appliance) => Promise<void>;
}

export function ApplianceForm({ initial, onSubmit }: ApplianceFormProps) {
    const [form, setForm] = useState<Appliance>(initial ?? new Appliance());
    const [saving, setSaving] = useState(false);
    const [errors, setErrors] = useState<string[]>([]);

    function set<K extends keyof Appliance>(k: K, v: Appliance[K]) {
        setForm(prev => Object.assign(new Appliance(), prev, { [k]: v }));
    }

    async function submit(e: React.FormEvent) {
        e.preventDefault();
        const errors = form.validate();
        if (errors.length) {
            setErrors(errors);
            return;
        }
        setSaving(true);
        try {
            await onSubmit(form);
        } finally {
            setSaving(false);
        }
    }

    const inputClass = "w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500";
    const labelClass = "block text-sm font-medium text-gray-700 mb-1";

    return (
        <form className="mt-4" onSubmit={submit}>
            {errors.length > 0 && (
                <div className="bg-yellow-100 border border-yellow-400 text-yellow-700 px-4 py-3 rounded mb-4">
                    {errors.join(' ')}
                </div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                    <label htmlFor="name" className={labelClass}>Appliance*</label>
                    <input
                        id="name"
                        required
                        value={form.name}
                        onChange={e => set('name', e.target.value)}
                        className={inputClass}
                    />
                </div>

                <div>
                    <label htmlFor="category" className={labelClass}>Category</label>
                    <input
                        id="category"
                        value={form.category ?? ''}
                        onChange={e => set('category', e.target.value)}
                        className={inputClass}
                    />
                </div>

                <div>
                    <label htmlFor="brand" className={labelClass}>Brand</label>
                    <input
                        id="brand"
                        value={form.brand ?? ''}
                        onChange={e => set('brand', e.target.value)}
                        className={inputClass}
                    />
                </div>

                <div>
                    <label htmlFor="model" className={labelClass}>Model</label>
                    <input
                        id="model"
                        value={form.model ?? ''}
                        onChange={e => set('model', e.target.value)}
                        className={inputClass}
                    />
                </div>

                <div>
                    <label htmlFor="serialNumber" className={labelClass}>Serial #</label>
                    <input
                        id="serialNumber"
                        value={form.serialNumber ?? ''}
                        onChange={e => set('serialNumber', e.target.value)}
                        className={inputClass}
                    />
                </div>

                <div>
                    <label htmlFor="purchaseDate" className={labelClass}>Purchase Date</label>
                    <input
                        type="date"
                        id="purchaseDate"
                        value={form.purchaseDate ?? ''}
                        onChange={e => set('purchaseDate', e.target.value)}
                        className={inputClass}
                    />
                </div>

                <div>
                    <label htmlFor="warrantyMonths" className={labelClass}>Warranty (months)</label>
                    <input
                        type="number"
                        min={0}
                        id="warrantyMonths"
                        value={form.warrantyMonths ?? 0}
                        onChange={e => set('warrantyMonths', Number(e.target.value))}
                        className={inputClass}
                    />
                </div>

                <div>
                    <label htmlFor="conditionText" className={labelClass}>Condition</label>
                    <input
                        id="conditionText"
                        value={form.conditionText ?? ''}
                        onChange={e => set('conditionText', e.target.value)}
                        className={inputClass}
                    />
                </div>

                <div>
                    <label htmlFor="alertDate" className={labelClass}>Maintenance Alert Date</label>
                    <input
                        type="date"
                        id="alertDate"
                        value={form.alertDate ?? ''}
                        onChange={e => set('alertDate', e.target.value)}
                        className={inputClass}
                    />
                </div>

                <div className="md:col-span-2">
                    <label htmlFor="notes" className={labelClass}>Notes</label>
                    <textarea
                        id="notes"
                        rows={4}
                        value={form.notes ?? ''}
                        onChange={e => set('notes', e.target.value)}
                        className={inputClass}
                    />
                </div>
            </div>

            <div className="flex gap-4 mt-6">
                <button
                    className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed"
                    disabled={saving}
                    type="submit"
                >
                    {saving ? 'Saving…' : 'Save'}
                </button>
                <Link
                    href="/list/appliances"
                    className="px-4 py-2 bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300"
                >
                    Back
                </Link>
            </div>
        </form>
    );
}
