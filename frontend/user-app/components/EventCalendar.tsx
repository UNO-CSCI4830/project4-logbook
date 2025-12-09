"use client";

import Image from "next/image";
import { useState } from "react";
import { Calendar } from "react-calendar";
import 'react-calendar/dist/Calendar.css';

type ValuePiece = Date | null;

type Value = ValuePiece | [ValuePiece, ValuePiece];

// Get dates for upcoming events
const getUpcomingDate = (daysFromNow: number) => {
    const date = new Date();
    date.setDate(date.getDate() + daysFromNow);
    return date;
};

const EventCalendar = () => {
    const[value, onChange] = useState<Value>(new Date());
    
    // Define dates with events
    const eventDates = [
        getUpcomingDate(3),  // Maintenance due
        getUpcomingDate(14), // Warranty expiring
        getUpcomingDate(30), // Filter replacement
    ];

    // Check if a date has an event
    const hasEvent = (date: Date) => {
        return eventDates.some(eventDate => 
            date.getDate() === eventDate.getDate() &&
            date.getMonth() === eventDate.getMonth() &&
            date.getFullYear() === eventDate.getFullYear()
        );
    };

    // Custom tile content to add dots on dates with events
    const tileContent = ({ date, view }: { date: Date; view: string }) => {
        if (view === 'month' && hasEvent(date)) {
            return <div className="flex justify-center"><div className="w-1.5 h-1.5 bg-blue-600 rounded-full mt-1"></div></div>;
        }
        return null;
    };

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
                <div className="p-4 rounded-md bg-red-50 border-2 border-red-500 shadow-sm">
                    <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center gap-2">
                            <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse"></div>
                            <h2 className="font-bold text-gray-800">Maintenance Due</h2>
                        </div>
                        <span className="px-2 py-1 bg-red-600 text-white text-xs font-bold rounded-full">In 3 days</span>
                    </div>
                    <p className="text-sm text-gray-700 font-medium">HVAC system</p>
                </div>
                <div className="p-4 rounded-md bg-amber-50 border-2 border-amber-500">
                    <div className="flex items-center justify-between">
                        <h2 className="font-semibold text-gray-700">Warranty Expiring</h2>
                        <span className="text-xs text-amber-600 font-medium">In 2 weeks</span>
                    </div>
                    <p className="text-sm text-gray-600 mt-1">Dishwasher extended warranty</p>
                </div>
                <div className="p-4 rounded-md bg-blue-50 border-2 border-blue-600">
                    <div className="flex items-center justify-between">
                        <h2 className="font-semibold text-gray-700">Filter Replacement</h2>
                        <span className="text-xs text-blue-600 font-medium">In 1 month</span>
                    </div>
                    <p className="text-sm text-gray-600 mt-1">Brita water filter needs replacement</p>
                </div>
            </div>
        </div>
    </div>
    );
};

export default EventCalendar;
