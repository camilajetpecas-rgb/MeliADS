
import React, { useState } from 'react';
import { Campaign, CampaignStatus } from '../types';
import { 
  ArrowLeft, 
  Calendar, 
  Download, 
  PauseCircle, 
  PlayCircle, 
  Settings, 
  Search,
  Tag,
  ShoppingBag,
  TrendingUp,
  Target
} from 'lucide-react';
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar
} from 'recharts';
import MetricCard from './MetricCard';

interface CampaignDetailViewProps {
  campaign: Campaign;
  onBack: () => void;
}

const CampaignDetailView: React.FC<CampaignDetailViewProps> = ({ campaign, onBack }) => {
  const [activeTab, setActiveTab] = useState<'ADS' | 'KEYWORDS' | 'SETTINGS'>('ADS');

  // Mock historical data specific for this campaign view
  const historyData = Array.from({ length: 14 }).map((_, i) => ({
    date: `Dia ${i + 1}`,
    spend: Math.floor(campaign.dailyBudget * (0.8 + Math.random() * 0.4)),
    revenue: Math.floor((campaign.revenue / 30) * (0.5 + Math.random())),
    acos: 10 + Math.random() * 20
  }));

  // Mock Ads Data
  const mockAds = [
    { id: 'MLB-1001', title: `${campaign.name} - Item Premium V1`, price: 129.90, status: 'ACTIVE', sold: 45, acos: campaign.acos - 2 },
    { id: 'MLB-1002', title: `${campaign.name} - Item Standard`, price: 89.90, status: 'PAUSED', sold: 12, acos: campaign.acos + 5 },
    { id: 'MLB-1003', title: `${campaign.name} - Kit Completo`, price: 299.90, status: 'ACTIVE', sold: 8, acos: campaign.acos - 5 },
  ];

  const formatCurrency = (val: number) => {
    return new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(val);
  };

  return (
    <div className="space-y-6 animate-in slide-in-from-right-4 duration-300">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
        <div className="flex items-center gap-4">
          <button 
            onClick={onBack}
            className="p-2 hover:bg-slate-100 rounded-lg text-slate-500 transition-colors"
          >
            <ArrowLeft size={24} />
          </button>
          <div>
            <div className="flex items-center gap-3">
              <h1 className="text-2xl font-bold text-slate-900">{campaign.name}</h1>
              <span className={`px-2 py-0.5 rounded-full text-xs font-bold border ${
                campaign.status === CampaignStatus.ACTIVE 
                  ? 'bg-green-50 text-green-700 border-green-200' 
                  : 'bg-yellow-50 text-yellow-700 border-yellow-200'
              }`}>
                {campaign.status}
              </span>
            </div>
            <div className="flex items-center gap-3 text-sm text-slate-500 mt-1">
              <span>ID: {campaign.id}</span>
              <span>•</span>
              <span className="flex items-center gap-1"><Target size={14}/> Estratégia: Rentabilidade</span>
            </div>
          </div>
        </div>

        <div className="flex gap-2">
          <button className="px-4 py-2 bg-white border border-slate-300 text-slate-700 font-medium rounded-lg hover:bg-slate-50 flex items-center gap-2">
            <Calendar size={16} />
            Últimos 30 dias
          </button>
          <button className="px-4 py-2 bg-slate-900 text-white font-medium rounded-lg hover:bg-slate-800 flex items-center gap-2 shadow-lg shadow-slate-900/20">
            <Settings size={16} />
            Configurar
          </button>
        </div>
      </div>

      {/* Metrics Row */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <MetricCard 
          title="Investimento" 
          value={formatCurrency(campaign.spend)} 
          trend={-5} 
          inverseTrend
          icon={<TrendingUp size={20} />} 
        />
        <MetricCard 
          title="Receita" 
          value={formatCurrency(campaign.revenue)} 
          trend={12} 
          icon={<ShoppingBag size={20} />} 
        />
        <MetricCard 
          title="ROAS" 
          value={`${campaign.roas.toFixed(2)}x`} 
          trend={2.4} 
          icon={<Target size={20} />} 
        />
        <MetricCard 
          title="ACOS" 
          value={`${campaign.acos.toFixed(2)}%`} 
          trend={-1.5} 
          inverseTrend
          icon={<Tag size={20} />} 
        />
      </div>

      {/* Main Chart */}
      <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
        <h3 className="text-lg font-bold text-slate-800 mb-6">Desempenho Diário</h3>
        <div className="h-80 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={historyData} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
              <defs>
                <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.8}/>
                  <stop offset="95%" stopColor="#3b82f6" stopOpacity={0}/>
                </linearGradient>
                <linearGradient id="colorSpend" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#f59e0b" stopOpacity={0.8}/>
                  <stop offset="95%" stopColor="#f59e0b" stopOpacity={0}/>
                </linearGradient>
              </defs>
              <XAxis dataKey="date" stroke="#94a3b8" fontSize={12} tickLine={false} axisLine={false} />
              <YAxis stroke="#94a3b8" fontSize={12} tickLine={false} axisLine={false} tickFormatter={(val) => `R$${val}`} />
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
              <Tooltip />
              <Area type="monotone" dataKey="revenue" name="Receita" stroke="#3b82f6" fillOpacity={1} fill="url(#colorRevenue)" strokeWidth={2} />
              <Area type="monotone" dataKey="spend" name="Custo" stroke="#f59e0b" fillOpacity={1} fill="url(#colorSpend)" strokeWidth={2} />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Tabs Section */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="flex border-b border-slate-200">
          <button 
            onClick={() => setActiveTab('ADS')}
            className={`px-6 py-4 text-sm font-medium border-b-2 transition-colors flex items-center gap-2 ${activeTab === 'ADS' ? 'border-blue-600 text-blue-600 bg-blue-50/50' : 'border-transparent text-slate-500 hover:text-slate-700 hover:bg-slate-50'}`}
          >
            <ShoppingBag size={16} /> Anúncios ({mockAds.length})
          </button>
          <button 
            onClick={() => setActiveTab('KEYWORDS')}
            className={`px-6 py-4 text-sm font-medium border-b-2 transition-colors flex items-center gap-2 ${activeTab === 'KEYWORDS' ? 'border-blue-600 text-blue-600 bg-blue-50/50' : 'border-transparent text-slate-500 hover:text-slate-700 hover:bg-slate-50'}`}
          >
            <Search size={16} /> Palavras-chave
          </button>
        </div>

        <div className="p-6">
          {activeTab === 'ADS' && (
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="border-b border-slate-200">
                    <th className="py-3 px-4 text-xs font-semibold text-slate-500 uppercase">Anúncio</th>
                    <th className="py-3 px-4 text-xs font-semibold text-slate-500 uppercase text-center">Status</th>
                    <th className="py-3 px-4 text-xs font-semibold text-slate-500 uppercase text-right">Preço</th>
                    <th className="py-3 px-4 text-xs font-semibold text-slate-500 uppercase text-right">Vendas</th>
                    <th className="py-3 px-4 text-xs font-semibold text-slate-500 uppercase text-right">ACOS</th>
                    <th className="py-3 px-4 text-xs font-semibold text-slate-500 uppercase text-right">Ações</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {mockAds.map((ad) => (
                    <tr key={ad.id} className="hover:bg-slate-50">
                      <td className="py-3 px-4">
                        <div className="font-medium text-slate-800">{ad.title}</div>
                        <div className="text-xs text-slate-400">{ad.id}</div>
                      </td>
                      <td className="py-3 px-4 text-center">
                        <span className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium ${
                          ad.status === 'ACTIVE' ? 'bg-green-100 text-green-700' : 'bg-slate-100 text-slate-600'
                        }`}>
                          {ad.status === 'ACTIVE' ? 'Ativo' : 'Pausado'}
                        </span>
                      </td>
                      <td className="py-3 px-4 text-right text-slate-600">{formatCurrency(ad.price)}</td>
                      <td className="py-3 px-4 text-right text-slate-600">{ad.sold} un.</td>
                      <td className="py-3 px-4 text-right">
                        <span className={ad.acos > 30 ? 'text-red-600 font-medium' : 'text-green-600 font-medium'}>
                          {ad.acos.toFixed(2)}%
                        </span>
                      </td>
                      <td className="py-3 px-4 text-right">
                         <button className="text-blue-600 hover:underline text-xs">Gerenciar</button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {activeTab === 'KEYWORDS' && (
            <div className="text-center py-12 text-slate-400">
              <Search size={48} className="mx-auto mb-4 opacity-20" />
              <p>Funcionalidade de gestão de palavras-chave em desenvolvimento.</p>
              <button className="mt-4 px-4 py-2 border border-slate-200 rounded-lg text-sm hover:bg-slate-50">
                Ver termos de busca
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default CampaignDetailView;
