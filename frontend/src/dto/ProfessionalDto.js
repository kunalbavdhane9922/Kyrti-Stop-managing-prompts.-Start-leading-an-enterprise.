import { z } from 'zod';

const ProfessionalSchema = z.object({
  id: z.string().optional(),
  workerId: z.string().optional(),
  professionalId: z.string().optional(),
  digitalProfessionalId: z.string().optional(),
  name: z.string().optional(),
  title: z.string().optional(),
  status: z.string().optional(),
  tenantId: z.string().optional(),
  skills: z.array(z.string()).optional(),
  hourlyRate: z.number().optional(),
  availability: z.string().optional(),
  createdAt: z.string().optional(),
  updatedAt: z.string().optional(),
}).passthrough()
.refine(data => data.id || data.professionalId || data.digitalProfessionalId || data.workerId, {
  message: "CRITICAL: Professional identifier is missing from the payload",
  path: ["id"]
});

export class ProfessionalDto {
  constructor(data = {}) {
    this.id = data.id || '';
    this.name = data.name || '';
    this.title = data.title || '';
    this.status = data.status || 'UNKNOWN';
    this.tenantId = data.tenantId || '';
    this.skills = data.skills || [];
    this.hourlyRate = data.hourlyRate || 0;
    this.availability = data.availability || 'UNKNOWN';
    this.createdAt = data.createdAt || new Date().toISOString();
    this.updatedAt = data.updatedAt || new Date().toISOString();
  }

  static fromApi(raw) {
    if (!raw) {
      throw new Error("Professional payload missing completely");
    }

    const parsed = ProfessionalSchema.safeParse(raw);
    
    if (!parsed.success) {
      console.error("Professional API Contract Violation:", parsed.error.format());
      throw new Error(`Professional API Contract Violation: ${(parsed.error.issues[0]?.message || 'Invalid Structure')}`);
    }

    const data = parsed.data;

    // Resolve Contract Drift
    const id = data.professionalId ?? data.digitalProfessionalId ?? data.workerId ?? data.id;

    return new ProfessionalDto({
      ...data,
      id: id,
    });
  }
}

