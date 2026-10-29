const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

const diagrams = [
  { name: 'class_diagram', file: 'class_diagram.mmd', width: 1400, height: 1100 },
  { name: 'use_case_diagram', file: 'use_case_diagram.mmd', width: 1200, height: 800 },
  { name: 'sequence_diagram', file: 'sequence_diagram.mmd', width: 1200, height: 900 },
  { name: 'architecture_diagram', file: 'architecture_diagram.mmd', width: 1200, height: 850 }
];

const bravePath = '"/Applications/Brave Browser.app/Contents/MacOS/Brave Browser"';

for (const d of diagrams) {
  const mmdContent = fs.readFileSync(path.join(__dirname, d.file), 'utf8');
  const htmlContent = `<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <script src="https://cdn.jsdelivr.net/npm/mermaid@10/dist/mermaid.min.js"></script>
  <style>
    body {
      margin: 0;
      padding: 30px;
      background: #ffffff;
      font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
      display: flex;
      justify-content: center;
      align-items: center;
    }
    .mermaid {
      background: #ffffff;
      width: 100%;
    }
  </style>
</head>
<body>
  <div class="mermaid">
${mmdContent}
  </div>
  <script>
    mermaid.initialize({
      startOnLoad: true,
      theme: 'default',
      themeVariables: {
        fontSize: '15px',
        fontFamily: 'sans-serif'
      }
    });
  </script>
</body>
</html>`;

  const tempHtml = path.join(__dirname, `${d.name}.html`);
  const outPng = path.join(__dirname, `${d.name}.png`);
  fs.writeFileSync(tempHtml, htmlContent, 'utf8');

  console.log(`Rendering ${d.name}...`);
  try {
    execSync(`${bravePath} --headless --virtual-time-budget=3000 --screenshot="${outPng}" --window-size=${d.width},${d.height} --default-background-color=00000000 "${tempHtml}"`, { stdio: 'pipe' });
    console.log(`Successfully generated ${d.name}.png`);
  } catch (err) {
    console.error(`Error rendering ${d.name}:`, err.message);
  } finally {
    if (fs.existsSync(tempHtml)) {
      fs.unlinkSync(tempHtml);
    }
  }
}
