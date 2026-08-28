'use client';

import { useState, useEffect } from 'react';
import api from '@/lib/api';
import { UserPlus, Building2, ShieldCheck } from 'lucide-react';

export default function OrgAdminDashboard() {
  const [profile, setProfile] = useState<any>(null);
  const [formData, setFormData] = useState({
    username: '',
    password: '',
    email: '',
    first_name: '',
    last_name: '',
    role: 'EMPLOYEE',
  });
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    api.get('/client/profile/')
      .then((res) => setProfile(res.data))
      .catch((err) => console.error(err));
  }, []);

  const handleCreateUser = async (e: React.FormEvent) => {
    e.preventDefault();
    setMessage('');
    setError('');

    try {
      await api.post('/client/users/create/', formData);
      setMessage(`Account for ${formData.username} created successfully as ${formData.role}!`);
      setFormData({ username: '', password: '', email: '', first_name: '', last_name: '', role: 'EMPLOYEE' });
    } catch (err: any) {
      setError(err.response?.data?.error || 'Failed to create account.');
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 p-8 space-y-8">
      {/* Header */}
      <header className="flex justify-between items-center bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
        <div>
          <span className="text-xs font-semibold uppercase tracking-wider text-blue-600 bg-blue-50 px-2.5 py-1 rounded">
            {profile?.organization?.name || 'Organization'}
          </span>
          <h1 className="text-2xl font-bold text-slate-900 mt-2">Executive Portal</h1>
          <p className="text-xs text-slate-500">Logged in as {profile?.username} ({profile?.role})</p>
        </div>
        <button
          onClick={() => {
            localStorage.removeItem('client_access_token');
            window.location.href = '/login';
          }}
          className="text-sm text-red-600 hover:underline font-medium"
        >
          Sign Out
        </button>
      </header>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Create User Form */}
        <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm space-y-4">
          <div className="flex items-center gap-2 text-slate-800">
            <UserPlus size={20} className="text-blue-600" />
            <h2 className="text-lg font-semibold">Add Co-Admin or Employee</h2>
          </div>

          {message && <div className="p-3 text-xs bg-emerald-100 border border-emerald-300 text-emerald-800 rounded">{message}</div>}
          {error && <div className="p-3 text-xs bg-red-100 border border-red-300 text-red-800 rounded">{error}</div>}

          <form onSubmit={handleCreateUser} className="space-y-3 text-sm">
            <div>
              <label className="block text-xs font-medium text-slate-700 mb-1">Assign Role *</label>
              <select
                value={formData.role}
                onChange={(e) => setFormData({ ...formData, role: e.target.value })}
                className="w-full border border-slate-300 rounded p-2 focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
              >
                <option value="EMPLOYEE">Regular Employee</option>
                <option value="HR_MANAGER">HR Manager</option>
                <option value="ORG_ADMIN">Co-Org Admin (CEO / CTO)</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-700 mb-1">First Name</label>
              <input
                type="text"
                value={formData.first_name}
                onChange={(e) => setFormData({ ...formData, first_name: e.target.value })}
                className="w-full border border-slate-300 rounded p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-700 mb-1">Last Name</label>
              <input
                type="text"
                value={formData.last_name}
                onChange={(e) => setFormData({ ...formData, last_name: e.target.value })}
                className="w-full border border-slate-300 rounded p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-700 mb-1">Username *</label>
              <input
                type="text"
                required
                value={formData.username}
                onChange={(e) => setFormData({ ...formData, username: e.target.value })}
                className="w-full border border-slate-300 rounded p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-700 mb-1">Initial Password *</label>
              <input
                type="password"
                required
                value={formData.password}
                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                className="w-full border border-slate-300 rounded p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <button
              type="submit"
              className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 rounded transition-colors"
            >
              Provision Account
            </button>
          </form>
        </div>

        {/* Company Status */}
        <div className="lg:col-span-2 bg-white p-6 rounded-xl border border-slate-200 shadow-sm space-y-4">
          <div className="flex items-center gap-2 text-slate-800">
            <Building2 size={20} className="text-blue-600" />
            <h2 className="text-lg font-semibold">Company Profile Overview</h2>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="p-4 bg-slate-50 border border-slate-200 rounded-lg">
              <p className="text-xs text-slate-500">Organization Name</p>
              <p className="text-base font-semibold text-slate-800">{profile?.organization?.name}</p>
            </div>
            <div className="p-4 bg-slate-50 border border-slate-200 rounded-lg">
              <p className="text-xs text-slate-500">Organization Slug</p>
              <p className="text-base font-mono text-slate-800">{profile?.organization?.slug}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}