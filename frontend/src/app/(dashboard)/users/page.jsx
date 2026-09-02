'use client';

import { useEffect, useState } from 'react';
import Cookies from 'js-cookie';
import { Users, Shield, Trash2, Sparkles, UserCheck } from 'lucide-react';
import api from '../../../lib/axios';

const getUserRoleFromToken = () => {
  try {
    const token = Cookies.get('token');
    if (!token) return null;
    const base64Url = token.split('.')[1];
    if (!base64Url) return null;
    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    const jsonPayload = decodeURIComponent(
      atob(base64)
        .split('')
        .map((c) => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
        .join('')
    );
    return JSON.parse(jsonPayload)?.role || null;
  } catch {
    return null;
  }
};

export default function UsersPage() {
  const [users, setUsers] = useState([]);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);
  const [currentRole, setCurrentRole] = useState(null);

  useEffect(() => {
    setCurrentRole(getUserRoleFromToken());

    const fetchUsers = async () => {
      try {
        const response = await api.get('/users');
        setUsers(response.data);
      } catch (err) {
        setError(err.response?.data?.error || 'Failed to fetch users');
      } finally {
        setLoading(false);
      }
    };

    fetchUsers();
  }, []);

  const handleRoleChange = async (userId, newRole) => {
    try {
      const response = await api.put(`/users/${userId}/role`, { role: newRole });
      setUsers((prevUsers) =>
        prevUsers.map((user) =>
          user.id === userId ? { ...user, role: response.data.role } : user
        )
      );
    } catch (err) {
      alert(err.response?.data?.error || 'Failed to update role');
    }
  };

  const handleDeleteUser = async (userId) => {
    if (!confirm('Are you sure you want to delete this user?')) {
      return;
    }
    try {
      await api.delete(`/users/${userId}`);
      setUsers((prevUsers) => prevUsers.filter((user) => user.id !== userId));
    } catch (err) {
      alert(err.response?.data?.error || 'Failed to delete user');
    }
  };

  const isAdmin = currentRole === 'ADMIN';

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="text-amber-400 font-semibold tracking-wide flex items-center gap-3">
          <Sparkles className="h-5 w-5 animate-spin" />
          <span>Loading Team Directory...</span>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="rounded-xl bg-red-950/40 border border-red-500/30 p-6 text-center text-red-300 font-medium">
        {error}
      </div>
    );
  }

  return (
    <div className="space-y-8 animate-fadeIn">
      {/* Header Banner */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-extrabold tracking-tight text-white">
            User <span className="gold-gradient-text">Management</span>
          </h1>
          <p className="text-slate-400 text-sm mt-1">
            Maintain access privileges, member directories, and security roles.
          </p>
        </div>
        <div className="flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-slate-900 border border-amber-500/20 text-xs font-semibold text-amber-300">
          <Users className="h-4 w-4 text-amber-400" />
          <span>{users.length} Registered Accounts</span>
        </div>
      </div>

      {/* Users Table Container */}
      <div className="glass-card rounded-2xl border border-amber-500/20 overflow-hidden shadow-2xl">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-slate-800">
            <thead className="bg-slate-900/90 border-b border-amber-500/15">
              <tr>
                <th scope="col" className="px-6 py-4 text-left text-xs font-bold text-slate-300 uppercase tracking-wider">
                  Member
                </th>
                <th scope="col" className="px-6 py-4 text-left text-xs font-bold text-slate-300 uppercase tracking-wider">
                  Email
                </th>
                <th scope="col" className="px-6 py-4 text-left text-xs font-bold text-slate-300 uppercase tracking-wider">
                  System Role
                </th>
                {isAdmin && (
                  <th scope="col" className="px-6 py-4 text-left text-xs font-bold text-amber-300 uppercase tracking-wider">
                    Admin Controls
                  </th>
                )}
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60 bg-transparent">
              {users.map((user) => (
                <tr key={user.id} className="hover:bg-slate-800/30 transition-colors">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-amber-400/20 via-yellow-500/10 to-transparent border border-amber-500/30 flex items-center justify-center font-bold text-amber-300 text-sm">
                        {user.name ? user.name.charAt(0).toUpperCase() : 'U'}
                      </div>
                      <div>
                        <div className="text-sm font-bold text-white">{user.name}</div>
                        <div className="text-[11px] text-slate-500 font-mono">ID #{user.id}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-400 font-mono">
                    {user.email}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span
                      className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold tracking-wide uppercase ${
                        user.role === 'ADMIN'
                          ? 'bg-gradient-to-r from-amber-500/20 to-yellow-500/20 text-amber-300 border border-amber-400/40 shadow-[0_0_10px_rgba(245,158,11,0.15)]'
                          : user.role === 'MANAGER'
                          ? 'bg-slate-800 text-slate-200 border border-slate-600'
                          : 'bg-slate-900 text-slate-400 border border-slate-700/50'
                      }`}
                    >
                      {user.role === 'ADMIN' && <Shield className="h-3 w-3 text-amber-400" />}
                      {user.role === 'MANAGER' && <UserCheck className="h-3 w-3 text-slate-300" />}
                      <span>{user.role}</span>
                    </span>
                  </td>
                  {isAdmin && (
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-400">
                      <div className="flex items-center gap-3">
                        <select
                          value={user.role}
                          onChange={(e) => handleRoleChange(user.id, e.target.value)}
                          className="rounded-xl border border-slate-700 bg-slate-900 px-3 py-1.5 text-xs font-semibold text-slate-200 focus:border-amber-400 focus:outline-none focus:ring-1 focus:ring-amber-400/40"
                        >
                          <option value="ADMIN">ADMIN</option>
                          <option value="MANAGER">MANAGER</option>
                          <option value="MEMBER">MEMBER</option>
                        </select>
                        <button
                          onClick={() => handleDeleteUser(user.id)}
                          className="p-1.5 rounded-lg text-slate-500 hover:text-red-400 hover:bg-red-950/40 border border-transparent hover:border-red-500/30 transition-all"
                          title="Delete User"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    </td>
                  )}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
