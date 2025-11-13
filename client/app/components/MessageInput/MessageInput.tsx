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

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
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

  const handleKeyDown = (e: React.KeyboardEvent<HTMLDivElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();

      if (messageInput.trim()) {
        const fakeEvent = { preventDefault: () => {} } as unknown as React.FormEvent;
        onSend(fakeEvent);
      }
    }
  };

  return (
    <div className={styles.inputContainer}>
      <Box component="form" onSubmit={onSend} className={styles.inputForm}>
        <TextField
          fullWidth
          multiline
          minRows={1}
          maxRows={6}
          variant="outlined"
          placeholder="Écris ton message... (Shift + Entrée pour une nouvelle ligne)"
          value={messageInput}
          onChange={handleChange}
          onKeyDown={handleKeyDown}
          disabled={!isConnected}
          sx={{
            '& .MuiOutlinedInput-root': {
              borderRadius: '12px',
            },
            '& textarea': {
              resize: 'none',
            },
          }}
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
