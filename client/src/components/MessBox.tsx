import axios from 'axios'
import { useContext, useState, useRef, useEffect } from 'react'
import { Auth } from '../context/AuthContext'
import { SV_URL } from '../utils/constant'
import MessLabel from './MessLabel'
const MessBox = ({ socket }: any) => {
    const [messages, setMessages] = useState<any>([])
    const { user, currentConversation } = useContext(Auth)
    const [text, setText] = useState<any>()
    const inputRef: React.MutableRefObject<any> = useRef()
    const boxMessRef:React.LegacyRef<any> = useRef()
    const sendMess = async () => {
        if (text) {
            socket.emit("send_message", { message_content: text, conversation_id: currentConversation, sender_id: user.id, created_at: new Date()})
            const res = await axios.post(`${SV_URL}/user/sendmessage`, {
                conversation_id: currentConversation,
                message_content: text
            })
            console.log(res.data)
            setMessages((prev: any) => [...prev, { message_content: text, conversation_id: currentConversation, sender_id: user.id, created_at: new Date()}])
            inputRef.current.value = ''
            setText('')
        }
    }

    useEffect(() => {
        const fetchMessage = async () => {
            const res = await axios.get(`${SV_URL}/user/getmessages/${currentConversation}`)
            const messArray = res?.data?.data?.map((item: any) => {
                const { message_id, ...orther } = item
                return orther
            })
            setMessages(messArray)
        }
        fetchMessage()

        return () => {

        }
    }, [currentConversation])

    useEffect(()=>{
        socket?.on("receive_message", (data: any) => {
            setMessages((prev: any) => [...prev, data])
            console.log(data)
        })
        console.log(socket)
    },[socket])

    useEffect(()=>{
        boxMessRef?.current?.scrollIntoView({ behavior: "smooth" });
    },[messages])
    return (
        <div className="flex-auto bg-blue-200 flex flex-col">
            <div className="boxmess w-full flex-1 bg-yellow-200 overflow-y-auto p-3">
                {messages?.map((mess: any, index: any) => (
                    <div className={`${mess.sender_id === user.id && 'justify-end'} flex`} key={index} ref={boxMessRef}>
                        <MessLabel data={mess} />
                    </div>
                ))}
            </div>
            <div className="bg-red-100 flex flex-none items-center h-20 w-full p-4 justify-end gap-2">
                <input ref={inputRef} type="text" onChange={(e) => setText(e.target.value)} onKeyUp={e => {
                    if (e.keyCode === 13) {
                        sendMess()
                    }
                }}
                    className={'flex-auto border border-blue-500 rounded-lg h-10 px-2'}
                />
                <button className='border bg-black text-white px-3 rounded-full py-2' onClick={() => sendMess()}>Send</button>
            </div>
        </div>
    )
}

export default MessBox