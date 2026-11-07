USE db_bank;

-- Usuarios registrados. Se omite password para evitar exponer hashes en capturas.
SELECT id, first_name, last_name, email, role, created_at
FROM users
ORDER BY id;

-- Cuentas y saldos actuales.
SELECT id, account_number, account_type, balance, user_id, created_at, updated_at
FROM accounts
ORDER BY id;

-- Historial de transferencias.
SELECT id, amount, description, timestamp, transaction_type,
       source_account_id, destination_account_id
FROM transactions
ORDER BY id;
