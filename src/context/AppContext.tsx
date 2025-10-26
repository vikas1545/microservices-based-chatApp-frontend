import type React from "react";
import { createContext, useContext, useEffect, useState, type ReactNode } from "react";
import Cookies from "js-cookie";
import axios from "axios";
import { notification } from "antd";

export interface User {
    _id: string;
    name: string;
    email: string;
}

export interface Chat {
    _id: string;
    users: string[];
    latestMessage: {
        text: string;
        sender: string;
    };
    createdAt: string;
    updatedAt: string;
    unseenCount?: number;
}

export interface Chats {
    _id: string;
    user: User;
    chat: Chat;
}

interface AppContextType {
    user: User | null;
    users: User[] | null;
    loading: boolean;
    isAuth: boolean;
    setUser: React.Dispatch<React.SetStateAction<User | null>>;
    setIsAuth: React.Dispatch<React.SetStateAction<boolean>>;
    logOut: () => void;
    fetchChats: () => Promise<void>;
    fetchUsers: () => Promise<void>;
    chats: Chats[] | null;
    setChats: React.Dispatch<React.SetStateAction<Chats[] | null>>
}

const AppContext = createContext<AppContextType | undefined>(undefined)

interface AppProviderProps {
    children: ReactNode;
}

export const AppProvider: React.FC<AppProviderProps> = ({ children }) => {
    const [user, setUser] = useState<User | null>(null);
    const [loading, setLoading] = useState<boolean>(true);
    const [isAuth, setIsAuth] = useState<boolean>(false);
    const [chats, setChats] = useState<Chats[] | null>(null);
    const [users, setUsers] = useState<User[] | null>(null);

    const fetchUser = async () => {
        try {
            setLoading(true);
            const token = Cookies.get('token');
            const { data } = await axios.get('http://localhost:5000/api/v1/me', { headers: { Authorization: `Bearer ${token}` } });
            setUser(data);
            setIsAuth(true);
        } catch (error) {
            notification.error({ message: 'Failed to fetch user data. Please login again.' });
        } finally {
            setLoading(false);
        }
    }

    const fetchChats = async () => {
        try {
            setLoading(true);
            const token = Cookies.get('token');
            const { data } = await axios.get('http://localhost:5002/api/v1/chat/all', { headers: { Authorization: `Bearer ${token}` } });
            setChats(data.chats);
        } catch (error) {
            notification.error({ message: 'Failed to fetch chats' });
        } finally {
            setLoading(false);
        }
    }

    const fetchUsers = async () => {
        try {
            setLoading(true);
            const token = Cookies.get('token');
            const { data } = await axios.get('http://localhost:5000/api/v1/all-users', { headers: { Authorization: `Bearer ${token}` } });
            setUsers(data.users);
        } catch (error) {
            notification.error({ message: 'Failed to fetch users' });
        } finally {
            setLoading(false);
        }
    }

    useEffect(() => {
        fetchUser();
        fetchChats();
        fetchUsers()
    }, []);

    const logOut = () => {
        Cookies.remove('token');
        setUser(null)
        setIsAuth(false)
        notification.success({ message: 'Logged Out successfully' });
    }

    return <AppContext.Provider value={{
        user, setUser, loading, isAuth, setIsAuth, logOut,
        fetchChats, fetchUsers, users, chats, setChats
    }}>
        {children}
    </AppContext.Provider>
}

export const useAppData = (): AppContextType => {
    const context = useContext(AppContext);
    if (!context) {
        throw new Error("useAppData must be used within AppProvider");
    }
    return context;
}