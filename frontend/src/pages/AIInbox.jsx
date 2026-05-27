import React, { useState, useRef, useEffect } from 'react';

export default function AIInbox({ patients, setPatients, selectedPatientId, setSelectedPatientId, triggerToast }) {
  const [manualMessage, setManualMessage] = useState('');
  const chatBottomRef = useRef(null);

  const activePatient = patients.find(p => p.id === selectedPatientId) || patients[0];

  // Auto scroll to bottom of chat when active patient or messages change
  useEffect(() => {
    if (chatBottomRef.current) {
      chatBottomRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [selectedPatientId, activePatient?.conversations?.length]);

  // Handle staff takeover toggle
  const handleTakeoverToggle = (patientId) => {
    setPatients(prev => prev.map(p => {
      if (p.id === patientId) {
        const isCurrentlyTakeover = p.status === 'Staff Takeover';
        const nextStatus = isCurrentlyTakeover ? 'Confirmed' : 'Staff Takeover';
        
        if (!isCurrentlyTakeover) {
          triggerToast(`Manual takeover active. AI Receptionist paused for ${p.name}.`, 'error');
        } else {
          triggerToast(`AI Receptionist resumed for ${p.name}. Autopilot active.`, 'success');
        }

        return {
          ...p,
          status: nextStatus,
          conversations: [
            ...p.conversations,
            { sender: 'system', text: isCurrentlyTakeover ? "Autopilot Resumed by Doctor Desk" : "Staff Takeover: AI automation paused", time: new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: true }) }
          ]
        };
      }
      return p;
    }));
  };

  // Send manual staff message
  const handleSendMessage = (e) => {
    e.preventDefault();
    if (!manualMessage.trim()) return;

    const now = new Date();
    const timeStr = now.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: true });

    setPatients(prev => prev.map(p => {
      if (p.id === activePatient.id) {
        return {
          ...p,
          // Force staff takeover if they manually message, for safety
          status: p.status !== 'Staff Takeover' ? 'Staff Takeover' : p.status,
          conversations: [
            ...p.conversations,
            { sender: 'ai', text: `[Staff Reply] ${manualMessage}`, time: timeStr }
          ]
        };
      }
      return p;
    }));

    setManualMessage('');
    triggerToast("Message sent to patient's WhatsApp.", "success");
  };

  // Suggested Actions execution
  const handleAIAction = (actionType) => {
    const now = new Date();
    const timeStr = now.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: true });

    if (actionType === 'book') {
      // Confirm the pending appointment
      setPatients(prev => prev.map(p => {
        if (p.id === activePatient.id) {
          return {
            ...p,
            status: 'Confirmed',
            appointments: p.appointments.map(a => a.status === 'pending' ? { ...a, status: 'confirmed' } : a),
            conversations: [
              ...p.conversations,
              { sender: 'ai', text: "Thank you Priya. Your appointment for 11:00 AM today is confirmed. See you soon!", time: timeStr },
              { sender: 'system', text: "AI booked & confirmed appointment automatically.", time: timeStr }
            ]
          };
        }
        return p;
      }));
      triggerToast(`AI reception booked appointment for ${activePatient.name}.`, 'success');
    } 
    else if (actionType === 'escalate') {
      // Escalate to high risk / emergency
      setPatients(prev => prev.map(p => {
        if (p.id === activePatient.id) {
          return {
            ...p,
            status: 'Escalated',
            riskCategory: 'Critical',
            conversations: [
              ...p.conversations,
              { sender: 'system', text: "Doctor desk escalated this thread to Emergency Triage.", time: timeStr }
            ]
          };
        }
        return p;
      }));
      triggerToast(`Escalated ${activePatient.name} to urgent clinical review.`, 'error');
    }
    else if (actionType === 'reschedule') {
      // Prompt patient via WhatsApp for reschedule
      setPatients(prev => prev.map(p => {
        if (p.id === activePatient.id) {
          return {
            ...p,
            conversations: [
              ...p.conversations,
              { sender: 'ai', text: "Dr. Sharma has a scheduling conflict today. Can we move you to 2:30 PM today, or tomorrow morning?", time: timeStr }
            ]
          };
        }
        return p;
      }));
      triggerToast(`WhatsApp rescheduled options sent to ${activePatient.name}.`, 'info');
    }
  };

  return (
    <div>
      <div className="hero-area" style={{ marginBottom: '20px' }}>
        <h1 className="hero-title">AI Inbox</h1>
        <div className="hero-subtext">WhatsApp communication control desk. Review AI replies or override conversations manually.</div>
      </div>

      <div className="inbox-layout">
        {/* Left Sidebar: Conversations directory */}
        <div className="inbox-left">
          <h3 className="inbox-header-title">Active Conversations</h3>
          <div className="inbox-chat-list">
            {patients.map(p => {
              const lastMsg = p.conversations[p.conversations.length - 1];
              return (
                <div 
                  key={p.id}
                  className={`chat-item ${activePatient.id === p.id ? 'active' : ''}`}
                  onClick={() => setSelectedPatientId(p.id)}
                >
                  <div 
                    className="chat-item-avatar"
                    style={{ backgroundColor: p.avatarColor, color: p.textColor }}
                  >
                    {p.name.split(' ').map(n => n[0]).join('')}
                  </div>
                  <div className="chat-item-content">
                    <div className="chat-item-name-row">
                      <span className="chat-item-name">{p.name}</span>
                      <span className="chat-item-time">{lastMsg?.time || 'Just now'}</span>
                    </div>
                    <div className="chat-item-preview">
                      {lastMsg?.text || 'No messages yet'}
                    </div>
                    <div className="chat-item-badges">
                      <span className="ai-badge" style={{ backgroundColor: p.status === 'Staff Takeover' ? 'var(--color-emergency)' : 'var(--color-ai)' }}>
                        {p.status === 'Staff Takeover' ? 'Manual' : 'AI Active'}
                      </span>
                      {p.riskCategory === 'Critical' && (
                        <span className="ai-badge" style={{ backgroundColor: 'var(--color-emergency)' }}>
                          Critical
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Right Pane: Message Area & Toggles */}
        {activePatient ? (
          <div className="inbox-right">
            {/* Header info */}
            <div className="inbox-right-header">
              <div className="chat-user-details">
                <div 
                  className="chat-item-avatar"
                  style={{ 
                    backgroundColor: activePatient.avatarColor, 
                    color: activePatient.textColor, 
                    width: '38px', 
                    height: '38px',
                    fontSize: '12px'
                  }}
                >
                  {activePatient.name.split(' ').map(n => n[0]).join('')}
                </div>
                <div>
                  <h4 style={{ fontSize: '14.5px', fontWeight: 700 }}>{activePatient.name}</h4>
                  <span className="chat-user-status">
                    {activePatient.status === 'Staff Takeover' 
                      ? '🔴 Paused (Doctor control active)' 
                      : '🔵 Autopilot: ClinicOS receptionist is active'
                    }
                  </span>
                </div>
              </div>

              {/* Takeover Control */}
              <div className="takeover-control">
                <span>Staff Takeover</span>
                <label className="switch">
                  <input 
                    type="checkbox" 
                    checked={activePatient.status === 'Staff Takeover'} 
                    onChange={() => handleTakeoverToggle(activePatient.id)}
                  />
                  <span className="slider"></span>
                </label>
              </div>
            </div>

            {/* Chat message bubbles */}
            <div className="chat-messages-area">
              {activePatient.conversations.map((msg, idx) => (
                <div 
                  key={idx} 
                  className={`chat-bubble ${msg.sender}`}
                >
                  {msg.sender !== 'system' && (
                    <div style={{ 
                      fontSize: '9px', 
                      fontWeight: 700, 
                      color: msg.sender === 'ai' ? 'var(--color-ai)' : 'var(--text-secondary)',
                      textTransform: 'uppercase',
                      marginBottom: '2px'
                    }}>
                      {msg.sender === 'ai' ? 'ClinicOS AI' : activePatient.name}
                    </div>
                  )}
                  <div>{msg.text}</div>
                  {msg.sender !== 'system' && msg.time && (
                    <span className="chat-bubble-time">{msg.time}</span>
                  )}
                </div>
              ))}
              <div ref={chatBottomRef} />
            </div>

            {/* AI Suggested Actions Bar (Only if AI is active / pending) */}
            {activePatient.status !== 'Staff Takeover' && (
              <div className="inbox-suggestions-bar">
                <div className="suggestions-title">
                  <svg width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24"><path d="M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/></svg>
                  Suggested AI Actions (One-Click Execute)
                </div>
                <div className="suggestions-list">
                  {activePatient.status === 'Pending Confirmation' && (
                    <button 
                      className="suggestion-btn"
                      onClick={() => handleAIAction('book')}
                      style={{ color: 'var(--color-confirmed)', borderColor: 'rgba(16, 185, 129, 0.2)' }}
                    >
                      ✓ Book & Confirm Slot Today
                    </button>
                  )}
                  <button 
                    className="suggestion-btn"
                    onClick={() => handleAIAction('reschedule')}
                  >
                    📅 Propose Rescheduling Options
                  </button>
                  {activePatient.riskCategory !== 'Critical' && (
                    <button 
                      className="suggestion-btn"
                      onClick={() => handleAIAction('escalate')}
                      style={{ color: 'var(--color-emergency)', borderColor: 'rgba(239, 68, 68, 0.2)' }}
                    >
                      🚨 Escalate to Dr. Sharma (Urgent Review)
                    </button>
                  )}
                </div>
              </div>
            )}

            {/* Input message form */}
            <form 
              onSubmit={handleSendMessage}
              style={{
                padding: '16px 24px',
                backgroundColor: 'white',
                borderTop: '1px solid var(--border-subtle)',
                display: 'flex',
                gap: '12px'
              }}
            >
              <input 
                type="text" 
                className="search-input"
                placeholder={activePatient.status === 'Staff Takeover' ? "Type WhatsApp message (manual mode)..." : "Type reply (sending manually will toggle Staff Takeover)..."}
                style={{ paddingLeft: '16px', flex: 1 }}
                value={manualMessage}
                onChange={(e) => setManualMessage(e.target.value)}
              />
              <button 
                type="submit"
                className="alert-btn primary"
                style={{ borderRadius: '12px', padding: '10px 20px', height: '42px', flexShrink: 0 }}
              >
                Send Message
              </button>
            </form>
          </div>
        ) : (
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100%', backgroundColor: '#fafbfc' }}>
            <span style={{ color: 'var(--text-muted)' }}>Select a conversation from the left sidebar.</span>
          </div>
        )}
      </div>
    </div>
  );
}
