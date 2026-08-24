'use client';

import { Download, FileText, Calendar, Wallet } from 'lucide-react';

export default function EmployeeDashboardPage() {
  return (
    <div className="space-y-8">
      {/* Welcome Banner */}
      <div className="flex justify-between items-center bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Welcome Back 👋</h1>
          <p className="text-sm text-slate-500 mt-1">Here is a summary of your recent salary records and details.</p>
        </div>
        <button className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white text-sm px-4 py-2.5 rounded-lg transition-colors">
          <Download size={16} /> Latest Payslip (PDF)
        </button>
      </div>

      {/* Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="p-6 bg-white rounded-xl border border-slate-200 shadow-sm flex items-start justify-between">
          <div>
            <p className="text-sm font-medium text-slate-500">Last Net Transfer</p>
            <p className="text-2xl font-bold text-slate-900 mt-2">PKR 472,333</p>
            <p className="text-xs text-emerald-600 mt-1">✓ Disbursed on July 31</p>
          </div>
          <div className="p-3 bg-emerald-50 rounded-lg text-emerald-600">
            <Wallet size={20} />
          </div>
        </div>

        <div className="p-6 bg-white rounded-xl border border-slate-200 shadow-sm flex items-start justify-between">
          <div>
            <p className="text-sm font-medium text-slate-500">Pending Reimbursements</p>
            <p className="text-2xl font-bold text-slate-900 mt-2">PKR 20,000</p>
            <p className="text-xs text-amber-600 mt-1">Under Approval (TA/DA)</p>
          </div>
          <div className="p-3 bg-amber-50 rounded-lg text-amber-600">
            <FileText size={20} />
          </div>
        </div>

        <div className="p-6 bg-white rounded-xl border border-slate-200 shadow-sm flex items-start justify-between">
          <div>
            <p className="text-sm font-medium text-slate-500">Working Days This Month</p>
            <p className="text-2xl font-bold text-slate-900 mt-2">18 / 22</p>
            <p className="text-xs text-slate-500 mt-1">0 Leaves Taken</p>
          </div>
          <div className="p-3 bg-indigo-50 rounded-lg text-indigo-600">
            <Calendar size={20} />
          </div>
        </div>
      </div>

      {/* Recent Payslips Table */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-sm">
        <div className="p-6 border-b border-slate-100 flex justify-between items-center">
          <h2 className="text-lg font-bold text-slate-900">Recent Payslips</h2>
          <a href="/dashboard/employee/payslips" className="text-sm text-indigo-600 font-medium hover:underline">View All</a>
        </div>
        
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-sm">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-100 text-slate-500 font-medium">
                <th className="p-4 pl-6">Pay Period</th>
                <th className="p-4">Gross Salary</th>
                <th className="p-4">Deductions</th>
                <th className="p-4">Net Salary</th>
                <th className="p-4">Status</th>
                <th className="p-4 pr-6 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-slate-700">
              <tr>
                <td className="p-4 pl-6 font-medium text-slate-900">July 2026</td>
                <td className="p-4">PKR 200,000</td>
                <td className="p-4 text-red-600">- PKR 21,000</td>
                <td className="p-4 font-semibold text-slate-900">PKR 472,333</td>
                <td className="p-4"><span className="px-2.5 py-1 bg-emerald-100 text-emerald-800 rounded-full text-xs font-medium">Paid</span></td>
                <td className="p-4 pr-6 text-right">
                  <button className="text-indigo-600 hover:text-indigo-800 font-medium">Download</button>
                </td>
              </tr>
              <tr>
                <td className="p-4 pl-6 font-medium text-slate-900">June 2026</td>
                <td className="p-4">PKR 200,000</td>
                <td className="p-4 text-red-600">- PKR 21,000</td>
                <td className="p-4 font-semibold text-slate-900">PKR 472,333</td>
                <td className="p-4"><span className="px-2.5 py-1 bg-emerald-100 text-emerald-800 rounded-full text-xs font-medium">Paid</span></td>
                <td className="p-4 pr-6 text-right">
                  <button className="text-indigo-600 hover:text-indigo-800 font-medium">Download</button>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}