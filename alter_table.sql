-- إضافة الأعمدة الجديدة
ALTER TABLE products ADD COLUMN weight DECIMAL(10,2) AFTER price;
ALTER TABLE products ADD COLUMN manufacturer VARCHAR(200) AFTER weight; 