import React from 'react';
import { GoogleIcon } from './icons';

interface LoginScreenProps {
  onLogin: () => void;
}

const LoginScreen: React.FC<LoginScreenProps> = ({ onLogin }) => {
  return (
    <div className="flex flex-col items-center justify-center h-full bg-slate-900 p-8 text-center">
      <div className="mb-8">
        <h1 className="text-4xl font-bold text-white mb-2">Gemini AI Agents</h1>
        <p className="text-slate-400">Your personal AI assistants, ready to help.</p>
      </div>
      <div className="w-full max-w-xs">
        <button
          onClick={onLogin}
          className="w-full bg-white text-slate-700 font-semibold py-3 px-4 rounded-lg shadow-md hover:bg-slate-100 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-slate-900 focus:ring-white transition-all duration-200 ease-in-out flex items-center justify-center"
        >
          <GoogleIcon className="w-6 h-6 mr-3" />
          Sign in with Google
        </button>
      </div>
    </div>
  );
};

export default LoginScreen;
