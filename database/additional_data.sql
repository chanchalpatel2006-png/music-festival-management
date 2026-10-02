-- ============================================================
-- FESTIVO / CONCERT MANAGEMENT SYSTEM
-- Additional seed data
-- Does NOT insert into or modify: ticket_type, venue, stage
-- Existing IDs in the database are respected.
-- ============================================================

BEGIN;

-- ============================================================
-- MANAGER
-- Existing: MN001-MN004
-- ============================================================

INSERT INTO manager (manager_id, manager_name, phone, email) VALUES
('MN005','Priya Nair','9812345601','priya.nair@festivo.com'),
('MN006','Aditya Menon','9823456702','aditya.menon@festivo.com'),
('MN007','Neha Kapoor','9834567803','neha.kapoor@festivo.com'),
('MN008','Rahul Bhat','9845678904','rahul.bhat@festivo.com'),
('MN009','Simran Kaur','9856789005','simran.kaur@festivo.com'),
('MN010','Vikram Rao','9867890106','vikram.rao@festivo.com')
ON CONFLICT DO NOTHING;


-- ============================================================
-- GENRE
-- Existing: GN01-GN05
-- ============================================================

INSERT INTO genre (genre_id, genre_name) VALUES
('GN06','Electronic'),
('GN07','Bollywood'),
('GN08','Alternative'),
('GN09','Indie Pop'),
('GN10','Folk')
ON CONFLICT DO NOTHING;


-- ============================================================
-- ARTISTS
-- Existing: AR001-AR005
-- ============================================================

INSERT INTO artists
(artist_id, artist_name, artist_type, country, manager_id) VALUES
('AR006','OneRepublic','BAND','USA','MN005'),
('AR007','Dua Lipa','SOLO','United Kingdom','MN006'),
('AR008','Anuv Jain','SOLO','INDIA','MN007'),
('AR009','Imagine Dragons','BAND','USA','MN008'),
('AR010','Ritviz','SOLO','INDIA','MN009'),
('AR011','When Chai Met Toast','BAND','INDIA','MN010'),
('AR012','The Local Train','BAND','INDIA','MN005'),
('AR013','Jonas Blue','SOLO','United Kingdom','MN006'),
('AR014','Jasmine Thompson','SOLO','United Kingdom','MN007'),
('AR015','Lost Stories','BAND','INDIA','MN009')
ON CONFLICT DO NOTHING;


-- ============================================================
-- ARTIST-GENRE
-- ============================================================

INSERT INTO artist_genre (artist_id, genre_id) VALUES
('AR001','GN05'),
('AR002','GN01'),
('AR003','GN01'),
('AR004','GN01'),
('AR005','GN05'),
('AR006','GN01'),
('AR006','GN08'),
('AR007','GN01'),
('AR008','GN03'),
('AR008','GN09'),
('AR009','GN05'),
('AR009','GN08'),
('AR010','GN06'),
('AR010','GN01'),
('AR011','GN03'),
('AR011','GN10'),
('AR012','GN05'),
('AR012','GN03'),
('AR013','GN06'),
('AR013','GN01'),
('AR014','GN01'),
('AR014','GN04'),
('AR015','GN06'),
('AR015','GN03')
ON CONFLICT DO NOTHING;


-- ============================================================
-- ARTIST MEMBERS
-- ============================================================

INSERT INTO artist_member
(member_id, artist_id, member_name, instrument) VALUES
('MB0008','AR005','Brad Simpson','Vocals'),
('MB0009','AR005','James Brittain-McVey','Guitar'),
('MB0010','AR005','Connor Ball','Bass'),
('MB0011','AR005','Tristan Evans','Drums'),
('MB0012','AR006','Ryan Tedder','Vocals'),
('MB0013','AR006','Zach Filkins','Guitar'),
('MB0014','AR006','Drew Brown','Guitar'),
('MB0015','AR006','Eddie Fisher','Drums'),
('MB0016','AR009','Dan Reynolds','Vocals'),
('MB0017','AR009','Wayne Sermon','Guitar'),
('MB0018','AR009','Ben McKee','Bass'),
('MB0019','AR009','Daniel Platzman','Drums'),
('MB0020','AR011','Ashwin Bhaskara','Vocals'),
('MB0021','AR011','Achyuth Jaigopal','Guitar'),
('MB0022','AR011','Pai Sailesh','Drums'),
('MB0023','AR012','Ram Mohan Jha','Vocals'),
('MB0024','AR012','Sahaj Singh','Guitar'),
('MB0025','AR012','Amit Kilam','Drums'),
('MB0026','AR015','Siddharth Sharma','Production'),
('MB0027','AR015','Sahil Makhija','DJ')
ON CONFLICT DO NOTHING;


