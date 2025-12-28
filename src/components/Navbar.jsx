import React from 'react';
import { motion } from 'framer-motion';

const Navbar = () => {
    return (
        <nav className="fixed top-0 left-0 w-full z-[9999] px-6 py-4 md:px-12 md:py-6 flex justify-between items-center bg-transparent">

            {/* Left: Branding (2-Line Logo) */}
            {/* Left: Branding (2-Line Logo) */}
            {/* Left: Branding (2-Line Logo) */}
            <div className="flex flex-col items-start leading-none select-none cursor-pointer">
                {/* Top Line: ROYAL + Logo Icon */}
                <div className="flex items-center gap-2 ml-1">
                    <span className="font-skater text-xl md:text-3xl text-white tracking-wide">ROYAL</span>
                    <img
                        src="/SEPARACION 6/LOGO 3.png"
                        alt="Royal Petts Logo"
                        className="w-7 h-7 md:w-11 md:h-11 object-contain drop-shadow-[0_0_5px_rgba(255,255,255,0.5)] brightness-0 invert -translate-y-[13px] -translate-x-[2px]"
                    />
                </div>
                {/* Bottom Line: PETTSTORE */}
                <span className="font-skater text-xl md:text-3xl text-white tracking-wide -mt-3 md:-mt-4">
                    PETTSTORE
                </span>
            </div>

            {/* Right: Navigation Links */}
            <div className="hidden md:flex items-center gap-8 font-skater text-xl text-white uppercase tracking-wider">
                {['HOME', 'ABOUT', 'NEWS', 'MERCH', 'MARKETPLACE'].map((item) => (
                    <a
                        key={item}
                        href={`#${item.toLowerCase()}`}
                        className="relative group hover:text-royal-green transition-colors duration-300"
                    >
                        {item}
                        <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-royal-green group-hover:w-full transition-all duration-300"></span>
                    </a>
                ))}

                <a href="#login" className="hover:text-royal-pink transition-colors duration-300">LOGIN</a>

                <div className="flex items-center gap-1 cursor-pointer hover:text-royal-blue transition-colors duration-300">
                    <span>EN</span>
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M19 9l-7 7-7-7" />
                    </svg>
                </div>
            </div>

            {/* Mobile Menu Button (Visible only on small screens) */}
            <button className="md:hidden text-white font-skater text-xl border-2 border-white px-3 py-1 rounded hover:bg-white hover:text-black transition-colors">
                MENU
            </button>
        </nav>
    );
};

export default Navbar;
