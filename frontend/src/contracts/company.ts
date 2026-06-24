export interface CompanyDto {
  id: string;
  name: string;
  domain: string;
  tenantId: string;
  status: string; // DRAFT, INITIALIZING, ACTIVE, FAILED, etc.
  sagaCorrelationId: string | null;
  latestEventId: string | null;
  legalName: string | null;
  industry: string | null;
  companyType: string | null;
  registrationNumber: string | null;
  taxNumber: string | null;
  hqCountry: string | null;
  hqState: string | null;
  hqCity: string | null;
  hqAddress: string | null;
  employeeCount: number | null;
  revenueRange: string | null;
  growthStage: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface CreateCompanyRequest {
  name: string;
  domain: string;
  tenantId: string;
  legalName?: string;
  industry?: string;
  companyType?: string;
  registrationNumber?: string;
  taxNumber?: string;
  hqCountry?: string;
  hqState?: string;
  hqCity?: string;
  hqAddress?: string;
  employeeCount?: number;
  revenueRange?: string;
  growthStage?: string;
}

export interface InitializeCompanyRequest {
  tenantId: string;
  schemaVersion: number;
  payload: string;
}
