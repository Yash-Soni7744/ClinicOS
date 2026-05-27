const fs = require('fs');
const path = require('path');

const filePath = path.join(__dirname, '..', 'workflows', 'all_workflows.json');
try {
  const content = fs.readFileSync(filePath, 'utf8');
  const workflows = JSON.parse(content);

  console.log(`Loaded ${workflows.length} workflows.`);
  workflows.forEach(w => {
    console.log(`\nWorkflow: "${w.name}" (ID: ${w.id}, Active: ${w.active})`);
    const webhooks = w.nodes.filter(n => n.type === 'n8n-nodes-base.webhook');
    if (webhooks.length > 0) {
      webhooks.forEach(node => {
        console.log(`  - Webhook Node Name: "${node.name}"`);
        console.log(`    Method: ${node.parameters.httpMethod || 'GET'}`);
        console.log(`    Path: ${node.parameters.path || ''}`);
        console.log(`    WebhookId: ${node.webhookId || ''}`);
      });
    } else {
      console.log('  - No Webhook nodes found.');
    }
  });
} catch (e) {
  console.error("Error reading workflows:", e);
}
