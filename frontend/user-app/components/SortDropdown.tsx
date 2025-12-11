'use client';
import { useRef, useEffect } from 'react';
import Image from 'next/image';

interface SortDropdownProps {
  show: boolean;
  onToggle: () => void;
  sortField: string;
  sortOrder: 'asc' | 'desc';
  onFieldChange: (field: string) => void;
  onOrderChange: (order: 'asc' | 'desc') => void;
}

export default function SortDropdown({
  show,
  onToggle,
  sortField,
  sortOrder,
  onFieldChange,
  onOrderChange
}: SortDropdownProps) {
  const dropdownRef = useRef<HTMLDivElement>(null);

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
        className="w-8 h-8 flex items-center justify-center rounded-full bg-yellow-500 hover:bg-yellow-600"
      >
        <Image src="/quicksort.png" alt="Sort" width={14} height={14} />
      </button>
      
      {show && (
        <div className="absolute top-full right-0 mt-2 w-56 bg-white border border-gray-200 rounded-lg shadow-lg z-50">
          <div className="p-3 border-b border-gray-200 bg-gray-50">
            <h3 className="font-semibold text-sm">Sort By</h3>
          </div>
          
          <div className="p-3 space-y-3">
            {/* Sort Field */}
            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-2">
                Field
              </label>
              <select
                value={sortField}
                onChange={(e) => onFieldChange(e.target.value)}
                className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
              >
                <option value="name">Name</option>
                <option value="brand">Brand</option>
                <option value="category">Category</option>
                <option value="alertDate">Alert Date</option>
              </select>
            </div>

            {/* Sort Order */}
            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-2">
                Order
              </label>
              <div className="flex gap-2">
                <button
                  onClick={() => onOrderChange('asc')}
                  className={`flex-1 px-3 py-2 text-sm rounded-md border transition-colors ${
                    sortOrder === 'asc'
                      ? 'bg-purple-500 text-white border-purple-500'
                      : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-50'
                  }`}
                >
                  ↑ Ascending
                </button>
                <button
                  onClick={() => onOrderChange('desc')}
                  className={`flex-1 px-3 py-2 text-sm rounded-md border transition-colors ${
                    sortOrder === 'desc'
                      ? 'bg-purple-500 text-white border-purple-500'
                      : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-50'
                  }`}
                >
                  ↓ Descending
                </button>
              </div>
            </div>
          </div>

          <div className="p-2 border-t border-gray-200 bg-gray-50 text-xs text-gray-600 text-center">
            Sorting by {sortField} ({sortOrder === 'asc' ? 'A→Z' : 'Z→A'})
          </div>
        </div>
      )}
    </div>
  );
}
