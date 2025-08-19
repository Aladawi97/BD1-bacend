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