const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

const diagrams = [
  { name: 'class_diagram', file: 'class_diagram.mmd', width: 1500, height: 1200 },
  { name: 'pattern_singleton', file: 'pattern_singleton.mmd', width: 1100, height: 750 },
  { name: 'pattern_factory', file: 'pattern_factory.mmd', width: 1300, height: 950 },
  { name: 'pattern_observer', file: 'pattern_observer.mmd', width: 1300, height: 900 },
  { name: 'use_case_diagram', file: 'use_case_diagram.mmd', width: 1200, height: 800 },
  { name: 'sequence_diagram', file: 'sequence_diagram.mmd', width: 1200, height: 900 },
  { name: 'architecture_diagram', file: 'architecture_diagram.mmd', width: 1200, height: 850 }
];

const bravePath = '"/Applications/Brave Browser.app/Contents/MacOS/Brave Browser"';

for (const d of diagrams) {
  const mmdPath = path.join(__dirname, d.file);
  if (!fs.existsSync(mmdPath)) {
    console.warn(`File not found: ${mmdPath}`);
    continue;
  }
  const mmdContent = fs.readFileSync(mmdPath, 'utf8');
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
        fontFamily: 'Times New Roman, sans-serif'
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
    execSync(`${bravePath} --headless --virtual-time-budget=3500 --screenshot="${outPng}" --window-size=${d.width},${d.height} --default-background-color=00000000 "${tempHtml}"`, { stdio: 'pipe' });
    console.log(`Successfully generated ${d.name}.png (${fs.statSync(outPng).size} bytes)`);
  } catch (err) {
    console.error(`Error rendering ${d.name}:`, err.message);
  } finally {
    if (fs.existsSync(tempHtml)) {
      fs.unlinkSync(tempHtml);
    }
  }
}
