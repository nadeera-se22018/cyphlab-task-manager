'use client';

import { useEffect, useSyncExternalStore } from 'react';
import { useRouter } from 'next/navigation';
import Cookies from 'js-cookie';
import Sidebar from '../../components/Sidebar';
import Navbar from '../../components/Navbar';

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
    <div className="min-h-full bg-gray-50 text-gray-900 flex w-full">
      <Sidebar />
      <div className="flex-1 flex flex-col min-h-screen">
        <Navbar />
        <main className="flex-1 p-6">{children}</main>
      </div>
    </div>
  );
}
