import { z } from 'zod';

const AgentSchema = z.object({
  id: z.string().optional(),
  agentId: z.string().optional(),
  professionId: z.string().optional(),
  workerTemplateId: z.string().optional(),
  agentTemplateId: z.string().optional(),
  name: z.string().optional(),
  agentName: z.string().optional(),
  professionName: z.string().optional(),
  profession: z.string().optional(),
  description: z.string().optional(),
  version: z.string().optional(),
  status: z.string().optional(),
  tenantId: z.string().optional(),
  skills: z.array(z.string()).optional(),
  hourlyRate: z.number().optional(),
  createdAt: z.string().optional(),
  updatedAt: z.string().optional(),
}).passthrough()
.refine(data => data.id || data.agentId || data.professionId || data.workerTemplateId || data.agentTemplateId, {
  message: "CRITICAL: Agent identifier is missing from the payload",
  path: ["id"]
});

export class AgentDto {
  constructor(data = {}) {
    this.id = data.id || '';
    this.name = data.name || '';
    this.profession = data.profession || '';
    this.description = data.description || '';
    this.version = data.version || '1.0';
    this.status = data.status || 'UNKNOWN';
    this.tenantId = data.tenantId || '';
    this.skills = data.skills || [];
    this.hourlyRate = data.hourlyRate || 0;
    this.createdAt = data.createdAt || new Date().toISOString();
    this.updatedAt = data.updatedAt || new Date().toISOString();
  }

  static fromApi(raw) {
    if (!raw) {
      throw new Error("Agent payload missing completely");
    }

    const parsed = AgentSchema.safeParse(raw);
    
    if (!parsed.success) {
      console.error("Agent API Contract Violation:", parsed.error.format());
      throw new Error(`Agent API Contract Violation: ${(parsed.error.issues[0]?.message || 'Invalid Structure')}`);
    }

    const data = parsed.data;

    // Resolve Contract Drift
    const id = data.agentId ?? data.professionId ?? data.workerTemplateId ?? data.agentTemplateId ?? data.id;
    const name = data.agentName ?? data.professionName ?? data.name ?? "";
    const profession = data.profession ?? data.professionName ?? name;

    return new AgentDto({
      ...data,
      id: id,
      name: name,
      profession: profession,
    });
  }
}

