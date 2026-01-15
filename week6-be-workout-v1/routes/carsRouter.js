 const express = require('express');
const router = express.Router();
const Car = require('../models/Cars');

/**
 * POST /api/cars
 * Creates a car
 */
router.post('/', async (req, res) => {
  try {
    const car = new Car(req.body);
    const savedCar = await car.save();
    res.status(201).json(savedCar);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

/**
 * GET /api/cars
 * Returns list of cars
 * Optional query support:
 *  ?brand=Toyota
 *  ?minYear=2015
 *  ?available=true
 */
router.get('/', async (req, res) => {
  try {
    const { brand, minYear, available } = req.query;

    const filter = {};

    if (brand) {
      filter.brand = brand;
    }

    if (minYear) {
      filter.year = { $gte: Number(minYear) };
    }

    if (available !== undefined) {
      filter.isAvailable = available === 'true';
    }

    const cars = await Car.find(filter);
    res.json(cars);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

/**
 * GET /api/cars/:id
 * Returns one car
 */
router.get('/:id', async (req, res) => {
  try {
    const car = await Car.findById(req.params.id);
    if (!car) {
      return res.status(404).json({ message: 'Car not found' });
    }
    res.json(car);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

/**
 * PATCH /api/cars/:id
 * Updates allowed fields only
 */
router.patch('/:id', async (req, res) => {
  const allowedUpdates = [
    'brand',
    'model',
    'year',
    'price',
    'isAvailable',
    'owner',
  ];

  const updates = Object.keys(req.body);
  const isValidOperation = updates.every(field =>
    allowedUpdates.includes(field)
  );

  if (!isValidOperation) {
    return res.status(400).json({ message: 'Invalid update fields' });
  }

  try {
    const car = await Car.findById(req.params.id);
    if (!car) {
      return res.status(404).json({ message: 'Car not found' });
    }

    updates.forEach(field => {
      car[field] = req.body[field];
    });

    await car.save();
    res.json(car);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

/**
 * DELETE /api/cars/:id
 * Deletes the car
 */
router.delete('/:id', async (req, res) => {
  try {
    const deletedCar = await Car.findByIdAndDelete(req.params.id);
    if (!deletedCar) {
      return res.status(404).json({ message: 'Car not found' });
    }
    res.json({ message: 'Car deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
