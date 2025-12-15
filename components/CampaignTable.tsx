
import React, { useState, useMemo } from 'react';
import { Campaign, CampaignStatus } from '../types';
import { 
  AlertCircle, 
  TrendingUp, 
  PauseCircle, 
  PlayCircle, 
  ArrowUpDown,
  ArrowUp,
  ArrowDown,
  Calendar,
  Filter,
  BarChart2,
  ChevronRight
} from 'lucide-react';

interface CampaignTableProps {
  campaigns: Campaign[];
  onSelectCampaign?: (campaign: Campaign) => void;
}

type SortKey = keyof Campaign | 'health';
type SortDirection = 'asc' | 'desc';

interface SortConfig {
  key: SortKey;
  direction: SortDirection;
}

const CampaignTable: React.FC<CampaignTableProps> = ({ campaigns, onSelectCampaign }) => {
  const [sortConfig, setSortConfig] = useState<SortConfig>({ key: 'spend', direction: 'desc' });
  const [activeFilter, setActiveFilter] = useState<'ALL' | 'ACTIVE' | 'PAUSED'>('ALL');

  const handleSort = (key: SortKey) => {
    setSortConfig((current) => ({
      key,
      direction: current.key === key && current.direction === 'desc' ? 'asc' : 'desc',
    }));
  };

  const handleQuickSort = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const value = e.target.value;
    switch(value) {
      case 'newest': setSortConfig({ key: 'startDate', direction: 'desc' }); break;
      case 'oldest': setSortConfig({ key: 'startDate', direction: 'asc' }); break;
      case 'revenue_desc': setSortConfig({ key: 'revenue', direction: 'desc' }); break;
      case 'revenue_asc': setSortConfig({ key: 'revenue', direction: 'asc' }); break;
      case 'roas_desc': setSortConfig({ key: 'roas', direction: 'desc' }); break;
      case 'roas_asc': setSortConfig({ key: 'roas', direction: 'asc' }); break;
      case 'acos_desc': setSortConfig({ key: 'acos', direction: 'desc' }); break;
      case 'acos_asc': setSortConfig({ key: 'acos', direction: 'asc' }); break;
      default: break;
    }
  };

  const sortedAndFilteredCampaigns = useMemo(() => {
    let data = [...campaigns];

    // Filter
    if (activeFilter !== 'ALL') {
      data = data.filter(c => c.status === activeFilter);
    }

    // Sort
    data.sort((a, b) => {
      const aValue = a[sortConfig.key as keyof Campaign];
      const bValue = b[sortConfig.key as keyof Campaign];

      if (aValue < bValue) return sortConfig.direction === 'asc' ? -1 : 1;
      if (aValue > bValue) return sortConfig.direction === 'asc' ? 1 : -1;
      return 0;
    });

    return data;
  }, [campaigns, sortConfig, activeFilter]);

  const getStatusColor = (status: CampaignStatus) => {
    switch (status) {
      case CampaignStatus.ACTIVE: return 'bg-green-100 text-green-700';
      case CampaignStatus.PAUSED: return 'bg-yellow-100 text-yellow-700';
      case CampaignStatus.ENDED: return 'bg-slate-100 text-slate-700';
      default: return 'bg-slate-100 text-slate-700';
    }
  };

  const formatCurrency = (val: number) => {
    return new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(val);
  };

  const renderSortIcon = (columnKey: SortKey) => {
    if (sortConfig.key !== columnKey) return <ArrowUpDown size={14} className="ml-1 text-slate-300 opacity-0 group-hover:opacity-100 transition-opacity" />;
    return sortConfig.direction === 'asc' 
      ? <ArrowUp size={14} className="ml-1 text-blue-600" />
      : <ArrowDown size={14} className="ml-1 text-blue-600" />;
  };

  const SortableHeader = ({ label, columnKey, align = 'left' }: { label: string, columnKey: SortKey, align?: 'left' | 'right' | 'center' }) => (
    <th 
      className={`px-6 py-4 text-xs font-semibold text-slate-500 uppercase tracking-wider cursor-pointer hover:bg-slate-100 transition-colors group select-none text-${align}`}
      onClick={() => handleSort(columnKey)}
    >
      <div className={`flex items-center ${align === 'right' ? 'justify-end' : align === 'center' ? 'justify-center' : 'justify-start'}`}>
        {label}
        {renderSortIcon(columnKey)}
      </div>
    </th>
  );

  return (
    <div className="space-y-4">
      {/* Quick Filters & Sorting Toolbar */}
      <div className="bg-white p-4 rounded-xl shadow-sm border border-slate-100 flex flex-col sm:flex-row gap-4 justify-between items-center">
        
        {/* Status Filters */}
        <div className="flex bg-slate-100 p-1 rounded-lg">
           <button 
             onClick={() => setActiveFilter('ALL')}
             className={`px-3 py-1.5 text-sm font-medium rounded-md transition-all ${activeFilter === 'ALL' ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}
           >
             Todas
           </button>
           <button 
             onClick={() => setActiveFilter('ACTIVE')}
             className={`px-3 py-1.5 text-sm font-medium rounded-md transition-all ${activeFilter === 'ACTIVE' ? 'bg-white text-green-700 shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}
           >
             Ativas
           </button>
           <button 
             onClick={() => setActiveFilter('PAUSED')}
             className={`px-3 py-1.5 text-sm font-medium rounded-md transition-all ${activeFilter === 'PAUSED' ? 'bg-white text-yellow-700 shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}
           >
             Pausadas
           </button>
        </div>

        {/* Smart Sort Dropdown */}
        <div className="flex items-center gap-3 w-full sm:w-auto">
          <div className="flex items-center gap-2 text-slate-500 text-sm font-medium">
             <Filter size={16} />
             <span className="hidden sm:inline">Ordenar por:</span>
          </div>
          <select 
            className="bg-slate-50 border border-slate-200 text-slate-700 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block p-2.5 outline-none w-full sm:w-64"
            onChange={handleQuickSort}
            defaultValue="default"
          >
            <option value="default" disabled>Selecione um indicador...</option>
            <option value="newest">📅 Mais Recentes</option>
            <option value="oldest">📅 Mais Antigas</option>
            <option value="revenue_desc">💰 Mais Rentáveis (Receita)</option>
            <option value="revenue_asc">💸 Menos Rentáveis</option>
            <option value="roas_desc">📈 ROAS Mais Alto</option>
            <option value="roas_asc">📉 ROAS Mais Baixo</option>
            <option value="acos_desc">⚠️ ACOS Mais Alto (Crítico)</option>
            <option value="acos_asc">✅ ACOS Mais Baixo (Eficiente)</option>
          </select>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-slate-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-200">
                <SortableHeader label="Campanha" columnKey="name" />
                <SortableHeader label="Status" columnKey="status" align="center" />
                <SortableHeader label="Investimento" columnKey="spend" align="right" />
                <SortableHeader label="Receita" columnKey="revenue" align="right" />
                <SortableHeader label="ACOS" columnKey="acos" align="right" />
                <SortableHeader label="ROAS" columnKey="roas" align="right" />
                <th className="px-6 py-4 text-xs font-semibold text-slate-500 uppercase tracking-wider text-center">Saúde</th>
                <th className="px-4 py-4 w-10"></th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {sortedAndFilteredCampaigns.map((campaign) => (
                <tr 
                  key={campaign.id} 
                  onClick={() => onSelectCampaign && onSelectCampaign(campaign)}
                  className="hover:bg-blue-50/50 transition-colors cursor-pointer group"
                >
                  <td className="px-6 py-4">
                    <div className="font-medium text-slate-900 group-hover:text-blue-700 transition-colors">{campaign.name}</div>
                    <div className="flex items-center gap-2 mt-1">
                      <span className="text-xs text-slate-400">ID: {campaign.id}</span>
                      <span className="text-slate-300">•</span>
                      <span className="text-xs text-slate-400 flex items-center gap-1">
                         <Calendar size={10} /> {new Date(campaign.startDate).toLocaleDateString()}
                      </span>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-center">
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(campaign.status)}`}>
                      {campaign.status === CampaignStatus.ACTIVE ? <PlayCircle size={12} className="mr-1"/> : <PauseCircle size={12} className="mr-1"/>}
                      {campaign.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-right font-medium text-slate-700">
                    {formatCurrency(campaign.spend)}
                  </td>
                  <td className="px-6 py-4 text-right font-medium text-slate-700">
                    {formatCurrency(campaign.revenue)}
                  </td>
                  <td className="px-6 py-4 text-right">
                    <span className={`font-semibold ${campaign.acos > 30 ? 'text-red-600' : 'text-green-600'}`}>
                      {campaign.acos.toFixed(2)}%
                    </span>
                  </td>
                  <td className="px-6 py-4 text-right text-slate-700">
                    {campaign.roas.toFixed(2)}x
                  </td>
                  <td className="px-6 py-4 text-center">
                    {campaign.acos > 40 ? (
                      <div className="flex items-center justify-center text-red-500 gap-1 text-xs font-bold" title="ACOS Alto">
                        <AlertCircle size={16} /> Crítico
                      </div>
                    ) : campaign.roas > 8 ? (
                      <div className="flex items-center justify-center text-green-500 gap-1 text-xs font-bold" title="Alta Performance">
                        <TrendingUp size={16} /> Ótimo
                      </div>
                    ) : (
                      <div className="flex items-center justify-center text-yellow-500 gap-1 text-xs font-bold" title="Estável">
                        <TrendingUp size={16} /> Estável
                      </div>
                    )}
                  </td>
                  <td className="px-4 py-4 text-center text-slate-300">
                    <ChevronRight size={18} className="group-hover:text-blue-500 group-hover:translate-x-1 transition-all" />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          
          {sortedAndFilteredCampaigns.length === 0 && (
            <div className="p-12 text-center text-slate-400">
              <BarChart2 size={48} className="mx-auto mb-4 opacity-20" />
              <p>Nenhuma campanha encontrada com os filtros selecionados.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default CampaignTable;
