import React, { useState } from 'react';
import { Mail, Lock, ChevronRight } from 'lucide-react';
import axios from 'axios';

const Login = ({ onLogin }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      // Calling the mock Node.js backend
      await axios.post('http://localhost:5000/api/auth/login', { email, password });
      onLogin();
    } catch (error) {
      console.error("Login failed", error);
      // For demo purposes, we will login anyway if backend isn't up
      onLogin();
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-900 bg-[url('https://images.unsplash.com/photo-1576091160550-2173ff9e5eb3?q=80&w=2069&auto=format&fit=crop')] bg-cover bg-center">
      <div className="absolute inset-0 bg-slate-900/80 backdrop-blur-sm"></div>
      
      <div className="relative z-10 w-full max-w-md p-8 bg-white/10 backdrop-blur-md rounded-3xl border border-white/20 shadow-2xl">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-teal-300 mb-2">
            TrustCare AI
          </h1>
          <p className="text-slate-300">Sign in to your intelligent health assistant</p>
        </div>

        <form onSubmit={handleLogin} className="space-y-5">
          <div className="relative">
            <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
            <input 
              type="email" 
              placeholder="Email address"
              className="w-full bg-slate-800/50 border border-slate-700 rounded-xl py-3 pl-12 pr-4 text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all placeholder:text-slate-500"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          <div className="relative">
            <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
            <input 
              type="password" 
              placeholder="Password"
              className="w-full bg-slate-800/50 border border-slate-700 rounded-xl py-3 pl-12 pr-4 text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all placeholder:text-slate-500"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>
          
          <button 
            type="submit"
            className="w-full bg-gradient-to-r from-blue-600 to-teal-500 hover:from-blue-500 hover:to-teal-400 text-white font-medium py-3 rounded-xl flex items-center justify-center gap-2 transition-all transform hover:scale-[1.02] shadow-lg shadow-blue-500/25"
          >
            Sign In
            <ChevronRight size={20} />
          </button>
        </form>

        <p className="mt-6 text-center text-slate-400 text-sm">
          Don't have an account? <a href="#" className="text-blue-400 hover:text-blue-300 font-medium">Sign up</a>
        </p>
      </div>
    </div>
  );
};

export default Login;
