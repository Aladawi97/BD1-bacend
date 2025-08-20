// const express = require('express');
// const cors = require('cors');
// const path = require('path');
// require('dotenv').config();

// const app = express();

// // CORS configuration
// app.use(cors({
//   origin: ['http://localhost:3000', 'http://localhost:5000', 'https://bd-1-omega.vercel.app'],  // إضافة رابط الـ front-end من Vercel
//   methods: ['GET', 'POST', 'PUT', 'DELETE'],
//   allowedHeaders: ['Content-Type']
// }));
// // Middleware
// app.use(express.json());
// app.use(express.urlencoded({ extended: true }));

// // إتاحة الوصول إلى المجلدات العامة
// app.use(express.static(path.join(__dirname, 'public')));
// app.use('/uploads', express.static(path.join(__dirname, 'uploads')));
// app.use('/server/uploads', express.static(path.join(__dirname, 'uploads')));

// // إنشاء مجلد الصور إذا لم يكن موجوداً
// const uploadsPath = path.join(__dirname, 'uploads');
// if (!require('fs').existsSync(uploadsPath)) {
//     require('fs').mkdirSync(uploadsPath);
// }
// console.log('Uploads directory path:', uploadsPath);

// // Routes (بعد تفعيل middleware)
// app.use('/api/auth', require('./routes/users'));
// app.use('/api/products', require('./routes/products'));
// app.use('/api/categories', require('./routes/categories'));
// app.use('/api/users', require('./routes/users'));
// app.use('/api/orders', require('./routes/orders'));
// app.use('/api/hero-images', require('./routes/hero-images'));
// app.use('/api/offers', require('./routes/offers'));
// app.use('/api/footer', require('./routes/footer'));

// // Admin Pages Routes
// app.get('/manage-hero', (req, res) => {
//     res.sendFile(path.join(__dirname, 'public', 'manage-hero.html'));
// });

// app.get('/add-product', (req, res) => {
//     res.sendFile(path.join(__dirname, 'public', 'add-product.html'));
// });

// app.get('/manage-products', (req, res) => {
//     res.sendFile(path.join(__dirname, 'public', 'manage-products.html'));
// });

// app.get('/manage-categories', (req, res) => {
//     res.sendFile(path.join(__dirname, 'public', 'manage-categories.html'));
// });

// const PORT = process.env.PORT || 5000;
// app.listen(PORT, () => {
//   console.log(`Server is running on port ${PORT}`);
// }); 

const express = require('express');
const cors = require('cors');
const path = require('path');
require('dotenv').config();
const fs = require('fs');

const app = express();

// CORS configuration
app.use(cors({
  origin: ['http://localhost:3000', 'http://localhost:5000', 'https://bd-1-7lphlb1o4-yihea-aladawis-projects.vercel.app'],  
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type']
}));

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// إتاحة الوصول إلى المجلدات العامة
app.use(express.static(path.join(__dirname, 'public')));
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));
app.use('/server/uploads', express.static(path.join(__dirname, 'uploads')));

// إنشاء مجلد الصور إذا لم يكن موجوداً
const uploadsPath = path.join(__dirname, 'uploads');
if (!fs.existsSync(uploadsPath)) {
    fs.mkdirSync(uploadsPath);
}
console.log('Uploads directory path:', uploadsPath);

// Routes (بعد تفعيل middleware)
app.use('/api/auth', require('./routes/users'));
app.use('/api/products', require('./routes/products'));
app.use('/api/categories', require('./routes/categories'));
app.use('/api/users', require('./routes/users'));
app.use('/api/orders', require('./routes/orders'));
app.use('/api/hero-images', require('./routes/hero-images'));
app.use('/api/offers', require('./routes/offers'));
app.use('/api/footer', require('./routes/footer'));

// Admin Pages Routes
app.get('/manage-hero', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'manage-hero.html'));
});

app.get('/add-product', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'add-product.html'));
});

app.get('/manage-products', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'manage-products.html'));
});

app.get('/manage-categories', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'manage-categories.html'));
});

// تحديد رقم البورت
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
