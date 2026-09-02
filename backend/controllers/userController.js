const prisma = require('../config/prisma');

const getAllUsers = async (req, res) => {
  try {
    const users = await prisma.user.findMany({
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        createdAt: true,
        updatedAt: true
      }
    });
    return res.status(200).json(users);
  } catch (error) {
    console.error('getAllUsers error:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
};

const getUserById = async (req, res) => {
  try {
    const id = parseInt(req.params.id);
    if (isNaN(id)) {
      return res.status(400).json({ error: 'Invalid user ID' });
    }
    const user = await prisma.user.findUnique({
      where: { id },
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        createdAt: true,
        updatedAt: true
      }
    });
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }
    return res.status(200).json(user);
  } catch (error) {
    console.error('getUserById error:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
};

const updateUserRole = async (req, res) => {
  try {
    const id = parseInt(req.params.id);
    if (isNaN(id)) {
      return res.status(400).json({ error: 'Invalid user ID' });
    }
    const { role } = req.body;
    if (!role) {
      return res.status(400).json({ error: 'Role is required' });
    }
    const validRoles = ['ADMIN', 'MANAGER', 'MEMBER'];
    if (!validRoles.includes(role)) {
      return res.status(400).json({ error: 'Invalid role value' });
    }
    const user = await prisma.user.update({
      where: { id },
      data: { role },
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        createdAt: true,
        updatedAt: true
      }
    });
    return res.status(200).json(user);
  } catch (error) {
    if (error.code === 'P2025') {
      return res.status(404).json({ error: 'User not found' });
    }
    console.error('updateUserRole error:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
};

const deleteUser = async (req, res) => {
  try {
    const id = parseInt(req.params.id);
    if (isNaN(id)) {
      return res.status(400).json({ error: 'Invalid user ID' });
    }
    await prisma.user.delete({ where: { id } });
    return res.status(200).json({ message: 'User deleted successfully' });
  } catch (error) {
    if (error.code === 'P2025') {
      return res.status(404).json({ error: 'User not found' });
    }
    console.error('deleteUser error:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
};

module.exports = { getAllUsers, getUserById, updateUserRole, deleteUser };
