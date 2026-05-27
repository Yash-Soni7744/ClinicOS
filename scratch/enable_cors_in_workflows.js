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
    
    // Replace "path":"patient-reply","options":{}
    // with "path":"patient-reply","options":{"cors":true}
    content = content.replace(
      /"path":"patient-reply","options":\{\}/g,
      '"path":"patient-reply","options":{"cors":true}'
    );

    fs.writeFileSync(filePath, content, 'utf8');
    console.log(`Enabled CORS option in: ${filePath}`);
  } catch (err) {
    console.error(`Error updating CORS in ${filePath}:`, err);
  }
});
