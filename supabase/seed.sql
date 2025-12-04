-- Sample products for E-commerce MVP
-- Run this in your Supabase SQL Editor after running schema.sql

-- Physical Products
INSERT INTO products (name, description, price_cents, image_url, is_digital, weight_grams, stock, category)
VALUES
  (
    'Wireless Bluetooth Headphones',
    'Premium over-ear headphones with active noise cancellation, 30-hour battery life, and crystal-clear sound quality. Perfect for music lovers and remote workers.',
    12999,
    'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=600&h=600&fit=crop',
    false,
    350,
    25,
    'Electronics'
  ),
  (
    'Minimalist Leather Wallet',
    'Handcrafted genuine leather wallet with RFID protection. Slim design holds up to 8 cards and cash. Available in classic brown.',
    4999,
    'https://images.unsplash.com/photo-1627123424574-724758594e93?w=600&h=600&fit=crop',
    false,
    80,
    50,
    'Accessories'
  ),
  (
    'Organic Cotton T-Shirt',
    'Sustainably sourced 100% organic cotton t-shirt. Pre-shrunk, breathable, and incredibly soft. Unisex fit available in multiple sizes.',
    2999,
    'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=600&h=600&fit=crop',
    false,
    200,
    100,
    'Clothing'
  ),
  (
    'Ceramic Pour-Over Coffee Dripper',
    'Artisan ceramic coffee dripper for the perfect pour-over brew. Includes reusable stainless steel filter. Makes 1-2 cups.',
    3499,
    'https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?w=600&h=600&fit=crop',
    false,
    400,
    30,
    'Home & Kitchen'
  ),
  (
    'Bamboo Wireless Charging Pad',
    'Eco-friendly wireless charger with natural bamboo surface. Compatible with all Qi-enabled devices. 10W fast charging.',
    2499,
    'https://images.unsplash.com/photo-1591815302525-756a9bcc3425?w=600&h=600&fit=crop',
    false,
    120,
    45,
    'Electronics'
  ),
  (
    'Stainless Steel Water Bottle',
    'Double-wall vacuum insulated water bottle. Keeps drinks cold for 24 hours or hot for 12 hours. 750ml capacity, leak-proof.',
    2799,
    'https://images.unsplash.com/photo-1602143407151-7111542de6e8?w=600&h=600&fit=crop',
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
    'https://images.unsplash.com/photo-1561070791-2526d30994b5?w=600&h=600&fit=crop',
    true,
    'Digital Downloads'
  ),
  (
    'Productivity Notion Template Pack',
    'Comprehensive Notion template bundle including project management, habit tracking, budget planning, and note-taking systems. Duplicate and customize instantly.',
    1999,
    'https://images.unsplash.com/photo-1484480974693-6ca0a78fb36b?w=600&h=600&fit=crop',
    true,
    'Digital Downloads'
  ),
  (
    'Stock Photo Collection - Nature',
    'Curated collection of 200+ high-resolution nature photographs. Perfect for websites, social media, and marketing materials. Commercial license included.',
    4999,
    'https://images.unsplash.com/photo-1470071459604-3b5ec3a7fe05?w=600&h=600&fit=crop',
    true,
    'Digital Downloads'
  ),
  (
    'E-Book: Modern Web Development',
    'Comprehensive guide to building modern web applications with React, Next.js, and TypeScript. Includes code examples, best practices, and real-world projects.',
    2499,
    'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?w=600&h=600&fit=crop',
    true,
    'Digital Downloads'
  ),
  (
    'Icon Pack - 1000+ SVG Icons',
    'Professionally designed icon set with 1000+ scalable vector icons. Includes multiple styles: outline, solid, and duotone. Perfect for apps and websites.',
    3499,
    'https://images.unsplash.com/photo-1611162617474-5b21e879e113?w=600&h=600&fit=crop',
    true,
    'Digital Downloads'
  ),
  (
    'Audio Course: Meditation Basics',
    '10-hour guided meditation course for beginners. Includes breathing exercises, mindfulness practices, and sleep meditation. MP3 format with PDF workbook.',
    3999,
    'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=600&h=600&fit=crop',
    true,
    'Digital Downloads'
  );

