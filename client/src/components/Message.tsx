import React, { useContext, useEffect, useState } from 'react'
import { io } from "socket.io-client";
import PeopleLabel from './PeopleLabel';
import axios from 'axios';
import { SV_URL } from '../utils/constant';
import MessBox from './MessBox';
const Message = () => {
  const [socket, setSocket] = useState<any>(null)
  const [friends, setFriends] = useState<any>()
  const [peoples, setPeoples] = useState<any>()
  useEffect(() => {
    const getFriends = async () => {
      const res = await axios.get(`${SV_URL}/user/getfriends`)
      if (res.data.success) {
        setFriends(res.data.items)
      }
    }
    const getPeoples = async () => {
      const res = await axios.get(`${SV_URL}/user/getpeoples`)
      if (res.data.success) {
        setPeoples(res.data.items)
      }
    }
    getFriends()
    getPeoples()
  }, [])

  useEffect(()=>{
      const sk = io('http://localhost:5000')
      setSocket(sk)
  },[])


  return (
    <div className=' bg-orange-300 flex flex-1 overflow-hidden'>
      <div className="w-1/5 p-4 flex flex-col">
        <div className="border-b-2 border-blue-500 mb-3 ">
          <h1 className='font-bold mb-1 text-xl'>Your conversation</h1>
        </div>
        <div className="w-full flex flex-col flex-auto overflow-y-auto gap-3 h-2/3" >
          {friends?.map((item: any) => (
            <PeopleLabel isFriend data={item} key={item?.id} socket={socket}/>
          ))}
        </div>
      </div>
      <MessBox socket={socket}/>
      <div className="w-1/5 p-4">
        <div className="border-b-2 border-blue-500 mb-3">
          <h1 className='font-bold mb-1 text-xl'>Do you know these people?</h1>
        </div>
        <div className="w-full flex flex-col h-[400px] overflow-y-auto gap-3" >
          {peoples?.map((item: any) => (
            <PeopleLabel data={item} key={item?.id}/>
          ))}
        </div>
      </div>
    </div>
  )
}

export default Message