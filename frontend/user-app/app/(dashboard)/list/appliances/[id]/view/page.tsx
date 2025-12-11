'use client';
import { useEffect, useState, useRef } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import { Appliance } from '@/lib/models/Appliance';
import { ApplianceService } from '@/lib/services/ApplianceService';
import { useToast } from '@/contexts/ToastContext';
import { useAlertRefresh } from '@/contexts/AlertContext';
import { getStatusBadgeColor } from '@/lib/utils/statusColors';

const service = new ApplianceService();

export default function ViewAppliancePage() {
    const id = Number(useParams()?.id);
    const { showToast } = useToast();
    const { triggerRefresh } = useAlertRefresh();
    const [appliance, setAppliance] = useState<Appliance | null>(null);
    const [showSnoozeOptions, setShowSnoozeOptions] = useState(false);
    const [showCustomSnooze, setShowCustomSnooze] = useState(false);
    const [customSnoozeDate, setCustomSnoozeDate] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const snoozeDropdownRef = useRef<HTMLDivElement>(null);

    // Fetch appliance data - refetch on every mount and when id changes
    useEffect(() => {
        (async () => {
            const data = await service.get(id);
            setAppliance(data);
        })();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [id]);

    // Close snooze dropdown when clicking outside
    useEffect(() => {
        function handleClickOutside(event: MouseEvent) {
            if (snoozeDropdownRef.current && !snoozeDropdownRef.current.contains(event.target as Node)) {
                setShowSnoozeOptions(false);
            }
        }

        if (showSnoozeOptions) {
            document.addEventListener('mousedown', handleClickOutside);
            return () => document.removeEventListener('mousedown', handleClickOutside);
        }
    }, [showSnoozeOptions]);

    async function handleSnooze(days: number) {
        setIsLoading(true);
        try {
            const updated = await service.snoozeAlert(id, days);
            setAppliance(updated);
            setShowSnoozeOptions(false);
            showToast(`Alert snoozed for ${days} day${days > 1 ? 's' : ''}`, 'warning');
            triggerRefresh(); // Update navbar badge
        } catch (error) {
            console.error('Failed to snooze alert:', error);
            showToast('Failed to snooze alert. Please try again.', 'error');
        } finally {
            setIsLoading(false);
        }
    }

    async function handleCustomSnooze() {
        if (!customSnoozeDate) {
            showToast('Please select a date', 'error');
            return;
        }

        const today = new Date();
        today.setHours(0, 0, 0, 0);
        const selectedDate = new Date(customSnoozeDate + 'T00:00:00');

        if (selectedDate <= today) {
            showToast('Please select a future date', 'error');
            return;
        }

        const daysToSnooze = Math.ceil((selectedDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));

        setIsLoading(true);
        try {
            const updated = await service.snoozeAlert(id, daysToSnooze);
            setAppliance(updated);
            setShowSnoozeOptions(false);
            setShowCustomSnooze(false);
            setCustomSnoozeDate('');
            showToast(`Alert snoozed until ${selectedDate.toLocaleDateString()}`, 'warning');
            triggerRefresh(); // Update navbar badge
        } catch (error) {
            console.error('Failed to snooze alert:', error);
            showToast('Failed to snooze alert. Please try again.', 'error');
        } finally {
            setIsLoading(false);
        }
    }

    async function handleCancel() {
        if (!confirm('Are you sure you want to cancel this alert?')) return;
        setIsLoading(true);
        try {
            const updated = await service.cancelAlert(id);
            setAppliance(updated);
            showToast('Alert cancelled successfully', 'error');
            triggerRefresh(); // Update navbar badge
        } catch (error) {
            console.error('Failed to cancel alert:', error);
            showToast('Failed to cancel alert. Please try again.', 'error');
        } finally {
            setIsLoading(false);
        }
    }

    async function handleReactivate() {
        setIsLoading(true);
        try {
            const updated = await service.reactivateAlert(id);
            setAppliance(updated);
            showToast('Alert reactivated successfully', 'success');
            triggerRefresh(); // Update navbar badge
        } catch (error) {
            console.error('Failed to reactivate alert:', error);
            showToast('Failed to reactivate alert. Please try again.', 'error');
        } finally {
            setIsLoading(false);
        }
    }

    if (!appliance) return <div className="text-gray-500 p-4">Loading…</div>;

    const getStatusBadge = () => {
        const status = appliance.alertStatus || 'ACTIVE';
        return (
            <span className={`px-2 py-1 rounded text-sm font-medium ${getStatusBadgeColor(status)}`}>
                {status}
            </span>
        );
    };

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

                {appliance.alertDate && (
                    <div className={`${fieldClass} md:col-span-2`}>
                        <label className={labelClass}>Maintenance Alert</label>
                        <div className="flex flex-wrap items-center gap-2 mb-3">
                            <span className={valueClass}>
                                {new Date(appliance.alertDate + 'T00:00:00').toLocaleDateString()}
                            </span>
                            {getStatusBadge()}
                            {appliance.alertStatus === 'SNOOZED' && appliance.snoozeUntil && (
                                <span className="text-sm text-gray-600">
                                    (until {new Date(appliance.snoozeUntil + 'T00:00:00').toLocaleDateString()})
                                </span>
                            )}
                            {appliance.recurringInterval && appliance.recurringInterval !== 'NONE' && (
                                <span className="inline-flex items-center px-2 py-1 rounded text-xs font-medium bg-purple-100 text-purple-800">
                                    🔄 {appliance.recurringInterval === 'CUSTOM'
                                        ? `Every ${appliance.recurringIntervalDays} days`
                                        : appliance.recurringInterval.charAt(0) + appliance.recurringInterval.slice(1).toLowerCase()}
                                </span>
                            )}
                        </div>

                        {(() => {
                            // Check if alert is due (today or in the past)
                            const today = new Date();
                            today.setHours(0, 0, 0, 0);
                            const alertDate = new Date(appliance.alertDate + 'T00:00:00');
                            const isAlertDue = alertDate <= today;

                            // If alert is not due yet, don't show any buttons
                            if (!isAlertDue) {
                                return null;
                            }

                            return (
                                <div className="flex flex-wrap gap-2">
                                    {(!appliance.alertStatus || appliance.alertStatus === 'ACTIVE') && (
                                <>
                                    <div className="relative" ref={snoozeDropdownRef}>
                                        <button
                                            onClick={() => setShowSnoozeOptions(!showSnoozeOptions)}
                                            disabled={isLoading}
                                            className="px-4 py-2 bg-yellow-500 text-white rounded-md hover:bg-yellow-600 disabled:bg-yellow-300 disabled:cursor-not-allowed"
                                        >
                                            {isLoading ? 'Processing...' : 'Snooze Alert'}
                                        </button>
                                        {showSnoozeOptions && !showCustomSnooze && (
                                            <div className="absolute top-full mt-1 bg-white border border-gray-200 rounded-md shadow-lg z-10 min-w-[200px]">
                                                <button onClick={() => handleSnooze(1)} disabled={isLoading} className="block w-full px-4 py-2 text-left hover:bg-gray-50 disabled:bg-gray-100 disabled:cursor-not-allowed">1 day</button>
                                                <button onClick={() => handleSnooze(3)} disabled={isLoading} className="block w-full px-4 py-2 text-left hover:bg-gray-50 disabled:bg-gray-100 disabled:cursor-not-allowed">3 days</button>
                                                <button onClick={() => handleSnooze(7)} disabled={isLoading} className="block w-full px-4 py-2 text-left hover:bg-gray-50 disabled:bg-gray-100 disabled:cursor-not-allowed">7 days</button>
                                                <button onClick={() => handleSnooze(30)} disabled={isLoading} className="block w-full px-4 py-2 text-left hover:bg-gray-50 disabled:bg-gray-100 disabled:cursor-not-allowed">30 days</button>
                                                <button onClick={() => setShowCustomSnooze(true)} disabled={isLoading} className="block w-full px-4 py-2 text-left hover:bg-gray-50 disabled:bg-gray-100 disabled:cursor-not-allowed border-t border-gray-200 text-blue-600 font-medium">Custom date...</button>
                                            </div>
                                        )}
                                        {showSnoozeOptions && showCustomSnooze && (
                                            <div className="absolute top-full mt-1 bg-white border border-gray-200 rounded-md shadow-lg z-10 p-3 min-w-[250px]">
                                                <div className="mb-2">
                                                    <label className="block text-sm font-medium text-gray-700 mb-1">Snooze until:</label>
                                                    <input
                                                        type="date"
                                                        value={customSnoozeDate}
                                                        onChange={(e) => setCustomSnoozeDate(e.target.value)}
                                                        min={new Date(Date.now() + 86400000).toISOString().split('T')[0]}
                                                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-yellow-500"
                                                        disabled={isLoading}
                                                    />
                                                </div>
                                                <div className="flex gap-2">
                                                    <button
                                                        onClick={handleCustomSnooze}
                                                        disabled={isLoading}
                                                        className="flex-1 px-3 py-2 bg-yellow-500 text-white rounded-md hover:bg-yellow-600 disabled:bg-yellow-300 disabled:cursor-not-allowed text-sm"
                                                    >
                                                        Apply
                                                    </button>
                                                    <button
                                                        onClick={() => {
                                                            setShowCustomSnooze(false);
                                                            setCustomSnoozeDate('');
                                                        }}
                                                        disabled={isLoading}
                                                        className="flex-1 px-3 py-2 bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300 disabled:bg-gray-100 disabled:cursor-not-allowed text-sm"
                                                    >
                                                        Back
                                                    </button>
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                    <button
                                        onClick={handleCancel}
                                        disabled={isLoading}
                                        className="px-4 py-2 bg-red-500 text-white rounded-md hover:bg-red-600 disabled:bg-red-300 disabled:cursor-not-allowed"
                                    >
                                        {isLoading ? 'Processing...' : 'Cancel Alert'}
                                    </button>
                                </>
                            )}

                            {appliance.alertStatus === 'SNOOZED' && (
                                <>
                                    <button
                                        onClick={handleReactivate}
                                        disabled={isLoading}
                                        className="px-4 py-2 bg-green-500 text-white rounded-md hover:bg-green-600 disabled:bg-green-300 disabled:cursor-not-allowed"
                                    >
                                        {isLoading ? 'Processing...' : 'Reactivate Alert'}
                                    </button>
                                    <button
                                        onClick={handleCancel}
                                        disabled={isLoading}
                                        className="px-4 py-2 bg-red-500 text-white rounded-md hover:bg-red-600 disabled:bg-red-300 disabled:cursor-not-allowed"
                                    >
                                        {isLoading ? 'Processing...' : 'Cancel Alert'}
                                    </button>
                                </>
                            )}

                            {appliance.alertStatus === 'CANCELLED' && (
                                <button
                                    onClick={handleReactivate}
                                    disabled={isLoading}
                                    className="px-4 py-2 bg-green-500 text-white rounded-md hover:bg-green-600 disabled:bg-green-300 disabled:cursor-not-allowed"
                                >
                                    {isLoading ? 'Processing...' : 'Reactivate Alert'}
                                </button>
                            )}
                        </div>
                            );
                        })()}
                    </div>
                )}

                {!appliance.alertDate && (
                    <div className={fieldClass}>
                        <label className={labelClass}>First Alert Date</label>
                        <div className={valueClass}>—</div>
                    </div>
                )}

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
