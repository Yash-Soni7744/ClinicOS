import React from 'react';
import { INITIAL_ANALYTICS } from '../mockData';

export default function Analytics({ patients }) {
  const data = INITIAL_ANALYTICS;

  return (
    <div>
      <div className="hero-area">
        <h1 className="hero-title">Operational Analytics</h1>
        <div className="hero-subtext">Monitor clinical ROI, automated front-desk outcomes, and regional lead acquisitions.</div>
      </div>

      {/* ROI styling cards */}
      <div className="analytics-roi-grid">
        <div className="roi-card">
          <div>
            <span className="roi-label">Estimated Revenue Saved</span>
            <h2 className="roi-value" style={{ color: 'var(--color-confirmed)' }}>{data.roi.revenueSaved}</h2>
          </div>
          <p className="roi-subtext">From AI-prevented no-shows and auto-recoveries this month.</p>
        </div>

        <div className="roi-card">
          <div>
            <span className="roi-label">No-Shows Prevented</span>
            <h2 className="roi-value">{data.roi.preventedNoShows} patients</h2>
          </div>
          <p className="roi-subtext">Flagged and re-confirmed by Reminder Agent.</p>
        </div>

        <div className="roi-card">
          <div>
            <span className="roi-label">Outreach Leads Captured</span>
            <h2 className="roi-value">{data.roi.outreachLeadsCaptured} leads</h2>
          </div>
          <p className="roi-subtext">After-hours visitors converted to appointments.</p>
        </div>

        <div className="roi-card">
          <div>
            <span className="roi-label">AI Receptionist Hours</span>
            <h2 className="roi-value">{data.roi.aiHoursWorked} hrs</h2>
          </div>
          <p className="roi-subtext">Equivalent to 7.6 full-time front desk shifts saved.</p>
        </div>
      </div>

      {/* Main Analytics splits */}
      <div className="grid-sections">
        {/* Left Side: Weekly Growth Chart */}
        <div className="dashboard-panel">
          <div className="panel-header">
            <h2 className="panel-title">Weekly AI Engagement Load</h2>
            <span style={{ fontSize: '12px', color: 'var(--text-muted)' }}>May 21 - May 27</span>
          </div>

          <div style={{ padding: '10px 0' }}>
            <div style={{ display: 'flex', gap: '16px', marginBottom: '16px', fontSize: '12px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                <div style={{ width: '12px', height: '12px', borderRadius: '3px', backgroundColor: 'var(--color-ai)' }}></div>
                <span>AI Automated Bookings</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                <div style={{ width: '12px', height: '12px', borderRadius: '3px', backgroundColor: 'var(--color-confirmed)' }}></div>
                <span>Recovered No-Shows</span>
              </div>
            </div>

            <div className="chart-container">
              {data.weeklyGrowth.map((day, idx) => {
                // Calculate heights based on values (max is 30)
                const heightAi = (day.aiBookings / 30) * 100;
                const heightRecovered = (day.recovered / 30) * 100;

                return (
                  <div key={idx} className="chart-bar-wrapper">
                    <div style={{ display: 'flex', gap: '4px', alignItems: 'flex-end', height: '80%', width: '100%', justifyContent: 'center' }}>
                      <div 
                        className="chart-bar" 
                        style={{ height: `${heightAi}%` }} 
                        data-value={day.aiBookings}
                      />
                      <div 
                        className="chart-bar secondary" 
                        style={{ height: `${heightRecovered}%` }} 
                        data-value={day.recovered}
                      />
                    </div>
                    <span className="chart-label">{day.day}</span>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Right Side: Regional Split (NCR localization) */}
        <div className="dashboard-panel">
          <div className="panel-header">
            <h2 className="panel-title">Patient Dispersion</h2>
            <span style={{ fontSize: '11px', fontWeight: '700', color: 'var(--color-ai)' }}>NCR Region</span>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '20px', marginTop: '10px' }}>
            {data.regionalSplit.map((region, idx) => (
              <div key={idx} style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '13px', fontWeight: 600 }}>
                  <span>{region.city}</span>
                  <span style={{ color: 'var(--text-secondary)' }}>{region.percentage}%</span>
                </div>
                <div style={{ height: '8px', backgroundColor: 'var(--border-subtle)', borderRadius: '4px', overflow: 'hidden' }}>
                  <div 
                    style={{ 
                      width: `${region.percentage}%`, 
                      backgroundColor: idx === 0 ? 'var(--color-ai)' : idx === 1 ? 'var(--color-confirmed)' : idx === 2 ? 'var(--color-pending)' : 'var(--text-secondary)',
                      height: '100%' 
                    }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

      </div>

      {/* KPI details row */}
      <div className="grid-kpi" style={{ margin: '0' }}>
        {[
          { label: "AI Handled Conversations", value: "94.2%", desc: "Direct resolution rate" },
          { label: "Booking Conversion Rate", value: "68.7%", desc: "Lead-to-appointment ratio" },
          { label: "After-Hours Leads Captured", value: "18 cases", desc: "Between 8:00 PM and 9:00 AM" },
          { label: "Weekly Growth Trend", value: "+24.6%", desc: "Patient acquisition expansion" }
        ].map((kpi, idx) => (
          <div key={idx} className="kpi-card" style={{ cursor: 'default' }}>
            <div className="kpi-card-header" style={{ marginBottom: '8px' }}>
              <span className="kpi-label" style={{ fontSize: '12px' }}>{kpi.label}</span>
            </div>
            <div>
              <div className="kpi-value" style={{ fontSize: '24px', marginBottom: '2px' }}>
                {kpi.value}
              </div>
              <span style={{ fontSize: '11px', color: 'var(--text-muted)' }}>{kpi.desc}</span>
            </div>
          </div>
        ))}
      </div>

    </div>
  );
}
