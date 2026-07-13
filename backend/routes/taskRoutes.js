const express = require('express');
const { verifyToken, authorizeRoles } = require('../middlewares/authMiddleware');
const { createTask, getTasksByProject, updateTaskStatus, deleteTask } = require('../controllers/taskController');

const router = express.Router();

router.post('/', verifyToken, authorizeRoles('MANAGER', 'ADMIN'), createTask);
router.delete('/:id', verifyToken, authorizeRoles('MANAGER', 'ADMIN'), deleteTask);
router.get('/project/:projectId', verifyToken, getTasksByProject);
router.put('/:id/status', verifyToken, updateTaskStatus);

module.exports = router;
