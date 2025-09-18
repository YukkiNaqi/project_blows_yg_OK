-- Seed initial data for BLOWS e-commerce system

-- Insert default admin user (Agungsaputra)
INSERT INTO users (username, email, password_hash, full_name, phone, role) VALUES 
('Agungsaputra', 'agung@blows.com', '$2b$10$rQJ8vQZ9X8vQZ9X8vQZ9XeJ8vQZ9X8vQZ9X8vQZ9X8vQZ9X8vQZ9X', 'Agung Saputra', '088229157588', 'superadmin');

-- Insert product categories
INSERT INTO categories (name, description, image_url) VALUES 
('Router', 'Network routers for home and business use', '/placeholder.svg?height=200&width=200'),
('Switch', 'Network switches for expanding connectivity', '/placeholder.svg?height=200&width=200'),
('Kabel LAN', 'Ethernet cables and networking cables', '/placeholder.svg?height=200&width=200'),
('Access Point', 'Wireless access points for WiFi coverage', '/placeholder.svg?height=200&width=200'),
('Modem', 'Internet modems and gateways', '/placeholder.svg?height=200&width=200');

-- Insert sample products
INSERT INTO products (category_id, name, description, image_url, price, cost_price, stock_quantity, sku, brand, specifications) VALUES 
(1, 'TP-Link Archer C6 AC1200', 'Dual-band wireless router with MU-MIMO technology', '/placeholder.svg?height=300&width=300', 450000, 350000, 25, 'TPL-AC6-001', 'TP-Link', '{"speed": "AC1200", "bands": "Dual-band", "antennas": 4}'),
(1, 'ASUS RT-AX55 AX1800', 'WiFi 6 router with advanced security features', '/placeholder.svg?height=300&width=300', 850000, 650000, 15, 'ASU-AX55-001', 'ASUS', '{"speed": "AX1800", "wifi": "WiFi 6", "security": "WPA3"}'),
(2, 'Netgear GS108 8-Port Switch', '8-port Gigabit Ethernet unmanaged switch', '/placeholder.svg?height=300&width=300', 320000, 250000, 30, 'NET-GS108-001', 'Netgear', '{"ports": 8, "speed": "Gigabit", "type": "Unmanaged"}'),
(2, 'D-Link DGS-1016A 16-Port Switch', '16-port Gigabit desktop switch', '/placeholder.svg?height=300&width=300', 580000, 450000, 20, 'DLK-1016A-001', 'D-Link', '{"ports": 16, "speed": "Gigabit", "mounting": "Desktop"}'),
(3, 'Kabel LAN Cat6 UTP 305m', 'Cat6 UTP cable roll for network installation', '/placeholder.svg?height=300&width=300', 1200000, 950000, 10, 'CBL-CAT6-305', 'Generic', '{"category": "Cat6", "length": "305m", "type": "UTP"}'),
(3, 'Kabel LAN Cat5e 1 Meter', 'Ready-made Cat5e patch cable', '/placeholder.svg?height=300&width=300', 15000, 10000, 100, 'CBL-CAT5E-1M', 'Generic', '{"category": "Cat5e", "length": "1m", "type": "Patch"}'),
(4, 'Ubiquiti UniFi AP AC Lite', 'Enterprise WiFi access point', '/placeholder.svg?height=300&width=300', 1250000, 1000000, 12, 'UBI-ACLITE-001', 'Ubiquiti', '{"speed": "AC1200", "management": "UniFi Controller", "mounting": "Ceiling"}'),
(5, 'Huawei HG8245H5 GPON ONT', 'Fiber optic network terminal modem', '/placeholder.svg?height=300&width=300', 380000, 300000, 18, 'HUA-8245H5-001', 'Huawei', '{"type": "GPON ONT", "ports": "4x LAN + 2x POTS", "wifi": "Dual-band"});

-- Insert services
INSERT INTO services (name, description, price, duration_hours) VALUES 
('Instalasi Jaringan Kantor', 'Pemasangan dan konfigurasi jaringan untuk kantor kecil-menengah', 500000, 4),
('Maintenance Jaringan Bulanan', 'Pemeliharaan rutin jaringan dan troubleshooting', 300000, 2),
('Konsultasi IT Infrastructure', 'Konsultasi perencanaan infrastruktur IT', 750000, 3),
('Setup WiFi Enterprise', 'Instalasi dan konfigurasi sistem WiFi untuk perusahaan', 1000000, 6),
('Network Security Audit', 'Audit keamanan jaringan dan rekomendasi perbaikan', 1500000, 8);
