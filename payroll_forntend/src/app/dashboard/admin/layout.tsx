import React from 'react';
import LogoutButton from '@/components/LogoutButton';

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-screen bg-gray-50">
      {/* Sidebar */}
      <aside className="w-64 bg-slate-900 text-white p-6 flex flex-col justify-between">
        <div className="space-y-6">
          <h1 className="text-xl font-bold tracking-wider">PAYROLL SYSTEM</h1>
          <nav className="space-y-2 text-sm">
            <a href="/dashboard/admin" className="block p-2 rounded bg-slate-800 font-medium">Dashboard</a>
            <a href="/dashboard/admin/employees" className="block p-2 rounded hover:bg-slate-800 text-gray-400">Employees</a>
            <a href="/dashboard/admin/payroll" className="block p-2 rounded hover:bg-slate-800 text-gray-400">Payroll Runs</a>
            <a href="/dashboard/admin/settings" className="block p-2 rounded hover:bg-slate-800 text-gray-400">Settings</a>
          </nav>
        </div>

        {/* Logout Section */}
        <div className="border-t border-slate-800 pt-4">
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