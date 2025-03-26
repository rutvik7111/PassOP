import React from 'react'

const Footer = () => {

    return (
        <footer className={`flex flex-col mt-[-20px] justify-between items-center py-1 text-white bg-slate-800 dark:bg-slate-700`}>
            <h1 className='font-bold text-white text-2xl'>
                <span className='green'>&lt;</span>
                <span>Pass</span>
                <span className='green'>OP&#47;&gt;</span>
            </h1>
            <div className='flex'>
                <span>Created with</span>
                <img className="w-7 mx-2" src="icons/heart.png" alt="" />
                <span>by Rutvik</span>
            </div>
        </footer>
    )
}

export default Footer
