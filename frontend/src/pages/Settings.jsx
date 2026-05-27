import React, { useState } from 'react';
import n8nWorkflows from '../all_workflows.json';

export default function Settings({ 
  settings, 
  setSettings, 
  triggerToast,
  n8nEnabled,
  setN8nEnabled,
  n8nUrl,
  setN8nUrl,
  n8nWebhookMode,
  setN8nWebhookMode
}) {
  const [threshold, setThreshold] = useState(settings.aiConfidenceThreshold);
  const [keywords, setKeywords] = useState(settings.emergencyKeywords);
  const [startHour, setStartHour] = useState(settings.clinicHours.start);
  const [endHour, setEndHour] = useState(settings.clinicHours.end);
  const [drSharmaHours, setDrSharmaHours] = useState(settings.availability.drSharma);
  
  // Local state for checking connection
  const [isTestingConn, setIsTestingConn] = useState(false);

  // Filter out archived workflows to match the active project dashboard (5 workflows)
  const activeWorkflows = n8nWorkflows ? n8nWorkflows.filter(w => !w.isArchived) : [];

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

  const handleTestConnection = async () => {
    setIsTestingConn(true);
    triggerToast("Pinging local n8n webhook...", "info");
    
    try {
      // Hit the patient-reply webhook trigger with a test pre-flight ping
      const webhookPath = `${n8nUrl}/${n8nWebhookMode === 'test' ? 'webhook-test' : 'webhook'}/patient-reply`;
      const res = await fetch(webhookPath, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          body: {
            From: "whatsapp:+91000000000",
            Body: "ping-test"
          }
        })
      });

      if (res.status === 200 || res.status === 201) {
        triggerToast("✓ n8n connection verified successfully!", "success");
      } else {
        triggerToast(`n8n responded with status ${res.status}. Bridge is active.`, "success");
      }
    } catch (e) {
      console.error(e);
      triggerToast("⚠️ Connection failed. Ensure n8n is running locally and CORS is configured.", "error");
    } finally {
      setIsTestingConn(false);
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

        {/* n8n Webhook Bridge & Active Workflows Board */}
        <div style={{ marginTop: '40px', display: 'flex', flexDirection: 'column', gap: '32px' }}>
          
          <div className="settings-card" style={{ maxWidth: '100%' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '16px' }}>
              <div>
                <h3 className="panel-title" style={{ display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--color-ai)' }}>
                  🔌 n8n Webhook Automation Bridge
                </h3>
                <p style={{ fontSize: '13px', color: 'var(--text-secondary)', marginTop: '4px', maxWidth: '750px' }}>
                  Establish a local link to your running n8n engine. This forwards patient WhatsApp simulation events directly to your local workspace, activating Google Calendar checkups and LLM analysis in real time.
                </p>
              </div>

              {/* Toggle switch */}
              <div className="takeover-control" style={{ border: 'none', backgroundColor: 'var(--color-ai-light)', color: 'var(--color-ai)' }}>
                <span>n8n Pipeline Connection</span>
                <label className="switch">
                  <input 
                    type="checkbox" 
                    checked={n8nEnabled} 
                    onChange={() => {
                      setN8nEnabled(!n8nEnabled);
                      triggerToast(n8nEnabled ? "n8n automation bridge paused." : "n8n automation bridge active.", n8nEnabled ? "error" : "success");
                    }}
                  />
                  <span className="slider" style={{ backgroundColor: '#93c5fd' }}></span>
                </label>
              </div>
            </div>

            {n8nEnabled && (
              <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 1fr', gap: '32px', borderTop: '1px solid var(--border-subtle)', paddingTop: '20px', marginTop: '10px' }}>
                {/* Bridge Inputs */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                  <div className="form-group">
                    <label className="form-label">n8n Host Instance URL</label>
                    <input 
                      type="text" 
                      className="form-input" 
                      placeholder="e.g. http://localhost:5678" 
                      value={n8nUrl}
                      onChange={(e) => setN8nUrl(e.target.value)}
                    />
                  </div>

                  <div className="form-group">
                    <label className="form-label">n8n Webhook Execution Target</label>
                    <select 
                      className="form-select"
                      value={n8nWebhookMode}
                      onChange={(e) => {
                        setN8nWebhookMode(e.target.value);
                        triggerToast(`Switched webhook environment to ${e.target.value === 'test' ? 'Test Canvas (webhook-test)' : 'Production (webhook)'}`, 'info');
                      }}
                    >
                      <option value="test">Test Mode (webhook-test) — For running active canvas tests</option>
                      <option value="production">Production Mode (webhook) — Runs only if workflow is set to Active</option>
                    </select>
                  </div>

                  <div style={{ display: 'flex', gap: '12px', marginTop: '8px' }}>
                    <button
                      type="button"
                      className="alert-btn primary"
                      style={{ backgroundColor: 'var(--color-ai)' }}
                      onClick={handleTestConnection}
                      disabled={isTestingConn}
                    >
                      {isTestingConn ? "Pinging..." : "Test n8n Connection"}
                    </button>
                  </div>

                  {/* CORS Troubleshooting instructions */}
                  <div style={{ 
                    marginTop: '12px',
                    padding: '16px',
                    backgroundColor: '#fafbfc',
                    borderRadius: '12px',
                    border: '1px solid var(--border-subtle)',
                    fontSize: '12.5px',
                    lineHeight: 1.5
                  }}>
                    <strong style={{ color: 'var(--color-emergency)', display: 'block', marginBottom: '4px' }}>⚠️ Local CORS Troubleshooting</strong>
                    If testing the connection triggers a browser block, make sure to execute your local n8n command with CORS enabled or set n8n environment variables:
                    <code style={{ 
                      display: 'block', 
                      backgroundColor: '#f1f5f9', 
                      padding: '8px', 
                      borderRadius: '6px', 
                      marginTop: '8px', 
                      fontSize: '11px',
                      color: '#0f172a',
                      fontFamily: 'monospace'
                    }}>
                      $env:N8N_ENFORCE_SETTINGS_FILE_FOR_EVAL="true"<br />
                      npx n8n start --cors
                    </code>
                  </div>
                </div>

                {/* Workflows List */}
                <div>
                  <h4 className="form-label" style={{ marginBottom: '12px', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                    Active Workflows List ({activeWorkflows.length})
                  </h4>

                  <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                    {activeWorkflows.map((w) => (
                      <div 
                        key={w.id} 
                        style={{ 
                          padding: '12px 16px', 
                          borderRadius: '12px', 
                          border: '1px solid var(--border-subtle)',
                          backgroundColor: '#fafbfc',
                          display: 'flex',
                          justifyContent: 'space-between',
                          alignItems: 'center'
                        }}
                      >
                        <div>
                          <div style={{ fontSize: '13.5px', fontWeight: 600 }}>{w.name}</div>
                          <div style={{ fontSize: '11px', color: 'var(--text-muted)' }}>ID: {w.id} • {w.nodes.length} Nodes</div>
                        </div>

                        <span 
                          style={{
                            fontSize: '10px',
                            fontWeight: 700,
                            padding: '3px 8px',
                            borderRadius: '6px',
                            backgroundColor: w.active ? 'var(--color-confirmed-light)' : '#f1f5f9',
                            color: w.active ? 'var(--color-confirmed)' : 'var(--text-secondary)'
                          }}
                        >
                          {w.active ? '● Published' : '○ Inactive'}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </div>

        </div>

      </form>
    </div>
  );
}
