-- V4__add_service_accounts.sql

CREATE TABLE service_accounts (
    id UUID PRIMARY KEY,
    client_id VARCHAR(255) UNIQUE NOT NULL,
    client_secret_hash VARCHAR(255) NOT NULL,
    name VARCHAR(255) NOT NULL,
    status VARCHAR(50) NOT NULL DEFAULT 'ACTIVE',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE service_account_roles (
    service_account_id UUID REFERENCES service_accounts(id) ON DELETE CASCADE,
    role_id UUID REFERENCES roles(id) ON DELETE CASCADE,
    PRIMARY KEY (service_account_id, role_id)
);

-- Seed an overarching SERVICE role
INSERT INTO roles (id, name) VALUES (gen_random_uuid(), 'SERVICE') ON CONFLICT (name) DO NOTHING;

-- Seed the SAEP AI Agent Service Account (for V1 Operational Readiness)
INSERT INTO service_accounts (id, client_id, client_secret_hash, name)
VALUES (
    gen_random_uuid(), 
    'saep-agent-client', 
    '$2a$10$Xo1E/b0x8p9Wc4X5x/a5r.TzE3eD1Tj1x7Zp8q9Wc4X5x/a5r.TzE', -- Spring Boot BCrypt placeholder (needs actual seeding later, we'll bypass hash check for demo or provide exact BCrypt)
    'SAEP Agent Runtime'
) ON CONFLICT (client_id) DO NOTHING;

-- Grant SERVICE role to it
INSERT INTO service_account_roles (service_account_id, role_id)
SELECT s.id, r.id 
FROM service_accounts s, roles r 
WHERE s.client_id = 'saep-agent-client' AND r.name = 'SERVICE'
ON CONFLICT DO NOTHING;
