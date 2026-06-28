const express = require('express');
const router = express.Router();
const Task = require('../models/Task');

// ----------------------------------------------------------
// GET /api/tasks  -> get all tasks (newest first)
// ----------------------------------------------------------
router.get('/', async (req, res) => {
  try {
    const tasks = await Task.find().sort({ createdAt: -1 });
    res.json(tasks);
  } catch (err) {
    res.status(500).json({ message: 'Failed to fetch tasks', error: err.message });
  }
});

// ----------------------------------------------------------
// GET /api/tasks/:id  -> get a single task by id
// ----------------------------------------------------------
router.get('/:id', async (req, res) => {
  try {
    const task = await Task.findById(req.params.id);
    if (!task) {
      return res.status(404).json({ message: 'Task not found' });
    }
    res.json(task);
  } catch (err) {
    res.status(500).json({ message: 'Failed to fetch task', error: err.message });
  }
});

// ----------------------------------------------------------
// POST /api/tasks  -> create a new task
// ----------------------------------------------------------
router.post('/', async (req, res) => {
  try {
    const { title, description, status, priority, dueDate } = req.body;

    // basic server-side validation (in addition to the schema validation)
    if (!title || title.trim().length < 3) {
      return res.status(400).json({ message: 'Title is required and must be at least 3 characters' });
    }

    const task = new Task({ title, description, status, priority, dueDate });
    const savedTask = await task.save();
    res.status(201).json(savedTask);
  } catch (err) {
    res.status(400).json({ message: 'Failed to create task', error: err.message });
  }
});

// ----------------------------------------------------------
// PUT /api/tasks/:id  -> update an existing task
// ----------------------------------------------------------
router.put('/:id', async (req, res) => {
  try {
    const { title } = req.body;

    if (title !== undefined && title.trim().length < 3) {
      return res.status(400).json({ message: 'Title must be at least 3 characters' });
    }

    const updatedTask = await Task.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );

    if (!updatedTask) {
      return res.status(404).json({ message: 'Task not found' });
    }
    res.json(updatedTask);
  } catch (err) {
    res.status(400).json({ message: 'Failed to update task', error: err.message });
  }
});

// ----------------------------------------------------------
// DELETE /api/tasks/:id  -> delete a task
// ----------------------------------------------------------
router.delete('/:id', async (req, res) => {
  try {
    const deletedTask = await Task.findByIdAndDelete(req.params.id);
    if (!deletedTask) {
      return res.status(404).json({ message: 'Task not found' });
    }
    res.json({ message: 'Task deleted successfully', task: deletedTask });
  } catch (err) {
    res.status(500).json({ message: 'Failed to delete task', error: err.message });
  }
});

module.exports = router;
