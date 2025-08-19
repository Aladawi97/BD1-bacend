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

const createOffersTable = async () => {
  try {
    const client = await pool.connect();
    console.log('Successfully connected to PostgreSQL database');

    // Create offers table
    await client.query(`
      CREATE TABLE IF NOT EXISTS offers (
        id SERIAL PRIMARY KEY,
        product_id INTEGER REFERENCES products(id),
        name VARCHAR(200) NOT NULL,
        description TEXT,
        original_price DECIMAL(10, 2) NOT NULL,
        discount_percentage DECIMAL(5, 2) NOT NULL,
        discounted_price DECIMAL(10, 2) NOT NULL,
        stock INTEGER NOT NULL,
        time_left VARCHAR(50) NOT NULL,
        image_url TEXT,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `);

    console.log('Offers table created successfully');
    client.release();
    process.exit(0);
  } catch (err) {
    console.error('Error creating offers table:', err);
    process.exit(1);
  }
};

createOffersTable(); 