import { z } from 'zod';

// We accept various forms due to contract drift, but we STRICTLY enforce that 
// at least ONE valid identifier and token is provided in the payload.
const AuthSchema = z.object({
  token: z.string().optional(),
  accessToken: z.string().optional(),
  user: z.object({
    id: z.string().optional(),
    userId: z.string().optional(),
    principalId: z.string().optional(),
    professionalId: z.string().optional(),
    subject: z.string().optional(),
    sub: z.string().optional(),
    email: z.string().optional(),
    roles: z.array(z.string()).optional(),
    tenantId: z.string().optional(),
  }).passthrough().optional()
}).passthrough()
.refine(data => data.token || data.accessToken, {
  message: "CRITICAL: Authentication token is missing from the payload",
  path: ["token"]
})
.refine(data => {
  const user = data.user || data;
  return user.id || user.userId || user.principalId || user.professionalId || user.subject || user.sub;
}, {
  message: "CRITICAL: User identifier is missing from the payload",
  path: ["user.id"]
});

export class AuthDto {
  constructor(data = {}) {
    this.token = data.token || '';
    this.user = {
      id: data.user?.id || '',
      email: data.user?.email || '',
      roles: data.user?.roles || [],
      tenantId: data.user?.tenantId || null
    };
  }

  static fromApi(raw) {
    if (!raw) {
      throw new Error("Auth payload missing completely");
    }

    // Zod will now THROW an error automatically if token or user.id is missing!
    const parsed = AuthSchema.safeParse(raw);
    
    if (!parsed.success) {
      console.error("Auth API Contract Violation:", parsed.error.format());
      throw new Error(`Auth API Contract Violation: ${(parsed.error.issues[0]?.message || 'Invalid Structure')}`);
    }

    const data = parsed.data;
    const token = data.token ?? data.accessToken;
    const rawUser = data.user || data; 

    const userId = rawUser.userId ?? rawUser.principalId ?? rawUser.professionalId ?? rawUser.subject ?? rawUser.sub ?? rawUser.id;
    
    return new AuthDto({
      token: token,
      user: {
        id: userId,
        email: rawUser.email || '',
        roles: rawUser.roles || [],
        tenantId: rawUser.tenantId || null
      }
    });
  }
}

