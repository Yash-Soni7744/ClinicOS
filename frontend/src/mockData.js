// ClinicOS Mock Clinical Data
// Tailored for clinics in Delhi NCR (Faridabad, Gurgaon, Noida, Delhi)

export const INITIAL_PATIENTS = [
  {
    id: "p1",
    name: "Ramesh Kumar",
    age: 54,
    gender: "Male",
    phone: "+91 98110 43210",
    city: "Faridabad Sector 15",
    riskScore: 92, // Critical / High Risk
    riskCategory: "Critical",
    avatarColor: "#fee2e2", // light red
    textColor: "#ef4444",
    symptoms: "Severe chest pain + shortness of breath since 2 hours, radiating to left arm",
    previousVisits: [
      { date: "2026-04-12", diagnosis: "Essential Hypertension", doctor: "Dr. R. Sharma" },
      { date: "2026-05-01", diagnosis: "Mild Angina checkup", doctor: "Dr. R. Sharma" }
    ],
    aiNotes: "Patient has a history of high blood pressure and type-2 diabetes. WhatsApp AI Receptionist detected critical trigger keywords ('chest pain', 'breathing issue') at 10:41 AM and bypassed normal scheduling, raising a High-Risk Escalation alert. Recommended Action: Immediate clinical triage and contact patient.",
    appointments: [
      { id: "a1", date: "2026-05-27", time: "12:00 PM", status: "confirmed", doctor: "Dr. R. Sharma", risk: "Critical" }
    ],
    conversations: [
      { sender: "patient", text: "Dr sahab, chest me left side bahut tez dard ho raha hai. Saans lene me bhi dikkat hai.", time: "10:39 AM" },
      { sender: "ai", text: "Ramesh ji, please rest in a comfortable position immediately. Since you report chest pain and breathing difficulty, I am escalating this to Dr. Sharma's urgent desk right now. A clinic assistant will call you immediately.", time: "10:40 AM" },
      { sender: "ai", text: "[System Alert Generated: Critical Cardiac Risk Escalation]", time: "10:41 AM" }
    ],
    aiConfidence: 0.98,
    status: "Escalated"
  },
  {
    id: "p2",
    name: "Priya Patel",
    age: 29,
    gender: "Female",
    phone: "+91 95601 88992",
    city: "Gurgaon Phase 3",
    riskScore: 35, // Medium/Low
    riskCategory: "Medium",
    avatarColor: "#fffbeb", // light orange
    textColor: "#d97706",
    symptoms: "Fever (101°F) + dry cough + fatigue since 3 days",
    previousVisits: [],
    aiNotes: "First-time visitor. Reached out via WhatsApp inquiring about physician availability. AI Receptionist assessed symptoms, recommended a General Physician slot, and proposed a pending booking for today 11:00 AM. Awaiting manual confirmation.",
    appointments: [
      { id: "a2", date: "2026-05-27", time: "11:00 AM", status: "pending", doctor: "Dr. R. Sharma", risk: "Medium" }
    ],
    conversations: [
      { sender: "patient", text: "Hi, I have fever and severe dry cough. Can I get an appointment with Dr. Sharma today?", time: "09:45 AM" },
      { sender: "ai", text: "Namaste Priya. Dr. Sharma has a slot open today at 11:00 AM. Shall I hold this slot for you? Please confirm.", time: "09:46 AM" },
      { sender: "patient", text: "Yes please, book that slot.", time: "09:48 AM" },
      { sender: "ai", text: "Perfect, I have blocked the 11:00 AM slot. It is currently in 'Pending Confirmation' state. I will send you the confirmation receipt shortly.", time: "09:49 AM" }
    ],
    aiConfidence: 0.92,
    status: "Pending Confirmation"
  },
  {
    id: "p3",
    name: "Amit Singh",
    age: 42,
    gender: "Male",
    phone: "+91 98711 55667",
    city: "Noida Sector 62",
    riskScore: 20, // Low
    riskCategory: "Low",
    avatarColor: "#ecfdf5", // light green
    textColor: "#059669",
    symptoms: "Severe lower back muscle spasm, unable to sit for long",
    previousVisits: [
      { date: "2025-11-10", diagnosis: "Lumbar Strain", doctor: "Dr. R. Sharma" }
    ],
    aiNotes: "Follow-up patient. Has chronic back issues. AI Agent helped book a slot for today 11:30 AM and sent SMS reminder. Patient confirmed via WhatsApp interactive button ('Confirm').",
    appointments: [
      { id: "a3", date: "2026-05-27", time: "11:30 AM", status: "confirmed", doctor: "Dr. R. Sharma", risk: "Low" }
    ],
    conversations: [
      { sender: "ai", text: "Hello Amit. This is a reminder for your lumbar follow-up today with Dr. Sharma at 11:30 AM. Reply CONFIRM to secure or RESCHEDULE to change.", time: "08:00 AM" },
      { sender: "patient", text: "CONFIRM", time: "08:15 AM" },
      { sender: "ai", text: "Thank you Amit. Your appointment is confirmed. See you at 11:30 AM.", time: "08:16 AM" }
    ],
    aiConfidence: 0.99,
    status: "Confirmed"
  },
  {
    id: "p4",
    name: "Neha Gupta",
    age: 35,
    gender: "Female",
    phone: "+91 99100 23456",
    city: "Delhi GK-2",
    riskScore: 15,
    riskCategory: "Low",
    avatarColor: "#e0f2fe", // light blue
    textColor: "#0284c7",
    symptoms: "Routine prenatal checkup (2nd trimester evaluation)",
    previousVisits: [
      { date: "2026-04-20", diagnosis: "Prenatal routine checkup", doctor: "Dr. S. Verma" }
    ],
    aiNotes: "Regular prenatal follow-up. Low risk, normal vitals in previous visits. Autopiloted appointment booking completed and confirmed.",
    appointments: [
      { id: "a4", date: "2026-05-27", time: "01:30 PM", status: "confirmed", doctor: "Dr. S. Verma", risk: "Low" }
    ],
    conversations: [
      { sender: "patient", text: "Hi, scheduling my next routine prenatal checkup for this week.", time: "Yesterday" },
      { sender: "ai", text: "Sure Neha, Dr. Verma is available on Wednesday (May 27) at 1:30 PM. Does that work?", time: "Yesterday" },
      { sender: "patient", text: "Yes that works perfectly.", time: "Yesterday" },
      { sender: "ai", text: "Great, booked and confirmed. Reminder sent to your calendar.", time: "Yesterday" }
    ],
    aiConfidence: 0.97,
    status: "Confirmed"
  },
  {
    id: "p5",
    name: "Vikram Malhotra",
    age: 61,
    gender: "Male",
    phone: "+91 98990 12345",
    city: "Gurgaon Sector 54",
    riskScore: 48,
    riskCategory: "Medium",
    avatarColor: "#fffbeb",
    textColor: "#d97706",
    symptoms: "Type-2 Diabetes follow-up + HbA1c review",
    previousVisits: [
      { date: "2026-02-15", diagnosis: "Uncontrolled Diabetes Mellitus", doctor: "Dr. R. Sharma" }
    ],
    aiNotes: "No-show risk flagged by AI: Patient missed their follow-up twice. AI Outreach Agent triggered a conversational sequence offering direct rescheduling. Patient responded and booked for tomorrow 2:00 PM.",
    appointments: [
      { id: "a5", date: "2026-05-28", time: "02:00 PM", status: "confirmed", doctor: "Dr. R. Sharma", risk: "Medium" }
    ],
    conversations: [
      { sender: "ai", text: "Hello Mr. Malhotra. We noticed you missed your last two diabetes follow-ups. Regular monitoring of HbA1c is highly recommended. Dr. Sharma has open slots this Thursday at 2:00 PM. Can I book this for you?", time: "Yesterday" },
      { sender: "patient", text: "Haan please, block that time. I got busy last week.", time: "Yesterday" },
      { sender: "ai", text: "All booked! I have updated your calendar. Looking forward to seeing you tomorrow at 2:00 PM.", time: "Yesterday" }
    ],
    aiConfidence: 0.94,
    status: "Recovered Lead"
  },
  {
    id: "p6",
    name: "Siddharth Roy",
    age: 31,
    gender: "Male",
    phone: "+91 93112 00998",
    city: "Noida Sector 15",
    riskScore: 78,
    riskCategory: "High",
    avatarColor: "#fee2e2",
    textColor: "#ef4444",
    symptoms: "High fever (103°F) with constant vomiting and abdominal pain",
    previousVisits: [],
    aiNotes: "Triage Alert: Patient reports high fever combined with dehydration markers. Scheduled for review. High triage score requires attention from Dr. Sharma.",
    appointments: [
      { id: "a6", date: "2026-05-27", time: "03:00 PM", status: "pending", doctor: "Dr. R. Sharma", risk: "High" }
    ],
    conversations: [
      { sender: "patient", text: "Sir, bohot vomiting ho rahi hai aur fever 103 hai. Dawa lene par bhi fever down nahi ho raha.", time: "10:15 AM" },
      { sender: "ai", text: "Siddharth, please avoid taking further medications without consulting the doctor. High fever with persistent vomiting needs quick attention. I am adding you to Dr. Sharma's priority review queue for today 3:00 PM.", time: "10:16 AM" }
    ],
    aiConfidence: 0.95,
    status: "Pending Triage"
  }
];

