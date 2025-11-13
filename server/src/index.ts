import WebSocket, { WebSocketServer } from 'ws';
import http from 'http';

interface User {
  id: string;
  username: string;
  ws: WebSocket;
}

interface ChatMessage {
  type: 'message' | 'user_joined' | 'user_left' | 'user_list';
  username?: string;
  message?: string;
  users?: string[];
  timestamp?: number;
}

const users = new Map<WebSocket, User>();

const server = http.createServer();

const wss = new WebSocketServer({ server });

function broadcast(message: ChatMessage, excludeWs?: WebSocket) {
  const messageStr = JSON.stringify(message);
  users.forEach((user, ws) => {
    if (ws !== excludeWs && ws.readyState === WebSocket.OPEN) {
      ws.send(messageStr);
    }
  });
}

function sendUserList() {
  const userList = Array.from(users.values()).map(user => user.username);
  broadcast({
    type: 'user_list',
    users: userList
  });
}

function generateId(): string {
  return Math.random().toString(36).substring(2, 9);
}

wss.on('connection', (ws: WebSocket) => {
  console.log('Nouvelle connexion WebSocket');

  ws.on('message', (data: string) => {
    try {
      const message = JSON.parse(data.toString());

      if (message.type === 'join' && message.username) {
        const user: User = {
          id: generateId(),
          username: message.username,
          ws: ws
        };
        
        users.set(ws, user);
        
        console.log(`${user.username} a rejoint le chat`);

        broadcast({
          type: 'user_joined',
          username: user.username,
          timestamp: Date.now()
        }, ws);

        sendUserList();
      }
      
      else if (message.type === 'message' && message.message) {
        const user = users.get(ws);
        
        if (user) {
          console.log(`Message de ${user.username}: ${message.message}`);
          
          broadcast({
            type: 'message',
            username: user.username,
            message: message.message,
            timestamp: Date.now()
          });
        }
      }
    } catch (error) {
      console.error('Erreur lors du parsing du message:', error);
    }
  });

  ws.on('close', () => {
    const user = users.get(ws);
    
    if (user) {
      console.log(`${user.username} a quitté le chat`);
      
      users.delete(ws);
      
      broadcast({
        type: 'user_left',
        username: user.username,
        timestamp: Date.now()
      });

      sendUserList();
    }
  });

  ws.on('error', (error) => {
    console.error('Erreur WebSocket:', error);
  });
});

const PORT = process.env.PORT || 8080;
server.listen(PORT, () => {
  console.log(`🚀 Serveur WebSocket démarré sur le port ${PORT}`);
});