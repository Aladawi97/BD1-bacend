const express = require('express');
const router = express.Router();
const pool = require('../db');

// Get all categories
router.get('/', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM categories');
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Delete all categories
router.delete('/deleteAll', async (req, res) => {
  try {
    // First, update products to remove category references
    await pool.query('UPDATE products SET category_id = NULL');
    // Then delete all categories
    await pool.query('DELETE FROM categories');
    res.json({ message: 'All categories deleted successfully' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Add multiple categories
router.post('/bulk', async (req, res) => {
  try {
    const { categories } = req.body;
    if (!categories || !Array.isArray(categories)) {
      return res.status(400).json({ message: 'Invalid categories data' });
    }

    const values = categories.map(cat => [cat.name, cat.description]);
    const result = await pool.query(
      'INSERT INTO categories (name, description) VALUES ? RETURNING *',
      [values]
    );

    res.status(201).json({ 
      message: 'Categories added successfully',
      count: result.rows.length 
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Get single category
router.get('/:id', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM categories WHERE id = $1', [req.params.id]);
    if (result.rows.length === 0) {
      return res.status(404).json({ message: 'الفئة غير موجودة' });
    }
    res.json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Create category
router.post('/', async (req, res) => {
  const { name, description } = req.body;
  try {
    const result = await pool.query(
      'INSERT INTO categories (name, description) VALUES ($1, $2) RETURNING *',
      [name, description]
    );
    res.status(201).json(result.rows[0]);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// Update category
router.put('/:id', async (req, res) => {
  const { name, description } = req.body;
  try {
    const result = await pool.query(
      'UPDATE categories SET name = $1, description = $2 WHERE id = $3 RETURNING *',
      [name, description, req.params.id]
    );
    if (result.rows.length === 0) {
      return res.status(404).json({ message: 'الفئة غير موجودة' });
    }
    res.json(result.rows[0]);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// Delete category
router.delete('/:id', async (req, res) => {
  try {
    const result = await pool.query('DELETE FROM categories WHERE id = $1 RETURNING *', [req.params.id]);
    if (result.rows.length === 0) {
      return res.status(404).json({ message: 'الفئة غير موجودة' });
    }
    res.json({ message: 'تم حذف الفئة بنجاح' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router; 