'use client';
import { useRef, useEffect } from 'react';
import Image from 'next/image';

interface FilterDropdownProps {
  show: boolean;
  onToggle: () => void;
  selectedCategory: string;
  selectedStatus: string;
  categories: string[];
  onCategoryChange: (category: string) => void;
  onStatusChange: (status: string) => void;
  onClearAll: () => void;
  resultCount: number;
}

export default function FilterDropdown({
  show,
  onToggle,
  selectedCategory,
  selectedStatus,
  categories,
  onCategoryChange,
  onStatusChange,
  onClearAll,
  resultCount
}: FilterDropdownProps) {
  const dropdownRef = useRef<HTMLDivElement>(null);
  const hasActiveFilters = selectedCategory !== "all" || selectedStatus !== "all";

  // Close dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        onToggle();
      }
    }

    if (show) {
      document.addEventListener('mousedown', handleClickOutside);
      return () => document.removeEventListener('mousedown', handleClickOutside);
    }
  }, [show, onToggle]);

  return (
    <div className="relative" ref={dropdownRef}>
      <button 
        onClick={onToggle}
        className="w-8 h-8 flex items-center justify-center rounded-full bg-yellow-500 hover:bg-yellow-600 relative"
      >
        <Image src="/filter.png" alt="Filter" width={14} height={14} />
        {hasActiveFilters && (
          <span className="absolute -top-1 -right-1 w-3 h-3 bg-purple-600 rounded-full"></span>
        )}
      </button>
      
      {show && (
        <div className="absolute top-full right-0 mt-2 w-64 bg-white border border-gray-200 rounded-lg shadow-lg z-50">
          <div className="p-3 border-b border-gray-200 bg-gray-50">
            <div className="flex justify-between items-center">
              <h3 className="font-semibold text-sm">Filters</h3>
              {hasActiveFilters && (
                <button
                  onClick={onClearAll}
                  className="text-xs text-purple-600 hover:text-purple-700 font-medium"
                >
                  Clear All
                </button>
              )}
            </div>
          </div>
          
          <div className="p-3 space-y-4">
            {/* Category Filter */}
            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-2">
                Category
              </label>
              <select
                value={selectedCategory}
                onChange={(e) => onCategoryChange(e.target.value)}
                className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
              >
                <option value="all">All Categories</option>
                {categories.map((category) => (
                  <option key={category} value={category}>
                    {category}
                  </option>
                ))}
              </select>
            </div>

            {/* Status Filter */}
            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-2">
                Alert Status
              </label>
              <select
                value={selectedStatus}
                onChange={(e) => onStatusChange(e.target.value)}
                className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
              >
                <option value="all">All Statuses</option>
                <option value="ACTIVE">Active Alerts</option>
                <option value="SNOOZED">Snoozed</option>
                <option value="CANCELLED">Cancelled</option>
                <option value="NO_ALERT">No Alert Set</option>
              </select>
            </div>
          </div>

          <div className="p-2 border-t border-gray-200 bg-gray-50 text-xs text-gray-600 text-center">
            {resultCount} {resultCount === 1 ? 'result' : 'results'}
          </div>
        </div>
      )}
    </div>
  );
}
