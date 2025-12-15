
import React, { useState } from 'react';
import { LinkedAccount } from '../types';
import { Plus, Trash2, RefreshCw, CheckCircle2, AlertCircle, Link as LinkIcon, ExternalLink } from 'lucide-react';

const IntegrationsView: React.FC = () => {
  const [accounts, setAccounts] = useState<LinkedAccount[]>([
    {
      id: '1',
      nickname: 'Loja Oficial Tech',
      sellerId: 'MLB_123456789',
      status: 'CONNECTED',
      lastSync: new Date()
    },
    {
      id: '2',
      nickname: 'Outlet Variedades',
      sellerId: 'MLB_987654321',
      status: 'EXPIRED',
      lastSync: new Date(Date.now() - 86400000 * 5) // 5 days ago
    }
  ]);

  const [isConnecting, setIsConnecting] = useState(false);

  const handleConnect = () => {
    setIsConnecting(true);
    // Simulating OAuth Flow
    setTimeout(() => {
      const newAccount: LinkedAccount = {
        id: Math.random().toString(36).substr(2, 9),
        nickname: `Nova Conta Vinculada ${accounts.length + 1}`,
        sellerId: `MLB_${Math.floor(Math.random() * 1000000000)}`,
        status: 'CONNECTED',
        lastSync: new Date()
      };
      setAccounts([...accounts, newAccount]);
      setIsConnecting(false);
    }, 2000);
  };

  const handleDisconnect = (id: string) => {
    if (confirm('Tem certeza que deseja desvincular esta conta? Os dados deixarão de ser atualizados.')) {
      setAccounts(accounts.filter(acc => acc.id !== id));
    }
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-500 max-w-5xl mx-auto">
      <div>
        <h1 className="text-2xl font-bold text-slate-800">Integrações</h1>
        <p className="text-slate-500">Gerencie as contas do Mercado Livre conectadas à plataforma.</p>
      </div>

      <div className="bg-white rounded-xl border border-slate-200 overflow-hidden shadow-sm">
        <div className="p-6 border-b border-slate-100 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-slate-50/50">
          <div>
            <h3 className="text-lg font-semibold text-slate-800">Contas Vinculadas</h3>
            <p className="text-sm text-slate-500">Permita que o MeliAds leia seus anúncios e métricas.</p>
          </div>
          <button 
            onClick={handleConnect}
            disabled={isConnecting}
            className="flex items-center gap-2 bg-[#ffe600] text-slate-900 px-4 py-2 rounded-lg font-semibold hover:bg-[#ebd500] transition-colors shadow-sm disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isConnecting ? <RefreshCw className="animate-spin" size={18} /> : <Plus size={18} />}
            {isConnecting ? 'Conectando...' : 'Vincular Nova Conta'}
          </button>
        </div>

        <div className="divide-y divide-slate-100">
          {accounts.length === 0 ? (
            <div className="p-12 text-center text-slate-400">
              <LinkIcon size={48} className="mx-auto mb-4 opacity-20" />
              <p>Nenhuma conta vinculada no momento.</p>
            </div>
          ) : (
            accounts.map((account) => (
              <div key={account.id} className="p-6 flex flex-col sm:flex-row items-center justify-between gap-4 hover:bg-slate-50 transition-colors">
                <div className="flex items-center gap-4 w-full sm:w-auto">
                  <div className={`w-12 h-12 rounded-full flex items-center justify-center shrink-0 ${
                    account.status === 'CONNECTED' ? 'bg-blue-100 text-blue-600' : 'bg-red-100 text-red-600'
                  }`}>
                    <img 
                      src="https://http2.mlstatic.com/frontend-assets/ml-web-navigation/ui-navigation/5.21.22/mercadolibre/logo__small.png" 
                      alt="ML" 
                      className="w-6 h-6 object-contain"
                    />
                  </div>
                  <div>
                    <h4 className="font-medium text-slate-900 flex items-center gap-2">
                      {account.nickname}
                      <ExternalLink size={14} className="text-slate-400 cursor-pointer hover:text-blue-500" />
                    </h4>
                    <div className="text-sm text-slate-500 flex items-center gap-3">
                      <span>Seller ID: {account.sellerId}</span>
                      <span className="text-slate-300">|</span>
                      <span>Sincronizado: {account.lastSync.toLocaleDateString()} às {account.lastSync.toLocaleTimeString()}</span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-3 w-full sm:w-auto justify-end">
                  <div className={`px-3 py-1 rounded-full text-xs font-semibold flex items-center gap-1.5 ${
                    account.status === 'CONNECTED' 
                      ? 'bg-green-100 text-green-700' 
                      : 'bg-red-100 text-red-700'
                  }`}>
                    {account.status === 'CONNECTED' ? <CheckCircle2 size={14} /> : <AlertCircle size={14} />}
                    {account.status === 'CONNECTED' ? 'Ativo' : 'Token Expirado'}
                  </div>
                  
                  {account.status === 'EXPIRED' && (
                    <button className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors" title="Reconectar">
                      <RefreshCw size={18} />
                    </button>
                  )}
                  
                  <button 
                    onClick={() => handleDisconnect(account.id)}
                    className="p-2 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors" 
                    title="Desvincular"
                  >
                    <Trash2 size={18} />
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      <div className="bg-blue-50 border border-blue-100 rounded-xl p-6">
        <h4 className="font-semibold text-blue-900 mb-2">Segurança da Integração</h4>
        <p className="text-sm text-blue-700">
          Utilizamos a API oficial do Mercado Livre para leitura de dados. Suas credenciais de login do Mercado Livre nunca são salvas em nossos servidores. 
          O acesso é feito via token OAuth2 com validade de 6 horas, renovado automaticamente.
        </p>
      </div>
    </div>
  );
};

export default IntegrationsView;
