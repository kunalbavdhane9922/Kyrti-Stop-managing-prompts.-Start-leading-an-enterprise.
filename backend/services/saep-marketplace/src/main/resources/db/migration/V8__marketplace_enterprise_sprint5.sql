-- V8__marketplace_enterprise_sprint5.sql

-- Create marketplace_search_documents table
CREATE TABLE marketplace_search_documents (
    agent_id VARCHAR(255) PRIMARY KEY REFERENCES marketplace_agents(id),
    tenant_id UUID NOT NULL,
    document_body TEXT NOT NULL,
    status VARCHAR(50) NOT NULL,
    reputation_score DOUBLE PRECISION,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL
);

CREATE INDEX idx_search_docs_tenant 
ON marketplace_search_documents(tenant_id, status);
