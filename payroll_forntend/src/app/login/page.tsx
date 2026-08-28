'use client';

import { useState } from 'react';
import Cookies from 'js-cookie';
import api from '@/lib/api';

export default function LoginPage() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    try {
      // 1. Send Login Request
      const response = await api.post('/auth/login/', { username, password });
      
      const { access, refresh } = response.data;

      // 2. Save Tokens
      localStorage.setItem('access_token', access);
      localStorage.setItem('refresh_token', refresh);
      Cookies.set('access_token', access, { expires: 1 });
      Cookies.set('refresh_token', refresh, { expires: 7 });

      // 3. Fetch Logged-in User Profile (Role detect karne ke liye)
      const userRes = await api.get('/auth/me/', {
        headers: { Authorization: `Bearer ${access}` },
      });

      const role = userRes.data.role;

      // 4. Single Form Role-Based Dynamic Routing
      if (role === 'ADMIN') {
        window.location.href = '/dashboard/admin';
      } else if (role === 'HR') {
        window.location.href = '/dashboard/hr';
      } else {
        window.location.href = '/dashboard/employee';
      }

    } catch (err: any) {
      setError(err.response?.data?.detail || 'Invalid credentials. Please try again.');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <form onSubmit={handleLogin} className="bg-white p-8 rounded-lg shadow-md w-96 space-y-4">
        <h2 className="text-2xl font-bold text-center text-gray-800">System Portal Login</h2>
        {error && <p className="text-red-500 text-sm text-center">{error}</p>}
        <div>
          <label className="block text-sm font-medium text-gray-700">Username</label>
          <input
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            className="w-full border rounded p-2 mt-1 focus:ring-2 focus:ring-blue-500 outline-none"
            required
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">Password</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full border rounded p-2 mt-1 focus:ring-2 focus:ring-blue-500 outline-none"
            required
          />
        </div>
        <button type="submit" className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700 font-medium">
          Sign In
        </button>
      </form>
    </div>
  );
}