// components/admin/FounderInputCard.tsx

'use client';

import { Trash2 } from 'lucide-react';
import { Founder } from '@/types/admin';

interface FounderInputCardProps {
  founder: Founder;
  index: number;
  canRemove: boolean;
  onChange: (index: number, field: keyof Founder, value: string) => void;
  onRemove: (index: number) => void;
}

export function FounderInputCard({
  founder,
  index,
  canRemove,
  onChange,
  onRemove,
}: FounderInputCardProps) {
  return (
    <div className="border border-slate-800 p-3.5 rounded-lg bg-slate-950/60 space-y-2.5">
      <div className="flex justify-between items-center">
        <span className="font-semibold text-blue-400 uppercase tracking-wider text-[10px]">
          {index === 0 ? 'Primary Founder / CEO' : `Co-Founder #${index + 1}`}
        </span>

        {canRemove && (
          <button
            type="button"
            onClick={() => onRemove(index)}
            className="text-slate-600 hover:text-red-400 transition-colors"
            title="Remove founder"
          >
            <Trash2 size={14} />
          </button>
        )}
      </div>

      <input
        type="text"
        placeholder="Username *"
        required
        value={founder.username}
        onChange={(e) => onChange(index, 'username', e.target.value)}
        className="w-full bg-slate-900 border border-slate-800 focus:border-blue-500 focus:outline-none rounded-lg p-2 text-xs text-white placeholder:text-slate-600"
      />

      <input
        type="password"
        placeholder="Password *"
        required
        value={founder.password}
        onChange={(e) => onChange(index, 'password', e.target.value)}
        className="w-full bg-slate-900 border border-slate-800 focus:border-blue-500 focus:outline-none rounded-lg p-2 text-xs text-white placeholder:text-slate-600"
      />

      <input
        type="email"
        placeholder="Email Address"
        value={founder.email}
        onChange={(e) => onChange(index, 'email', e.target.value)}
        className="w-full bg-slate-900 border border-slate-800 focus:border-blue-500 focus:outline-none rounded-lg p-2 text-xs text-white placeholder:text-slate-600"
      />
    </div>
  );
}