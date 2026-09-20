INSERT INTO VENUE VALUES
('VN0001', 'Main Entrance', 'South Edge, Grant Park'),
('VN0002', 'Bonnie Brown Field', 'Dawn Shore Road, Grant Park'),
('VN0003', 'Carrol Edgemount Arena', 'Northeast Area, Grant Park'),
('VN0004', 'Greendale Grounds', 'Lakefront Drive, Grant Park'),
('VN0005', 'Livonian Blue Court', 'West Garden Road, Grant Park'),
('VN0006', 'Crescent Hall', 'Central Avenue, Grant Park'),
('VN0007', 'Merwaldian Grounds', 'Northwest Corner, Grant Park'),
('VN0008', 'Sesper Pavilion', 'East Shore Road, Grant Park')
ON CONFLICT (venue_id) DO NOTHING;
