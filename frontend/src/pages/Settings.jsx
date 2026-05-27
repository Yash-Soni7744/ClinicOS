import React, { useState } from 'react';

export default function Settings({ settings, setSettings, triggerToast }) {
  const [threshold, setThreshold] = useState(settings.aiConfidenceThreshold);
  const [keywords, setKeywords] = useState(settings.emergencyKeywords);
  const [startHour, setStartHour] = useState(settings.clinicHours.start);
  const [endHour, setEndHour] = useState(settings.clinicHours.end);
  const [drSharmaHours, setDrSharmaHours] = useState(settings.availability.drSharma);
  
  // Integration statuses
  const [integrations, setIntegrations] = useState(settings.integrations);

  const handleToggleIntegration = (key, name) => {
    const nextStatus = integrations[key] === 'Connected' ? 'Disconnected' : 'Connected';
    setIntegrations(prev => ({ ...prev, [key]: nextStatus }));
    
    if (nextStatus === 'Connected') {
      triggerToast(`${name} integration connected successfully.`, 'success');
    } else {
      triggerToast(`${name} integration disconnected.`, 'error');
    }
  };

  const handleSaveSettings = (e) => {
    e.preventDefault();
    setSettings({
      clinicHours: { start: startHour, end: endHour, days: "Monday - Saturday" },
      availability: {
        drSharma: drSharmaHours,
        drVerma: settings.availability.drVerma
      },
      aiConfidenceThreshold: threshold,
      emergencyKeywords: keywords,
      integrations
    });
    triggerToast("Clinic configurations saved successfully.", "success");
  };

  return (
    <div>
      <div className="hero-area">
        <h1 className="hero-title">System Settings</h1>
        <div className="hero-subtext">Calibrate AI automation boundaries, dispatch keywords, operational schedules, and cloud channels.</div>
      </div>

      <form onSubmit={handleSaveSettings}>
        <div className="settings-grid">
          
          {/* Column 1: AI Workforce Controls */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '32px' }}>
            
            {/* AI Autopilot Threshold */}
            <div className="settings-card">
              <h3 className="panel-title" style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                🤖 AI Autopilot Triage
              </h3>
              <p style={{ fontSize: '13px', color: 'var(--text-secondary)' }}>
                Set the confidence threshold. Below this score, the Receptionist Agent creates an escalation flag for manual desk approval.
              </p>

              <div style={{ marginTop: '8px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '13.5px', fontWeight: 600, marginBottom: '6px' }}>
                  <span>Confidence Threshold</span>
                  <span style={{ color: 'var(--color-ai)', fontWeight: 700 }}>{(threshold * 100).toFixed(0)}%</span>
                </div>
                <div className="range-slider-container">
                  <input 
                    type="range" 
                    min="0.50" 
                    max="0.99" 
                    step="0.01" 
                    className="range-slider" 
                    value={threshold}
                    onChange={(e) => setThreshold(parseFloat(e.target.value))}
                  />
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '11px', color: 'var(--text-muted)', marginTop: '6px' }}>
                  <span>High Autopilot (50%)</span>
                  <span>Strict Safety (99%)</span>
                </div>
              </div>
            </div>

            {/* Keyword Escalation Rules */}
            <div className="settings-card">
              <h3 className="panel-title" style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                🚨 Urgent Keyword Routing
              </h3>
              <p style={{ fontSize: '13px', color: 'var(--text-secondary)' }}>
                If patient WhatsApp messages contain any of these keywords, the AI Receptionist instantly triggers an Emergency Escalation and sounds alerts.
              </p>

              <div className="form-group" style={{ marginTop: '8px' }}>
                <label className="form-label">Critical Keywords (comma separated)</label>
                <textarea
                  className="form-input"
                  style={{ minHeight: '80px', resize: 'vertical', fontFamily: 'var(--font-sans)', fontSize: '13px', lineHeight: 1.4 }}
                  value={keywords}
                  onChange={(e) => setKeywords(e.target.value)}
                  placeholder="e.g. chest pain, unconscious, breathing, bleeding"
                />
              </div>
            </div>

            {/* Save Buttons */}
            <div style={{ display: 'flex', gap: '16px' }}>
              <button 
                type="submit" 
                className="alert-btn primary"
                style={{ padding: '12px 28px', fontSize: '14px', borderRadius: '12px' }}
              >
                Save Configurations
              </button>
              <button 
                type="button" 
                className="alert-btn secondary"
                style={{ padding: '12px 20px', fontSize: '14px', borderRadius: '12px' }}
                onClick={() => {
                  setThreshold(settings.aiConfidenceThreshold);
                  setKeywords(settings.emergencyKeywords);
                  triggerToast("Reverted settings changes.", "info");
                }}
              >
                Reset Defaults
              </button>
            </div>

          </div>

          {/* Column 2: Clinic Schedule & Cloud integrations */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '32px' }}>
            
            {/* Clinical Operating Hours */}
            <div className="settings-card">
              <h3 className="panel-title" style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                📅 OPD Timings & Schedules
              </h3>
              
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginTop: '8px' }}>
                <div className="form-group">
                  <label className="form-label">OPD Start Hour</label>
                  <input 
                    type="text" 
                    className="form-input" 
                    value={startHour} 
                    onChange={(e) => setStartHour(e.target.value)} 
                  />
                </div>
                <div className="form-group">
                  <label className="form-label">OPD Close Hour</label>
                  <input 
                    type="text" 
                    className="form-input" 
                    value={endHour} 
                    onChange={(e) => setEndHour(e.target.value)} 
                  />
                </div>
              </div>

              <div className="form-group">
                <label className="form-label">Dr. Sharma OPD Availability</label>
                <input 
                  type="text" 
                  className="form-input" 
                  value={drSharmaHours} 
                  onChange={(e) => setDrSharmaHours(e.target.value)} 
                />
              </div>
            </div>

            {/* Cloud Integrations Status */}
            <div className="settings-card">
              <h3 className="panel-title" style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                🔗 Integrations Gateway
              </h3>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '4px', marginTop: '8px' }}>
                {[
                  { key: 'whatsapp', name: 'WhatsApp Business API', desc: 'Allows AI reception to chat with patients.' },
                  { key: 'googleCalendar', name: 'Google Calendar API', desc: 'Synchronizes clinic schedules automatically.' },
                  { key: 'twilio', name: 'Twilio VoIP Gateway', desc: 'Synthesizes voice-call triage responses.' },
                  { key: 'openai', name: 'Anthropic / OpenAI API', desc: 'Decides patient intent & Hinglish triages.' }
                ].map((item) => (
                  <div key={item.key} className="settings-row" style={{ padding: '10px 0' }}>
                    <div className="settings-meta">
                      <span className="settings-title-item">{item.name}</span>
                      <span className="settings-desc-item" style={{ maxWidth: '280px' }}>{item.desc}</span>
                    </div>

                    <button
                      type="button"
                      className={`integration-badge`}
                      style={{
                        cursor: 'pointer',
                        backgroundColor: integrations[item.key] === 'Connected' ? 'var(--color-confirmed-light)' : '#f1f5f9',
                        color: integrations[item.key] === 'Connected' ? 'var(--color-confirmed)' : 'var(--text-secondary)',
                        borderColor: integrations[item.key] === 'Connected' ? 'rgba(16, 185, 129, 0.2)' : 'var(--border-subtle)'
                      }}
                      onClick={() => handleToggleIntegration(item.key, item.name)}
                    >
                      {integrations[item.key] === 'Connected' ? '● Connected' : '○ Disconnected'}
                    </button>
                  </div>
                ))}
              </div>
            </div>

          </div>

        </div>
      </form>
    </div>
  );
}
