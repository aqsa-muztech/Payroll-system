// app/dashboard/page.tsx

'use client';

import { useEffect, useState } from 'react';
import api from '@/lib/api'; // Maintain this import as is
import { 
  Plus, 
  Trash2, 
  Search, 
  Mail, 
  Bell, 
  LogOut, 
  HelpCircle,
  Home,
  LayoutGrid,
  Users,
  CircleDollarSign,
  CalendarClock,
  BarChart3,
  Settings,
  ChevronDown,
  Download,
  Printer,
  ChevronRight,
} from 'lucide-react';

// --- Types (Maintained) ---
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

// --- Sub-Components for Organization ---

const MainHeader = () => (
  <header className="sticky top-0 z-10 bg-white border-b border-gray-100 flex items-center justify-between px-6 py-3">
    <div className="flex items-center gap-1.5">
      <div className="w-6 h-6 rounded-full border-2 border-peopleops flex items-center justify-center">
        <div className="w-3 h-3 rounded-full bg-peopleops" />
      </div>
      <h1 className="text-xl font-semibold text-[#1F2D3D]">
        <span className="font-light">People</span>Ops
      </h1>
    </div>
    
    <div className="flex-1 max-w-sm ml-8 relative">
      <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
      <input 
        type="search" 
        placeholder="Search..." 
        className="w-full pl-10 pr-10 py-2 border border-gray-100 rounded-full bg-gray-50 text-sm focus:border-peopleops/50 focus:ring-1 focus:ring-peopleops/20 outline-none" 
      />
      <div className="absolute right-3 top-1/2 -translate-y-1/2 bg-gray-100 p-1.5 rounded-full cursor-pointer">
        <ChevronDown size={14} className="text-gray-500" />
      </div>
    </div>

    <div className="flex items-center gap-5">
      <span className="text-xs text-gray-500 font-medium">Your trial expires in 3 day(s). <a href="#" className="text-peopleops underline">Upgrade!</a></span>
      <span className="text-xs text-gray-500">Wednesday, 3 April, 2026</span>
      <span className="text-xs font-bold text-red-500 bg-red-100 px-2 py-0.5 rounded">1:49 PM</span>
      <Mail className="text-gray-400 cursor-pointer" size={20} />
      <div className="relative cursor-pointer">
        <Bell className="text-gray-400" size={20} />
        <span className="absolute -top-1.5 -right-1.5 w-4 h-4 bg-red-500 rounded-full text-[10px] text-white flex items-center justify-center font-bold">3</span>
      </div>
      <a href="/logout" className="text-sm font-medium text-peopleops hover:underline">Log Out</a>
      <div className="w-10 h-10 rounded-full bg-[#1F2D3D] text-white flex items-center justify-center font-bold text-lg border border-white ring-2 ring-gray-100">A</div>
    </div>
  </header>
);

const SidebarItem = ({ icon: Icon, label, active = false, hasArrow = true }: { icon: any, label: string, active?: boolean, hasArrow?: boolean }) => (
  <div className={`flex items-center gap-3.5 px-4 py-2.5 rounded-r-lg cursor-pointer ${active ? 'bg-peopleops/20 border-l-4 border-peopleops ml-[-4px]' : 'hover:bg-peopleops/10'}`}>
    <Icon className={`${active ? 'text-white' : 'text-gray-300'}`} size={20} />
    <span className={`text-sm font-medium flex-1 ${active ? 'text-white' : 'text-gray-300'}`}>{label}</span>
    {hasArrow && <ChevronDown size={16} className={`${active ? 'text-white' : 'text-gray-600'}`} />}
  </div>
);

const OrganizationSidebar = () => (
  <aside className="fixed left-0 top-[69px] h-[calc(100vh-69px)] w-60 bg-peopleops-dark text-white p-6 pt-10 flex flex-col justify-between">
    <nav className="space-y-4">
      <SidebarItem icon={Home} label="Home" hasArrow={false} />
      <SidebarItem icon={LayoutGrid} label="Dashboard" />
      <SidebarItem icon={Users} label="Employees" />
      <SidebarItem icon={CircleDollarSign} label="Payroll" active />
      <SidebarItem icon={CalendarClock} label="Leave/Presence" />
      <SidebarItem icon={BarChart3} label="Reports" />
      <SidebarItem icon={Settings} label="Administration" />
    </nav>
    
    <div className="space-y-2.5 mb-10">
      <a href="/help" className="flex items-center gap-3 px-4 py-2 text-sm text-gray-300 hover:text-white hover:bg-peopleops/10 rounded-lg">
        <HelpCircle size={18} /> Help
      </a>
      <a href="/logout" className="flex items-center gap-3 px-4 py-2 text-sm text-gray-300 hover:text-white hover:bg-peopleops/10 rounded-lg">
        <LogOut size={18} /> Log Out
      </a>
    </div>
  </aside>
);

