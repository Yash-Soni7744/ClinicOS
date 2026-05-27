import React, { useState, useRef, useEffect } from 'react';

export default function AIInbox({ 
  patients, 
  setPatients, 
  selectedPatientId, 
  setSelectedPatientId, 
  triggerToast,
  n8nEnabled,
  n8nUrl,
  n8nWebhookMode
}) {
  const [manualMessage, setManualMessage] = useState('');
  const chatBottomRef = useRef(null);

  // Connection logger state
  const [n8nLogs, setN8nLogs] = useState([]);
  const [showLogs, setShowLogs] = useState(true);

  const activePatient = patients.find(p => p.id === selectedPatientId) || patients[0];

  // Auto scroll to bottom of chat when active patient or messages change
  useEffect(() => {
    if (chatBottomRef.current) {
      chatBottomRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [selectedPatientId, activePatient?.conversations?.length]);

  // Dispatch HTTP request to local n8n Webhook
  const triggerN8nWebhook = async (messageText) => {
    const cleanPhone = activePatient.phone.replace(/\s+/g, "");
    // Match the exact format expected by n8n's From.replace("whatsapp:+","")
    const formattedPhone = "whatsapp:" + cleanPhone;
    const webhookPath = `${n8nUrl}/webhook-${n8nWebhookMode === 'test' ? 'test' : ''}/patient-reply`;
    
    const logId = Date.now().toString();
    const newLog = {
      id: logId,
      time: new Date().toLocaleTimeString(),
      url: webhookPath,
      method: 'POST',
      payload: { body: { From: formattedPhone, Body: messageText } },
      status: 'pending',
      response: null
    };

    setN8nLogs(prev => [newLog, ...prev]);

    try {
      const res = await fetch(webhookPath, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          body: {
            From: formattedPhone,
            Body: messageText
          }
        })
      });

      const responseText = await res.text();
      let responseData = null;
      try {
        responseData = JSON.parse(responseText);
      } catch (err) {
        responseData = responseText;
      }

      setN8nLogs(prev => prev.map(log => 
        log.id === logId 
          ? { ...log, status: res.status, response: responseData } 
          : log
      ));

      if (res.status === 200 || res.status === 201) {
        triggerToast("n8n pipeline executed successfully!", "success");
        return { success: true, data: responseData };
      } else {
        triggerToast(`n8n webhook triggered with status ${res.status}`, "info");
        return { success: true, data: responseData };
      }
    } catch (err) {
      console.error("n8n Bridge error:", err);
      setN8nLogs(prev => prev.map(log => 
        log.id === logId 
          ? { ...log, status: 'Blocked / Offline', response: err.message } 
          : log
      ));
      triggerToast("n8n bridge offline or browser CORS block.", "error");
      return { success: false, error: err };
    }
  };

  // Simulate patient WhatsApp message (fires n8n)
  const handleSimulatePatient = async () => {
    if (!manualMessage.trim()) return;
    
    const text = manualMessage;
    setManualMessage('');
    
    const now = new Date();
    const timeStr = now.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: true });
    
    // 1. Add patient bubble locally
    setPatients(prev => prev.map(p => {
      if (p.id === activePatient.id) {
        return {
          ...p,
          conversations: [
            ...p.conversations,
            { sender: 'patient', text: text, time: timeStr }
          ]
        };
      }
      return p;
    }));

    // 2. Add AI Triage Processing indicator
    const typingId = 'typing-' + Date.now();
    setPatients(prev => prev.map(p => {
      if (p.id === activePatient.id) {
        return {
          ...p,
          conversations: [
            ...p.conversations,
            { id: typingId, sender: 'system', text: 'AI pre-consultation triage processing via n8n...' }
          ]
        };
      }
      return p;
    }));

    let aiResponseText = "";
    let systemLog = "";
    
    // 3. Fire local n8n Webhook
    if (n8nEnabled) {
      const result = await triggerN8nWebhook(text);
      
      // Clean up triage indicator
      setPatients(prev => prev.map(p => {
        if (p.id === activePatient.id) {
          return { ...p, conversations: p.conversations.filter(c => c.id !== typingId) };
        }
        return p;
      }));

      if (result && result.success && result.data) {
        const data = result.data;
        // Parse n8n response if configured for "lastNode"
        if (data.reply) {
          aiResponseText = data.reply;
        } else if (data.final_message) {
          aiResponseText = data.final_message;
        } else if (data.message && data.message !== "Workflow started") {
          aiResponseText = data.message;
        } else {
          systemLog = "n8n automation started in background (syncing calendar & sheets).";
        }
      }
    } else {
      // Mock typing timeout
      await new Promise(r => setTimeout(r, 1200));
      setPatients(prev => prev.map(p => {
        if (p.id === activePatient.id) {
          return { ...p, conversations: p.conversations.filter(c => c.id !== typingId) };
        }
        return p;
      }));
    }

    // 4. Generate fallback text if n8n returned immediate start without text
    if (!aiResponseText) {
      const lower = text.toLowerCase();
      if (lower.includes('chest pain') || lower.includes('breathing')) {
        aiResponseText = "Ramesh ji, please rest in a comfortable position immediately. Since you report chest pain and breathing difficulty, I am escalating this to Dr. Sharma's urgent desk right now. A clinic assistant will call you immediately.";
      } else if (lower.includes('fever') || lower.includes('bukhar') || lower.includes('cough')) {
        aiResponseText = "Fever and cold registered. Dr. Sharma has a slot open today at 11:30 AM. Shall I hold this slot for you? Please reply YES to confirm.";
      } else if (lower.includes('yes') || lower.includes('confirm')) {
        aiResponseText = "Perfect, booked and confirmed. Reminder sent to your calendar.";
      } else {
        aiResponseText = "Namaste. I have received your request. Our automated clinical desk is reviewing it.";
      }
    }

    // 5. Append AI reply bubble
    setPatients(prev => prev.map(p => {
      if (p.id === activePatient.id) {
        const conversations = [
          ...p.conversations,
          { sender: 'ai', text: aiResponseText, time: timeStr }
        ];
        if (systemLog) {
          conversations.push({ sender: 'system', text: systemLog, time: timeStr });
        }
        return {
          ...p,
          conversations
        };
      }
      return p;
    }));
  };

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

    // Trigger n8n webhook triggers if integration is enabled
    if (n8nEnabled) {
      let bodyText = "";
      if (actionType === 'book') bodyText = "YES";
      else if (actionType === 'reschedule') bodyText = "reschedule";
      else if (actionType === 'escalate') bodyText = "emergency";
      
      if (bodyText) {
        triggerN8nWebhook(bodyText);
      }
    }

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

            {/* n8n Webhook Console Logs */}
            {n8nEnabled && showLogs && (
              <div style={{
                backgroundColor: '#0f172a',
                color: '#38bdf8',
                fontFamily: 'monospace',
                fontSize: '11px',
                padding: '12px 18px',
                borderTop: '1px solid #1e293b',
                maxHeight: '130px',
                overflowY: 'auto',
                display: 'flex',
                flexDirection: 'column',
                gap: '6px'
              }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', color: '#94a3b8', borderBottom: '1px solid #1e293b', paddingBottom: '4px', marginBottom: '2px', fontWeight: 600 }}>
                  <span>🔌 n8n PIPELINE LOGGER</span>
                  <button 
                    onClick={() => setShowLogs(false)} 
                    style={{ background: 'none', border: 'none', color: '#94a3b8', cursor: 'pointer', fontSize: '10px' }}
                  >
                    Hide Logs
                  </button>
                </div>
                {n8nLogs.length === 0 ? (
                  <span style={{ color: '#64748b' }}>No n8n requests dispatched yet. Send a simulated message to trigger webhook.</span>
                ) : (
                  n8nLogs.map((log) => (
                    <div key={log.id} style={{ display: 'flex', flexDirection: 'column', gap: '2px' }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                        <span>
                          <span style={{ color: '#34d399' }}>{log.time}</span> • {log.method} {log.url}
                        </span>
                        <span style={{ color: log.status === 'pending' ? '#fbbf24' : log.status === 200 || log.status === 201 ? '#34d399' : '#f87171' }}>
                          [{log.status}]
                        </span>
                      </div>
                      <div style={{ color: '#cbd5e1', paddingLeft: '12px' }}>
                        Request: {JSON.stringify(log.payload)}
                      </div>
                      {log.response && (
                        <div style={{ color: '#cbd5e1', paddingLeft: '12px' }}>
                          Response: {JSON.stringify(log.response)}
                        </div>
                      )}
                    </div>
                  ))
                )}
              </div>
            )}

            {n8nEnabled && !showLogs && (
              <div style={{ textAlign: 'right', padding: '4px 20px', backgroundColor: '#f1f5f9', borderTop: '1px solid var(--border-subtle)' }}>
                <button 
                  onClick={() => setShowLogs(true)} 
                  style={{ background: 'none', border: 'none', color: 'var(--color-ai)', cursor: 'pointer', fontSize: '11px', fontWeight: 600 }}
                >
                  🔌 Show n8n Pipeline Logs
                </button>
              </div>
            )}

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
                Send as Staff
              </button>

              <button 
                type="button"
                className="alert-btn secondary"
                style={{ borderRadius: '12px', padding: '10px 20px', height: '42px', flexShrink: 0, color: 'var(--color-ai)', borderColor: 'var(--color-ai)' }}
                onClick={handleSimulatePatient}
              >
                Simulate Patient
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
