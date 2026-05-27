import React, { useState } from 'react';

export default function Appointments({ 
  patients, 
  setPatients, 
  setSelectedPatientId, 
  setActivePage,
  triggerToast 
}) {
  const [activeFilter, setActiveFilter] = useState('Today');
  
  // Reschedule Modal states
  const [isRescheduleOpen, setIsRescheduleOpen] = useState(false);
  const [activeRescheduleApp, setActiveRescheduleApp] = useState(null); // { patientId, appointmentId, time, date, doctor }
  const [newTime, setNewTime] = useState('02:00 PM');
  const [newDate, setNewDate] = useState('2026-05-28');
  const [newDoctor, setNewDoctor] = useState('Dr. R. Sharma');

  // Extract all appointments from patients list
  const allAppointments = patients.reduce((acc, patient) => {
    patient.appointments.forEach(app => {
      acc.push({
        patientId: patient.id,
        patientName: patient.name,
        phone: patient.phone,
        symptoms: patient.symptoms,
        risk: app.risk || "Low",
        ...app
      });
    });
    return acc;
  }, []);

  // Filter logic
  const filteredAppointments = allAppointments.filter(app => {
    switch (activeFilter) {
      case 'Today':
        return app.date === '2026-05-27';
      case 'Tomorrow':
        return app.date === '2026-05-28';
      case 'Pending':
        return app.status === 'pending';
      case 'Booked': // Confirmed
        return app.status === 'confirmed';
      case 'Cancelled':
        return app.status === 'cancelled';
      case 'Rescheduled':
        // Represented by future date/action changes
        return app.date !== '2026-05-27' && app.status !== 'cancelled';
      default:
        return true;
    }
  });

  const handleOpenPatient = (patientId) => {
    setSelectedPatientId(patientId);
    setActivePage('Patients');
  };

  const handleCancelAppointment = (patientId, appointmentId, patientName) => {
    setPatients(prev => prev.map(p => {
      if (p.id === patientId) {
        return {
          ...p,
          status: 'Cancelled',
          appointments: p.appointments.map(a => a.id === appointmentId ? { ...a, status: 'cancelled' } : a)
        };
      }
      return p;
    }));
    triggerToast(`Appointment for ${patientName} cancelled successfully.`, 'error');
  };

  const openRescheduleModal = (app) => {
    setActiveRescheduleApp(app);
    setNewTime(app.time);
    setNewDate(app.date);
    setNewDoctor(app.doctor);
    setIsRescheduleOpen(true);
  };

  const handleSaveReschedule = () => {
    if (!activeRescheduleApp) return;

    setPatients(prev => prev.map(p => {
      if (p.id === activeRescheduleApp.patientId) {
        return {
          ...p,
          status: 'Confirmed',
          appointments: p.appointments.map(a => {
            if (a.id === activeRescheduleApp.id) {
              return {
                ...a,
                time: newTime,
                date: newDate,
                doctor: newDoctor,
                status: 'confirmed'
              };
            }
            return a;
          })
        };
      }
      return p;
    }));

    setIsRescheduleOpen(false);
    triggerToast(`Appointment for ${activeRescheduleApp.patientName} rescheduled to ${newDate} at ${newTime}.`, 'success');
  };

  return (
    <div>
      <div className="hero-area">
        <h1 className="hero-title">Appointments</h1>
        <div className="hero-subtext">Manage schedules, triage urgency levels, and review doctor assignments.</div>
      </div>

      {/* Filter Tabs */}
      <div className="filters-bar">
        {['Today', 'Tomorrow', 'Pending', 'Booked', 'Cancelled', 'Rescheduled'].map((filter) => (
          <button
            key={filter}
            className={`filter-btn ${activeFilter === filter ? 'active' : ''}`}
            onClick={() => setActiveFilter(filter)}
          >
            {filter === 'Booked' ? 'Confirmed' : filter}
          </button>
        ))}
      </div>

      {/* Appointments Table */}
      <div className="table-container">
        {filteredAppointments.length > 0 ? (
          <table className="clinic-table">
            <thead>
              <tr>
                <th>Patient Name</th>
                <th>Date</th>
                <th>Time</th>
                <th>Doctor</th>
                <th>Symptoms</th>
                <th>Status</th>
                <th>Risk Level</th>
                <th style={{ textAlign: 'right' }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredAppointments.map((app) => (
                <tr key={app.id}>
                  <td>
                    <div 
                      className="table-patient-name" 
                      onClick={() => handleOpenPatient(app.patientId)}
                      style={{ cursor: 'pointer' }}
                    >
                      {app.patientName}
                    </div>
                    <div className="table-patient-phone">{app.phone}</div>
                  </td>
                  <td style={{ fontWeight: 500 }}>
                    {app.date === '2026-05-27' ? 'Today' : app.date === '2026-05-28' ? 'Tomorrow' : app.date}
                  </td>
                  <td style={{ fontWeight: 600 }}>{app.time}</td>
                  <td>{app.doctor}</td>
                  <td style={{ maxWidth: '280px', textOverflow: 'ellipsis', overflow: 'hidden', whiteSpace: 'nowrap' }} title={app.symptoms}>
                    {app.symptoms}
                  </td>
                  <td>
                    <span className={`status-badge ${app.status}`}>
                      {app.status}
                    </span>
                  </td>
                  <td>
                    <span className={`risk-badge ${app.risk.toLowerCase()}`}>
                      {app.risk}
                    </span>
                  </td>
                  <td>
                    <div className="action-menu" style={{ justifyContent: 'flex-end' }}>
                      <button 
                        className="table-action-btn primary"
                        onClick={() => handleOpenPatient(app.patientId)}
                      >
                        Open
                      </button>
                      
                      {app.status !== 'cancelled' && (
                        <>
                          <button 
                            className="table-action-btn"
                            onClick={() => openRescheduleModal(app)}
                          >
                            Reschedule
                          </button>
                          <button 
                            className="table-action-btn"
                            style={{ color: 'var(--color-emergency)' }}
                            onClick={() => handleCancelAppointment(app.patientId, app.id, app.patientName)}
                          >
                            Cancel
                          </button>
                        </>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <div style={{ textAlign: 'center', padding: '60px 20px', color: 'var(--text-muted)' }}>
            <h3>No appointments matches this filter.</h3>
            <p style={{ marginTop: '8px', fontSize: '13px' }}>Try switching filters or adjusting calendar configurations.</p>
          </div>
        )}
      </div>

      {/* Reschedule Interactive Modal */}
      {isRescheduleOpen && activeRescheduleApp && (
        <div className="modal-overlay">
          <div className="modal-content">
            <h3 className="modal-title">Reschedule Appointment</h3>
            <p className="modal-desc">Modifying booking details for <strong>{activeRescheduleApp.patientName}</strong>.</p>
            
            <div className="form-group">
              <label className="form-label">Consultation Date</label>
              <input 
                type="date" 
                className="form-input" 
                value={newDate} 
                onChange={(e) => setNewDate(e.target.value)} 
              />
            </div>

            <div className="form-group">
              <label className="form-label">Consultation Time Slot</label>
              <select 
                className="form-select" 
                value={newTime} 
                onChange={(e) => setNewTime(e.target.value)}
              >
                <option value="10:00 AM">10:00 AM</option>
                <option value="11:00 AM">11:00 AM</option>
                <option value="11:30 AM">11:30 AM</option>
                <option value="12:00 PM">12:00 PM</option>
                <option value="01:30 PM">01:30 PM</option>
                <option value="02:00 PM">02:00 PM</option>
                <option value="03:00 PM">03:00 PM</option>
                <option value="04:30 PM">04:30 PM</option>
                <option value="06:00 PM">06:00 PM</option>
              </select>
            </div>

            <div className="form-group">
              <label className="form-label">Assigned Practitioner</label>
              <select 
                className="form-select" 
                value={newDoctor} 
                onChange={(e) => setNewDoctor(e.target.value)}
              >
                <option value="Dr. R. Sharma">Dr. R. Sharma (General Medicine)</option>
                <option value="Dr. S. Verma">Dr. S. Verma (Pediatrics)</option>
              </select>
            </div>

            <div className="modal-actions">
              <button 
                className="alert-btn secondary" 
                onClick={() => setIsRescheduleOpen(false)}
              >
                Cancel
              </button>
              <button 
                className="alert-btn primary" 
                onClick={handleSaveReschedule}
              >
                Confirm Reschedule
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
