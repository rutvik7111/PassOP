import React, { useContext, useState } from 'react'
import { Context } from '../passwordContext';
import { useFormContext } from "react-hook-form"
import { toast } from 'react-toastify';
import { useAuth } from "@clerk/clerk-react";

const Passwords = ({ isEditing, setIsEditing, setPasswordToBeEdited, allPasswords, setAllPasswords, setSearchValue, searchValue }) => {
    const { setValue, clearErrors } = useFormContext(); // Access form context
    const { passwords, setPasswords, setPassType, setEyeImg } = useContext(Context)
    const { getToken } = useAuth()

    function handleEdit(password) {
        setValue("site", password.site)
        setValue("password", password['password'])
        setValue("username", password.username)
        clearErrors()
        setIsEditing(true)
        setPasswordToBeEdited(password)
        setPassType("password")
        setEyeImg("icons/eye.png")
    }

    async function handleDelete(password) {
        const token = await getToken()
        const backendURL = import.meta.env.VITE_BACKEND_URL;
        const response = await fetch(`${backendURL}/api/delete-password`, {
            method: "DELETE",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify(password),
            mode: 'no-cors'
        });
        const response1 = await fetch(`${backendURL}/api/get-passwords`, {
            headers: {
                Authorization: `Bearer ${token}`,
            },
            mode: 'no-cors'
        });
        const data = await response1.json()
        setPasswords(data)
        setAllPasswords(data)
        setPassType("password")
        setEyeImg("icons/eye.png")
        toast("Password has been deleted successfully.")
        setSearchValue("")
    }

    function handleCopy(copyThis) {
        navigator.clipboard.writeText(copyThis);
        toast("Copied to clipboard!")
    }

    function handleSearch(e) {
        const value = e.target.value
        setSearchValue(value)
        setPasswords(() => value === "" ? allPasswords : allPasswords.filter(pswd => pswd.site.includes(value)))
    }

    return (
        <div className='flex flex-col mt-0.5 gap-5 relative'>
            <div className='flex justify-between items-center gap-3 max-[560px]:mb-2.5 max-[560px]:flex-col'>
                <h2 className={`text-2xl font-bold dark:text-white`}>Your Passwords</h2>
                <div className={'flex items-center gap-1.5 '}>
                    <span className={'font-bold text-[16px] text-green-950 dark:text-white'}>Search:</span>
                    <input className='input h-fit' placeholder='Search website . . .' type="search" value={searchValue} onChange={handleSearch} name="search" id="search" />
                </div>
            </div>
            {
                passwords.length === 0 ? < p className={"dark:text-white"}> No passwords to show</p> :

                    <div className='dark:outline dark:outline-offset-1 rounded-md dark:bg-[#ffffff25] dark:outline-[#ffffffc9] overflow-x-auto max-sm:w-[95vw]'>
                        <table className="w-full border border-gray-300 rounded-md overflow-hidden">
                            <thead className="bg-green-800 text-white">
                                <tr>
                                    <th className="p-2">Website</th>
                                    <th className="p-2">Username</th>
                                    <th className="p-2">Password</th>
                                    <th className="p-2">Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {
                                    passwords.map(password => (
                                        < tr key={String(password._id)} className='bg-green-100'>
                                            <td className="border border-white text-center p-2">
                                                <div className='flex justify-center gap-1'>
                                                    <span title={password.site} className='truncate max-w-35 xl:max-w-50'>{password.site}</span>
                                                    <lord-icon onClick={() => handleCopy(password["site"])} className="cursor-pointer w-[25px]" src="https://cdn.lordicon.com/iykgtsbt.json" trigger="hover"></lord-icon>
                                                </div>
                                            </td>
                                            <td className="border border-white text-center p-2">
                                                <div className='flex justify-center gap-1'>
                                                    <span title={password.username} className='truncate max-w-35 xl:max-w-50'>{password.username}</span>
                                                    <lord-icon onClick={() => handleCopy(password["username"])} className="cursor-pointer w-[25px]" src="https://cdn.lordicon.com/iykgtsbt.json" trigger="hover"></lord-icon>
                                                </div>
                                            </td>
                                            <td className="border border-white text-center p-2">
                                                <div className='flex justify-center gap-1'>
                                                    <span>{"*".repeat(password["password"].length)}</span>
                                                    <lord-icon onClick={() => handleCopy(password["password"])} className="cursor-pointer w-[25px]" src="https://cdn.lordicon.com/iykgtsbt.json" trigger="hover"></lord-icon>
                                                </div>
                                            </td>
                                            <td className="text-center whitespace-nowrap space-x-2.5 border border-white p-2 px-5">
                                                <button disabled={isEditing} className={`${isEditing ? "opacity-25" : ""}`}>
                                                    <lord-icon onClick={() => handleEdit(password)} className="w-[25px] cursor-pointer" src="https://cdn.lordicon.com/gwlusjdu.json" trigger="hover"></lord-icon>
                                                </button>
                                                <button disabled={isEditing} className={`${isEditing ? "opacity-25" : ""}`}>
                                                    <lord-icon onClick={() => handleDelete(password)} className="w-[25px] cursor-pointer" src="https://cdn.lordicon.com/skkahier.json" trigger="hover"></lord-icon>
                                                </button>
                                            </td>
                                        </tr>
                                    ))
                                }
                            </tbody>
                        </table>
                    </div>

            }
        </div >
    )
}

export default Passwords
