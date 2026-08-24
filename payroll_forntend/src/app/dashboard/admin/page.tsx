export default function DashboardPage() {
  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-gray-900">Admin Dashboard</h1>
      
      {/* Metrics Row */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="p-6 bg-white rounded-lg shadow-sm border border-gray-200">
          <p className="text-sm text-gray-500">Total Active Employees</p>
          <p className="text-3xl font-semibold mt-2">--</p>
        </div>
        <div className="p-6 bg-white rounded-lg shadow-sm border border-gray-200">
          <p className="text-sm text-gray-500">Pending Approvals</p>
          <p className="text-3xl font-semibold mt-2 text-amber-600">--</p>
        </div>
        <div className="p-6 bg-white rounded-lg shadow-sm border border-gray-200">
          <p className="text-sm text-gray-500">Estimated Monthly Payout</p>
          <p className="text-3xl font-semibold mt-2 text-emerald-600">--</p>
        </div>
      </div>
    </div>
  );
}