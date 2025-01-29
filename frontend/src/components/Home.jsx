import React from 'react'
import Friend from './Friends.jpg'
import { Link } from 'react-router-dom'

const Home = () => {
  return (    
<div className="relative h-screen overflow-hidden">
    <img src={Friend} className="absolute w-full h-full" alt='friend'/>
    <div className="container relative z-10 flex items-center px-6 py-32 mx-auto md:px-12 xl:py-40">
        <div className="relative z-10 flex flex-col items-center w-full">
            <h1 className="mt-16 font-extrabold leading-tight text-center text-white text-6xl sm:text-8xl">
                Let's Be Friends!
            </h1>
            <Link to={'/login'} className="block px-4 py-3 mt-16 text-lg font-bold text-black uppercase bg-white rounded-lg">
                Start Now
            </Link>
        </div>
    </div>
</div>
  )
}

export default Home
