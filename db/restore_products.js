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

async function restoreProducts() {
    let client;
    try {
        console.log('Attempting to connect to database...');
        client = await pool.connect();
        console.log('Successfully connected to PostgreSQL database');

        // Add sample products with the new category IDs
        const result = await client.query(`
            INSERT INTO products (name, description, price, weight, manufacturer, stock, category_id) 
            VALUES 
                ('Fresh Salmon', 'Premium quality fresh salmon', 29.99, 1.0, 'Ocean Fresh', 50, 1),
                ('Fresh Tuna', 'High-quality tuna fish', 24.99, 1.0, 'Ocean Fresh', 40, 1),
                ('Basmati Rice', 'Premium long-grain basmati rice', 9.99, 5.0, 'Rice Master', 100, 2),
                ('Jasmine Rice', 'Fragrant jasmine rice', 8.99, 5.0, 'Rice Master', 100, 2),
                ('Black Pepper', 'Freshly ground black pepper', 4.99, 0.2, 'Spice World', 200, 3),
                ('Cinnamon', 'Premium quality cinnamon', 3.99, 0.1, 'Spice World', 150, 3),
                ('Chocolate Cookies', 'Delicious chocolate cookies', 5.99, 0.3, 'Sweet Delights', 80, 4),
                ('Butter Biscuits', 'Classic butter biscuits', 4.99, 0.25, 'Sweet Delights', 100, 4),
                ('Orange Juice', 'Fresh squeezed orange juice', 3.99, 1.0, 'Fresh Drinks', 60, 5),
                ('Apple Juice', 'Natural apple juice', 3.99, 1.0, 'Fresh Drinks', 60, 5),
                ('Lentils', 'Premium quality red lentils', 6.99, 1.0, 'Legume Master', 120, 6),
                ('Chickpeas', 'Organic chickpeas', 5.99, 1.0, 'Legume Master', 100, 6),
                ('Almonds', 'Fresh roasted almonds', 12.99, 0.5, 'Nut House', 80, 7),
                ('Mixed Nuts', 'Premium mixed nuts selection', 15.99, 0.5, 'Nut House', 70, 7)
            RETURNING *
        `);

        console.log('Products have been successfully restored:', result.rows);
    } catch (error) {
        console.error('Error restoring products:', error);
    } finally {
        if (client) {
            client.release();
        }
        await pool.end();
    }
}

restoreProducts(); 