-- =============================================================================
-- V4: Enterprise Organization Initialization System
-- Enhances company_nodes, departments, node_permissions, node_assignments
-- Adds permission_catalog table for production-grade permission management
-- =============================================================================

-- ─── 1. Enhance departments table ──────────────────────────────────────────────
ALTER TABLE departments ADD COLUMN IF NOT EXISTS is_custom BOOLEAN DEFAULT FALSE;
ALTER TABLE departments ADD COLUMN IF NOT EXISTS sort_order INTEGER DEFAULT 0;

-- ─── 2. Enhance company_nodes table ────────────────────────────────────────────
ALTER TABLE company_nodes ADD COLUMN IF NOT EXISTS node_type VARCHAR(50);
ALTER TABLE company_nodes ADD COLUMN IF NOT EXISTS occupant_name VARCHAR(255);
ALTER TABLE company_nodes ADD COLUMN IF NOT EXISTS occupant_email VARCHAR(255);
ALTER TABLE company_nodes ADD COLUMN IF NOT EXISTS occupant_phone VARCHAR(100);
ALTER TABLE company_nodes ADD COLUMN IF NOT EXISTS assignment_status VARCHAR(50) DEFAULT 'VACANT';
ALTER TABLE company_nodes ADD COLUMN IF NOT EXISTS decision_authority VARCHAR(500);
ALTER TABLE company_nodes ADD COLUMN IF NOT EXISTS sort_order INTEGER DEFAULT 0;
ALTER TABLE company_nodes ADD COLUMN IF NOT EXISTS group_count INTEGER DEFAULT 1;
ALTER TABLE company_nodes ADD COLUMN IF NOT EXISTS seniority VARCHAR(50);
ALTER TABLE company_nodes ADD COLUMN IF NOT EXISTS created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP;
ALTER TABLE company_nodes ADD COLUMN IF NOT EXISTS updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP;

-- Make department_id nullable (board members/executives may not belong to a department)
ALTER TABLE company_nodes ALTER COLUMN department_id DROP NOT NULL;

-- Update existing records to have a node_type
UPDATE company_nodes SET node_type = 'EXECUTIVE' WHERE node_type IS NULL;
UPDATE company_nodes SET assignment_status = occupant_type WHERE assignment_status = 'VACANT' AND occupant_type IS NOT NULL;

-- ─── 3. Enhance node_permissions table ─────────────────────────────────────────
ALTER TABLE node_permissions ADD COLUMN IF NOT EXISTS tenant_id VARCHAR(255);
ALTER TABLE node_permissions ADD COLUMN IF NOT EXISTS permission_category VARCHAR(100);
ALTER TABLE node_permissions ADD COLUMN IF NOT EXISTS permission_label VARCHAR(255);

-- ─── 4. Enhance node_assignments table ─────────────────────────────────────────
ALTER TABLE node_assignments ADD COLUMN IF NOT EXISTS tenant_id VARCHAR(255);
ALTER TABLE node_assignments ADD COLUMN IF NOT EXISTS assignment_type VARCHAR(50);
ALTER TABLE node_assignments ADD COLUMN IF NOT EXISTS human_name VARCHAR(255);
ALTER TABLE node_assignments ADD COLUMN IF NOT EXISTS human_email VARCHAR(255);
ALTER TABLE node_assignments ADD COLUMN IF NOT EXISTS ai_agent_id VARCHAR(255);
ALTER TABLE node_assignments ADD COLUMN IF NOT EXISTS status VARCHAR(50) DEFAULT 'UNASSIGNED';

-- Make assigned_entity_id nullable (not all assignments have an entity yet)
ALTER TABLE node_assignments ALTER COLUMN assigned_entity_id DROP NOT NULL;