export const INITIAL_ALERTS = [
  {
    id: "al1",
    patientId: "p1",
    patientName: "Ramesh Kumar",
    type: "Emergency Escalation",
    severity: "Critical",
    details: "Chest pain + breathing difficulty reported via WhatsApp.",
    time: "10:41 AM",
    resolved: false
  },
  {
    id: "al2",
    patientId: "p6",
    patientName: "Siddharth Roy",
    type: "High Triage Flag",
    severity: "High",
    details: "Uncontrolled fever (103°F) + acute vomiting.",
    time: "10:16 AM",
    resolved: false
  },
  {
    id: "al3",
    patientId: "p2",
    patientName: "Priya Patel",
    type: "Low-Confidence Booking",
    severity: "Medium",
    details: "AI receptionist booked slot, but confidence score was borderline (88%) due to vague symptom descriptions.",
    time: "09:49 AM",
    resolved: false
  },
  {
    id: "al4",
    patientId: "p4",
    patientName: "Neha Gupta",
    type: "Collision Detected",
    severity: "Low",
    details: "Schedule overlaps with Dr. Verma's ward rounds. System resolved automatically, but requires verification.",
    time: "09:12 AM",
    resolved: true
  }
];

export const INITIAL_FEED_EVENTS = [
  { time: "10:43 AM", text: "Lead recovered automatically: Vikram Malhotra booked follow-up slot.", type: "ai-action" },
  { time: "10:41 AM", text: "CRITICAL: Emergency symptoms detected for Ramesh Kumar. Alert raised.", type: "emergency" },
  { time: "10:36 AM", text: "Priya Patel requested reschedule for today's GP consultation.", type: "pending" },
  { time: "10:32 AM", text: "Amit Singh confirmed his 11:30 AM appointment via WhatsApp.", type: "confirmed" },
  { time: "10:10 AM", text: "AI Receptionist answered general inquiry about blood test charges (+91 98112-XXXX).", type: "ai-action" },
  { time: "09:50 AM", text: "Google Calendar synced with Dr. Sharma's OPD hours.", type: "system" }
];

