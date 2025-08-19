DROP DATABASE IF EXISTS ecommerce_db;
CREATE DATABASE ecommerce_db;
USE ecommerce_db;

-- Create categories table
CREATE TABLE categories (
    id INT PRIMARY KEY AUTO_INCREMENT,
    name VARCHAR(100) NOT NULL,
    description TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create products table
CREATE TABLE products (
    id INT PRIMARY KEY AUTO_INCREMENT,
    name VARCHAR(200) NOT NULL,
    description TEXT,
    price DECIMAL(10, 2),
    weight DECIMAL(10, 2),
    manufacturer VARCHAR(200),
    image_url VARCHAR(255),
    stock INT DEFAULT 0,
    category_id INT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (category_id) REFERENCES categories(id)
);

-- Insert sample categories
INSERT INTO categories (name, description) VALUES
('أسماك', 'جميع أنواع الأسماك الطازجة والمجمدة'),
('أرز', 'تشكيلة متنوعة من الأرز بأنواعه'),
('بهارات', 'بهارات طازجة وعالية الجودة'),
('بسكوتات', 'تشكيلة واسعة من البسكويت والحلويات'),
('عصائر', 'عصائر طبيعية ومشروبات منعشة'),
('بقوليات', 'بقوليات طازجة ومجففة بأنواعها'); 