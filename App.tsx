
import React, { useState, useEffect, useCallback } from 'react';
import { useAuth, User } from './hooks/useAuth';
import LoginScreen from './components/LoginScreen';
import AgentSelectionScreen from './components/AgentSelectionScreen';
import ChatScreen from './components/ChatScreen';
import { Agent } from './types';

export type Screen = 'login' | 'selection' | 'chat';

const App: React.FC = () => {
  const { user, login, logout } = useAuth();
  const [currentScreen, setCurrentScreen] = useState<Screen>('login');
  const [selectedAgent, setSelectedAgent] = useState<Agent | null>(null);

  useEffect(() => {
    if (user) {
      setCurrentScreen('selection');
    } else {
      setCurrentScreen('login');
    }
  }, [user]);

  const handleLogin = () => {
    // In a real app, this would involve a Google OAuth flow.
    // Here we simulate it by creating a user object.
    const mockUser: User = {
      name: 'Demo User',
      email: 'demo.user@example.com',
      avatarUrl: 'https://picsum.photos/100',
    };
    login(mockUser);
  };

  const handleSelectAgent = useCallback((agent: Agent) => {
    setSelectedAgent(agent);
    setCurrentScreen('chat');
  }, []);

  const handleGoBack = useCallback(() => {
    setCurrentScreen('selection');
    setSelectedAgent(null);
  }, []);

  const renderScreen = () => {
    if (!user || currentScreen === 'login') {
      return <LoginScreen onLogin={handleLogin} />;
    }

    switch (currentScreen) {
      case 'selection':
        return <AgentSelectionScreen onSelectAgent={handleSelectAgent} user={user} onLogout={logout} />;
      case 'chat':
        if (selectedAgent) {
          return <ChatScreen agent={selectedAgent} onGoBack={handleGoBack} />;
        }
        // Fallback to selection if no agent is selected
        setCurrentScreen('selection');
        return <AgentSelectionScreen onSelectAgent={handleSelectAgent} user={user} onLogout={logout} />;
      default:
        return <LoginScreen onLogin={handleLogin} />;
    }
  };

  return (
    <div className="h-screen w-screen bg-slate-900 font-sans">
      <div className="max-w-md mx-auto h-full bg-slate-800 shadow-2xl flex flex-col">
        {renderScreen()}
      </div>
    </div>
  );
};

export default App;
