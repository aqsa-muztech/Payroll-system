'use client';

import { useRouter } from 'next/navigation';
import Cookies from 'js-cookie';
import { LogOut } from 'lucide-react';

export default function LogoutButton() {
  const router = useRouter();

  const handleLogout = () => {
    // Clear auth tokens
    Cookies.remove('access_token');
    Cookies.remove('refresh_token');

    // Redirect to login page
    router.push('/login');
  };

  return (
    <button
      onClick={handleLogout}
      className="flex items-center gap-2 w-full p-2 text-sm font-medium text-red-400 hover:bg-slate-800 rounded transition-colors"
    >
      <LogOut size={16} />
      <span>Logout</span>
    </button>
  );
}