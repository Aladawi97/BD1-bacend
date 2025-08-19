const express = require('express');
const router = express.Router();
const db = require('../db');

// Get all offers
router.get('/', async (req, res) => {
    try {
        const result = await db.query(
            'SELECT * FROM offers ORDER BY created_at DESC'
        );
        res.json(result.rows);
    } catch (err) {
        console.error('Error fetching offers:', err);
        res.status(500).json({ error: 'Server error' });
    }
});

// Add new offer
router.post('/', async (req, res) => {
    console.log('Received offer data:', req.body);

    const {
        product_id,
        name,
        description,
        originalPrice,
        discountPercentage,
        discountedPrice,
        stock,
        timeLeft,
        image_url
    } = req.body;

    try {
        // Validate required fields
        if (!product_id || !name || !originalPrice || !discountPercentage || !stock || !timeLeft) {
            return res.status(400).json({ 
                error: 'Missing required fields',
                received: req.body
            });
        }

        // Validate discount percentage
        const discount = parseInt(discountPercentage);
        if (isNaN(discount) || discount < 0 || discount > 99) {
            return res.status(400).json({
                error: 'Invalid discount percentage. Must be between 0 and 99',
                received: discountPercentage
            });
        }

        const result = await db.query(
            `INSERT INTO offers (
                product_id,
                name,
                description,
                original_price,
                discount_percentage,
                discounted_price,
                stock,
                time_left,
                image_url,
                created_at,
                updated_at
            ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, NOW(), NOW())
            RETURNING *`,
            [
                product_id,
                name,
                description || '',
                originalPrice,
                discount, // Using the parsed integer value
                discountedPrice,
                stock,
                timeLeft,
                image_url || null
            ]
        );

        console.log('Offer created successfully:', result.rows[0]);
        res.json(result.rows[0]);
    } catch (err) {
        console.error('Error creating offer:', err);
        res.status(500).json({ 
            error: 'Server error',
            details: err.message,
            stack: err.stack
        });
    }
});

// Update offer
router.put('/:id', async (req, res) => {
    const { id } = req.params;
    const {
        product_id,
        name,
        description,
        originalPrice,
        discountPercentage,
        discountedPrice,
        stock,
        timeLeft,
        image_url
    } = req.body;

    try {
        // Validate discount percentage
        const discount = parseInt(discountPercentage);
        if (isNaN(discount) || discount < 0 || discount > 99) {
            return res.status(400).json({
                error: 'Invalid discount percentage. Must be between 0 and 99',
                received: discountPercentage
            });
        }

        const result = await db.query(
            `UPDATE offers
            SET product_id = $1,
                name = $2,
                description = $3,
                original_price = $4,
                discount_percentage = $5,
                discounted_price = $6,
                stock = $7,
                time_left = $8,
                image_url = $9,
                updated_at = NOW()
            WHERE id = $10
            RETURNING *`,
            [
                product_id,
                name,
                description,
                originalPrice,
                discount, // Using the parsed integer value
                discountedPrice,
                stock,
                timeLeft,
                image_url,
                id
            ]
        );

        if (result.rows.length === 0) {
            return res.status(404).json({ error: 'Offer not found' });
        }

        res.json(result.rows[0]);
    } catch (err) {
        console.error('Error updating offer:', err);
        res.status(500).json({ error: 'Server error' });
    }
});

// Delete offer
router.delete('/:id', async (req, res) => {
    const { id } = req.params;

    try {
        const result = await db.query(
            'DELETE FROM offers WHERE id = $1 RETURNING *',
            [id]
        );

        if (result.rows.length === 0) {
            return res.status(404).json({ error: 'Offer not found' });
        }

        res.json({ message: 'Offer deleted successfully' });
    } catch (err) {
        console.error('Error deleting offer:', err);
        res.status(500).json({ error: 'Server error' });
    }
});

module.exports = router; 