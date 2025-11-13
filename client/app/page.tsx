'use client';

import { useState } from 'react';
import { ThemeProvider, CssBaseline, Typography } from '@mui/material';
import { darkRedTheme } from '@/theme';
import { useWebSocket } from '@/hooks/useWebSocket';
import Sidebar from './components/Sidebar/Sidebar';
import MessageList from './components/MessageList/MessageList';
import MessageInput from './components/MessageInput/MessageInput';
import LoginScreen from './components/LoginScreen/LoginScreen';
import styles from '@/styles/chat.module.scss';

export default function ChatPage() {
  const [username, setUsername] = useState('');
  const [isJoined, setIsJoined] = useState(false);
  const [messageInput, setMessageInput] = useState('');

  const { messages, users, isConnected, sendMessage } = useWebSocket(
    'ws://localhost:8080',
    isJoined ? username : ''
  );

const handleJoin = () => {
  setIsJoined(true);
};

  const handleSend = (e: React.FormEvent) => {
    e.preventDefault();
    if (messageInput.trim() && isConnected) {
      sendMessage(messageInput);
      setMessageInput('');
    }
  };

  if (!isJoined) {
    return <LoginScreen username={username} setUsername={setUsername} onJoin={handleJoin} />;
  }

  return (
    <ThemeProvider theme={darkRedTheme}>
      <CssBaseline />
      <div className={styles.chatContainer}>
        <Sidebar users={users} isConnected={isConnected} />
        <div className={styles.mainChat}>
          <div className={styles.chatHeader}>
            <Typography variant="h1" component="h1">
              Bienvenue, {username} ! 👋
            </Typography>
          </div>

          <MessageList messages={messages.map(msg =>
            ({ ...msg, username: msg.username ?? 'Inconnu', timestamp: msg.timestamp ? Number(msg.timestamp) : undefined, }))}
            username={username} />
          <MessageInput messageInput={messageInput} setMessageInput={setMessageInput} isConnected={isConnected} onSend={handleSend} />
        </div>
      </div>
    </ThemeProvider>
  );
}
