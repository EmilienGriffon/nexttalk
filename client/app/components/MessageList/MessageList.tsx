'use client';
import { useEffect, useRef, useState } from 'react';
import styles from './MessageList.module.scss';
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import rehypeRaw from "rehype-raw";
import rehypeSanitize from "rehype-sanitize";
import remarkBreaks from "remark-breaks";

interface Message {
  type: 'message' | 'user_joined' | 'user_left' | 'user_list' | 'typing_users' | 'reaction' | 'reaction_update';
  username?: string;
  message?: string;
  timestamp?: number;
  reactions?: Record<string, number>;
}

interface MessageListProps {
  messages: Message[];
  username: string;
  typingUsers?: string[];
  onReact?: (messageIndex: number, emoji: string) => void;
}

export default function MessageList({ messages, username, typingUsers = [], onReact }: MessageListProps) {
  const endRef = useRef<HTMLDivElement>(null);
  const [hoveredMessage, setHoveredMessage] = useState<number | null>(null);
  const [reactionBarVisible, setReactionBarVisible] = useState<number | null>(null);

  const EMOJIS = ["👍", "❤️", "😂", "😮", "😢", "👀"];

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
              onMouseEnter={() => setHoveredMessage(index)}
              onMouseLeave={() => {
                setHoveredMessage(null);
                setReactionBarVisible(null);
              }}
            >
              <div className={`${styles.message} ${isOwn ? styles.own : styles.other}`}>
                
                {!isOwn && <div className={styles.messageUsername}>{msg.username}</div>}

                <div className={styles.messageText}>
                  <ReactMarkdown
                    remarkPlugins={[remarkGfm, remarkBreaks]}
                    rehypePlugins={[rehypeRaw, rehypeSanitize]}
                    components={{
                      h1: (props) => <h1 className={styles.markdownH1} {...props} />,
                      h2: (props) => <h2 className={styles.markdownH2} {...props} />,
                      h3: (props) => <h3 className={styles.markdownH3} {...props} />,
                      strong: (props) => <strong className={styles.markdownBold} {...props} />,
                      em: (props) => <em className={styles.markdownItalic} {...props} />,
                      code: ({ children, className }) => {
                        const text = String(children ?? '').trim();
                        const isMultiline = text.includes('\n');
                        if (isMultiline) {
                          return (
                            <pre className={styles.codeBlock}>
                              <code className={className}>{text}</code>
                            </pre>
                          );
                        }
                        return <code className={`${styles.inlineCode} ${className || ''}`}>{text}</code>;
                      },
                      blockquote: (props) => <blockquote className={styles.blockQuote} {...props} />,
                      a: (props) => (
                        <a {...props} target="_blank" rel="noopener noreferrer" className={styles.link} />
                      ),
                    }}
                  >
                    {msg.message ?? ""}
                  </ReactMarkdown>

                  {msg.reactions && Object.keys(msg.reactions).length > 0 && (
                    <div className={styles.reactions}>
                      {Object.entries(msg.reactions).map(([emoji, count]) => (
                        <span key={emoji} className={styles.reaction}>
                          {emoji} {count}
                        </span>
                      ))}
                    </div>
                  )}
                </div>

                {hoveredMessage === index && (
                  <button
                    className={styles.addReactionButton}
                    type="button"
                    onClick={() => setReactionBarVisible(reactionBarVisible === index ? null : index)}
                  >
                    +
                  </button>
                )}

                {reactionBarVisible === index && (
                  <div className={styles.reactionBar}>
                    {EMOJIS.map((emoji) => (
                      <button
                        key={emoji}
                        className={styles.reactionEmoji}
                        onClick={() => onReact && onReact(index, emoji)}
                      >
                        {emoji}
                      </button>
                    ))}
                  </div>
                )}

                <div className={styles.messageTime}>
                  {msg.timestamp && new Date(msg.timestamp).toLocaleTimeString()}
                </div>
              </div>
            </div>
          );
        }

        if (msg.type === 'user_joined') {
          return (
            <div key={index} className={styles.systemMessage}>
              {msg.username ?? 'Inconnu'} a rejoint le chat 🎉
            </div>
          );
        }
        if (msg.type === 'user_left') {
          return (
            <div key={index} className={styles.systemMessage}>
              {msg.username ?? 'Inconnu'} a quitté le chat 👋
            </div>
          );
        }

        return null;
      })}

      {typingUsers.length > 0 && (
        <div className={styles.typingBubbleWrapper}>
          {typingUsers.map((user) => (
            <div key={user} className={styles.typingBubble}>
              <span className={styles.username}>{user}</span>
              <span className={styles.dots}>
                <span></span>
                <span></span>
                <span></span>
              </span>
            </div>
          ))}
        </div>
      )}

      <div ref={endRef} />
    </div>
  );
}
