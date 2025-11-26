"use client";

import Image from "next/image";
import { useState } from "react";
import { Calendar } from "react-calendar";
import 'react-calendar/dist/Calendar.css';

type ValuePiece = Date | null;

type Value = ValuePiece | [ValuePiece, ValuePiece];


const events = [
   
];

const EventCalendar = () => {
    const[value, onChange] = useState<Value>(new Date());
    return (
        <div className="p-4 bg-white rounded-lg shadow-md">
            <Calendar onChange={onChange} value={value} />
            
        {/* Upcoming Section */}
        <div className="mt-6 pt-6 border-t-2 border-gray-200">
            <div className="flex items-center justify-between mb-4">
                <h1 className="text-xl font-semibold">Upcoming</h1>
                <Image src="/calendar-icon.png" alt="Upcoming" width={24} height={24} />
            </div>
            <div className="flex flex-col gap-3">
                <div className="p-4 rounded-md bg-amber-50 border-l-4 border-amber-500">
                    <div className="flex items-center justify-between">
                        <h2 className="font-semibold text-gray-700">Maintenance Due</h2>
                        <span className="text-xs text-amber-600 font-medium">In 3 days</span>
                    </div>
                    <p className="text-sm text-gray-600 mt-1">HVAC system</p>
                </div>
                <div className="p-4 rounded-md bg-blue-50 border-l-4 border-blue-500">
                    <div className="flex items-center justify-between">
                        <h2 className="font-semibold text-gray-700">Warranty Expiring</h2>
                        <span className="text-xs text-blue-600 font-medium">In 2 weeks</span>
                    </div>
                    <p className="text-sm text-gray-600 mt-1">Dishwasher extended warranty</p>
                </div>
                <div className="p-4 rounded-md bg-purple-50 border-l-4 border-purple-500">
                    <div className="flex items-center justify-between">
                        <h2 className="font-semibold text-gray-700">Filter Replacement</h2>
                        <span className="text-xs text-purple-600 font-medium">In 1 month</span>
                    </div>
                    <p className="text-sm text-gray-600 mt-1">Brita water filter needs replacement</p>
                </div>
            </div>
        </div>
    </div>
    );
};

export default EventCalendar;
