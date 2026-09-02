'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { LayoutDashboard, FolderKanban, CheckSquare, Users, Sparkles, Shield } from 'lucide-react';

export default function Sidebar() {
  const pathname = usePathname();

  const links = [
    { name: 'Dashboard', href: '/', icon: LayoutDashboard },
    { name: 'Projects', href: '/projects', icon: FolderKanban },
    { name: 'Tasks', href: '/tasks', icon: CheckSquare },
    { name: 'Users', href: '/users', icon: Users },
  ];

  return (
    <aside className="w-64 border-r border-amber-500/15 bg-[#0A0D14]/90 backdrop-blur-xl flex flex-col h-screen sticky top-0 z-30 transition-all">
      {/* Brand Header */}
      <div className="flex h-20 items-center px-6 border-b border-amber-500/10 gap-3">
        <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-amber-400 via-yellow-500 to-amber-700 flex items-center justify-center shadow-lg shadow-amber-500/20 ring-1 ring-amber-300/40">
          <Sparkles className="h-5 w-5 text-slate-950 fill-slate-950" />
        </div>
        <div>
          <span className="text-xl font-extrabold tracking-wider gold-gradient-text block leading-none">
            CYPHLAB
          </span>
          <span className="text-[10px] uppercase font-semibold tracking-widest text-slate-400 mt-1 block">
            Task Manager
          </span>
        </div>
      </div>

      {/* Navigation Links */}
      <nav className="flex-1 space-y-2 px-4 py-6">
        <div className="px-3 pb-2 text-[11px] font-semibold uppercase tracking-wider text-slate-500">
          Navigation
        </div>
        {links.map((link) => {
          const Icon = link.icon;
          const isActive = pathname === link.href;
          return (
            <Link
              key={link.name}
              href={link.href}
              className={`group flex items-center gap-3.5 rounded-xl px-3.5 py-3 text-sm font-medium transition-all duration-200 ${
                isActive
                  ? 'bg-gradient-to-r from-amber-500/20 via-amber-500/10 to-transparent text-amber-300 border-l-4 border-amber-400 shadow-md shadow-amber-950/20'
                  : 'text-slate-400 hover:text-slate-100 hover:bg-slate-800/40 hover:border-l-4 hover:border-slate-500/40'
              }`}
            >
              <Icon
                className={`h-5 w-5 transition-transform group-hover:scale-110 ${
                  isActive ? 'text-amber-400' : 'text-slate-400 group-hover:text-slate-200'
                }`}
              />
              <span className="tracking-wide">{link.name}</span>
              {isActive && (
                <div className="ml-auto w-1.5 h-1.5 rounded-full bg-amber-400 shadow-[0_0_8px_#f59e0b]" />
              )}
            </Link>
          );
        })}
      </nav>

      {/* Footer Info Badge */}
      <div className="p-4 m-4 rounded-xl border border-amber-500/15 bg-slate-900/50 backdrop-blur-md">
        <div className="flex items-center gap-2 text-xs text-amber-300/90 font-medium">
          <Shield className="h-4 w-4 text-amber-400" />
          <span>Workspace Protected</span>
        </div>
        <p className="text-[11px] text-slate-400 mt-1">Enterprise Grade Security</p>
      </div>
    </aside>
  );
}
