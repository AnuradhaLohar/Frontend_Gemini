import React, { useState } from 'react'
import { MdMenu } from "react-icons/md";
import { useDispatch, useSelector } from 'react-redux';
import { deleteChatAndMessagsinDB, renameChatinDB } from '../services/seervies';
import { deleteChat as deleteChatSlice, renameChats as renameChatSlice } from '../features/chatSlice';
import { Link } from 'react-router';
import Profile from './Profile';
import { setMessages } from '../features/messagesSlice';

const SidebarLayout = () => {

    const [isSidebarOpen, setIsSidebarOpen] = useState(true)
    const [openMenuId, setOpenMenuId] = useState(null)
    const [hoverdId, setHoverdId] = useState(null)

    const [renameChatId, setRenameChatId] = useState(null);
    const [renameChatText, setRenameChatText] = useState('');

    const dispatch = useDispatch();
    const chats = useSelector(state => state.chats.value)

    const user = useSelector(state => state.auth.user)
    const [profileMenuOpen, setProfileMenuOpen] = useState(false);


    const handleNewChat = () => {
        dispatch(setMessages([]));   // clear screen instantly
    };

    const shortText = (text, maxlength = 20) => {
        if (!text) return ""
        return text.length > maxlength ? text.substring(0, maxlength) + "..." : text
    }

    const startRename = (chat) => {
        setRenameChatId(chat._id)
        setRenameChatText(chat.name)
        setOpenMenuId(null)
    }

    const saveRename = async () => {

        if (!renameChatId || !renameChatText) return;
        const updatedChat = await renameChatinDB(renameChatId, renameChatText)

        if (!updatedChat) return;
        dispatch(renameChatSlice(updatedChat))

        setRenameChatId(null)
        setRenameChatText("")
    }

    const cancleRename = () => {
        setRenameChatId(null)
        setRenameChatText('')

    }

    const deleteChatsAndMessage = async (chat) => {
        const deletedChat = await deleteChatAndMessagsinDB(chat._id)
        dispatch(deleteChatSlice(deletedChat.chatId))
        setOpenMenuId(null)

    }
    return (

        <>

            <div className={`flex flex-col relative h-screen transition-all duration-750 ease-in-out overflow-x-hidden  
				${isSidebarOpen ? 'w-[300px] ' : ' w-20'} absolute md:relative z-50  text-white px-2 `}
            >
                { /*Three Dash menu  */}
                <div className='text-2xl m-4 cursor-pointer  '>
                    <div
                        className=' w-8 h-8 flex justify-center items-center  '
                        onClick={(e) => setIsSidebarOpen(!isSidebarOpen)}
                    >
                        <MdMenu className='cursor-pointer active:scale-90' />

                    </div>
                    {
                        isSidebarOpen &&
                        <div onClick={handleNewChat}>

                            <Link to="/new-chat">
                                <div className="hover:bg-gray-300 cursor-pointer text-center bg-linear-to-r from-fuchsia-500 to-violet-500 text-xl  rounded-lg">
                                    New Chat
                                </div>
                            </Link>
                        </div>
                    }

                </div>

                <div className='flex-1  overflow-y-auto custom-scrollbar  '>
                    {
                        isSidebarOpen ? chats.map(ch => {
                            return (
                                <Link to={`${ch._id}`} key={ch._id}>
                                    <div className='group relative  flex justify-between items-center  hover:bg-[#4e4e4e9c] rounded-md cursor-pointer'
                                        onMouseEnter={() => {
                                            if (!openMenuId || !renameChatId) setHoverdId(ch._id)
                                        }}
                                        onMouseLeave={() => {
                                            if (!openMenuId || !renameChatId) {
                                                setHoverdId(null)
                                                setOpenMenuId(null)
                                            }
                                        }}
                                        key={ch._id}
                                    >


                                        {
                                            ch._id == renameChatId ?
                                                <div className='w-full space-y-2'>
                                                    <input type="text"
                                                        className=' w-full px-3 py-2 rounded-lg bg-[#1a1a1a] border border-gray-700 focus: outline-none focus:border-violet-500 '
                                                        value={renameChatText}
                                                        onChange={(e) => setRenameChatText(e.target.value)}
                                                    />
                                                    <div className='flex justify-center items-center m-2 gap-2'>
                                                        <button
                                                            onClick={() => {
                                                                saveRename()
                                                            }}
                                                            className="w-full px-4 py-2 bg-green-500 cursor-pointer rounded-xl"
                                                        >
                                                            Save
                                                        </button>

                                                        <button
                                                            onClick={() => {
                                                                cancleRename()
                                                            }}
                                                            className="w-full px-4 py-2 cursor-pointer bg-red-500 rounded-xl"
                                                        >
                                                            Cancle
                                                        </button>
                                                    </div>
                                                </div>
                                                :
                                                <div className=' m-2 ml-8 cursor-pointer'>
                                                    {shortText(ch.name)}
                                                </div>
                                        }




                                        {/* 3 dot menu */}
                                        {
                                            (ch._id == hoverdId) && !renameChatId && !openMenuId &&
                                            <div className=' mr-4 w-[10%]'>
                                                <button
                                                    onClick={() => setOpenMenuId(openMenuId === ch._id ? null : ch._id)}
                                                    className="  rounded cursor-pointer "
                                                >
                                                    •••
                                                </button>
                                            </div>
                                        }

                                        {
                                            openMenuId === ch._id && (
                                                <div
                                                    className="absolute right-2 top-8 mt-2 w-44 bg-[#1f1f1f] text-white shadow-xl rounded-xl border border-gray-700 animate-fadeIn z-50"
                                                >
                                                    <button
                                                        onClick={() => {
                                                            startRename(ch)
                                                        }}
                                                        className="w-full text-left cursor-pointer px-4 py-2 hover:bg-gray-700 rounded-t-xl"
                                                    >
                                                        Rename
                                                    </button>

                                                    <button
                                                        onClick={() => {
                                                            deleteChatsAndMessage(ch)
                                                        }}
                                                        className="w-full text-left cursor-pointer px-4 py-2 text-red-300 hover:bg-red-800 rounded-b-xl"
                                                    >
                                                        Delete
                                                    </button>
                                                </div>
                                            )}
                                    </div>
                                </Link>
                            )
                        })
                            : ''
                    }
                </div>


                <div className='sticky bottom-0'
                    onMouseLeave={() => setProfileMenuOpen(false)}
                >
                    {
                        isSidebarOpen ?
                            <div className='flex flex-col w-full  p-2'>
                                <div onClick={() => setProfileMenuOpen(!profileMenuOpen)} className='flex cursor-pointer hover:bg-[#2c2b2b] rounded-xl  p-2 '>
                                    <button  className="cursor-pointer mr-2 w-10 h-10 rounded-full bg-linear-to-r from-fuchsia-500 to-violet-500 flex items-center justify-center text-white font-bold uppercase">
                                        {user?.name?.charAt(0) || "U"}
                                    </button>
                                    <div className='flex flex-col text-sm'>
                                        <p className='capitalize'>{user.name}</p>
                                        <p>{user.email}</p>
                                    </div>
                                    {
                                        profileMenuOpen && <div className="absolute bottom-14 left-0  mt-2  bg-[#1f1f1f] text-white shadow-xl rounded-xl border border-gray-700 animate-fadeIn z-50">
                                            <Profile />
                                        </div>
                                    }
                                </div>
                            </div>
                            :
                            <div className='cursor-pointer p-2 overflow-visible '>
                                <button onClick={() => setProfileMenuOpen(!profileMenuOpen)} className="cursor-pointer mr-2 w-10 h-10 rounded-full bg-linear-to-r from-fuchsia-500 to-violet-500 flex items-center justify-center text-white font-bold uppercase">
                                    {user?.name?.charAt(0) || "U"}
                                </button>

                            </div>

                    }
                </div>

            </div>

            {
               !isSidebarOpen && profileMenuOpen && <div className="absolute  bottom-14 left-0  mt-2  bg-[#1f1f1f] text-white shadow-xl rounded-xl border border-gray-700 animate-fadeIn z-50">
                    <Profile />
                </div>
            }

        </>









    )
}

export default SidebarLayout