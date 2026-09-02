'use client';

import { useEffect, useState } from 'react';
import { CheckSquare, Plus, FolderKanban, Sparkles, Clock, CheckCircle2, User } from 'lucide-react';
import api from '../../../lib/axios';

export default function TasksPage() {
  const [projects, setProjects] = useState([]);
  const [selectedProjectId, setSelectedProjectId] = useState('');
  const [tasks, setTasks] = useState([]);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [assigneeId, setAssigneeId] = useState('');
  const [loadingProjects, setLoadingProjects] = useState(true);
  const [loadingTasks, setLoadingTasks] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const response = await api.get('/projects');
        setProjects(response.data);
      } catch (err) {
        setError(err.response?.data?.error || 'Failed to fetch projects');
      } finally {
        setLoadingProjects(false);
      }
    };
    fetchProjects();
  }, []);

  const handleProjectChange = async (projectId) => {
    setSelectedProjectId(projectId);
    if (!projectId) {
      setTasks([]);
      return;
    }
    setLoadingTasks(true);
    try {
      const response = await api.get(`/tasks/project/${projectId}`);
      setTasks(response.data);
    } catch (err) {
      alert(err.response?.data?.error || 'Failed to fetch tasks');
    } finally {
      setLoadingTasks(false);
    }
  };

  const handleCreateTask = async (e) => {
    e.preventDefault();
    if (!title || !selectedProjectId) {
      return;
    }
    const payload = {
      title,
      description,
      projectId: parseInt(selectedProjectId),
    };
    if (assigneeId) {
      payload.assigneeId = parseInt(assigneeId);
    }
    try {
      const response = await api.post('/tasks', payload);
      setTasks((prev) => [...prev, response.data]);
      setTitle('');
      setDescription('');
      setAssigneeId('');
    } catch (err) {
      alert(err.response?.data?.error || 'Failed to create task');
    }
  };

  const handleStatusChange = async (taskId, newStatus) => {
    try {
      const response = await api.put(`/tasks/${taskId}/status`, { status: newStatus });
      setTasks((prev) =>
        prev.map((task) =>
          task.id === taskId ? { ...task, status: response.data.status } : task
        )
      );
    } catch (err) {
      alert(err.response?.data?.error || 'Failed to update task status');
    }
  };

  const tasksByStatus = {
    TODO: tasks.filter((t) => t.status === 'TODO'),
    IN_PROGRESS: tasks.filter((t) => t.status === 'IN_PROGRESS'),
    DONE: tasks.filter((t) => t.status === 'DONE'),
  };

  if (loadingProjects) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="text-amber-400 font-semibold tracking-wide flex items-center gap-3">
          <Sparkles className="h-5 w-5 animate-spin" />
          <span>Loading Tasks Workspace...</span>
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
      {/* Top Banner & Project Selector */}
      <div className="glass-card rounded-2xl p-7 border border-amber-500/20 flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <h1 className="text-3xl font-extrabold tracking-tight text-white">
            Task <span className="gold-gradient-text">Kanban Board</span>
          </h1>
          <p className="text-slate-400 text-sm mt-1">
            Track sprints, assign responsibilities, and update task progress.
          </p>
        </div>

        <div className="w-full md:w-72">
          <label className="block text-xs font-semibold uppercase tracking-wider text-amber-300 mb-1.5">
            Select Workspace Project
          </label>
          <select
            value={selectedProjectId}
            onChange={(e) => handleProjectChange(e.target.value)}
            className="w-full rounded-xl border border-amber-500/30 bg-slate-900 px-4 py-2.5 text-sm text-slate-100 font-medium focus:border-amber-400 focus:outline-none focus:ring-1 focus:ring-amber-400/50 transition-all"
          >
            <option value="">-- Choose Project --</option>
            {projects.map((project) => (
              <option key={project.id} value={project.id}>
                {project.title} (ID #{project.id})
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Task Creation Drawer */}
      {selectedProjectId && (
        <div className="glass-card rounded-2xl p-7 border border-amber-500/20">
          <div className="flex items-center gap-3 mb-5">
            <div className="p-2.5 rounded-xl bg-gradient-to-br from-amber-500/20 to-amber-600/10 text-amber-400 border border-amber-500/20">
              <Plus className="h-5 w-5" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-white">Create New Task</h2>
              <p className="text-xs text-slate-400">Add an action item to this project board</p>
            </div>
          </div>

          <form onSubmit={handleCreateTask} className="grid grid-cols-1 gap-4 sm:grid-cols-3">
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-slate-300 mb-2">
                Task Title
              </label>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                required
                className="w-full rounded-xl border border-slate-700/80 bg-slate-900/80 px-4 py-2 text-sm text-slate-100 placeholder-slate-500 focus:border-amber-400 focus:outline-none focus:ring-1 focus:ring-amber-400/50 transition-all"
                placeholder="e.g. Implement OAuth Flow"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-slate-300 mb-2">
                Assignee User ID (Optional)
              </label>
              <input
                type="number"
                value={assigneeId}
                onChange={(e) => setAssigneeId(e.target.value)}
                className="w-full rounded-xl border border-slate-700/80 bg-slate-900/80 px-4 py-2 text-sm text-slate-100 placeholder-slate-500 focus:border-amber-400 focus:outline-none focus:ring-1 focus:ring-amber-400/50 transition-all"
                placeholder="e.g. 1"
              />
            </div>
            <div className="sm:col-span-3">
              <label className="block text-xs font-semibold uppercase tracking-wider text-slate-300 mb-2">
                Task Description
              </label>
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="w-full rounded-xl border border-slate-700/80 bg-slate-900/80 px-4 py-2 text-sm text-slate-100 placeholder-slate-500 focus:border-amber-400 focus:outline-none focus:ring-1 focus:ring-amber-400/50 transition-all"
                placeholder="Specify requirements and acceptance criteria..."
                rows={2}
              />
            </div>
            <div className="sm:col-span-3">
              <button
                type="submit"
                className="gold-btn inline-flex items-center gap-2 px-6 py-2.5 rounded-xl text-sm font-semibold tracking-wide"
              >
                <Plus className="h-4 w-4" />
                <span>Add Task to Board</span>
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Kanban Board Columns */}
      {selectedProjectId ? (
        <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
          {/* Column 1: TODO (Silver/Slate) */}
          <div className="rounded-2xl p-5 bg-slate-900/50 border border-slate-700/60 flex flex-col min-h-[480px]">
            <div className="flex items-center justify-between mb-4 pb-3 border-b border-slate-700/60">
              <div className="flex items-center gap-2">
                <div className="w-2.5 h-2.5 rounded-full bg-slate-400" />
                <h3 className="text-sm font-bold uppercase tracking-wider text-slate-300">To Do</h3>
              </div>
              <span className="px-2 py-0.5 rounded-full bg-slate-800 border border-slate-700 text-xs font-bold text-slate-300">
                {tasksByStatus.TODO.length}
              </span>
            </div>

            {loadingTasks ? (
              <p className="text-slate-500 text-xs text-center py-6">Loading items...</p>
            ) : (
              <div className="space-y-3.5 flex-1">
                {tasksByStatus.TODO.map((task) => (
                  <div
                    key={task.id}
                    className="glass-card-silver rounded-xl p-4.5 border border-slate-700/80 hover:border-slate-500 transition-all group"
                  >
                    <div className="flex items-start justify-between gap-2 mb-1.5">
                      <h4 className="font-bold text-slate-100 text-sm group-hover:text-amber-300 transition-colors">
                        {task.title}
                      </h4>
                      <span className="text-[10px] text-slate-500 font-mono">#{task.id}</span>
                    </div>
                    {task.description && (
                      <p className="text-xs text-slate-400 line-clamp-2 mb-3 leading-relaxed">
                        {task.description}
                      </p>
                    )}
                    <div className="flex items-center justify-between gap-2 pt-3 border-t border-slate-800/80">
                      <div className="flex items-center gap-1 text-[11px] text-slate-400">
                        <User className="h-3.5 w-3.5 text-slate-500" />
                        <span className="truncate max-w-[100px]">
                          {task.assignee ? task.assignee.name : 'Unassigned'}
                        </span>
                      </div>
                      <select
                        value={task.status}
                        onChange={(e) => handleStatusChange(task.id, e.target.value)}
                        className="rounded-lg border border-slate-700 bg-slate-900 px-2 py-1 text-xs text-slate-300 focus:border-amber-400 focus:outline-none"
                      >
                        <option value="TODO">TODO</option>
                        <option value="IN_PROGRESS">IN PROGRESS</option>
                        <option value="DONE">DONE</option>
                      </select>
                    </div>
                  </div>
                ))}
                {tasksByStatus.TODO.length === 0 && !loadingTasks && (
                  <div className="text-center py-12 text-slate-600 text-xs italic">No tasks in Todo</div>
                )}
              </div>
            )}
          </div>

          {/* Column 2: IN PROGRESS (Amber/Gold Accent) */}
          <div className="rounded-2xl p-5 bg-slate-900/50 border border-amber-500/25 flex flex-col min-h-[480px]">
            <div className="flex items-center justify-between mb-4 pb-3 border-b border-amber-500/20">
              <div className="flex items-center gap-2">
                <div className="w-2.5 h-2.5 rounded-full bg-amber-400 animate-pulse shadow-[0_0_8px_#f59e0b]" />
                <h3 className="text-sm font-bold uppercase tracking-wider text-amber-300">In Progress</h3>
              </div>
              <span className="px-2 py-0.5 rounded-full bg-amber-500/10 border border-amber-500/30 text-xs font-bold text-amber-300">
                {tasksByStatus.IN_PROGRESS.length}
              </span>
            </div>

            {loadingTasks ? (
              <p className="text-slate-500 text-xs text-center py-6">Loading items...</p>
            ) : (
              <div className="space-y-3.5 flex-1">
                {tasksByStatus.IN_PROGRESS.map((task) => (
                  <div
                    key={task.id}
                    className="glass-card rounded-xl p-4.5 border border-amber-500/30 hover:border-amber-400 transition-all shadow-md shadow-amber-950/20 group"
                  >
                    <div className="flex items-start justify-between gap-2 mb-1.5">
                      <h4 className="font-bold text-slate-100 text-sm group-hover:text-amber-300 transition-colors">
                        {task.title}
                      </h4>
                      <span className="text-[10px] text-amber-500/70 font-mono">#{task.id}</span>
                    </div>
                    {task.description && (
                      <p className="text-xs text-slate-400 line-clamp-2 mb-3 leading-relaxed">
                        {task.description}
                      </p>
                    )}
                    <div className="flex items-center justify-between gap-2 pt-3 border-t border-slate-800/80">
                      <div className="flex items-center gap-1 text-[11px] text-amber-300/80">
                        <Clock className="h-3.5 w-3.5 text-amber-400" />
                        <span className="truncate max-w-[100px]">
                          {task.assignee ? task.assignee.name : 'Unassigned'}
                        </span>
                      </div>
                      <select
                        value={task.status}
                        onChange={(e) => handleStatusChange(task.id, e.target.value)}
                        className="rounded-lg border border-amber-500/40 bg-slate-900 px-2 py-1 text-xs text-amber-300 focus:border-amber-400 focus:outline-none"
                      >
                        <option value="TODO">TODO</option>
                        <option value="IN_PROGRESS">IN PROGRESS</option>
                        <option value="DONE">DONE</option>
                      </select>
                    </div>
                  </div>
                ))}
                {tasksByStatus.IN_PROGRESS.length === 0 && !loadingTasks && (
                  <div className="text-center py-12 text-slate-600 text-xs italic">No tasks in progress</div>
                )}
              </div>
            )}
          </div>

          {/* Column 3: DONE (Radiant Gold) */}
          <div className="rounded-2xl p-5 bg-slate-900/50 border border-yellow-500/20 flex flex-col min-h-[480px]">
            <div className="flex items-center justify-between mb-4 pb-3 border-b border-yellow-500/20">
              <div className="flex items-center gap-2">
                <div className="w-2.5 h-2.5 rounded-full bg-yellow-400 shadow-[0_0_8px_#facc15]" />
                <h3 className="text-sm font-bold uppercase tracking-wider text-yellow-300">Done</h3>
              </div>
              <span className="px-2 py-0.5 rounded-full bg-yellow-500/10 border border-yellow-500/30 text-xs font-bold text-yellow-300">
                {tasksByStatus.DONE.length}
              </span>
            </div>

            {loadingTasks ? (
              <p className="text-slate-500 text-xs text-center py-6">Loading items...</p>
            ) : (
              <div className="space-y-3.5 flex-1">
                {tasksByStatus.DONE.map((task) => (
                  <div
                    key={task.id}
                    className="glass-card rounded-xl p-4.5 border border-yellow-500/20 hover:border-yellow-400/40 transition-all opacity-95 group"
                  >
                    <div className="flex items-start justify-between gap-2 mb-1.5">
                      <h4 className="font-bold text-slate-200 text-sm line-through decoration-yellow-500/50 group-hover:text-yellow-300 transition-colors">
                        {task.title}
                      </h4>
                      <span className="text-[10px] text-yellow-500/70 font-mono">#{task.id}</span>
                    </div>
                    {task.description && (
                      <p className="text-xs text-slate-500 line-clamp-2 mb-3 leading-relaxed">
                        {task.description}
                      </p>
                    )}
                    <div className="flex items-center justify-between gap-2 pt-3 border-t border-slate-800/80">
                      <div className="flex items-center gap-1 text-[11px] text-yellow-400/90">
                        <CheckCircle2 className="h-3.5 w-3.5 text-yellow-400" />
                        <span className="truncate max-w-[100px]">
                          {task.assignee ? task.assignee.name : 'Unassigned'}
                        </span>
                      </div>
                      <select
                        value={task.status}
                        onChange={(e) => handleStatusChange(task.id, e.target.value)}
                        className="rounded-lg border border-yellow-500/30 bg-slate-900 px-2 py-1 text-xs text-yellow-300 focus:border-amber-400 focus:outline-none"
                      >
                        <option value="TODO">TODO</option>
                        <option value="IN_PROGRESS">IN PROGRESS</option>
                        <option value="DONE">DONE</option>
                      </select>
                    </div>
                  </div>
                ))}
                {tasksByStatus.DONE.length === 0 && !loadingTasks && (
                  <div className="text-center py-12 text-slate-600 text-xs italic">No completed tasks</div>
                )}
              </div>
            )}
          </div>
        </div>
      ) : (
        <div className="glass-card rounded-2xl p-16 text-center border border-amber-500/15">
          <FolderKanban className="h-12 w-12 text-amber-400/60 mx-auto mb-4" />
          <h3 className="text-lg font-bold text-white mb-1">Select a Workspace Project</h3>
          <p className="text-xs text-slate-400 max-w-sm mx-auto">
            Choose a project from the dropdown above to load its Kanban board, manage task statuses, and assign deliverables.
          </p>
        </div>
      )}
    </div>
  );
}
