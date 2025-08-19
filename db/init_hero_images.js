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

async function createHeroImagesTable() {
    try {
        console.log('Creating hero_images table...');
        
        await pool.query(`
            CREATE TABLE IF NOT EXISTS hero_images (
                id SERIAL PRIMARY KEY,
                title VARCHAR(200) NOT NULL,
                description TEXT,
                image_url TEXT NOT NULL,
                button_text VARCHAR(50),
                button_link TEXT,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            )
        `);
        
        console.log('hero_images table created successfully');
    } catch (err) {
        console.error('Error creating hero_images table:', err);
    } finally {
        await pool.end();
    }
}

createHeroImagesTable(); 