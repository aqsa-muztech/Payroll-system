// components/admin/CreateOrgForm.tsx

'use client';

import { useState } from 'react';
import { Plus } from 'lucide-react';
import { Founder } from '@/types/admin';
import { FounderInputCard } from './FounderInputCard';
import api from '@/lib/api';

const EMPTY_FOUNDER: Founder = {
  username: '',
  password: '',
  email: '',
  first_name: '',
  last_name: '',
};

const MAX_FOUNDERS = 5;

interface CreateOrgFormProps {
  onSuccess: () => Promise<void>;
}

export function CreateOrgForm({ onSuccess }: CreateOrgFormProps) {
  const [orgName, setOrgName] = useState('');
  const [orgSlug, setOrgSlug] = useState('');
  const [founders, setFounders] = useState<Founder[]>([{ ...EMPTY_FOUNDER }]);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleOrganizationNameChange = (value: string) => {
    setOrgName(value);
    setOrgSlug(
      value
        .toLowerCase()
        .trim()
        .replace(/[^a-z0-9\s-]/g, '')
        .replace(/\s+/g, '-')
        .replace(/-+/g, '-')
    );
  };

  const handleAddFounder = () => {
    if (founders.length >= MAX_FOUNDERS) return;
    setFounders((prev) => [...prev, { ...EMPTY_FOUNDER }]);
  };

  const handleRemoveFounder = (index: number) => {
    if (founders.length <= 1) return;
    setFounders((prev) => prev.filter((_, idx) => idx !== index));
  };

  const handleFounderChange = (index: number, field: keyof Founder, value: string) => {
    setFounders((prev) =>
      prev.map((founder, idx) => (idx === index ? { ...founder, [field]: value } : founder))
    );
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setMessage('');
    setError('');
    setLoading(true);

    try {
      const payload = {
        org_name: orgName.trim(),
        org_slug: orgSlug.trim(),
        admins: founders,
      };

      await api.post('/admin/organizations/create/', payload);

      setMessage(
        `Organization "${orgName}" created successfully with ${founders.length} Founder(s)!`
      );
      setOrgName('');
      setOrgSlug('');
      setFounders([{ ...EMPTY_FOUNDER }]);

      await onSuccess();
    } catch (err: any) {
      const backendError =
        err?.response?.data?.error ||
        err?.response?.data?.detail ||
        err?.response?.data?.message;

      setError(backendError || 'Failed to create organization. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-slate-900 border border-slate-800 p-5 sm:p-6 rounded-xl">
      <div className="space-y-5">
        <div>
          <h2 className="text-lg font-semibold text-white">Onboard Company</h2>
          <p className="text-xs text-slate-500 mt-1">
            Create a company and assign its founders.
          </p>
        </div>

        {message && (
          <div className="p-3 text-xs bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 rounded-lg">
            {message}
          </div>
        )}

        {error && (
          <div className="p-3 text-xs bg-red-500/10 border border-red-500/30 text-red-300 rounded-lg">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="block text-xs text-slate-400 mb-1.5 font-medium">
              Company Name *
            </label>
            <input
              type="text"
              required
              value={orgName}
              onChange={(e) => handleOrganizationNameChange(e.target.value)}
              placeholder="Enter company name"
              className="w-full bg-slate-950 border border-slate-800 focus:border-blue-500 focus:outline-none rounded-lg p-2.5 text-sm text-white placeholder:text-slate-600 transition-colors"
            />
          </div>

          <div>
            <label className="block text-xs text-slate-400 mb-1.5 font-medium">
              Slug Identifier *
            </label>
            <input
              type="text"
              required
              value={orgSlug}
              onChange={(e) => setOrgSlug(e.target.value)}
              placeholder="company-slug"
              className="w-full bg-slate-950 border border-slate-800 focus:border-blue-500 focus:outline-none rounded-lg p-2.5 text-sm text-white placeholder:text-slate-600 transition-colors"
            />
          </div>

          <div className="space-y-3 pt-1">
            <div className="flex justify-between items-center">
              <div>
                <span className="font-medium text-sm text-slate-300">Co-Founders</span>
                <span className="ml-2 text-[11px] text-slate-500">
                  ({founders.length}/{MAX_FOUNDERS})
                </span>
              </div>

              {founders.length < MAX_FOUNDERS && (
                <button
                  type="button"
                  onClick={handleAddFounder}
                  className="flex items-center gap-1.5 text-[11px] bg-blue-600/10 border border-blue-500/40 text-blue-400 hover:bg-blue-600/20 px-2.5 py-1.5 rounded-lg transition-colors"
                >
                  <Plus size={12} /> Add Co-Founder
                </button>
              )}
            </div>

            {founders.map((founder, index) => (
              <FounderInputCard
                key={index}
                founder={founder}
                index={index}
                canRemove={founders.length > 1}
                onChange={handleFounderChange}
                onRemove={handleRemoveFounder}
              />
            ))}
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-blue-600 hover:bg-blue-500 disabled:bg-blue-600/50 disabled:cursor-not-allowed text-white font-medium py-2.5 rounded-lg transition-colors text-sm"
          >
            {loading
              ? 'Creating Company...'
              : `Provision Company & ${founders.length} Founder${
                  founders.length > 1 ? 's' : ''
                }`}
          </button>
        </form>
      </div>
    </div>
  );
}