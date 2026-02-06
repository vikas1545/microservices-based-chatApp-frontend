
import { Button, Flex } from 'antd'
import { MenuUnfoldOutlined, UserOutlined } from '@ant-design/icons';
import type { User } from '../context/AppContext';

interface ChatHeaderProps {
    user: User | null,
    setSidebarOpen: (open: boolean) => void,
    isTyping: boolean,
    onlineUsers: string[]
}

export default function ChatHeader({ user, setSidebarOpen, isTyping, onlineUsers }: ChatHeaderProps) {
    const isOnlineUser = user ? onlineUsers.includes(user?._id) : false;

    return (
        <>
            <div className='sm:hidden fixed top-4 right-4 z-30'>
                <Button type='primary' style={{ backgroundColor: '#1c2433' }}
                    onClick={() => setSidebarOpen(true)}><MenuUnfoldOutlined /></Button>
            </div>


            <div className='mb-6 bg-gray-800 rounded-lg border border-gray-700 p-6'>
                <div className='flex items-center gap-4'>
                    {
                        user ? (
                            <>
                                <div className='relative'>
                                    <div className='w-14 h-14 bg-gray-700 rounded-full flex items-center justify-center'>
                                        <UserOutlined />
                                    </div>
                                    {isOnlineUser &&
                                        <span className='absolute top-1 right-1 w-3.5 h-3.5 
                                                bg-green-500 border-2 border-gray-100 rounded-full animate-bounce opacity-75'></span>
                                    }
                                </div>
                                <div className='flex-1 min-w-0'>
                                    <div className='flex items-center gap-3 mb-1'>
                                        <h2 className='text-2xl font-bold text-white truncate'>
                                            {user.name}
                                        </h2>
                                    </div>
                                    <Flex gap={2} align="center">
                                        {isTyping ? <div className='flex items-center gap-2 text-sm'>
                                            <Flex gap={1}>
                                                <div className='w-1.5 h-1.5 bg-blue-500 rounded-full animate-bounce'></div>
                                                <div className='w-1.5 h-1.5 bg-blue-500 rounded-full animate-bounce' style={{ animationDelay: '0.1s' }}></div>
                                                <div className='w-1.5 h-1.5 bg-blue-500 rounded-full animate-bounce' style={{ animationDelay: '0.2s' }}></div>
                                            </Flex>
                                            <span className='text-blue-500 font-medium'>typing...</span>
                                        </div>
                                            : <Flex align='center' gap={2}>
                                                <div className={`w-2 h-2 rounded-full ${isOnlineUser ? "bg-green-500" : "bg-gray-500"}`}></div>
                                                <span className={`text-sm font-medium ${isOnlineUser ? 'text-green-500' : 'text-gray-500'}`}>
                                                    {isOnlineUser ? 'Online' : 'Offline'}
                                                </span>
                                            </Flex>}
                                    </Flex>
                                </div>

                            </>
                        ) :
                            <Flex gap={16} align="center" justify="center">
                                <div className='w-14 h-14 bg-gray-700 rounded-full flex items-center justify-center'>
                                    <UserOutlined />
                                </div>
                                <Flex vertical align='flex-start'>
                                    <h2 className='text-2xl font-bold text-gray-400'>Select a conversation</h2>
                                    <p className='text-sm text-gray-500 mt-1'>Choose a chat from sidebar to start messaging</p>
                                </Flex>
                            </Flex>
                    }
                </div>
            </div>
        </>

    )



}
