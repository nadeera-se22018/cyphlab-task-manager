const express = require('express');
const { verifyToken, authorizeRoles } = require('../middlewares/authMiddleware');
const { getAllUsers, getUserById, updateUserRole, deleteUser } = require('../controllers/userController');

const router = express.Router();

router.use(verifyToken);
router.use(authorizeRoles('ADMIN'));

router.get('/', getAllUsers);
router.get('/:id', getUserById);
router.put('/:id/role', updateUserRole);
router.delete('/:id', deleteUser);

module.exports = router;