-- ============================================================
-- ATTENDEES
-- Existing: AT000001-AT000013
-- ============================================================

INSERT INTO attendee
(attendee_id, attendee_name, email, phone, age) VALUES
('AT000014','Aditi Verma','aditi.verma@gmail.com','9876501001',21),
('AT000015','Yash Malhotra','yash.malhotra@gmail.com','9876501002',23),
('AT000016','Tanya Mehra','tanya.mehra@gmail.com','9876501003',20),
('AT000017','Devansh Gupta','devansh.gupta@gmail.com','9876501004',25),
('AT000018','Riya Shah','riya.shah@gmail.com','9876501005',22),
('AT000019','Karan Joshi','karan.joshi@gmail.com','9876501006',27),
('AT000020','Nandini Rao','nandini.rao@gmail.com','9876501007',19),
('AT000021','Aditya Sharma','aditya.sharma@gmail.com','9876501008',24),
('AT000022','Mihika Jain','mihika.jain@gmail.com','9876501009',21),
('AT000023','Arnav Kapoor','arnav.kapoor@gmail.com','9876501010',26),
('AT000024','Pooja Menon','pooja.menon@gmail.com','9876501011',29),
('AT000025','Ishaan Roy','ishaan.roy@gmail.com','9876501012',22),
('AT000026','Kavya Iyer','kavya.iyer@gmail.com','9876501013',20),
('AT000027','Siddharth Rao','siddharth.rao@gmail.com','9876501014',31),
('AT000028','Manya Sethi','manya.sethi@gmail.com','9876501015',18),
('AT000029','Rahul Khanna','rahul.khanna@gmail.com','9876501016',28),
('AT000030','Diya Agarwal','diya.agarwal@gmail.com','9876501017',23),
('AT000031','Aman Deshmukh','aman.deshmukh@gmail.com','9876501018',25),
('AT000032','Ira Banerjee','ira.banerjee@gmail.com','9876501019',19),
('AT000033','Nikhil Sinha','nikhil.sinha@gmail.com','9876501020',30)
ON CONFLICT DO NOTHING;


-- ============================================================
-- EVENTS
-- Uses existing VN0001-VN0009 only.
-- Existing EV0001 is retained.
-- ============================================================

INSERT INTO event
(event_id, event_name, event_date, start_time, end_time, venue_id) VALUES
('EV0002','Indie Sunrise','2026-12-20','09:00:00','12:00:00','VN0002'),
('EV0003','Bollywood Beats','2026-12-20','13:00:00','16:00:00','VN0004'),
('EV0004','Electronic Evening','2026-12-20','17:00:00','21:00:00','VN0005'),
('EV0005','Pop Night','2026-12-21','09:00:00','12:00:00','VN0006'),
('EV0006','Rock Arena','2026-12-21','13:00:00','16:00:00','VN0007'),
('EV0007','International Pop','2026-12-21','17:00:00','21:00:00','VN0008'),
('EV0008','Indie Finale','2026-12-22','09:00:00','12:00:00','VN0009'),
('EV0009','Fusion Afternoon','2026-12-22','13:00:00','16:00:00','VN0004'),
('EV0010','Grand Closing Night','2026-12-22','17:00:00','21:00:00','VN0003')
ON CONFLICT DO NOTHING;


-- ============================================================
-- TICKETS
-- Existing ticket_type values are referenced but NOT modified.
-- ============================================================

