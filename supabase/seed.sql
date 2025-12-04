-- Sample products for E-commerce MVP
-- Run this in your Supabase SQL Editor after running schema.sql

-- Physical Products
TRUNCATE TABLE products RESTART IDENTITY CASCADE;

INSERT INTO products (name, description, price_cents, image_url, is_digital, weight_grams, stock, category)
VALUES
  (
    'Wireless Bluetooth Headphones',
    'Premium over-ear headphones with active noise cancellation, 30-hour battery life, and crystal-clear sound quality. Perfect for music lovers and remote workers.',
    12999,
    '/products/wireless-headphones.png',
    false,
    350,
    25,
    'Electronics'
  ),
  (
    'Minimalist Leather Wallet',
    'Handcrafted genuine leather wallet with RFID protection. Slim design holds up to 8 cards and cash. Available in classic brown.',
    4999,
    '/products/leather-wallet.png',
    false,
    80,
    50,
    'Accessories'
  ),
  (
    'Organic Cotton T-Shirt',
    'Sustainably sourced 100% organic cotton t-shirt. Pre-shrunk, breathable, and incredibly soft. Unisex fit available in multiple sizes.',
    2999,
    '/products/cotton-tshirt.png',
    false,
    200,
    100,
    'Clothing'
  ),
  (
    'Ceramic Pour-Over Coffee Dripper',
    'Artisan ceramic coffee dripper for the perfect pour-over brew. Includes reusable stainless steel filter. Makes 1-2 cups.',
    3499,
    '/products/coffee-dripper.png',
    false,
    400,
    30,
    'Home & Kitchen'
  ),
  (
    'Bamboo Wireless Charging Pad',
    'Eco-friendly wireless charger with natural bamboo surface. Compatible with all Qi-enabled devices. 10W fast charging.',
    2499,
    '/products/charging-pad.png',
    false,
    120,
    45,
    'Electronics'
  ),
  (
    'Stainless Steel Water Bottle',
    'Double-wall vacuum insulated water bottle. Keeps drinks cold for 24 hours or hot for 12 hours. 750ml capacity, leak-proof.',
    2799,
    '/products/water-bottle.png',
    false,
    300,
    60,
    'Home & Kitchen'
  );

-- Digital Products
INSERT INTO products (name, description, price_cents, image_url, is_digital, category)
VALUES
  (
    'UI Design Kit - Complete Bundle',
    'Over 500+ premium UI components, icons, and templates for Figma. Includes buttons, forms, cards, navigation elements, and complete page layouts. Regular updates included.',
    7999,
    '/products/ui-design-kit.png',
    true,
    'Digital Downloads'
  ),
  (
    'Productivity Notion Template Pack',
    'Comprehensive Notion template bundle including project management, habit tracking, budget planning, and note-taking systems. Duplicate and customize instantly.',
    1999,
    '/products/notion-template.jpg',
    true,
    'Digital Downloads'
  ),
  (
    'Stock Photo Collection - Nature',
    'Curated collection of 200+ high-resolution nature photographs. Perfect for websites, social media, and marketing materials. Commercial license included.',
    4999,
    '/products/stock-photos.jpg',
    true,
    'Digital Downloads'
  ),
  (
    'E-Book: Modern Web Development',
    'Comprehensive guide to building modern web applications with React, Next.js, and TypeScript. Includes code examples, best practices, and real-world projects.',
    2499,
    '/products/ebook-web-dev.jpg',
    true,
    'Digital Downloads'
  ),
  (
    'Icon Pack - 1000+ SVG Icons',
    'Professionally designed icon set with 1000+ scalable vector icons. Includes multiple styles: outline, solid, and duotone. Perfect for apps and websites.',
    3499,
    '/products/icon-pack.jpg',
    true,
    'Digital Downloads'
  ),
  (
    'Audio Course: Meditation Basics',
    '10-hour guided meditation course for beginners. Includes breathing exercises, mindfulness practices, and sleep meditation. MP3 format with PDF workbook.',
    3999,
    '/products/meditation-course.jpg',
    true,
    'Digital Downloads'
  );

