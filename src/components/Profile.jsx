import React from 'react'
import { useDispatch, useSelector } from 'react-redux';
import { logout as logoutSlice } from '../features/authSlice';
import { useNavigate } from 'react-router';
import { MdLogout, MdSettings, MdSubscriptions } from 'react-icons/md';

const Profile = () => {
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const user = useSelector(state => state.auth.user)


  const logoutUser = () => {
    dispatch(logoutSlice());
    console.log("logout");

    navigate('/login')

  }


  return (
    // <div className=' rounded-lg shadow-[0px_0px_45px_rgba(0,0,0,0.50)] font-serif bg-gray-800 text-white w-50 m-5 '>
    //   <div className='p-2'>
    //     <h1 className='text-xl font-semibold font-serif'>{user.name}</h1>
    //     <h2 className='text-md '>{user.email}</h2>
    //   </div>
    //   <hr />

    //   <div className='flex flex-col justify-center gap-2 p-2 w-full '>
    //     <h2 className='h-full '>Settings & Privacy</h2>
    //     <h2 className='h-full '>Manage Subscription</h2>

    //     <div className='text-lg h-8 flex justify-center items-center gap-2  '>
    //       <button
    //         type="button"
    //         onClick={logoutUser}
    //         className='cursor-pointer '
    //       >Logout</button>
    //     </div>
    //   </div>
    // </div>


    <div className="w-50 m-5 rounded-lg bg-gray-800 text-white shadow-[0px_0px_45px_rgba(0,0,0,0.5)]">

      {/* User Info */}
      <div className="p-4">
        <h1 className="text-xl ">{user.name}</h1>
        <p className="text-sm text-gray-300">{user.email}</p>
      </div>

      <hr className="border-gray-600" />

      {/* Settings */}
      <div className="flex flex-col gap-3 p-4 text-sm">

        <button className="flex items-center gap-3 text-left hover:text-blue-400 transition">
          <MdSettings size={20} />
          <span>Settings & Privacy</span>
        </button>

        <button className="flex items-center gap-3 text-left hover:text-blue-400 transition">
          <MdSubscriptions size={20} />
          <span>Manage Subscription</span>
        </button>

        <button
          type="button"
          onClick={logoutUser}
          className="mt-2 flex items-center justify-center gap-2 rounded bg-red-600 py-1.5 hover:bg-red-700 transition"
        >
          <MdLogout size={18} />
          <span>Logout</span>
        </button>

      </div>
    </div>


  )
}
export default Profile;