INSERT INTO ticket
(ticket_id, attendee_id, ticket_type_id, purchase_date, entry_date, ticket_status) VALUES
('TK000015','AT000014','TT02','2026-10-03','2026-12-20','Active'),
('TK000016','AT000015','TT01','2026-10-03','2026-12-20','Active'),
('TK000017','AT000016','TT03','2026-10-04','2026-12-20','Active'),
('TK000018','AT000017','TT02','2026-10-05','2026-12-21','Active'),
('TK000019','AT000018','TT01','2026-10-05','2026-12-21','Active'),
('TK000020','AT000019','TT03','2026-10-06','2026-12-21','Active'),
('TK000021','AT000020','TT02','2026-10-07','2026-12-22','Active'),
('TK000022','AT000021','TT01','2026-10-07','2026-12-22','Active'),
('TK000023','AT000022','TT03','2026-10-08','2026-12-22','Active'),
('TK000024','AT000023','TT02','2026-10-09','2026-12-22','Cancelled'),
('TK000025','AT000024','TT01','2026-10-10','2026-12-20','Active'),
('TK000026','AT000025','TT03','2026-10-10','2026-12-21','Active'),
('TK000027','AT000026','TT02','2026-10-11','2026-12-22','Active'),
('TK000028','AT000027','TT01','2026-10-11','2026-12-20','Used'),
('TK000029','AT000028','TT03','2026-10-12','2026-12-21','Active'),
('TK000030','AT000029','TT02','2026-10-12','2026-12-22','Active'),
('TK000031','AT000030','TT01','2026-10-13','2026-12-20','Active'),
('TK000032','AT000031','TT03','2026-10-13','2026-12-21','Active'),
('TK000033','AT000032','TT02','2026-10-14','2026-12-22','Active'),
('TK000034','AT000033','TT01','2026-10-14','2026-12-20','Active')
ON CONFLICT DO NOTHING;


-- ============================================================
-- PAYMENTS
-- Amounts match the existing ticket_type prices:
-- TT01 VIP = 5000
-- TT02 GENERAL = 2500
-- TT03 STUDENT = 1200
-- ============================================================

INSERT INTO payment
(payment_id, ticket_id, amount, payment_date, payment_method, payment_status) VALUES
('PM000013','TK000015',2500.00,'2026-10-03 10:15:00','UPI','Success'),
('PM000014','TK000016',5000.00,'2026-10-03 11:20:00','Card','Success'),
('PM000015','TK000017',1200.00,'2026-10-04 09:45:00','UPI','Success'),
('PM000016','TK000018',2500.00,'2026-10-05 14:10:00','Net Banking','Success'),
('PM000017','TK000019',5000.00,'2026-10-05 15:30:00','Card','Success'),
('PM000018','TK000020',1200.00,'2026-10-06 12:05:00','UPI','Success'),
('PM000019','TK000021',2500.00,'2026-10-07 10:40:00','Card','Success'),
('PM000020','TK000022',5000.00,'2026-10-07 13:15:00','UPI','Success'),
('PM000021','TK000023',1200.00,'2026-10-08 16:25:00','Net Banking','Success'),
('PM000022','TK000024',2500.00,'2026-10-09 09:35:00','Card','Refunded'),
('PM000023','TK000025',5000.00,'2026-10-10 11:50:00','UPI','Success'),
('PM000024','TK000026',1200.00,'2026-10-10 14:40:00','Card','Success'),
('PM000025','TK000027',2500.00,'2026-10-11 10:05:00','UPI','Success'),
('PM000026','TK000028',5000.00,'2026-10-11 12:30:00','Card','Success'),
('PM000027','TK000029',1200.00,'2026-10-12 15:10:00','UPI','Pending'),
('PM000028','TK000030',2500.00,'2026-10-12 17:05:00','Net Banking','Success'),
('PM000029','TK000031',5000.00,'2026-10-13 09:25:00','Card','Success'),
('PM000030','TK000032',1200.00,'2026-10-13 11:45:00','UPI','Success'),
('PM000031','TK000033',2500.00,'2026-10-14 14:20:00','Card','Success'),
('PM000032','TK000034',5000.00,'2026-10-14 16:55:00','Net Banking','Success')
ON CONFLICT DO NOTHING;


-- ============================================================
-- PERFORMANCE
-- Uses existing stages only.
-- ============================================================

