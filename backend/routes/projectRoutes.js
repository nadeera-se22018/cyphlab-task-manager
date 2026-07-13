const express = require('express');
const { verifyToken, authorizeRoles } = require('../middlewares/authMiddleware');
const { createProject, getAllProjects, getProjectById, addMemberToProject } = require('../controllers/projectController');

const router = express.Router();

router.post('/', verifyToken, authorizeRoles('MANAGER', 'ADMIN'), createProject);
router.post('/:id/members', verifyToken, authorizeRoles('MANAGER', 'ADMIN'), addMemberToProject);
router.get('/', verifyToken, getAllProjects);
router.get('/:id', verifyToken, getProjectById);

module.exports = router;
