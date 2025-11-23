import React, { useState, useEffect, useCallback, useRef } from 'react';
import StatsHeader from './components/StatsHeader';
import ChatColumn from './components/ChatColumn';
import DiscordColumn from './components/DiscordColumn';
import SocialColumn from './components/SocialColumn';
import TaskBoard from './components/TaskBoard';
import { 
  GameState, 
  ChatMessage, 
  DiscordAlert, 
  SocialPost, 
  ModTask,
  GameActionType,
  MessageType 
} from './types';
import { 
  INITIAL_SANITY, 
  INITIAL_HYPE, 
  INITIAL_VIEWERS, 
  GAME_TICK_MS,
  MODERATORS,
  XP_REWARDS,
  LEVEL_THRESHOLDS,
  POSSIBLE_TASKS
} from './constants';
import { fetchGameContent } from './services/geminiService';
import { Star, CheckCircle, AlertOctagon, ShieldCheck, Video, MessageCircle, Twitter } from 'lucide-react';

interface Notification {
  id: string;
  text: string;
  color: string;
  icon?: React.ReactNode;
}

type AppId = 'STREAM' | 'DISCORD' | 'SOCIAL' | 'DESKTOP' | 'TASKS';

const App: React.FC = () => {
  // Game State
  const [gameState, setGameState] = useState<GameState>({
    sanity: INITIAL_SANITY,
    hype: INITIAL_HYPE,
    viewers: INITIAL_VIEWERS,
    isPlaying: false,
    gameOver: false,
    level: 1,
    score: 0
  });

  // UI State
  const [activeApp, setActiveApp] = useState<AppId>('DESKTOP');
  const [tasksOpen, setTasksOpen] = useState(false); // Mobile/Dock toggle for tasks

  // Entities State
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([]);
  const [discordAlerts, setDiscordAlerts] = useState<DiscordAlert[]>([]);
  const [socialPosts, setSocialPosts] = useState<SocialPost[]>([]);
  const [modTasks, setModTasks] = useState<ModTask[]>([]);
  
  // Feedback System
  const [notifications, setNotifications] = useState<Notification[]>([]);

  // Content Buffer
  const contentBuffer = useRef<{
    chat: ChatMessage[],
    discord: DiscordAlert[],
    social: SocialPost[]
  }>({ chat: [], discord: [], social: [] });

  const isFetchingRef = useRef(false);

  // --- Helpers ---

  const triggerNotification = (text: string, color: string = 'text-yellow-400', icon?: React.ReactNode) => {
    const id = Date.now().toString() + Math.random();
    setNotifications(prev => [...prev, { id, text, color, icon }]);
    setTimeout(() => {
      setNotifications(prev => prev.filter(n => n.id !== id));
    }, 2000);
  };

  // --- Game Mechanics (Same Logic) ---
  const refillContent = useCallback(async () => {
    if (isFetchingRef.current) return;
    isFetchingRef.current = true;
    const data = await fetchGameContent(gameState.hype);
    if (data) {
      const newChats = data.chatMessages.map((msg: any) => ({
        id: Math.random().toString(36).substr(2, 9),
        username: msg.username,
        content: msg.content,
        type: msg.type as MessageType,
        isMod: MODERATORS.includes(msg.username) || msg.isMod,
        avatar: `https://picsum.photos/seed/${msg.username}/50`,
        timestamp: new Date()
      }));
      const newDiscord = data.discordAlerts.map((alert: any) => ({
        id: Math.random().toString(36).substr(2, 9),
        channel: alert.channel,
        user: alert.user,
        issue: alert.issue,
        severity: alert.severity,
        resolved: false
      }));
      const newSocial = data.socialPosts.map((post: any) => ({
        id: Math.random().toString(36).substr(2, 9),
        username: post.username,
        handle: post.handle || `@${post.username.replace(/\s/g, '')}`,
        content: post.content,
        likes: Math.floor(Math.random() * 500),
        isNegative: post.isNegative,
        replied: false
      }));
      contentBuffer.current.chat.push(...newChats);
      contentBuffer.current.discord.push(...newDiscord);
      contentBuffer.current.social.push(...newSocial);
    }
    isFetchingRef.current = false;
  }, [gameState.hype]);

  useEffect(() => {
    if (!gameState.isPlaying || gameState.gameOver) return;
    if (contentBuffer.current.chat.length === 0) refillContent();

    const interval = setInterval(() => {
      const nextChat = contentBuffer.current.chat.shift();
      const nextDiscord = Math.random() > 0.7 ? contentBuffer.current.discord.shift() : null;
      const nextSocial = Math.random() > 0.8 ? contentBuffer.current.social.shift() : null;

      if (nextChat) {
        setChatMessages(prev => [...prev.slice(-49), nextChat]);
        if (nextChat.type === MessageType.HATE) {
             setGameState(s => ({ ...s, sanity: Math.max(0, s.sanity - 2) }));
        }
      }
      if (nextDiscord) {
        setDiscordAlerts(prev => [...prev, nextDiscord]);
        setGameState(s => ({ ...s, sanity: Math.max(0, s.sanity - 5) }));
      }
      if (nextSocial) {
        setSocialPosts(prev => [nextSocial, ...prev]);
      }

      setModTasks(prev => {
        if (prev.length < 4 && Math.random() > 0.85) {
          const template = POSSIBLE_TASKS[Math.floor(Math.random() * POSSIBLE_TASKS.length)];
          return [...prev, { 
            id: Math.random().toString(36).substr(2, 9), 
            description: template.description, 
            xpReward: template.xp 
          }];
        }
        return prev;
      });

      setGameState(prev => {
        const sanityRegen = discordAlerts.length === 0 ? 1 : -1;
        const viewerChange = Math.floor(Math.random() * 10) * (prev.hype > 50 ? 1 : -1);
        const newSanity = Math.min(100, Math.max(0, prev.sanity + sanityRegen));
        if (newSanity <= 0) return { ...prev, sanity: 0, gameOver: true };
        return { ...prev, sanity: newSanity, viewers: Math.max(0, prev.viewers + viewerChange) };
      });

      if (contentBuffer.current.chat.length < 5) refillContent();
    }, GAME_TICK_MS);

    return () => clearInterval(interval);
  }, [gameState.isPlaying, gameState.gameOver, discordAlerts.length, refillContent]);

  const updateGameStateWithXP = (xpGain: number) => {
    setGameState(prev => {
      const newScore = prev.score + xpGain;
      const newLevel = LEVEL_THRESHOLDS.reduce((acc, curr) => newScore >= curr.minXp ? curr.level : acc, 1);
      if (newLevel > prev.level) triggerNotification(`LEVEL UP! Nível ${newLevel}`, 'text-yellow-300', <Star className="text-yellow-500 fill-yellow-500"/>);
      return { ...prev, score: newScore, level: newLevel };
    });
  };

  const handleAction = (action: GameActionType, itemId: string) => {
    let xpGain = 0;
    if (action === GameActionType.TIMEOUT_USER) xpGain = XP_REWARDS.TIMEOUT_USER;
    if (action === GameActionType.BAN_USER) xpGain = XP_REWARDS.BAN_USER;
    if (action === GameActionType.PIN_MESSAGE) xpGain = XP_REWARDS.PIN_MESSAGE;
    if (action === GameActionType.RESOLVE_DISCORD) xpGain = XP_REWARDS.RESOLVE_DISCORD;
    if (action === GameActionType.REPLY_SOCIAL) xpGain = XP_REWARDS.REPLY_SOCIAL;
    if (action === GameActionType.IGNORE_SOCIAL) xpGain = XP_REWARDS.IGNORE_SOCIAL;

    // Trigger Notification
    let actionText = "";
    let actionColor = "text-white";
    let icon = undefined;
    switch (action) {
      case GameActionType.TIMEOUT_USER: actionText = "TIMEOUT"; actionColor = "text-yellow-400"; icon = <AlertOctagon size={16} />; break;
      case GameActionType.BAN_USER: actionText = "BANIDO"; actionColor = "text-red-500"; icon = <ShieldCheck size={16} />; break;
      case GameActionType.RESOLVE_DISCORD: actionText = "RESOLVIDO"; actionColor = "text-blue-400"; icon = <CheckCircle size={16} />; break;
      case GameActionType.REPLY_SOCIAL: actionText = "RESPONDIDO"; actionColor = "text-blue-300"; break;
      case GameActionType.PIN_MESSAGE: actionText = "FIXADO"; actionColor = "text-purple-400"; break;
      default: actionText = "AÇÃO";
    }
    triggerNotification(`${actionText}! +${xpGain} XP`, actionColor, icon);

    switch (action) {
      case GameActionType.TIMEOUT_USER:
      case GameActionType.BAN_USER:
        setChatMessages(prev => prev.filter(m => m.id !== itemId));
        setGameState(s => ({ ...s, sanity: Math.min(100, s.sanity + 2) }));
        break;
      case GameActionType.PIN_MESSAGE:
        setGameState(s => ({ ...s, hype: Math.min(100, s.hype + 5) }));
        break;
      case GameActionType.RESOLVE_DISCORD:
        setDiscordAlerts(prev => prev.filter(a => a.id !== itemId));
        setGameState(s => ({ ...s, sanity: Math.min(100, s.sanity + 10) }));
        break;
      case GameActionType.REPLY_SOCIAL:
        setSocialPosts(prev => prev.filter(p => p.id !== itemId));
        setGameState(s => ({ ...s, hype: Math.min(100, s.hype + 5), sanity: Math.min(100, s.sanity + 2) }));
        break;
      case GameActionType.IGNORE_SOCIAL:
        setSocialPosts(prev => prev.filter(p => p.id !== itemId));
        break;
    }
    updateGameStateWithXP(xpGain);
  };

  const handleCompleteTask = (taskId: string) => {
    const task = modTasks.find(t => t.id === taskId);
    if (!task) return;
    setModTasks(prev => prev.filter(t => t.id !== taskId));
    setGameState(s => ({ ...s, hype: Math.min(100, s.hype + 3), sanity: Math.min(100, s.sanity + 3) }));
    triggerNotification(`TAREFA COMPLETA! +${task.xpReward} XP`, "text-green-400", <CheckCircle size={16} />);
    updateGameStateWithXP(task.xpReward);
  };

  // --- Render ---

  if (!gameState.isPlaying && !gameState.gameOver) {
    return (
       <div className="min-h-screen bg-gray-900 flex items-center justify-center p-4">
        <div className="max-w-md w-full bg-gray-800 rounded-xl shadow-2xl p-8 border border-gray-700 text-center">
          <div className="w-20 h-20 bg-gradient-to-tr from-purple-600 to-pink-600 rounded-full mx-auto mb-6 flex items-center justify-center text-3xl font-bold text-white shadow-lg shadow-purple-500/50">
            LG
          </div>
          <h1 className="text-3xl font-bold text-white mb-2">Simulador de Mod LGGJ</h1>
          <p className="text-gray-400 mb-8">
            Você foi escalado para moderar a live mais caótica do Brasil.
            <br/><br/>
            Sua missão: Manter a Sanidade do chat, resolver B.O.s no Discord e impedir o cancelamento no Twitter.
          </p>
          <button 
            onClick={() => setGameState(s => ({ ...s, isPlaying: true }))}
            className="w-full bg-purple-600 hover:bg-purple-700 text-white font-bold py-3 px-6 rounded-lg transition-transform transform hover:scale-105 shadow-lg"
          >
            INICIAR SISTEMA
          </button>
        </div>
      </div>
    );
  }

  if (gameState.gameOver) {
     return (
      <div className="min-h-screen bg-black flex items-center justify-center p-4 font-mono">
        <div className="max-w-md w-full text-center">
          <h1 className="text-6xl font-black text-red-600 mb-4 tracking-tighter">BANNED</h1>
          <p className="text-xl text-gray-300 mb-8">
            CRITICAL SYSTEM FAILURE
            <br/>
            A sanidade chegou a 0.
          </p>
          <div className="bg-gray-900 p-6 rounded border border-red-900/50 mb-8 text-left text-sm text-red-400 font-mono">
             <p className="mb-2 text-white">RELATÓRIO DE INCIDENTE:</p>
            <p>{'>'} Nível Final: {gameState.level}</p>
            <p>{'>'} Score Final: {gameState.score} XP</p>
            <p>{'>'} Viewers Max: {gameState.viewers}</p>
            <p className="animate-pulse mt-2">{'>'} STATUS: DEMITIDO</p>
          </div>
          <button 
            onClick={() => window.location.reload()}
            className="bg-white text-black hover:bg-gray-200 font-bold py-3 px-8 rounded-none transition-colors uppercase"
          >
            Reiniciar Sistema
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-screen bg-black overflow-hidden font-sans relative select-none">
      <StatsHeader state={gameState} />
      
      {/* Desktop Background Area */}
      <div 
        className="flex-1 relative bg-cover bg-center overflow-hidden flex items-center justify-center"
        style={{ backgroundImage: "url('https://images.unsplash.com/photo-1550751827-4bd374c3f58b?q=80&w=2070&auto=format&fit=crop')" }}
        onClick={() => setActiveApp('DESKTOP')}
      >
         {/* Desktop Overlay Gradient */}
         <div className="absolute inset-0 bg-black/30 backdrop-blur-[1px]"></div>

         {/* Task Widget (Pinned to Desktop) */}
         <div className={`absolute top-8 right-8 w-72 transition-all duration-500 transform ${activeApp === 'DESKTOP' ? 'translate-x-0 opacity-100' : 'translate-x-20 opacity-0 pointer-events-none'}`}>
            <TaskBoard tasks={modTasks} onComplete={handleCompleteTask} />
         </div>

         {/* Active Application Window */}
         {activeApp !== 'DESKTOP' && (
           <div 
              className="relative w-[95%] h-[90%] max-w-7xl shadow-2xl rounded-lg overflow-hidden animate-float-in z-20"
              onClick={(e) => e.stopPropagation()}
           >
              {/* Window Controls Overlay (Simple) */}
              <div className="absolute top-0 left-0 right-0 h-6 z-50 flex justify-end px-2 items-center gap-1.5 opacity-0 hover:opacity-100 transition-opacity">
                 <div className="w-3 h-3 rounded-full bg-yellow-500 cursor-pointer" onClick={() => setActiveApp('DESKTOP')} title="Minimizar"></div>
                 <div className="w-3 h-3 rounded-full bg-green-500 cursor-pointer" title="Maximizar"></div>
                 <div className="w-3 h-3 rounded-full bg-red-500 cursor-pointer" onClick={() => setActiveApp('DESKTOP')} title="Fechar"></div>
              </div>

              {activeApp === 'STREAM' && <ChatColumn messages={chatMessages} viewers={gameState.viewers} onAction={handleAction} />}
              {activeApp === 'DISCORD' && <DiscordColumn alerts={discordAlerts} onAction={handleAction} />}
              {activeApp === 'SOCIAL' && <SocialColumn posts={socialPosts} onAction={handleAction} />}
           </div>
         )}
      </div>

      {/* Dock (Taskbar) */}
      <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 bg-gray-900/80 backdrop-blur-xl border border-white/10 rounded-2xl p-2 flex items-end gap-3 shadow-2xl z-50 h-20 items-center px-6">
         
         <DockItem 
           active={activeApp === 'STREAM'} 
           onClick={() => setActiveApp(prev => prev === 'STREAM' ? 'DESKTOP' : 'STREAM')}
           color="bg-purple-600"
           icon={<Video size={28} className="text-white" />}
           label="Live Manager"
         />

         <DockItem 
           active={activeApp === 'DISCORD'} 
           onClick={() => setActiveApp(prev => prev === 'DISCORD' ? 'DESKTOP' : 'DISCORD')}
           color="bg-[#5865F2]"
           icon={<MessageCircle size={28} className="text-white" />}
           label="Discord"
           notificationCount={discordAlerts.length}
         />

         <DockItem 
           active={activeApp === 'SOCIAL'} 
           onClick={() => setActiveApp(prev => prev === 'SOCIAL' ? 'DESKTOP' : 'SOCIAL')}
           color="bg-black border border-gray-700"
           icon={<Twitter size={28} className="text-white" />}
           label="X"
           notificationCount={socialPosts.filter(p => p.isNegative).length}
         />

         <div className="w-[1px] h-10 bg-white/10 mx-1"></div>

         <DockItem 
           active={activeApp === 'DESKTOP'} 
           onClick={() => setActiveApp('DESKTOP')}
           color="bg-yellow-400"
           icon={<ShieldCheck size={28} className="text-yellow-900" />}
           label="Tarefas"
           notificationCount={modTasks.length}
           isWidgetTrigger
         />

      </div>

      {/* Notifications Overlay */}
      <div className="fixed top-16 right-4 z-[100] flex flex-col gap-2 items-end pointer-events-none">
        {notifications.map(n => (
          <div 
            key={n.id} 
            className="bg-gray-900/90 backdrop-blur-md border-l-4 border-yellow-400 px-4 py-3 rounded shadow-xl flex items-center gap-3 animate-slide-in transform transition-all duration-300 w-64"
          >
            {n.icon}
            <span className={`font-bold text-sm ${n.color}`}>{n.text}</span>
          </div>
        ))}
      </div>

    </div>
  );
};

const DockItem: React.FC<{
  active: boolean;
  onClick: () => void;
  color: string;
  icon: React.ReactNode;
  label: string;
  notificationCount?: number;
  isWidgetTrigger?: boolean;
}> = ({ active, onClick, color, icon, label, notificationCount = 0, isWidgetTrigger }) => {
  return (
    <div className="group relative flex flex-col items-center gap-1">
       {/* Tooltip */}
       <div className="absolute -top-12 opacity-0 group-hover:opacity-100 transition-opacity bg-black/80 text-white text-xs py-1 px-3 rounded pointer-events-none whitespace-nowrap border border-gray-700">
         {label}
       </div>

       {/* Icon */}
       <button 
         onClick={onClick}
         className={`w-14 h-14 rounded-xl flex items-center justify-center shadow-lg transition-all duration-300 transform hover:-translate-y-2 hover:scale-110 ${color} ${active ? 'ring-2 ring-white/50 ring-offset-2 ring-offset-transparent' : 'opacity-90 hover:opacity-100'}`}
       >
         {icon}
         {notificationCount > 0 && (
           <div className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 rounded-full flex items-center justify-center text-[10px] font-bold text-white border-2 border-gray-900 animate-bounce">
             {notificationCount}
           </div>
         )}
       </button>
       
       {/* Active Indicator Dot */}
       <div className={`w-1 h-1 rounded-full bg-white transition-opacity ${active ? 'opacity-100' : 'opacity-0'}`} />
    </div>
  );
};

export default App;