INSERT INTO performance
(performance_id, event_id, artist_id, stage_id, performance_type) VALUES
('PF0002','EV0002','AR008','ST0002','Opening Act'),
('PF0003','EV0003','AR002','ST0003','Main Act'),
('PF0004','EV0003','AR003','ST0003','Opening Act'),
('PF0005','EV0004','AR010','ST0004','Main Act'),
('PF0006','EV0005','AR004','ST0004','Opening Act'),
('PF0007','EV0005','AR007','ST0001','Main Act'),
('PF0008','EV0006','AR012','ST0003','Opening Act'),
('PF0009','EV0006','AR009','ST0001','Main Act'),
('PF0010','EV0007','AR013','ST0002','Opening Act'),
('PF0011','EV0007','AR005','ST0001','Main Act'),
('PF0012','EV0008','AR011','ST0002','Main Act'),
('PF0013','EV0009','AR006','ST0003','Opening Act'),
('PF0014','EV0009','AR014','ST0003','Main Act'),
('PF0015','EV0010','AR015','ST0004','Opening Act'),
('PF0016','EV0010','AR001','ST0001','Main Act')
ON CONFLICT DO NOTHING;


-- ============================================================
-- SETLIST
-- One setlist per performance.
-- ============================================================

INSERT INTO setlist (setlist_id, performance_id) VALUES
('SL0002','PF0002'),
('SL0003','PF0003'),
('SL0004','PF0004'),
('SL0005','PF0005'),
('SL0006','PF0006'),
('SL0007','PF0007'),
('SL0008','PF0008'),
('SL0009','PF0009'),
('SL0010','PF0010'),
('SL0011','PF0011'),
('SL0012','PF0012'),
('SL0013','PF0013'),
('SL0014','PF0014'),
('SL0015','PF0015'),
('SL0016','PF0016')
ON CONFLICT DO NOTHING;


-- ============================================================
-- SONGS
-- ============================================================

INSERT INTO song (song_id, song_name, artist_id) VALUES
('SG0004','Ocean Eyes','AR004'),
('SG0005','Happier Than Ever','AR004'),
('SG0006','Counting Stars','AR006'),
('SG0007','Apologize','AR006'),
('SG0008','Love Again','AR007'),
('SG0009','Levitating','AR007'),
('SG0010','Gul','AR008'),
('SG0011','Baarishein','AR008'),
('SG0012','Believer','AR009'),
('SG0013','Thunder','AR009'),
('SG0014','Udd Gaye','AR010'),
('SG0015','Liggi','AR010'),
('SG0016','Khoj','AR011'),
('SG0017','When We Feel Young','AR011'),
('SG0018','Aaoge Tum Kabhi','AR012'),
('SG0019','Choo Lo','AR012'),
('SG0020','Fast Car','AR013'),
('SG0021','Perfect Strangers','AR013'),
('SG0022','Let Her Go','AR014'),
('SG0023','Adore','AR014'),
('SG0024','Sunrise','AR015'),
('SG0025','Lost Frequencies','AR015'),
('SG0026','Afterglow Live','AR001'),
('SG0027','On My Own','AR005'),
('SG0028','Pehla Pyaar Live','AR002'),
('SG0029','Kesariya','AR003')
ON CONFLICT DO NOTHING;


-- ============================================================
-- SETLIST SONGS
-- ============================================================

INSERT INTO setlist_song (setlist_id, song_id, song_order) VALUES
('SL0002','SG0010',1),
('SL0002','SG0011',2),

('SL0003','SG0028',1),
('SL0003','SG0029',2),

('SL0004','SG0029',1),
('SL0004','SG0028',2),

('SL0005','SG0014',1),
('SL0005','SG0015',2),

('SL0006','SG0004',1),
('SL0006','SG0005',2),

('SL0007','SG0008',1),
('SL0007','SG0009',2),

('SL0008','SG0018',1),
('SL0008','SG0019',2),

('SL0009','SG0012',1),
('SL0009','SG0013',2),

('SL0010','SG0020',1),
('SL0010','SG0021',2),

('SL0011','SG0027',1),

('SL0012','SG0016',1),
('SL0012','SG0017',2),

('SL0013','SG0006',1),
('SL0013','SG0007',2),

('SL0014','SG0022',1),
('SL0014','SG0023',2),

('SL0015','SG0024',1),
('SL0015','SG0025',2),

('SL0016','SG0026',1)
ON CONFLICT DO NOTHING;


