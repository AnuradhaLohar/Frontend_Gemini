

import { useEffect, useId, useState } from 'react'
import { IoSend } from "react-icons/io5";
import { useDispatch, useSelector } from "react-redux";
import { addMessage, setMessages } from "../features/messagesSlice";
import { useNavigate, useParams } from "react-router-dom";
import { RiGeminiLine } from "react-icons/ri";
import { createNewChatinDB, createNewMessageinDB, getChatsofUser, getGeminiResponse, getMessagesofChat } from "../services/seervies";
import { createNewChats, setChats } from '../features/chatSlice';




const DisplayMessages = () => {

	const { chatId } = useParams()
	const newId = useId();
	const [formData, setFormData] = useState({ userInput: '' })
	const [isLoading, setIsLoading] = useState(false)
	const user = useSelector(state => state.auth.user)
	const messages = useSelector(state => state.messages.value)
	const dispatch = useDispatch()
	const navigate = useNavigate()


	useEffect(() => {
		if (!chatId) return;
		(async function () {
			const userChats = await getChatsofUser();
			dispatch(setChats(userChats));
			const userMessages = await getMessagesofChat(chatId)
			dispatch(setMessages(userMessages))
		})();
	}, [chatId])





	const handleSubmit = async (e) => {
		e.preventDefault()

		if (formData.userInput == '') return

		const userMsg = formData.userInput;
		setFormData({ userInput: '' })
		setIsLoading(true)

		try {
			let currentchatId = chatId;
			if (!currentchatId) {
				const newChatObj = await createNewChatinDB(userMsg)
				dispatch(setChats([newChatObj]))
				currentchatId = newChatObj._id
				navigate(`/${currentchatId}`)
			}

			dispatch(addMessage({
				text: userMsg,
				isGeminiResponse: false,
				_id: Date.now()
			}))

			await createNewMessageinDB(userMsg, currentchatId, false)

			const answer = await getGeminiResponse(userMsg)

			dispatch(addMessage({
				text: answer,
				isGeminiResponse: true,
				_id: Date.now() + 1
			}))

			await createNewMessageinDB(answer, currentchatId, true)

		} catch (err) {
			console.log("chat Error:", err.message);

		}
		setIsLoading(false)
	}

	return (
		<div className='relative h-full  '>
			<div className=' h-[90%] p-1 overflow-y-auto custom-scrollbar ' >

				{
					messages.length > 0 ?
						messages.map((msg) => {
							return (
								<div className='' key={msg._id}>
									<div className={` flex items-start text-xl  ${msg.isGeminiResponse ? '' : 'justify-end rounded-4xl'}`}
										
									>

										{
											msg.isGeminiResponse ? (
												<div className="mr-2 flex justify-start items-start bg-linear-to-rp-1 rounded-full my-10 ">
													<RiGeminiLine className=" text-2xl " />
												</div>
											)
												: null
										}

										{
											msg.isGeminiResponse ? <div
												key={msg.id}
												className={`mb-2 text-xl max-w-[80%] text-justify ai-response p-4 `}
												dangerouslySetInnerHTML={{ __html: msg.text }}
											/>
												:
												<p className='bg-gray-300 mb-2 text-black max-w-96 p-2 m-3 px-6 rounded-4xl rounded-tr-md '>{msg.text}</p>

										}

									</div>
								</div>
							)
						})

						: <h2 className="text-center text-2xl bg-linear-to-r from-fuchsia-500 to-violet-500 font-bold bg-clip-text text-transparent">Hello,{user.name || 'User'}</h2>
				}

				{
					isLoading && (<h2 className="text-2xl">Loading...</h2>)
				}
			</div >

			<div className='w-full flex justify-center'>

				<form onSubmit={handleSubmit} className='  flex justify-center items-center gap-4 p-3  w-full '>

					<input
						type="text"
						name='userInput'
						id={newId}
						className='text-xl border-2 max-w-300 md:w-1/2 lg:w-1/2 p-2 rounded-lg '
						placeholder='Ask Gemini'
						onChange={(e) => setFormData({
							userInput: e.target.value
						})}
						value={formData.userInput}
					/>

					<button type='submit' className='text-2xl cursor-pointer'>
						<IoSend />
					</button>

				</form>

			</div>
		</div >
	)
}

export default DisplayMessages






