import React, { useState, useCallback } from 'react'
import Image from 'next/image'
import { assets } from '@/assets/assets'
import { useClerk, UserButton } from '@clerk/nextjs'
import { useAppContext } from '@/context/AppContext'
import ChatLabel from "@/components/ChatLabel";
import toast from 'react-hot-toast'

const Sidebar = ({ expand, setExpand }) => {
    const { openSignIn } = useClerk()
    const { user, chats, createNewChat } = useAppContext()
    const [openMenu, setOpenMenu] = useState({ id: 0, open: false })
    const [isCreatingChat, setIsCreatingChat] = useState(false)

    const handleNewChat = useCallback(async () => {
        if (isCreatingChat) return;
        
        if (!user) {
            toast.error('Please login to create a new chat');
            openSignIn();
            return;
        }

        setIsCreatingChat(true);
        try {
            await createNewChat();
        } catch (error) {
            console.error('Create chat error:', error);
        } finally {
            setIsCreatingChat(false);
        }
    }, [user, createNewChat, openSignIn, isCreatingChat])

    const toggleMenu = useCallback(() => {
        setExpand(prev => !prev);
    }, [setExpand])

    const handleProfileClick = useCallback(() => {
        if (!user) {
            toast.error('Please login to access your profile');
            openSignIn();
        }
    }, [user, openSignIn])

    const tooltipPosition = expand 
        ? "left-1/2 -translate-x-1/2 top-12" 
        : "-top-12 left-0";

    const pointerPosition = expand 
        ? "left-1/2 -top-1.5 -translate-x-1/2" 
        : "left-4 -bottom-1.5";

    return (
        <div className={`flex flex-col justify-between bg-[#212327] pt-7 transition-all z-50 max-md:absolute max-md:h-screen
         ${expand ? 'p-4 w-64' : 'md:w-20 w-0 max-md:overflow-hidden'}`}>
            <div>
                <div className={`flex ${expand ? "flex-row items-center gap-10" : "flex-col items-center gap-8"}`}>
                    <Image 
                        className={expand ? "w-36" : "w-10"} 
                        src={expand ? assets.logotext : assets.charlesgptlogo} 
                        alt='CharlesGPT Logo'
                    />
                    <div 
                        onClick={toggleMenu}
                        className='group relative flex items-center justify-center hover:bg-gray-500/20 transition-all duration-300
                        h-9 w-9 aspect-square rounded-lg cursor-pointer'
                    >
                        <Image src={assets.menu_icon} alt='Mobile menu' className='md:hidden' />
                        <Image 
                            src={expand ? assets.sidebar_close_icon : assets.sidebar_icon} 
                            alt='Toggle sidebar' 
                            className='hidden md:block w-7' 
                        />
                        <div className={`absolute w-max ${tooltipPosition} opacity-0 group-hover:opacity-100 transition bg-black text-white text-sm px-3 py-2 rounded-lg shadow-lg pointer-events-none`}>
                            {expand ? 'Close sidebar' : 'Open sidebar'}
                            <div className={`w-3 h-3 absolute bg-black rotate-45 ${pointerPosition}`}></div>
                        </div>
                    </div>
                </div>
                
                <button 
                    onClick={handleNewChat}
                    disabled={isCreatingChat}
                    className={`mt-8 flex items-center justify-center cursor-pointer transition-all
                        ${expand 
                            ? "bg-primary hover:opacity-90 rounded-2xl gap-2 p-2.5 w-max disabled:opacity-50" 
                            : "group relative h-9 w-9 mx-auto hover:bg-gray-500/30 rounded-lg disabled:opacity-50"
                        }`}
                >
                    <Image 
                        className={expand ? 'w-6' : 'w-7'} 
                        src={expand ? assets.chat_icon : assets.chat_icon_dull} 
                        alt='New chat'
                    />
                    <div className='absolute w-max -top-12 -right-12 opacity-0 group-hover:opacity-100 transition bg-black
                    text-white text-sm px-3 py-2 rounded-lg shadow-lg pointer-events-none'>
                        New chat
                        <div className='w-3 h-3 absolute bg-black rotate-45 left-4 -bottom-1.5'></div>
                    </div>
                    {expand && (
                        <p className='text-white text font-bold'>
                            {isCreatingChat ? 'Creating...' : 'New chat'}
                        </p>
                    )}
                </button>

                <div className={`mt-8 text-white/25 text-sm ${expand ? "block" : "hidden"}`}>
                    <p className='my-1'>Recents</p>
                    {chats.map((chat) => (
                        <ChatLabel 
                            key={chat._id} 
                            name={chat.name} 
                            id={chat._id} 
                            openMenu={openMenu} 
                            setOpenMenu={setOpenMenu} 
                        />
                    ))}
                </div>
            </div>

            <div onClick={handleProfileClick}>
                <div className={`flex items-center ${expand ? 'hover:bg-white/10 rounded-lg' : 'justify-center w-full'} gap-3
                text-white/60 text-sm p-2 mt-2 cursor-pointer transition-colors`}>
                    {user ? (
                        <UserButton />
                    ) : (
                        <Image src={assets.profile_icon} alt='Your profile' className='w-7' />
                    )}
                    {expand && <span>{user ? 'My Profile' : 'Login'}</span>}
                </div>
            </div>
        </div>
    )
}

export default Sidebar