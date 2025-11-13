'use client';
import { useState, useRef } from 'react';
import { Box, Button, TextField } from '@mui/material';
import SendIcon from '@mui/icons-material/Send';
import styles from './MessageInput.module.scss';

interface MessageInputProps {
  messageInput: string;
  setMessageInput: (msg: string) => void;
  isConnected: boolean;
  onSend: (e: React.FormEvent) => void;
  sendTypingStatus: (typing: boolean) => void;
}

export default function MessageInput({
  messageInput,
  setMessageInput,
  isConnected,
  onSend,
  sendTypingStatus,
}: MessageInputProps) {
  const [isTyping, setIsTyping] = useState(false);
  const typingTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setMessageInput(e.target.value);

if (!isTyping) {
  setIsTyping(true);
  sendTypingStatus(true);
}

if (typingTimeoutRef.current) clearTimeout(typingTimeoutRef.current);

typingTimeoutRef.current = setTimeout(() => {
  setIsTyping(false);
  sendTypingStatus(false);
}, 1500);
  };

  return (
    <div className={styles.inputContainer}>
      <Box component="form" onSubmit={onSend} className={styles.inputForm}>
        <TextField
          fullWidth
          variant="outlined"
          placeholder="Tape ton message..."
          value={messageInput}
          onChange={handleChange}
          disabled={!isConnected}
        />
        <Button
          type="submit"
          variant="contained"
          size="large"
          endIcon={<SendIcon />}
          disabled={!isConnected || !messageInput.trim()}
        >
          Envoyer
        </Button>
      </Box>
    </div>
  );
}
