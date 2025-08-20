// const { Pool } = require('pg');
// require('dotenv').config();

// const config = {
//   user: process.env.DB_USER || 'postgres',
//   host: process.env.DB_HOST || 'localhost',
//   database: process.env.DB_NAME || 'ecommerce_db',
//   password: process.env.DB_PASSWORD || 'postgres',
//   port: process.env.DB_PORT || 5432,
// };

// console.log('Database configuration:', {
//   ...config,
//   password: '****' // Hide password in logs
// });

// const pool = new Pool(config);

// // Test the connection and create tables if they don't exist
// const initDatabase = async () => {
//   try {
//     console.log('Attempting to connect to database...');
//     const client = await pool.connect();
//     console.log('Successfully connected to PostgreSQL database');

//     // Test query
//     const testResult = await client.query('SELECT NOW()');
//     console.log('Database test query successful:', testResult.rows[0]);

//     // Check if tables exist
//     const tableCheck = await client.query(`
//       SELECT EXISTS (
//         SELECT FROM information_schema.tables 
//         WHERE table_schema = 'public' 
//         AND table_name = 'products'
//       );
//     `);

//     console.log('Table check result:', tableCheck.rows[0]);

//     if (!tableCheck.rows[0].exists) {
//       console.log('Tables do not exist. Creating tables...');
      
//       // Create tables
//       await client.query(`
//         CREATE TABLE IF NOT EXISTS categories (
//           id SERIAL PRIMARY KEY,
//           name VARCHAR(100) NOT NULL,
//           description TEXT,
//           created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
//         );

//         CREATE TABLE IF NOT EXISTS products (
//           id SERIAL PRIMARY KEY,
//           name VARCHAR(200) NOT NULL,
//           description TEXT,
//           price DECIMAL(10, 2),
//           weight DECIMAL(10, 2),
//           manufacturer VARCHAR(200),
//           image_url VARCHAR(255),
//           stock INTEGER DEFAULT 0,
//           category_id INTEGER REFERENCES categories(id),
//           created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
//         );

//         CREATE TABLE IF NOT EXISTS hero_images (
//           id SERIAL PRIMARY KEY,
//           title VARCHAR(200) NOT NULL,
//           description TEXT,
//           image_url TEXT NOT NULL,
//           button_text VARCHAR(50),
//           button_link TEXT,
//           created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
//         );

//         CREATE TABLE IF NOT EXISTS offers (
//           id SERIAL PRIMARY KEY,
//           product_id INTEGER REFERENCES products(id),
//           name VARCHAR(200) NOT NULL,
//           description TEXT,
//           original_price DECIMAL(10, 2) NOT NULL,
//           discount_percentage DECIMAL(5, 2) NOT NULL,
//           discounted_price DECIMAL(10, 2) NOT NULL,
//           stock INTEGER NOT NULL,
//           time_left VARCHAR(50) NOT NULL,
//           image_url TEXT,
//           created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
//           updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
//         );
//       `);

//       console.log('Tables created successfully. Inserting sample data...');

//       // Insert sample data
//       await client.query(`
//         INSERT INTO categories (name, description) VALUES
//         ('أجهزة كمبيوتر', 'أجهزة كمبيوتر محمولة ومكتبية'),
//         ('هواتف ذكية', 'هواتف ذكية وملحقاتها'),
//         ('أجهزة منزلية', 'أجهزة كهربائية منزلية'),
//         ('أدوات مطبخ', 'مستلزمات وأدوات المطبخ'),
//         ('إلكترونيات', 'إلكترونيات متنوعة');

//         INSERT INTO products (name, description, price, weight, manufacturer, stock, category_id) VALUES
//         ('لابتوب ديل XPS', 'لابتوب احترافي مع معالج قوي وشاشة عالية الدقة', 1299.99, 1.8, 'Dell', 25, 1),
//         ('آيفون 15 برو', 'أحدث إصدار من هواتف آيفون مع كاميرا متطورة', 999.99, 0.2, 'Apple', 50, 2),
//         ('خلاط كهربائي', 'خلاط كهربائي متعدد السرعات', 79.99, 2.5, 'Philips', 30, 4),
//         ('مكيف سبليت', 'مكيف هواء سبليت موفر للطاقة', 599.99, 12.0, 'Samsung', 15, 3),
//         ('سماعات بلوتوث', 'سماعات لاسلكية مع جودة صوت عالية', 149.99, 0.1, 'Sony', 100, 5);
//       `);

//       console.log('Sample data inserted successfully');
//     } else {
//       console.log('Tables already exist. Checking data...');
      
//       // Check if there are any categories
//       const categoriesCheck = await client.query('SELECT COUNT(*) FROM categories');
//       console.log('Categories count:', categoriesCheck.rows[0].count);
      
//       // Check if there are any products
//       const productsCheck = await client.query('SELECT COUNT(*) FROM products');
//       console.log('Products count:', productsCheck.rows[0].count);
//     }

