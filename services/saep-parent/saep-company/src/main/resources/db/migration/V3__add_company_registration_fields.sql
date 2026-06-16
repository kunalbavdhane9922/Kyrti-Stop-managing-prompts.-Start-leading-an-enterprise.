ALTER TABLE companies 
ADD COLUMN legal_name VARCHAR(255),
ADD COLUMN industry VARCHAR(255),
ADD COLUMN company_type VARCHAR(50),
ADD COLUMN registration_number VARCHAR(100),
ADD COLUMN tax_number VARCHAR(100),
ADD COLUMN hq_country VARCHAR(100),
ADD COLUMN hq_state VARCHAR(100),
ADD COLUMN hq_city VARCHAR(100),
ADD COLUMN hq_address TEXT,
ADD COLUMN employee_count INT,
ADD COLUMN revenue_range VARCHAR(100),
ADD COLUMN growth_stage VARCHAR(50);
