import express from 'express';
import Todo from '../models/Todo.mondal.js';
import { verifyUser } from '../middleware/auth.middleware.js';

const router = express.Router();

// Get all User's Tasks
router.get('/', verifyUser, async (req, res) => {
  try {
    const todos = await Todo.find({ userId: req.user.id }).sort({ createdAt: -1 });
    res.json(todos);
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch tasks', error: error.message });
  }
});

// Create a New Task
router.post('/', verifyUser, async (req, res) => {
  try {
    const { text } = req.body;
    if (!text || !text.trim()) {
      return res.status(400).json({ message: 'Task text cannot be empty.' });
    }

    const newTodo = await Todo.create({
      userId: req.user.id,
      text: text.trim(),
      isCompleted: false,
    });

    res.status(201).json(newTodo);
  } catch (error) {
    res.status(500).json({ message: 'Failed to create task', error: error.message });
  }
});

// Toggle or Tick Mark (Complete or Incomplete)
router.patch('/:id/toggle', verifyUser, async (req, res) => {
  try {
    const todo = await Todo.findOne({ _id: req.params.id, userId: req.user.id });
    if (!todo) {
      return res.status(404).json({ message: 'Task not found.' });
    }

    todo.isCompleted = !todo.isCompleted;
    await todo.save();

    res.json(todo);
  } catch (error) {
    res.status(500).json({ message: 'Failed to update task', error: error.message });
  }
});

// Delete one Task
router.delete('/:id', verifyUser, async (req, res) => {
  try {
    const deleted = await Todo.findOneAndDelete({ _id: req.params.id, userId: req.user.id });
    if (!deleted) {
      return res.status(404).json({ message: 'Task not found.' });
    }

    res.json({ message: 'Task deleted successfully', id: req.params.id });
  } catch (error) {
    res.status(500).json({ message: 'Failed to delete task', error: error.message });
  }
});

// Delete aLL tasks for the user
router.delete('/', verifyUser, async (req, res) => {
  try {
    await Todo.deleteMany({ userId: req.user.id });
    res.json({ message: 'All tasks deleted successfully.' });
  } catch (error) {
    res.status(500).json({ message: 'Failed to clear tasks', error: error.message });
  }
});

export default router;