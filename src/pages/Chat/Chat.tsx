
import { useEffect, useState } from 'react'
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
import { socketData } from '../../context/SocketContext';

const chat_service = import.meta.env.VITE_CHAT_BASE_URL;
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
  const { onlineUsers, socket } = socketData();

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
      const { data } = await axios.get(`${chat_service}/message/${selectedUser}`,
        { headers: { Authorization: `Bearer ${token}` } });

      setMessages(data.messages);
      setUser(data.user);
      await fetchChats();
    } catch (error) {
      notification.error({ message: 'Failed to start chat', placement: 'top' })
    }
  }

  /*

  const moveChatToTop = (chatId: string, newMessage: any, updatedUnseenCount = true) => {

    setChats((prev) => {
      if (!prev) return null;

      const updatedChats = [...prev];
      const chatIndex = updatedChats.findIndex((chat) => chat.chat._id === chatId)

      if (chatIndex !== -1) {
        const [moveChat] = updatedChats.slice(chatIndex, 1);

        const updatedChat = {
          ...moveChat,
          chat: {
            ...moveChat?.chat,
            latestMessage: {
              text: newMessage.text,
              sender: newMessage.sender
            },
            updatedAt: new Date().toString(),
            unseenCount: updatedUnseenCount && newMessage.sender !== loggedInUser?._id ?
              (moveChat.chat.unseenCount || 0) + 1 : moveChat.chat.unseenCount || 0

          }
        }

        updatedChats.unshift(updatedChat);
      }
      return updatedChats;
    })

  };

  */

  const resetUnseenCount = (chatId: string) => {
    setChats((prev) => {
      if (!prev) return null;

      return prev.map((chat) => {
        if (chat.chat._id === chatId) {
          return {
            ...chat,
            chat: {
              ...chat.chat,
              unseenCount: 0
            }
          }
        }
        return chat;
      });
    });
  }

  const createChat = async (u: User) => {
    try {
      const token = Cookies.get('token');
      const { data } = await axios.post(`${chat_service}/chat/new`, {
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

    //Socket Work
    if (typingTimeOut) {
      clearTimeout(typingTimeOut);
      setTypingTimeOut(null)
    }

    socket?.emit("stopTyping", { chatId: selectedUser, userId: loggedInUser?._id });
    // setIsTyping(false);

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

      const { data } = await axios.post(`${chat_service}/chat/message`, formData,
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

      //const displayText = imageFile ? "📷 image" : 'Message sent';
      //moveChatToTop(selectedUser!, { text: displayText, sender: data.sender }, false);

    } catch (error: any) {
      const errMsg = error.response?.data?.message || 'Failed to send message';
      notification.error({ message: errMsg, placement: 'top' })
    }
  }


  const handleTyping = (value: string) => {
    setMessage(value);
    if (!selectedUser || !socket) return;
    //socket setup
    if (value.trim()) {
      socket.emit("typing", { chatId: selectedUser, userId: loggedInUser?._id });
    }

    if (typingTimeOut) {
      clearTimeout(typingTimeOut);
    }

    const timeout = setTimeout(() => {
      socket.emit("stopTyping", { chatId: selectedUser, userId: loggedInUser?._id });
    }, 2000);

    setTypingTimeOut(timeout);
  }


  useEffect(() => {
    socket?.on("newMessage", (message) => {
      console.log('Received new message via socket:', message);
      if (selectedUser === message.chatId) {
        setMessages((prev) => {
          const currentMessages = prev || [];
          const messageExists = currentMessages.some(msg => msg._id === message._id);
          if (!messageExists) {
            return [...currentMessages, message];
          }
          return currentMessages;
        });

        // moveChatToTop(message.chatId, message, false);
      } else {
        // moveChatToTop(message.chatId, message, true);
      }
    });

    socket?.on("messagesSeen", (data) => {
      console.log('Message seen data :', data);
      if (selectedUser === data.chatId) {
        setMessages((prev) => {
          if (!prev) return null;

          return prev.map((msg) => {
            if (msg.sender === loggedInUser?._id && data.messageIds && data.messageIds.includes(msg._id)) {
              return {
                ...msg,
                seen: true,
                seenAt: new Date().toString()
              }
            }
            else if (msg.sender === loggedInUser?._id && !data.messageIds) {
              return {
                ...msg,
                seen: true,
                seenAt: new Date().toString()
              }
            }
            return msg;
          });
        });
      }
    });

    socket?.on("userTyping", (data) => {
      console.log('Received user typing :', data);
      if (data.chatId === selectedUser && data.userId !== loggedInUser?._id) {
        setIsTyping(true);
      }
    })

    socket?.on("userStoppedTyping", (data) => {
      console.log('Received user stopped typing :', data);
      if (data.chatId === selectedUser && data.userId !== loggedInUser?._id) {
        setIsTyping(false);
      }
    })

    return () => {
      socket?.off("newMessage");
      socket?.off("messagesSeen");
      socket?.off("userTyping");
      socket?.off("userStoppedTyping");
    }
  }, [socket, selectedUser, setChats, loggedInUser?._id])

  useEffect(() => {
    if (selectedUser) {
      fetchChat();
      setIsTyping(false);
      resetUnseenCount(selectedUser);
      socket?.emit('joinChat', selectedUser)

      return () => {
        socket?.emit('leaveChat', selectedUser);
        setMessages(null)
      }
    }
  }, [selectedUser, socket]);

  useEffect(() => {
    return () => {
      if (typingTimeOut) {
        clearTimeout(typingTimeOut);
      }
    }
  }, [typingTimeOut])


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
        onlineUsers={onlineUsers}
      />

      <div className='flex-1 flex flex-col justify-between p-4 backdrop-blur-xl bg-white/5 border-1 border-white/10'>
        <ChatHeader user={user} setSidebarOpen={setSidebarOpen} isTyping={isTyping} onlineUsers={onlineUsers} />
        <ChatMessages selectedUser={selectedUser} messages={messages} loggedInUser={loggedInUser} />
        <MessageInput selectedUser={selectedUser} message={message}
          setMessage={handleTyping} handleMessageSend={handleMessageSend} />
      </div>
    </div>
  )
}
