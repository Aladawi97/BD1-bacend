DROP DATABASE IF EXISTS ecommerce_db;
CREATE DATABASE ecommerce_db;

\c ecommerce_db;

-- Create categories table
CREATE TABLE IF NOT EXISTS categories (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    description TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create products table
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

-- Create users table
CREATE TABLE IF NOT EXISTS users (
    id SERIAL PRIMARY KEY,
    username VARCHAR(50) UNIQUE NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    full_name VARCHAR(100),
    address TEXT,
    phone VARCHAR(20),
    role VARCHAR(10) DEFAULT 'user' CHECK (role IN ('user', 'admin')),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create orders table
CREATE TABLE IF NOT EXISTS orders (
    id SERIAL PRIMARY KEY,
    user_id INTEGER NOT NULL REFERENCES users(id),
    total_amount DECIMAL(10, 2),
    status VARCHAR(20) DEFAULT 'pending' CHECK (status IN ('pending', 'processing', 'shipped', 'delivered', 'cancelled')),
    shipping_address TEXT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create order_items table
CREATE TABLE IF NOT EXISTS order_items (
    id SERIAL PRIMARY KEY,
    order_id INTEGER NOT NULL REFERENCES orders(id),
    product_id INTEGER NOT NULL REFERENCES products(id),
    quantity INTEGER NOT NULL,
    price DECIMAL(10, 2)
);

-- Insert sample categories
INSERT INTO categories (name, description) VALUES
('إلكترونيات', 'الأجهزة الإلكترونية وملحقاتها'),
('إكسسوارات', 'إكسسوارات متنوعة للأجهزة');

-- Insert sample products
INSERT INTO products (name, description, price, category_id, stock) VALUES
('سماعات بلوتوث لاسلكية', 'سماعات عالية الجودة مع عزل للضوضاء وبطارية تدوم طويلاً', 129.99, 1, 50),
('ساعة ذكية رياضية', 'ساعة ذكية لتتبع النشاط البدني مع شاشة عالية الدقة', 199.99, 1, 30),
('حقيبة ظهر للحاسوب', 'حقيبة عصرية مقاومة للماء مع حماية للحاسوب المحمول', 59.99, 2, 100),
('كاميرا رقمية احترافية', 'كاميرا عالية الدقة مع ميزات متقدمة للتصوير الاحترافي', 699.99, 1, 20); 