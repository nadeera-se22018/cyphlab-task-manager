'use client';

import { useEffect, useState } from 'react';
import Cookies from 'js-cookie';
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
    return <div className="text-center py-10 text-gray-600">Loading users...</div>;
  }

  if (error) {
    return (
      <div className="max-w-6xl mx-auto">
        <div className="rounded-lg bg-red-50 border border-red-200 p-6 text-center text-red-700 font-medium">
          {error}
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">User Management</h1>
          <p className="text-gray-500 text-sm mt-1">View and manage team members and system roles</p>
        </div>
      </div>
      <div className="overflow-hidden bg-white shadow sm:rounded-lg border border-gray-200">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Name
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Email
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Role
                </th>
                {isAdmin && (
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                )}
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {users.map((user) => (
                <tr key={user.id}>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                    {user.name}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {user.email}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    <span className={`inline-flex items-center rounded-md px-2 py-1 text-xs font-medium ${user.role === 'ADMIN' ? 'bg-red-50 text-red-700 ring-1 ring-inset ring-red-600/10' :
                        user.role === 'MANAGER' ? 'bg-blue-50 text-blue-700 ring-1 ring-inset ring-blue-700/10' :
                          'bg-green-50 text-green-700 ring-1 ring-inset ring-green-600/20'
                      }`}>
                      {user.role}
                    </span>
                  </td>
                  {isAdmin && (
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 flex items-center gap-4">
                      <select
                        value={user.role}
                        onChange={(e) => handleRoleChange(user.id, e.target.value)}
                        className="rounded-md border border-gray-300 px-2 py-1 text-sm text-gray-700 focus:border-indigo-500 focus:outline-none focus:ring-indigo-500"
                      >
                        <option value="ADMIN">ADMIN</option>
                        <option value="MANAGER">MANAGER</option>
                        <option value="MEMBER">MEMBER</option>
                      </select>
                      <button
                        onClick={() => handleDeleteUser(user.id)}
                        className="rounded bg-red-600 px-3 py-1 text-white hover:bg-red-700 transition-colors"
                      >
                        Delete
                      </button>
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
