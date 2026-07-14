'use client';

import Cookies from 'js-cookie';
import { useRouter } from 'next/navigation';
import { LogOut } from 'lucide-react';

export default function Navbar() {
  const router = useRouter();

  const handleLogout = () => {
    Cookies.remove('token');
    router.push('/login');
  };

  return (
    <header className="flex h-16 items-center justify-between border-b border-gray-200 bg-white px-6">
      <div className="flex items-center">
        <h1 className="text-xl font-bold text-gray-900">Task Manager</h1>
      </div>
      <button
        onClick={handleLogout}
        className="flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium text-gray-700 hover:bg-gray-100 hover:text-gray-900"
      >
        <LogOut className="h-5 w-5" />
        <span>Logout</span>
      </button>
    </header>
  );
}