-- ============================================================
-- SPONSORS
-- ============================================================

INSERT INTO sponsor
(sponsor_id, sponsor_name, phone, email, sponsorship_type, sponsorship_tier, sponsorship_amount) VALUES
('SP0002','Apex Digital','9877001101','partnerships@apexdigital.com','Monetary','Gold',180000.00),
('SP0003','BlueWave Beverages','9877001102','events@bluewave.com','Goods','Silver',75000.00),
('SP0004','Urban Sound Labs','9877001103','hello@urbansoundlabs.com','Services','Platinum',250000.00),
('SP0005','Glow Cosmetics','9877001104','brand@glowcosmetics.com','Monetary','Gold',150000.00),
('SP0006','Metro Mobility','9877001105','festivo@metromobility.com','Services','Silver',90000.00),
('SP0007','Campus Connect','9877001106','partners@campusconnect.in','Monetary','Bronze',50000.00),
('SP0008','PixelFrame Studios','9877001107','contact@pixelframe.com','Services','Bronze',45000.00)
ON CONFLICT DO NOTHING;


-- ============================================================
-- SPONSOR DEMANDS
-- ============================================================

INSERT INTO sponsor_demand (sponsor_id, demand_type) VALUES
('SP0002','Banner'),
('SP0002','Social Media Promotion'),
('SP0003','Stall'),
('SP0003','Booth'),
('SP0004','Stage Branding'),
('SP0004','Logo Placement'),
('SP0005','Social Media Promotion'),
('SP0005','Banner'),
('SP0006','Logo Placement'),
('SP0007','Booth'),
('SP0007','Social Media Promotion'),
('SP0008','Stage Branding')
ON CONFLICT DO NOTHING;


-- ============================================================
-- STAFF
-- ============================================================

INSERT INTO staff
(staff_id, staff_name, role, phone, email) VALUES
('SF0002','Ankit Verma','Event Coordinator','7001002001','ankit.verma@festivo.com'),
('SF0003','Nisha Rao','Stage Manager','7001002002','nisha.rao@festivo.com'),
('SF0004','Vivek Patil','Technical Staff','7001002003','vivek.patil@festivo.com'),
('SF0005','Sana Sheikh','Security Staff','7001002004','sana.sheikh@festivo.com'),
('SF0006','Manish Kumar','Medical Staff','7001002005','manish.kumar@festivo.com'),
('SF0007','Rhea Kapoor','Hospitality Staff','7001002006','rhea.kapoor@festivo.com'),
('SF0008','Arjun Nair','Volunteer','7001002007','arjun.nair@festivo.com'),
('SF0009','Mehul Shah','Technical Staff','7001002008','mehul.shah@festivo.com'),
('SF0010','Pallavi Joshi','Security Staff','7001002009','pallavi.joshi@festivo.com'),
('SF0011','Kunal Desai','Volunteer','7001002010','kunal.desai@festivo.com')
ON CONFLICT DO NOTHING;


-- ============================================================
-- STAFF ASSIGNMENTS
-- Uses existing stages only.
-- ============================================================

INSERT INTO staff_assignment
(assignment_id, staff_id, stage_id, event_id, shift_start, shift_end) VALUES
('AS0002','SF0002','ST0002','EV0002','2026-12-20 08:00:00','2026-12-20 13:00:00'),
('AS0003','SF0003','ST0003','EV0003','2026-12-20 11:00:00','2026-12-20 17:00:00'),
('AS0004','SF0004','ST0004','EV0004','2026-12-20 15:00:00','2026-12-20 22:00:00'),
('AS0005','SF0005','ST0001','EV0001','2026-12-20 16:00:00','2026-12-20 23:00:00'),
('AS0006','SF0006','ST0002','EV0005','2026-12-21 08:00:00','2026-12-21 13:00:00'),
('AS0007','SF0007','ST0001','EV0007','2026-12-21 16:00:00','2026-12-21 22:00:00'),
('AS0008','SF0008','ST0003','EV0006','2026-12-21 12:00:00','2026-12-21 17:00:00'),
('AS0009','SF0009','ST0001','EV0007','2026-12-21 15:00:00','2026-12-21 22:00:00'),
('AS0010','SF0010','ST0002','EV0008','2026-12-22 08:00:00','2026-12-22 13:00:00'),
('AS0011','SF0011','ST0004','EV0009','2026-12-22 12:00:00','2026-12-22 17:00:00'),
('AS0012','SF0003','ST0001','EV0010','2026-12-22 16:00:00','2026-12-22 22:00:00'),
('AS0013','SF0005','ST0003','EV0010','2026-12-22 16:00:00','2026-12-22 22:00:00')
ON CONFLICT DO NOTHING;


