import React from 'react';
import { motion } from 'framer-motion';
import { Instagram, Smartphone, Mail, Globe } from 'lucide-react';

const ContactSection = () => {
    return (
        <section className="relative min-h-screen bg-[#050510] flex flex-col items-center justify-center py-20 px-6 overflow-hidden">

            {/* Background Texture */}
            <div className="absolute inset-0 opacity-10" style={{ backgroundImage: 'radial-gradient(#4a4a8a 1px, transparent 1px)', backgroundSize: '30px 30px' }}></div>

            <div className="relative z-10 max-w-5xl w-full">

                <motion.div
                    initial={{ opacity: 0, x: -50 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.8 }}
                    viewport={{ once: true }}
                    className="text-center mb-20"
                >
                    <h2
                        className="font-skater text-[4rem] md:text-[7rem] text-white leading-[0.9] mb-6"
                        style={{ textShadow: "4px 4px 0px #fe9e5b" }}
                    >
                        CONTACTANOS
                    </h2>
                    <p className="text-royal-gray text-xl md:text-2xl font-light">
                        ¿LISTO PARA ENCONTRAR A TU COMPAÑERO IDEAL?
                    </p>
                </motion.div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">

                    {/* Contact Info */}
                    <motion.div
                        initial={{ opacity: 0, x: 50 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.8, delay: 0.2 }}
                        viewport={{ once: true }}
                        className="space-y-8"
                    >
                        <div className="flex items-center gap-6 group cursor-pointer">
                            <div className="w-16 h-16 rounded-full bg-royal-blue/10 flex items-center justify-center group-hover:bg-royal-blue/20 transition-colors border border-royal-blue/30">
                                <Instagram className="w-8 h-8 text-royal-blue" />
                            </div>
                            <div>
                                <h3 className="text-white font-bold text-xl">Instagram</h3>
                                <p className="text-gray-400">@royalpetts</p>
                            </div>
                        </div>

                        <div className="flex items-center gap-6 group cursor-pointer">
                            <div className="w-16 h-16 rounded-full bg-royal-green/10 flex items-center justify-center group-hover:bg-royal-green/20 transition-colors border border-royal-green/30">
                                <Smartphone className="w-8 h-8 text-royal-green" />
                            </div>
                            <div>
                                <h3 className="text-white font-bold text-xl">WhatsApp</h3>
                                <p className="text-gray-400">+1 234 567 890</p>
                            </div>
                        </div>

                        <div className="flex items-center gap-6 group cursor-pointer">
                            <div className="w-16 h-16 rounded-full bg-royal-pink/10 flex items-center justify-center group-hover:bg-royal-pink/20 transition-colors border border-royal-pink/30">
                                <Mail className="w-8 h-8 text-royal-pink" />
                            </div>
                            <div>
                                <h3 className="text-white font-bold text-xl">Email</h3>
                                <p className="text-gray-400">contacto@royalpetts.com</p>
                            </div>
                        </div>
                    </motion.div>

                    {/* CTA Card */}
                    <motion.div
                        initial={{ opacity: 0, scale: 0.8 }}
                        whileInView={{ opacity: 1, scale: 1 }}
                        transition={{ duration: 0.8, delay: 0.4 }}
                        viewport={{ once: true }}
                        className="bg-gradient-to-br from-royal-blue/20 to-royal-pink/20 p-8 rounded-[2rem] border border-white/10 text-center"
                    >
                        <h3 className="font-skater text-4xl text-white mb-4">VISÍTANOS</h3>
                        <p className="text-gray-300 mb-8">
                            Agenda una cita para conocer a nuestros cachorros en persona.
                        </p>
                        <button className="bg-white text-black font-bold py-4 px-10 rounded-full hover:scale-105 transition-transform shadow-[0_0_20px_rgba(255,255,255,0.3)]">
                            AGENDAR CITA
                        </button>
                    </motion.div>

                </div>
            </div>
        </section>
    );
};

export default ContactSection;
