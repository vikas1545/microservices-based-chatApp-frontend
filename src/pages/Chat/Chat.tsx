
import React, { use, useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom';
import { useAppData, type User } from '../../context/AppContext';
import Loading from '../../components/Loading';
import ChatSidebar from '../../components/ChatSidebar';
import Cookies from 'js-cookie';
import axios from 'axios';
import { notification } from 'antd';
import ChatHeader from '../../components/ChatHeader';
import ChatMessages from '../../components/ChatMessages';

export interface Message {
  _id: string;
  chatId: string;
  //senderId: string;
  sender: string;
  text?: string;
  image?: {
    url: string;
    publicId: string
  };
  messageType: 'text' | 'image';
  seen: boolean;
  seenAt?: string;
  createdAt?: string
}

export default function Chat() {
  const { isAuth, loading, logOut, chats, user: loggedInUser, users, setChats, fetchChats } = useAppData();
  const [selectedUser, setSelectedUser] = useState<string | null>(null);
  const [message, setMessage] = useState('');
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [messages, setMessages] = useState<Message[] | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const [showAllUsers, setShowAllUsers] = useState(false);
  const [isTyping, setIsTyping] = useState(false);
  // const [typingTimeOut, setTypingTimeOut] = useState<NodeJS.Timeout|null>(null);
  const [typingTimeOut, setTypingTimeOut] = useState<any | null>(null);

  const navigate = useNavigate();


  useEffect(() => {
    if (!isAuth && !loading) {
      navigate('/login');
    }
  }, [isAuth, loading])


  const handleLogout = () => logOut();

  const fetchChat = async () => {
    try {
      const token = Cookies.get('token');
      const { data } = await axios.get(`http://localhost:5002/api/v1/message/${selectedUser}`,
        { headers: { Authorization: `Bearer ${token}` } });

      setMessages(data.messages);
      setUser(data.user);
      await fetchChats();
    } catch (error) {
      notification.error({ message: 'Failed to start chat', placement: 'top' })
    }
  }

  const createChat = async (u: User) => {
    try {
      const token = Cookies.get('token');
      const { data } = await axios.post('http://localhost:5002/api/v1/chat/new', {
        userId: loggedInUser?._id,
        otherUserId: u._id
      }, { headers: { Authorization: `Bearer ${token}` } });

      setSelectedUser(data.chatId || null);
      setShowAllUsers(false);
      await fetchChats();
    } catch (error) {
      notification.error({ message: 'Failed to start chat', placement: 'top' })
    }
  }

  useEffect(() => {
    if (selectedUser) {
      fetchChat();
    }
  }, [selectedUser]);

  if (loading) {
    return <Loading />;
  }

  return (
    <div className='min-h-screen flex bg-gray-900 text-white relative overflow-hidden'>
      <ChatSidebar
        sidebarOpen={sidebarOpen}
        setSidebarOpen={setSidebarOpen}
        showAllUsers={showAllUsers}
        setShowAllUsers={setShowAllUsers}
        users={users}
        loggedInUser={loggedInUser}
        chats={chats}
        selectedUser={selectedUser}
        setSelectedUser={setSelectedUser}
        handleLogOut={handleLogout}
        createChat={createChat}
      />

      <div className='flex-1 flex flex-col justify-between p-4 backdrop-blur-xl bg-white/5 border-1 border-white/10'>
        <ChatHeader user={user} setSidebarOpen={setSidebarOpen} isTyping={isTyping}/>
        <ChatMessages selectedUser={selectedUser} messages={messages} loggedInUser={loggedInUser}/>
      </div>
    </div>
  )
}
