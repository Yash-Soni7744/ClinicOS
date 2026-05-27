import React from 'react';

export default function AlertsEscalations({ 
  alerts, 
  setAlerts, 
  setSelectedPatientId, 
  setActivePage,
  triggerToast 
}) {
  
  // Categorize alerts
  const emergencyAlerts = alerts.filter(a => !a.resolved && (a.severity === 'Critical' || a.severity === 'High'));
  const lowConfidenceAlerts = alerts.filter(a => !a.resolved && a.type.includes('Low-Confidence'));
  const bookingConflicts = alerts.filter(a => !a.resolved && a.type.includes('Collision'));
  const unresolvedAlerts = alerts.filter(a => !a.resolved && !a.type.includes('Low-Confidence') && !a.type.includes('Collision') && a.severity !== 'Critical' && a.severity !== 'High');
  const resolvedAlerts = alerts.filter(a => a.resolved);

  const handleResolveAlert = (id, patientName) => {
    setAlerts(prev => prev.map(a => a.id === id ? { ...a, resolved: true } : a));
    triggerToast(`Alert for ${patientName} resolved successfully.`, 'success');
  };

  const handleOpenPatient = (patientId) => {
    setSelectedPatientId(patientId);
    setActivePage('Patients');
  };

  // Helper to render single alert cards
  const renderAlertCard = (alert) => (
    <div key={alert.id} className={`alert-card ${alert.severity.toLowerCase()}`}>
      <div className="alert-card-header">
        <span className={`severity-tag ${alert.severity.toLowerCase()}`}>
          {alert.severity} • {alert.type}
        </span>
        <span className="alert-time">{alert.time}</span>
      </div>
      <div className="alert-patient" style={{ fontSize: '15px', marginTop: '6px' }}>
        {alert.patientName}
      </div>
      <p className="alert-details" style={{ margin: '8px 0 16px', fontSize: '13px' }}>
        {alert.details}
      </p>
      <div className="alert-actions">
        <button 
          className="alert-btn secondary"
          onClick={() => handleOpenPatient(alert.patientId)}
        >
          View Medical File
        </button>
        <button 
          className="alert-btn primary"
          onClick={() => handleResolveAlert(alert.id, alert.patientName)}
        >
          Acknowledge & Clear
        </button>
      </div>
    </div>
  );

  return (
    <div>
      <div className="hero-area">
        <h1 className="hero-title">Alerts & Escalations</h1>
        <div className="hero-subtext">Operating center triage board. Oversee critical health alerts, booking conflicts, and AI system exceptions.</div>
      </div>

      <div className="triage-grid">
        
        {/* Column 1: Emergency & High Priority Triage */}
        <div>
          <h4 className="triage-section-title" style={{ color: 'var(--color-emergency)' }}>
            🚨 Emergency Alerts ({emergencyAlerts.length})
          </h4>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            {emergencyAlerts.length > 0 ? (
              emergencyAlerts.map(renderAlertCard)
            ) : (
              <div style={{ 
                border: '1px dashed var(--border-subtle)', 
                borderRadius: '16px', 
                padding: '32px 16px', 
                textAlign: 'center', 
                color: 'var(--text-muted)',
                backgroundColor: 'white'
              }}>
                ✅ No critical emergencies active.
              </div>
            )}
          </div>
        </div>

        {/* Column 2: Booking Conflicts & Low-Confidence Exceptions */}
        <div>
          <h4 className="triage-section-title" style={{ color: 'var(--color-pending)' }}>
            ⚠️ System Warnings ({lowConfidenceAlerts.length + bookingConflicts.length})
          </h4>
          
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            {/* Low confidence bookings */}
            {lowConfidenceAlerts.length > 0 && (
              <div>
                <div style={{ fontSize: '11px', fontWeight: 700, textTransform: 'uppercase', color: 'var(--text-muted)', marginBottom: '8px', letterSpacing: '0.5px' }}>
                  Low-Confidence Inferences
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                  {lowConfidenceAlerts.map(renderAlertCard)}
                </div>
              </div>
            )}

            {/* Schedule collisions */}
            {bookingConflicts.length > 0 && (
              <div style={{ marginTop: '8px' }}>
                <div style={{ fontSize: '11px', fontWeight: 700, textTransform: 'uppercase', color: 'var(--text-muted)', marginBottom: '8px', letterSpacing: '0.5px' }}>
                  Calendar Booking Conflicts
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                  {bookingConflicts.map(renderAlertCard)}
                </div>
              </div>
            )}

            {lowConfidenceAlerts.length === 0 && bookingConflicts.length === 0 && (
              <div style={{ 
                border: '1px dashed var(--border-subtle)', 
                borderRadius: '16px', 
                padding: '32px 16px', 
                textAlign: 'center', 
                color: 'var(--text-muted)',
                backgroundColor: 'white'
              }}>
                ✅ No scheduling conflicts detected.
              </div>
            )}
          </div>
        </div>

        {/* Column 3: General Unresolved Cases & Archive */}
        <div>
          <h4 className="triage-section-title" style={{ color: 'var(--text-secondary)' }}>
            📂 Operational Log Queue
          </h4>
          
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            {/* Unresolved general alerts */}
            {unresolvedAlerts.length > 0 && (
              <div>
                <div style={{ fontSize: '11px', fontWeight: 700, textTransform: 'uppercase', color: 'var(--text-muted)', marginBottom: '8px', letterSpacing: '0.5px' }}>
                  Pending Follow-Ups
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                  {unresolvedAlerts.map(renderAlertCard)}
                </div>
              </div>
            )}

            {/* Resolved Archive */}
            <div>
              <div style={{ fontSize: '11px', fontWeight: 700, textTransform: 'uppercase', color: 'var(--text-muted)', marginBottom: '8px', letterSpacing: '0.5px' }}>
                Resolved Archive ({resolvedAlerts.length})
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                {resolvedAlerts.length > 0 ? (
                  resolvedAlerts.map(alert => (
                    <div 
                      key={alert.id} 
                      className="alert-card resolved"
                      style={{ padding: '12px 16px' }}
                    >
                      <div className="alert-card-header">
                        <span style={{ fontSize: '10px', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase' }}>
                          Resolved • {alert.type}
                        </span>
                      </div>
                      <div style={{ fontSize: '13px', fontWeight: 600, marginTop: '4px' }}>
                        Patient: {alert.patientName}
                      </div>
                    </div>
                  ))
                ) : (
                  <div style={{ fontSize: '12px', color: 'var(--text-muted)', padding: '12px', textAlign: 'center' }}>
                    Archive is empty.
                  </div>
                )}
              </div>
            </div>

          </div>
        </div>

      </div>
    </div>
  );
}
