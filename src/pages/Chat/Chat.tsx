
import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom';
import { useAppData, type User } from '../../context/AppContext';
import Loading from '../../components/Loading';
import ChatSidebar from '../../components/ChatSidebar';
import Cookies from 'js-cookie';
import axios from 'axios';
import { notification } from 'antd';
import ChatHeader from '../../components/ChatHeader';
import ChatMessages from '../../components/ChatMessages';
import MessageInput from '../../components/MessageInput';

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

  const handleMessageSend = async (e: any, imageFile?: File | null) => {
    e.preventDefault();

    if (!message.trim() && !imageFile)
      return;

    if (!selectedUser) {
      notification.error({ message: 'No user selected', placement: 'top' });
      return;
    }

    const token = Cookies.get('token');
    try {
      const formData = new FormData();
      formData.append('chatId', selectedUser);
      if (message.trim()) {
        formData.append('text', message.trim());
      }
      if (imageFile) {
        formData.append('image', imageFile);
      }

      const { data } = await axios.post('http://localhost:5002/api/v1/chat/message', formData,
        { headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'multipart/form-data' } });

      setMessages((prev) => {
        const currentMessages = prev || [];
        const messageExists = currentMessages.some(msg => msg._id === data.message._id);
        if (!messageExists) {
          return [...currentMessages, data.message];
        }
        return currentMessages;
      });
      setMessage('');

      const displayText = imageFile ? "📷 image" : 'Message sent';
    } catch (error: any) {
      const errMsg = error.response?.data?.message || 'Failed to send message';
      notification.error({ message: errMsg, placement: 'top' })
    }
  }


  const handleTyping = (value: string) => {
    setMessage(value);
    if (!selectedUser) return;
    //socket setup

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
        <ChatHeader user={user} setSidebarOpen={setSidebarOpen} isTyping={isTyping} />
        <ChatMessages selectedUser={selectedUser} messages={messages} loggedInUser={loggedInUser} />
        <MessageInput selectedUser={selectedUser} message={message}
          setMessage={handleTyping} handleMessageSend={handleMessageSend} />
      </div>
    </div>
  )
}
