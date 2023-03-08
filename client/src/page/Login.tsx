import React, { useContext, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useForm, SubmitHandler } from "react-hook-form";
import { Auth } from '../context/AuthContext';
import axios from 'axios'
import { SV_URL } from '../utils/constant';
type Inputs = {
    email: string,
    password: String,
};
const Login = () => {
    const [errorMessage, setErrorMessage] = useState(null)
    const navigate = useNavigate()
    const { setUser } = useContext(Auth)
    const { register, handleSubmit, watch, formState: { errors } } = useForm<Inputs>();
    const onSubmit: SubmitHandler<Inputs> = async data => {
        const res = await axios.post(`${SV_URL}/user/login`, data)
        if (res.data.success) {
            setUser(res.data.data)
            axios.defaults.headers.common['Authorization'] = `Bearer ${res.data.accessToken}`
            navigate("/")
        } else {
            setErrorMessage(res.data.message)
        }
    }

    return (
        <div className='flex items-center justify-center bg-gradient-to-r from-blue-500 w-screen h-screen'>
            <div className="box w-3/5 h-[600px] bg-red-300 flex rounded-lg shadow-md">

                {/* bg part */}
                <div className="flex-1 flex items-center justify-center flex-col gap-4">
                    <img src="https://flowbite.com/docs/images/logo.svg" alt="" className='w-20 h-20' />
                    <h1 className='text-xl uppercase font-bold'>Chat with your friends</h1>
                </div>
                {/* login part */}
                <div className="flex flex-1 flex-col items-center justify-center gap-4">
                    <form className='flex items-center justify-center flex-col w-full' onSubmit={handleSubmit(onSubmit)}>
                        <div className="mb-6 w-4/5">
                            <label htmlFor="email" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Your email</label>
                            <input
                                {...register("email", {
                                    required: {
                                        value: true, message: "Email is required"
                                    }
                                })}
                                type="email" id="email" className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" required />
                        </div>
                        <div className="mb-6 w-4/5">
                            <label htmlFor="password" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Your password</label>
                            <input
                                {...register("password", {
                                    required: {
                                        value: true, message: "Password is required"
                                    }
                                })}
                                type="password" id="password" className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" required />
                        </div>
                        <div className='font-semibold text-red-500 mb-3'>
                            <p>{Object.entries(errors)?.[0]?.[1].message}</p>
                            {errorMessage && <p>{errorMessage}</p>}
                        </div>
                        <button type="submit" className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm w-full sm:w-auto px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800">Submit</button>
                    </form>
                    <div className="flex gap-3 items-center justify-center">
                        <span>Don't have an account?</span>
                        <span className='font-semibold hover:text-blue-500 cursor-pointer' onClick={() => navigate('/signup')}>Sign up</span>
                    </div>

                </div>

            </div>

        </div>
    )
}

export default Login