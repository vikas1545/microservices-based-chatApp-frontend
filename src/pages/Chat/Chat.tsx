
import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom';
import { useAppData, type User } from '../../context/AppContext';
import Loading from '../../components/Loading';
import ChatSidebar from '../../components/ChatSidebar';

export interface Message {
  _id: string;
  chatId: string;
  senderId: string;
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
  const { isAuth, loading, logOut, chats, user: loggedInUser, users, setChats } = useAppData();
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

  if (loading) {
    return <Loading />;
  }

  const handleLogout = () => logOut()

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
      />
    </div>
  )
}
