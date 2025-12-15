
export enum CampaignStatus {
  ACTIVE = 'ACTIVE',
  PAUSED = 'PAUSED',
  ENDED = 'ENDED'
}

export interface Campaign {
  id: string;
  name: string;
  status: CampaignStatus;
  dailyBudget: number;
  spend: number;
  revenue: number;
  clicks: number;
  impressions: number;
  acos: number; // Advertising Cost of Sales (Spend / Revenue) * 100
  roas: number; // Return on Ad Spend (Revenue / Spend)
  ctr: number; // Click Through Rate
  conversionRate: number;
  startDate: Date; // Added for sorting by date
}

export interface MetricSummary {
  totalSpend: number;
  totalRevenue: number;
  totalClicks: number;
  averageAcos: number;
  averageRoas: number;
}

export interface LinkedAccount {
  id: string;
  nickname: string;
  sellerId: string;
  status: 'CONNECTED' | 'EXPIRED' | 'ERROR';
  lastSync: Date;
}

export interface User {
  email: string;
  name: string;
}

export interface TeamMember {
  id: string;
  name: string;
  email: string;
  role: 'ADMIN' | 'EDITOR' | 'VIEWER';
  status: 'ACTIVE' | 'PENDING';
  addedAt: Date;
}

export type ViewState = 'DASHBOARD' | 'CAMPAIGNS' | 'OPTIMIZATION' | 'INTEGRATIONS' | 'TEAM';
