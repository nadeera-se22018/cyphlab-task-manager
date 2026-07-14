'use client';

import { useEffect, useState } from 'react';
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
    return <div className="text-center py-10 text-gray-600">Loading projects...</div>;
  }

  if (error) {
    return <div className="text-center py-10 text-red-600">{error}</div>;
  }

  return (
    <div className="max-w-6xl mx-auto space-y-8">
      <div className="bg-white p-6 rounded-lg border border-gray-200 shadow-sm">
        <h2 className="text-xl font-bold text-gray-900 mb-4">Create New Project</h2>
        <form onSubmit={handleCreateProject} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">Project Title</label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
              className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 text-gray-900 placeholder-gray-500 focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 sm:text-sm"
              placeholder="Enter project title"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Description</label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 text-gray-900 placeholder-gray-500 focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 sm:text-sm"
              placeholder="Enter project description"
              rows={3}
            />
          </div>
          <button
            type="submit"
            className="inline-flex justify-center rounded-md border border-transparent bg-indigo-600 px-4 py-2 text-sm font-medium text-white hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
          >
            Create Project
          </button>
        </form>
      </div>

      <div>
        <h2 className="text-xl font-bold text-gray-900 mb-6">Projects</h2>
        {projects.length === 0 ? (
          <p className="text-gray-500">No projects found.</p>
        ) : (
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {projects.map((project) => (
              <div key={project.id} className="bg-white rounded-lg border border-gray-200 shadow-sm p-6 flex flex-col justify-between">
                <div>
                  <h3 className="text-lg font-bold text-gray-900 mb-2">{project.title}</h3>
                  <p className="text-sm text-gray-600 mb-4">{project.description || 'No description provided.'}</p>
                </div>
                <div className="border-t border-gray-100 pt-4 mt-4">
                  <h4 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">Add Member</h4>
                  <div className="flex gap-2">
                    <input
                      type="number"
                      placeholder="User ID"
                      value={memberIds[project.id] || ''}
                      onChange={(e) => handleMemberIdChange(project.id, e.target.value)}
                      className="block w-full rounded-md border border-gray-300 px-2 py-1 text-sm text-gray-900 placeholder-gray-400 focus:border-indigo-500 focus:outline-none focus:ring-indigo-500"
                    />
                    <button
                      onClick={() => handleAddMember(project.id)}
                      className="inline-flex items-center rounded-md border border-transparent bg-indigo-600 px-3 py-1 text-xs font-medium text-white hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
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
