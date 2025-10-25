
export interface User {
  name: string;
  email: string;
  avatarUrl?: string;
}

export interface Agent {
  id: string;
  name: string;
  description: string;
  systemInstruction: string;
  welcomeMessage: string;
  icon: React.ComponentType<{ className?: string }>;
  bgColor: string;
}

export interface ChatMessage {
  id: string;
  text: string;
  sender: 'user' | 'agent';
  timestamp: number;
}

export interface UsageData {
  messageCount: number;
  resetTimestamp: number;
  isPremium: boolean;
}
