const fs = require('fs');
const path = require('path');

const filePaths = [
  path.join(__dirname, '..', 'workflows', 'all_workflows.json'),
  path.join(__dirname, '..', 'frontend', 'src', 'all_workflows.json')
];

filePaths.forEach(filePath => {
  try {
    if (!fs.existsSync(filePath)) {
      console.log(`File not found: ${filePath}`);
      return;
    }
    let content = fs.readFileSync(filePath, 'utf8');

    // 1. Scrub Groq Keys (starts with gsk_)
    const groqRegex = /gsk_[a-zA-Z0-9]+/g;
    content = content.replace(groqRegex, '[REDACTED_GROQ_API_KEY]');

    // 2. Scrub Telegram Bot Tokens (e.g. 123456789:ABCdef...)
    const telegramRegex = /\b\d{8,12}:[a-zA-Z0-9_-]{32,40}\b/g;
    content = content.replace(telegramRegex, '[REDACTED_TELEGRAM_BOT_TOKEN]');

    // 3. Scrub OpenAI Keys
    const openaiRegex = /sk-[a-zA-Z0-9]{32,60}/g;
    content = content.replace(openaiRegex, '[REDACTED_OPENAI_API_KEY]');

    // 4. Scrub Google Sheets / Calendar credential definitions if any contain auth codes
    // (n8n usually references credential accounts by ID, but let's be safe)
    
    fs.writeFileSync(filePath, content, 'utf8');
    console.log(`Scrubbed secrets from: ${filePath}`);
  } catch (err) {
    console.error(`Error scrubbing ${filePath}:`, err);
  }
});
