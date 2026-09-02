'use client';

import { useEffect, useState } from 'react';
import { FolderKanban, Plus, UserPlus, Users, Sparkles } from 'lucide-react';
import api from '../../../lib/axios';

export default function ProjectsPage() {
  const [projects, setProjects] = useState([]);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [memberIds, setMemberIds] = useState({});
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const response = await api.get('/projects');
        setProjects(response.data);
      } catch (err) {
        setError(err.response?.data?.error || 'Failed to fetch projects');
      } finally {
        setLoading(false);
      }
    };
    fetchProjects();
  }, []);

  const handleCreateProject = async (e) => {
    e.preventDefault();
    if (!title) {
      return;
    }
    try {
      const response = await api.post('/projects', { title, description });
      setProjects((prev) => [...prev, response.data]);
      setTitle('');
      setDescription('');
    } catch (err) {
      alert(err.response?.data?.error || 'Failed to create project');
    }
  };

  const handleAddMember = async (projectId) => {
    const userIdStr = memberIds[projectId];
    if (!userIdStr) {
      alert('Please enter a user ID');
      return;
    }
    const userId = parseInt(userIdStr);
    if (isNaN(userId)) {
      alert('Please enter a valid user ID');
      return;
    }
    try {
      await api.post(`/projects/${projectId}/members`, { userId });
      alert('Member added successfully');
      setMemberIds((prev) => ({ ...prev, [projectId]: '' }));
    } catch (err) {
      alert(err.response?.data?.error || 'Failed to add member');
    }
  };

  const handleMemberIdChange = (projectId, value) => {
    setMemberIds((prev) => ({ ...prev, [projectId]: value }));
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="text-amber-400 font-semibold tracking-wide flex items-center gap-3">
          <Sparkles className="h-5 w-5 animate-spin" />
          <span>Loading Projects Workspace...</span>
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
            Project <span className="gold-gradient-text">Hub</span>
          </h1>
          <p className="text-slate-400 text-sm mt-1">
            Create high-impact workspaces, assign team members, and orchestrate deliverables.
          </p>
        </div>
        <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-slate-900 border border-amber-500/20 text-xs font-semibold text-amber-300">
          <FolderKanban className="h-4 w-4 text-amber-400" />
          <span>{projects.length} Total Projects</span>
        </div>
      </div>

      {/* Create Project Card */}
      <div className="glass-card rounded-2xl p-7 border border-amber-500/20">
        <div className="flex items-center gap-3 mb-6">
          <div className="p-2.5 rounded-xl bg-gradient-to-br from-amber-500/20 to-amber-600/10 text-amber-400 border border-amber-500/20">
            <Plus className="h-5 w-5" />
          </div>
          <div>
            <h2 className="text-lg font-bold text-white">Create New Project</h2>
            <p className="text-xs text-slate-400">Initialize a workspace to organize your tasks</p>
          </div>
        </div>

        <form onSubmit={handleCreateProject} className="space-y-5">
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-slate-300 mb-2">
              Project Title
            </label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
              className="w-full rounded-xl border border-slate-700/80 bg-slate-900/80 px-4 py-2.5 text-slate-100 placeholder-slate-500 focus:border-amber-400 focus:outline-none focus:ring-1 focus:ring-amber-400/50 text-sm transition-all"
              placeholder="e.g. NextGen Mobile Platform"
            />
          </div>
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-slate-300 mb-2">
              Description
            </label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full rounded-xl border border-slate-700/80 bg-slate-900/80 px-4 py-2.5 text-slate-100 placeholder-slate-500 focus:border-amber-400 focus:outline-none focus:ring-1 focus:ring-amber-400/50 text-sm transition-all"
              placeholder="Outline project objectives and milestones..."
              rows={3}
            />
          </div>
          <button
            type="submit"
            className="gold-btn inline-flex items-center gap-2 px-6 py-2.5 rounded-xl text-sm font-semibold tracking-wide"
          >
            <Plus className="h-4 w-4" />
            <span>Launch Project</span>
          </button>
        </form>
      </div>

      {/* Projects Grid */}
      <div>
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-bold text-white">Active Projects</h2>
          <span className="text-xs text-slate-400">{projects.length} workspaces active</span>
        </div>

        {projects.length === 0 ? (
          <div className="glass-card rounded-2xl p-12 text-center text-slate-400 border border-slate-800">
            <FolderKanban className="h-10 w-10 text-slate-600 mx-auto mb-3" />
            <p className="text-base font-medium text-slate-300">No projects created yet.</p>
            <p className="text-xs text-slate-500 mt-1">Use the form above to initialize your first workspace.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {projects.map((project) => (
              <div
                key={project.id}
                className="glass-card rounded-2xl p-6 border border-amber-500/15 hover:border-amber-400/40 transition-all duration-300 flex flex-col justify-between group hover:shadow-xl hover:shadow-amber-950/20"
              >
                <div>
                  <div className="flex items-center justify-between gap-2 mb-3">
                    <span className="px-2.5 py-1 rounded-md bg-amber-500/10 border border-amber-500/20 text-[11px] font-bold text-amber-400 uppercase tracking-wider">
                      ID #{project.id}
                    </span>
                    <div className="flex items-center gap-1.5 text-xs text-slate-400">
                      <Users className="h-3.5 w-3.5 text-slate-400" />
                      <span>{project.members?.length || 0} members</span>
                    </div>
                  </div>
                  <h3 className="text-lg font-bold text-white group-hover:text-amber-300 transition-colors mb-2">
                    {project.title}
                  </h3>
                  <p className="text-xs text-slate-400 line-clamp-3 leading-relaxed mb-4">
                    {project.description || 'No description provided.'}
                  </p>
                </div>

                {/* Add Member Box */}
                <div className="border-t border-slate-800/80 pt-4 mt-2">
                  <div className="flex items-center gap-1.5 text-xs font-semibold text-slate-300 mb-2">
                    <UserPlus className="h-3.5 w-3.5 text-amber-400" />
                    <span>Assign Member</span>
                  </div>
                  <div className="flex gap-2">
                    <input
                      type="number"
                      placeholder="User ID"
                      value={memberIds[project.id] || ''}
                      onChange={(e) => handleMemberIdChange(project.id, e.target.value)}
                      className="w-full rounded-xl border border-slate-700/80 bg-slate-900/90 px-3 py-1.5 text-xs text-slate-100 placeholder-slate-500 focus:border-amber-400 focus:outline-none focus:ring-1 focus:ring-amber-400/40 transition-all"
                    />
                    <button
                      onClick={() => handleAddMember(project.id)}
                      className="gold-btn px-4 py-1.5 rounded-xl text-xs font-semibold tracking-wide whitespace-nowrap"
                    >
                      Add
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
