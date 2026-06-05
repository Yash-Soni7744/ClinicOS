import React, { useEffect, useState } from 'react';
import { Clock, CheckCircle, RefreshCw, MessageSquare } from 'lucide-react';
import { fetchMetrics } from '../services/api';
import './Metrics.css';

const Metrics = () => {
  const [metrics, setMetrics] = useState(null);

  useEffect(() => {
    const loadData = async () => {
      const data = await fetchMetrics();
      setMetrics(data);
    };
    loadData();
    // In a real app, this would poll or use websockets
    const interval = setInterval(loadData, 5000);
    return () => clearInterval(interval);
  }, []);

  if (!metrics) return <div className="metrics-loading">Loading intelligence...</div>;

  const cards = [
    {
      title: 'Hours Saved Today',
      value: `${metrics.hoursSaved}h`,
      icon: <Clock size={24} color="var(--primary)" />,
      trend: '+12% from yesterday',
      trendUp: true
    },
    {
      title: 'Appointments Secured',
      value: metrics.appointmentsSecured,
      icon: <CheckCircle size={24} color="var(--success)" />,
      trend: '3 new in last hour',
      trendUp: true
    },
    {
      title: 'Reschedules Handled',
      value: metrics.reschedulesManaged,
      icon: <RefreshCw size={24} color="var(--warning)" />,
      trend: '0 manual interventions',
      trendUp: true
    },
    {
      title: 'Active Conversations',
      value: metrics.conversationsActive,
      icon: <MessageSquare size={24} color="var(--info)" />,
      trend: 'Live via WhatsApp',
      trendUp: null
    }
  ];

  return (
    <div className="metrics-grid">
      {cards.map((card, idx) => (
        <div key={idx} className="glass-panel metric-card" style={{ animationDelay: `${idx * 0.1}s` }}>
          <div className="metric-header">
            <h3 className="metric-title">{card.title}</h3>
            <div className="metric-icon">{card.icon}</div>
          </div>
          <div className="metric-body">
            <span className="metric-value">{card.value}</span>
          </div>
          <div className="metric-footer">
            <span className={`metric-trend ${card.trendUp ? 'trend-up' : ''}`}>
              {card.trend}
            </span>
          </div>
        </div>
      ))}
    </div>
  );
};

export default Metrics;
