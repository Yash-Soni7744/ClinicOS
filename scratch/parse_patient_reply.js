const fs = require('fs');
const path = require('path');

const filePath = path.join(__dirname, '..', 'workflows', 'all_workflows.json');
try {
  const content = fs.readFileSync(filePath, 'utf8');
  const workflows = JSON.parse(content);

  const workflow = workflows.find(w => w.name === 'Patient Reply Engine');
  if (workflow) {
    console.log(`Workflow: "${workflow.name}"`);
    console.log("Nodes:");
    workflow.nodes.forEach(n => {
      console.log(`- [${n.type}] "${n.name}" (ID: ${n.id})`);
      if (n.type === 'n8n-nodes-base.webhook') {
        console.log(`    Webhook path: ${n.parameters.path}`);
      }
      if (n.type === 'n8n-nodes-base.executeWorkflow') {
        console.log(`    Executes workflow ID: ${n.parameters.workflowId}`);
      }
    });
    console.log("\nConnections:");
    console.log(JSON.stringify(workflow.connections, null, 2));
  } else {
    console.log("Patient Reply Engine workflow not found!");
  }
} catch (e) {
  console.error("Error:", e);
}
