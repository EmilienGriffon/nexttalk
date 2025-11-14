import WebSocket, { WebSocketServer } from 'ws';
import http from 'http';

interface User {
  id: string;
  username: string;
  ws: WebSocket;
}

interface ChatMessage {
  type: 'message' | 'user_joined' | 'user_left' | 'user_list' | 'typing_users' | 'reaction_update';
  username?: string;
  message?: string;
  users?: string[];
  timestamp?: number;
  messageIndex?: number;
  reactions?: { [emoji: string]: number };
}

const users = new Map<WebSocket, User>();
const typingUsersSet = new Set<string>();
const chatMessages: ChatMessage[] = [];

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
  const userList = Array.from(users.values()).map((user) => user.username);
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
  ws.send(JSON.stringify({ type: 'message_history', messages: chatMessages }));

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

      else if (message.type === 'message' && message.message && user) {
        const newMsg: ChatMessage = {
          type: 'message',
          username: user.username,
          message: message.message,
          timestamp: Date.now(),
          reactions: {},
        };
        chatMessages.push(newMsg);
        broadcast(newMsg);
      }

      else if ((message.type === 'typing' || message.type === 'stop_typing') && user) {
        if (message.type === 'typing') typingUsersSet.add(user.username);
        else typingUsersSet.delete(user.username);
        broadcastTypingUsers();
      }

else if (message.type === 'reaction' && user) {
  const { messageIndex, emoji } = message;
  const targetMessage = chatMessages[messageIndex];

  if (targetMessage) {
    if (!targetMessage.reactions) targetMessage.reactions = {};
    targetMessage.reactions[emoji] = (targetMessage.reactions[emoji] || 0) + 1;
    broadcast({
      type: 'reaction_update',
      messageIndex,
      reactions: targetMessage.reactions
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
