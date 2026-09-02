const express = require('express');
const { verifyToken, authorizeRoles } = require('../middlewares/authMiddleware');
const { getAllUsers, getUserById, updateUserRole, deleteUser } = require('../controllers/userController');

const router = express.Router();

router.use(verifyToken);

router.get('/', getAllUsers);
router.get('/:id', getUserById);
router.put('/:id/role', authorizeRoles('ADMIN'), updateUserRole);
router.delete('/:id', authorizeRoles('ADMIN'), deleteUser);

module.exports = router;