-- ─── 5. Create permission_catalog table ────────────────────────────────────────
CREATE TABLE IF NOT EXISTS permission_catalog (
    id UUID PRIMARY KEY,
    tenant_id VARCHAR(255),
    category VARCHAR(100) NOT NULL,
    permission_key VARCHAR(255) NOT NULL,
    label VARCHAR(255) NOT NULL,
    description TEXT,
    is_system BOOLEAN DEFAULT TRUE,
    sort_order INTEGER DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Seed production-grade permission catalog (system-level, tenant_id = NULL = global)
INSERT INTO permission_catalog (id, tenant_id, category, permission_key, label, description, is_system, sort_order) VALUES
-- Task Management
(gen_random_uuid(), NULL, 'TASK_MANAGEMENT', 'task.view', 'View Tasks', 'View assigned and team tasks', TRUE, 1),
(gen_random_uuid(), NULL, 'TASK_MANAGEMENT', 'task.create', 'Create Tasks', 'Create new tasks and subtasks', TRUE, 2),
(gen_random_uuid(), NULL, 'TASK_MANAGEMENT', 'task.edit_own', 'Edit Own Tasks', 'Modify tasks created by self', TRUE, 3),
(gen_random_uuid(), NULL, 'TASK_MANAGEMENT', 'task.edit_any', 'Edit Any Task', 'Modify any task in assigned scope', TRUE, 4),
(gen_random_uuid(), NULL, 'TASK_MANAGEMENT', 'task.delete', 'Delete Tasks', 'Remove tasks permanently', TRUE, 5),
(gen_random_uuid(), NULL, 'TASK_MANAGEMENT', 'task.assign', 'Assign Tasks', 'Assign tasks to team members', TRUE, 6),
(gen_random_uuid(), NULL, 'TASK_MANAGEMENT', 'task.approve', 'Approve Tasks', 'Approve completed task deliverables', TRUE, 7),

-- Code & Engineering
(gen_random_uuid(), NULL, 'CODE_ENGINEERING', 'code.access_repo', 'Access Code Repository', 'Clone, pull, and browse source code', TRUE, 10),
(gen_random_uuid(), NULL, 'CODE_ENGINEERING', 'code.create_pr', 'Create Pull Requests', 'Submit code for review', TRUE, 11),
(gen_random_uuid(), NULL, 'CODE_ENGINEERING', 'code.merge', 'Merge Code', 'Merge approved pull requests', TRUE, 12),
(gen_random_uuid(), NULL, 'CODE_ENGINEERING', 'code.review', 'Code Review', 'Review and approve code changes', TRUE, 13),
(gen_random_uuid(), NULL, 'CODE_ENGINEERING', 'code.branch_manage', 'Branch Management', 'Create, delete, and protect branches', TRUE, 14),

-- Deployment & Infrastructure
(gen_random_uuid(), NULL, 'DEPLOYMENT', 'deploy.staging', 'Deploy to Staging', 'Deploy application to staging environment', TRUE, 20),
(gen_random_uuid(), NULL, 'DEPLOYMENT', 'deploy.production', 'Deploy to Production', 'Deploy application to production environment', TRUE, 21),
(gen_random_uuid(), NULL, 'DEPLOYMENT', 'deploy.rollback', 'Rollback Deployment', 'Revert to previous deployment version', TRUE, 22),
(gen_random_uuid(), NULL, 'DEPLOYMENT', 'infra.manage', 'Manage Infrastructure', 'Provision and configure cloud resources', TRUE, 23),

-- Budget & Finance
(gen_random_uuid(), NULL, 'BUDGET_FINANCE', 'budget.view', 'View Budget', 'View department and project budgets', TRUE, 30),
(gen_random_uuid(), NULL, 'BUDGET_FINANCE', 'budget.request', 'Request Budget', 'Submit budget allocation requests', TRUE, 31),
(gen_random_uuid(), NULL, 'BUDGET_FINANCE', 'budget.approve', 'Approve Budget', 'Approve budget requests and expenditures', TRUE, 32),
(gen_random_uuid(), NULL, 'BUDGET_FINANCE', 'finance.payments', 'Process Payments', 'Initiate and process financial transactions', TRUE, 33),
(gen_random_uuid(), NULL, 'BUDGET_FINANCE', 'finance.invoices', 'Manage Invoices', 'Create, send, and track invoices', TRUE, 34),

-- Analytics & Reporting
(gen_random_uuid(), NULL, 'ANALYTICS', 'analytics.team', 'View Team Analytics', 'Access team performance metrics', TRUE, 40),
(gen_random_uuid(), NULL, 'ANALYTICS', 'analytics.company', 'View Company Analytics', 'Access company-wide metrics and dashboards', TRUE, 41),
(gen_random_uuid(), NULL, 'ANALYTICS', 'analytics.export', 'Export Reports', 'Download and export analytical reports', TRUE, 42),

-- HR & People
(gen_random_uuid(), NULL, 'HR_PEOPLE', 'hr.view_records', 'View Employee Records', 'Access employee profiles and information', TRUE, 50),
(gen_random_uuid(), NULL, 'HR_PEOPLE', 'hr.manage_leave', 'Manage Leave', 'Approve and manage leave requests', TRUE, 51),
(gen_random_uuid(), NULL, 'HR_PEOPLE', 'hr.conduct_reviews', 'Conduct Reviews', 'Initiate and manage performance reviews', TRUE, 52),
(gen_random_uuid(), NULL, 'HR_PEOPLE', 'hr.manage_payroll', 'Manage Payroll', 'Process and manage employee compensation', TRUE, 53),

-- Sprint & Project Management
(gen_random_uuid(), NULL, 'PROJECT_MANAGEMENT', 'sprint.manage', 'Sprint Management', 'Create, plan, and close sprints', TRUE, 60),
(gen_random_uuid(), NULL, 'PROJECT_MANAGEMENT', 'release.approve', 'Release Approval', 'Approve software releases', TRUE, 61),
(gen_random_uuid(), NULL, 'PROJECT_MANAGEMENT', 'project.create', 'Create Projects', 'Initialize new projects', TRUE, 62),
(gen_random_uuid(), NULL, 'PROJECT_MANAGEMENT', 'project.archive', 'Archive Projects', 'Archive completed projects', TRUE, 63),

-- Administration
(gen_random_uuid(), NULL, 'ADMINISTRATION', 'admin.manage_roles', 'Manage Roles', 'Create and modify organizational roles', TRUE, 70),
(gen_random_uuid(), NULL, 'ADMINISTRATION', 'admin.manage_permissions', 'Manage Permissions', 'Configure role-based permissions', TRUE, 71),
(gen_random_uuid(), NULL, 'ADMINISTRATION', 'admin.system_config', 'System Configuration', 'Modify system-level settings', TRUE, 72),
(gen_random_uuid(), NULL, 'ADMINISTRATION', 'admin.audit_logs', 'View Audit Logs', 'Access system audit trail', TRUE, 73),
(gen_random_uuid(), NULL, 'ADMINISTRATION', 'admin.manage_integrations', 'Manage Integrations', 'Configure third-party integrations', TRUE, 74),

-- Communication
(gen_random_uuid(), NULL, 'COMMUNICATION', 'comm.send_announcements', 'Send Announcements', 'Broadcast company-wide announcements', TRUE, 80),
(gen_random_uuid(), NULL, 'COMMUNICATION', 'comm.manage_channels', 'Manage Channels', 'Create and manage communication channels', TRUE, 81),

-- Security
(gen_random_uuid(), NULL, 'SECURITY', 'security.view_incidents', 'View Security Incidents', 'Monitor security events and alerts', TRUE, 90),
(gen_random_uuid(), NULL, 'SECURITY', 'security.manage_access', 'Manage Access Controls', 'Configure authentication and authorization', TRUE, 91),
(gen_random_uuid(), NULL, 'SECURITY', 'security.data_classification', 'Data Classification', 'Classify and label sensitive data', TRUE, 92)

ON CONFLICT (id) DO NOTHING;

-- Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_company_nodes_build_id ON company_nodes(build_id);
CREATE INDEX IF NOT EXISTS idx_company_nodes_tenant_id ON company_nodes(tenant_id);
CREATE INDEX IF NOT EXISTS idx_company_nodes_parent ON company_nodes(parent_node_id);
CREATE INDEX IF NOT EXISTS idx_company_nodes_dept ON company_nodes(department_id);
CREATE INDEX IF NOT EXISTS idx_departments_build_id ON departments(build_id);
CREATE INDEX IF NOT EXISTS idx_departments_tenant_id ON departments(tenant_id);
CREATE INDEX IF NOT EXISTS idx_node_permissions_node ON node_permissions(node_id);
CREATE INDEX IF NOT EXISTS idx_node_assignments_node ON node_assignments(node_id);
CREATE INDEX IF NOT EXISTS idx_permission_catalog_category ON permission_catalog(category);
CREATE INDEX IF NOT EXISTS idx_permission_catalog_tenant ON permission_catalog(tenant_id);
