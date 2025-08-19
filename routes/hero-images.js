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
        console.log('Uploading file to:', uploadsDir);
        cb(null, uploadsDir);
    },
    filename: function (req, file, cb) {
        // تنظيف اسم الملف وإزالة الأحرف غير المرغوب فيها
        const originalname = file.originalname.replace(/[^a-zA-Z0-9.]/g, '');
        const extension = path.extname(originalname).toLowerCase();
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        const filename = 'hero-' + uniqueSuffix + extension;
        console.log('Original file:', file.originalname);
        console.log('Clean filename:', filename);
        cb(null, filename);
    }
});

const fileFilter = (req, file, cb) => {
    console.log('File type check:', file.mimetype);
    // التحقق من نوع الملف
    const allowedMimes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif'];
    if (allowedMimes.includes(file.mimetype)) {
        cb(null, true);
    } else {
        cb(new Error('نوع الملف غير مدعوم. الأنواع المدعومة هي: JPG, JPEG, PNG, GIF'), false);
    }
};

const upload = multer({
    storage: storage,
    limits: {
        fileSize: 5 * 1024 * 1024 // 5MB limit
    },
    fileFilter: fileFilter
});

// الحصول على جميع الصور
router.get('/', async (req, res) => {
    try {
        console.log('Fetching hero images...');
        const result = await pool.query('SELECT * FROM hero_images ORDER BY created_at DESC');
        console.log('Hero images fetched:', result.rows);
        res.json(result.rows);
    } catch (err) {
        console.error('Error fetching hero images:', err);
        res.status(500).json({ message: 'حدث خطأ أثناء جلب الصور: ' + err.message });
    }
});

// إضافة صورة جديدة
router.post('/', async (req, res) => {
    console.log('Received POST request to /api/hero-images');
    console.log('Request body:', req.body);
    
    const { title, description, button_text, button_link, image_url } = req.body;
    
    try {
        // التحقق من البيانات المطلوبة
        if (!title || !description || !image_url) {
            console.error('Missing required fields:', { title, description, image_url });
            return res.status(400).json({ message: 'جميع الحقول المطلوبة يجب ملؤها' });
        }

        // التحقق من طول البيانات
        if (title.length > 200) {
            return res.status(400).json({ message: 'عنوان الصورة طويل جداً' });
        }

        if (button_text && button_text.length > 50) {
            return res.status(400).json({ message: 'نص الزر طويل جداً' });
        }

        console.log('Inserting data into database...');
        const result = await pool.query(
            `INSERT INTO hero_images (title, description, button_text, button_link, image_url) 
             VALUES ($1, $2, $3, $4, $5) 
             RETURNING *`,
            [title, description, button_text, button_link, image_url]
        );
        
        console.log('Data inserted successfully:', result.rows[0]);
        res.status(201).json(result.rows[0]);
    } catch (err) {
        console.error('Error creating hero image:', err);
        res.status(500).json({ message: 'حدث خطأ أثناء حفظ البيانات: ' + err.message });
    }
});

// رفع صورة
router.post('/upload', upload.single('image'), (req, res) => {
    try {
        console.log('Upload request received');
        if (!req.file) {
            console.error('No file uploaded');
            return res.status(400).json({ message: 'لم يتم اختيار صورة' });
        }
        
        const imageUrl = `${req.protocol}://${req.get('host')}/uploads/${req.file.filename}`;
        console.log('File uploaded successfully:', imageUrl);
        res.json({ imageUrl });
    } catch (err) {
        console.error('Error in upload:', err);
        if (err instanceof multer.MulterError) {
            if (err.code === 'LIMIT_FILE_SIZE') {
                return res.status(400).json({ message: 'حجم الصورة يجب أن يكون أقل من 5 ميجابايت' });
            }
        }
        res.status(500).json({ message: err.message || 'حدث خطأ أثناء رفع الصورة' });
    }
});

// حذف صورة
router.delete('/:id', async (req, res) => {
    try {
        // الحصول على معلومات الصورة قبل حذفها
        const imageResult = await pool.query('SELECT image_url FROM hero_images WHERE id = $1', [req.params.id]);
        if (imageResult.rows.length > 0) {
            const imageUrl = imageResult.rows[0].image_url;
            const filename = path.basename(imageUrl);
            const filepath = path.join(uploadsDir, filename);
            
            // حذف الملف إذا كان موجوداً
            if (fs.existsSync(filepath)) {
                fs.unlinkSync(filepath);
            }
        }

        // حذف السجل من قاعدة البيانات
        const result = await pool.query('DELETE FROM hero_images WHERE id = $1 RETURNING *', [req.params.id]);
        if (result.rows.length === 0) {
            return res.status(404).json({ message: 'الصورة غير موجودة' });
        }
        res.json({ message: 'تم حذف الصورة بنجاح' });
    } catch (err) {
        console.error('Error deleting hero image:', err);
        res.status(500).json({ message: 'حدث خطأ أثناء حذف الصورة' });
    }
});

module.exports = router; 