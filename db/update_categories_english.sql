-- Delete old categories and reset sequence
TRUNCATE categories CASCADE;
ALTER SEQUENCE categories_id_seq RESTART WITH 1;

-- Add new categories in English
INSERT INTO categories (name, description) 
VALUES 
    ('Fish', 'Various selection of fresh fish'),
    ('Rice', 'Different types of high-quality rice'),
    ('Spices', 'Wide variety of fresh spices'),
    ('Biscuits', 'Various selection of biscuits and sweets'),
    ('Beverages', 'Natural juices and refreshing drinks'),
    ('Legumes', 'Fresh and varied legumes'),
    ('Nuts', 'Premium selection of fresh nuts'); 