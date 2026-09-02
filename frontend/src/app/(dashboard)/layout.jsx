'use client';

import { useEffect, useSyncExternalStore } from 'react';
import { useRouter } from 'next/navigation';
import Cookies from 'js-cookie';
import Sidebar from '../../components/Sidebar';
import Navbar from '../../components/Navbar';
import Footer from '../../components/Footer';

const subscribe = () => () => {};
const getSnapshot = () => Cookies.get('token') || '';
const getServerSnapshot = () => null;

export default function DashboardLayout({ children }) {
  const router = useRouter();
  const token = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);

  useEffect(() => {
    if (token === null) {
      return;
    }
    if (!token) {
      router.replace('/login');
    }
  }, [token, router]);

  if (token === null || !token) {
    return null;
  }

  return (
    <div className="min-h-screen bg-[#080A0F] text-slate-100 flex w-full relative overflow-x-hidden">
      {/* Ambient background glows */}
      <div className="fixed top-0 left-1/4 w-96 h-96 bg-amber-500/5 rounded-full blur-3xl pointer-events-none" />
      <div className="fixed bottom-0 right-1/4 w-[30rem] h-[30rem] bg-slate-400/5 rounded-full blur-3xl pointer-events-none" />
      
      <Sidebar />
      <div className="flex-1 flex flex-col min-h-screen relative z-10">
        <Navbar />
        <main className="flex-1 p-6 md:p-8 max-w-7xl w-full mx-auto">{children}</main>
        <Footer />
      </div>
    </div>
  );
}
