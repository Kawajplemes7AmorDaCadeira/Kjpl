import React from 'react';
import { SocialPost, GameActionType } from '../types';
import { Twitter, Heart, MessageCircle, Repeat, Share, MoreHorizontal, Home, Hash, Bell, Mail, Bookmark, User, ShieldAlert } from 'lucide-react';

interface Props {
  posts: SocialPost[];
  onAction: (action: GameActionType, itemId: string) => void;
}

const SocialColumn: React.FC<Props> = ({ posts, onAction }) => {
  return (
    <div className="flex h-full bg-black text-white overflow-hidden shadow-2xl rounded-lg border border-gray-800">
      
      {/* 1. Navigation Sidebar */}
      <div className="w-20 xl:w-64 border-r border-gray-800 flex flex-col items-center xl:items-start p-2 xl:p-4 space-y-2 flex-shrink-0">
         <div className="p-3 mb-2 rounded-full hover:bg-gray-900 w-min cursor-pointer transition-colors">
            <Twitter size={30} className="text-white fill-white" />
         </div>

         {[
            { icon: <Home size={26} />, label: "Página Inicial", active: true },
            { icon: <Hash size={26} />, label: "Explorar" },
            { icon: <Bell size={26} />, label: "Notificações" },
            { icon: <Mail size={26} />, label: "Mensagens" },
            { icon: <Bookmark size={26} />, label: "Itens Salvos" },
            { icon: <User size={26} />, label: "Perfil" },
         ].map(item => (
            <div key={item.label} className={`flex items-center gap-4 p-3 rounded-full cursor-pointer hover:bg-[#181818] transition-colors w-min xl:w-auto ${item.active ? 'font-bold' : ''}`}>
               {item.icon}
               <span className="hidden xl:block text-xl mr-4">{item.label}</span>
            </div>
         ))}

         <button className="hidden xl:block bg-[#1d9bf0] hover:bg-[#1a8cd8] text-white font-bold text-lg rounded-full py-3 px-8 w-full shadow-md mt-4 transition-colors">
            Postar
         </button>
         <div className="xl:hidden bg-[#1d9bf0] p-3 rounded-full mt-4 cursor-pointer">
            <PlusIcon />
         </div>

         <div className="mt-auto flex items-center gap-3 p-3 rounded-full hover:bg-[#181818] cursor-pointer w-full">
            <div className="w-10 h-10 rounded-full bg-gray-600 overflow-hidden">
               <img src="https://picsum.photos/seed/me/50" alt="me" />
            </div>
            <div className="hidden xl:block flex-1">
               <div className="font-bold text-sm">Mod Simulator</div>
               <div className="text-gray-500 text-sm">@LGGJMod</div>
            </div>
            <MoreHorizontal size={16} className="hidden xl:block" />
         </div>
      </div>

      {/* 2. Main Feed */}
      <div className="flex-1 flex flex-col min-w-0 max-w-2xl border-r border-gray-800">
         
         {/* Header */}
         <div className="sticky top-0 z-10 bg-black/80 backdrop-blur-md border-b border-gray-800 p-4 cursor-pointer">
            <h2 className="font-bold text-lg">Página Inicial</h2>
            <div className="flex mt-4 border-b border-gray-800 absolute w-full left-0 bottom-0">
               <div className="flex-1 text-center hover:bg-gray-900 py-3 cursor-pointer relative">
                  <span className="font-bold">Para você</span>
                  <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-14 h-1 bg-[#1d9bf0] rounded-full"></div>
               </div>
               <div className="flex-1 text-center hover:bg-gray-900 py-3 cursor-pointer text-gray-500">
                  <span className="font-medium">Seguindo</span>
               </div>
            </div>
            <div className="h-12"></div> {/* Spacer for tabs */}
         </div>

         {/* Composer Placeholder */}
         <div className="p-4 border-b border-gray-800 flex gap-4 hidden sm:flex">
             <div className="w-10 h-10 rounded-full bg-gray-600 overflow-hidden flex-shrink-0">
               <img src="https://picsum.photos/seed/me/50" alt="me" />
             </div>
             <div className="flex-1">
                <input placeholder="O que está acontecendo?" className="bg-transparent text-xl outline-none text-white w-full placeholder-gray-500 mb-4" />
                <div className="flex justify-between items-center border-t border-gray-800 pt-2">
                   <div className="flex gap-2 text-[#1d9bf0]">
                      {/* Fake Icons */}
                      <div className="w-5 h-5 rounded bg-current opacity-50"></div>
                      <div className="w-5 h-5 rounded bg-current opacity-50"></div>
                   </div>
                   <button className="bg-[#1d9bf0] text-white font-bold px-4 py-1.5 rounded-full text-sm opacity-50 cursor-not-allowed">
                      Postar
                   </button>
                </div>
             </div>
         </div>

         {/* Tweets List */}
         <div className="flex-1 overflow-y-auto custom-scrollbar">
            {posts.length === 0 && (
               <div className="p-12 text-center text-gray-500">
                  Carregando tweets...
               </div>
            )}
            
            {posts.map(post => (
               <div key={post.id} className={`p-4 border-b border-gray-800 hover:bg-white/[0.03] transition-colors cursor-pointer ${post.isNegative ? 'bg-red-900/10' : ''}`}>
                  <div className="flex gap-3">
                     <div className="w-10 h-10 rounded-full bg-gray-700 flex-shrink-0 overflow-hidden">
                        <img src={`https://picsum.photos/seed/${post.username}/50`} alt={post.username} className="w-full h-full object-cover" />
                     </div>
                     <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between">
                           <div className="flex items-center gap-1 truncate">
                              <span className="font-bold text-white hover:underline">{post.username}</span>
                              <span className="text-gray-500 truncate">{post.handle}</span>
                              <span className="text-gray-500">· 2m</span>
                           </div>
                           <MoreHorizontal size={16} className="text-gray-500 hover:text-[#1d9bf0]" />
                        </div>
                        
                        <p className="text-white text-[15px] mt-1 whitespace-pre-wrap leading-normal">
                           {post.content}
                        </p>

                        {post.isNegative && (
                           <div className="mt-2 p-2 bg-red-500/10 border border-red-500/30 rounded flex items-center gap-2 text-red-400 text-xs font-bold">
                              <ShieldAlert size={14} />
                              Conteúdo Potencialmente Nocivo à Marca
                           </div>
                        )}

                        <div className="flex items-center justify-between mt-3 text-gray-500 max-w-md pr-8">
                           <div className="flex items-center gap-2 group hover:text-[#1d9bf0]">
                              <div className="p-2 rounded-full group-hover:bg-[#1d9bf0]/10 transition-colors">
                                 <MessageCircle size={18} />
                              </div>
                              <span className="text-xs">23</span>
                           </div>
                           <div className="flex items-center gap-2 group hover:text-green-500">
                              <div className="p-2 rounded-full group-hover:bg-green-500/10 transition-colors">
                                 <Repeat size={18} />
                              </div>
                              <span className="text-xs">12</span>
                           </div>
                           <div className="flex items-center gap-2 group hover:text-pink-600">
                              <div className="p-2 rounded-full group-hover:bg-pink-600/10 transition-colors">
                                 <Heart size={18} />
                              </div>
                              <span className="text-xs">{post.likes}</span>
                           </div>
                           <div className="flex items-center gap-2 group hover:text-[#1d9bf0]">
                              <div className="p-2 rounded-full group-hover:bg-[#1d9bf0]/10 transition-colors">
                                 <Share size={18} />
                              </div>
                           </div>
                        </div>

                        {/* Mod Actions */}
                        <div className="mt-2 flex gap-2">
                           {post.isNegative ? (
                              <button 
                                 onClick={(e) => { e.stopPropagation(); onAction(GameActionType.REPLY_SOCIAL, post.id); }}
                                 className="flex-1 py-1.5 bg-[#1d9bf0] hover:bg-[#1a8cd8] text-white text-sm font-bold rounded-full transition-colors"
                              >
                                 Responder (Contenção de Danos)
                              </button>
                           ) : (
                              <button 
                                 onClick={(e) => { e.stopPropagation(); onAction(GameActionType.IGNORE_SOCIAL, post.id); }}
                                 className="flex-1 py-1.5 border border-gray-600 hover:bg-gray-800 text-white text-sm font-bold rounded-full transition-colors"
                              >
                                 Curtir & Engajar
                              </button>
                           )}
                        </div>
                     </div>
                  </div>
               </div>
            ))}
         </div>
      </div>

      {/* 3. Trends Sidebar (Right) */}
      <div className="w-80 hidden lg:block p-4 space-y-4">
         <div className="bg-[#16181c] rounded-2xl p-4">
            <h3 className="font-bold text-xl mb-4">O que está acontecendo</h3>
            
            <div className="py-3 hover:bg-[#1d1f23] -mx-4 px-4 cursor-pointer transition-colors">
               <div className="text-xs text-gray-500 flex justify-between">
                  <span>Entretenimento · Assunto do Momento</span>
                  <MoreHorizontal size={14} />
               </div>
               <div className="font-bold mt-0.5">LGGJ Live</div>
               <div className="text-xs text-gray-500">12,5 mil posts</div>
            </div>

            <div className="py-3 hover:bg-[#1d1f23] -mx-4 px-4 cursor-pointer transition-colors">
               <div className="text-xs text-gray-500 flex justify-between">
                  <span>Gaming · Assunto do Momento</span>
                  <MoreHorizontal size={14} />
               </div>
               <div className="font-bold mt-0.5">#ModSimulator</div>
               <div className="text-xs text-gray-500">5.234 posts</div>
            </div>
            
            <div className="py-3 hover:bg-[#1d1f23] -mx-4 px-4 cursor-pointer transition-colors">
               <div className="text-xs text-gray-500 flex justify-between">
                  <span>Brasil · Ao vivo</span>
                  <MoreHorizontal size={14} />
               </div>
               <div className="font-bold mt-0.5">Caos no Discord</div>
               <div className="text-xs text-gray-500">45 mil posts</div>
            </div>
         </div>
      </div>

    </div>
  );
};

const PlusIcon = () => (
  <svg viewBox="0 0 24 24" aria-hidden="true" className="w-6 h-6 fill-white"><g><path d="M11 11V4h2v7h7v2h-7v7h-2v-7H4v-2h7z"></path></g></svg>
);

export default SocialColumn;