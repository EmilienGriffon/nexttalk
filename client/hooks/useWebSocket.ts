import { useEffect, useState, useRef, useCallback } from 'react';

export interface ChatMessage {
    type: 'message' | 'user_joined' | 'user_left' | 'user_list';
    username?: string;
    message?: string;
    users?: string[];
    timestamp?: string;
}

export const useWebSocket = (url: string, username: string) => {
    const [messages, setMessage] = useState<ChatMessage[]>([]);
    const [users, setUsers] = useState<string[]>([]);
    const [isConnected, setIsConnected] = useState(false);
    const wsRef = useRef<WebSocket | null>(null);

    useEffect(() => {
        if (!username) return;

        const ws = new WebSocket(url);
        wsRef.current = ws;

        ws.onopen = () => {
            console.log("Connexion WebSocket établie");
            setIsConnected(true);

            ws.send(JSON.stringify({
                type: 'join',
                username: username
            }));
        };

        ws.onmessage = (event) => {
            try {
                const data: ChatMessage = JSON.parse(event.data);

                if (data.type === 'user_list') {
                    setUsers(data.users || []);
                } else if (data.type === 'message' || data.type === 'user_joined' || data.type === 'user_left') {
                    setMessage((prev) => [...prev, data]);
                }
            } catch (error) {
                console.error("Erreur lors du traitement du message WebSocket:", error);
            }
        };

        ws.onerror = (error) => {
            console.error("Erreur WebSocket:", error);
        };

        ws.onclose = () => {
            console.log("Connexion WebSocket fermée");
            setIsConnected(false);
        };

        return () => {
            if (ws.readyState === WebSocket.OPEN) {
                ws.close();
            }
        };
    }, [url, username]);

    const sendMessage = useCallback((message: string) => {
        if (wsRef.current && wsRef.current.readyState === WebSocket.OPEN) {
            wsRef.current.send(JSON.stringify({
                type: 'message',
                message: message,
            }));
        }
    }, []);

    return { messages, users, isConnected, sendMessage };
}