import React from 'react';
import { Bot, Settings, LayoutDashboard, Stethoscope } from 'lucide-react';
import Metrics from './components/Metrics';
import LiveFeed from './components/LiveFeed';
import Pipeline from './components/Pipeline';
import './App.css';

function App() {
  return (
    <div className="app-container">
      {/* Sidebar */}
      <aside className="sidebar">
        <div className="logo-container">
          <div className="logo-icon">
            <Stethoscope size={24} color="#fff" />
          </div>
          <h1>ClinicOS</h1>
        </div>
        
        <nav className="nav-menu">
          <a href="#" className="nav-item active">
            <LayoutDashboard size={20} />
            <span>Nerve Center</span>
          </a>
          <a href="#" className="nav-item">
            <Bot size={20} />
            <span>AI Agents</span>
          </a>
          <a href="#" className="nav-item">
            <Settings size={20} />
            <span>Settings</span>
          </a>
        </nav>

        <div className="system-status">
          <div className="status-indicator online"></div>
          <span>All systems operational</span>
        </div>
      </aside>

      {/* Main Content */}
      <main className="main-content">
        <header className="top-header">
          <div>
            <h2 className="page-title">Automation Nerve Center</h2>
            <p className="page-subtitle">Monitoring real-time AI workforce activity</p>
          </div>
          <div className="clinic-profile">
            <div className="avatar">Dr. Y</div>
            <span>City Clinic</span>
          </div>
        </header>

        <div className="dashboard-content">
          <Metrics />
          
          <div className="split-view">
            <div className="pipeline-section">
              <Pipeline />
            </div>
            <div className="feed-section">
              <LiveFeed />
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

export default App;
