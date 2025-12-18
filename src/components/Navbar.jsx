import React, { useState } from 'react'
import { FaUserAlt } from "react-icons/fa";
import { IoMdArrowDropdown } from "react-icons/io";
import { CgMenuGridR } from "react-icons/cg";
import { SiFiles } from "react-icons/si";
import { useNavigate, useParams } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { logout } from '../features/authSlice';
import Profile from './Profile';




const Navbar = () => {

	const { chatId } = useParams()

	const chats = useSelector(state => state.chats.value)
	const chat = chats.find(ch => ch._id == chatId)
	const user = useSelector(state => state.auth.user)

	const [profileMenuOpen, setProfileMenuOpen] = useState(false);
	const dispatch = useDispatch()
	const navigate = useNavigate()



	const shortText = (text, maxlength = 20) => {
		if (!text) return ""
		return text.length > maxlength ? text.substring(0, maxlength) + "..." : text
	}
	return (
		<nav className='flex justify-between text-base w-full items-center px-3 py-3  bg-slate-900'>

			<div className='w-full'>
				<h1 className=' w-fit font-semibold tracking-wide'>
					Gemini
					<div className='bg-[#2a2a2a] w-fit  flex justify-center items-center text-sm font-bold border rounded-2xl px-1 pl-3 text-[gray]'>
						2.0 Flash
						<div className=' flex justify-center items-center font-extrabold text-xl '>
							<IoMdArrowDropdown />
						</div>
					</div>
				</h1>
			</div>

			<div className=' w-full'><h1>{chat ? shortText(chat.name) : ''}</h1></div>
			{/* <div></div> */}

		</nav >
	)
}

export default Navbar
