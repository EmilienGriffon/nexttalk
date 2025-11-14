import { useEffect, useState, useRef, useCallback } from 'react';

export interface ChatMessage {
    type: 'message' | 'user_joined' | 'user_left' | 'user_list' | 'typing_users' | 'reaction' | 'reaction_update';
    username?: string;
    message?: string;
    users?: string[];
    timestamp?: string;
    messageIndex?: number;
    reactions?: Record<string, number>;
}

export const useWebSocket = (url: string, username: string) => {
    const [messages, setMessage] = useState<ChatMessage[]>([]);
    const [users, setUsers] = useState<string[]>([]);
    const [typingUsers, setTypingUsers] = useState<string[]>([]);
    const [isConnected, setIsConnected] = useState(false);
    const [soundEnabled, setSoundEnabled] = useState(true);

    const wsRef = useRef<WebSocket | null>(null);
    const originalTitle = useRef<string>('');
    const messageAudio = useRef<HTMLAudioElement | null>(null);

    useEffect(() => {
        if (typeof window === 'undefined') return;

        originalTitle.current = document.title;
        messageAudio.current = new Audio('/notification.mp3');

        if ("Notification" in window && Notification.permission !== "granted") {
            Notification.requestPermission();
        }

        const handleVisibilityChange = () => {
            if (!document.hidden) {
                document.title = originalTitle.current;
            }
        };

        document.addEventListener("visibilitychange", handleVisibilityChange);
        return () => {
            document.removeEventListener("visibilitychange", handleVisibilityChange);
        };
    }, []);

    useEffect(() => {
        if (!username || typeof window === 'undefined') return;

        const ws = new WebSocket(url);
        wsRef.current = ws;

        ws.onopen = () => {
            console.log("Connexion WebSocket établie");
            setIsConnected(true);
            ws.send(JSON.stringify({ type: 'join', username }));
        };

        ws.onmessage = (event) => {
            try {
                const data: ChatMessage = JSON.parse(event.data);

                if (data.type === 'user_list') setUsers(data.users || []);
                else if (data.type === 'typing_users') setTypingUsers(data.users || []);
                else if (data.type === 'message' || data.type === 'user_joined' || data.type === 'user_left') {
                    setMessage(prev => [...prev, data]);

                    if (data.type === 'message' && data.username !== username) {
                        if (document.hidden && Notification.permission === "granted") {
                            new Notification(`Nouveau message de ${data.username}`, {
                                body: data.message,
                                icon: "/favicon.ico",
                            });
                        }

                        if (document.hidden) {
                            document.title = `💬 Nouveau message de ${data.username}`;
                        }

                        if (soundEnabled && messageAudio.current) {
                            messageAudio.current.currentTime = 0;
                            messageAudio.current.play().catch(() => {});
                        }
                    }
                }
                else if (data.type === 'reaction_update') {
                    setMessage(prev => {
                        const updated = [...prev];
                        const target = data.messageIndex !== undefined ? updated[data.messageIndex] : undefined;
                        if (target) target.reactions = data.reactions;
                        return updated;
                    });
                }

            } catch (error) {
                console.error("Erreur WebSocket:", error);
            }
        };

        ws.onerror = (error) => console.error("Erreur WebSocket:", error);
        ws.onclose = () => setIsConnected(false);

        return () => {
            if (ws.readyState === WebSocket.OPEN) ws.close();
        };
    }, [url, username, soundEnabled]);

    const sendMessage = useCallback((message: string) => {
        if (wsRef.current && wsRef.current.readyState === WebSocket.OPEN) {
            wsRef.current.send(JSON.stringify({ type: 'message', message }));
        }
    }, []);

    const sendTypingStatus = useCallback((typing: boolean) => {
        if (wsRef.current && wsRef.current.readyState === WebSocket.OPEN) {
            wsRef.current.send(JSON.stringify({ type: typing ? 'typing' : 'stop_typing', username }));
        }
    }, [username]);

    const sendReaction = useCallback((messageIndex: number, emoji: string) => {
        if (wsRef.current && wsRef.current.readyState === WebSocket.OPEN) {
            wsRef.current.send(JSON.stringify({ type: 'reaction', messageIndex, emoji, username }));
        }
    }, [username]);

    const toggleSound = useCallback(() => {
        setSoundEnabled(prev => !prev);
    }, []);

    return { messages, users, typingUsers, isConnected, sendMessage, sendTypingStatus, sendReaction, soundEnabled, toggleSound };
};
