INSERT INTO STAGE
VALUES
('ST0001', 'Neon Horizon', 'VN0003', 15000, 'Main Stage'),
('ST0002', 'Night Blooming Skydome', 'VN0002', 10000, 'Secondary Stage'),
('ST0003', 'The Rosemary Stage', 'VN0007', 5000, 'Open Air'),
('ST0004', 'Elysian Foreground', 'VN0006', 3000, 'Indoor')
ON CONFLICT (stage_id) DO NOTHING;