"use client";

import Image from "next/image";
import { useState } from "react";
import { Calendar } from "react-calendar";
import 'react-calendar/dist/Calendar.css';
import Link from "next/link";
import { Appliance } from '@/lib/models/Appliance';

type ValuePiece = Date | null;
type Value = ValuePiece | [ValuePiece, ValuePiece];

interface EventCalendarProps {
    appliances?: Appliance[];
}

const EventCalendar = ({ appliances = [] }: EventCalendarProps) => {
    const [value, onChange] = useState<Value>(new Date());
    
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    // Get all appliances with alert dates
    const appliancesWithAlerts = appliances.filter(a => 
        a.alertDate && a.alertStatus !== 'CANCELLED'
    );

    // Get dates that have events (alert dates)
    const eventDates = appliancesWithAlerts.map(a => new Date(a.alertDate! + 'T00:00:00'));

    // Check if a date has an event
    const hasEvent = (date: Date) => {
        return eventDates.some(eventDate => 
            date.getDate() === eventDate.getDate() &&
            date.getMonth() === eventDate.getMonth() &&
            date.getFullYear() === eventDate.getFullYear()
        );
    };

    // Get appliances for a specific date
    const getAppliancesForDate = (date: Date) => {
        return appliancesWithAlerts.filter(a => {
            const alertDate = new Date(a.alertDate! + 'T00:00:00');
            return date.getDate() === alertDate.getDate() &&
                   date.getMonth() === alertDate.getMonth() &&
                   date.getFullYear() === alertDate.getFullYear();
        });
    };

    // Custom tile content to add dots on dates with events
    const tileContent = ({ date, view }: { date: Date; view: string }) => {
        if (view === 'month' && hasEvent(date)) {
            const appliancesOnDate = getAppliancesForDate(date);
            const isOverdue = date < today;
            const isToday = date.getTime() === today.getTime();
            
            return (
                <div className="flex justify-center">
                    <div className={`w-1.5 h-1.5 rounded-full mt-1 ${
                        isOverdue ? 'bg-red-600' : 
                        isToday ? 'bg-amber-500 animate-pulse' : 
                        'bg-blue-600'
                    }`} title={appliancesOnDate.map(a => a.name).join(', ')}></div>
                </div>
            );
        }
        return null;
    };

    // Calculate days difference
    const getDaysText = (dateString: string) => {
        const date = new Date(dateString + 'T00:00:00');
        const diffTime = date.getTime() - today.getTime();
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
        
        if (diffDays === 0) return 'Today';
        if (diffDays === 1) return 'Tomorrow';
        if (diffDays < 0) return `${Math.abs(diffDays)} day${Math.abs(diffDays) > 1 ? 's' : ''} overdue`;
        if (diffDays < 7) return `In ${diffDays} day${diffDays > 1 ? 's' : ''}`;
        if (diffDays < 30) return `In ${Math.ceil(diffDays / 7)} week${Math.ceil(diffDays / 7) > 1 ? 's' : ''}`;
        return `In ${Math.ceil(diffDays / 30)} month${Math.ceil(diffDays / 30) > 1 ? 's' : ''}`;
    };

    // Get color based on urgency
    const getAlertColor = (dateString: string) => {
        const date = new Date(dateString + 'T00:00:00');
        const diffDays = Math.ceil((date.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));
        
        if (diffDays < 0) return { bg: 'bg-red-50', border: 'border-red-500', text: 'text-red-600', badge: 'bg-red-600' };
        if (diffDays <= 3) return { bg: 'bg-red-50', border: 'border-red-500', text: 'text-red-600', badge: 'bg-red-600' };
        if (diffDays <= 14) return { bg: 'bg-amber-50', border: 'border-amber-500', text: 'text-amber-600', badge: 'bg-amber-500' };
        return { bg: 'bg-blue-50', border: 'border-blue-600', text: 'text-blue-600', badge: 'bg-blue-600' };
    };

    // Get upcoming alerts (sorted by date) - within 60 days
    const getUpcomingAlerts = () => {
        const sixtyDaysFromNow = new Date(today);
        sixtyDaysFromNow.setDate(sixtyDaysFromNow.getDate() + 60);
        
        return appliancesWithAlerts
            .filter(a => {
                const alertDate = new Date(a.alertDate! + 'T00:00:00');
                // Include overdue (up to 30 days) and upcoming (within 60 days)
                const thirtyDaysAgo = new Date(today);
                thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
                return alertDate >= thirtyDaysAgo && alertDate <= sixtyDaysFromNow;
            })
            .sort((a, b) => {
                const dateA = new Date(a.alertDate! + 'T00:00:00');
                const dateB = new Date(b.alertDate! + 'T00:00:00');
                return dateA.getTime() - dateB.getTime();
            })
            .slice(0, 5); // Limit to 5 upcoming items
    };

    const upcomingAlerts = getUpcomingAlerts();

    return (
        <div className="p-4 bg-white rounded-lg shadow-md border-t-5 border-l-2 border-r-2 border-purple-500">
            <style jsx global>{`
                .react-calendar__month-view__days__day--weekend {
                    color: #111827 !important;
                }
            `}</style>
            <Calendar 
                onChange={onChange} 
                value={value}
                tileContent={tileContent}
            />
            
        {/* Upcoming Section */}
        <div className="mt-6 pt-6 border-t-2 border-gray-200">
            <div className="flex items-center justify-between mb-4">
                <h1 className="text-xl font-semibold">Upcoming</h1>
                <Image src="/calendar-icon.png" alt="Upcoming" width={24} height={24} />
            </div>
            <div className="flex flex-col gap-3">
                {upcomingAlerts.length === 0 ? (
                    <div className="p-4 bg-gray-50 border-2 border-gray-200 rounded-lg text-center">
                        <p className="text-gray-500 text-sm">No upcoming maintenance</p>
                        <p className="text-gray-400 text-xs mt-1">Add alert dates to your appliances to see them here</p>
                    </div>
                ) : (
                    upcomingAlerts.map(appliance => {
                        const colors = getAlertColor(appliance.alertDate!);
                        const daysText = getDaysText(appliance.alertDate!);
                        const isOverdue = daysText.includes('overdue');
                        const isUrgent = daysText === 'Today' || daysText === 'Tomorrow' || isOverdue;
                        
                        return (
                            <Link key={appliance.id} href={`/list/appliances/${appliance.id}/view`}>
                                <div className={`p-4 rounded-md ${colors.bg} border-2 ${colors.border} shadow-sm cursor-pointer hover:opacity-90 transition-opacity`}>
                                    <div className="flex items-center justify-between mb-2">
                                        <div className="flex items-center gap-2">
                                            {isUrgent && (
                                                <div className={`w-2 h-2 ${colors.badge} rounded-full ${isOverdue || daysText === 'Today' ? 'animate-pulse' : ''}`}></div>
                                            )}
                                            <h2 className={`font-${isUrgent ? 'bold' : 'semibold'} text-gray-800`}>
                                                {isOverdue ? 'Overdue' : 'Maintenance Due'}
                                            </h2>
                                        </div>
                                        <span className={`px-2 py-1 ${colors.badge} text-white text-xs font-bold rounded-full`}>
                                            {daysText}
                                        </span>
                                    </div>
                                    <p className="text-sm text-gray-700 font-medium">{appliance.name}</p>
                                    {appliance.category && (
                                        <p className="text-xs text-gray-500 mt-1">{appliance.category}</p>
                                    )}
                                    {appliance.alertStatus === 'SNOOZED' && appliance.snoozeUntil && (
                                        <p className="text-xs text-amber-600 mt-1">
                                            Snoozed until {new Date(appliance.snoozeUntil + 'T00:00:00').toLocaleDateString()}
                                        </p>
                                    )}
                                </div>
                            </Link>
                        );
                    })
                )}
            </div>
            {appliancesWithAlerts.length > 5 && (
                <Link href="/list/appliances">
                    <button className="w-full mt-4 px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors text-sm font-medium">
                        View All ({appliancesWithAlerts.length}) Appliances
                    </button>
                </Link>
            )}
        </div>
    </div>
    );
};

export default EventCalendar;
