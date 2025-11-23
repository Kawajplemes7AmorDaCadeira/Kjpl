export const MODERATORS = [
  "Rodrigues", 
  "ralf", 
  "Erick", 
  "Shhhbr", 
  "yune", 
  "Nishimura", 
  "hms", 
  "yumi", 
  "BrGirl", 
  "Kawajplemes7AmorDaCadeira", 
  "Marisco", 
  "Rubens"
];

export const CHANNELS = [
  "#geral",
  "#memes",
  "#clips",
  "#denuncias",
  "#off-topic"
];

export const INITIAL_SANITY = 100;
export const INITIAL_HYPE = 50;
export const INITIAL_VIEWERS = 1200;

export const GAME_TICK_MS = 2500; // New content every 2.5s
export const GEMINI_BATCH_SIZE = 15; // Fetch 15 items at a time

export const XP_REWARDS = {
  TIMEOUT_USER: 15,
  BAN_USER: 25,
  PIN_MESSAGE: 10,
  RESOLVE_DISCORD: 40,
  REPLY_SOCIAL: 30,
  IGNORE_SOCIAL: 5
};

export const LEVEL_THRESHOLDS = [
  { level: 1, minXp: 0, title: "Novato do Chat" },
  { level: 2, minXp: 200, title: "Mod de Confiança" },
  { level: 3, minXp: 600, title: "Xerife do Discord" },
  { level: 4, minXp: 1200, title: "Admin Supremo" },
  { level: 5, minXp: 2500, title: "Lenda do Chat" } // Max level cap logic handled in UI
];

export const POSSIBLE_TASKS = [
  { description: "Verificar logs de banimento", xp: 50 },
  { description: "Atualizar título da stream", xp: 30 },
  { description: "Criar comando !loja", xp: 40 },
  { description: "Limpar chat de bots", xp: 60 },
  { description: "Organizar clipe da semana", xp: 45 },
  { description: "Responder sussurros", xp: 25 },
  { description: "Configurar filtro de palavras", xp: 35 },
  { description: "Sortear VIP no chat", xp: 55 },
  { description: "Avisar sobre regras no #geral", xp: 20 },
  { description: "Trocar categoria da live", xp: 30 }
];