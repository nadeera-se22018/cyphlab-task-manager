'use client';

import { useEffect, useState } from 'react';
import { Folder, ListTodo, CheckCircle2 } from 'lucide-react';
import api from '../../lib/axios';

export default function DashboardPage() {
  const [stats, setStats] = useState({
    projects: 0,
    activeTasks: 0,
    completedTasks: 0,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const projectsRes = await api.get('/projects');
        const projectsList = projectsRes.data || [];
        const projectCount = projectsList.length;

        const tasksPromises = projectsList.map((p) =>
          api.get(`/tasks/project/${p.id}`).catch(() => ({ data: [] }))
        );
        const tasksResponses = await Promise.all(tasksPromises);
        const allTasks = tasksResponses.flatMap((res) => res.data || []);

        const activeCount = allTasks.filter(
          (t) => t.status === 'IN_PROGRESS' || t.status === 'TODO'
        ).length;
        const completedCount = allTasks.filter((t) => t.status === 'DONE').length;

        setStats({
          projects: projectCount,
          activeTasks: activeCount,
          completedTasks: completedCount,
        });
      } catch (err) {
        setStats({
          projects: 0,
          activeTasks: 0,
          completedTasks: 0,
        });
      } finally {
        setLoading(false);
      }
    };
    fetchStats();
  }, []);

  return (
    <div className="max-w-6xl mx-auto space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Welcome to your Dashboard</h1>
        <p className="text-gray-500 mt-2">Here is a quick overview of your workspace statistics.</p>
      </div>

      <div className="grid grid-cols-1 gap-6 sm:grid-cols-3">
        <div className="bg-white p-6 rounded-lg border border-gray-200 shadow-sm flex items-center gap-4">
          <div className="p-3 bg-indigo-50 text-indigo-600 rounded-lg">
            <Folder className="h-6 w-6" />
          </div>
          <div>
            <p className="text-sm font-medium text-gray-500">Total Projects</p>
            <p className="text-2xl font-bold text-gray-900">{loading ? '...' : stats.projects}</p>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg border border-gray-200 shadow-sm flex items-center gap-4">
          <div className="p-3 bg-amber-50 text-amber-600 rounded-lg">
            <ListTodo className="h-6 w-6" />
          </div>
          <div>
            <p className="text-sm font-medium text-gray-500">Active Tasks</p>
            <p className="text-2xl font-bold text-gray-900">{loading ? '...' : stats.activeTasks}</p>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg border border-gray-200 shadow-sm flex items-center gap-4">
          <div className="p-3 bg-emerald-50 text-emerald-600 rounded-lg">
            <CheckCircle2 className="h-6 w-6" />
          </div>
          <div>
            <p className="text-sm font-medium text-gray-500">Completed Tasks</p>
            <p className="text-2xl font-bold text-gray-900">{loading ? '...' : stats.completedTasks}</p>
          </div>
        </div>
      </div>
    </div>
  );
}
