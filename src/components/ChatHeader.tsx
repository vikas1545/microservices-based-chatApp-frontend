
import { Button, Flex } from 'antd'
import { MenuUnfoldOutlined, UserOutlined } from '@ant-design/icons';
import type { User } from '../context/AppContext';

interface ChatHeaderProps {
    user: User | null,
    setSidebarOpen: (open: boolean) => void,
    isTyping: boolean
}

export default function ChatHeader({ user, setSidebarOpen, isTyping }: ChatHeaderProps) {

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
                                    {/* Online user setup */}
                                </div>
                                <div className='flex-1 min-w-0'>
                                    <div className='flex items-center gap-3 mb-1'>
                                        <h2 className='text-2xl font-bold text-white truncate'>
                                            {user.name}
                                        </h2>
                                    </div>
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
