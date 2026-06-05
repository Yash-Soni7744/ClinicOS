import React, { useEffect, useState } from 'react';
import { Activity, Zap, CheckCircle2, AlertCircle, MessageCircle } from 'lucide-react';
import { fetchLiveFeed } from '../services/api';
import './LiveFeed.css';

const LiveFeed = () => {
  const [feed, setFeed] = useState([]);

  useEffect(() => {
    const loadData = async () => {
      const data = await fetchLiveFeed();
      setFeed(data);
    };
    loadData();
    const interval = setInterval(loadData, 3000);
    return () => clearInterval(interval);
  }, []);

  const getIcon = (intent) => {
    switch(intent) {
      case 'RESCHEDULE': return <RefreshIcon />;
      case 'CANCEL': return <AlertCircle size={18} color="var(--danger)" />;
      case 'CHAT': return <MessageCircle size={18} color="var(--info)" />;
      default: return <Activity size={18} color="var(--primary)" />;
    }
  };

  const RefreshIcon = () => (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="var(--warning)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8" />
      <path d="M3 3v5h5" />
    </svg>
  );

  return (
    <div className="glass-panel live-feed-container">
      <div className="feed-header">
        <h2 className="feed-title">
          <Zap size={20} color="var(--primary)" className="pulse-icon" />
          Live AI Workforce Feed
        </h2>
        <span className="live-badge">Live</span>
      </div>
      
      <div className="feed-list">
        {feed.map((item, index) => (
          <div key={item.id} className="feed-item" style={{ animationDelay: `${index * 0.15}s` }}>
            <div className="feed-icon-wrapper">
              {getIcon(item.intent)}
              {index !== feed.length - 1 && <div className="feed-line"></div>}
            </div>
            <div className="feed-content">
              <div className="feed-meta">
                <span className="feed-agent">{item.agent}</span>
                <span className="feed-time">
                  {new Date(item.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </span>
              </div>
              <h4 className="feed-action">{item.action}</h4>
              <p className="feed-detail">{item.detail}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default LiveFeed;
