const prisma = require('../config/prisma');

const createProject = async (req, res) => {
  try {
    const { title, description } = req.body;
    if (!title) {
      return res.status(400).json({ error: 'Title is required' });
    }
    const project = await prisma.project.create({
      data: {
        title,
        description,
        managerId: req.user.id
      }
    });
    return res.status(201).json(project);
  } catch (error) {
    console.error('createProject error:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
};

const getAllProjects = async (req, res) => {
  try {
    const projects = await prisma.project.findMany({
      include: {
        manager: {
          select: {
            id: true,
            name: true,
            email: true,
            role: true
          }
        },
        members: {
          include: {
            user: {
              select: {
                id: true,
                name: true,
                email: true,
                role: true
              }
            }
          }
        }
      }
    });
    return res.status(200).json(projects);
  } catch (error) {
    console.error('getAllProjects error:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
};

const getProjectById = async (req, res) => {
  try {
    const id = parseInt(req.params.id);
    if (isNaN(id)) {
      return res.status(400).json({ error: 'Invalid project ID' });
    }
    const project = await prisma.project.findUnique({
      where: { id },
      include: {
        manager: {
          select: {
            id: true,
            name: true,
            email: true,
            role: true
          }
        },
        members: {
          include: {
            user: {
              select: {
                id: true,
                name: true,
                email: true,
                role: true
              }
            }
          }
        },
        tasks: true
      }
    });
    if (!project) {
      return res.status(404).json({ error: 'Project not found' });
    }
    return res.status(200).json(project);
  } catch (error) {
    console.error('getProjectById error:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
};

const addMemberToProject = async (req, res) => {
  try {
    const projectId = parseInt(req.params.id);
    if (isNaN(projectId)) {
      return res.status(400).json({ error: 'Invalid project ID' });
    }
    const userId = parseInt(req.body.userId);
    if (isNaN(userId)) {
      return res.status(400).json({ error: 'Invalid user ID' });
    }
    const projectExists = await prisma.project.findUnique({ where: { id: projectId } });
    if (!projectExists) {
      return res.status(404).json({ error: 'Project not found' });
    }
    const userExists = await prisma.user.findUnique({ where: { id: userId } });
    if (!userExists) {
      return res.status(404).json({ error: 'User not found' });
    }
    const memberExists = await prisma.projectMember.findUnique({
      where: {
        projectId_userId: { projectId, userId }
      }
    });
    if (memberExists) {
      return res.status(400).json({ error: 'User is already a member of this project' });
    }
    const projectMember = await prisma.projectMember.create({
      data: {
        projectId,
        userId
      }
    });
    return res.status(201).json(projectMember);
  } catch (error) {
    console.error('addMemberToProject error:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
};

module.exports = { createProject, getAllProjects, getProjectById, addMemberToProject };
