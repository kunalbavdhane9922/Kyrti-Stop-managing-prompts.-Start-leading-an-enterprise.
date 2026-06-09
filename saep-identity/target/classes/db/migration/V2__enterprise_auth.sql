-- V2__enterprise_auth.sql

-- Differentiate brute force vectors
ALTER TABLE users RENAME COLUMN failed_login_attempts TO failed_password_attempts;
ALTER TABLE users ADD COLUMN failed_totp_attempts INT DEFAULT 0;

-- Audit-compliant Pending Setups
CREATE TABLE pending_two_factor_setups (
    id UUID PRIMARY KEY,
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    encrypted_secret VARCHAR(512) NOT NULL,
    expires_at TIMESTAMP NOT NULL,
    confirmed BOOLEAN DEFAULT FALSE
);

-- Recovery Codes (Hashed with BCrypt)
CREATE TABLE recovery_codes (
    id UUID PRIMARY KEY,
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    code_hash VARCHAR(512) NOT NULL,
    used BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Remember Device / Skip TOTP
CREATE TABLE trusted_devices (
    id UUID PRIMARY KEY,
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    device_id_hash VARCHAR(255) NOT NULL, -- Hashed so raw fingerprints don't leak
    expires_at TIMESTAMP NOT NULL,
    revoked BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    last_used_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Session Expiry Policy
ALTER TABLE user_sessions ADD COLUMN expires_at TIMESTAMP;
