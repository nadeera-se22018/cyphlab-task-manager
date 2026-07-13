const { Pool } = require('pg');
const { PrismaPg } = require('@prisma/adapter-pg');
const { PrismaClient } = require('../generated/prisma');

const pool = new Pool({ connectionString: process.env.DATABASE_URL });
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

const createTask = async (req, res) => {
  try {
    const { title, description, projectId, assigneeId } = req.body;
    if (!title) {
      return res.status(400).json({ error: 'Title is required' });
    }
    const projectIdParsed = parseInt(projectId);
    if (isNaN(projectIdParsed)) {
      return res.status(400).json({ error: 'Invalid project ID' });
    }
    const projectExists = await prisma.project.findUnique({ where: { id: projectIdParsed } });
    if (!projectExists) {
      return res.status(404).json({ error: 'Project not found' });
    }
    let assigneeIdParsed = null;
    if (assigneeId !== undefined && assigneeId !== null) {
      assigneeIdParsed = parseInt(assigneeId);
      if (isNaN(assigneeIdParsed)) {
        return res.status(400).json({ error: 'Invalid assignee ID' });
      }
      const userExists = await prisma.user.findUnique({ where: { id: assigneeIdParsed } });
      if (!userExists) {
        return res.status(404).json({ error: 'Assignee not found' });
      }
    }
    const task = await prisma.task.create({
      data: {
        title,
        description,
        projectId: projectIdParsed,
        assigneeId: assigneeIdParsed
      }
    });
    return res.status(201).json(task);
  } catch (error) {
    return res.status(500).json({ error: 'Internal server error' });
  }
};

const getTasksByProject = async (req, res) => {
  try {
    const projectId = parseInt(req.params.projectId);
    if (isNaN(projectId)) {
      return res.status(400).json({ error: 'Invalid project ID' });
    }
    const projectExists = await prisma.project.findUnique({ where: { id: projectId } });
    if (!projectExists) {
      return res.status(404).json({ error: 'Project not found' });
    }
    const tasks = await prisma.task.findMany({
      where: { projectId },
      include: {
        assignee: {
          select: {
            id: true,
            name: true,
            email: true,
            role: true
          }
        }
      }
    });
    return res.status(200).json(tasks);
  } catch (error) {
    return res.status(500).json({ error: 'Internal server error' });
  }
};

const updateTaskStatus = async (req, res) => {
  try {
    const id = parseInt(req.params.id);
    if (isNaN(id)) {
      return res.status(400).json({ error: 'Invalid task ID' });
    }
    const { status } = req.body;
    if (!status) {
      return res.status(400).json({ error: 'Status is required' });
    }
    const validStatuses = ['TODO', 'IN_PROGRESS', 'DONE'];
    if (!validStatuses.includes(status)) {
      return res.status(400).json({ error: 'Invalid status value' });
    }
    const task = await prisma.task.update({
      where: { id },
      data: { status },
      include: {
        assignee: {
          select: {
            id: true,
            name: true,
            email: true,
            role: true
          }
        }
      }
    });
    return res.status(200).json(task);
  } catch (error) {
    if (error.code === 'P2025') {
      return res.status(404).json({ error: 'Task not found' });
    }
    return res.status(500).json({ error: 'Internal server error' });
  }
};

const deleteTask = async (req, res) => {
  try {
    const id = parseInt(req.params.id);
    if (isNaN(id)) {
      return res.status(400).json({ error: 'Invalid task ID' });
    }
    await prisma.task.delete({ where: { id } });
    return res.status(200).json({ message: 'Task deleted successfully' });
  } catch (error) {
    if (error.code === 'P2025') {
      return res.status(404).json({ error: 'Task not found' });
    }
    return res.status(500).json({ error: 'Internal server error' });
  }
};

module.exports = { createTask, getTasksByProject, updateTaskStatus, deleteTask };
