-- إنشاء جدول التصنيفات
CREATE TABLE IF NOT EXISTS categories (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    description TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- إنشاء جدول المنتجات
CREATE TABLE IF NOT EXISTS products (
    id SERIAL PRIMARY KEY,
    name VARCHAR(200) NOT NULL,
    description TEXT,
    price DECIMAL(10,2) NOT NULL,
    stock INTEGER NOT NULL DEFAULT 0,
    image_url TEXT,
    category_id INTEGER REFERENCES categories(id),
    weight DECIMAL(10,2),
    manufacturer VARCHAR(100),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- إنشاء جدول صور العرض الرئيسية
CREATE TABLE IF NOT EXISTS hero_images (
    id SERIAL PRIMARY KEY,
    title VARCHAR(200) NOT NULL,
    description TEXT,
    image_url TEXT NOT NULL,
    button_text VARCHAR(50),
    button_link TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- إنشاء جدول الفوتر إذا لم يكن موجوداً
CREATE TABLE IF NOT EXISTS footer (
    id SERIAL PRIMARY KEY,
    about_us TEXT,
    contact_email VARCHAR(255),
    contact_phone VARCHAR(50),
    facebook VARCHAR(255),
    twitter VARCHAR(255),
    instagram VARCHAR(255)
);

-- إدخال صف افتراضي للفوتر إذا لم يكن موجوداً
DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM footer WHERE id = 1) THEN
        INSERT INTO footer (id, about_us, contact_email, contact_phone, facebook, twitter, instagram)
        VALUES (
            1,
            'Your trusted online store for quality products.',
            'info@store.com',
            '+1234567890',
            'https://facebook.com/yourpage',
            'https://twitter.com/yourprofile',
            'https://instagram.com/yourprofile'
        );
    END IF;
END $$;

-- حذف التصنيفات القديمة وإضافة التصنيفات الجديدة
TRUNCATE categories CASCADE;
ALTER SEQUENCE categories_id_seq RESTART WITH 1;

-- إضافة التصنيفات الجديدة
INSERT INTO categories (name, description) 
VALUES 
    ('أسماك', 'تشكيلة متنوعة من الأسماك الطازجة'),
    ('أرز', 'أنواع مختلفة من الأرز عالي الجودة'),
    ('بهارات', 'تشكيلة واسعة من البهارات الطازجة'),
    ('بسكوتات', 'مجموعة متنوعة من البسكويت والحلويات'),
    ('عصائر', 'عصائر طبيعية ومشروبات منعشة'),
    ('بقوليات', 'بقوليات طازجة ومتنوعة'),
    ('مكسرات', 'تشكيلة فاخرة من المكسرات الطازجة'); 