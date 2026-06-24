export interface AuthResponseDto {
  token: string;
  user: {
    id: string;
    email: string;
    roles: string[];
    tenantId?: string;
  };
}
