const { Pool } = require('pg');
require('dotenv').config();

const pool = new Pool({
    user: process.env.DB_USER || 'postgres',
    host: process.env.DB_HOST || 'localhost',
    database: process.env.DB_NAME || 'ecommerce_db',
    password: process.env.DB_PASSWORD || 'admin',
    port: process.env.DB_PORT || 5432,
});

async function updateCategories() {
    try {
        // حذف التصنيفات القديمة وإعادة ضبط التسلسل
        await pool.query('TRUNCATE categories CASCADE');
        await pool.query('ALTER SEQUENCE categories_id_seq RESTART WITH 1');

        // إضافة التصنيفات الجديدة
        const result = await pool.query(`
            INSERT INTO categories (name, description) 
            VALUES 
                ('أسماك', 'تشكيلة متنوعة من الأسماك الطازجة'),
                ('أرز', 'أنواع مختلفة من الأرز عالي الجودة'),
                ('بهارات', 'تشكيلة واسعة من البهارات الطازجة'),
                ('بسكوتات', 'مجموعة متنوعة من البسكويت والحلويات'),
                ('عصائر', 'عصائر طبيعية ومشروبات منعشة'),
                ('بقوليات', 'بقوليات طازجة ومتنوعة'),
                ('مكسرات', 'تشكيلة فاخرة من المكسرات الطازجة')
            RETURNING *
        `);

        console.log('تم تحديث التصنيفات بنجاح:', result.rows);
    } catch (error) {
        console.error('حدث خطأ أثناء تحديث التصنيفات:', error);
    } finally {
        await pool.end();
    }
}

updateCategories(); 