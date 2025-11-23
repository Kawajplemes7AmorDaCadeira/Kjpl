import React, { useState } from 'react';
import { DiscordAlert, GameActionType } from '../types';
import { Hash, Volume2, Bell, CheckCircle, Headphones, Plus, Monitor, Menu, X, Mic, Settings as SettingsIcon } from 'lucide-react';
import { CHANNELS } from '../constants';

interface Props {
  alerts: DiscordAlert[];
  onAction: (action: GameActionType, itemId: string) => void;
}

const DiscordColumn: React.FC<Props> = ({ alerts, onAction }) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <div className="flex h-full bg-[#313338] text-gray-300 overflow-hidden shadow-2xl rounded-lg border border-[#1e1f22] relative">
      
      {/* 1. Server List (Leftmost Sidebar) - Hidden on Mobile */}
      <div className="hidden md:flex w-[72px] bg-[#1e1f22] flex-col items-center py-3 space-y-2 flex-shrink-0 overflow-y-auto">
        {/* DM Icon */}
        <div className="w-12 h-12 bg-[#313338] hover:bg-[#5865F2] hover:text-white rounded-[24px] hover:rounded-[16px] transition-all duration-200 flex items-center justify-center cursor-pointer group mb-2">
           <div className="bg-[#5865F2] text-white p-1 rounded-sm">
             <div className="w-6 h-4 bg-transparent border-2 border-white rounded-sm" />
           </div>
        </div>
        
        <div className="w-8 h-[2px] bg-[#35363C] rounded-lg" />

        {/* Active Server (LGGJ) */}
        <div className="relative w-full flex justify-center group">
           <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-10 bg-white rounded-r-lg" />
           <div className="w-12 h-12 bg-gradient-to-br from-purple-600 to-blue-600 text-white rounded-[16px] flex items-center justify-center font-bold shadow-md cursor-pointer">
             LG
           </div>
        </div>

        {/* Other Fake Servers */}
        {[1, 2, 3].map(i => (
          <div key={i} className="w-12 h-12 bg-[#313338] hover:bg-[#5865F2] hover:text-white rounded-[24px] hover:rounded-[16px] transition-all duration-200 flex items-center justify-center cursor-pointer text-xs font-bold text-gray-400 group">
             S{i}
          </div>
        ))}
      </div>

      {/* 2. Channel List (Sidebar) - Responsive Overlay on Mobile */}
      <div className={`
        absolute inset-y-0 left-0 z-30 bg-[#2b2d31] w-64 transform transition-transform duration-300 ease-in-out md:relative md:translate-x-0 md:flex md:flex-col md:flex-shrink-0 border-r border-[#1f2023] shadow-2xl md:shadow-none
        ${mobileMenuOpen ? 'translate-x-0' : '-translate-x-full'}
      `}>
        {/* Mobile Header for Sidebar */}
        <div className="h-12 border-b border-[#1f2023] px-4 flex items-center justify-between font-bold text-white shadow-sm md:hidden">
           <span>Navegação</span>
           <button onClick={() => setMobileMenuOpen(false)}>
             <X size={20} className="text-gray-400" />
           </button>
        </div>

        {/* Server Header (Desktop) */}
        <div className="h-12 border-b border-[#1f2023] px-4 hidden md:flex items-center justify-between font-bold text-white hover:bg-[#35373c] cursor-pointer transition-colors shadow-sm">
           <span>LGGJ Community</span>
           <Plus size={16} className="text-gray-400" />
        </div>

        {/* Channels */}
        <div className="flex-1 overflow-y-auto p-2 space-y-0.5 custom-scrollbar">
           
           <div className="flex items-center justify-between px-2 pt-4 pb-1 group cursor-pointer hover:text-gray-100">
              <span className="text-xs font-bold uppercase text-gray-400 group-hover:text-gray-300">Canais de Texto</span>
              <Plus size={12} className="text-gray-400" />
           </div>
           
           {CHANNELS.map(ch => (
             <div 
                key={ch} 
                onClick={() => setMobileMenuOpen(false)} // Close menu on click
                className={`flex items-center gap-1.5 px-2 py-3 md:py-1.5 rounded mx-1 cursor-pointer group ${ch === '#denuncias' ? 'bg-[#404249] text-white' : 'hover:bg-[#35373c] text-gray-400 hover:text-gray-200'}`}
             >
               <Hash size={20} className="text-gray-500" />
               <span className="font-medium truncate text-base md:text-sm">{ch.replace('#', '')}</span>
               {ch === '#denuncias' && alerts.length > 0 && (
                 <span className="ml-auto bg-red-500 text-white text-xs font-bold px-2 py-0.5 rounded-full">
                   {alerts.length}
                 </span>
               )}
             </div>
           ))}

           <div className="flex items-center justify-between px-2 pt-4 pb-1 mt-2 group cursor-pointer hover:text-gray-100">
              <span className="text-xs font-bold uppercase text-gray-400 group-hover:text-gray-300">Canais de Voz</span>
              <Plus size={12} className="text-gray-400" />
           </div>
           
           <div className="flex flex-col gap-0.5 px-1">
             <div className="flex items-center gap-1.5 px-2 py-2 rounded hover:bg-[#35373c] text-gray-400 hover:text-gray-200 cursor-pointer">
                <Volume2 size={20} className="text-gray-500" />
                <span className="font-medium">Geral</span>
             </div>
             {/* Fake users in voice */}
             <div className="pl-8 py-1 flex items-center gap-2">
                <img src="https://picsum.photos/24/24?random=1" className="w-6 h-6 rounded-full border border-[#2b2d31]" alt="user" />
                <span className="text-xs text-gray-400 font-medium truncate">User_TalksAlot</span>
             </div>
           </div>
        </div>

        {/* User Status Footer */}
        <div className="bg-[#232428] p-2 flex items-center gap-2">
           <div className="relative">
             <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-yellow-400 to-orange-500" />
             <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 rounded-full border-2 border-[#232428]" />
           </div>
           <div className="flex-1 overflow-hidden">
              <div className="text-xs font-bold text-white truncate">Mod_LGGJ</div>
              <div className="text-[10px] text-gray-400 truncate">#1234</div>
           </div>
           <div className="flex gap-1">
              <Mic size={18} className="text-gray-400 hover:text-gray-200 cursor-pointer" />
              <Headphones size={18} className="text-gray-400 hover:text-gray-200 cursor-pointer" />
              <SettingsIcon size={18} className="text-gray-400 hover:text-gray-200 cursor-pointer" />
           </div>
        </div>
      </div>

      {/* Backdrop for Mobile Menu */}
      {mobileMenuOpen && (
        <div 
          className="absolute inset-0 bg-black/50 z-20 md:hidden"
          onClick={() => setMobileMenuOpen(false)}
        />
      )}

      {/* 3. Main Content (Chat Area) */}
      <div className="flex-1 flex flex-col bg-[#313338] min-w-0 w-full">
        {/* Channel Header */}
        <div className="h-12 border-b border-[#26272d] flex items-center justify-between px-4 flex-shrink-0 shadow-sm bg-[#313338] z-10">
           <div className="flex items-center gap-2 text-white font-bold overflow-hidden">
              {/* Mobile Hamburger */}
              <button 
                className="md:hidden mr-1 p-1 hover:bg-gray-700 rounded text-gray-300"
                onClick={() => setMobileMenuOpen(true)}
              >
                <Menu size={24} />
              </button>

              <Hash size={24} className="text-gray-400 flex-shrink-0" />
              <h3 className="truncate">denuncias</h3>
              <div className="hidden sm:block h-4 w-[1px] bg-gray-600 mx-1" />
              <span className="hidden sm:block text-xs font-normal text-gray-400 truncate">Canal exclusivo para tretas e reportes</span>
           </div>
           <div className="flex items-center gap-2 md:gap-4 text-gray-400">
              <Bell size={20} className="hover:text-gray-200 cursor-pointer hidden sm:block" />
              <div className="relative hidden sm:block">
                 <input type="text" placeholder="Buscar" className="bg-[#1e1f22] text-xs rounded px-2 py-1 w-24 md:w-32 transition-all focus:w-48 outline-none text-gray-200" />
              </div>
           </div>
        </div>

        {/* Messages / Alerts Area */}
        <div className="flex-1 overflow-y-auto p-4 custom-scrollbar flex flex-col gap-4">
           
           {/* Welcome Message */}
           <div className="mt-4 mb-4 md:mb-8">
              <div className="w-16 h-16 bg-[#41434a] rounded-full flex items-center justify-center mb-4">
                 <Hash size={40} className="text-white" />
              </div>
              <h1 className="text-2xl md:text-3xl font-bold text-white mb-2">Bem-vindo a #denuncias!</h1>
              <p className="text-gray-400 text-sm">Este é o começo do canal #denuncias.</p>
           </div>

           <div className="w-full h-[1px] bg-[#3f4147] my-2" />

           {alerts.length === 0 ? (
             <div className="flex flex-col items-center justify-center py-10 md:py-20 opacity-50 select-none text-center px-4">
                <CheckCircle size={48} className="text-green-500 mb-4" />
                <h3 className="text-gray-400 font-medium text-lg">Nenhum reporte ativo.</h3>
                <p className="text-gray-500 text-sm mt-1">O chat está se comportando (por enquanto).</p>
             </div>
           ) : (
             alerts.map(alert => (
               <div key={alert.id} className="group flex flex-col sm:flex-row gap-3 sm:gap-4 hover:bg-[#2e3035] -mx-4 px-4 py-4 transition-colors border-b border-[#2e3035] sm:border-0">
                  <div className="flex items-center gap-3 sm:block">
                    <div className="w-10 h-10 rounded-full bg-gray-600 flex-shrink-0 overflow-hidden cursor-pointer mt-0.5">
                      <img src={`https://picsum.photos/seed/${alert.user}/40`} alt="avatar" />
                    </div>
                    <div className="sm:hidden flex flex-col">
                        <span className="text-white font-bold text-base">{alert.user}</span>
                        <span className="text-xs text-gray-400">Hoje às {new Date().toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}</span>
                    </div>
                  </div>
                  
                  <div className="flex-1 min-w-0">
                     <div className="hidden sm:flex items-center gap-2 mb-0.5">
                        <span className="text-white font-medium hover:underline cursor-pointer">{alert.user}</span>
                        <span className="text-[10px] text-white bg-[#5865F2] px-1 rounded flex items-center gap-0.5">BOT <CheckCircle size={8} /></span>
                        <span className="text-xs text-gray-400">Hoje às {new Date().toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}</span>
                     </div>
                     
                     <div className={`text-gray-100 bg-[#2b2d31] border-l-4 p-3 md:p-4 rounded mt-1 w-full ${
                       alert.severity === 'HIGH' ? 'border-red-500' : 
                       alert.severity === 'MEDIUM' ? 'border-yellow-500' : 'border-blue-500'
                     }`}>
                        <div className="flex justify-between items-start mb-2">
                          <span className="text-xs font-bold uppercase text-gray-400">
                             Reporte em: <span className="text-gray-300">#{alert.channel}</span>
                          </span>
                          <span className={`text-[10px] font-bold px-2 py-0.5 rounded uppercase ${
                             alert.severity === 'HIGH' ? 'bg-red-500/20 text-red-400' : 
                             alert.severity === 'MEDIUM' ? 'bg-yellow-500/20 text-yellow-400' : 'bg-blue-500/20 text-blue-400'
                          }`}>
                            {alert.severity}
                          </span>
                        </div>
                        
                        {/* Message Content - Larger on Mobile */}
                        <p className="text-base md:text-sm text-white leading-relaxed font-medium">
                          {alert.issue}
                        </p>
                        
                        <div className="mt-4 flex flex-wrap gap-2">
                          <button 
                            onClick={() => onAction(GameActionType.RESOLVE_DISCORD, alert.id)}
                            className="flex-1 sm:flex-none justify-center bg-[#5865F2] hover:bg-[#4752c4] text-white px-4 py-2 rounded text-sm font-bold transition-colors flex items-center gap-2 shadow-sm"
                          >
                             Resolver Caso
                          </button>
                          <button 
                            className="flex-1 sm:flex-none justify-center bg-[#4e5058] hover:bg-[#6d6f78] text-white px-4 py-2 rounded text-sm font-bold transition-colors shadow-sm"
                          >
                             Ignorar
                          </button>
                        </div>
                     </div>
                  </div>
               </div>
             ))
           )}
        </div>

        {/* Chat Input */}
        <div className="px-4 pb-4 md:pb-6 pt-2 bg-[#313338]">
           <div className="bg-[#383a40] rounded-lg px-4 py-3 md:py-2.5 flex items-center gap-4">
              <div className="w-6 h-6 rounded-full bg-gray-400 flex items-center justify-center cursor-pointer hover:text-white text-[#313338] flex-shrink-0">
                 <Plus size={16} />
              </div>
              <input 
                disabled 
                placeholder={`Conversar em #${alerts.length > 0 ? 'denuncias' : 'geral'}`} 
                className="bg-transparent flex-1 outline-none text-gray-300 placeholder-gray-500 text-sm md:text-sm cursor-not-allowed" 
              />
              <div className="flex gap-3 text-gray-400 flex-shrink-0">
                 <Monitor size={20} className="cursor-pointer hover:text-gray-200" />
              </div>
           </div>
        </div>
      </div>
    </div>
  );
};

export default DiscordColumn;