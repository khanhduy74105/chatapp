import { useContext } from 'react'
import { Auth } from '../context/AuthContext'
import moment from 'moment'
const MessLabel = ({ data }: any) => {
  const { user, receiver } = useContext(Auth)
  return (
    <div className={`${data.sender_id === user.id ? 'justify-end' : 'justify-start'} flex  gap-2 w-[400px] my-2`}>
      <img src={data.sender_id === user.id ? user.avatar : receiver.avatar} alt="" className='w-10 h-10 rounded-full' />
      <div className="flex flex-col">
        <div className="p-2 rounded-lg shadow-md bg-blue-300 max-w-[350px]">
          <p className='break-words'>{data.message_content}</p>
        </div>
        <p className='text-end'><span className='text-xs font-semibold'>{moment(data.created_at).format('mm:hh')}</span></p>
      </div>
    </div>
  )
}

export default MessLabel