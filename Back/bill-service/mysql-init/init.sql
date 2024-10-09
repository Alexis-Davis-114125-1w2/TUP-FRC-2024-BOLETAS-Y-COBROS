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

-- Boleta de enero (Pagada)
INSERT INTO bills (owner_id, bill_amount, first_expiration_date, first_expiration_amount, second_expiration_date, second_expiration_amount, payment_method_id, status_id, created_date, created_user, last_updated_date, last_updated_user)
VALUES
    (3, 1000.00, '2024-02-05', 950.00, '2024-02-15', 1000.00, 1, 1, NOW(), 'admin', NOW(), 'admin');

-- Boleta de febrero (Pagada)
INSERT INTO bills (owner_id, bill_amount, first_expiration_date, first_expiration_amount, second_expiration_date, second_expiration_amount, payment_method_id, status_id, created_date, created_user, last_updated_date, last_updated_user)
VALUES
    (3, 1066.67, '2024-03-05', 1013.34, '2024-03-15', 1066.67, 1, 1, NOW(), 'admin', NOW(), 'admin');

-- Boleta de marzo (Pagada)
INSERT INTO bills (owner_id, bill_amount, first_expiration_date, first_expiration_amount, second_expiration_date, second_expiration_amount, payment_method_id, status_id, created_date, created_user, last_updated_date, last_updated_user)
VALUES
    (3, 1000.00, '2024-04-05', 950.00, '2024-04-15', 1000.00, 1, 1, NOW(), 'admin', NOW(), 'admin');

-- Boleta de abril (Pagada)
INSERT INTO bills (owner_id, bill_amount, first_expiration_date, first_expiration_amount, second_expiration_date, second_expiration_amount, payment_method_id, status_id, created_date, created_user, last_updated_date, last_updated_user)
VALUES
    (3, 1000.00, '2024-05-05', 950.00, '2024-05-15', 1000.00, 1, 1, NOW(), 'admin', NOW(), 'admin');

-- Boleta de mayo (Pagada)
INSERT INTO bills (owner_id, bill_amount, first_expiration_date, first_expiration_amount, second_expiration_date, second_expiration_amount, payment_method_id, status_id, created_date, created_user, last_updated_date, last_updated_user)
VALUES
    (3, 1200.00, '2024-06-05', 1140.00, '2024-06-15', 1200.00, 1, 1, NOW(), 'admin', NOW(), 'admin');

-- Boleta de junio (Pagada)
INSERT INTO bills (owner_id, bill_amount, first_expiration_date, first_expiration_amount, second_expiration_date, second_expiration_amount, payment_method_id, status_id, created_date, created_user, last_updated_date, last_updated_user)
VALUES
    (3, 1000.00, '2024-07-05', 950.00, '2024-07-15', 1000.00, 1, 1, NOW(), 'admin', NOW(), 'admin');

-- Boleta de julio (Pagada)
INSERT INTO bills (owner_id, bill_amount, first_expiration_date, first_expiration_amount, second_expiration_date, second_expiration_amount, payment_method_id, status_id, created_date, created_user, last_updated_date, last_updated_user)
VALUES
    (3, 1000.00, '2024-08-05', 950.00, '2024-08-15', 1000.00, 1, 1, NOW(), 'admin', NOW(), 'admin');

-- Boleta de agosto (No pagada)
INSERT INTO bills (owner_id, bill_amount, first_expiration_date, first_expiration_amount, second_expiration_date, second_expiration_amount, payment_method_id, status_id, created_date, created_user, last_updated_date, last_updated_user)
VALUES
    (3, 1000.00, '2024-09-05', 950.00, '2024-09-15', 1000.00, 1, 2, NOW(), 'admin', NOW(), 'admin');

-- Boleta de septiembre (No pagada)
INSERT INTO bills (owner_id, bill_amount, first_expiration_date, first_expiration_amount, second_expiration_date, second_expiration_amount, payment_method_id, status_id, created_date, created_user, last_updated_date, last_updated_user)
VALUES
    (3, 1000.00, '2024-10-05', 950.00, '2024-10-15', 1000.00, 1, 2, NOW(), 'admin', NOW(), 'admin');


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

