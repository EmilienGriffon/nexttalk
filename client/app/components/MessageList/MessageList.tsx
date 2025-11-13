'use client';
import { useEffect, useRef } from 'react';
import styles from './MessageList.module.scss';

interface Message {
  type: 'message' | 'user_joined' | 'user_left' | 'user_list';
  username?: string;
  message?: string;
  timestamp?: number;
}

interface MessageListProps {
  messages: Message[];
  username: string;
}

export default function MessageList({ messages, username }: MessageListProps) {
  const endRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  return (
    <div className={styles.messagesContainer}>
      {messages.map((msg, index) => {
        if (msg.type === 'message') {
          const isOwn = msg.username === username;
          return (
            <div
              key={index}
              className={`${styles.messageWrapper} ${isOwn ? styles.own : styles.other}`}
            >
              <div className={`${styles.message} ${isOwn ? styles.own : styles.other}`}>
                {!isOwn && <div className={styles.messageUsername}>{msg.username}</div>}
                <div className={styles.messageText}>{msg.message}</div>
                <div className={styles.messageTime}>
                  {msg.timestamp && new Date(msg.timestamp).toLocaleTimeString()}
                </div>
              </div>
            </div>
          );
        } else if (msg.type === 'user_joined') {
          return (
            <div key={index} className={styles.systemMessage}>
              {msg.username ?? 'Inconnu'} a rejoint le chat 🎉
            </div>
          );
        } else if (msg.type === 'user_left') {
          return (
            <div key={index} className={styles.systemMessage}>
              {msg.username ?? 'Inconnu'} a quitté le chat 👋
            </div>
          );
        }
        return null;
      })}
      <div ref={endRef} />
    </div>
  );
}
