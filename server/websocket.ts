import { WebSocket, WebSocketServer } from 'ws';
import { Server } from 'http';

interface Client {
  ws: WebSocket;
  connectionId: string;
}

export class OrderUpdateService {
  private wss: WebSocketServer;
  private clients: Set<Client> = new Set();

  constructor(server: Server) {
    this.wss = new WebSocketServer({ 
      server,
      path: '/ws'
    });

    this.wss.on('connection', (ws: WebSocket) => {
      const connectionId = Math.random().toString(36).substring(7);
      const client: Client = { ws, connectionId };
      this.clients.add(client);

      ws.send(JSON.stringify({ type: 'connected', connectionId }));

      ws.on('close', () => {
        this.clients.delete(client);
      });

      ws.on('error', (error) => {
        console.error('WebSocket error:', error);
        this.clients.delete(client);
      });
    });
  }

  notifyOrderUpdate(orderId: string) {
    const message = JSON.stringify({
      type: 'order_update',
      orderId,
      timestamp: new Date().toISOString()
    });

    this.clients.forEach(client => {
      if (client.ws.readyState === WebSocket.OPEN) {
        client.ws.send(message);
      }
    });
  }

  notifyNewOrder(orderId: string) {
    const message = JSON.stringify({
      type: 'new_order',
      orderId,
      timestamp: new Date().toISOString()
    });

    this.clients.forEach(client => {
      if (client.ws.readyState === WebSocket.OPEN) {
        client.ws.send(message);
      }
    });
  }
}

export let orderUpdateService: OrderUpdateService;

export function setupWebSocket(server: Server) {
  orderUpdateService = new OrderUpdateService(server);
  console.log('WebSocket server initialized');
  return orderUpdateService;
}
