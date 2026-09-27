-- ============================================
-- TICKETS & ATTENDEES
-- Sample Attendee Data
-- ============================================

INSERT INTO attendee
(attendee_id, attendee_name, email, phone, age)
VALUES
('AT000001', 'Aarav Sharma', 'aarav.sharma@gmail.com', '9876543210', 22),
('AT000002', 'Ananya Patil', 'ananya.patil@gmail.com', '9876543211', 21),
('AT000003', 'Rohan Mehta', 'rohan.mehta@gmail.com', '9876543212', 24),
('AT000004', 'Isha Kulkarni', 'isha.kulkarni@gmail.com', '9876543213', 20),
('AT000005', 'Kabir Shah', 'kabir.shah@gmail.com', '9876543214', 26),
('AT000006', 'Meera Joshi', 'meera.joshi@gmail.com', '9876543215', 23),
('AT000007', 'Vihaan Desai', 'vihaan.desai@gmail.com', '9876543216', 19),
('AT000008', 'Sara Khan', 'sara.khan@gmail.com', '9876543217', 25);

-- ============================================
-- Ticket Type Data
-- ============================================

INSERT INTO ticket_type
(ticket_type_id, type_name, total_quantity, available, price)
VALUES
('TT01', 'VIP', 500, 450, 5000.00),
('TT02', 'GENERAL', 5000, 4700, 2500.00),
('TT03', 'STUDENT', 2000, 1850, 1200.00);

-- ============================================
-- Ticket Data
-- ============================================

INSERT INTO ticket
(ticket_id, attendee_id, ticket_type_id, purchase_date, entry_date, ticket_status)
VALUES
('TK000001', 'AT000001', 'TT01', '2026-08-01', '2026-12-20', 'Active'),
('TK000002', 'AT000002', 'TT02', '2026-08-05', '2026-12-20', 'Active'),
('TK000003', 'AT000003', 'TT02', '2026-08-10', '2026-12-20', 'Used'),
('TK000004', 'AT000004', 'TT03', '2026-08-12', '2026-12-21', 'Active'),
('TK000005', 'AT000005', 'TT01', '2026-08-15', '2026-12-20', 'Cancelled'),
('TK000006', 'AT000006', 'TT02', '2026-08-18', '2026-12-21', 'Active'),
('TK000007', 'AT000007', 'TT03', '2026-08-20', '2026-12-21', 'Used'),
('TK000008', 'AT000008', 'TT03', '2026-08-22', '2026-12-21', 'Active');

-- ============================================
-- Payment Data
-- ============================================

INSERT INTO payment
(payment_id, ticket_id, amount, payment_date, payment_method, payment_status)
VALUES
('PM000001', 'TK000001', 5000.00, '2026-08-01 10:30:00', 'UPI', 'Success'),
('PM000002', 'TK000002', 2500.00, '2026-08-05 14:15:00', 'Card', 'Success'),
('PM000003', 'TK000003', 2500.00, '2026-08-10 11:45:00', 'Net Banking', 'Success'),
('PM000004', 'TK000004', 1200.00, '2026-08-12 16:20:00', 'UPI', 'Success'),
('PM000005', 'TK000005', 5000.00, '2026-08-15 09:10:00', 'Card', 'Refunded'),
('PM000006', 'TK000006', 2500.00, '2026-08-18 13:05:00', 'UPI', 'Success'),
('PM000007', 'TK000007', 1200.00, '2026-08-20 15:40:00', 'Card', 'Success'),
('PM000008', 'TK000008', 1200.00, '2026-08-22 12:25:00', 'UPI', 'Pending');

-- ============================================
-- Query 1: Display all attendees(select)
-- ============================================

SELECT *
FROM attendee;

-- ============================================
-- Query 2: Find attendees aged 21 or above(where)
-- ============================================

SELECT attendee_id, attendee_name, age
FROM attendee
WHERE age >= 21;

-- ============================================
-- Query 3: Display ticket details with attendee names (inner join) 
-- ============================================

