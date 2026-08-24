import React from 'react';
import LogoutButton from '@/components/LogoutButton';
import { User, FileText, Clock, DollarSign } from 'lucide-react';

export default function EmployeeDashboardLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-screen bg-slate-50">
      {/* Sidebar */}
      <aside className="w-64 bg-indigo-950 text-white p-6 flex flex-col justify-between">
        <div className="space-y-6">
          <div>
            <h1 className="text-xl font-bold tracking-wider text-indigo-200">PAYROLL SYSTEM</h1>
            <p className="text-xs text-indigo-400 mt-1">Employee Portal</p>
          </div>
          
          <nav className="space-y-2 text-sm">
            <a href="/dashboard/employee" className="flex items-center gap-3 p-2.5 rounded bg-indigo-900 font-medium text-white">
              <User size={18} /> Overview
            </a>
            <a href="/dashboard/employee/payslips" className="flex items-center gap-3 p-2.5 rounded hover:bg-indigo-900/50 text-indigo-200 transition-colors">
              <FileText size={18} /> My Payslips
            </a>
            <a href="/dashboard/employee/reimbursements" className="flex items-center gap-3 p-2.5 rounded hover:bg-indigo-900/50 text-indigo-200 transition-colors">
              <DollarSign size={18} /> Reimbursements
            </a>
            <a href="/dashboard/employee/attendance" className="flex items-center gap-3 p-2.5 rounded hover:bg-indigo-900/50 text-indigo-200 transition-colors">
              <Clock size={18} /> Attendance
            </a>
          </nav>
        </div>

        {/* Logout */}
        <div className="border-t border-indigo-900 pt-4">
          <LogoutButton />
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 p-8">
        {children}
      </main>
    </div>
  );
}