-- ============================================================
-- VENDORS
-- ============================================================

INSERT INTO vendor
(vendor_id, vendor_name, phone, email, vendor_type) VALUES
('VD02','Spice Route Foods','9911002201','hello@spiceroutefoods.com','Business'),
('VD03','Bean & Brew Cafe','9911002202','contact@beanbrew.com','Business'),
('VD04','Campus Merch','9911002203','sales@campusmerch.in','Business'),
('VD05','Glow Arts','9911002204','info@glowarts.in','Business'),
('VD06','Festivo Official Store','9911002205','store@festivo.com','Sponsor'),
('VD07','SoundWave Accessories','9911002206','sales@soundwave.in','Business')
ON CONFLICT DO NOTHING;


-- ============================================================
-- STALLS
-- ============================================================

INSERT INTO stall
(stall_id, vendor_id, stall_name, stall_type) VALUES
('SL02','VD02','Spice Route Food Court','Food'),
('SL03','VD03','Bean & Brew Coffee','Beverages'),
('SL04','VD04','Campus Merch Store','Merchandise'),
('SL05','VD05','Glow Arts Studio','Art & Crafts'),
('SL06','VD06','Festivo Merchandise','Merchandise'),
('SL07','VD07','SoundWave Accessories','Electronics')
ON CONFLICT DO NOTHING;


-- ============================================================
-- STALL SETUPS
-- Uses existing venues only.
-- ============================================================

INSERT INTO stall_setup
(setup_id, stall_id, venue_id, stall_rent, stall_date) VALUES
('SU0002','SL02','VN0004',18000.00,'2026-12-20'),
('SU0003','SL03','VN0004',15000.00,'2026-12-20'),
('SU0004','SL04','VN0006',12000.00,'2026-12-21'),
('SU0005','SL05','VN0008',10000.00,'2026-12-21'),
('SU0006','SL06','VN0003',20000.00,'2026-12-22'),
('SU0007','SL07','VN0009',14000.00,'2026-12-22')
ON CONFLICT DO NOTHING;


COMMIT;

-- ============================================================
-- OPTIONAL VERIFICATION QUERIES
-- ============================================================

SELECT 'manager' AS table_name, COUNT(*) AS row_count FROM manager
UNION ALL
SELECT 'artists', COUNT(*) FROM artists
UNION ALL
SELECT 'genre', COUNT(*) FROM genre
UNION ALL
SELECT 'artist_genre', COUNT(*) FROM artist_genre
UNION ALL
SELECT 'artist_member', COUNT(*) FROM artist_member
UNION ALL
SELECT 'attendee', COUNT(*) FROM attendee
UNION ALL
SELECT 'event', COUNT(*) FROM event
UNION ALL
SELECT 'ticket', COUNT(*) FROM ticket
UNION ALL
SELECT 'payment', COUNT(*) FROM payment
UNION ALL
SELECT 'performance', COUNT(*) FROM performance
UNION ALL
SELECT 'setlist', COUNT(*) FROM setlist
UNION ALL
SELECT 'song', COUNT(*) FROM song
UNION ALL
SELECT 'setlist_song', COUNT(*) FROM setlist_song
UNION ALL
SELECT 'sponsor', COUNT(*) FROM sponsor
UNION ALL
SELECT 'sponsor_demand', COUNT(*) FROM sponsor_demand
UNION ALL
SELECT 'staff', COUNT(*) FROM staff
UNION ALL
SELECT 'staff_assignment', COUNT(*) FROM staff_assignment
UNION ALL
SELECT 'vendor', COUNT(*) FROM vendor
UNION ALL
SELECT 'stall', COUNT(*) FROM stall
UNION ALL
SELECT 'stall_setup', COUNT(*) FROM stall_setup;
