'use client';
import { Box, Button, TextField } from '@mui/material';
import SendIcon from '@mui/icons-material/Send';
import styles from './MessageInput.module.scss';

interface MessageInputProps {
  messageInput: string;
  setMessageInput: (msg: string) => void;
  isConnected: boolean;
  onSend: (e: React.FormEvent) => void;
}

export default function MessageInput({
  messageInput,
  setMessageInput,
  isConnected,
  onSend,
}: MessageInputProps) {
  return (
    <div className={styles.inputContainer}>
      <Box component="form" onSubmit={onSend} className={styles.inputForm}>
        <TextField
          fullWidth
          variant="outlined"
          placeholder="Tape ton message..."
          value={messageInput}
          onChange={(e) => setMessageInput(e.target.value)}
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
