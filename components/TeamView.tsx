
import React, { useState } from 'react';
import { TeamMember } from '../types';
import { 
  Users, 
  UserPlus, 
  Link as LinkIcon, 
  Copy, 
  Check, 
  Mail, 
  Shield, 
  Trash2, 
  Key,
  X,
  Lock,
  AlertTriangle
} from 'lucide-react';

const TeamView: React.FC = () => {
  // Mock Data
  const [members, setMembers] = useState<TeamMember[]>([
    {
      id: '1',
      name: 'Gestor da Conta',
      email: 'admin@empresa.com',
      role: 'ADMIN',
      status: 'ACTIVE',
      addedAt: new Date('2024-01-15')
    },
    {
      id: '2',
      name: 'Analista de Mídia',
      email: 'analista@empresa.com',
      role: 'EDITOR',
      status: 'ACTIVE',
      addedAt: new Date('2024-02-10')
    },
    {
      id: '3',
      name: 'Observador Externo',
      email: 'cliente@marca.com',
      role: 'VIEWER',
      status: 'PENDING',
      addedAt: new Date()
    }
  ]);

  // Invite/Add State
  const [newUserEmail, setNewUserEmail] = useState('');
  const [newUserRole, setNewUserRole] = useState<'ADMIN' | 'EDITOR' | 'VIEWER'>('EDITOR');
  const [isCopied, setIsCopied] = useState(false);
  const [showAddForm, setShowAddForm] = useState(false);

  // Password Management State
  const [passwordModalOpen, setPasswordModalOpen] = useState(false);
  const [selectedMember, setSelectedMember] = useState<TeamMember | null>(null);
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [passwordSuccess, setPasswordSuccess] = useState(false);

  // Delete Management State
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [memberToDelete, setMemberToDelete] = useState<TeamMember | null>(null);

  const inviteLink = "https://meliads.app/invite/tk_9f8d7s6a";

  const handleCopyLink = () => {
    navigator.clipboard.writeText(inviteLink);
    setIsCopied(true);
    setTimeout(() => setIsCopied(false), 2000);
  };

  const handleAddMember = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newUserEmail) return;

    const newMember: TeamMember = {
      id: Math.random().toString(36).substr(2, 9),
      name: newUserEmail.split('@')[0], // Placeholder name
      email: newUserEmail,
      role: newUserRole,
      status: 'PENDING',
      addedAt: new Date()
    };

    setMembers([...members, newMember]);
    setNewUserEmail('');
    setShowAddForm(false);
  };

  const handleDeleteClick = (member: TeamMember) => {
    setMemberToDelete(member);
    setDeleteModalOpen(true);
  };

  const confirmDelete = () => {
    if (memberToDelete) {
      setMembers(members.filter(m => m.id !== memberToDelete.id));
      setDeleteModalOpen(false);
      setMemberToDelete(null);
    }
  };

  const openPasswordModal = (member: TeamMember) => {
    setSelectedMember(member);
    setNewPassword('');
    setConfirmPassword('');
    setPasswordSuccess(false);
    setPasswordModalOpen(true);
  };

  const handleChangePassword = (e: React.FormEvent) => {
    e.preventDefault();
    if (newPassword !== confirmPassword) {
      alert("As senhas não coincidem.");
      return;
    }
    if (newPassword.length < 6) {
      alert("A senha deve ter pelo menos 6 caracteres.");
      return;
    }

    // Simulate API call
    setTimeout(() => {
      setPasswordSuccess(true);
      setTimeout(() => {
        setPasswordModalOpen(false);
        setSelectedMember(null);
      }, 1500);
    }, 1000);
  };

  const getRoleBadgeColor = (role: string) => {
    switch (role) {
      case 'ADMIN': return 'bg-purple-100 text-purple-700';
      case 'EDITOR': return 'bg-blue-100 text-blue-700';
      case 'VIEWER': return 'bg-slate-100 text-slate-700';
      default: return 'bg-slate-100 text-slate-700';
    }
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-500 max-w-5xl mx-auto relative">
      <div>
        <h1 className="text-2xl font-bold text-slate-800">Equipe e Acesso</h1>
        <p className="text-slate-500">Gerencie quem tem acesso à plataforma e seus níveis de permissão.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Invite Link Section */}
        <div className="lg:col-span-1 space-y-6">
          <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
            <div className="flex items-center gap-3 mb-4">
              <div className="p-2 bg-indigo-50 rounded-lg text-indigo-600">
                <LinkIcon size={20} />
              </div>
              <h3 className="font-semibold text-slate-800">Link de Convite Rápido</h3>
            </div>
            <p className="text-sm text-slate-500 mb-4">
              Compartilhe este link para dar acesso de <strong>Visualizador</strong> automaticamente. O link expira em 7 dias.
            </p>
            
            <div className="flex items-center gap-2 p-2 bg-slate-50 border border-slate-200 rounded-lg">
              <input 
                type="text" 
                value={inviteLink} 
                readOnly 
                className="bg-transparent border-none text-xs text-slate-600 flex-1 focus:ring-0 w-full outline-none"
              />
              <button 
                onClick={handleCopyLink}
                className="p-1.5 hover:bg-white rounded-md transition-colors text-slate-500 hover:text-indigo-600 hover:shadow-sm"
                title="Copiar Link"
              >
                {isCopied ? <Check size={16} className="text-green-500" /> : <Copy size={16} />}
              </button>
            </div>
            <div className="mt-4 flex items-center justify-center">
                <button className="text-sm text-indigo-600 font-medium hover:underline">
                    Gerar novo link
                </button>
            </div>
          </div>

          <div className="bg-gradient-to-br from-slate-900 to-slate-800 rounded-xl shadow-lg p-6 text-white">
             <div className="mb-4 bg-white/10 w-10 h-10 rounded-lg flex items-center justify-center">
                <Shield size={20} className="text-[#ffe600]" />
             </div>
             <h3 className="font-bold mb-2">Segurança da Equipe</h3>
             <p className="text-sm text-slate-300 leading-relaxed">
               Recomendamos revisar os acessos mensalmente. Usuários com permissão de <strong>Admin</strong> podem excluir campanhas e alterar orçamentos.
             </p>
          </div>
        </div>

        {/* Team List Section */}
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
             <div className="p-6 border-b border-slate-100 flex justify-between items-center bg-slate-50/50">
                <h3 className="font-semibold text-slate-800 flex items-center gap-2">
                  <Users size={18} className="text-slate-400"/>
                  Membros da Equipe 
                  <span className="text-xs bg-slate-200 text-slate-600 px-2 py-0.5 rounded-full">{members.length}</span>
                </h3>
                <button 
                  onClick={() => setShowAddForm(!showAddForm)}
                  className="text-sm bg-slate-900 text-white px-4 py-2 rounded-lg hover:bg-slate-800 transition-colors flex items-center gap-2 font-medium"
                >
                  <UserPlus size={16} />
                  Adicionar Pessoa
                </button>
             </div>

             {showAddForm && (
               <div className="p-6 bg-blue-50/50 border-b border-blue-100 animate-in slide-in-from-top-2">
                 <form onSubmit={handleAddMember} className="flex flex-col sm:flex-row gap-4 items-end">
                    <div className="flex-1 w-full">
                      <label className="block text-xs font-semibold text-slate-500 mb-1 uppercase">E-mail Corporativo</label>
                      <div className="relative">
                        <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
                        <input 
                          type="email" 
                          required
                          value={newUserEmail}
                          onChange={(e) => setNewUserEmail(e.target.value)}
                          placeholder="colaborador@empresa.com"
                          className="w-full pl-9 pr-3 py-2 rounded-lg border border-slate-300 focus:ring-2 focus:ring-blue-500 outline-none text-sm"
                        />
                      </div>
                    </div>
                    <div className="w-full sm:w-48">
                      <label className="block text-xs font-semibold text-slate-500 mb-1 uppercase">Permissão</label>
                      <select 
                        value={newUserRole}
                        onChange={(e) => setNewUserRole(e.target.value as any)}
                        className="w-full px-3 py-2 rounded-lg border border-slate-300 focus:ring-2 focus:ring-blue-500 outline-none text-sm bg-white"
                      >
                        <option value="ADMIN">Admin (Total)</option>
                        <option value="EDITOR">Editor (Campanhas)</option>
                        <option value="VIEWER">Leitor (Apenas ver)</option>
                      </select>
                    </div>
                    <div className="flex gap-2 w-full sm:w-auto">
                      <button 
                        type="submit"
                        className="bg-blue-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-blue-700 w-full sm:w-auto"
                      >
                        Enviar Convite
                      </button>
                      <button 
                        type="button"
                        onClick={() => setShowAddForm(false)}
                        className="bg-white border border-slate-300 text-slate-600 px-4 py-2 rounded-lg text-sm font-medium hover:bg-slate-50 w-full sm:w-auto"
                      >
                        Cancelar
                      </button>
                    </div>
                 </form>
               </div>
             )}

             <div className="divide-y divide-slate-100">
               {members.map((member) => (
                 <div key={member.id} className="p-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 hover:bg-slate-50 transition-colors">
                   <div className="flex items-center gap-4">
                     <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-slate-200 to-slate-100 flex items-center justify-center text-slate-500 font-bold text-sm">
                       {member.name.substring(0, 2).toUpperCase()}
                     </div>
                     <div>
                       <div className="font-medium text-slate-900">{member.name}</div>
                       <div className="text-xs text-slate-500">{member.email}</div>
                     </div>
                   </div>

                   <div className="flex items-center gap-4 w-full sm:w-auto justify-between sm:justify-end">
                     <div className="flex items-center gap-4">
                        <div className={`px-2.5 py-0.5 rounded text-xs font-semibold uppercase tracking-wide ${getRoleBadgeColor(member.role)}`}>
                        {member.role}
                        </div>
                        
                        <div className="text-xs text-slate-400 w-16 text-right hidden sm:block">
                        {member.status === 'PENDING' ? 'Pendente' : 'Ativo'}
                        </div>
                     </div>

                     <div className="flex items-center gap-1 pl-4 border-l border-slate-200 ml-2">
                        <button 
                          onClick={() => openPasswordModal(member)}
                          className="p-2 text-slate-400 hover:text-amber-600 hover:bg-amber-50 rounded-lg transition-colors"
                          title="Alterar Senha"
                        >
                          <Key size={16} />
                        </button>
                        <button 
                          onClick={() => handleDeleteClick(member)}
                          className="p-2 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                          title="Remover Usuário"
                        >
                          <Trash2 size={16} />
                        </button>
                     </div>
                   </div>
                 </div>
               ))}
             </div>
          </div>
        </div>
      </div>

      {/* Password Change Modal */}
      {passwordModalOpen && selectedMember && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-white w-full max-w-md rounded-2xl shadow-2xl overflow-hidden">
            <div className="p-6 border-b border-slate-100 flex justify-between items-center bg-slate-50">
              <h3 className="text-lg font-bold text-slate-800 flex items-center gap-2">
                <Key size={20} className="text-amber-500" />
                Alterar Senha
              </h3>
              <button 
                onClick={() => setPasswordModalOpen(false)}
                className="text-slate-400 hover:text-slate-600 transition-colors"
              >
                <X size={20} />
              </button>
            </div>
            
            <div className="p-6">
              {!passwordSuccess ? (
                <form onSubmit={handleChangePassword} className="space-y-4">
                  <div className="p-4 bg-amber-50 rounded-lg border border-amber-100 mb-4">
                    <p className="text-sm text-amber-800 flex items-start gap-2">
                      <AlertTriangle size={16} className="shrink-0 mt-0.5" />
                      Você está alterando a senha para o usuário <strong>{selectedMember.name}</strong>. Esta ação desconectará o usuário de todas as sessões ativas.
                    </p>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">Nova Senha</label>
                    <div className="relative">
                      <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
                      <input 
                        type="password"
                        required
                        className="w-full pl-9 pr-3 py-2.5 rounded-lg border border-slate-300 focus:ring-2 focus:ring-amber-500 outline-none transition-all"
                        placeholder="••••••••"
                        value={newPassword}
                        onChange={(e) => setNewPassword(e.target.value)}
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">Confirmar Nova Senha</label>
                    <div className="relative">
                      <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
                      <input 
                        type="password"
                        required
                        className="w-full pl-9 pr-3 py-2.5 rounded-lg border border-slate-300 focus:ring-2 focus:ring-amber-500 outline-none transition-all"
                        placeholder="••••••••"
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                      />
                    </div>
                  </div>

                  <div className="flex gap-3 mt-6">
                    <button 
                      type="button"
                      onClick={() => setPasswordModalOpen(false)}
                      className="flex-1 px-4 py-2 border border-slate-300 rounded-lg text-slate-700 font-medium hover:bg-slate-50 transition-colors"
                    >
                      Cancelar
                    </button>
                    <button 
                      type="submit"
                      className="flex-1 px-4 py-2 bg-slate-900 text-white rounded-lg font-medium hover:bg-slate-800 transition-colors"
                    >
                      Salvar Senha
                    </button>
                  </div>
                </form>
              ) : (
                <div className="text-center py-8">
                  <div className="w-16 h-16 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto mb-4 animate-in zoom-in duration-300">
                    <Check size={32} />
                  </div>
                  <h4 className="text-xl font-bold text-slate-800 mb-2">Senha Alterada!</h4>
                  <p className="text-slate-500">A senha do usuário foi atualizada com sucesso.</p>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {deleteModalOpen && memberToDelete && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-white w-full max-w-sm rounded-2xl shadow-2xl overflow-hidden">
            <div className="p-6 text-center">
              <div className="w-14 h-14 bg-red-100 text-red-600 rounded-full flex items-center justify-center mx-auto mb-4">
                <Trash2 size={28} />
              </div>
              <h3 className="text-lg font-bold text-slate-900 mb-2">Remover Usuário</h3>
              <p className="text-slate-500 text-sm mb-6">
                Tem certeza que deseja remover <strong>{memberToDelete.name}</strong>? Esta ação não pode ser desfeita e o usuário perderá o acesso imediatamente.
              </p>
              
              <div className="flex gap-3">
                <button 
                  onClick={() => setDeleteModalOpen(false)}
                  className="flex-1 px-4 py-2.5 border border-slate-300 rounded-lg text-slate-700 font-medium hover:bg-slate-50 transition-colors"
                >
                  Cancelar
                </button>
                <button 
                  onClick={confirmDelete}
                  className="flex-1 px-4 py-2.5 bg-red-600 text-white rounded-lg font-medium hover:bg-red-700 transition-colors shadow-lg shadow-red-500/30"
                >
                  Sim, remover
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default TeamView;