SELECT
    t.ticket_id,
    a.attendee_name,
    t.ticket_type_id,
    t.purchase_date,
    t.entry_date,
    t.ticket_status
FROM ticket t
JOIN attendee a
    ON t.attendee_id = a.attendee_id;

-- ============================================
-- Query 4: Display ticket details with ticket type and price
-- SQL Concept: INNER JOIN (Multiple Tables)
-- ============================================

SELECT
    t.ticket_id,
    a.attendee_name,
    tt.type_name,
    tt.price,
    t.ticket_status
FROM ticket t
INNER JOIN attendee a
    ON t.attendee_id = a.attendee_id
INNER JOIN ticket_type tt
    ON t.ticket_type_id = tt.ticket_type_id;

-- ============================================
-- Query 5: Count tickets and calculate total ticket value by type
-- SQL Concept: Aggregate Functions
-- Syntax Used: COUNT() + SUM() + GROUP BY + HAVING
-- Purpose: Find the number of tickets and total ticket
--          value for each ticket type
-- ============================================

SELECT
    tt.type_name,
    COUNT(t.ticket_id) AS total_tickets,
    SUM(tt.price) AS total_sales
FROM ticket t
INNER JOIN ticket_type tt
    ON t.ticket_type_id = tt.ticket_type_id
GROUP BY tt.type_name
HAVING COUNT(t.ticket_id) > 1;

-- ============================================
-- Query 6: Display formatted attendee names
-- Syntax Used: UPPER() + LOWER() + SUBSTRING() + DISTINCT
-- ============================================

SELECT DISTINCT
    UPPER(attendee_name) AS attendee_name_upper,
    LOWER(SUBSTRING(email FROM POSITION('@' IN email) + 1)) AS email_domain
FROM attendee;

-- ============================================
-- Query 7: Find attendees with Active or Used tickets
-- SQL Concept: UNION
-- Syntax Used: SELECT + UNION
-- Purpose: Combine two result sets and remove duplicate
--          attendee IDs
-- ============================================

SELECT attendee_id
FROM ticket
WHERE ticket_status = 'Active'

UNION

SELECT attendee_id
FROM ticket
WHERE ticket_status = 'Used';

-- ============================================
-- Query 8: Find tickets that have a payment
-- SQL Concept: INTERSECT
-- ============================================

SELECT ticket_id
FROM ticket

INTERSECT

SELECT ticket_id
FROM payment;

-- ============================================
-- Query 9: Find tickets without payment records
-- SQL Concept: EXCEPT
-- ============================================

SELECT ticket_id
FROM ticket

EXCEPT

SELECT ticket_id
FROM payment;

-- ============================================
-- Query 10: Create a view for ticket details
-- SQL Concept: VIEW
-- ============================================

CREATE OR REPLACE VIEW ticket_attendee_view AS
SELECT
    t.ticket_id,
    a.attendee_name,
    tt.type_name AS ticket_type,
    tt.price,
    t.purchase_date,
    t.entry_date,
    t.ticket_status
FROM ticket t
INNER JOIN attendee a
    ON t.attendee_id = a.attendee_id
INNER JOIN ticket_type tt
    ON t.ticket_type_id = tt.ticket_type_id;

-- ============================================
-- Extra 1: Create an index on attendee email
-- SQL Concept: INDEX
-- ============================================

CREATE INDEX idx_attendee_email
ON attendee(email);

-- ============================================
-- Extra 2: Add a constraint to attendee phone
-- SQL Concept: ALTER TABLE
-- ============================================

ALTER TABLE attendee
ADD CONSTRAINT attendee_phone_numeric
CHECK (phone ~ '^[0-9]+$');

-- ============================================
-- Extra 3: Display tickets from highest to lowest price
-- SQL Concept: Sorting
-- ============================================

SELECT
    t.ticket_id,
    a.attendee_name,
    tt.type_name AS ticket_type,
    tt.price
FROM ticket t
JOIN attendee a
    ON t.attendee_id = a.attendee_id
JOIN ticket_type tt
    ON t.ticket_type_id = tt.ticket_type_id
ORDER BY tt.price DESC;

