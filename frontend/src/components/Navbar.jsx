'use client';

import Cookies from 'js-cookie';
import { useRouter } from 'next/navigation';
import { LogOut, Bell, UserCircle } from 'lucide-react';

export default function Navbar() {
  const router = useRouter();

  const handleLogout = () => {
    Cookies.remove('token');
    router.push('/login');
  };

  return (
    <header className="flex h-20 items-center justify-between border-b border-amber-500/10 bg-[#0A0D14]/80 backdrop-blur-xl px-8 sticky top-0 z-20">
      <div className="flex items-center gap-3">
        <div className="flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse shadow-[0_0_8px_#34d399]" />
          <span className="text-xs uppercase tracking-wider font-semibold text-slate-400">
            System Online
          </span>
        </div>
      </div>

      <div className="flex items-center gap-4">
        {/* Notifications Icon */}
        <button
          type="button"
          aria-label="Notifications"
          className="p-2.5 rounded-xl text-slate-400 hover:text-amber-300 hover:bg-slate-800/60 border border-transparent hover:border-amber-500/20 transition-all"
        >
          <Bell className="h-5 w-5" />
        </button>

        {/* User Profile Pill */}
        <div className="flex items-center gap-2.5 px-3 py-1.5 rounded-xl bg-slate-900/60 border border-slate-700/50">
          <UserCircle className="h-6 w-6 text-amber-400" />
          <span className="text-xs font-medium text-slate-200">Logged In</span>
        </div>

        {/* Logout Button */}
        <button
          onClick={handleLogout}
          className="silver-btn flex items-center gap-2 rounded-xl px-4 py-2 text-sm font-medium transition-all duration-200"
        >
          <LogOut className="h-4 w-4 text-slate-400 group-hover:text-white" />
          <span>Logout</span>
        </button>
      </div>
    </header>
  );
}
