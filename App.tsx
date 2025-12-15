
import React, { useState, useEffect, useMemo } from 'react';
import Sidebar from './components/Sidebar';
import MetricCard from './components/MetricCard';
import CampaignTable from './components/CampaignTable';
import LoginScreen from './components/LoginScreen';
import IntegrationsView from './components/IntegrationsView';
import TeamView from './components/TeamView';
import CampaignDetailView from './components/CampaignDetailView';
import { ViewState, Campaign, User } from './types';
import { generateMockCampaigns } from './services/mockData';
import { analyzeCampaigns } from './services/geminiService';
import { 
  DollarSign, 
  MousePointer2, 
  ShoppingBag, 
  Percent,
  Search,
  Filter,
  BrainCircuit,
  Loader2,
  AlertTriangle,
  Link2
} from 'lucide-react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  LineChart,
  Line,
  Legend
} from 'recharts';
import ReactMarkdown from 'react-markdown';

const App: React.FC = () => {
  // Auth State
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState<User | undefined>(undefined);

  // App State
  const [currentView, setCurrentView] = useState<ViewState>('DASHBOARD');
  const [campaigns, setCampaigns] = useState<Campaign[]>([]);
  const [selectedCampaign, setSelectedCampaign] = useState<Campaign | null>(null);
  const [loadingAnalysis, setLoadingAnalysis] = useState(false);
  const [analysisResult, setAnalysisResult] = useState<string | null>(null);

  // Initialize Data
  useEffect(() => {
    // Simulate API Fetch
    const data = generateMockCampaigns();
    setCampaigns(data);
  }, []);

  const handleLogin = (email: string) => {
    setUser({
      email,
      name: 'Gestor da Conta' // In a real app, this comes from backend
    });
    setIsAuthenticated(true);
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    setUser(undefined);
    setCurrentView('DASHBOARD');
  };

  const handleViewChange = (view: ViewState) => {
    setCurrentView(view);
    // Reset selection when changing main views, unless we want persistence
    if (view !== 'CAMPAIGNS') {
      setSelectedCampaign(null);
    }
  };

  // Derived Metrics
  const totalSpend = campaigns.reduce((acc, c) => acc + c.spend, 0);
  const totalRevenue = campaigns.reduce((acc, c) => acc + c.revenue, 0);
  const totalClicks = campaigns.reduce((acc, c) => acc + c.clicks, 0);
  const globalAcos = totalRevenue > 0 ? (totalSpend / totalRevenue) * 100 : 0;
  
  // Chart Data Preparation
  const performanceData = useMemo(() => {
    return campaigns.map(c => ({
      name: c.name.length > 15 ? c.name.substring(0, 15) + '...' : c.name,
      spend: c.spend,
      revenue: c.revenue,
      acos: c.acos
    })).sort((a, b) => b.spend - a.spend).slice(0, 5); // Top 5 spenders
  }, [campaigns]);

  const handleRunAnalysis = async () => {
    setLoadingAnalysis(true);
    const result = await analyzeCampaigns(campaigns);
    setAnalysisResult(result);
    setLoadingAnalysis(false);
  };

  const renderDashboard = () => (
    <div className="space-y-6 animate-in fade-in duration-500">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-800">Visão Geral</h1>
          <p className="text-slate-500">Performance da sua conta nos últimos 30 dias.</p>
        </div>
        <div className="flex gap-2">
           <button 
             onClick={() => setCurrentView('CAMPAIGNS')}
             className="px-4 py-2 bg-white border border-slate-300 rounded-lg text-slate-700 font-medium hover:bg-slate-50 transition-colors"
           >
             Gerenciar Campanhas
           </button>
           <button 
             onClick={() => setCurrentView('OPTIMIZATION')}
             className="px-4 py-2 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition-colors shadow-sm flex items-center gap-2"
           >
             <BrainCircuit size={18} />
             Insights IA
           </button>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <MetricCard 
          title="Receita de Vendas" 
          value={new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(totalRevenue)}
          trend={12.5}
          icon={<ShoppingBag size={20} />}
        />
        <MetricCard 
          title="Investimento (Ads)" 
          value={new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(totalSpend)}
          trend={-2.4}
          inverseTrend
          icon={<DollarSign size={20} />}
        />
        <MetricCard 
          title="ACOS Global" 
          value={`${globalAcos.toFixed(2)}%`}
          trend={-5.1}
          inverseTrend
          icon={<Percent size={20} />}
        />
        <MetricCard 
          title="Total de Cliques" 
          value={totalClicks.toLocaleString()}
          trend={8.2}
          icon={<MousePointer2 size={20} />}
        />
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Chart */}
        <div className="lg:col-span-2 bg-white p-6 rounded-xl shadow-sm border border-slate-100">
          <h3 className="text-lg font-bold text-slate-800 mb-6">Investimento vs. Receita (Top Campanhas)</h3>
          <div className="h-80 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={performanceData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                <XAxis dataKey="name" stroke="#64748b" fontSize={12} tickLine={false} axisLine={false} />
                <YAxis stroke="#64748b" fontSize={12} tickLine={false} axisLine={false} tickFormatter={(value) => `R$${value/1000}k`} />
                <Tooltip 
                  cursor={{ fill: '#f1f5f9' }}
                  contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                />
                <Legend iconType="circle" />
                <Bar dataKey="revenue" name="Receita" fill="#3b82f6" radius={[4, 4, 0, 0]} maxBarSize={50} />
                <Bar dataKey="spend" name="Investimento" fill="#ffe600" radius={[4, 4, 0, 0]} maxBarSize={50} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Secondary Chart/List */}
        <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-100 flex flex-col">
          <h3 className="text-lg font-bold text-slate-800 mb-4">Eficiência (ACOS)</h3>
          <p className="text-sm text-slate-500 mb-6">Campanhas com menor custo de venda.</p>
          <div className="h-64 w-full flex-1">
             <ResponsiveContainer width="100%" height="100%">
              <LineChart data={[...performanceData].sort((a,b) => a.acos - b.acos)}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                <XAxis dataKey="name" stroke="#64748b" fontSize={10} tickLine={false} axisLine={false} interval={0} angle={-15} textAnchor="end" height={60}/>
                <YAxis stroke="#64748b" fontSize={12} tickLine={false} axisLine={false} />
                <Tooltip />
                <Line type="monotone" dataKey="acos" name="ACOS %" stroke="#10b981" strokeWidth={3} dot={{ r: 4, fill: '#10b981' }} activeDot={{ r: 8 }} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Bottom Section - Problems */}
      <div className="bg-red-50 p-6 rounded-xl border border-red-100">
        <div className="flex items-start gap-4">
          <div className="bg-red-100 p-2 rounded-full text-red-600">
            <AlertTriangle size={24} />
          </div>
          <div>
            <h3 className="text-lg font-bold text-red-900">Atenção Necessária</h3>
            <p className="text-red-700 mt-1">
              Detectamos <strong>{campaigns.filter(c => c.acos > 40).length} campanhas</strong> com ACOS acima de 40% consumindo recursos sem retorno adequado.
            </p>
            <button 
              onClick={() => setCurrentView('CAMPAIGNS')}
              className="mt-3 text-sm font-semibold text-red-700 hover:text-red-900 underline"
            >
              Ver campanhas problemáticas
            </button>
          </div>
        </div>
      </div>
    </div>
  );

  const renderCampaigns = () => {
    if (selectedCampaign) {
      return (
        <CampaignDetailView 
          campaign={selectedCampaign} 
          onBack={() => setSelectedCampaign(null)} 
        />
      );
    }

    return (
      <div className="space-y-6 animate-in fade-in duration-500">
        <div className="flex flex-col md:flex-row justify-between items-center gap-4">
          <div>
            <h1 className="text-2xl font-bold text-slate-800">Gerenciamento de Campanhas</h1>
            <p className="text-slate-500">Gerencie e analise todas as suas campanhas ativas.</p>
          </div>
          <div className="flex items-center gap-2 bg-white p-1.5 rounded-lg border border-slate-200 shadow-sm">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
              <input 
                type="text" 
                placeholder="Buscar campanha..." 
                className="pl-9 pr-4 py-2 text-sm outline-none bg-transparent w-64"
              />
            </div>
            <div className="h-6 w-px bg-slate-200"></div>
            <button className="p-2 text-slate-500 hover:text-blue-600 hover:bg-slate-50 rounded-md">
              <Filter size={18} />
            </button>
          </div>
        </div>

        <CampaignTable 
          campaigns={campaigns} 
          onSelectCampaign={setSelectedCampaign}
        />
      </div>
    );
  };

  const renderOptimization = () => (
    <div className="space-y-6 animate-in fade-in duration-500 max-w-5xl mx-auto">
      <div className="text-center mb-8">
        <div className="inline-flex items-center justify-center p-3 bg-blue-100 text-blue-700 rounded-full mb-4">
          <BrainCircuit size={32} />
        </div>
        <h1 className="text-3xl font-bold text-slate-900">MeliAds AI Advisor</h1>
        <p className="text-lg text-slate-500 mt-2 max-w-2xl mx-auto">
          Nossa inteligência artificial analisa seus dados em tempo real para encontrar oportunidades de lucro e reduzir desperdícios.
        </p>
      </div>

      {!analysisResult && !loadingAnalysis && (
        <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-12 text-center">
          <img src="https://picsum.photos/400/200?blur=5" alt="AI Analysis" className="mx-auto rounded-xl mb-6 opacity-80" />
          <h3 className="text-xl font-semibold text-slate-800 mb-2">Pronto para otimizar?</h3>
          <p className="text-slate-500 mb-8">Clique abaixo para processar os dados das suas {campaigns.length} campanhas.</p>
          <button 
            onClick={handleRunAnalysis}
            className="px-8 py-4 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-full font-bold text-lg hover:shadow-lg hover:shadow-blue-500/30 transition-all transform hover:-translate-y-1 active:translate-y-0"
          >
            Gerar Análise Completa
          </button>
        </div>
      )}

      {loadingAnalysis && (
        <div className="flex flex-col items-center justify-center py-20">
          <Loader2 size={48} className="text-blue-600 animate-spin mb-4" />
          <h3 className="text-xl font-medium text-slate-700">Analisando métricas...</h3>
          <p className="text-slate-500">Identificando padrões de ACOS e ROAS.</p>
        </div>
      )}

      {analysisResult && !loadingAnalysis && (
        <div className="bg-white rounded-xl shadow-lg border border-slate-100 overflow-hidden">
          <div className="bg-gradient-to-r from-slate-900 to-slate-800 px-8 py-6 flex justify-between items-center">
            <h2 className="text-xl font-bold text-white flex items-center gap-2">
              <BrainCircuit className="text-[#ffe600]" />
              Relatório de Otimização
            </h2>
            <button 
              onClick={handleRunAnalysis} 
              className="text-xs text-white/70 hover:text-white underline"
            >
              Atualizar Análise
            </button>
          </div>
          <div className="p-8 prose prose-slate max-w-none">
            <ReactMarkdown>{analysisResult}</ReactMarkdown>
          </div>
          <div className="bg-slate-50 px-8 py-4 border-t border-slate-100 flex justify-end">
             <button 
               onClick={() => setCurrentView('CAMPAIGNS')}
               className="text-blue-600 font-semibold hover:underline"
             >
               Ir para Campanhas e aplicar mudanças &rarr;
             </button>
          </div>
        </div>
      )}
    </div>
  );

  if (!isAuthenticated) {
    return <LoginScreen onLogin={handleLogin} />;
  }

  return (
    <div className="flex h-screen overflow-hidden bg-[#f3f4f6]">
      <Sidebar 
        currentView={currentView} 
        setView={handleViewChange} 
        user={user}
        onLogout={handleLogout}
      />
      
      <main className="flex-1 overflow-y-auto">
        {/* Top Header */}
        <header className="bg-white border-b border-slate-200 px-8 py-4 sticky top-0 z-10 flex justify-between items-center">
          <div className="text-sm font-medium text-slate-500">
             Última atualização: {new Date().toLocaleTimeString()}
          </div>
          <div className="flex items-center gap-3">
             <div className="text-right hidden sm:block">
               <div className="text-sm font-bold text-slate-800">{user?.name}</div>
               <div className="text-xs text-slate-500">Conta: Premium</div>
             </div>
             <div className="h-10 w-10 bg-blue-100 rounded-full flex items-center justify-center text-blue-700 font-bold">
               {user?.name.substring(0,2).toUpperCase()}
             </div>
          </div>
        </header>

        <div className="p-8 pb-20">
          {currentView === 'DASHBOARD' && renderDashboard()}
          {currentView === 'CAMPAIGNS' && renderCampaigns()}
          {currentView === 'OPTIMIZATION' && renderOptimization()}
          {currentView === 'INTEGRATIONS' && <IntegrationsView />}
          {currentView === 'TEAM' && <TeamView />}
        </div>
      </main>
    </div>
  );
};

export default App;
