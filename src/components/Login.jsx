import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { setUserData } from '../features/authSlice';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { setChats } from '../features/chatSlice';
import { getChatsofUser } from '../services/seervies';

const Login = () => {
    const [formData, setFormData] = useState({
        email: '',
        password: ''
    });

    const dispatch = useDispatch();
    const navigate = useNavigate();

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };

    const handleSubmitForm = async (e) => {
        e.preventDefault();

        try {
            const res = await axios.post('http://localhost:3000/api/v1/auth/login', formData);
            alert(res.data.message);

            if (res.data.status === 'success') {
                localStorage.setItem('token', res.data.token);
                localStorage.setItem('user',JSON.stringify(res.data.data || {}));

                const userData = {
                    user: res.data.data,
                    token: res.data.token
                };

                dispatch(setUserData(userData));

              const usersChats =  await getChatsofUser()
              dispatch(setChats(usersChats))
                navigate('/new-chat');
            }else{
                navigate('/login')
            }
        } catch (error) {
            console.error('Error:', error.message);
        }
    };

    return (
        <div className='flex justify-center items-center h-screen bg-[#121212] text-white'>
            <form
                onSubmit={handleSubmitForm}
                className=' bg-[#1f1f1f] border border-gray-700  rounded-xl  w-96 p-8 shadow-lg'>
                <h1 className="text-center text-4xl mb-5 font-serif font-semibold text-blue-600">Login Form</h1>
                
                <div className='mb-3'>
                    <label className='block text-lg mb-1 font-serif '>Email:<br /></label>
                    <input
                        type="email"
                        name='email'
                        placeholder='Enter Email'
                        className='w-full px-3 py-2 rounded-md bg-[#2a2a2a] border border-gray-600 focus:outline-none'
                        onChange={handleChange}
                        value={formData.email}
                    />
                </div>
                <div className='mb-3'>
                    <label className='block text-lg mb-1 font-serif '>Password:<br /></label>
                    <input
                        type="password"
                        name='password'
                        placeholder='Enter Password'
                        className='w-full px-3 py-2 rounded-md bg-[#2a2a2a] border border-gray-600 focus:outline-none'
                        onChange={handleChange}
                        value={formData.password}
                    />
                </div>
                <div className='mb-3 flex justify-center mt-5'>
                    <button
                        type="submit"
                        className='bg-blue-600 hover:bg-blue-700 px-4 py-2 font-serif  text-2xl rounded cursor-pointer'>
                        Login
                    </button>

                </div>
                   <p className="text-center mt-8 ">Don't have account? <span className="text-blue-400 underline"><Link to='/register' >Register</Link></span> </p>
            </form>
        </div>
    );
};

export default Login;
