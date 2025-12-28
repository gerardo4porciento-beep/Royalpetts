import React from 'react';
import { motion } from 'framer-motion';

const FamilySection = () => {
    return (
        <section className="relative min-h-screen bg-black flex flex-col items-center justify-center py-20 px-6 overflow-hidden">

            {/* Background Atmosphere */}
            <div className="absolute top-0 left-0 w-full h-full opacity-20 pointer-events-none">
                <div className="absolute top-[20%] left-[10%] w-[500px] h-[500px] bg-royal-blue rounded-full blur-[120px]"></div>
                <div className="absolute bottom-[20%] right-[10%] w-[500px] h-[500px] bg-royal-pink rounded-full blur-[120px]"></div>
            </div>

            {/* Content Container */}
            <div className="relative z-10 max-w-7xl w-full text-center">

                {/* Title */}
                <motion.div
                    initial={{ opacity: 0, y: 50 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8 }}
                    viewport={{ once: true }}
                    className="mb-16"
                >
                    <h2
                        className="font-skater text-[5rem] md:text-[8rem] text-white leading-none mb-4"
                        style={{ textShadow: "4px 4px 0px #32f4bb" }}
                    >
                        FAMILIA
                    </h2>
                    <p className="text-xl md:text-2xl text-gray-300 font-light tracking-wider max-w-2xl mx-auto">
                        MÁS QUE MASCOTAS, MIEMBROS DE LA REALEZA.
                    </p>
                </motion.div>

                {/* Placeholder Grid for Family Photos */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    {[1, 2, 3].map((item) => (
                        <motion.div
                            key={item}
                            initial={{ opacity: 0, scale: 0.9 }}
                            whileInView={{ opacity: 1, scale: 1 }}
                            transition={{ duration: 0.5, delay: item * 0.2 }}
                            viewport={{ once: true }}
                            className="aspect-[4/5] bg-gray-900 rounded-2xl border border-white/10 flex items-center justify-center relative overflow-hidden group hover:border-royal-orange/50 transition-colors"
                        >
                            <div className="absolute inset-0 bg-gradient-to-b from-transparent to-black/80"></div>
                            <span className="text-gray-600 font-skater text-4xl group-hover:text-royal-orange transition-colors duration-300">FOTO {item}</span>
                        </motion.div>
                    ))}
                </div>

            </div>
        </section>
    );
};

export default FamilySection;
