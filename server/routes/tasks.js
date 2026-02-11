const express = require('express');
const Task = require('../models/Task');
const auth = require('../middleware/auth');

const router = express.Router();

// All routes are protected
router.use(auth);

// Get all tasks for the authenticated user
router.get('/', async (req, res) => {
  try {
    const { search, status } = req.query;
    let query = { user: req.user._id };

    // Apply search filter
    if (search) {
      query.$or = [
        { title: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } }
      ];
    }

    // Apply status filter
    if (status && ['pending', 'completed'].includes(status)) {
      query.status = status;
    }

    const tasks = await Task.find(query)
      .sort({ createdAt: -1 })
      .select('-__v');

    // Calculate statistics
    const totalTasks = tasks.length;
    const completedTasks = tasks.filter(task => task.status === 'completed').length;
    const pendingTasks = totalTasks - completedTasks;

    res.json({
      tasks,
      stats: {
        total: totalTasks,
        completed: completedTasks,
        pending: pendingTasks
      }
    });
  } catch (error) {
    console.error('Get tasks error:', error.message);
    res.status(500).json({ 
      message: 'Server error while fetching tasks',
      error: error.message 
    });
  }
});

// Create a new task
router.post('/', async (req, res) => {
  try {
    const { title, description } = req.body;

    if (!title || title.trim() === '') {
      return res.status(400).json({ message: 'Task title is required' });
    }

    const task = new Task({
      title: title.trim(),
      description: description ? description.trim() : '',
      user: req.user._id
    });

    await task.save();

    // Emit real-time event
    req.io.emit('taskCreated', {
      task,
      userId: req.user._id
    });

    res.status(201).json({
      message: 'Task created successfully',
      task
    });
  } catch (error) {
    console.error('Create task error:', error.message);
    res.status(500).json({ 
      message: 'Server error while creating task',
      error: error.message 
    });
  }
});

// Update a task
router.put('/:id', async (req, res) => {
  try {
    const { title, description, status } = req.body;
    const taskId = req.params.id;

    // Find task and ensure it belongs to the user
    const task = await Task.findOne({ _id: taskId, user: req.user._id });
    
    if (!task) {
      return res.status(404).json({ message: 'Task not found' });
    }

    // Update fields
    if (title !== undefined) {
      if (title.trim() === '') {
        return res.status(400).json({ message: 'Task title cannot be empty' });
      }
      task.title = title.trim();
    }

    if (description !== undefined) {
      task.description = description.trim();
    }

    if (status !== undefined && ['pending', 'completed'].includes(status)) {
      task.status = status;
    }

    await task.save();

    // Emit real-time event
    req.io.emit('taskUpdated', {
      task,
      userId: req.user._id
    });

    res.json({
      message: 'Task updated successfully',
      task
    });
  } catch (error) {
    console.error('Update task error:', error.message);
    res.status(500).json({ 
      message: 'Server error while updating task',
      error: error.message 
    });
  }
});

// Delete a task
router.delete('/:id', async (req, res) => {
  try {
    const taskId = req.params.id;

    // Find task and ensure it belongs to the user
    const task = await Task.findOne({ _id: taskId, user: req.user._id });
    
    if (!task) {
      return res.status(404).json({ message: 'Task not found' });
    }

    await Task.deleteOne({ _id: taskId });

    // Emit real-time event
    req.io.emit('taskDeleted', {
      taskId,
      userId: req.user._id
    });

    res.json({
      message: 'Task deleted successfully',
      taskId
    });
  } catch (error) {
    console.error('Delete task error:', error.message);
    res.status(500).json({ 
      message: 'Server error while deleting task',
      error: error.message 
    });
  }
});

// Toggle task status
router.patch('/:id/toggle', async (req, res) => {
  try {
    const taskId = req.params.id;

    // Find task and ensure it belongs to the user
    const task = await Task.findOne({ _id: taskId, user: req.user._id });
    
    if (!task) {
      return res.status(404).json({ message: 'Task not found' });
    }

    // Toggle status
    task.status = task.status === 'pending' ? 'completed' : 'pending';
    await task.save();

    // Emit real-time event
    req.io.emit('taskUpdated', {
      task,
      userId: req.user._id
    });

    res.json({
      message: 'Task status toggled successfully',
      task
    });
  } catch (error) {
    console.error('Toggle task error:', error.message);
    res.status(500).json({ 
      message: 'Server error while toggling task',
      error: error.message 
    });
  }
});

module.exports = router;
