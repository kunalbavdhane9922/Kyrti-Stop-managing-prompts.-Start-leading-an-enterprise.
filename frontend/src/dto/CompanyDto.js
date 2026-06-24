import { z } from 'zod';

const CompanySchema = z.object({
  id: z.string().optional(),
  companyId: z.string().optional(),
  name: z.string().optional(),
  legalName: z.string().optional(),
  registeredName: z.string().optional(),
  companyName: z.string().optional(),
  domain: z.string().optional(),
  tenantId: z.string().optional(),
  status: z.string().optional(),
  sagaCorrelationId: z.string().nullable().optional(),
  latestEventId: z.string().nullable().optional(),
  industry: z.string().nullable().optional(),
  companyType: z.string().nullable().optional(),
  registrationNumber: z.string().nullable().optional(),
  taxNumber: z.string().nullable().optional(),
  hqCountry: z.string().nullable().optional(),
  hqState: z.string().nullable().optional(),
  hqCity: z.string().nullable().optional(),
  hqAddress: z.string().nullable().optional(),
  employeeCount: z.number().nullable().optional(),
  revenueRange: z.string().nullable().optional(),
  growthStage: z.string().nullable().optional(),
  createdAt: z.string().optional(),
  updatedAt: z.string().optional(),
}).passthrough()
.refine(data => data.id || data.companyId, {
  message: "CRITICAL: Company identifier (id or companyId) is missing from the payload",
  path: ["id"]
});

export class CompanyDto {
  constructor(data = {}) {
    this.id = data.id || '';
    this.name = data.name || '';
    this.domain = data.domain || '';
    this.tenantId = data.tenantId || '';
    this.status = data.status || 'UNKNOWN';
    this.sagaCorrelationId = data.sagaCorrelationId || null;
    this.latestEventId = data.latestEventId || null;
    this.legalName = data.legalName || null;
    this.industry = data.industry || null;
    this.companyType = data.companyType || null;
    this.registrationNumber = data.registrationNumber || null;
    this.taxNumber = data.taxNumber || null;
    this.hqCountry = data.hqCountry || null;
    this.hqState = data.hqState || null;
    this.hqCity = data.hqCity || null;
    this.hqAddress = data.hqAddress || null;
    this.employeeCount = data.employeeCount || 0;
    this.revenueRange = data.revenueRange || null;
    this.growthStage = data.growthStage || null;
    this.createdAt = data.createdAt || new Date().toISOString();
    this.updatedAt = data.updatedAt || new Date().toISOString();
  }

  static fromApi(raw) {
    if (!raw) {
      throw new Error("Company payload missing completely");
    }

    const parsed = CompanySchema.safeParse(raw);
    
    if (!parsed.success) {
      console.error("Company API Contract Violation:", parsed.error.format());
      throw new Error(`Company API Contract Violation: ${(parsed.error.issues[0]?.message || 'Invalid Structure')}`);
    }

    const data = parsed.data;

    // Resolve Contract Drift
    const id = data.companyId ?? data.id;
    const name = data.legalName ?? data.registeredName ?? data.companyName ?? data.name ?? "";

    return new CompanyDto({
      ...data,
      id: id,
      name: name,
      legalName: name, // map to both for components expecting legalName
    });
  }
}

