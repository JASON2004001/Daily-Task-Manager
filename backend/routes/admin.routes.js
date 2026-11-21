import express from 'express';
import jwt from 'jsonwebtoken';
import User from '../models/User.mondal.js';
import Todo from '../models/Todo.mondal.js';
import { verifyAdmin } from '../middleware/auth.middleware.js';

const router = express.Router();

// 1. Admin Login (Name: Prosenjit, Password: 12345)
router.post('/login', (req, res) => {
  const { name, password } = req.body;

  const adminName = process.env.ADMIN_NAME || 'Prosenjit';
  const adminPass = process.env.ADMIN_PASSWORD || '12345';

  if (name === adminName && password === adminPass) {
    const adminToken = jwt.sign(
      { name: adminName, role: 'admin' },
      process.env.JWT_SECRET,
      { expiresIn: '1d' }
    );

    return res.json({
      message: 'Welcome Admin Prosenjit',
      token: adminToken,
      admin: { name: adminName },
    });
  }

  return res.status(401).json({ message: 'Invalid Admin credentials.' });
});

// 2. Admin Analytics & Per-User Tasks
router.get('/stats', verifyAdmin, async (req, res) => {
  try {
    const users = await User.find().select('-password').sort({ createdAt: -1 });
    const allTodos = await Todo.find().sort({ createdAt: -1 });

    const usersWithTasksSet = new Set(allTodos.map((t) => t.userId.toString()));

    const userDetails = users.map((u) => {
      const userTasks = allTodos.filter((t) => t.userId.toString() === u._id.toString());
      return {
        id: u._id,
        name: u.name,
        email: u.email,
        joinedAt: u.createdAt,
        totalTasksStored: userTasks.length,
        completedTasks: userTasks.filter((t) => t.isCompleted).length,
        tasks: userTasks.map((t) => ({
          id: t._id,
          text: t.text,
          isCompleted: t.isCompleted,
          createdAt: t.createdAt,
        })),
      };
    });

    res.json({
      totalRegisteredUsers: users.length,
      usersWhoStoredTasks: usersWithTasksSet.size,
      totalTasksAcrossPlatform: allTodos.length,
      users: userDetails,
    });
  } catch (error) {
    res.status(500).json({ message: 'Failed to load admin stats', error: error.message });
  }
});

export default router;