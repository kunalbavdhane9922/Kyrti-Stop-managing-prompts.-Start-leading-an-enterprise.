export interface ProfessionalDto {
  id: string;
  tenantId: string;
  workerCode: string;
  displayName: string;
  professionId: string;
  level: string;
  workerType: string;
  originTemplateId: string;
  originTemplateVersion: number;
  originTemplateSnapshot: Record<string, any>;
  status: string; // ACTIVE, INACTIVE, TRAINING, ASSIGNED, EMPLOYED, AVAILABLE
  currentCompanyId: string | null;
  hireDate: string | null;
  retirementDate: string | null;
  activeAssignmentCount: number;
  completedTaskCount: number;
  failedTaskCount: number;
  currentCapabilityScore: number;
  currentReputationScore: number;
  createdAt: string;
  version: number;
}

export interface HireRequest {
  companyId: string;
  // ... other fields based on POST /v1/professionals/{id}/hire
}

export interface ReputationDto {
  id: string;
  workerId: string;
  score: number;
  level: string;
  // ... based on ReputationEntity
}
