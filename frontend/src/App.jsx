import React, { useState, useEffect } from 'react';
import {
  INITIAL_PATIENTS,
  INITIAL_ALERTS,
  INITIAL_FEED_EVENTS,
  INITIAL_ANALYTICS,
  INITIAL_SETTINGS
} from './mockData';

// Import subpages
import Dashboard from './pages/Dashboard';
import Appointments from './pages/Appointments';
import Patients from './pages/Patients';
import AIInbox from './pages/AIInbox';
import AlertsEscalations from './pages/AlertsEscalations';
import Analytics from './pages/Analytics';
import Settings from './pages/Settings';

export default function App() {
  // Global States
  const [patients, setPatients] = useState(INITIAL_PATIENTS);
  const [alerts, setAlerts] = useState(INITIAL_ALERTS);
  const [feedEvents, setFeedEvents] = useState(INITIAL_FEED_EVENTS);
  const [settings, setSettings] = useState(INITIAL_SETTINGS);
  const [activePage, setActivePage] = useState('Dashboard');
  const [globalSearch, setGlobalSearch] = useState('');
  const [selectedClinic, setSelectedClinic] = useState('Dr. Sharma\'s Clinic, Faridabad');
  const [selectedPatientId, setSelectedPatientId] = useState('p1'); // default to Ramesh Kumar
  
  // Interactive UI indicators
  const [toasts, setToasts] = useState([]);
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const [showAlertMenu, setShowAlertMenu] = useState(false);

  // Helper to trigger custom toasts
  const triggerToast = (text, type = 'info') => {
    const id = Date.now() + Math.random().toString(36).substr(2, 5);
    setToasts((prev) => [...prev, { id, text, type }]);
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 4000);
  };

  // Simulating live AI feed updates periodically (adds realism)
  useEffect(() => {
    const randomFeedEvents = [
      { text: "WhatsApp AI: Patient inquired about Orthopedic OPD times.", type: "ai-action" },
      { text: "Lead recovered: Sent automated WhatsApp follow-up for missed booking.", type: "ai-action" },
      { text: "System check: Google Calendar synced successfully.", type: "system" },
      { text: "AI Receptionist: Confirmed appointment for Priya Patel.", type: "confirmed" },
      { text: "WhatsApp AI: Hinglish text 'Mera reports kab tak aayenge?' interpreted.", type: "ai-action" },
      { text: "AI Triage: Analyzed voice note from +91 99120-XXXX.", type: "ai-action" }
    ];

    const timer = setInterval(() => {
      const randomEvent = randomFeedEvents[Math.floor(Math.random() * randomFeedEvents.length)];
      const now = new Date();
      const timeStr = now.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: true });
      
      setFeedEvents(prev => [
        { time: timeStr, text: randomEvent.text, type: randomEvent.type },
        ...prev.slice(0, 10) // keep last 10
      ]);

      // Randomly display a notification toast
      if (Math.random() > 0.4) {
        triggerToast(randomEvent.text, randomEvent.type === 'emergency' ? 'error' : 'info');
      }
    }, 20000);

    return () => clearInterval(timer);
  }, []);

  // Sync global search logic: redirects to Patients if the user starts searching
  const handleSearchChange = (e) => {
    setGlobalSearch(e.target.value);
    if (activePage !== 'Patients' && activePage !== 'Appointments' && activePage !== 'AI Inbox') {
      setActivePage('Patients');
    }
  };

  // Count active alerts
  const activeAlertsCount = alerts.filter(a => !a.resolved).length;

  // Custom Inline Icons to avoid installing lucide-react or fontawesome packages
  const getIcon = (name) => {
    switch (name) {
      case 'dashboard':
        return (
          <svg fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><rect width="7" height="9" x="3" y="3" rx="1"/><rect width="7" height="5" x="14" y="3" rx="1"/><rect width="7" height="9" x="14" y="12" rx="1"/><rect width="7" height="5" x="3" y="16" rx="1"/></svg>
        );
      case 'appointments':
        return (
          <svg fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><rect width="18" height="18" x="3" y="4" rx="2"/><path d="M16 2v4M8 2v4M3 10h18M8 14h8M8 18h5"/></svg>
        );
      case 'patients':
        return (
          <svg fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M22 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75"/></svg>
        );
      case 'inbox':
        return (
          <svg fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/></svg>
        );
      case 'alerts':
        return (
          <svg fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3Z"/><line x1="12" x2="12" y1="9" y2="13"/><line x1="12" x2="12.01" y1="17" y2="17"/></svg>
        );
      case 'analytics':
        return (
          <svg fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M3 3v18h18"/><path d="m19 9-5 5-4-4-3 3"/></svg>
        );
      case 'settings':
        return (
          <svg fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 1 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 1 1-2.83-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 1 1 2.83-2.83l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 1 1 2.83 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z"/></svg>
        );
      case 'billing':
        return (
          <svg fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><rect width="20" height="14" x="2" y="5" rx="2"/><line x1="2" x2="22" y1="10" y2="10"/></svg>
        );
      case 'staff':
        return (
          <svg fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><rect width="6" height="6" x="15" y="4" rx="1"/></svg>
        );
      case 'ai-workforce':
        return (
          <svg fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M12 2a10 10 0 0 1 10 10c0 5.523-4.477 10-10 10S2 17.523 2 12A10 10 0 0 1 12 2Z"/><path d="M12 6v12M6 12h12"/></svg>
        );
      case 'search':
        return (
          <svg fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.3-4.3"/></svg>
        );
      case 'chevron':
        return (
          <svg fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24" style={{width: 14, height: 14}}><path d="m6 9 6 6 6-6"/></svg>
        );
      default:
        return null;
    }
  };

  // Render correct subpage based on routing state
  const renderPage = () => {
    switch (activePage) {
      case 'Dashboard':
        return (
          <Dashboard 
            patients={patients} 
            alerts={alerts}
            setAlerts={setAlerts}
            feedEvents={feedEvents}
            setActivePage={setActivePage}
            setSelectedPatientId={setSelectedPatientId}
            triggerToast={triggerToast}
          />
        );
      case 'Appointments':
        return (
          <Appointments 
            patients={patients}
            setPatients={setPatients}
            setSelectedPatientId={setSelectedPatientId}
            setActivePage={setActivePage}
            triggerToast={triggerToast}
          />
        );
      case 'Patients':
        return (
          <Patients 
            patients={patients}
            setPatients={setPatients}
            selectedPatientId={selectedPatientId}
            setSelectedPatientId={setSelectedPatientId}
            globalSearch={globalSearch}
            setGlobalSearch={setGlobalSearch}
            triggerToast={triggerToast}
          />
        );
      case 'AI Inbox':
        return (
          <AIInbox 
            patients={patients}
            setPatients={setPatients}
            selectedPatientId={selectedPatientId}
            setSelectedPatientId={setSelectedPatientId}
            triggerToast={triggerToast}
          />
        );
      case 'Alerts & Escalations':
        return (
          <AlertsEscalations 
            alerts={alerts}
            setAlerts={setAlerts}
            setSelectedPatientId={setSelectedPatientId}
            setActivePage={setActivePage}
            triggerToast={triggerToast}
          />
        );
      case 'Analytics':
        return <Analytics patients={patients} />;
      case 'Settings':
        return (
          <Settings 
            settings={settings}
            setSettings={setSettings}
            triggerToast={triggerToast}
          />
        );
      default:
        return <div>Page not found</div>;
    }
  };

  return (
    <div className="app-container">
      {/* Toast Alert stack */}
      <div className="toast-container">
        {toasts.map((t) => (
          <div key={t.id} className={`toast-message ${t.type}`}>
            {t.type === 'error' && (
              <span style={{ color: 'var(--color-emergency)', marginRight: 4 }}>⚠️</span>
            )}
            {t.type === 'success' && (
              <span style={{ color: 'var(--color-confirmed)', marginRight: 4 }}>✓</span>
            )}
            {t.text}
          </div>
        ))}
      </div>

      {/* Persistent Left Sidebar */}
      <aside className="app-sidebar">
        <div className="logo-container">
          <div className="logo-icon">C</div>
          <span className="logo-text">ClinicOS</span>
          <span className="logo-badge">AI</span>
        </div>

        <nav>
          <ul className="sidebar-menu">
            {[
              { id: 'Dashboard', icon: 'dashboard' },
              { id: 'Appointments', icon: 'appointments' },
              { id: 'Patients', icon: 'patients' },
              { id: 'AI Inbox', icon: 'inbox' },
              { id: 'Alerts & Escalations', icon: 'alerts', count: activeAlertsCount },
              { id: 'Analytics', icon: 'analytics' },
              { id: 'Settings', icon: 'settings' }
            ].map((menu) => (
              <li key={menu.id}>
                <button
                  onClick={() => {
                    setActivePage(menu.id);
                    if (menu.id === 'Patients') setGlobalSearch('');
                  }}
                  className={`menu-item ${activePage === menu.id ? 'active' : ''}`}
                >
                  {getIcon(menu.icon)}
                  <span style={{ flex: 1 }}>{menu.id}</span>
                  {menu.count > 0 && (
                    <span 
                      style={{
                        backgroundColor: 'var(--color-emergency)',
                        color: 'white',
                        fontSize: 10,
                        fontWeight: 700,
                        padding: '1px 6px',
                        borderRadius: 8
                      }}
                    >
                      {menu.count}
                    </span>
                  )}
                </button>
              </li>
            ))}
          </ul>

          <div className="sidebar-label">Future Expansion</div>
          <ul className="sidebar-menu">
            {[
              { id: 'Billing', icon: 'billing' },
              { id: 'Staff', icon: 'staff' },
              { id: 'AI Workforce', icon: 'ai-workforce' }
            ].map((menu) => (
              <li key={menu.id}>
                <div className="menu-item disabled">
                  {getIcon(menu.icon)}
                  <span>{menu.id}</span>
                </div>
              </li>
            ))}
          </ul>
        </nav>

        <div className="sidebar-footer">
          <div>ClinicOS v1.0.4</div>
          <div style={{ fontSize: '10px' }}>Delhi NCR Operational Hub</div>
        </div>
      </aside>

      {/* Main Content Area */}
      <div className="app-main-wrapper">
        <header className="app-navbar">
          <div className="navbar-left">
            <div className="search-box">
              {getIcon('search')}
              <input
                type="text"
                className="search-input"
                placeholder="Search patient name, phone or symptoms..."
                value={globalSearch}
                onChange={handleSearchChange}
              />
            </div>

            <div 
              className="clinic-selector"
              onClick={() => {
                const branches = ['Dr. Sharma\'s Clinic, Faridabad', 'ClinicOS Noida Sec 62', 'ClinicOS Gurgaon DLF Phase 3'];
                const currentIndex = branches.indexOf(selectedClinic);
                const nextBranch = branches[(currentIndex + 1) % branches.length];
                setSelectedClinic(nextBranch);
                triggerToast(`Switched operational center to: ${nextBranch}`, 'success');
              }}
            >
              <span>{selectedClinic}</span>
              {getIcon('chevron')}
            </div>
          </div>

          <div className="navbar-right">
            <div className="ai-status-indicator">
              <span className="status-dot"></span>
              <span>ClinicOS AI Active</span>
            </div>

            <button 
              className="notifications-btn"
              onClick={() => {
                setActivePage('Alerts & Escalations');
                triggerToast(`Opened Triage Board containing ${activeAlertsCount} critical notifications.`, 'info');
              }}
            >
              <svg width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9M13.73 21a2 2 0 0 1-3.46 0"/></svg>
              {activeAlertsCount > 0 && <span className="notification-badge"></span>}
            </button>

            <div 
              className="doctor-profile"
              onClick={() => setShowProfileMenu(!showProfileMenu)}
              style={{ position: 'relative' }}
            >
              <img 
                className="doctor-avatar" 
                src="https://images.unsplash.com/photo-1559839734-2b71ea197ec2?auto=format&fit=crop&q=80&w=200" 
                alt="Doctor Avatar" 
              />
              <div className="doctor-info">
                <span className="doctor-name">Dr. R. Sharma</span>
                <span className="doctor-role">General Medicine</span>
              </div>
              
              {showProfileMenu && (
                <div 
                  style={{
                    position: 'absolute',
                    top: '46px',
                    right: 0,
                    width: '180px',
                    backgroundColor: 'white',
                    borderRadius: '12px',
                    boxShadow: 'var(--shadow-hover)',
                    border: '1px solid var(--border-subtle)',
                    padding: '8px',
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '4px',
                    zIndex: 200
                  }}
                >
                  <button 
                    onClick={() => {
                      setActivePage('Settings');
                      setShowProfileMenu(false);
                    }}
                    style={{
                      padding: '8px 12px',
                      backgroundColor: 'transparent',
                      border: 'none',
                      textAlign: 'left',
                      fontSize: '13px',
                      cursor: 'pointer',
                      borderRadius: '8px',
                      width: '100%',
                      fontWeight: 500
                    }}
                    className="menu-item"
                  >
                    View Availability
                  </button>
                  <button 
                    onClick={() => {
                      triggerToast("Profile sync triggered.", "success");
                      setShowProfileMenu(false);
                    }}
                    style={{
                      padding: '8px 12px',
                      backgroundColor: 'transparent',
                      border: 'none',
                      textAlign: 'left',
                      fontSize: '13px',
                      cursor: 'pointer',
                      borderRadius: '8px',
                      width: '100%',
                      fontWeight: 500
                    }}
                    className="menu-item"
                  >
                    Logout Desk
                  </button>
                </div>
              )}
            </div>
          </div>
        </header>

        <main className="page-content">
          {renderPage()}
        </main>
      </div>
    </div>
  );
}
