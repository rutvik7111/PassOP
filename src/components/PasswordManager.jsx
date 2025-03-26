import React, { useContext } from 'react'
import { useFormContext } from "react-hook-form"
import { Context } from '../passwordContext';
import { toast } from 'react-toastify';
import { useAuth } from "@clerk/clerk-react";

const PasswordManager = ({ setIsEditing, isEditing, passwordToBeEdited, setAllPasswords, setSearchValue }) => {
    const { passwords, setPasswords, eyeImg, setEyeImg, passType, setPassType } = useContext(Context)
    const {
        register,
        handleSubmit,
        reset,
        formState: { errors }
    } = useFormContext(); // Access form context
    const { getToken } = useAuth()

    const onSubmit = async (data) => {
        const token = await getToken()
        if (passwords.filter(elem => elem.site === data.site && elem.username === data.username).length === 0 || isEditing) {
            if (!isEditing) {
                const backendURL = import.meta.env.VITE_BACKEND_URL;
                const response = await fetch(`${backendURL}/api/add-password`, {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${token}`,
                    },
                    body: JSON.stringify(data),
                });
                toast("Password saved successfully.")
            } else {
                const backendURL = import.meta.env.VITE_BACKEND_URL;
                const response = await fetch(`${backendURL}/api/update-password`, {
                    method: "PUT",
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${token}`,
                    },
                    body: JSON.stringify({ ...passwordToBeEdited, ...data }),
                });
                setIsEditing(false)
                toast("Password details updated successfully.")
            }
            const backendURL = import.meta.env.VITE_BACKEND_URL;
            const response1 = await fetch(`${backendURL}/api/get-passwords`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                }
            });
            const res = await response1.json()
            setPasswords(res)
            setAllPasswords(res)
            setSearchValue("")
        } else {
            toast("This website and user already exists.")
        }
        reset()
        setPassType("password")
        setEyeImg("icons/eye.png")
    }

    return (
        <form className='dark:outline dark:outline-offset-2 rounded-lg dark:sm:p-12 dark:p-10 dark:px-5 dark:bg-[#ffffff25] dark:outline-[#ffffffc9] flex flex-col w-[95%] dark:w-full mx-auto justify-center items-center gap-8.5' onSubmit={handleSubmit(onSubmit)}>
            <div className='w-full flex flex-col gap-1.5'>
                <input className='input' placeholder='Enter website URL' {...register("site", {
                    required: { value: true, message: "* This field is required." }, validate: val => val.trim() !== "", minLength: { value: 3, message: "Too short.." }, maxLength: { value: 253, message: "Too long.." }, pattern: {
                        value: /^(https?:\/\/)?(www\.)?[a-zA-Z0-9-]+(\.[a-zA-Z]{2,})+$/,
                        message: "Enter a valid website name (e.g., google.com or www.google.com)",
                    }
                })} />
                {errors.site && <span className='text-red-500 ml-4 dark:text-white'>{errors.site.message}</span>}
            </div>

            <div className='flex flex-col sm:flex-row justify-between gap-8 w-full'>
                <div className='w-full flex flex-col gap-1.5'>
                    <input className='input' placeholder='Enter Username' {...register("username", {
                        required: { value: true, message: "* This field is required." }, validate: val => val.trim() !== "", minLength: { value: 3, message: "Too short.." }, pattern: {
                            value: /^[a-zA-Z_][a-zA-Z0-9_]*$/,
                            message: "Username must start with a letter or underscore and contain only letters, numbers, and underscore",
                        }
                    })} />

                    {errors.username && <span className='text-red-500 ml-4 dark:text-white'>{errors.username.message}</span>}
                </div>

                <div className='flex flex-col gap-1.5'>
                    <div className='bg-white outline outline-green-500 dark:outline-0 rounded-full flex justify-between items-center h-fit p-1 px-4 focus-within:outline-black focus-within:outline-2 sm:max-w-fit'>
                        <input type={passType} className='outline-none min-w-0 w-[175px] placeholder-black' placeholder='Enter Password' {...register("password", {
                            required: { value: true, message: "* This field is required." }, validate: val => val.trim() !== "", minLength: { value: 8, message: "Too short.." }, maxLength: { value: 20, message: "Too large.." }, pattern: {
                                value: /^(?=.*[A-Za-z])(?=.*\d).+$/,
                                message: "At least one letter and one number",
                            }
                        })} />

                        <div className='h-full flex items-center cursor-pointer'>
                            <img width={20.5} src={eyeImg} alt="eye" onClick={(e) => {
                                setEyeImg(prev => prev === "icons/eye.png" ? "icons/eyecross.png" : "icons/eye.png")
                                setPassType(prev => prev === "password" ? "text" : "password")
                            }}></img>
                        </div>
                    </div>
                    {errors.password && <span className='text-red-500 ml-4 w-[175px] dark:text-white'>{errors.password.message}</span>}
                </div>
            </div>

            {
                !isEditing ? <button className='flex items-center gap-2 bg-green-400 hover:bg-green-300 rounded-full py-2 px-8.5 border border-green-900 cursor-pointer' type="submit">
                    <lord-icon src="https://cdn.lordicon.com/jgnvfzqg.json" trigger="hover"></lord-icon>
                    <span>Save</span>
                </button> :
                    <button className='flex items-center gap-2 bg-green-400 hover:bg-green-300 rounded-full py-2 px-8.5 border border-green-900 cursor-pointer' type="submit">
                        <lord-icon src="https://cdn.lordicon.com/jgnvfzqg.json" trigger="hover"></lord-icon>
                        <span>Edit</span>
                    </button>
            }
        </form >
    )
}

export default PasswordManager