-- Detalles para la boleta de enero (bill_id = 1)
INSERT INTO bill_details (bill_id, expense_type_id, description, amount, percentage, created_date, created_user, last_updated_date, last_updated_user) VALUES
                                                                                                                                                           (1, 1, 'Alquiler de oficina', 800.00, 80.00, NOW(), 'admin', NOW(), 'admin'),
                                                                                                                                                           (1, 2, 'Electricidad', 200.00, 20.00, NOW(), 'admin', NOW(), 'admin');

-- Detalles para la boleta de febrero (bill_id = 2)
INSERT INTO bill_details (bill_id, expense_type_id, description, amount, percentage, created_date, created_user, last_updated_date, last_updated_user) VALUES
                                                                                                                                                           (2, 1, 'Alquiler de oficina', 800.00, 75.00, NOW(), 'admin', NOW(), 'admin'),
                                                                                                                                                           (2, 3, 'Agua y gas', 266.67, 25.00, NOW(), 'admin', NOW(), 'admin');

-- Detalles para la boleta de marzo (bill_id = 3)
INSERT INTO bill_details (bill_id, expense_type_id, description, amount, percentage, created_date, created_user, last_updated_date, last_updated_user) VALUES
                                                                                                                                                           (3, 1, 'Alquiler de oficina', 800.00, 80.00, NOW(), 'admin', NOW(), 'admin'),
                                                                                                                                                           (3, 2, 'Electricidad', 200.00, 20.00, NOW(), 'admin', NOW(), 'admin');

-- Detalles para la boleta de abril (bill_id = 4)
INSERT INTO bill_details (bill_id, expense_type_id, description, amount, percentage, created_date, created_user, last_updated_date, last_updated_user) VALUES
                                                                                                                                                           (4, 2, 'Internet y teléfono', 250.00, 25.00, NOW(), 'admin', NOW(), 'admin'),
                                                                                                                                                           (4, 3, 'Reparaciones menores', 750.00, 75.00, NOW(), 'admin', NOW(), 'admin');

-- Detalles para la boleta de mayo (bill_id = 5)
INSERT INTO bill_details (bill_id, expense_type_id, description, amount, percentage, created_date, created_user, last_updated_date, last_updated_user) VALUES
                                                                                                                                                           (5, 1, 'Alquiler de depósito', 900.00, 75.00, NOW(), 'admin', NOW(), 'admin'),
                                                                                                                                                           (5, 2, 'Limpieza y mantenimiento', 300.00, 25.00, NOW(), 'admin', NOW(), 'admin');

-- Detalles para la boleta de junio (bill_id = 6)
INSERT INTO bill_details (bill_id, expense_type_id, description, amount, percentage, created_date, created_user, last_updated_date, last_updated_user) VALUES
                                                                                                                                                           (6, 1, 'Alquiler de oficina', 800.00, 80.00, NOW(), 'admin', NOW(), 'admin'),
                                                                                                                                                           (6, 2, 'Electricidad', 200.00, 20.00, NOW(), 'admin', NOW(), 'admin');

-- Detalles para la boleta de julio (bill_id = 7)
INSERT INTO bill_details (bill_id, expense_type_id, description, amount, percentage, created_date, created_user, last_updated_date, last_updated_user) VALUES
                                                                                                                                                           (7, 1, 'Alquiler de oficina', 850.00, 85.00, NOW(), 'admin', NOW(), 'admin'),
                                                                                                                                                           (7, 2, 'Agua y gas', 150.00, 15.00, NOW(), 'admin', NOW(), 'admin');

-- Detalles para la boleta de agosto (bill_id = 8, No pagada)
INSERT INTO bill_details (bill_id, expense_type_id, description, amount, percentage, created_date, created_user, last_updated_date, last_updated_user) VALUES
                                                                                                                                                           (8, 1, 'Alquiler de oficina', 800.00, 80.00, NOW(), 'admin', NOW(), 'admin'),
                                                                                                                                                           (8, 2, 'Electricidad', 200.00, 20.00, NOW(), 'admin', NOW(), 'admin');

-- Detalles para la boleta de septiembre (bill_id = 9, No pagada)
INSERT INTO bill_details (bill_id, expense_type_id, description, amount, percentage, created_date, created_user, last_updated_date, last_updated_user) VALUES
                                                                                                                                                           (9, 1, 'Alquiler de oficina', 800.00, 80.00, NOW(), 'admin', NOW(), 'admin'),

