//app/dashboard/org-admin/page.tsx

'use client';

import { useState, useEffect } from 'react';
import api from '@/lib/api';
import { UserPlus, Building2, Users, DollarSign } from 'lucide-react';

export default function OrgAdminDashboard() {
  const [profile, setProfile] = useState<any>(null);
  const [employees, setEmployees] = useState<any[]>([]);
  const [activeTab, setActiveTab] = useState<'employees' | 'add_employee'>('employees');
  
  // Employee Creation Form State matching Backend Serializer
  const [employeeForm, setEmployeeForm] = useState({
    email: '',
    password: '',
    first_name: '',
    last_name: '',
    org_emp_code: '',
    designation: '',
    band: '',
    department: '',
    manager_name: '',
    dob: '',
    gender: 'Male',
    father_husband_name: '',
    cnic: '',
    city: '',
    province: '',
    doj: '',
    gross_salary: '',
  });

  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  // Fetch Profile & Employees List
  useEffect(() => {
    fetchProfile();
    fetchEmployees();
  }, []);

  const fetchProfile = async () => {
    try {
      const res = await api.get('/client/profile/');
      setProfile(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  const fetchEmployees = async () => {
    try {
      const res = await api.get('/client/employees/');
      setEmployees(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  const handleCreateEmployee = async (e: React.FormEvent) => {
    e.preventDefault();
    setMessage('');
    setError('');

    try {
      const res = await api.post('/client/employees/add/', {
        ...employeeForm,
        gross_salary: parseFloat(employeeForm.gross_salary),
      });

      setMessage(res.data.message || 'Employee onboarded successfully!');
      fetchEmployees(); // Refresh employee list
      setEmployeeForm({
        email: '', password: '', first_name: '', last_name: '',
        org_emp_code: '', designation: '', band: '', department: '',
        manager_name: '', dob: '', gender: 'Male', father_husband_name: '',
        cnic: '', city: '', province: '', doj: '', gross_salary: '',
      });
      setActiveTab('employees');
    } catch (err: any) {
      setError(err.response?.data?.error || 'Failed to onboard employee.');
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
          <h1 className="text-2xl font-bold text-slate-900 mt-2">Payroll & HR Executive Portal</h1>
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

      {/* Action Tabs */}
      <div className="flex gap-4 border-b border-slate-200 pb-2">
        <button
          onClick={() => setActiveTab('employees')}
          className={`flex items-center gap-2 px-4 py-2 text-sm font-medium rounded-lg transition-colors ${
            activeTab === 'employees' ? 'bg-blue-600 text-white' : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-100'
          }`}
        >
          <Users size={16} /> Employees List ({employees.length})
        </button>
        <button
          onClick={() => setActiveTab('add_employee')}
          className={`flex items-center gap-2 px-4 py-2 text-sm font-medium rounded-lg transition-colors ${
            activeTab === 'add_employee' ? 'bg-blue-600 text-white' : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-100'
          }`}
        >
          <UserPlus size={16} /> Onboard New Employee
        </button>
      </div>

      {message && <div className="p-4 text-sm bg-emerald-100 border border-emerald-300 text-emerald-800 rounded-lg">{message}</div>}
      {error && <div className="p-4 text-sm bg-red-100 border border-red-300 text-red-800 rounded-lg">{error}</div>}

      {/* TAB 1: EMPLOYEES LIST */}
      {activeTab === 'employees' && (
        <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
          <div className="p-6 border-b border-slate-200 flex items-center justify-between">
            <h2 className="text-lg font-semibold text-slate-800">Organization Employees</h2>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-slate-600">
              <thead className="bg-slate-100 text-slate-700 uppercase tracking-wider font-semibold">
                <tr>
                  <th className="p-3">Sys Code</th>
                  <th className="p-3">Org Code</th>
                  <th className="p-3">Name</th>
                  <th className="p-3">Email</th>
                  <th className="p-3">Designation</th>
                  <th className="p-3">Department</th>
                  <th className="p-3">DOJ</th>
                  <th className="p-3">Gross Salary</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200">
                {employees.length > 0 ? (
                  employees.map((emp) => (
                    <tr key={emp.id} className="hover:bg-slate-50">
                      <td className="p-3 font-mono text-blue-600 font-semibold">{emp.system_emp_code}</td>
                      <td className="p-3">{emp.org_emp_code || '-'}</td>
                      <td className="p-3 font-medium text-slate-900">{emp.name}</td>
                      <td className="p-3">{emp.email}</td>
                      <td className="p-3">{emp.designation}</td>
                      <td className="p-3">{emp.department}</td>
                      <td className="p-3">{emp.doj}</td>
                      <td className="p-3 font-semibold text-slate-900">
                        PKR {Number(emp.gross_salary).toLocaleString()}
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={8} className="p-6 text-center text-slate-400">
                      No employees onboarded yet.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* TAB 2: ONBOARD NEW EMPLOYEE FORM */}
      {activeTab === 'add_employee' && (
        <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm space-y-6 max-w-4xl">
          <div className="flex items-center gap-2 text-slate-800 border-b border-slate-200 pb-4">
            <UserPlus size={20} className="text-blue-600" />
            <h2 className="text-lg font-semibold">Employee Initial Setup & Salary Particulars</h2>
          </div>

          <form onSubmit={handleCreateEmployee} className="space-y-6 text-xs">
            {/* Account Credentials */}
            <div>
              <h3 className="text-sm font-semibold text-slate-900 mb-3 text-blue-600">Account Credentials</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block font-medium text-slate-700 mb-1">Email *</label>
                  <input
                    type="email"
                    required
                    value={employeeForm.email}
                    onChange={(e) => setEmployeeForm({ ...employeeForm, email: e.target.value })}
                    className="w-full border border-slate-300 rounded p-2 focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="block font-medium text-slate-700 mb-1">Initial Password *</label>
                  <input
                    type="password"
                    required
                    value={employeeForm.password}
                    onChange={(e) => setEmployeeForm({ ...employeeForm, password: e.target.value })}
                    className="w-full border border-slate-300 rounded p-2 focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>
            </div>

            {/* Personal Details */}
            <div>
              <h3 className="text-sm font-semibold text-slate-900 mb-3 text-blue-600">Personal Information</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="block font-medium text-slate-700 mb-1">First Name *</label>
                  <input
                    type="text"
                    required
                    value={employeeForm.first_name}
                    onChange={(e) => setEmployeeForm({ ...employeeForm, first_name: e.target.value })}
                    className="w-full border border-slate-300 rounded p-2 focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="block font-medium text-slate-700 mb-1">Last Name *</label>
                  <input
                    type="text"
                    required
                    value={employeeForm.last_name}
                    onChange={(e) => setEmployeeForm({ ...employeeForm, last_name: e.target.value })}
                    className="w-full border border-slate-300 rounded p-2 focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="block font-medium text-slate-700 mb-1">Father / Husband Name</label>
                  <input
                    type="text"
                    value={employeeForm.father_husband_name}
                    onChange={(e) => setEmployeeForm({ ...employeeForm, father_husband_name: e.target.value })}
                    className="w-full border border-slate-300 rounded p-2 focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="block font-medium text-slate-700 mb-1">CNIC</label>
                  <input
                    type="text"
                    placeholder="42101-XXXXXXX-X"
                    value={employeeForm.cnic}
                    onChange={(e) => setEmployeeForm({ ...employeeForm, cnic: e.target.value })}
                    className="w-full border border-slate-300 rounded p-2 focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="block font-medium text-slate-700 mb-1">DOB (Date of Birth)</label>
                  <input
                    type="date"
                    value={employeeForm.dob}
                    onChange={(e) => setEmployeeForm({ ...employeeForm, dob: e.target.value })}
                    className="w-full border border-slate-300 rounded p-2 focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="block font-medium text-slate-700 mb-1">Gender</label>
                  <select
                    value={employeeForm.gender}
                    onChange={(e) => setEmployeeForm({ ...employeeForm, gender: e.target.value })}
                    className="w-full border border-slate-300 rounded p-2 focus:ring-2 focus:ring-blue-500 bg-white"
                  >
                    <option value="Male">Male</option>
                    <option value="Female">Female</option>
                    <option value="Other">Other</option>
                  </select>
                </div>
                <div>
                  <label className="block font-medium text-slate-700 mb-1">City</label>
                  <input
                    type="text"
                    value={employeeForm.city}
                    onChange={(e) => setEmployeeForm({ ...employeeForm, city: e.target.value })}
                    className="w-full border border-slate-300 rounded p-2 focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="block font-medium text-slate-700 mb-1">Province</label>
                  <input
                    type="text"
                    value={employeeForm.province}
                    onChange={(e) => setEmployeeForm({ ...employeeForm, province: e.target.value })}
                    className="w-full border border-slate-300 rounded p-2 focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>
            </div>

            {/* Organizational Details */}
            <div>
              <h3 className="text-sm font-semibold text-slate-900 mb-3 text-blue-600">Organizational Particulars</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="block font-medium text-slate-700 mb-1">Org Emp Code</label>
                  <input
                    type="text"
                    placeholder="e.g. ACME-001"
                    value={employeeForm.org_emp_code}
                    onChange={(e) => setEmployeeForm({ ...employeeForm, org_emp_code: e.target.value })}
                    className="w-full border border-slate-300 rounded p-2 focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="block font-medium text-slate-700 mb-1">Designation *</label>
                  <input
                    type="text"
                    required
                    value={employeeForm.designation}
                    onChange={(e) => setEmployeeForm({ ...employeeForm, designation: e.target.value })}
                    className="w-full border border-slate-300 rounded p-2 focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="block font-medium text-slate-700 mb-1">Department *</label>
                  <input
                    type="text"
                    required
                    value={employeeForm.department}
                    onChange={(e) => setEmployeeForm({ ...employeeForm, department: e.target.value })}
                    className="w-full border border-slate-300 rounded p-2 focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="block font-medium text-slate-700 mb-1">Band</label>
                  <input
                    type="text"
                    value={employeeForm.band}
                    onChange={(e) => setEmployeeForm({ ...employeeForm, band: e.target.value })}
                    className="w-full border border-slate-300 rounded p-2 focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="block font-medium text-slate-700 mb-1">Manager Name</label>
                  <input
                    type="text"
                    value={employeeForm.manager_name}
                    onChange={(e) => setEmployeeForm({ ...employeeForm, manager_name: e.target.value })}
                    className="w-full border border-slate-300 rounded p-2 focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="block font-medium text-slate-700 mb-1">Date of Joining (DOJ) *</label>
                  <input
                    type="date"
                    required
                    value={employeeForm.doj}
                    onChange={(e) => setEmployeeForm({ ...employeeForm, doj: e.target.value })}
                    className="w-full border border-slate-300 rounded p-2 focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>
            </div>

            {/* Initial Gross Salary Setup */}
            <div>
              <h3 className="text-sm font-semibold text-slate-900 mb-3 text-blue-600">Payroll Setup</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block font-medium text-slate-700 mb-1">Gross Salary (PKR) *</label>
                  <input
                    type="number"
                    required
                    placeholder="200000"
                    value={employeeForm.gross_salary}
                    onChange={(e) => setEmployeeForm({ ...employeeForm, gross_salary: e.target.value })}
                    className="w-full border border-slate-300 rounded p-2 focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>
            </div>

            <button
              type="submit"
              className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 rounded-lg transition-colors text-sm"
            >
              Save Employee & Calculate Salary Breakdown
            </button>
          </form>
        </div>
      )}
    </div>
  );
}