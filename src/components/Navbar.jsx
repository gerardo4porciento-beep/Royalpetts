import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const Navbar = () => {
    const [isMenuOpen, setIsMenuOpen] = useState(false);

    const menuItems = [
        { label: 'HOME', href: '#hero' },
        { label: 'GALERÍA', href: '#gallery' },
        { label: 'FAMILIA', href: '#family' },
        { label: 'CONTACTO', href: '#contact' },
    ];

    return (
        <>
            <nav className="fixed top-0 left-0 w-full z-[9999] px-6 py-4 md:px-12 md:py-6 flex justify-between items-center bg-transparent">

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

                {/* Right: Action Buttons */}
                <div className="flex items-center gap-2 md:gap-3">
                    {/* Contáctanos Button - Hidden on very small screens */}
                    <a
                        href="#contact"
                        className="hidden sm:block px-2 py-1.5 md:px-4 md:py-2 bg-[#34f4ce] text-white font-bold rounded-full hover:scale-105 transition-all duration-300 text-[10px] md:text-sm drop-shadow-[0_1px_2px_rgba(0,0,0,0.4)]"
                        style={{
                            boxShadow: "2px 2px 0px #ff7db2, 3px 3px 0px #00b9ec"
                        }}
                    >
                        CONTÁCTANOS
                    </a>

                    {/* Menu Button */}
                    <button
                        onClick={() => setIsMenuOpen(!isMenuOpen)}
                        className="px-2 py-1.5 md:px-4 md:py-2 bg-[#34f4ce] text-white font-bold rounded-full hover:scale-105 transition-all duration-300 flex items-center gap-1 md:gap-2 text-[10px] md:text-sm drop-shadow-[0_1px_2px_rgba(0,0,0,0.4)]"
                        style={{
                            boxShadow: "2px 2px 0px #ff7db2, 3px 3px 0px #00b9ec"
                        }}
                    >
                        {isMenuOpen ? 'CLOSE' : 'MENU'}
                        <span className="text-sm md:text-lg">{isMenuOpen ? '✕' : '⋮⋮'}</span>
                    </button>
                </div>
            </nav>

            {/* Dropdown Menu Panel */}
            <AnimatePresence>
                {isMenuOpen && (
                    <motion.div
                        initial={{ opacity: 0, y: -20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -20 }}
                        transition={{ duration: 0.3 }}
                        className="fixed top-24 right-6 md:right-12 z-[9998] bg-[#34f4ce] rounded-3xl shadow-2xl overflow-hidden"
                        style={{ width: '320px' }}
                    >
                        {/* Menu Items */}
                        <div className="p-6">
                            {menuItems.map((item, index) => (
                                <motion.a
                                    key={item.label}
                                    href={item.href}
                                    initial={{ opacity: 0, x: -20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    transition={{ delay: index * 0.1 }}
                                    onClick={() => setIsMenuOpen(false)}
                                    className="block py-4 text-2xl font-bold text-white drop-shadow-[0_2px_4px_rgba(0,0,0,0.5)] hover:opacity-70 transition-colors duration-300 border-b border-white/20 last:border-0"
                                >
                                    {item.label}
                                </motion.a>
                            ))}
                        </div>

                        {/* Newsletter Section */}
                        <div className="bg-black/10 p-6">
                            <h3 className="text-xl font-bold text-white mb-3 drop-shadow-[0_2px_4px_rgba(0,0,0,0.5)]">
                                Suscríbete a nuestro newsletter
                            </h3>
                            <div className="relative">
                                <input
                                    type="email"
                                    placeholder="Tu email"
                                    className="w-full px-4 py-3 pr-12 bg-white/80 backdrop-blur-sm rounded-full text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-royal-blue"
                                />
                                <button className="absolute right-2 top-1/2 -translate-y-1/2 w-8 h-8 bg-black rounded-full flex items-center justify-center hover:bg-gray-800 transition-colors">
                                    <span className="text-white text-lg">→</span>
                                </button>
                            </div>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </>
    );
};

export default Navbar;
