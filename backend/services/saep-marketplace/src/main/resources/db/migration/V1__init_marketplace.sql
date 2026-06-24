-- V1__init_marketplace.sql

CREATE TABLE IF NOT EXISTS marketplace_agents (
    id VARCHAR(50) PRIMARY KEY,
    display_name VARCHAR(100) NOT NULL,
    specialization VARCHAR(100) NOT NULL,
    reputation_score DECIMAL(5,2) DEFAULT 0,
    verified_badge_count INT DEFAULT 0,
    avg_roi INT DEFAULT 0,
    avg_latency INT DEFAULT 0,
    total_tasks_completed INT DEFAULT 0,
    is_available BOOLEAN DEFAULT TRUE,
    tier VARCHAR(20) DEFAULT 'standard',
    cost VARCHAR(50),
    engine VARCHAR(50),
    bio TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS marketplace_agent_skills (
    agent_id VARCHAR(50) REFERENCES marketplace_agents(id) ON DELETE CASCADE,
    skill VARCHAR(50) NOT NULL,
    PRIMARY KEY (agent_id, skill)
);

-- Seed Data (Production Mock Equivalents)
INSERT INTO marketplace_agents (id, display_name, specialization, reputation_score, verified_badge_count, avg_roi, avg_latency, total_tasks_completed, is_available, tier, cost, engine, bio)
VALUES
('mkt_agent_1', 'Apex-Coder-7', 'Full-Stack Engineering', 97.3, 8, 340, 290, 2841, true, 'elite', '$15.00/M tokens', 'GPT-4o', 'Senior Full-Stack Engineering specialist focusing on operational efficiency and risk mitigation.'),
('mkt_agent_2', 'StrategyMind-4', 'Business Strategy', 94.1, 6, 280, 410, 1523, true, 'elite', '$15.00/M tokens', 'GPT-4o', 'Senior Business Strategy specialist focusing on operational efficiency and risk mitigation.'),
('mkt_agent_3', 'ContentForge-2', 'Content Marketing', 91.8, 5, 220, 350, 967, true, 'standard', '$0.15/M tokens', 'Llama-3-8B', 'Mid-Level Content Marketing specialist focusing on operational efficiency and risk mitigation.'),
('mkt_agent_4', 'DataSentinel-9', 'Data Engineering', 96.5, 7, 310, 380, 1892, false, 'elite', '$15.00/M tokens', 'GPT-4o', 'Senior Data Engineering specialist focusing on operational efficiency and risk mitigation.'),
('mkt_agent_5', 'LegalDraft-3', 'Legal Documentation', 89.4, 4, 190, 520, 634, true, 'standard', '$0.90/M tokens', 'Llama-3-70B', 'Mid-Level Legal Documentation specialist focusing on operational efficiency and risk mitigation.'),
('mkt_agent_6', 'SecOps-Prime-1', 'Security Operations', 98.1, 9, 420, 260, 3102, true, 'elite', '$15.00/M tokens', 'GPT-4o', 'Senior Security Operations specialist focusing on operational efficiency and risk mitigation.')
ON CONFLICT DO NOTHING;

INSERT INTO marketplace_agent_skills (agent_id, skill) VALUES
('mkt_agent_1', 'Python'), ('mkt_agent_1', 'React'), ('mkt_agent_1', 'Node.js'), ('mkt_agent_1', 'PostgreSQL'),
('mkt_agent_2', 'Market Analysis'), ('mkt_agent_2', 'Forecasting'), ('mkt_agent_2', 'Competitive Intel'),
('mkt_agent_3', 'SEO'), ('mkt_agent_3', 'Copywriting'), ('mkt_agent_3', 'Social Media'), ('mkt_agent_3', 'Brand Voice'),
('mkt_agent_4', 'ETL'), ('mkt_agent_4', 'Spark'), ('mkt_agent_4', 'Data Modeling'), ('mkt_agent_4', 'ML Pipelines'),
('mkt_agent_5', 'Contract Review'), ('mkt_agent_5', 'Compliance'), ('mkt_agent_5', 'IP Analysis'),
('mkt_agent_6', 'Vulnerability Scan'), ('mkt_agent_6', 'Incident Response'), ('mkt_agent_6', 'Pen Testing')
ON CONFLICT DO NOTHING;
