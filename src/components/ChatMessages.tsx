
import type { Message } from '../pages/Chat/Chat';
import type { User } from '../context/AppContext';
import { useEffect, useMemo, useRef } from 'react';
import dayjs from 'dayjs';
import { CheckOutlined } from '@ant-design/icons';

interface ChatMessagesProps {
    selectedUser: string | null;
    messages: Message[] | null;
    loggedInUser: User | null;
}

function ChatMessages({ selectedUser, messages, loggedInUser }: ChatMessagesProps) {
    const bottomRef = useRef<HTMLDivElement | null>(null);

    const uniqueMessage = useMemo(() => {
        if (!messages) return null;
        const seen = new Set();
        return messages.filter(msg => {
            if (seen.has(msg._id)) {
                return false;
            }
            seen.add(msg._id);
            return true;
        });
    }, [messages]);


    console.log('messages :', messages);

    useEffect(() => {
        bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [selectedUser, uniqueMessage])

    return (
        <div className='flex-1 overflow-hidden'>
            <div className='h-full max-h-[calc(100vh-215px)] overflow-y-auto px-4 py-2 space-y-2 custom-scroll'>
                {
                    !selectedUser ? <p className='text-gray-400 text-center mt-20'>Please select a user to start chatting </p>
                        :
                        (
                            <>
                                {
                                    uniqueMessage?.map((e, i) => {
                                        console.log('e :', e);
                                        const isSentByMe = e.sender === loggedInUser?._id; //senderId or sender
                                        const uniqueKey = `${e._id}-${i}`;

                                        return (
                                            <div key={uniqueKey} className={`flex flex-col gap-1 mt-2 ${isSentByMe ? "items-end" : "items-start"}`}>
                                                <div className={`rounded-lg p-3 max-w-sm ${isSentByMe ? 'bg-blue-600 text-white'
                                                    : 'bg-gray-700 text-white'}`}>
                                                    {e.messageType === 'image' && e.image && (
                                                        <div className='relative group'>
                                                            <img src={e.image.url} alt="sent image" className='max-w-full h-auto rounded-lg' />
                                                        </div>
                                                    )}

                                                    {e.text && <p className='mt-1'>{e.text}</p>}

                                                </div>

                                                <div className={`flex items-center gap-1 text-xs text-gray-400 ${isSentByMe ? "pr-2 flex-row-reverse" : "pl-2"}`}>
                                                    <span>{dayjs(e.createdAt).format("hh:mm A . MMM D")}</span>
                                                    {isSentByMe && <div className='flex items-center ml-1'>
                                                        {
                                                            e.seen ? <div className='flex items-center gap-1 text-blue-400:'>

                                                                {e.seenAt && <span className='text-xs text-blue-400'>
                                                                    <CheckOutlined className='w-3 h-2 text-[calc(text-xs -6px)]' />
                                                                    <CheckOutlined className='w-3 h-2 mr-1 ' />
                                                                    {dayjs(e.seenAt).format("hh:mm A")}
                                                                </span>}
                                                            </div> : <CheckOutlined className='w-3 h-3 text-gray-500' />
                                                        }
                                                    </div>}
                                                </div>
                                            </div>
                                        )

                                    })
                                }
                                <div ref={bottomRef} />
                            </>
                        )

                }
            </div>
        </div>
    )
}

export default ChatMessages