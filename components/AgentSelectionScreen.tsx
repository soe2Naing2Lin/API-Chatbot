import React from 'react';
import { AGENTS } from '../constants';
import { Agent, User } from '../types';

interface AgentSelectionScreenProps {
  user: User;
  onSelectAgent: (agent: Agent) => void;
  onLogout: () => void;
}

const AgentSelectionScreen: React.FC<AgentSelectionScreenProps> = ({ user, onSelectAgent, onLogout }) => {
  return (
    <div className="flex flex-col h-full bg-slate-800">
      <header className="flex items-center justify-between p-4 bg-slate-900/50 backdrop-blur-sm border-b border-slate-700">
        <div className="flex items-center gap-3">
          <img src={user.avatarUrl} alt={user.name} className="w-10 h-10 rounded-full" />
          <div>
            <p className="font-semibold text-white">{user.name}</p>
            <p className="text-sm text-slate-400">Select an agent</p>
          </div>
        </div>
        <button
          onClick={onLogout}
          className="text-sm font-medium text-slate-300 hover:text-white transition-colors"
        >
          Logout
        </button>
      </header>

      <main className="flex-1 overflow-y-auto p-4 space-y-4">
        {AGENTS.map((agent) => (
          <button
            key={agent.id}
            onClick={() => onSelectAgent(agent)}
            className={`w-full text-left p-4 rounded-lg shadow-lg flex items-center gap-4 transition-transform transform hover:scale-105 ${agent.bgColor}`}
          >
            <div className="flex-shrink-0 w-12 h-12 bg-white/20 rounded-full flex items-center justify-center">
              <agent.icon className="w-7 h-7 text-white" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-white">{agent.name}</h2>
              <p className="text-sm text-white/80">{agent.description}</p>
            </div>
          </button>
        ))}
      </main>
    </div>
  );
};

export default AgentSelectionScreen;
