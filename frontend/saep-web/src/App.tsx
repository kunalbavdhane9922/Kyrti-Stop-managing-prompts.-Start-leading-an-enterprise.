import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Navbar from './components/layout/Navbar';
import Dashboard from './pages/Dashboard';
import Marketplace from './pages/Marketplace';
import Hiring from './pages/Hiring';
import Reports from './pages/Reports';
import CompanyManagement from './pages/CompanyManagement';

const App: React.FC = () => {
  return (
    <BrowserRouter>
      <Navbar />
      <main className="page-container">
        <Routes>
          <Route path="/" element={<Navigate to="/dashboard" replace />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/marketplace" element={<Marketplace />} />
          <Route path="/hiring" element={<Hiring />} />
          <Route path="/reports" element={<Reports />} />
          <Route path="/company" element={<CompanyManagement />} />
        </Routes>
      </main>
    </BrowserRouter>
  );
};

export default App;
