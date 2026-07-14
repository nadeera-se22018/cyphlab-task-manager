'use client';

import { useEffect, useState } from 'react';
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
    return <div className="text-center py-10 text-gray-600">Loading projects...</div>;
  }

  if (error) {
    return <div className="text-center py-10 text-red-600">{error}</div>;
  }

  return (
    <div className="max-w-6xl mx-auto space-y-8">
      <div className="bg-white p-6 rounded-lg border border-gray-200 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Task Boards</h1>
          <p className="text-gray-500 text-sm">Select a project to manage its tasks</p>
        </div>
        <div className="w-full md:w-64">
          <select
            value={selectedProjectId}
            onChange={(e) => handleProjectChange(e.target.value)}
            className="block w-full rounded-md border border-gray-300 px-3 py-2 text-gray-900 focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 sm:text-sm"
          >
            <option value="">-- Select Project --</option>
            {projects.map((project) => (
              <option key={project.id} value={project.id}>
                {project.title}
              </option>
            ))}
          </select>
        </div>
      </div>

      {selectedProjectId && (
        <div className="bg-white p-6 rounded-lg border border-gray-200 shadow-sm">
          <h2 className="text-lg font-bold text-gray-900 mb-4">Create New Task</h2>
          <form onSubmit={handleCreateTask} className="grid grid-cols-1 gap-4 sm:grid-cols-3">
            <div>
              <label className="block text-sm font-medium text-gray-700">Task Title</label>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                required
                className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 text-gray-900 placeholder-gray-500 focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 sm:text-sm"
                placeholder="Enter task title"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Assignee User ID</label>
              <input
                type="number"
                value={assigneeId}
                onChange={(e) => setAssigneeId(e.target.value)}
                className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 text-gray-900 placeholder-gray-500 focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 sm:text-sm"
                placeholder="Optional Assignee ID"
              />
            </div>
            <div className="sm:col-span-3">
              <label className="block text-sm font-medium text-gray-700">Description</label>
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 text-gray-900 placeholder-gray-500 focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 sm:text-sm"
                placeholder="Enter task description"
                rows={2}
              />
            </div>
            <div className="sm:col-span-3">
              <button
                type="submit"
                className="inline-flex justify-center rounded-md border border-transparent bg-indigo-600 px-4 py-2 text-sm font-medium text-white hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
              >
                Create Task
              </button>
            </div>
          </form>
        </div>
      )}

      {selectedProjectId && (
        <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
          <div className="bg-gray-100 rounded-lg p-4 flex flex-col min-h-[400px]">
            <h3 className="text-sm font-bold text-gray-700 uppercase tracking-wider mb-4 flex items-center justify-between">
              <span>Todo</span>
              <span className="bg-gray-200 text-gray-700 px-2 py-0.5 rounded-full text-xs">
                {tasksByStatus.TODO.length}
              </span>
            </h3>
            {loadingTasks ? (
              <p className="text-gray-500 text-sm">Loading...</p>
            ) : (
              <div className="space-y-4 flex-1">
                {tasksByStatus.TODO.map((task) => (
                  <div key={task.id} className="bg-white rounded-lg border border-gray-200 shadow-sm p-4 space-y-3">
                    <h4 className="font-semibold text-gray-900 text-sm">{task.title}</h4>
                    {task.description && (
                      <p className="text-xs text-gray-600 line-clamp-3">{task.description}</p>
                    )}
                    <div className="flex items-center justify-between gap-2 pt-2 border-t border-gray-100">
                      <span className="text-[10px] text-gray-500">
                        {task.assignee ? `Assignee: ${task.assignee.name}` : 'Unassigned'}
                      </span>
                      <select
                        value={task.status}
                        onChange={(e) => handleStatusChange(task.id, e.target.value)}
                        className="rounded border border-gray-300 px-1 py-0.5 text-xs text-gray-700 focus:outline-none"
                      >
                        <option value="TODO">TODO</option>
                        <option value="IN_PROGRESS">IN PROGRESS</option>
                        <option value="DONE">DONE</option>
                      </select>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="bg-gray-100 rounded-lg p-4 flex flex-col min-h-[400px]">
            <h3 className="text-sm font-bold text-gray-700 uppercase tracking-wider mb-4 flex items-center justify-between">
              <span>In Progress</span>
              <span className="bg-gray-200 text-gray-700 px-2 py-0.5 rounded-full text-xs">
                {tasksByStatus.IN_PROGRESS.length}
              </span>
            </h3>
            {loadingTasks ? (
              <p className="text-gray-500 text-sm">Loading...</p>
            ) : (
              <div className="space-y-4 flex-1">
                {tasksByStatus.IN_PROGRESS.map((task) => (
                  <div key={task.id} className="bg-white rounded-lg border border-gray-200 shadow-sm p-4 space-y-3">
                    <h4 className="font-semibold text-gray-900 text-sm">{task.title}</h4>
                    {task.description && (
                      <p className="text-xs text-gray-600 line-clamp-3">{task.description}</p>
                    )}
                    <div className="flex items-center justify-between gap-2 pt-2 border-t border-gray-100">
                      <span className="text-[10px] text-gray-500">
                        {task.assignee ? `Assignee: ${task.assignee.name}` : 'Unassigned'}
                      </span>
                      <select
                        value={task.status}
                        onChange={(e) => handleStatusChange(task.id, e.target.value)}
                        className="rounded border border-gray-300 px-1 py-0.5 text-xs text-gray-700 focus:outline-none"
                      >
                        <option value="TODO">TODO</option>
                        <option value="IN_PROGRESS">IN PROGRESS</option>
                        <option value="DONE">DONE</option>
                      </select>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="bg-gray-100 rounded-lg p-4 flex flex-col min-h-[400px]">
            <h3 className="text-sm font-bold text-gray-700 uppercase tracking-wider mb-4 flex items-center justify-between">
              <span>Done</span>
              <span className="bg-gray-200 text-gray-700 px-2 py-0.5 rounded-full text-xs">
                {tasksByStatus.DONE.length}
              </span>
            </h3>
            {loadingTasks ? (
              <p className="text-gray-500 text-sm">Loading...</p>
            ) : (
              <div className="space-y-4 flex-1">
                {tasksByStatus.DONE.map((task) => (
                  <div key={task.id} className="bg-white rounded-lg border border-gray-200 shadow-sm p-4 space-y-3">
                    <h4 className="font-semibold text-gray-900 text-sm">{task.title}</h4>
                    {task.description && (
                      <p className="text-xs text-gray-600 line-clamp-3">{task.description}</p>
                    )}
                    <div className="flex items-center justify-between gap-2 pt-2 border-t border-gray-100">
                      <span className="text-[10px] text-gray-500">
                        {task.assignee ? `Assignee: ${task.assignee.name}` : 'Unassigned'}
                      </span>
                      <select
                        value={task.status}
                        onChange={(e) => handleStatusChange(task.id, e.target.value)}
                        className="rounded border border-gray-300 px-1 py-0.5 text-xs text-gray-700 focus:outline-none"
                      >
                        <option value="TODO">TODO</option>
                        <option value="IN_PROGRESS">IN PROGRESS</option>
                        <option value="DONE">DONE</option>
                      </select>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
