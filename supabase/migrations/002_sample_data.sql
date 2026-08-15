-- Sample data for Kwality Tiles ERP

-- Sample Customers
INSERT INTO customers (name, phone, email, address, notes) VALUES
('Rajesh Kumar', '9876543210', 'rajesh@example.com', '123 Main St, Delhi', 'Regular customer'),
('Priya Sharma', '9876543211', 'priya@example.com', '456 Park Ave, Mumbai', 'High value customer'),
('Amit Patel', '9876543212', 'amit@example.com', '789 Business Park, Bangalore', 'Wholesale'),
('Sneha Reddy', '9876543213', 'sneha@example.com', '321 Commercial Rd, Hyderabad', 'Retail'),
('Vikas Singh', '9876543214', 'vikas@example.com', '654 Industrial Zone, Pune', 'B2B Partner')
ON CONFLICT DO NOTHING;

-- Sample Suppliers
INSERT INTO suppliers (name, phone, address) VALUES
('Premium Tiles Ltd', '9876543220', '100 Wholesale Street, Morbi'),
('Granite World Inc', '9876543221', '200 Industrial Park, Salem'),
('Stone & Marble Co', '9876543222', '300 Trade Zone, Jaipur'),
('Quality Ceramics', '9876543223', '400 Export Hub, Visakhapatnam'),
('Elite Materials', '9876543224', '500 Commerce Center, Chennai')
ON CONFLICT DO NOTHING;

-- Sample Products
INSERT INTO products (name, code, category, unit, opening_stock, rate, min_stock, description) VALUES
('Ceramic Tiles 24x24', 'TILE-001', 'Tiles', 'Box', 100, 450, 20, '24x24 inch ceramic floor tiles'),
('Granite Countertop', 'GRAN-001', 'Granite', 'Piece', 50, 2500, 10, 'Premium granite countertop slabs'),
('Marble Flooring', 'MARB-001', 'Marble', 'SqFt', 200, 350, 30, 'Italian marble flooring tiles'),
('Polished Tiles 12x12', 'TILE-002', 'Tiles', 'Box', 150, 350, 25, 'Polished ceramic tiles 12x12'),
('Granite Tiles', 'GRAN-002', 'Granite', 'Box', 75, 1200, 15, 'Granite tile pack of 12'),
('Wall Tiles', 'TILE-003', 'Tiles', 'Box', 120, 280, 20, 'Premium wall tiles for kitchen & bathroom'),
('Mosaic Tiles', 'TILE-004', 'Tiles', 'Box', 80, 550, 15, 'Decorative mosaic tiles'),
('Black Granite', 'GRAN-003', 'Granite', 'Piece', 40, 3000, 8, 'Black granite slabs premium quality')
ON CONFLICT DO NOTHING;
