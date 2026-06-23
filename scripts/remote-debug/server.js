const http = require('http');
const fs = require('fs');
const path = require('path');
const babel = require('@babel/core');
const esbuild = require('esbuild');

const PORT = 8000;
const LOGS_DIR = path.join(__dirname, 'logs');
const FLUSH_INTERVAL = 200;

if (!fs.existsSync(LOGS_DIR)) fs.mkdirSync(LOGS_DIR);

let agentBundle = null;
async function buildAgent() {
  const src = fs.readFileSync(path.join(__dirname, 'agent.js'), 'utf8');
  const transpiled = await babel.transformAsync(src, {
    presets: [['@babel/preset-env', { targets: { ie: '11' } }]],
  });
  const result = await esbuild.transform(transpiled.code, { minify: true });
  agentBundle = result.code;
  console.log(`agent.js built (${agentBundle.length} bytes)`);
}
buildAgent();

function getDeviceName(ua) {
  if (!ua) return 'unknown';
  const match = String(ua).match(/\(([^)]+)\)/);
  if (!match) return 'unknown';
  return match[1]
    .replace(/;\s*/g, '_')
    .replace(/[\s/\\:*?"<>|]+/g, '-')
    .replace(/-+/g, '-')
    .replace(/^[-_]+|[-_]+$/g, '')
    .substring(0, 60);
}

const queue = [];

http.createServer((req, res) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    res.writeHead(204);
    res.end();
    return;
  }

  if (req.method === 'GET' && req.url === '/health') {
    res.writeHead(200);
    res.end('ok');
    return;
  }

  if (req.method === 'GET' && req.url === '/agent.min.js') {
    if (!agentBundle) { res.writeHead(503); res.end('building...'); return; }
    res.setHeader('Content-Type', 'application/javascript');
    res.writeHead(200);
    res.end(agentBundle);
    return;
  }

  if (req.method === 'POST' && req.url === '/log') {
    let body = '';
    req.on('data', chunk => body += chunk);
    req.on('end', () => {
      try {
        const { sessionId, userAgent, logs } = JSON.parse(body);
        const d = new Date(Number(sessionId));
        const date = `${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,'0')}-${String(d.getDate()).padStart(2,'0')}`;
        const time = `${String(d.getHours()).padStart(2,'0')}-${String(d.getMinutes()).padStart(2,'0')}-${String(d.getSeconds()).padStart(2,'0')}`;
        const device = getDeviceName(userAgent);
        const fileName = `${device}_${date}_${time}_${sessionId}`;
        logs.forEach(log => queue.push({ sessionId, fileName, ...log }));
        res.writeHead(200);
        res.end('ok');
      } catch (e) {
        res.writeHead(400);
        res.end('invalid json');
      }
    });
    return;
  }

  res.writeHead(404);
  res.end();
}).listen(PORT, () => {
  console.log(`Remote debug server running on port ${PORT}`);
});

setInterval(() => {
  while (queue.length > 0) {
    const { fileName, type, args, timestamp } = queue.shift();
    const file = path.join(LOGS_DIR, `${fileName}.txt`);
    const line = `[${new Date(timestamp).toISOString()}] [${type}] ${args.join(' ')}\n`;
    fs.appendFileSync(file, line);
  }
}, FLUSH_INTERVAL);
