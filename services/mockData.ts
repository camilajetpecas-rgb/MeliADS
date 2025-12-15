
import { Campaign, CampaignStatus } from '../types';

export const generateMockCampaigns = (): Campaign[] => {
  const today = new Date();
  
  // Helper to get a date X days ago
  const daysAgo = (days: number) => {
    const d = new Date();
    d.setDate(today.getDate() - days);
    return d;
  };

  return [
    {
      id: 'CMP-001',
      name: 'Eletrônicos - Smartphones Top',
      status: CampaignStatus.ACTIVE,
      dailyBudget: 250,
      spend: 4500,
      revenue: 45000,
      clicks: 1200,
      impressions: 45000,
      acos: 10,
      roas: 10,
      ctr: 2.66,
      conversionRate: 3.5,
      startDate: daysAgo(120)
    },
    {
      id: 'CMP-002',
      name: 'Acessórios Automotivos',
      status: CampaignStatus.ACTIVE,
      dailyBudget: 100,
      spend: 2800,
      revenue: 8400,
      clicks: 950,
      impressions: 60000,
      acos: 33.3,
      roas: 3,
      ctr: 1.58,
      conversionRate: 1.2,
      startDate: daysAgo(45)
    },
    {
      id: 'CMP-003',
      name: 'Moda Verão 2024',
      status: CampaignStatus.ACTIVE,
      dailyBudget: 50,
      spend: 1200,
      revenue: 1500,
      clicks: 800,
      impressions: 80000,
      acos: 80,
      roas: 1.25,
      ctr: 1.0,
      conversionRate: 0.5,
      startDate: daysAgo(15)
    },
    {
      id: 'CMP-004',
      name: 'Casa e Decoração',
      status: CampaignStatus.PAUSED,
      dailyBudget: 80,
      spend: 500,
      revenue: 2000,
      clicks: 150,
      impressions: 12000,
      acos: 25,
      roas: 4,
      ctr: 1.25,
      conversionRate: 2.0,
      startDate: daysAgo(200)
    },
    {
      id: 'CMP-005',
      name: 'Games e Consoles',
      status: CampaignStatus.ACTIVE,
      dailyBudget: 300,
      spend: 6000,
      revenue: 120000,
      clicks: 2500,
      impressions: 95000,
      acos: 5,
      roas: 20,
      ctr: 2.63,
      conversionRate: 5.0,
      startDate: daysAgo(300)
    },
    {
      id: 'CMP-006',
      name: 'Ferramentas Profissionais',
      status: CampaignStatus.ACTIVE,
      dailyBudget: 150,
      spend: 3000,
      revenue: 6000,
      clicks: 1000,
      impressions: 50000,
      acos: 50,
      roas: 2,
      ctr: 2.0,
      conversionRate: 1.0,
      startDate: daysAgo(60)
    },
    {
      id: 'CMP-007',
      name: 'Beleza e Perfumaria',
      status: CampaignStatus.ACTIVE,
      dailyBudget: 75,
      spend: 2100,
      revenue: 1800,
      clicks: 1500,
      impressions: 120000,
      acos: 116.6,
      roas: 0.85,
      ctr: 1.25,
      conversionRate: 0.3,
      startDate: daysAgo(90)
    },
    {
      id: 'CMP-008',
      name: 'Brinquedos Educativos',
      status: CampaignStatus.ACTIVE,
      dailyBudget: 60,
      spend: 100,
      revenue: 100,
      clicks: 50,
      impressions: 5000,
      acos: 100,
      roas: 1,
      ctr: 1.0,
      conversionRate: 0.1,
      startDate: daysAgo(5)
    }
  ];
};
