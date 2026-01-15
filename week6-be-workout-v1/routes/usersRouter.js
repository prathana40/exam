 const express = require('express');
const router = express.Router();
const User = require('../models/User');

/**
 * POST /api/users
 * Creates a user
 * Returns created user JSON
 */
router.post('/', async (req, res) => {
  try {
    const user = new User(req.body);
    const savedUser = await user.save();
    res.status(201).json(savedUser);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

/**
 * GET /api/users
 * Returns list of users
 * Optional query support:
 *  ?role=student
 *  ?minAge=18
 */
router.get('/', async (req, res) => {
  try {
    const { role, minAge } = req.query;
    const filter = {};

    if (role) {
      filter.role = role;
    }

    if (minAge) {
      filter.age = { $gte: Number(minAge) };
    }

    const users = await User.find(filter);
    res.json(users);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

/**
 * GET /api/users/:id
 * Returns one user by id
 */
router.get('/:id', async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    res.json(user);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

/**
 * PATCH /api/users/:id
 * Updates allowed fields only
 * Email updates are NOT allowed
 */
router.patch('/:id', async (req, res) => {
  const allowedUpdates = ['name', 'age', 'role'];
  const updates = Object.keys(req.body);

  const isValidOperation = updates.every(field =>
    allowedUpdates.includes(field)
  );

  if (!isValidOperation) {
    return res.status(400).json({
      message: 'Invalid updates. Only name, age, and role can be updated.',
    });
  }

  try {
    const user = await User.findById(req.params.id);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    updates.forEach(field => {
      user[field] = req.body[field];
    });

    await user.save();
    res.json(user);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

/**
 * DELETE /api/users/:id
 * Deletes the user
 */
router.delete('/:id', async (req, res) => {
  try {
    const deletedUser = await User.findByIdAndDelete(req.params.id);
    if (!deletedUser) {
      return res.status(404).json({ message: 'User not found' });
    }
    res.json({ message: 'User deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
