import React from 'react';

export default function Patients({ 
  patients, 
  setPatients,
  selectedPatientId, 
  setSelectedPatientId, 
  globalSearch, 
  setGlobalSearch,
  triggerToast 
}) {
  // Search filter
  const filteredPatients = patients.filter(p => {
    const query = globalSearch.toLowerCase();
    return (
      p.name.toLowerCase().includes(query) ||
      p.phone.includes(query) ||
      p.symptoms.toLowerCase().includes(query) ||
      p.city.toLowerCase().includes(query)
    );
  });

  const activePatient = patients.find(p => p.id === selectedPatientId) || patients[0];

  const handleUpdateNotes = (patientId, newNotes) => {
    setPatients(prev => prev.map(p => {
      if (p.id === patientId) {
        return { ...p, aiNotes: newNotes };
      }
      return p;
    }));
    triggerToast("Clinical notes updated successfully.", "success");
  };

  return (
    <div>
      <div className="hero-area">
        <h1 className="hero-title">Patients Directory</h1>
        <div className="hero-subtext">Access electronic health dossiers, AI pre-consultation triages, and chat transcripts.</div>
      </div>

      <div className="patient-split-layout">
        {/* Left Side: Searchable Patient List */}
        <div className="patient-list-sidebar">
          <div className="patient-search">
            <svg fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.3-4.3"/></svg>
            <input 
              type="text" 
              className="patient-search-input" 
              placeholder="Search by name or symptom..." 
              value={globalSearch}
              onChange={(e) => setGlobalSearch(e.target.value)}
            />
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            {filteredPatients.length > 0 ? (
              filteredPatients.map(p => (
                <div 
                  key={p.id}
                  className={`patient-list-item ${selectedPatientId === p.id ? 'active' : ''}`}
                  onClick={() => setSelectedPatientId(p.id)}
                >
                  <div className="patient-item-info">
                    <span className="patient-item-name">{p.name}</span>
                    <span className="patient-item-details">{p.age} y/o • {p.gender} • {p.city}</span>
                  </div>
                  <span className={`risk-badge ${p.riskCategory.toLowerCase()}`} style={{ fontSize: '9px' }}>
                    {p.riskCategory}
                  </span>
                </div>
              ))
            ) : (
              <div style={{ textAlign: 'center', padding: '24px 12px', color: 'var(--text-muted)', fontSize: '13px' }}>
                No patients found matching query.
              </div>
            )}
          </div>
        </div>

        {/* Right Side: Electronic Health Dossier / Profile System */}
        {activePatient ? (
          <div className="patient-details-panel">
            {/* Profile Header */}
            <div className="patient-profile-header">
              <div className="patient-header-left">
                <div 
                  className="patient-large-avatar"
                  style={{ backgroundColor: activePatient.avatarColor, color: activePatient.textColor }}
                >
                  {activePatient.name.split(' ').map(n => n[0]).join('')}
                </div>
                <div className="patient-core-info">
                  <h2 className="patient-profile-name">{activePatient.name}</h2>
                  <div className="patient-meta-row">
                    <span><strong>Age:</strong> {activePatient.age}</span>
                    <span>•</span>
                    <span><strong>Gender:</strong> {activePatient.gender}</span>
                    <span>•</span>
                    <span><strong>Phone:</strong> {activePatient.phone}</span>
                    <span>•</span>
                    <span><strong>Locality:</strong> {activePatient.city}</span>
                  </div>
                </div>
              </div>

              {/* Status Triage */}
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: '4px' }}>
                <span className={`status-badge ${activePatient.appointments[0]?.status || 'pending'}`}>
                  Desk Status: {activePatient.status}
                </span>
                <span style={{ fontSize: '11px', color: 'var(--text-muted)' }}>
                  Confidence Score: {(activePatient.aiConfidence * 100).toFixed(0)}%
                </span>
              </div>
            </div>

            {/* Profile KPI Cards */}
            <div className="patient-summary-grid">
              <div className="patient-summary-card">
                <div className="summary-card-title">Pre-Consultation Symptoms</div>
                <div className="summary-card-value" style={{ fontWeight: 600, color: 'var(--text-primary)' }}>
                  {activePatient.symptoms}
                </div>
              </div>

              <div className="patient-summary-card">
                <div className="summary-card-title">Triage Risk Factor</div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginTop: '6px' }}>
                  <div style={{ flex: 1, backgroundColor: 'var(--border-subtle)', height: '8px', borderRadius: '4px', overflow: 'hidden' }}>
                    <div style={{ 
                      width: `${activePatient.riskScore}%`, 
                      backgroundColor: activePatient.riskScore > 75 ? 'var(--color-emergency)' : activePatient.riskScore > 40 ? 'var(--color-pending)' : 'var(--color-confirmed)',
                      height: '100%'
                    }}></div>
                  </div>
                  <span style={{ fontSize: '14px', fontWeight: 700, color: activePatient.textColor }}>
                    {activePatient.riskScore}%
                  </span>
                </div>
              </div>
            </div>

            {/* AI Generated Notes Section */}
            <div className="clinical-notes-section">
              <h3 className="clinical-notes-title">
                <svg width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24"><path d="M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/></svg>
                AI Workforce pre-consultation report
              </h3>
              <textarea 
                className="clinical-notes-content"
                style={{
                  width: '100%',
                  border: 'none',
                  background: 'transparent',
                  resize: 'vertical',
                  minHeight: '80px',
                  fontFamily: 'var(--font-sans)',
                  color: 'var(--text-secondary)',
                  outline: 'none'
                }}
                value={activePatient.aiNotes}
                onChange={(e) => handleUpdateNotes(activePatient.id, e.target.value)}
              />
              <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: 10 }}>
                <span style={{ fontSize: 11, color: 'var(--color-ai)', fontWeight: 600 }}>
                  ✏️ Auto-saves details immediately
                </span>
              </div>
            </div>

            {/* Bottom Split Layout: Visit Timeline & Chat transcripts */}
            <div className="patient-sections-grid">
              
              {/* Left Column: Appointments & Diagnoses Timeline */}
              <div>
                <h4 className="triage-section-title">Clinical History & Visites</h4>
                <div className="profile-timeline">
                  {activePatient.previousVisits.length > 0 ? (
                    activePatient.previousVisits.map((visit, idx) => (
                      <div key={idx} className="timeline-visit-card">
                        <div className="timeline-visit-date">{visit.date}</div>
                        <div className="timeline-visit-desc">{visit.diagnosis}</div>
                        <div className="timeline-visit-doc">Seen by {visit.doctor}</div>
                      </div>
                    ))
                  ) : (
                    <div style={{ color: 'var(--text-muted)', fontSize: '13px' }}>
                      No prior physical visit logs in ClinicOS database.
                    </div>
                  )}

                  {/* Future EHR Placeholder */}
                  <div style={{ 
                    border: '1px dashed var(--border-subtle)',
                    borderRadius: '12px',
                    padding: '16px',
                    backgroundColor: '#fafbfc',
                    textAlign: 'center',
                    marginTop: '20px'
                  }}>
                    <span style={{ fontSize: '11px', textTransform: 'uppercase', color: 'var(--text-muted)', fontWeight: 700, letterSpacing: 0.5 }}>
                      EHR Integrations Placeholder
                    </span>
                    <p style={{ fontSize: '11.5px', color: 'var(--text-muted)', marginTop: '4px' }}>
                      Future medical record synchronization (HL7 / FHIR protocol) will link clinical logs here.
                    </p>
                  </div>
                </div>
              </div>

              {/* Right Column: Pre-consultation WhatsApp Transcripts */}
              <div>
                <h4 className="triage-section-title">AI Receptionist Chat Logs</h4>
                <div 
                  style={{ 
                    backgroundColor: '#f8fafc',
                    borderRadius: '16px',
                    padding: '16px',
                    border: '1px solid var(--border-subtle)',
                    maxHeight: '340px',
                    overflowY: 'auto',
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '12px'
                  }}
                >
                  {activePatient.conversations.map((msg, idx) => (
                    <div 
                      key={idx} 
                      style={{
                        padding: '10px 14px',
                        borderRadius: '12px',
                        fontSize: '12.5px',
                        maxWidth: '85%',
                        lineHeight: 1.4,
                        alignSelf: msg.sender === 'ai' ? 'flex-end' : 'flex-start',
                        backgroundColor: msg.sender === 'ai' ? 'var(--color-ai-light)' : 'white',
                        border: msg.sender === 'ai' ? '1px solid rgba(37, 99, 235, 0.08)' : '1px solid var(--border-subtle)',
                        color: 'var(--text-primary)'
                      }}
                    >
                      <div style={{ fontSize: '9px', fontWeight: 700, color: msg.sender === 'ai' ? 'var(--color-ai)' : 'var(--text-secondary)', marginBottom: '4px', textTransform: 'uppercase' }}>
                        {msg.sender === 'ai' ? 'ClinicOS AI' : activePatient.name}
                      </div>
                      <div>{msg.text}</div>
                      {msg.time && (
                        <div style={{ fontSize: '8px', color: 'var(--text-muted)', marginTop: '4px', textAlign: 'right' }}>
                          {msg.time}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>

            </div>
          </div>
        ) : (
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '300px', backgroundColor: 'white', borderRadius: '22px', border: '1px solid var(--border-subtle)' }}>
            <span style={{ color: 'var(--text-muted)' }}>Select a patient from the list to view report logs.</span>
          </div>
        )}
      </div>
    </div>
  );
}
