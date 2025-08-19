const express = require('express');
const router = express.Router();
const db = require('../db'); // الاتصال بقاعدة البيانات

// جلب بيانات الفوتر
router.get('/', async (req, res) => {
  try {
    const result = await db.query('SELECT * FROM footer ORDER BY id LIMIT 1');
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Footer data not found' });
    }
    res.json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch footer data' });
  }
});

// تحديث بيانات الفوتر
router.post('/', async (req, res) => {
  // دعم camelCase وsnake_case
  const {
    aboutUs, about_us,
    contactEmail, contact_email,
    contactPhone, contact_phone,
    facebook, twitter, instagram
  } = req.body;
  try {
    await db.query(
      `UPDATE footer SET 
        about_us = $1, 
        contact_email = $2, 
        contact_phone = $3, 
        facebook = $4, 
        twitter = $5, 
        instagram = $6
      WHERE id = 1`,
      [
        aboutUs || about_us,
        contactEmail || contact_email,
        contactPhone || contact_phone,
        facebook,
        twitter,
        instagram
      ]
    );
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: 'Failed to update footer data' });
  }
});

module.exports = router; 