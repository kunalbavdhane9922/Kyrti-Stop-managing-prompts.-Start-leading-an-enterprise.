-- Flyway Migration: Profession Templates Bootstrap
-- Idempotent insert of initial profession templates

INSERT INTO profession_templates (
    id,
    tenant_id,
    profession_code,
    profession_name,
    category,
    template_version,
    active_flag,
    definition,
    created_at,
    created_by
)
VALUES (
    gen_random_uuid(),
    'SYSTEM', -- Default or system tenant
    'BACKEND_ENGINEER',
    'Backend Engineer',
    'Engineering',
    1,
    true,
    '{
      "skills": ["Programming", "API Development", "Database Design", "Testing"],
      "responsibilities": ["Build Services", "Maintain APIs", "Write Tests", "Review Code"],
      "permissions": ["READ_TASKS", "UPDATE_TASKS", "CREATE_REPORTS"],
      "careerPath": ["Junior Engineer", "Engineer", "Senior Engineer", "Lead Engineer"],
      "learningPaths": ["Architecture", "Leadership", "Optimization", "Security"],
      "evaluationRules": {
        "metrics": ["Task Quality", "Task Completion", "Reliability", "Communication"]
      },
      "behaviorProfile": {
        "reasoning_profile": {
          "reasoning_type": "Technical",
          "planning_depth": "Medium",
          "risk_tolerance": "Low"
        },
        "communication_profile": {
          "communication_style": "Technical",
          "detail_level": "High",
          "reporting_style": "Structured"
        },
        "decision_profile": {
          "decision_speed": "Medium",
          "approval_requirements": "Team Lead",
          "risk_preference": "Conservative"
        },
        "collaboration_profile": {
          "leadership_level": "Individual Contributor",
          "delegation_style": "None",
          "coordination_scope": "Team"
        },
        "learning_profile": {
          "learning_speed": "High",
          "specialization_preference": "Backend Systems",
          "adaptation_rate": "Medium"
        }
      }
    }'::jsonb,
    CURRENT_TIMESTAMP,
    'SYSTEM_BOOTSTRAP'
)
ON CONFLICT (tenant_id, profession_code, template_version) DO NOTHING;
