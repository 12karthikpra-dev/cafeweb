// SSE Event Broadcaster
const clients = new Set();

const eventsHandler = (req, res) => {
  res.writeHead(200, {
    'Content-Type': 'text/event-stream',
    'Cache-Control': 'no-cache',
    'Connection': 'keep-alive',
    'Access-Control-Allow-Origin': '*'
  });

  res.write('data: {"type":"connected","message":"Live SSE Stream Active"}\n\n');
  clients.add(res);

  req.on('close', () => {
    clients.delete(res);
  });
};

const broadcast = (eventType, payload) => {
  const data = JSON.stringify({ type: eventType, data: payload, timestamp: new Date().toISOString() });
  for (const client of clients) {
    client.write(`data: ${data}\n\n`);
  }
};

module.exports = {
  eventsHandler,
  broadcast
};
