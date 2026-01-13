import { createContext, useContext, useEffect, useState, type ReactNode } from "react";
import { io, Socket } from "socket.io-client";
import { useAppData } from "./AppContext";

interface SocketContextType {
    socket: Socket | null;
    onlineUsers: string[];
}

const SocketContext = createContext<SocketContextType>({ socket: null, onlineUsers: [] });

interface SocketProviderProps {
    children: ReactNode;
}


//const chatServerURL = import.meta.env.VITE_CHAT_SERVER_URL as string;
const chat_service = "http://localhost:5002";

export const SocketProvider = ({ children }: SocketProviderProps) => {

    const [socket, setSocket] = useState<Socket | null>(null);
    const [onlineUsers, setOnlineUsers] = useState<string[]>([]);
    const { user } = useAppData();

    useEffect(() => {
        if (!user?._id) return;
        const newSocket = io(chat_service, {
            query: { userId: user._id }
        });
        setSocket(newSocket);

        newSocket.on("getOnlineUser", (users: string[]) => {
            setOnlineUsers(users);
        });

        return () => {
            newSocket.disconnect();
        };
    }, [user?._id]);

    return (
        <SocketContext.Provider value={{ socket, onlineUsers }}>
            {children}
        </SocketContext.Provider>
    );
}

export const socketData = () => useContext(SocketContext);