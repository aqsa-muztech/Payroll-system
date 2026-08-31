'use client';

import { useState, useEffect } from 'react';
import api from '@/lib/api';
import { User, CreditCard, Building, Calendar, Shield, DollarSign } from 'lucide-react';

export default function EmployeeDashboard() {
  const [data, setData] = useState<any>(null);
  const [activeTab, setActiveTab] = useState<'payroll' | 'profile'>('payroll');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    api.get('/client/employee/me/')
      .then((res) => {
        setData(res.data);
        setLoading(false);
      })
      .catch((err) => {
        setError(err.response?.data?.error || 'Failed to fetch employee details.');
        setLoading(false);
      });
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center text-slate-500 text-sm">
        Loading employee dashboard...
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-slate-50 p-8 flex justify-center items-start">
        <div className="bg-red-50 border border-red-200 text-red-700 p-4 rounded-lg max-w-md w-full text-sm">
          {error}
        </div>
      </div>
    );
  }

  const { profile, payroll } = data || {};

  return (
    <div className="min-h-screen bg-slate-50 p-8 space-y-8">
      {/* Header */}
      <header className="flex justify-between items-center bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
        <div>
          <span className="text-xs font-semibold uppercase tracking-wider text-blue-600 bg-blue-50 px-2.5 py-1 rounded">
            {profile?.organization_name}
          </span>
          <h1 className="text-2xl font-bold text-slate-900 mt-2">Employee Portal</h1>
          <p className="text-xs text-slate-500">
            Welcome back, {profile?.full_name} ({profile?.system_emp_code})
          </p>
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

      {/* Navigation Tabs */}
      <div className="flex gap-4 border-b border-slate-200 pb-2">
        <button
          onClick={() => setActiveTab('payroll')}
          className={`flex items-center gap-2 px-4 py-2 text-sm font-medium rounded-lg transition-colors ${
            activeTab === 'payroll'
              ? 'bg-blue-600 text-white'
              : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-100'
          }`}
        >
          <CreditCard size={16} /> Payroll & Salary Breakdown
        </button>
        <button
          onClick={() => setActiveTab('profile')}
          className={`flex items-center gap-2 px-4 py-2 text-sm font-medium rounded-lg transition-colors ${
            activeTab === 'profile'
              ? 'bg-blue-600 text-white'
              : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-100'
          }`}
        >
          <User size={16} /> Personal & Job Profile
        </button>
      </div>

      {/* TAB 1: PAYROLL OVERVIEW */}
      {activeTab === 'payroll' && (
        <div className="space-y-6">
          {/* Gross Salary Highlight Card */}
          <div className="bg-gradient-to-r from-blue-600 to-indigo-700 text-white p-6 rounded-xl shadow-md flex justify-between items-center">
            <div>
              <p className="text-xs uppercase tracking-wider font-medium text-blue-100">Total Monthly Gross Salary</p>
              <h2 className="text-3xl font-extrabold mt-1">
                PKR {Number(payroll?.gross_salary).toLocaleString()}
              </h2>
            </div>
            <div className="p-3 bg-white/10 rounded-lg backdrop-blur-sm">
              <DollarSign size={32} />
            </div>
          </div>

          {/* Detailed Breakdown Grid */}
          <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm space-y-4">
            <h3 className="text-base font-semibold text-slate-800 border-b border-slate-200 pb-3">
              Salary Component Allowances Breakdown
            </h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 text-xs">
              <div className="p-4 bg-slate-50 rounded-lg border border-slate-200">
                <p className="text-slate-500 font-medium">Basic Salary</p>
                <p className="text-lg font-bold text-slate-900 mt-1">
                  PKR {Number(payroll?.basic_salary).toLocaleString()}
                </p>
              </div>

              <div className="p-4 bg-slate-50 rounded-lg border border-slate-200">
                <p className="text-slate-500 font-medium">House Rent Allowance</p>
                <p className="text-lg font-bold text-slate-900 mt-1">
                  PKR {Number(payroll?.house_rent).toLocaleString()}
                </p>
              </div>

              <div className="p-4 bg-slate-50 rounded-lg border border-slate-200">
                <p className="text-slate-500 font-medium">Utilities Allowance</p>
                <p className="text-lg font-bold text-slate-900 mt-1">
                  PKR {Number(payroll?.utilities_allowance).toLocaleString()}
                </p>
              </div>

              <div className="p-4 bg-slate-50 rounded-lg border border-slate-200">
                <p className="text-slate-500 font-medium">Conveyance Allowance</p>
                <p className="text-lg font-bold text-slate-900 mt-1">
                  PKR {Number(payroll?.conveyance_allowance).toLocaleString()}
                </p>
              </div>

              <div className="p-4 bg-slate-50 rounded-lg border border-slate-200">
                <p className="text-slate-500 font-medium">Medical Allowance</p>
                <p className="text-lg font-bold text-slate-900 mt-1">
                  PKR {Number(payroll?.medical_allowance).toLocaleString()}
                </p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: PROFILE INFORMATION */}
      {activeTab === 'profile' && (
        <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm space-y-6 text-xs">
          <h3 className="text-base font-semibold text-slate-800 border-b border-slate-200 pb-3">
            Employee Particulars
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div>
              <p className="text-slate-500 font-medium">System Employee Code</p>
              <p className="text-sm font-semibold font-mono text-blue-600 mt-1">{profile?.system_emp_code}</p>
            </div>
            <div>
              <p className="text-slate-500 font-medium">Org Employee Code</p>
              <p className="text-sm font-semibold text-slate-800 mt-1">{profile?.org_emp_code || 'N/A'}</p>
            </div>
            <div>
              <p className="text-slate-500 font-medium">Designation</p>
              <p className="text-sm font-semibold text-slate-800 mt-1">{profile?.designation}</p>
            </div>
            <div>
              <p className="text-slate-500 font-medium">Department</p>
              <p className="text-sm font-semibold text-slate-800 mt-1">{profile?.department}</p>
            </div>
            <div>
              <p className="text-slate-500 font-medium">Reporting Manager</p>
              <p className="text-sm font-semibold text-slate-800 mt-1">{profile?.manager_name || 'N/A'}</p>
            </div>
            <div>
              <p className="text-slate-500 font-medium">Date of Joining</p>
              <p className="text-sm font-semibold text-slate-800 mt-1">{profile?.doj}</p>
            </div>
            <div>
              <p className="text-slate-500 font-medium">CNIC Number</p>
              <p className="text-sm font-semibold text-slate-800 mt-1">{profile?.cnic || 'N/A'}</p>
            </div>
            <div>
              <p className="text-slate-500 font-medium">Location</p>
              <p className="text-sm font-semibold text-slate-800 mt-1">
                {profile?.city ? `${profile?.city}, ${profile?.province}` : 'N/A'}
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}