import React, { useContext } from 'react'
import { ThemeContext } from '../themeContext';
import { SignedIn, SignedOut, SignInButton, UserButton, useUser } from "@clerk/clerk-react";
import { FiLogIn } from "react-icons/fi";
import { Sun, Moon } from "lucide-react";
import { Link } from 'react-router-dom';

const Navbar = () => {
    const { user } = useUser()
    const { setTheme } = useContext(ThemeContext)

    return (
        <nav className={'sticky z-10 top-0 flex justify-between px-2 min-[400px]:px-5 md:px-22 lg:px-10 xl:px-40 items-center p-2 bg-slate-800 dark:bg-slate-700'}>
            <div className='flex items-center gap-3 min-[400px]:gap-7.5'>
                <Link to="/">
                    <h1 className='font-bold text-white text-2xl'>
                        <span className='green'>&lt;</span>
                        <span>Pass</span>
                        <span className='green'>OP&#47;&gt;</span>
                    </h1>
                </Link>
                <button
                    className={`flex items-center gap-1.5 p-0.5 px-1 bg-white text-black rounded-2xl shadow-lg transition-transform *:transition-opacity duration-300 relative`}
                >
                    <Sun onClick={() => setTheme("dark")} className={`cursor-pointer`} size={23} />
                    <Moon onClick={() => setTheme("light")} className={`cursor-pointer`} size={24} />
                    <div className={`h-full w-1/2 rounded-full absolute top-0 right-0 dark:left-0 bgGreen border border-white`}></div>
                </button>
            </div>
            <p className="hidden lg:block absolute left-[50%] translate-x-[-50%] text-white text-lg font-semibold tracking-wide italic">
                Smart <span className="text-[#00c951]">Password</span> Management Made Easy
            </p>

            <div className='flex items-center gap-1.5'>
                <SignedIn>
                    <div className={`dark:border dark:border-white flex rounded-full`}>
                        <UserButton />
                    </div>
                    {
                        user && <span className='hidden sm:block text-white cursor-default'>{user.primaryEmailAddress?.emailAddress} </span>
                    }
                </SignedIn>
                <SignedOut>
                    <SignInButton>
                        <button className="relative flex items-center gap-2 px-3 sm:px-7 py-2 text-white font-semibold rounded-full bg-gradient-to-r transition-all duration-300 hover:scale-105 cursor-pointer">
                            <FiLogIn className='text-[15px] sm:text-[20px]' />
                            <span className='max-sm:text-sm'>Sign In</span>
                            <span className="absolute inset-0 rounded-full bg-white opacity-15"></span>
                        </button>
                    </SignInButton>
                </SignedOut>
            </div>
        </nav >
    )
}

export default Navbar
