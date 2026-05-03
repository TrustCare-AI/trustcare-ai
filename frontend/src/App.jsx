import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Sidebar from './components/Sidebar';
import Dashboard from './pages/Dashboard';
import ChatAssistant from './pages/ChatAssistant';
import SymptomChecker from './pages/SymptomChecker';
import ReportScanner from './pages/ReportScanner';
import Login from './pages/Login';

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  return (
    <Router>
      {isAuthenticated ? (
        <div className="flex h-screen bg-slate-50 overflow-hidden">
          <Sidebar setIsAuthenticated={setIsAuthenticated} />
          <div className="flex-1 overflow-y-auto">
            <Routes>
              <Route path="/" element={<Navigate to="/dashboard" replace />} />
              <Route path="/dashboard" element={<Dashboard />} />
              <Route path="/chat" element={<ChatAssistant />} />
              <Route path="/symptom-checker" element={<SymptomChecker />} />
              <Route path="/report-scanner" element={<ReportScanner />} />
              <Route path="*" element={<Navigate to="/dashboard" replace />} />
            </Routes>
          </div>
        </div>
      ) : (
        <Routes>
          <Route path="/login" element={<Login onLogin={() => setIsAuthenticated(true)} />} />
          <Route path="*" element={<Navigate to="/login" replace />} />
        </Routes>
      )}
    </Router>
  );
}

export default App;
