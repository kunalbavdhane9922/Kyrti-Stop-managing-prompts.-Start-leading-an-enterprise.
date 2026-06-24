export interface ProposalDto {
  id: string;
  tenantId: string;
  type: string;
  status: string;
  proposerId: string;
  proposerType: string;
  payload: string | Record<string, any>; // Usually parsed JSON
  payloadVersion: string;
  requiredApprovals: number;
  currentApprovals: number;
  expiresAt: string;
  createdAt: string;
  updatedAt: string | null;
}

export interface PolicyDto {
  id: string;
  tenantId: string;
  type: string;
  name: string;
  description: string;
  status: string;
  version: string;
  configuration: string | Record<string, any>;
  createdAt: string;
  updatedAt: string | null;
}

export interface DecisionRequest {
  decision: 'APPROVE' | 'REJECT';
  reason?: string;
}

export interface DecisionResponse {
  id: string;
  proposalId: string;
  decision: string;
  deciderId: string;
  deciderType: string;
  createdAt: string;
}
