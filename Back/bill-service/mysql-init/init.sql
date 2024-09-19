-- Crear la base de datos si no existe
CREATE DATABASE IF NOT EXISTS bill_db;

-- Usar la base de datos
USE bill_db;

-- Crear tabla Status
CREATE TABLE IF NOT EXISTS statuses (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    description VARCHAR(255)
);

-- Insertar datos en Status
INSERT INTO statuses (description) VALUES
('Pago'),
('Pendiente'),
('Atrasado');

-- Crear tabla PaymentMethod
CREATE TABLE IF NOT EXISTS payment_methods (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    description VARCHAR(255)
);

-- Insertar datos en PaymentMethod
INSERT INTO payment_methods (description) VALUES
('Tarjeta de crédito'),
('Transferencia bancaria'),
('Efectivo');

-- Crear tabla ExpenseType
CREATE TABLE IF NOT EXISTS expense_types (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    description VARCHAR(255)
);

-- Insertar datos en ExpenseType
INSERT INTO expense_types (description) VALUES
('Alquiler'),
('Servicios'),
('Mantenimiento');

-- Crear tabla Bill
CREATE TABLE IF NOT EXISTS bills (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    owner_id BIGINT,
    bill_amount DOUBLE,
    first_expiration_date DATE,
    first_expiration_amount DOUBLE,
    second_expiration_date DATE,
    second_expiration_amount DOUBLE,
    payment_method_id BIGINT,
    status_id BIGINT,
    created_date DATETIME,
    created_user VARCHAR(255),
    last_updated_date DATETIME,
    last_updated_user VARCHAR(255),
    FOREIGN KEY (payment_method_id) REFERENCES payment_methods(id),
    FOREIGN KEY (status_id) REFERENCES statuses(id)
);

-- Insertar datos en Bill
INSERT INTO bills (owner_id, bill_amount, first_expiration_date, first_expiration_amount, second_expiration_date, second_expiration_amount, payment_method_id, status_id, created_date, created_user, last_updated_date, last_updated_user) VALUES
(1, 1000.00, '2024-10-01', 950.00, '2024-10-15', 1000.00, 1, 2, NOW(), 'admin', NOW(), 'admin'),
(2, 750.50, '2024-10-05', 700.00, '2024-10-20', 750.50, 2, 1, NOW(), 'admin', NOW(), 'admin'),
(3, 1250.75, '2024-10-10', 1200.00, '2024-10-25', 1250.75, 3, 3, NOW(), 'admin', NOW(), 'admin');

-- Crear tabla BillDetail
CREATE TABLE IF NOT EXISTS bill_details (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    bill_id BIGINT,
    expense_type_id BIGINT,
    description VARCHAR(255),
    amount DOUBLE,
    percentage DOUBLE,
    created_date DATETIME,
    created_user VARCHAR(255),
    last_updated_date DATETIME,
    last_updated_user VARCHAR(255),
    FOREIGN KEY (bill_id) REFERENCES bills(id),
    FOREIGN KEY (expense_type_id) REFERENCES expense_types(id)
);

-- Insertar datos en BillDetail
INSERT INTO bill_details (bill_id, expense_type_id, description, amount, percentage, created_date, created_user, last_updated_date, last_updated_user) VALUES
(1, 1, 'Alquiler de oficina', 800.00, 80.00, NOW(), 'admin', NOW(), 'admin'),
(1, 2, 'Electricidad', 200.00, 20.00, NOW(), 'admin', NOW(), 'admin'),
(2, 2, 'Agua y gas', 250.50, 33.33, NOW(), 'admin', NOW(), 'admin'),
(2, 3, 'Reparaciones', 500.00, 66.67, NOW(), 'admin', NOW(), 'admin'),
(3, 1, 'Alquiler de depósito', 1000.75, 80.00, NOW(), 'admin', NOW(), 'admin'),
(3, 2, 'Internet y teléfono', 250.00, 20.00, NOW(), 'admin', NOW(), 'admin');
