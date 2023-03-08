import axios from 'axios'
import React, { useContext, useState } from 'react'
import { Auth } from '../context/AuthContext'
import { SV_URL } from '../utils/constant'

const PeopleLabel = ({ isFriend, data, socket }: any) => {

  const { setcurrentConversation, setReceiver, peopleActive, setPeopleActive } = useContext(Auth)
  const handleClick = async () => {
    if (data) {
      const res = await axios.get(`${SV_URL}/user/getconversation/${data?.id}`)
      if (res.data.success) {
        setPeopleActive(data.id)
        const room = res.data.data.conversation_id
        setcurrentConversation(res.data.data.conversation_id)
        socket.emit("join_room", room)
        setReceiver(data)
      }
    }
  }

  const addfriend = async (id: any) => {
    const res = await axios.post(`${SV_URL}/user/addfriend`, { user_id_2: id })
    console.log(res.data)
  }
  return (
    <div className={`w-full items-start p-2 flex gap-2 cursor-pointer ${isFriend && 'hover:bg-slate-400'} ${peopleActive === data?.id && 'bg-blue-100'}`} onClick={() => {
      if (isFriend) {
        handleClick()
      }
    }}>
      <img
        className='w-16 h-16 object-cover flex-none'
        src="https://images.unsplash.com/photo-1599566150163-29194dcaad36?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=387&q=80" alt="" />
      <div className="flex-1 flex flex-col gap-2 items-start w-1/2 overflow-hidden">
        <h1 className='font-bold'>{data?.username}</h1>
        {!isFriend && <span className='border border-blue-500 px-2 rounded-l-full
             rounded-r-full cursor-pointer text-sm hover:bg-blue-200' onClick={() => addfriend(data.id)}>Add friend</span>}
      </div>
    </div>
  )
}

export default PeopleLabel