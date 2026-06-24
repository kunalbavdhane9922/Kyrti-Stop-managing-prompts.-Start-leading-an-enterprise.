export interface MarketplaceAgentDto {
  id: string;
  displayName: string;
  professionId: string | null;
  tenantId: string;
  specialization: string;
  reputationScore: number | null;
  verifiedBadgeCount: number | null;
  avgROI: number | null;
  avgLatency: number | null;
  totalTasksCompleted: number | null;
  status: 'AVAILABLE' | 'UNAVAILABLE' | 'RESERVED' | 'HIRED';
  isActive: boolean;
  tier: string | null;
  cost: string | null;
  engine: string | null;
  bio: string | null;
  skills: string[];
  createdAt: string;
}

export interface MarketplaceFilterDto {
  // ... filter criteria based on what /api/v1/marketplace/filters returns
}
