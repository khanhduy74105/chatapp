import React, { useContext } from 'react'
import {useNavigate} from 'react-router-dom'
import { Auth } from '../context/AuthContext'
const Header = () => {
  const navigate = useNavigate()
  const {user, setUser} = useContext(Auth)
  return (
    <div className='flex items-center justify-between bg-blue-500 px-10 py-2 h-[70px]'>
        <div className="flex items-center justify-center cursor-pointer select-none gap-2">
            <img src="https://flowbite.com/docs/images/logo.svg" alt="" />
            <span className='font-bold text-xl uppercase'>Chet app</span>
        </div>
        {!user ? <div className="flex items-center justify-end gap-2">
            <span className='font-semibold cursor-pointer hover:opacity-80' onClick={()=>navigate('/signup')}>Sign up</span>
            <span>|</span>
            <span className='font-semibold cursor-pointer hover:opacity-80' onClick={()=>navigate('/login')}>Login</span>
        </div> : 
        <div className='flex items-center justify-center gap-2'>
          <span>{user.username}</span>
          <span>|</span>
          <span className='cursor-pointer hover:text-blue-500' onClick={()=>setUser(null)}>Log out</span>
        </div>}
    </div>
  )
}

export default Header