'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { FolderKanban, ListTodo, CheckCircle2, ArrowUpRight, Plus, Sparkles, TrendingUp } from 'lucide-react';
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

  const totalTasks = stats.activeTasks + stats.completedTasks;
  const completionRate = totalTasks > 0 ? Math.round((stats.completedTasks / totalTasks) * 100) : 0;

  return (
    <div className="space-y-8 animate-fadeIn">
      {/* Hero Welcome Banner */}
      <div className="relative overflow-hidden rounded-2xl glass-card p-8 border border-amber-500/20">
        <div className="absolute -top-24 -right-24 w-72 h-72 bg-gradient-to-br from-amber-500/20 to-yellow-600/5 rounded-full blur-3xl pointer-events-none" />
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-300 text-xs font-semibold tracking-wide uppercase">
              <Sparkles className="h-3.5 w-3.5 text-amber-400" />
              <span>Workspace Intelligence</span>
            </div>
            <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight text-white">
              Executive <span className="gold-gradient-text">Overview</span>
            </h1>
            <p className="text-slate-400 text-sm max-w-xl">
              Track your projects, sprint velocities, and real-time team task completion with precision.
            </p>
          </div>
          <div className="flex items-center gap-3">
            <Link
              href="/projects"
              className="gold-btn inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-semibold tracking-wide"
            >
              <Plus className="h-4 w-4" />
              <span>New Project</span>
            </Link>
            <Link
              href="/tasks"
              className="silver-btn inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-medium"
            >
              <span>View Tasks</span>
              <ArrowUpRight className="h-4 w-4" />
            </Link>
          </div>
        </div>
      </div>

      {/* Metric Cards Grid */}
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-3">
        {/* Total Projects Card */}
        <div className="glass-card rounded-2xl p-6 border border-amber-500/20 hover:border-amber-400/40 transition-all duration-300 group">
          <div className="flex items-center justify-between mb-4">
            <span className="text-xs font-semibold uppercase tracking-wider text-slate-400">Total Projects</span>
            <div className="p-3 rounded-xl bg-gradient-to-br from-amber-500/20 to-amber-600/10 text-amber-400 border border-amber-500/20 group-hover:scale-110 transition-transform">
              <FolderKanban className="h-6 w-6" />
            </div>
          </div>
          <div className="space-y-1">
            <div className="text-3xl font-extrabold text-white">
              {loading ? <span className="text-slate-600 animate-pulse">---</span> : stats.projects}
            </div>
            <p className="text-xs text-amber-400/80 font-medium">Active workspaces running</p>
          </div>
        </div>

        {/* Active Tasks Card */}
        <div className="glass-card-silver rounded-2xl p-6 border border-slate-700/60 hover:border-slate-500/80 transition-all duration-300 group">
          <div className="flex items-center justify-between mb-4">
            <span className="text-xs font-semibold uppercase tracking-wider text-slate-400">Active Tasks</span>
            <div className="p-3 rounded-xl bg-slate-800/80 text-slate-200 border border-slate-700 group-hover:scale-110 transition-transform">
              <ListTodo className="h-6 w-6" />
            </div>
          </div>
          <div className="space-y-1">
            <div className="text-3xl font-extrabold silver-gradient-text">
              {loading ? <span className="text-slate-600 animate-pulse">---</span> : stats.activeTasks}
            </div>
            <p className="text-xs text-slate-400 font-medium">Pending & In Progress</p>
          </div>
        </div>

        {/* Completed Tasks Card */}
        <div className="glass-card rounded-2xl p-6 border border-amber-500/20 hover:border-amber-400/40 transition-all duration-300 group">
          <div className="flex items-center justify-between mb-4">
            <span className="text-xs font-semibold uppercase tracking-wider text-slate-400">Completed Tasks</span>
            <div className="p-3 rounded-xl bg-gradient-to-br from-yellow-500/20 to-amber-600/10 text-yellow-400 border border-yellow-500/20 group-hover:scale-110 transition-transform">
              <CheckCircle2 className="h-6 w-6" />
            </div>
          </div>
          <div className="space-y-1">
            <div className="text-3xl font-extrabold text-white">
              {loading ? <span className="text-slate-600 animate-pulse">---</span> : stats.completedTasks}
            </div>
            <p className="text-xs text-yellow-400/80 font-medium">Successfully delivered</p>
          </div>
        </div>
      </div>

      {/* Completion Progress Bar Widget */}
      <div className="glass-card rounded-2xl p-6 border border-amber-500/15">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <TrendingUp className="h-5 w-5 text-amber-400" />
            <span className="text-sm font-bold text-slate-200">Overall Task Velocity</span>
          </div>
          <span className="text-sm font-extrabold gold-gradient-text">
            {completionRate}% Completed
          </span>
        </div>
        <div className="w-full h-3 bg-slate-900 rounded-full overflow-hidden border border-slate-800 p-0.5">
          <div
            className="h-full rounded-full bg-gradient-to-r from-amber-500 via-yellow-400 to-amber-600 transition-all duration-700 shadow-[0_0_12px_rgba(245,158,11,0.5)]"
            style={{ width: `${completionRate}%` }}
          />
        </div>
      </div>
    </div>
  );
}
