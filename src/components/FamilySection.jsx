import React from 'react';
import { motion } from 'framer-motion';

const FamilySection = () => {
    const cards = [
        {
            title: 'PROCESO DE RESERVA',
            icon: '📋',
            description: 'Conoce nuestro proceso paso a paso para reservar tu cachorro ideal',
            color: '#34f4ce',
            shadowColor: '#ff7db2',
            size: 'large'
        },
        {
            title: 'CACHORROS',
            icon: '🐶',
            description: 'Garantía de bienestar total:',
            details: [
                'Vacunación al día 💉',
                'Desparasitación integral 💊',
                'Libres de pulgas/garrapatas 🛡️',
                'Hematología completa 🩸'
            ],
            color: '#34f4ce',
            shadowColor: '#ff7db2',
            size: 'small'
        },
        {
            title: 'ACCESORIOS',
            icon: '🎀',
            description: 'Todo lo que tu mascota necesita para vivir como realeza',
            color: '#fe9e5b',
            shadowColor: '#ff7db2',
            size: 'wide'
        }
    ];

    const CardContent = ({ card, isWide = false }) => (
        <>
            {/* Glow Effect on Hover */}
            <div
                className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500"
                style={{
                    background: `radial-gradient(circle at 50% 50%, ${card.color}30, transparent 70%)`
                }}
            />

            {/* Icon Container */}
            <div className="relative z-10">
                <motion.div
                    className={`${isWide ? 'w-16 h-16 text-3xl' : 'w-20 h-20 text-4xl'} rounded-2xl flex items-center justify-center mb-4`}
                    style={{
                        background: `linear-gradient(135deg, ${card.color}, ${card.shadowColor})`,
                        boxShadow: `0 10px 30px ${card.color}50`
                    }}
                    whileHover={{ rotate: [0, -10, 10, 0] }}
                    transition={{ duration: 0.5 }}
                >
                    {card.icon}
                </motion.div>
            </div>

            {/* Content */}
            <div className="relative z-10 mt-auto">
                <h3
                    className={`font-skater ${isWide ? 'text-2xl md:text-3xl' : 'text-3xl md:text-4xl'} ${card.titleColor ? `text-[${card.titleColor}]` : 'text-white'} mb-3 leading-tight`}
                    style={{
                        textShadow: `2px 2px 0px ${card.shadowColor}`
                    }}
                >
                    {card.title}
                </h3>
                {card.details ? (
                    <div className="mt-4 text-left">
                        <p className={`font-black mb-3 ${isWide ? 'text-base' : 'text-lg md:text-xl'} text-black tracking-tight leading-none`}>
                            {card.description}
                        </p>
                        <ul className="space-y-2">
                            {card.details.map((item, idx) => (
                                <li key={idx} className={`flex items-center ${isWide ? 'text-sm' : 'text-base md:text-lg'} font-bold text-black/80`}>
                                    <span className="mr-2 text-white drop-shadow-md text-xl">✓</span>
                                    {item}
                                </li>
                            ))}
                        </ul>
                    </div>
                ) : (
                    <p className={`text-gray-600 font-medium ${isWide ? 'text-sm' : 'text-sm md:text-base'} leading-relaxed`}>
                        {card.description}
                    </p>
                )}

                {/* Arrow Button */}
                <motion.div
                    className={`mt-4 ${isWide ? 'w-12 h-12 text-xl' : 'w-14 h-14 text-2xl'} rounded-full flex items-center justify-center text-black font-bold`}
                    style={{
                        background: card.color,
                        boxShadow: `3px 3px 0px ${card.shadowColor}`
                    }}
                    whileHover={{ x: 5 }}
                >
                    →
                </motion.div>
            </div>

            {/* Decorative Corner */}
            <div
                className="absolute top-0 right-0 w-32 h-32 opacity-20"
                style={{
                    background: `radial-gradient(circle at 100% 0%, ${card.color}, transparent 70%)`
                }}
            />
        </>
    );

    return (
        <section id="family" className="relative min-h-screen flex flex-col items-center justify-center py-20 px-6 overflow-hidden">

            {/* Content Container */}
            <div className="relative z-10 max-w-7xl w-full">

                {/* Bento Grid Layout */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-16 p-4 md:p-8">

                    {/* Left Column - Large Card */}
                    <motion.div
                        initial={{ opacity: 0, x: -200, rotateY: -45, scale: 0.8 }}
                        whileInView={{ opacity: 1, x: 0, rotateY: 0, scale: 1 }}
                        transition={{ duration: 0.8, type: "spring", bounce: 0.3 }}
                        viewport={{ once: true, amount: 0.3 }}
                        whileHover={{ scale: 1.05, y: -10, rotateY: 5 }}
                        className="relative cursor-pointer group md:row-span-2"
                        style={{ transformStyle: 'preserve-3d', perspective: '1000px' }}
                    >
                        <div
                            className="relative h-full min-h-[400px] md:min-h-[500px] rounded-3xl overflow-hidden p-6 md:p-8 flex flex-col justify-between border-[4px] md:border-[8px] border-[#34f4ce]"
                            style={{
                                background: '#ffffff',
                                boxShadow: window.innerWidth < 640
                                    ? "6px 6px 0px #ff7db2"
                                    : "8px 8px 0px #ff7db2, 16px 16px 0px #00b9ec, 24px 24px 0px #ffffff, -8px -8px 0px #ff7db2, -16px -16px 0px #00b9ec, -24px -24px 0px #ffffff"
                            }}
                        >
                            <CardContent card={{ ...cards[0], titleColor: '#333' }} />
                        </div>
                    </motion.div>

                    {/* Right Column - Top Card */}
                    <motion.div
                        initial={{ opacity: 0, y: -150, rotateX: 45, scale: 0.8 }}
                        whileInView={{ opacity: 1, y: 0, rotateX: 0, scale: 1 }}
                        transition={{ duration: 0.8, delay: 0.2, type: "spring", bounce: 0.3 }}
                        viewport={{ once: true, amount: 0.3 }}
                        whileHover={{ scale: 1.05, y: -10, rotateX: -5 }}
                        className="relative cursor-pointer group"
                        style={{ transformStyle: 'preserve-3d', perspective: '1000px' }}
                    >
                        <div
                            className="relative h-full min-h-[200px] md:min-h-[240px] rounded-3xl overflow-hidden p-6 flex flex-col justify-between border-[4px] md:border-[8px] border-[#34f4ce]"
                            style={{
                                background: '#34f4ce',
                                boxShadow: window.innerWidth < 640
                                    ? "6px 6px 0px #ff7db2"
                                    : "8px 8px 0px #ff7db2, 16px 16px 0px #00b9ec, 24px 24px 0px #ffffff, -8px -8px 0px #ff7db2, -16px -16px 0px #00b9ec, -24px -24px 0px #ffffff"
                            }}
                        >
                            <CardContent card={cards[1]} isWide />
                        </div>
                    </motion.div>

                    {/* Right Column - Bottom Card */}
                    <motion.div
                        initial={{ opacity: 0, x: 200, rotateY: 45, scale: 0.8 }}
                        whileInView={{ opacity: 1, x: 0, rotateY: 0, scale: 1 }}
                        transition={{ duration: 0.8, delay: 0.4, type: "spring", bounce: 0.3 }}
                        viewport={{ once: true, amount: 0.3 }}
                        whileHover={{ scale: 1.05, y: -10, rotateY: -5 }}
                        className="relative cursor-pointer group"
                        style={{ transformStyle: 'preserve-3d', perspective: '1000px' }}
                    >
                        <div
                            className="relative h-full min-h-[200px] md:min-h-[240px] rounded-3xl overflow-hidden p-6 flex flex-col justify-between border-[4px] md:border-[8px] border-[#34f4ce]"
                            style={{
                                background: '#fe9e5b',
                                boxShadow: window.innerWidth < 640
                                    ? "6px 6px 0px #ff7db2"
                                    : "8px 8px 0px #ff7db2, 16px 16px 0px #00b9ec, 24px 24px 0px #ffffff, -8px -8px 0px #ff7db2, -16px -16px 0px #00b9ec, -24px -24px 0px #ffffff"
                            }}
                        >
                            <CardContent card={cards[2]} isWide />
                        </div>
                    </motion.div>

                </div>

            </div>
        </section>
    );
};

export default FamilySection;
