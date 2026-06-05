import React, { useEffect, useState } from 'react';
import { Users, Calendar, AlertTriangle, CheckCircle, MessageSquare } from 'lucide-react';
import { fetchPatients } from '../services/api';
import './Pipeline.css';

const Pipeline = () => {
  const [patients, setPatients] = useState([]);
  const [activeChat, setActiveChat] = useState(null);

  useEffect(() => {
    const loadData = async () => {
      const data = await fetchPatients();
      setPatients(data);
    };
    loadData();
    const interval = setInterval(loadData, 5000);
    return () => clearInterval(interval);
  }, []);

  const columns = [
    { id: 'New', title: 'New Inquiries', icon: <Users size={16} /> },
    { id: 'Booked', title: 'Scheduled', icon: <Calendar size={16} /> },
    { id: 'Rescheduled', title: 'Rescheduled', icon: <AlertTriangle size={16} /> },
    { id: 'Cancelled', title: 'Cancelled', icon: <CheckCircle size={16} /> }
  ];

  const getStatusColor = (status) => {
    switch(status) {
      case 'New': return 'var(--info)';
      case 'Booked': return 'var(--success)';
      case 'Rescheduled': return 'var(--warning)';
      case 'Cancelled': return 'var(--danger)';
      default: return 'var(--text-muted)';
    }
  };

  return (
    <div className="pipeline-container">
      <div className="glass-panel pipeline-board">
        <div className="pipeline-header">
          <h2>Patient Pipeline</h2>
        </div>
        
        <div className="kanban-grid">
          {columns.map(col => {
            const colPatients = patients.filter(p => p.Status === col.id);
            return (
              <div key={col.id} className="kanban-column">
                <div className="kanban-col-header" style={{ borderBottomColor: getStatusColor(col.id) }}>
                  <div className="kanban-col-title">
                    {col.icon}
                    <span>{col.title}</span>
                  </div>
                  <span className="kanban-count">{colPatients.length}</span>
                </div>
                
                <div className="kanban-cards">
                  {colPatients.map(patient => (
                    <div key={patient.id} className="kanban-card" onClick={() => setActiveChat(patient)}>
                      <div className="card-header">
                        <h4>{patient.Name || patient.Phone}</h4>
                        <div className="card-badge" style={{ backgroundColor: `${getStatusColor(patient.Status)}20`, color: getStatusColor(patient.Status) }}>
                          {patient.Slot ? `${patient.Date} ${patient.Slot}` : 'Pending'}
                        </div>
                      </div>
                      {patient.Symptom && <p className="card-symptom">{patient.Symptom}</p>}
                      <div className="card-footer">
                        <span className="card-time">{new Date(patient.LastUpdated).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}</span>
                        <button className="chat-btn" title="View Conversation">
                          <MessageSquare size={14} />
                        </button>
                      </div>
                    </div>
                  ))}
                  {colPatients.length === 0 && <div className="kanban-empty">No patients</div>}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {activeChat && (
        <div className="glass-panel chat-inspector">
          <div className="chat-header">
            <h3>Conversation: {activeChat.Name || activeChat.Phone}</h3>
            <button className="close-btn" onClick={() => setActiveChat(null)}>×</button>
          </div>
          <div className="chat-messages">
            {activeChat.ConversationHistory ? (
              activeChat.ConversationHistory.split('\n').map((line, idx) => {
                if (!line.trim()) return null;
                const isAI = line.startsWith('AI:');
                const text = line.replace(/^(User:|AI:)\s*/, '');
                return (
                  <div key={idx} className={`chat-bubble-wrapper ${isAI ? 'ai' : 'user'}`}>
                    <span className="chat-sender">{isAI ? 'Aanya (AI)' : 'Patient'}</span>
                    <div className={`chat-bubble ${isAI ? 'ai-bubble' : 'user-bubble'}`}>
                      {text}
                    </div>
                  </div>
                );
              })
            ) : (
              <p className="no-chat">No conversation history available.</p>
            )}
          </div>
          <div className="chat-actions">
            <button className="manual-override-btn">Take Over Chat</button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Pipeline;
