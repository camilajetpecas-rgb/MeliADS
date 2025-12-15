
import React from 'react';
import { LayoutDashboard, ShoppingBag, Zap, BarChart3, Settings, Link2, LogOut, Users } from 'lucide-react';
import { ViewState, User } from '../types';

interface SidebarProps {
  currentView: ViewState;
  setView: (view: ViewState) => void;
  user?: User;
  onLogout: () => void;
}

const Sidebar: React.FC<SidebarProps> = ({ currentView, setView, user, onLogout }) => {
  const menuItems = [
    { id: 'DASHBOARD', label: 'Visão Geral', icon: LayoutDashboard },
    { id: 'CAMPAIGNS', label: 'Campanhas', icon: ShoppingBag },
    { id: 'OPTIMIZATION', label: 'Otimização IA', icon: Zap },
    { id: 'INTEGRATIONS', label: 'Integrações', icon: Link2 },
    { id: 'TEAM', label: 'Equipe', icon: Users },
  ];

  return (
    <div className="w-64 bg-slate-900 text-white flex flex-col h-full shadow-xl z-20">
      <div className="p-6 flex items-center gap-3 border-b border-slate-700">
        <div className="bg-[#ffe600] p-1.5 rounded-lg text-slate-900">
            <BarChart3 size={24} strokeWidth={2.5} />
        </div>
        <span className="text-xl font-bold tracking-tight">MeliAds Pro</span>
      </div>

      {user && (
        <div className="px-6 py-4 border-b border-slate-800">
           <div className="text-xs text-slate-400 uppercase font-semibold tracking-wider mb-1">Logado como</div>
           <div className="text-sm font-medium text-white truncate">{user.name}</div>
           <div className="text-xs text-slate-500 truncate">{user.email}</div>
        </div>
      )}

      <nav className="flex-1 px-4 py-6 space-y-2">
        {menuItems.map((item) => {
          const isActive = currentView === item.id;
          return (
            <button
              key={item.id}
              onClick={() => setView(item.id as ViewState)}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-200 ${
                isActive
                  ? 'bg-blue-600 text-white shadow-lg shadow-blue-900/50 font-medium'
                  : 'text-slate-400 hover:bg-slate-800 hover:text-white'
              }`}
            >
              <item.icon size={20} />
              <span>{item.label}</span>
            </button>
          );
        })}
      </nav>

      <div className="p-4 border-t border-slate-700 space-y-2">
        <button className="w-full flex items-center gap-3 px-4 py-3 text-slate-400 hover:text-white transition-colors">
          <Settings size={20} />
          <span>Configurações</span>
        </button>
        <button 
          onClick={onLogout}
          className="w-full flex items-center gap-3 px-4 py-3 text-red-400 hover:text-red-300 hover:bg-red-900/20 rounded-lg transition-colors"
        >
          <LogOut size={20} />
          <span>Sair</span>
        </button>
        <div className="mt-2 px-4 py-2 bg-slate-800 rounded-lg text-xs text-slate-400 text-center">
          v1.0.3 Stable
        </div>
      </div>
    </div>
  );
};

export default Sidebar;
