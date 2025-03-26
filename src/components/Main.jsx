import React, { useState, useEffect } from 'react'
import PasswordManager from './PasswordManager'
import Passwords from './Passwords'
import { useForm, FormProvider } from "react-hook-form";
import { Context } from '../passwordContext'
import { useAuth } from "@clerk/clerk-react";
import { ToastContainer } from 'react-toastify';

const Main = () => {
    const [isEditing, setIsEditing] = useState(false)
    const [passwordToBeEdited, setPasswordToBeEdited] = useState(null)
    const methods = useForm();
    const [passwords, setPasswords] = useState([])
    const [passType, setPassType] = useState("password")
    const [eyeImg, setEyeImg] = useState("icons/eye.png")
    const { getToken } = useAuth()
    const [allPasswords, setAllPasswords] = useState([])
    let [searchValue, setSearchValue] = useState("")

    useEffect(() => {
        (async function () {
            const token = await getToken()
            const backendURL = import.meta.env.VITE_BACKEND_URL;
            const response = await fetch(`${backendURL}/api/get-passwords`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
                mode: 'no-cors'
            });
            const res = await response.json()
            setPasswords(res)
            setAllPasswords(res)
        })();
    }, [getToken])

    return (
        <FormProvider {...methods}>
            <div className='grid mx-auto py-15 gap-4 w-[95%] sm:w-[85%] md:w-[75%] xl:w-[60%] relative'>
                <div className='flex flex-col items-center'>
                    <h1 className={`font-bold text-4xl dark:text-white`}>
                        <span className='green'>&lt;</span>
                        <span>Pass</span>
                        <span className='green'>OP&#47;&gt;</span>
                    </h1>
                    <p className={`text-lg text-green-900 dark:text-white`}>Your own Password Manager</p>
                </div>
                <Context.Provider value={{ passwords, setPasswords, eyeImg, setEyeImg, passType, setPassType }}>
                    <PasswordManager setIsEditing={setIsEditing} isEditing={isEditing} passwordToBeEdited={passwordToBeEdited} setAllPasswords={setAllPasswords} setSearchValue={setSearchValue} />
                    <Passwords isEditing={isEditing} setIsEditing={setIsEditing} setPasswordToBeEdited={setPasswordToBeEdited} allPasswords={allPasswords} setAllPasswords={setAllPasswords} searchValue={searchValue} setSearchValue={setSearchValue} />
                </Context.Provider>
                <ToastContainer />
            </div>
        </FormProvider>
    )
}

export default Main
