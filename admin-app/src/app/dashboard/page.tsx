'use client';

import { useEffect, useState } from 'react';
import api from '@/lib/api';
import { Plus, Trash2 } from 'lucide-react';

interface Founder {
  username: string;
  password: string;
  email: string;
  first_name: string;
  last_name: string;
}

interface Organization {
  id: number | string;
  name: string;
  slug: string;
  status?: string;
}

const EMPTY_FOUNDER: Founder = {
  username: '',
  password: '',
  email: '',
  first_name: '',
  last_name: '',
};

const MAX_FOUNDERS = 5;

export default function SuperAdminDashboard() {
  const [organizations, setOrganizations] = useState<Organization[]>([]);
  const [orgName, setOrgName] = useState('');
  const [orgSlug, setOrgSlug] = useState('');

  const [founders, setFounders] = useState<Founder[]>([
    { ...EMPTY_FOUNDER },
  ]);

  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [organizationsLoading, setOrganizationsLoading] = useState(true);

  // --------------------------------------------------
  // Fetch Organizations
  // --------------------------------------------------
  const fetchOrganizations = async () => {
    try {
      setOrganizationsLoading(true);

      const res = await api.get('/admin/organizations/');

      console.log('Organizations API response:', res.data);

      /*
        Supports different Django response formats:

        1. [
             { id: 1, name: 'ABC', slug: 'abc' }
           ]

        2. {
             organizations: [...]
           }

        3. {
             results: [...]
           }

        4. {
             data: [...]
           }
      */

      let organizationData: Organization[] = [];

      if (Array.isArray(res.data)) {
        organizationData = res.data;
      } else if (Array.isArray(res.data?.organizations)) {
        organizationData = res.data.organizations;
      } else if (Array.isArray(res.data?.results)) {
        organizationData = res.data.results;
      } else if (Array.isArray(res.data?.data)) {
        organizationData = res.data.data;
      }

      setOrganizations(organizationData);
    } catch (err: any) {
      console.error('Failed to fetch organizations:', err);

      setOrganizations([]);

      setError(
        err?.response?.data?.error ||
          'Failed to load organizations.'
      );
    } finally {
      setOrganizationsLoading(false);
    }
  };

  useEffect(() => {
    fetchOrganizations();
  }, []);

  // --------------------------------------------------
  // Founder Handlers
  // --------------------------------------------------
  const handleAddFounder = () => {
    if (founders.length >= MAX_FOUNDERS) return;

    setFounders((prev) => [
      ...prev,
      { ...EMPTY_FOUNDER },
    ]);
  };

  const handleRemoveFounder = (index: number) => {
    if (founders.length <= 1) return;

    setFounders((prev) =>
      prev.filter((_, idx) => idx !== index)
    );
  };

  const handleFounderChange = (
    index: number,
    field: keyof Founder,
    value: string
  ) => {
    setFounders((prev) =>
      prev.map((founder, idx) =>
        idx === index
          ? {
              ...founder,
              [field]: value,
            }
          : founder
      )
    );
  };

  // --------------------------------------------------
  // Organization Name / Slug
  // --------------------------------------------------
  const handleOrganizationNameChange = (
    value: string
  ) => {
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

  // --------------------------------------------------
  // Create Organization
  // --------------------------------------------------
  const handleCreateOrg = async (
    e: React.FormEvent<HTMLFormElement>
  ) => {
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

      console.log('Create organization payload:', payload);

      await api.post(
        '/admin/organizations/create/',
        payload
      );

      setMessage(
        `Organization "${orgName}" created successfully with ${founders.length} Founder(s)!`
      );

      // Reset form
      setOrgName('');
      setOrgSlug('');
      setFounders([{ ...EMPTY_FOUNDER }]);

      // Refresh organization list
      await fetchOrganizations();
    } catch (err: any) {
      console.error(
        'Create organization error:',
        err
      );

      const backendError =
        err?.response?.data?.error ||
        err?.response?.data?.detail ||
        err?.response?.data?.message;

      setError(
        backendError ||
          'Failed to create organization. Please try again.'
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 p-4 sm:p-6 lg:p-8">
      <div className="space-y-8">
        {/* Header */}
        <header className="flex flex-col gap-2 border-b border-slate-800 pb-4">
          <h1 className="text-2xl font-bold text-white">
            Platform Control Center
          </h1>

          <p className="text-xs text-slate-400">
            Onboard organizations and assign up to 5
            co-founders.
          </p>
        </header>

        {/* Main Content */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* ==========================================
              CREATE ORGANIZATION
          ========================================== */}
          <div className="bg-slate-900 border border-slate-800 p-5 sm:p-6 rounded-xl">
            <div className="space-y-5">
              <div>
                <h2 className="text-lg font-semibold text-white">
                  Onboard Company
                </h2>

                <p className="text-xs text-slate-500 mt-1">
                  Create a company and assign its founders.
                </p>
              </div>

              {/* Success Message */}
              {message && (
                <div className="p-3 text-xs bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 rounded-lg">
                  {message}
                </div>
              )}

              {/* Error Message */}
              {error && (
                <div className="p-3 text-xs bg-red-500/10 border border-red-500/30 text-red-300 rounded-lg">
                  {error}
                </div>
              )}

              <form
                onSubmit={handleCreateOrg}
                className="space-y-5"
              >
                {/* Company Name */}
                <div>
                  <label className="block text-xs text-slate-400 mb-1.5 font-medium">
                    Company Name *
                  </label>

                  <input
                    type="text"
                    required
                    value={orgName}
                    onChange={(e) =>
                      handleOrganizationNameChange(
                        e.target.value
                      )
                    }
                    placeholder="Enter company name"
                    className="w-full bg-slate-950 border border-slate-800 focus:border-blue-500 focus:outline-none rounded-lg p-2.5 text-sm text-white placeholder:text-slate-600 transition-colors"
                  />
                </div>

                {/* Slug */}
                <div>
                  <label className="block text-xs text-slate-400 mb-1.5 font-medium">
                    Slug Identifier *
                  </label>

                  <input
                    type="text"
                    required
                    value={orgSlug}
                    onChange={(e) =>
                      setOrgSlug(e.target.value)
                    }
                    placeholder="company-slug"
                    className="w-full bg-slate-950 border border-slate-800 focus:border-blue-500 focus:outline-none rounded-lg p-2.5 text-sm text-white placeholder:text-slate-600 transition-colors"
                  />
                </div>

                {/* Founders */}
                <div className="space-y-3 pt-1">
                  <div className="flex justify-between items-center">
                    <div>
                      <span className="font-medium text-sm text-slate-300">
                        Co-Founders
                      </span>

                      <span className="ml-2 text-[11px] text-slate-500">
                        ({founders.length}/{MAX_FOUNDERS})
                      </span>
                    </div>

                    {/* Add Founder */}
                    {founders.length < MAX_FOUNDERS && (
                      <button
                        type="button"
                        onClick={handleAddFounder}
                        className="flex items-center gap-1.5 text-[11px] bg-blue-600/10 border border-blue-500/40 text-blue-400 hover:bg-blue-600/20 px-2.5 py-1.5 rounded-lg transition-colors"
                      >
                        <Plus size={12} />
                        Add Co-Founder
                      </button>
                    )}
                  </div>

                  {/* Founder Fields */}
                  {founders.map(
                    (founder, index) => (
                      <div
                        key={index}
                        className="border border-slate-800 p-3.5 rounded-lg bg-slate-950/60 space-y-2.5"
                      >
                        {/* Founder Header */}
                        <div className="flex justify-between items-center">
                          <span className="font-semibold text-blue-400 uppercase tracking-wider text-[10px]">
                            {index === 0
                              ? 'Primary Founder / CEO'
                              : `Co-Founder #${index + 1}`}
                          </span>

                          {founders.length > 1 && (
                            <button
                              type="button"
                              onClick={() =>
                                handleRemoveFounder(
                                  index
                                )
                              }
                              className="text-slate-600 hover:text-red-400 transition-colors"
                              title="Remove founder"
                            >
                              <Trash2 size={14} />
                            </button>
                          )}
                        </div>

                        {/* Username */}
                        <input
                          type="text"
                          placeholder="Username *"
                          required
                          value={founder.username}
                          onChange={(e) =>
                            handleFounderChange(
                              index,
                              'username',
                              e.target.value
                            )
                          }
                          className="w-full bg-slate-900 border border-slate-800 focus:border-blue-500 focus:outline-none rounded-lg p-2 text-xs text-white placeholder:text-slate-600"
                        />

                        {/* Password */}
                        <input
                          type="password"
                          placeholder="Password *"
                          required
                          value={founder.password}
                          onChange={(e) =>
                            handleFounderChange(
                              index,
                              'password',
                              e.target.value
                            )
                          }
                          className="w-full bg-slate-900 border border-slate-800 focus:border-blue-500 focus:outline-none rounded-lg p-2 text-xs text-white placeholder:text-slate-600"
                        />

                        {/* Email */}
                        <input
                          type="email"
                          placeholder="Email Address"
                          value={founder.email}
                          onChange={(e) =>
                            handleFounderChange(
                              index,
                              'email',
                              e.target.value
                            )
                          }
                          className="w-full bg-slate-900 border border-slate-800 focus:border-blue-500 focus:outline-none rounded-lg p-2 text-xs text-white placeholder:text-slate-600"
                        />
                      </div>
                    )
                  )}
                </div>

                {/* Submit */}
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full bg-blue-600 hover:bg-blue-500 disabled:bg-blue-600/50 disabled:cursor-not-allowed text-white font-medium py-2.5 rounded-lg transition-colors text-sm"
                >
                  {loading
                    ? 'Creating Company...'
                    : `Provision Company & ${founders.length} Founder${
                        founders.length > 1
                          ? 's'
                          : ''
                      }`}
                </button>
              </form>
            </div>
          </div>

          {/* ==========================================
              ORGANIZATION LIST
          ========================================== */}
          <div className="lg:col-span-2 bg-slate-900 border border-slate-800 p-5 sm:p-6 rounded-xl">
            <div className="space-y-5">
              {/* Header */}
              <div className="flex justify-between items-center">
                <div>
                  <h2 className="text-lg font-semibold text-white">
                    Organizations
                  </h2>

                  <p className="text-xs text-slate-500 mt-1">
                    {organizations.length}{' '}
                    organization
                    {organizations.length !== 1
                      ? 's'
                      : ''}{' '}
                    onboarded
                  </p>
                </div>

                <button
                  type="button"
                  onClick={fetchOrganizations}
                  disabled={organizationsLoading}
                  className="text-xs text-blue-400 hover:text-blue-300 disabled:opacity-50"
                >
                  Refresh
                </button>
              </div>

              {/* Table */}
              <div className="overflow-x-auto rounded-lg border border-slate-800">
                <table className="w-full text-left text-sm border-collapse">
                  <thead>
                    <tr className="border-b border-slate-800 bg-slate-950/50 text-slate-400">
                      <th className="p-3 font-medium">
                        Company Name
                      </th>

                      <th className="p-3 font-medium">
                        Slug
                      </th>

                      <th className="p-3 font-medium">
                        Status
                      </th>
                    </tr>
                  </thead>

                  <tbody className="divide-y divide-slate-800 text-slate-300">
                    {organizationsLoading ? (
                      <tr>
                        <td
                          colSpan={3}
                          className="p-8 text-center text-xs text-slate-500"
                        >
                          Loading organizations...
                        </td>
                      </tr>
                    ) : organizations.length === 0 ? (
                      <tr>
                        <td
                          colSpan={3}
                          className="p-8 text-center text-xs text-slate-500"
                        >
                          No organizations found.
                        </td>
                      </tr>
                    ) : (
                      organizations.map((org) => (
                        <tr
                          key={org.id}
                          className="hover:bg-slate-950/50 transition-colors"
                        >
                          <td className="p-3 font-medium text-white">
                            {org.name}
                          </td>

                          <td className="p-3 font-mono text-xs text-slate-400">
                            {org.slug}
                          </td>

                          <td className="p-3">
                            <span className="inline-flex px-2 py-1 text-[11px] bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 rounded">
                              {org.status ||
                                'Active'}
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
        </div>
      </div>
    </div>
  );
}