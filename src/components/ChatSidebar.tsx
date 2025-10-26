import React, { useState } from 'react'
import type { User } from '../context/AppContext';
import { CloseOutlined, MessageOutlined, PlusOutlined, SearchOutlined, UserOutlined } from '@ant-design/icons';
import { Button, Flex, Input } from 'antd';
interface ChatSidebarProps {
    sidebarOpen: boolean;
    setSidebarOpen: (open: boolean) => void;
    showAllUsers: boolean;
    setShowAllUsers: (show: boolean | ((prev: boolean) => boolean)) => void;
    users: User[] | null;
    loggedInUser: User | null;
    chats: any[] | null;
    selectedUser: string | null;
    setSelectedUser: (userId: string | null) => void;
    handleLogOut: () => void;
}

function ChatSidebar({ sidebarOpen, setShowAllUsers, setSidebarOpen, showAllUsers,
    users, loggedInUser, chats, selectedUser, setSelectedUser, handleLogOut }: ChatSidebarProps) {

    console.log('chats', chats);

    const [searchQuery, setSearchQuery] = useState('');


    return (
        <aside className={`fixed z-20 sm:static top-0 left-0 h-screen w-80 bg-gray-900 border-r border-gray-700 transform 
            ${sidebarOpen ? "translate-x-0" : "-translate-x-full"} sm:translate-x-0 transition-transform duration-300 flex flex-col`}>

            <div className='p-6 border-b border-gray-700'>
                <div className='sm:hidden flex justify-end mb-0'>
                    <button onClick={() => setSidebarOpen(false)} className='p-2 hover:bg-gray-700 rounded-lg transition-colors'>
                        <CloseOutlined className='text-gray-300 w-5 h-5' />
                    </button>
                </div>

                <div className='flex items-center justify-between'>
                    <div className='flex items-center gap-3'>
                        <div className='p-2 bg-blue-600 justify-between'>
                            <MessageOutlined className='text-white w-5 h-5' />
                        </div>
                        <h2 className='text-xl font-bold text-white'>{showAllUsers ? 'New Chat' : 'Messages'}</h2>
                    </div>
                    {showAllUsers ?
                        <Button onClick={() => setShowAllUsers((prev) => !prev)} type='primary' danger ><CloseOutlined /></Button> :
                        <Button onClick={() => setShowAllUsers((prev) => !prev)} type='primary' style={{ backgroundColor: 'green' }} ><PlusOutlined /></Button>
                    }
                </div>
            </div>

            <div className='flex-1 overflow-hidden px-4 py-2 text-white'>

                {
                    showAllUsers ? <div className='space-y-4 h-full'>
                        <div className='relative'>
                            <Input size="large"
                                placeholder="Search Users..." prefix={<SearchOutlined />}
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                            />
                        </div>
                        <div className='space-y-2 overflow-y-auto h-full pb-4'>
                            {
                                users?.filter((user) => user._id !== loggedInUser?._id &&
                                    user.name.toLowerCase().includes(searchQuery.toLowerCase())).map((user) => (

                                        <div key={user._id}
                                            onClick={() => setSearchQuery('')}
                                            className={`p-3 rounded-lg bg-gray-700 hover:bg-gray-500 cursor-pointer flex items-center gap-2 `}>
                                            <Button shape='circle' icon={<UserOutlined />} />
                                            <span className='text-white font-medium'>{user.name}</span>
                                        </div>

                                    ))
                            }
                        </div>
                    </div>
                        : chats && chats.length > 0 ? <div className='space-y-2 overflow-y-auto h-full pb-4'>
                            {
                                chats.map((chat) => {
                                    const latestMessage = chat.chat.latestMessage;
                                    const isSelected = selectedUser === chat.chat._id;
                                    const isSentByMe = latestMessage.sender === loggedInUser?._id;
                                    const unseenCount = chat.chat.unseenCount || 0;
                                    return <div key={chat.chat._id}
                                        className={`w-full text-left p-4 rounded-lg transition-colors cursor-pointer 
                                    ${isSelected ? 'bg-blue-500 border border-blue-500' : 'border border-gray-700 hover:bg-gray-600'}`}
                                        onClick={() => {
                                            setSelectedUser(chat.chat._id);
                                            setSidebarOpen(false);
                                        }}
                                    >
                                        <div className='flex items-center gap-3'>
                                            <div className='relative'>
                                                <div className='w-12 h-12 bg-gray-700 rounded-full flex items-center justify-center'>
                                                    <div ><UserOutlined /></div>
                                                </div>
                                            </div>

                                            <div className='flex-1 min-w-0'>
                                                <div className='flex justify-between mb-1'>
                                                    <span className={`font-semibold truncate ${isSelected ? 'text-white' : 'text-gray-200'}`}>
                                                        {chat.user.name}
                                                    </span>
                                                    {unseenCount > 0 && (
                                                        <div className='bg-red-500 text-white text-xs font-bold px-2 
                                                    rounded-full flex items-center justify-center h-5.5 min-w-[22px]'>
                                                            {unseenCount > 99 ? '99+' : unseenCount}
                                                        </div>
                                                    )}
                                                </div>
                                            </div>

                                        </div>
                                    </div>
                                })}

                        </div> : <div>No conversation yet</div>
                }
            </div>
        </aside>
    )
}

export default ChatSidebar