export const INITIAL_ANALYTICS = {
  kpis: {
    todayAppointments: 6,
    pendingConfirmations: 2,
    cancelled: 1,
    highRiskCases: 2,
    aiConversations: 52,
    recoveredLeads: 8,
    noShowRisk: "12%",
    escalations: 2
  },
  weeklyGrowth: [
    { day: "Mon", appointments: 18, aiBookings: 12, recovered: 3 },
    { day: "Tue", appointments: 22, aiBookings: 16, recovered: 4 },
    { day: "Wed", appointments: 28, aiBookings: 21, recovered: 5 },
    { day: "Thu", appointments: 25, aiBookings: 19, recovered: 4 },
    { day: "Fri", appointments: 30, aiBookings: 24, recovered: 6 },
    { day: "Sat", appointments: 15, aiBookings: 11, recovered: 2 },
    { day: "Sun", appointments: 5, aiBookings: 4, recovered: 1 }
  ],
  regionalSplit: [
    { city: "Faridabad", percentage: 35 },
    { city: "Noida", percentage: 25 },
    { city: "Gurgaon", percentage: 22 },
    { city: "Delhi", percentage: 18 }
  ],
  roi: {
    preventedNoShows: 14,
    revenueSaved: "₹45,500",
    outreachLeadsCaptured: 19,
    aiHoursWorked: 184
  }
};

export const INITIAL_SETTINGS = {
  clinicHours: { start: "09:00 AM", end: "08:00 PM", days: "Monday - Saturday" },
  availability: {
    drSharma: "09:30 AM - 01:00 PM, 04:00 PM - 07:00 PM",
    drVerma: "11:00 AM - 04:00 PM"
  },
  aiConfidenceThreshold: 0.85,
  emergencyKeywords: "chest pain, breathing problem, heart, paralysis, unconscious, bleeding, high fever, accident",
  integrations: {
    whatsapp: "Connected",
    googleCalendar: "Connected",
    twilio: "Connected",
    openai: "Connected"
  }
};