const PageFooter = () => (
  <footer className="bg-white p-6 mt-12 rounded-xl flex items-center justify-between border border-gray-100">
    <div className="flex gap-4">
      {/* {[Twitter, Facebook, Linkedin].map((Icon, idx) => (
        <a key={idx} href="#" className="w-8 h-8 rounded-full border border-gray-100 text-gray-400 flex items-center justify-center hover:bg-gray-50 hover:text-peopleops">
          <Icon size={18} />
        </a>
      ))} */}
    </div>
    <div className="text-xs text-gray-500 font-medium flex gap-2 items-center">
      <span className="p-1 rounded bg-gray-100 border border-gray-200 text-gray-400 font-bold">C</span>
      2026, Payroll Portal Pvt. Ltd. All Rights Reserved.
    </div>
  </footer>
);

// --- Main Dashboard Component (Re-Styled) ---

export default function SuperAdminDashboard() {
  const [organizations, setOrganizations] = useState<Organization[]>([]);
  const [orgName, setOrgName] = useState('');
  const [orgSlug, setOrgSlug] = useState('');
  const [founders, setFounders] = useState<Founder[]>([{ ...EMPTY_FOUNDER }]);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [organizationsLoading, setOrganizationsLoading] = useState(true);

  const fetchOrganizations = async () => {
    try {
      setOrganizationsLoading(true);
      const res = await api.get('/admin/organizations/');
      // (Maintain user's response logic)
      let organizationData: Organization[] = [];
      if (Array.isArray(res.data)) organizationData = res.data;
      else if (Array.isArray(res.data?.organizations)) organizationData = res.data.organizations;
      else if (Array.isArray(res.data?.results)) organizationData = res.data.results;
      else if (Array.isArray(res.data?.data)) organizationData = res.data.data;
      setOrganizations(organizationData);
    } catch (err: any) {
      console.error('Failed to fetch organizations:', err);
      setOrganizations([]);
      setError(err?.response?.data?.error || 'Failed to load organizations.');
    } finally {
      setOrganizationsLoading(false);
    }
  };

  useEffect(() => {
    fetchOrganizations();
  }, []);

  const handleAddFounder = () => { if (founders.length < MAX_FOUNDERS) setFounders((prev) => [...prev, { ...EMPTY_FOUNDER }]); };
  const handleRemoveFounder = (index: number) => { if (founders.length > 1) setFounders((prev) => prev.filter((_, idx) => idx !== index)); };
  const handleFounderChange = (index: number, field: keyof Founder, value: string) => {
    setFounders((prev) => prev.map((founder, idx) => idx === index ? { ...founder, [field]: value, } : founder ));
  };
  const handleOrganizationNameChange = (value: string) => {
    setOrgName(value);
    setOrgSlug(value.toLowerCase().trim().replace(/[^a-z0-9\s-]/g, '').replace(/\s+/g, '-').replace(/-+/g, '-'));
  };

  const handleCreateOrg = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setMessage(''); setError(''); setLoading(true);
    try {
      const payload = { org_name: orgName.trim(), org_slug: orgSlug.trim(), admins: founders };
      await api.post('/admin/organizations/create/', payload);
      setMessage(`Organization "${orgName}" created successfully with ${founders.length} Founder(s)!`);
      // Reset form
      setOrgName(''); setOrgSlug(''); setFounders([{ ...EMPTY_FOUNDER }]);
      await fetchOrganizations();
    } catch (err: any) {
      const backendError = err?.response?.data?.error || err?.response?.data?.detail || err?.response?.data?.message;
      setError(backendError || 'Failed to create organization. Please try again.');
    } finally { setLoading(false); }
  };

  return (
    <div className="min-h-screen bg-slate-100 text-[#1F2D3D]">
      <MainHeader />
      <OrganizationSidebar />

      <main className="ml-60 p-6 lg:p-10 space-y-10">
        
        {/* Breadcrumbs and Actions */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-1.5 text-xs text-gray-500 font-medium">
            <span>Platform</span>
            <ChevronRight size={14} className="text-gray-400" />
            <span>Admin</span>
            <ChevronRight size={14} className="text-gray-400" />
            <span>Control Center</span>
            <ChevronRight size={14} className="text-gray-400" />
            <span className="text-gray-900 bg-white px-2 py-0.5 rounded border border-gray-100 shadow-inner">Organization Manager</span>
          </div>
          <div className="flex items-center gap-3">
            {[Download, Printer, Mail].map((Icon, idx) => (
              <button key={idx} className="w-10 h-10 bg-white rounded-lg text-gray-400 flex items-center justify-center border border-gray-100 hover:text-peopleops hover:bg-gray-50">
                <Icon size={18} />
              </button>
            ))}
          </div>
        </div>

        {/* --- Content Area --- */}
        <div className="bg-white p-10 rounded-3xl border border-gray-100 shadow-sm space-y-12">
          
          {/* Section Header */}
          <div className="flex items-start justify-between border-b border-gray-100 pb-8">
            <div className="space-y-1">
              <h1 className="text-3xl font-extrabold text-[#1F2D3D]">
                Platform Control Center
              </h1>
              <p className="text-sm text-gray-500 max-w-xl">
                Onboard organizations, manage co-founders, and monitor active statuses from this central module. All entries require validated co-founder details.
              </p>
            </div>
            <div className="text-right flex items-center gap-3">
              <Plus size={32} className="text-peopleops bg-peopleops-light p-1 rounded-lg" />
              <div>
                <p className="text-xs text-gray-500 font-medium">Create and Manage</p>
                <p className="text-xl font-bold text-[#1F2D3D]">Organization Records</p>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
            
            {/* ==========================================
                CREATE ORGANIZATION FORM
            ========================================== */}
            <div className="bg-gray-50 border border-gray-100 p-8 rounded-2xl space-y-6 lg:col-span-1 shadow-inner">
              <div className="pb-4 border-b border-gray-100">
                <h2 className="text-lg font-bold text-[#1F2D3D]">Onboard Company</h2>
                <p className="text-xs text-gray-500 mt-1">
                  Create a company and assign up to 5 co-founders.
                </p>
              </div>

              {/* Status Messages */}
              {message && (
                <div className="p-3 text-xs bg-emerald-100 border border-emerald-200 text-emerald-800 rounded-lg font-medium">
                  {message}
                </div>
              )}
              {error && (
                <div className="p-3 text-xs bg-red-100 border border-red-200 text-red-800 rounded-lg font-medium">
                  {error}
                </div>
              )}

              <form onSubmit={handleCreateOrg} className="space-y-6">
                
                {/* Basic Details */}
                <div className="space-y-4">
                  <div>
                    <label className="block text-xs font-semibold text-gray-500 mb-1.5 uppercase tracking-wide">Company Name *</label>
                    <input 
                      type="text" required value={orgName} onChange={(e) => handleOrganizationNameChange(e.target.value)} 
                      placeholder="Enter company name" 
                      className="w-full bg-white border border-gray-100 focus:border-peopleops focus:ring-1 focus:ring-peopleops/20 outline-none rounded-lg px-4 py-2.5 text-sm" 
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-gray-500 mb-1.5 uppercase tracking-wide">Slug Identifier *</label>
                    <input 
                      type="text" required value={orgSlug} onChange={(e) => setOrgSlug(e.target.value)} 
                      placeholder="company-slug" 
                      className="w-full bg-white border border-gray-100 focus:border-peopleops focus:ring-1 focus:ring-peopleops/20 outline-none rounded-lg px-4 py-2.5 text-sm font-mono text-xs" 
                    />
                  </div>
                </div>

                {/* Co-Founders */}
                <div className="space-y-4 pt-4 border-t border-gray-100">
                  <div className="flex justify-between items-center">
                    <h3 className="font-bold text-sm text-[#1F2D3D]">Co-Founders <span className="text-gray-400 font-medium text-xs">({founders.length}/{MAX_FOUNDERS})</span></h3>
                    {founders.length < MAX_FOUNDERS && (
                      <button type="button" onClick={handleAddFounder} className="flex items-center gap-1.5 text-xs text-peopleops hover:text-peopleops-dark font-medium">
                        <Plus size={14} /> Add Founder
                      </button>
                    )}
                  </div>

                  {founders.map((founder, index) => (
                    <div key={index} className="border border-gray-100 p-4 rounded-xl bg-white shadow-sm space-y-3 relative">
                      <div className="flex justify-between items-center pb-2 border-b border-gray-100">
                        <span className={`font-bold text-[10px] uppercase tracking-wider px-2 py-0.5 rounded ${index === 0 ? 'bg-peopleops text-white' : 'bg-gray-100 text-gray-600'}`}>
                          {index === 0 ? 'Primary / CEO' : `Co-Founder #${index + 1}`}
                        </span>
                        {founders.length > 1 && (
                          <button type="button" onClick={() => handleRemoveFounder(index)} className="text-red-300 hover:text-red-500" title="Remove founder">
                            <Trash2 size={14} />
                          </button>
                        )}
                      </div>
                      
                      <div className="grid grid-cols-2 gap-3">
                        <input type="text" placeholder="Username *" required value={founder.username} onChange={(e) => handleFounderChange(index, 'username', e.target.value)} className="w-full bg-gray-50 border border-gray-100 focus:border-peopleops rounded-md px-3 py-1.5 text-xs" />
                        <input type="password" placeholder="Password *" required value={founder.password} onChange={(e) => handleFounderChange(index, 'password', e.target.value)} className="w-full bg-gray-50 border border-gray-100 focus:border-peopleops rounded-md px-3 py-1.5 text-xs" />
                      </div>
                      <input type="email" placeholder="Email Address" value={founder.email} onChange={(e) => handleFounderChange(index, 'email', e.target.value)} className="w-full bg-gray-50 border border-gray-100 focus:border-peopleops rounded-md px-3 py-1.5 text-xs" />
                    </div>
                  ))}
                </div>

                <button type="submit" disabled={loading} className="w-full bg-peopleops hover:bg-peopleops-dark disabled:bg-peopleops/60 text-white font-bold py-3 rounded-lg transition-colors text-sm flex items-center justify-center gap-2">
                  {loading ? 'Creating Company...' : `Provision Company & ${founders.length} Founder${founders.length > 1 ? 's' : ''}`}
                </button>
              </form>
            </div>

            {/* ==========================================
                ORGANIZATION LIST TABLE
            ========================================== */}
            <div className="lg:col-span-2 space-y-6">
              
              {/* List Header */}
              <div className="flex justify-between items-center">
                <h2 className="text-xl font-bold text-[#1F2D3D]">Onboarded Organizations</h2>
                <div className="flex items-center gap-4">
                  <p className="text-xs text-gray-500 font-medium">
                    Total: <span className="text-lg font-bold text-[#1F2D3D]">{organizations.length}</span> active records
                  </p>
                  <button onClick={fetchOrganizations} disabled={organizationsLoading} className="text-xs text-peopleops hover:underline disabled:opacity-50 font-medium">
                    {organizationsLoading ? 'Loading...' : 'Refresh'}
                  </button>
                </div>
              </div>

              {/* The Table */}
              <div className="overflow-x-auto rounded-xl border border-gray-100">
                <table className="w-full text-left text-sm border-collapse">
                  <thead>
                    <tr className="border-b border-gray-100 bg-gray-50 text-xs text-gray-500 uppercase tracking-wider font-semibold">
                      <th className="px-6 py-4">Company Name</th>
                      <th className="px-6 py-4">Slug Identifier</th>
                      <th className="px-6 py-4">Status</th>
                      <th className="px-6 py-4 text-center">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100 text-[#1F2D3D]">
                    {organizationsLoading ? (
                      <tr>
                        <td colSpan={4} className="px-6 py-12 text-center text-xs text-gray-500 font-medium">
                          Loading organization database...
                        </td>
                      </tr>
                    ) : organizations.length === 0 ? (
                      <tr>
                        <td colSpan={4} className="px-6 py-12 text-center text-xs text-gray-500 font-medium">
                          No organizations found. Use the form to onboard a company.
                        </td>
                      </tr>
                    ) : (
                      organizations.map((org) => (
                        <tr key={org.id} className="hover:bg-peopleops-light transition-colors group">
                          <td className="px-6 py-5 font-bold">{org.name}</td>
                          <td className="px-6 py-5 font-mono text-xs text-gray-500 bg-white group-hover:bg-peopleops-light rounded shadow-inner-white">{org.slug}</td>
                          <td className="px-6 py-5">
                            <span className="inline-flex items-center gap-1.5 px-3 py-1 text-xs font-bold bg-emerald-50 text-emerald-800 rounded-full border border-emerald-100 shadow-inner">
                              <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
                              {org.status || 'Active'}
                            </span>
                          </td>
                          <td className="px-6 py-5 text-center">
                            <button className="text-xs text-peopleops font-medium hover:underline">View</button>
                            <span className="text-gray-300 mx-2">|</span>
                            <button className="text-xs text-gray-400 font-medium hover:text-red-500">Archive</button>
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

        <PageFooter />
      </main>
    </div>
  );
}