//     client.release();
//   } catch (err) {
//     console.error('Database initialization error:', err);
//     throw err; // Re-throw the error to handle it in the server
//   }
// };

// // Initialize database
// initDatabase().catch(err => {
//   console.error('Failed to initialize database:', err);
//   process.exit(1); // Exit if database initialization fails
// });

// module.exports = pool; 
const express = require('express');
const router = express.Router();
const pool = require('../db');
const multer = require('multer');
const path = require('path');
const fs = require('fs');

// التأكد من وجود مجلد uploads
const uploadsDir = './uploads';
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir);
}

// تكوين multer لتخزين الصور
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, uploadsDir);
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, uniqueSuffix + path.extname(file.originalname));
  }
});

const upload = multer({ 
  storage: storage,
  fileFilter: function (req, file, cb) {
    const filetypes = /jpeg|jpg|png|gif/;
    const mimetype = filetypes.test(file.mimetype);
    const extname = filetypes.test(path.extname(file.originalname).toLowerCase());

    if (mimetype && extname) {
      return cb(null, true);
    }
    cb(new Error('يرجى رفع صور فقط'));
  }
});

// CORS configuration to allow access from Vercel front-end
const cors = require('cors');
router.use(cors({
  origin: ['https://bd-1-omega.vercel.app'],  // رابط الـ front-end على Vercel
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type']
}));

// Get all products
router.get('/', async (req, res) => {
  try {
    const result = await pool.query(`
      SELECT p.*, c.name as category_name 
      FROM products p 
      LEFT JOIN categories c ON p.category_id = c.id
      ORDER BY p.created_at DESC
    `);
    res.json(result.rows);
  } catch (err) {
    console.error('Error fetching products:', err);
    res.status(500).json({ message: err.message });
  }
});

// Get single product
router.get('/:id', async (req, res) => {
  try {
    const result = await pool.query(
      'SELECT p.*, c.name as category_name FROM products p LEFT JOIN categories c ON p.category_id = c.id WHERE p.id = $1',
      [req.params.id]
    );
    if (result.rows.length === 0) {
      return res.status(404).json({ message: 'المنتج غير موجود' });
    }
    res.json(result.rows[0]);
  } catch (err) {
    console.error('Error fetching product:', err);
    res.status(500).json({ message: err.message });
  }
});

// Create new product
router.post('/', async (req, res) => {
  const { name, description, price, weight, manufacturer, stock, category_id, image_url } = req.body;
  try {
    const result = await pool.query(
      `INSERT INTO products 
       (name, description, price, weight, manufacturer, stock, category_id, image_url) 
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8) 
       RETURNING *`,
      [name, description, price, weight, manufacturer, stock, category_id, image_url]
    );
    res.status(201).json(result.rows[0]);
  } catch (err) {
    console.error('Error creating product:', err);
    res.status(500).json({ message: err.message });
  }
});

// Update product
router.put('/:id', async (req, res) => {
  const { name, description, price, weight, manufacturer, stock, category_id, image_url } = req.body;
  try {
    const result = await pool.query(
      `UPDATE products 
       SET name = $1, description = $2, price = $3, weight = $4, 
           manufacturer = $5, stock = $6, category_id = $7, image_url = $8
       WHERE id = $9 
       RETURNING *`,
      [name, description, price, weight, manufacturer, stock, category_id, image_url, req.params.id]
    );
    
    if (result.rows.length === 0) {
      return res.status(404).json({ message: 'المنتج غير موجود' });
    }
    
    res.json(result.rows[0]);
  } catch (err) {
    console.error('Error updating product:', err);
    res.status(500).json({ message: err.message });
  }
});

// Delete product
router.delete('/:id', async (req, res) => {
  try {
    const result = await pool.query('DELETE FROM products WHERE id = $1 RETURNING *', [req.params.id]);
    if (result.rows.length === 0) {
      return res.status(404).json({ message: 'المنتج غير موجود' });
    }
    res.json({ message: 'تم حذف المنتج بنجاح' });
  } catch (err) {
    console.error('Error deleting product:', err);
    res.status(500).json({ message: err.message });
  }
});

// Upload product image
router.post('/upload', upload.single('image'), (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: 'لم يتم اختيار صورة' });
    }
    
    const imageUrl = `${req.protocol}://${req.get('host')}/uploads/${req.file.filename}`;
    res.json({ imageUrl });
  } catch (err) {
    console.error('Error in upload:', err);
    res.status(500).json({ message: err.message });
  }
});

// Get products by category
router.get('/category/:categoryId', async (req, res) => {
  try {
    const result = await pool.query(`
      SELECT p.*, c.name as category_name 
      FROM products p 
      LEFT JOIN categories c ON p.category_id = c.id 
      WHERE p.category_id = $1
    `, [req.params.categoryId]);
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
