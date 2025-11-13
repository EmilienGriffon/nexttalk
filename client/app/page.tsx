'use client';

import { useState } from 'react';
import { ThemeProvider, CssBaseline, Typography, FormControlLabel, Switch } from '@mui/material';
import { darkTheme, lightTheme } from '@/theme';
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
  const [isDark, setIsDark] = useState(true);

  const { messages, users, isConnected, sendMessage } = useWebSocket(
    'ws://localhost:8080',
    isJoined ? username : ''
  );

  const handleJoin = () => setIsJoined(true);

  const handleSend = (e: React.FormEvent) => {
    e.preventDefault();
    if (messageInput.trim() && isConnected) {
      sendMessage(messageInput);
      setMessageInput('');
    }
  };

  const toggleTheme = () => setIsDark(!isDark);

  const currentTheme = isDark ? darkTheme : lightTheme;

  if (!isJoined) {
    return (
      <ThemeProvider theme={currentTheme}>
        <CssBaseline />
        <LoginScreen username={username} setUsername={setUsername} onJoin={handleJoin} />
      </ThemeProvider>
    );
  }

  return (
    <ThemeProvider theme={currentTheme}>
      <CssBaseline />
        <div data-theme={isDark ? 'dark' : 'light'} className={styles.chatContainer}>
          <Sidebar users={users} isConnected={isConnected} />
          <div className={styles.mainChat}>
            <div className={styles.chatHeader} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <Typography variant="h1" component="h1">
                Bienvenue, {username} ! 👋
              </Typography>
              <FormControlLabel
                control={
                  <Switch
                    checked={isDark}
                    onChange={toggleTheme}
                    color="secondary"
                    sx={{
                      '& .MuiSwitch-thumb': { transition: 'all 0.3s' },
                      '& .MuiSwitch-track': { transition: 'background-color 0.3s' },
                    }}
                  />
                }
                label={isDark ? '🌙 Mode sombre' : '☀️ Mode clair'}
              />
            </div>
            <MessageList
              messages={messages.map((msg) => ({
                ...msg,
                username: msg.username ?? 'Inconnu',
                timestamp: msg.timestamp ? Number(msg.timestamp) : undefined,
              }))}
              username={username}
            />
            <MessageInput
              messageInput={messageInput}
              setMessageInput={setMessageInput}
              isConnected={isConnected}
              onSend={handleSend}
            />
          </div>
        </div>
    </ThemeProvider>
  );
}
