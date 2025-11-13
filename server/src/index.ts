import WebSocket, { WebSocketServer } from 'ws';
import http from 'http';

interface User {
  id: string;
  username: string;
  ws: WebSocket;
}

interface ChatMessage {
  type: 'message' | 'user_joined' | 'user_left' | 'user_list' | 'typing_users';
  username?: string;
  message?: string;
  users?: string[];
  timestamp?: number;
}

const users = new Map<WebSocket, User>();
const typingUsersSet = new Set<string>();

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
  broadcast({ type: 'user_list', users: userList });
}

function broadcastTypingUsers() {
  broadcast({ type: 'typing_users', users: Array.from(typingUsersSet) });
}

function generateId(): string {
  return Math.random().toString(36).substring(2, 9);
}

wss.on('connection', (ws: WebSocket) => {
  console.log('Nouvelle connexion WebSocket');

  ws.on('message', (data: string) => {
    try {
      const message = JSON.parse(data.toString());
      const user = users.get(ws);

      if (message.type === 'join' && message.username) {
        const newUser: User = { id: generateId(), username: message.username, ws };
        users.set(ws, newUser);

        console.log(`${newUser.username} a rejoint le chat`);

        broadcast({ type: 'user_joined', username: newUser.username, timestamp: Date.now() }, ws);
        sendUserList();
      }

      else if (message.type === 'message' && message.message) {
        if (user) {
          console.log(`Message de ${user.username}: ${message.message}`);
          broadcast({ type: 'message', username: user.username, message: message.message, timestamp: Date.now() });
        }
      }

      else if ((message.type === 'typing' || message.type === 'stop_typing') && user) {
        if (message.type === 'typing') typingUsersSet.add(user.username);
        else typingUsersSet.delete(user.username);
        broadcastTypingUsers();
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
      typingUsersSet.delete(user.username);
      broadcast({ type: 'user_left', username: user.username, timestamp: Date.now() });
      sendUserList();
      broadcastTypingUsers();
    }
  });

  ws.on('error', (error) => console.error('Erreur WebSocket:', error));
});

const PORT = process.env.PORT || 8080;
server.listen(PORT, () => console.log(`🚀 Serveur WebSocket démarré sur le port ${PORT}`));
