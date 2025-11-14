'use client';
import { useState, useRef } from 'react';
import { Box, Button, TextField, IconButton, useTheme } from '@mui/material';
import SendIcon from '@mui/icons-material/Send';
import InsertEmoticonIcon from '@mui/icons-material/InsertEmoticon';
import EmojiPicker, { Theme } from 'emoji-picker-react';
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

  const muiTheme = useTheme();
  const isDarkMode = muiTheme.palette.mode === "dark";

  const [isTyping, setIsTyping] = useState(false);
  const typingTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const inputRef = useRef<HTMLTextAreaElement | null>(null);

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

  const addEmoji = (emojiData: { emoji: string }) => {
    setMessageInput(messageInput + emojiData.emoji);

    setShowEmojiPicker(false);
    inputRef.current?.focus();
  };


  return (
    <div className={styles.inputContainer}>
      <Box component="form" onSubmit={onSend} className={styles.inputForm}>

        <div className={styles.emojiButtonWrapper}>
          <IconButton onClick={() => setShowEmojiPicker((prev) => !prev)}>
            <InsertEmoticonIcon />
          </IconButton>

          {showEmojiPicker && (
            <div className={styles.emojiPicker}>
              <EmojiPicker
                onEmojiClick={addEmoji}
                theme={isDarkMode ? Theme.DARK : Theme.LIGHT}
                lazyLoadEmojis
                autoFocusSearch={false}
                previewConfig={{ showPreview: false }}
                searchPlaceHolder="Rechercher..."
              />
            </div>
          )}
        </div>

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
          inputRef={inputRef}
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
