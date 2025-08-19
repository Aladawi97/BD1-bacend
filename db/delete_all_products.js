const { Pool } = require('pg');
require('dotenv').config();

const config = {
    user: process.env.DB_USER || 'postgres',
    host: process.env.DB_HOST || 'localhost',
    database: process.env.DB_NAME || 'ecommerce_db',
    password: process.env.DB_PASSWORD || 'postgres',
    port: process.env.DB_PORT || 5432,
};

const pool = new Pool(config);

async function deleteAllProducts() {
    let client;
    try {
        console.log('Attempting to connect to database...');
        client = await pool.connect();
        console.log('Successfully connected to PostgreSQL database');

        // Delete all products
        await client.query('DELETE FROM products');
        
        // Reset the products id sequence
        await client.query('ALTER SEQUENCE products_id_seq RESTART WITH 1');

        console.log('All products have been successfully deleted');
        
        // Verify that products were deleted
        const result = await client.query('SELECT COUNT(*) FROM products');
        console.log('Number of products remaining:', result.rows[0].count);

    } catch (error) {
        console.error('Error deleting products:', error);
    } finally {
        if (client) {
            client.release();
        }
        await pool.end();
    }
}

deleteAllProducts(); 