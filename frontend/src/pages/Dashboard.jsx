import React from 'react';
import { Activity, Heart, Thermometer, Droplet, User, Bell } from 'lucide-react';

const StatCard = ({ title, value, icon, color }) => (
  <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100 flex items-center gap-4">
    <div className={`p-4 rounded-xl ${color}`}>
      {icon}
    </div>
    <div>
      <p className="text-slate-500 text-sm font-medium">{title}</p>
      <p className="text-2xl font-bold text-slate-800">{value}</p>
    </div>
  </div>
);

const Dashboard = () => {
  return (
    <div className="p-8 max-w-7xl mx-auto space-y-8">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-slate-800">Welcome back, Aish! 👋</h1>
          <p className="text-slate-500 mt-1">Here is your health overview for today.</p>
        </div>
        <div className="flex items-center gap-4">
          <button className="p-2 bg-white rounded-full border border-slate-200 text-slate-600 hover:bg-slate-50 transition">
            <Bell size={20} />
          </button>
          <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center border-2 border-blue-500">
            <User size={20} className="text-blue-600" />
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard 
          title="Heart Rate" 
          value="72 bpm" 
          icon={<Heart size={24} className="text-red-500" />} 
          color="bg-red-50" 
        />
        <StatCard 
          title="Blood Pressure" 
          value="120/80" 
          icon={<Activity size={24} className="text-blue-500" />} 
          color="bg-blue-50" 
        />
        <StatCard 
          title="Body Temp" 
          value="98.6°F" 
          icon={<Thermometer size={24} className="text-orange-500" />} 
          color="bg-orange-50" 
        />
        <StatCard 
          title="Glucose" 
          value="95 mg/dL" 
          icon={<Droplet size={24} className="text-teal-500" />} 
          color="bg-teal-50" 
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 bg-white rounded-3xl p-6 shadow-sm border border-slate-100">
          <h2 className="text-xl font-bold text-slate-800 mb-6">Recent AI Consultations</h2>
          <div className="space-y-4">
            {[1, 2, 3].map((_, i) => (
              <div key={i} className="flex items-center justify-between p-4 rounded-2xl bg-slate-50 border border-slate-100 hover:border-blue-200 transition-colors">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-full bg-blue-100 flex items-center justify-center text-blue-600">
                    <Activity size={20} />
                  </div>
                  <div>
                    <h3 className="font-semibold text-slate-800">Symptom Check: Headache</h3>
                    <p className="text-sm text-slate-500">2 days ago • Mild severity</p>
                  </div>
                </div>
                <button className="text-blue-600 text-sm font-medium hover:underline">View Result</button>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-gradient-to-br from-blue-600 to-teal-500 rounded-3xl p-6 text-white shadow-lg relative overflow-hidden">
          <div className="absolute top-0 right-0 p-8 opacity-10">
            <Heart size={120} />
          </div>
          <div className="relative z-10">
            <h2 className="text-xl font-bold mb-2">Need a quick check?</h2>
            <p className="text-blue-100 mb-6">Our AI is ready to analyze your symptoms or medical reports instantly.</p>
            <div className="space-y-3">
              <button className="w-full py-3 px-4 bg-white text-blue-600 rounded-xl font-medium hover:bg-blue-50 transition shadow-sm">
                Chat with Assistant
              </button>
              <button className="w-full py-3 px-4 bg-blue-700/50 hover:bg-blue-700/70 text-white rounded-xl font-medium border border-blue-400/30 transition">
                Scan Report
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
