import { Check } from 'lucide-react';
import React from 'react';

export function Toast({ message, open, onClose, type = 'success' }: { message: string; open: boolean; onClose: () => void; type?: 'success' | 'error' }) {
  if (!open) return null;
  const bgColor = type === 'error' ? 'bg-red-700' : 'bg-green-700';
  return (
    <div className={`fixed top-6 left-1/2 z-50 -translate-x-1/2 ${bgColor} text-white px-6 py-3 rounded shadow flex items-center gap-3 min-w-[260px]`}>
      <Check className="w-5 h-5" />
      <span className="flex-1">{message}</span>
      <button onClick={onClose} className="ml-2 text-white/80 hover:text-white text-lg leading-none">×</button>
    </div>
  );
} 