import React from 'react';

export default function Dashboard({ 
  patients, 
  alerts, 
  setAlerts,
  feedEvents, 
  setActivePage, 
  setSelectedPatientId,
  triggerToast 
}) {
  // Aggregate KPIs from mock data
  const totalToday = patients.filter(p => p.appointments.some(a => a.date === '2026-05-27')).length;
  const pendingCount = patients.filter(p => p.status === 'Pending Confirmation' || p.status === 'Pending Triage').length;
  const highRiskCount = patients.filter(p => p.riskCategory === 'Critical' || p.riskCategory === 'High').length;
  const activeEscalations = alerts.filter(a => !a.resolved && a.severity === 'Critical').length;

  const kpiData = [
    { label: "Today's Appointments", value: totalToday, trend: "+12%", trendDir: "positive", color: "#eff6ff", textCol: "var(--color-ai)", icon: "appointment" },
    { label: "Pending Confirmations", value: pendingCount, trend: "4 active", trendDir: "neutral", color: "var(--color-pending-light)", textCol: "var(--color-pending)", icon: "pending" },
    { label: "Cancelled Today", value: 1, trend: "-50%", trendDir: "positive", color: "#f1f5f9", textCol: "var(--text-secondary)", icon: "cancelled" },
    { label: "High Risk Cases", value: highRiskCount, trend: "Requires review", trendDir: "negative", color: "var(--color-emergency-light)", textCol: "var(--color-emergency)", icon: "warning" },
    { label: "AI Conversations Today", value: 52, trend: "+18%", trendDir: "positive", color: "#eff6ff", textCol: "var(--color-ai)", icon: "chat" },
    { label: "Recovered Leads", value: 4, trend: "Saved ₹12k", trendDir: "positive", color: "var(--color-confirmed-light)", textCol: "var(--color-confirmed)", icon: "recovered" },
    { label: "No-show Risk", value: "8.4%", trend: "Down 4%", trendDir: "positive", color: "var(--color-confirmed-light)", textCol: "var(--color-confirmed)", icon: "risk" },
    { label: "Escalations Raised", value: activeEscalations, trend: "Action required", trendDir: "negative", color: "var(--color-emergency-light)", textCol: "var(--color-emergency)", icon: "escalation" }
  ];

  // Helper to render inline SVGs for KPI cards
  const getKpiIcon = (name, color) => {
    const style = { width: 18, height: 18, color };
    switch(name) {
      case 'appointment':
        return <svg fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24" style={style}><path d="M19 4H5c-1.11 0-2 .9-2 2v14c0 1.1.89 2 2 2h14c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2ZM16 2v4M8 2v4M3 10h18"/></svg>;
      case 'pending':
        return <svg fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24" style={style}><circle cx="12" cy="12" r="10"/><path d="M12 6v6l4 2"/></svg>;
      case 'cancelled':
        return <svg fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24" style={style}><circle cx="12" cy="12" r="10"/><path d="m15 9-6 6M9 9l6 6"/></svg>;
      case 'warning':
        return <svg fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24" style={style}><path d="m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3Z"/><line x1="12" x2="12" y1="9" y2="13"/><line x1="12" x2="12.01" y1="17" y2="17"/></svg>;
      case 'chat':
        return <svg fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24" style={style}><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/></svg>;
      case 'recovered':
        return <svg fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24" style={style}><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><path d="M22 4 12 14.01l-3-3"/></svg>;
      case 'risk':
        return <svg fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24" style={style}><path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9M13.73 21a2 2 0 0 1-3.46 0"/></svg>;
      case 'escalation':
        return <svg fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24" style={style}><path d="M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/></svg>;
      default:
        return null;
    }
  };

  // Get active alerts (excluding resolved)
  const activeAlerts = alerts.filter(a => !a.resolved);

  const handleResolveAlert = (alertId, patientName) => {
    setAlerts(prev => prev.map(a => a.id === alertId ? { ...a, resolved: true } : a));
    triggerToast(`Escalation alert for ${patientName} resolved successfully.`, 'success');
  };

  const handleSelectPatient = (patientId) => {
    setSelectedPatientId(patientId);
    setActivePage('Patients');
  };

  // Today's schedule filtering
  const todaySchedule = patients
    .filter(p => p.appointments.some(a => a.date === '2026-05-27'))
    .map(p => {
      const app = p.appointments.find(a => a.date === '2026-05-27');
      return {
        id: p.id,
        name: p.name,
        time: app.time,
        status: app.status,
        symptoms: p.symptoms,
        risk: app.risk
      };
    })
    .sort((a, b) => {
      // Simple sorting by time: "11:00 AM" vs "12:00 PM"
      return a.time.localeCompare(b.time);
    });

  return (
    <div>
      {/* Hero Area */}
      <div className="hero-area">
        <h1 className="hero-title">Good Morning, Dr. Sharma</h1>
        <div className="hero-subtext">
          ClinicOS is active. Managed <span className="text-highlight-ai">52 patient interactions</span> across Faridabad desk today.
        </div>
      </div>

      {/* KPI Cards Grid */}
      <div className="grid-kpi">
        {kpiData.map((kpi, idx) => (
          <div key={idx} className="kpi-card" onClick={() => {
            if (kpi.label.includes('Appointments')) setActivePage('Appointments');
            else if (kpi.label.includes('Alerts') || kpi.label.includes('High Risk')) setActivePage('Alerts & Escalations');
            else if (kpi.label.includes('Conversations')) setActivePage('AI Inbox');
            else setActivePage('Analytics');
          }}>
            <div className="kpi-card-header">
              <span className="kpi-label">{kpi.label}</span>
              <div className="kpi-icon-wrapper" style={{ backgroundColor: kpi.color }}>
                {getKpiIcon(kpi.icon, kpi.textCol)}
              </div>
            </div>
            <div>
              <div className="kpi-value">
                {kpi.value}
                <span className={`kpi-trend ${kpi.trendDir}`}>
                  {kpi.trend}
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Bottom Layout Split: Live Logs & Timeline Schedule */}
      <div className="grid-sections">
        {/* Left Side: Live Activity Feed + Today's Schedule */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '32px' }}>
          
          {/* Today's Schedule */}
          <div className="dashboard-panel">
            <div className="panel-header">
              <h2 className="panel-title">Today's Schedule</h2>
              <button className="panel-action-btn" onClick={() => setActivePage('Appointments')}>
                View Calendar
              </button>
            </div>
            
            <div className="timeline-list">
              {todaySchedule.length > 0 ? (
                todaySchedule.map((item) => (
                  <div 
                    key={item.id} 
                    className="timeline-item"
                    onClick={() => handleSelectPatient(item.id)}
                    style={{ cursor: 'pointer' }}
                  >
                    <div className="timeline-time">{item.time}</div>
                    <div className="timeline-details">
                      <div>
                        <div className="timeline-patient">{item.name}</div>
                        <div className="timeline-symptoms" title={item.symptoms}>{item.symptoms}</div>
                      </div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                        <span className={`risk-badge ${item.risk.toLowerCase()}`}>
                          {item.risk} Risk
                        </span>
                        <span className={`status-badge ${item.status}`}>
                          {item.status}
                        </span>
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                <div style={{ textAlign: 'center', padding: '32px', color: 'var(--text-muted)' }}>
                  No appointments scheduled for today.
                </div>
              )}
            </div>
          </div>

          {/* Live AI Activity Feed */}
          <div className="dashboard-panel">
            <div className="panel-header">
              <h2 className="panel-title">Live AI Activity Feed</h2>
              <span style={{ fontSize: '12px', color: 'var(--color-ai)', fontWeight: '600', display: 'flex', alignItems: 'center', gap: '4px' }}>
                <span className="status-dot"></span> Listening...
              </span>
            </div>
            
            <div className="activity-feed-list">
              {feedEvents.map((evt, idx) => (
                <div key={idx} className="activity-feed-item">
                  <span className={`feed-dot ${evt.type}`}></span>
                  <span className="feed-time">{evt.time}</span>
                  <p className="feed-text">{evt.text}</p>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right Side: AI Alerts Panel (High priority action cases) */}
        <div className="dashboard-panel" style={{ height: 'fit-content' }}>
          <div className="panel-header">
            <h2 className="panel-title">AI Alerts Panel</h2>
            <span style={{ 
              backgroundColor: 'var(--color-emergency-light)',
              color: 'var(--color-emergency)',
              fontSize: '11px',
              fontWeight: 700,
              padding: '2px 8px',
              borderRadius: '6px'
            }}>
              {activeAlerts.length} Action Pending
            </span>
          </div>

          <div className="alerts-panel">
            {activeAlerts.length > 0 ? (
              activeAlerts.map((alert) => (
                <div key={alert.id} className={`alert-card ${alert.severity.toLowerCase()}`}>
                  <div className="alert-card-header">
                    <span className="alert-type">{alert.severity} Risk: {alert.type}</span>
                    <span className="alert-time">{alert.time}</span>
                  </div>
                  <div className="alert-patient">Patient: {alert.patientName}</div>
                  <p className="alert-details">{alert.details}</p>
                  
                  <div className="alert-actions">
                    <button 
                      className="alert-btn secondary"
                      onClick={() => handleSelectPatient(alert.patientId)}
                    >
                      View Chat
                    </button>
                    <button 
                      className="alert-btn primary"
                      onClick={() => handleResolveAlert(alert.id, alert.patientName)}
                    >
                      Acknowledge
                    </button>
                  </div>
                </div>
              ))
            ) : (
              <div style={{ textAlign: 'center', padding: '40px 20px', color: 'var(--text-muted)' }}>
                🎉 All alerts are cleared. Clinic operations are running smoothly in autopilot.
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
