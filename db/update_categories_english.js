const { Pool } = require('pg');
require('dotenv').config();

const config = {
    user: process.env.DB_USER || 'postgres',
    host: process.env.DB_HOST || 'localhost',
    database: process.env.DB_NAME || 'ecommerce_db',
    password: process.env.DB_PASSWORD || 'postgres',
    port: process.env.DB_PORT || 5432,
};

console.log('Database configuration:', {
    ...config,
    password: '****' // Hide password in logs
});

const pool = new Pool(config);

async function updateCategoriesToEnglish() {
    let client;
    try {
        console.log('Attempting to connect to database...');
        client = await pool.connect();
        console.log('Successfully connected to PostgreSQL database');

        // Delete old categories and reset sequence
        await client.query('TRUNCATE categories CASCADE');
        await client.query('ALTER SEQUENCE categories_id_seq RESTART WITH 1');

        // Add new categories in English
        const result = await client.query(`
            INSERT INTO categories (name, description) 
            VALUES 
                ('Fish', 'Various selection of fresh fish'),
                ('Rice', 'Different types of high-quality rice'),
                ('Spices', 'Wide variety of fresh spices'),
                ('Biscuits', 'Various selection of biscuits and sweets'),
                ('Beverages', 'Natural juices and refreshing drinks'),
                ('Legumes', 'Fresh and varied legumes'),
                ('Nuts', 'Premium selection of fresh nuts')
            RETURNING *
        `);

        console.log('Categories have been successfully updated to English:', result.rows);
    } catch (error) {
        console.error('Error updating categories:', error);
    } finally {
        if (client) {
            client.release();
        }
        await pool.end();
    }
}

updateCategoriesToEnglish(); 