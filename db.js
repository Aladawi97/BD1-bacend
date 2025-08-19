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

// Test the connection and create tables if they don't exist
const initDatabase = async () => {
  try {
    console.log('Attempting to connect to database...');
    const client = await pool.connect();
    console.log('Successfully connected to PostgreSQL database');

    // Test query
    const testResult = await client.query('SELECT NOW()');
    console.log('Database test query successful:', testResult.rows[0]);

    // Check if tables exist
    const tableCheck = await client.query(`
      SELECT EXISTS (
        SELECT FROM information_schema.tables 
        WHERE table_schema = 'public' 
        AND table_name = 'products'
      );
    `);

    console.log('Table check result:', tableCheck.rows[0]);

    if (!tableCheck.rows[0].exists) {
      console.log('Tables do not exist. Creating tables...');
      
      // Create tables
      await client.query(`
        CREATE TABLE IF NOT EXISTS categories (
          id SERIAL PRIMARY KEY,
          name VARCHAR(100) NOT NULL,
          description TEXT,
          created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        );

        CREATE TABLE IF NOT EXISTS products (
          id SERIAL PRIMARY KEY,
          name VARCHAR(200) NOT NULL,
          description TEXT,
          price DECIMAL(10, 2),
          weight DECIMAL(10, 2),
          manufacturer VARCHAR(200),
          image_url VARCHAR(255),
          stock INTEGER DEFAULT 0,
          category_id INTEGER REFERENCES categories(id),
          created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        );

        CREATE TABLE IF NOT EXISTS hero_images (
          id SERIAL PRIMARY KEY,
          title VARCHAR(200) NOT NULL,
          description TEXT,
          image_url TEXT NOT NULL,
          button_text VARCHAR(50),
          button_link TEXT,
          created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        );

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

      console.log('Tables created successfully. Inserting sample data...');

      // Insert sample data
      await client.query(`
        INSERT INTO categories (name, description) VALUES
        ('أجهزة كمبيوتر', 'أجهزة كمبيوتر محمولة ومكتبية'),
        ('هواتف ذكية', 'هواتف ذكية وملحقاتها'),
        ('أجهزة منزلية', 'أجهزة كهربائية منزلية'),
        ('أدوات مطبخ', 'مستلزمات وأدوات المطبخ'),
        ('إلكترونيات', 'إلكترونيات متنوعة');

        INSERT INTO products (name, description, price, weight, manufacturer, stock, category_id) VALUES
        ('لابتوب ديل XPS', 'لابتوب احترافي مع معالج قوي وشاشة عالية الدقة', 1299.99, 1.8, 'Dell', 25, 1),
        ('آيفون 15 برو', 'أحدث إصدار من هواتف آيفون مع كاميرا متطورة', 999.99, 0.2, 'Apple', 50, 2),
        ('خلاط كهربائي', 'خلاط كهربائي متعدد السرعات', 79.99, 2.5, 'Philips', 30, 4),
        ('مكيف سبليت', 'مكيف هواء سبليت موفر للطاقة', 599.99, 12.0, 'Samsung', 15, 3),
        ('سماعات بلوتوث', 'سماعات لاسلكية مع جودة صوت عالية', 149.99, 0.1, 'Sony', 100, 5);
      `);

      console.log('Sample data inserted successfully');
    } else {
      console.log('Tables already exist. Checking data...');
      
      // Check if there are any categories
      const categoriesCheck = await client.query('SELECT COUNT(*) FROM categories');
      console.log('Categories count:', categoriesCheck.rows[0].count);
      
      // Check if there are any products
      const productsCheck = await client.query('SELECT COUNT(*) FROM products');
      console.log('Products count:', productsCheck.rows[0].count);
    }

    client.release();
  } catch (err) {
    console.error('Database initialization error:', err);
    throw err; // Re-throw the error to handle it in the server
  }
};

// Initialize database
initDatabase().catch(err => {
  console.error('Failed to initialize database:', err);
  process.exit(1); // Exit if database initialization fails
});

module.exports = pool; 