const WEBHOOK_URL = 'http://localhost:5678/webhook/get-patients';

let cachedData = null;
let lastFetchTime = 0;

const getRawData = async () => {
  const now = Date.now();
  // Cache for 15 seconds to prevent spamming the n8n webhook and hitting Google Sheets API rate limits
  if (cachedData && now - lastFetchTime < 15000) {
    return cachedData;
  }
  
  try {
    const res = await fetch(WEBHOOK_URL);
    if (!res.ok) throw new Error('Failed to fetch from n8n webhook');
    let data = await res.json();
    
    // Sometimes n8n returns data wrapped in an object or array. 
    // We assume it's an array of row objects directly from Google Sheets.
    if (!Array.isArray(data)) {
        if (data.data && Array.isArray(data.data)) {
            data = data.data;
        } else {
            console.warn("Unexpected n8n webhook response format:", data);
            data = [];
        }
    }
    
    cachedData = data;
    lastFetchTime = now;
    return data;
  } catch (err) {
    console.error("Error fetching from n8n:", err);
    return cachedData || []; // Return last known good data if error
  }
};

export const fetchMetrics = async () => {
  const data = await getRawData();
  
  // Calculate dynamic metrics from live data
  const totalInquiries = data.length;
  // Estimate 5 minutes saved per automation
  const hoursSaved = (totalInquiries * 5 / 60).toFixed(1); 
  
  const appointmentsSecured = data.filter(p => 
    p.Status === 'Booked' || p.Status?.toLowerCase().includes('book')
  ).length;
  
  const reschedulesManaged = data.filter(p => 
    p.Status === 'Rescheduled' || p.Status?.toLowerCase().includes('reschedule')
  ).length;

  return {
    hoursSaved: parseFloat(hoursSaved),
    appointmentsSecured,
    reschedulesManaged,
    conversationsActive: totalInquiries,
  };
};

export const fetchLiveFeed = async () => {
  const data = await getRawData();
  
  // Since we only have current state, we will manufacture a "Live Feed" 
  // based on the LastUpdated timestamp and Status.
  // In a true event-sourcing system, n8n would push individual events to a queue.
  
  const feed = data.map((patient, index) => {
    let action = 'Incoming Message';
    let detail = `Received query from ${patient.Name || patient.Phone}`;
    let intent = 'CHAT';
    let statusColor = 'info';

    const statusStr = (patient.Status || 'New').toLowerCase();
    
    if (statusStr.includes('reschedule')) {
        action = 'Rescheduled Appointment';
        detail = `Moved ${patient.Name || patient.Phone} to ${patient.Date || 'new date'}`;
        intent = 'RESCHEDULE';
        statusColor = 'warning';
    } else if (statusStr.includes('cancel')) {
        action = 'Processed Cancellation';
        detail = `Cancelled appointment for ${patient.Name || patient.Phone}. Slot released.`;
        intent = 'CANCEL';
        statusColor = 'danger';
    } else if (statusStr.includes('book')) {
        action = 'Sent Confirmation';
        detail = `Appointment confirmed for ${patient.Name || patient.Phone} on ${patient.Date || 'requested date'}`;
        intent = 'CHAT';
        statusColor = 'success';
    }

    // Default timestamp to now minus index minutes just to show ordering if missing
    let timestamp = new Date(Date.now() - 1000 * 60 * index).toISOString();
    if (patient.LastUpdated) {
        timestamp = new Date(patient.LastUpdated).toISOString();
    }

    return {
      id: patient.row_number || `feed-${index}`,
      timestamp,
      agent: 'Aanya',
      action,
      detail,
      intent,
      status: statusColor
    };
  });

  // Sort feed descending by time
  return feed.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp)).slice(0, 10);
};

export const fetchPatients = async () => {
  const data = await getRawData();
  
  return data.map((p, idx) => ({
      id: p.row_number || `p-${idx}`,
      Name: p.Name || '',
      Symptom: p.Symptom || '',
      Date: p.Date || '',
      Slot: p.Slot || '',
      Status: p.Status || 'New',
      Phone: p.Phone || 'Unknown',
      LastUpdated: p.LastUpdated || new Date().toISOString(),
      ConversationHistory: p.ConversationHistory || ''
  }));
};
