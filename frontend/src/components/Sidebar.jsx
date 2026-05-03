import React from 'react';
import { NavLink } from 'react-router-dom';
import { LayoutDashboard, MessageSquare, Stethoscope, FileText, Pill, Activity, History, AlertTriangle, LogOut } from 'lucide-react';

const Sidebar = ({ setIsAuthenticated }) => {
  const navItems = [
    { name: 'Dashboard', path: '/dashboard', icon: <LayoutDashboard size={20} /> },
    { name: 'Chat Assistant', path: '/chat', icon: <MessageSquare size={20} /> },
    { name: 'Symptom Checker', path: '/symptom-checker', icon: <Stethoscope size={20} /> },
    { name: 'Report Scanner', path: '/report-scanner', icon: <FileText size={20} /> },
    { name: 'Medicine Reminder', path: '/medicine', icon: <Pill size={20} /> },
    { name: 'Health Dashboard', path: '/health', icon: <Activity size={20} /> },
    { name: 'History', path: '/history', icon: <History size={20} /> },
  ];

  return (
    <div className="w-64 bg-surface-900 text-white h-full flex flex-col shadow-xl">
      <div className="p-6">
        <h1 className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-teal-300">
          TrustCare AI
        </h1>
        <p className="text-slate-400 text-sm mt-1">Intelligent Health Assistant</p>
      </div>

      <nav className="flex-1 px-4 space-y-2 mt-4 overflow-y-auto">
        {navItems.map((item) => (
          <NavLink
            key={item.name}
            to={item.path}
            className={({ isActive }) =>
              `flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 ${
                isActive
                  ? 'bg-blue-600/20 text-blue-400 border border-blue-500/30'
                  : 'text-slate-300 hover:bg-slate-800 hover:text-white'
              }`
            }
          >
            {item.icon}
            <span className="font-medium">{item.name}</span>
          </NavLink>
        ))}
      </nav>

      <div className="p-4 space-y-2">
        <button 
          className="w-full flex items-center gap-3 px-4 py-3 rounded-xl bg-red-500/10 text-red-400 hover:bg-red-500/20 border border-red-500/20 transition-all font-medium"
        >
          <AlertTriangle size={20} />
          Emergency
        </button>
        <button 
          onClick={() => setIsAuthenticated(false)}
          className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-slate-400 hover:bg-slate-800 hover:text-white transition-all font-medium"
        >
          <LogOut size={20} />
          Sign Out
        </button>
      </div>
    </div>
  );
};

export default Sidebar;
