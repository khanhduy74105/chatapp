import axios from 'axios'
import React, { useEffect, useState } from 'react'
import { useContext } from 'react'
import { createContext } from 'react'
export const Auth = createContext<any>(null)
const AuthContext = ({ children }: any) => {
    const [user, setUser] = useState<any>()
    const [peopleActive, setPeopleActive] = useState<any>(0)
    const [receiver, setReceiver] = useState<any>()
    const [currentConversation, setcurrentConversation] = useState<any>(null)

    const contextValue = {
        user,
        setUser,
        currentConversation, setcurrentConversation,
        receiver, setReceiver,
        peopleActive, setPeopleActive
    }

    return (
        <Auth.Provider value={contextValue}>
            {children}
        </Auth.Provider>
    )
}

export default AuthContext