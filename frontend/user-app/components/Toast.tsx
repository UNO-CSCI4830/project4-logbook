'use client';

import { useEffect } from 'react';
import Image from 'next/image';

export type ToastType = 'success' | 'error' | 'warning' | 'info';

export interface ToastProps {
  message: string;
  type?: ToastType;
  duration?: number;
  onClose: () => void;
}

export default function Toast({ message, type = 'info', duration = 5000, onClose }: ToastProps) {
  useEffect(() => {
    const timer = setTimeout(() => {
      onClose();
    }, duration);

    return () => clearTimeout(timer);
  }, [duration, onClose]);

  const bgColors = {
    success: 'bg-green-500',
    error: 'bg-red-500',
    warning: 'bg-yellow-500',
    info: 'bg-blue-500',
  };

  const icons = {
    success: '/announcement.png',
    error: '/delete.png',
    warning: '/announcement.png',
    info: '/announcement.png',
  };

  return (
    <div className={`${bgColors[type]} text-white px-6 py-4 rounded-lg shadow-lg flex items-center gap-3 min-w-[300px] max-w-[500px] animate-slideIn`}>
      <Image src={icons[type]} alt="" width={20} height={20} className="flex-shrink-0" />
      <p className="flex-1 text-sm">{message}</p>
      <button
        onClick={onClose}
        className="flex-shrink-0 hover:bg-white/20 rounded p-1 transition-colors"
      >
        <Image src="/close.png" alt="Close" width={16} height={16} />
      </button>
    </div>
  );
}
