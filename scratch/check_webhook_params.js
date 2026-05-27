const fs = require('fs');
const path = require('path');

const filePath = path.join(__dirname, '..', 'workflows', 'all_workflows.json');
try {
  const content = fs.readFileSync(filePath, 'utf8');
  const workflows = JSON.parse(content);
  const workflow = workflows.find(w => w.name === 'Patient Reply Engine');
  
  if (workflow) {
    const webhook = workflow.nodes.find(n => n.name === 'Incoming WhatsApp Message');
    console.log("Incoming WhatsApp Message parameters:", JSON.stringify(webhook.parameters, null, 2));
  } else {
    console.log("Workflow not found!");
  }
} catch (e) {
  console.error("Error:", e);
}
