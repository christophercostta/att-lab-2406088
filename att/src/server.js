import http from 'node:http';
import { DataManager } from './DataManager.js';

const db = new DataManager('./estacao.json');

const server = http.createServer(async (req, res) => {
  const { method, url } = req;

 if (method === 'GET' && (url === '/' || url === '/index.html')) {
    const htmlPath = path.resolve('src', 'index.html'); 
    res.writeHead(200, { 'Content-Type': 'text/html; charset=utf-8' });
    return res.end(fs_sync.readFileSync(htmlPath));
  }

  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  // Resposta para a "pergunta de segurança" do navegador
  if (method === 'OPTIONS') {
    res.writeHead(204);
    res.end();
    return;
  }

  // 2. ROTA GET: Listar histórico
  if (method === 'GET' && url === '/historico') {
    const logs = await db.read();
    res.writeHead(200, { 'Content-Type': 'application/json' });
    return res.end(JSON.stringify(logs));
  }

  // 3. ROTA POST: Coleta de dados (Usando Streams)
  if (method === 'POST' && url === '/coleta') {
    let body = '';

    // Processamento de Stream (conforme pedido na aula)
    req.on('data', (chunk) => {
      body += chunk.toString();
    });

    req.on('end', async () => {
      try {
        const sensorData = JSON.parse(body);
        await db.save(sensorData);
        
        res.writeHead(201, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ status: 'Sucesso', mensagem: 'Dados salvos!' }));
      } catch (err) {
        res.writeHead(400);
        res.end(JSON.stringify({ error: 'Formato JSON inválido' }));
      }
    });
    return;
  }

  // Rota padrão para caminhos não encontrados
  res.writeHead(404).end();
});

server.listen(3000, () => console.log('🚀 Servidor rodando em http://localhost:3000'));