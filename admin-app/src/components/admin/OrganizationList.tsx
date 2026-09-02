// components/admin/OrganizationList.tsx

'use client';

import { Organization } from '@/types/admin';

interface OrganizationListProps {
  organizations: Organization[];
  isLoading: boolean;
  onRefresh: () => void;
}

export function OrganizationList({
  organizations,
  isLoading,
  onRefresh,
}: OrganizationListProps) {
  return (
    <div className="lg:col-span-2 bg-slate-900 border border-slate-800 p-5 sm:p-6 rounded-xl">
      <div className="space-y-5">
        <div className="flex justify-between items-center">
          <div>
            <h2 className="text-lg font-semibold text-white">Organizations</h2>
            <p className="text-xs text-slate-500 mt-1">
              {organizations.length} organization
              {organizations.length !== 1 ? 's' : ''} onboarded
            </p>
          </div>

          <button
            type="button"
            onClick={onRefresh}
            disabled={isLoading}
            className="text-xs text-blue-400 hover:text-blue-300 disabled:opacity-50"
          >
            Refresh
          </button>
        </div>

        <div className="overflow-x-auto rounded-lg border border-slate-800">
          <table className="w-full text-left text-sm border-collapse">
            <thead>
              <tr className="border-b border-slate-800 bg-slate-950/50 text-slate-400">
                <th className="p-3 font-medium">Company Name</th>
                <th className="p-3 font-medium">Slug</th>
                <th className="p-3 font-medium">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800 text-slate-300">
              {isLoading ? (
                <tr>
                  <td colSpan={3} className="p-8 text-center text-xs text-slate-500">
                    Loading organizations...
                  </td>
                </tr>
              ) : organizations.length === 0 ? (
                <tr>
                  <td colSpan={3} className="p-8 text-center text-xs text-slate-500">
                    No organizations found.
                  </td>
                </tr>
              ) : (
                organizations.map((org) => (
                  <tr key={org.id} className="hover:bg-slate-950/50 transition-colors">
                    <td className="p-3 font-medium text-white">{org.name}</td>
                    <td className="p-3 font-mono text-xs text-slate-400">{org.slug}</td>
                    <td className="p-3">
                      <span className="inline-flex px-2 py-1 text-[11px] bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 rounded">
                        {org.status || 'Active'}
                      </span>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}