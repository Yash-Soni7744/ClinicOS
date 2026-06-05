# ClinicOS — AI Workforce for Healthcare Clinics

ClinicOS is an AI-powered operating system for small and mid-sized healthcare clinics that operates like a digital workforce. Rather than being just traditional EHR/practice management software that stores data, ClinicOS actively executes operational work—automating bookings, follow-ups, cancellations, and notifications.

## 🏗️ Project Architecture

ClinicOS consists of three core components:
1. **Frontend Dashboard (Nerve Center)**: A modern React (Vite) dashboard to monitor real-time AI workforce activity, view metrics, track the patient status pipeline, and view live communication feeds.
2. **Workflow & Automation Engine (n8n)**: A low-code agentic workflow runner acting as the operational backend. The AI agents run as workflows coordinating with LLMs (Groq / OpenAI) and messaging platforms.
3. **Database Layer (Google Sheets)**: A collaborative, visible spreadsheet acting as a lightweight database for the clinic, facilitating easy sync and low barrier to entry.

---

## ⚡ Prerequisites

To run this project on a new device, you will need:
- **Node.js** (v18.x or higher) & **npm**
- **n8n** (installed globally or run via `npx`)
- **API Keys / Accounts**:
  - **OpenAI API Key** (for advanced LLM orchestration)
  - **Groq API Key** (for fast, low-cost Hinglish parsing)
  - **Google Spreadsheet Account** (acting as the database)
  - **Telegram Bot / WhatsApp Cloud API** (for patient notifications & communication)

---

## 🚀 Step-by-Step Installation

### 1. Setup the Database (Google Sheets)

Create a Google Spreadsheet with a worksheet named `Patients` (or matching your configured sheet name) containing the following columns:

| Column Header | Description |
| :--- | :--- |
| **Phone** | Patient's phone number (acting as unique identifier) |
| **Name** | Patient's full name |
| **Symptom** | Patient's symptom or inquiry details |
| **Date** | Appointment Date |
| **Slot** | Time slot (e.g., 10:00 AM) |
| **Status** | Status of the patient (`New`, `Booked`, `Rescheduled`, `Cancelled`) |
| **LastUpdated** | ISO Timestamp of the last interaction |
| **ConversationHistory** | Running text transcript of the SMS/WhatsApp/Telegram chat history |

---

### 2. Configure the n8n Workflows

The automation flows are stored in `workflows/all_workflows.json`.

1. **Start n8n** on your new device:
   ```bash
   npx n8n start
   ```
   *By default, n8n will be available at `http://localhost:5678`.*

2. **Import the Workflows**:
   - Open your n8n console in the browser.
   - Go to **Workflows** -> **Add Workflow** -> **Import from File**.
   - Select `workflows/all_workflows.json`.

3. **Reconnect Credentials**:
   The credentials in the exported JSON are scrubbed with placeholder tokens. You must recreate/reconfigure credentials for:
   - **Google Sheets**: Connect to your Google Drive/Sheets account.
   - **Groq Console**: Generate a Groq API Key and configure the Groq Chat Model nodes.
   - **OpenAI**: Generate an OpenAI API Key for the OpenAI Chat Model nodes.
   - **Telegram/WhatsApp**: Create a Telegram Bot via BotFather or setup a WhatsApp Developer Account, then update the webhook triggers and receiver credentials.

4. **Enable Workflows**: Ensure all 8 workflows are set to **Active** inside n8n.

---

### 3. Setup the Frontend Dashboard

1. **Navigate to the frontend folder**:
   ```bash
   cd frontend
   ```

2. **Install Dependencies**:
   ```bash
   npm install
   ```

3. **Verify API Base URL**:
   Ensure the API service in `frontend/src/services/api.js` points to your active n8n instance's webhook URL:
   ```javascript
   const WEBHOOK_URL = 'http://localhost:5678/webhook/get-patients';
   ```

4. **Start the Frontend Server**:
   ```bash
   npm run dev
   ```
   *The application will launch locally at `http://localhost:5173`.*

---

## 🛠️ Developer Utility Scripts

Located in the `scratch/` directory:
- **CORS Configuration**: If you run into CORS issues with the React frontend fetching from local n8n webhooks, run:
  ```bash
  node scratch/enable_cors_in_workflows.js
  ```
  This will modify the workflow configurations to set `"cors": true` for incoming webhook triggers.
- **Scrubbing Secrets**: If you modify the workflows and want to export them safely, run:
  ```bash
  node scratch/scrub_secrets.js
  ```
  This script redacts Groq, OpenAI, and Telegram bot keys before committing workflows.

---

## 🤖 Included AI Workflows

The workflow suite includes 8 distinct workflows:
* **`FrontDesk-Agent-v2-Live` / `FrontDesk-Agent-v1`**: The primary receptionist flow that interfaces with the incoming messaging channel, processes Hinglish/English context, and updates Google Sheets.
* **`Patient Reply Engine`**: Handles secondary patient responses, confirmation signals, and coordinates reschedule windows.
* **`Clinic Reminder Engine`** & **`ClinicOS-Proactive-Reminders`**: Dispatches reminders to booked patients and handles cancellation requests.
* **`ClinicOS-Morning-Scanner-Agent`**: Runs every morning to scan today's bookings and prepare summaries for the clinic staff.
* **`My Sub-Workflow 1 & 2`**: Utility subroutines for message modularity and format normalization.
