import React from 'react';
import { motion } from 'framer-motion';
import { Instagram, Smartphone, Mail, Globe } from 'lucide-react';

const ContactSection = () => {
    return (
        <section id="contact" className="relative min-h-screen flex flex-col items-center justify-center py-20 px-6 overflow-hidden">

            {/* Container with carousel style */}
            <motion.div
                initial={{ opacity: 0, y: 200, scale: 0.8, rotateX: 20 }}
                whileInView={{ opacity: 1, y: 0, scale: 1, rotateX: 0 }}
                transition={{ duration: 1, type: "spring", bounce: 0.25 }}
                viewport={{ once: true, amount: 0.2 }}
                className="w-[85vw] mx-auto rounded-3xl overflow-hidden border-[8px] border-[#34f4ce] p-8 md:p-16"
                style={{
                    background: '#34f4ce',
                    boxShadow: "8px 8px 0px #ff7db2, 16px 16px 0px #00b9ec, 24px 24px 0px #ffffff, -8px -8px 0px #ff7db2, -16px -16px 0px #00b9ec, -24px -24px 0px #ffffff",
                    transformStyle: 'preserve-3d',
                    perspective: '1500px'
                }}
            >
                <div className="relative z-10 max-w-5xl w-full mx-auto">

                    <motion.div
                        initial={{ opacity: 0, x: -50 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.8 }}
                        viewport={{ once: true }}
                        className="text-center mb-16"
                    >
                        <h2
                            className="font-skater text-[3rem] md:text-[6rem] text-white leading-[0.9] mb-6"
                            style={{ textShadow: "4px 4px 0px #ff7db2, 8px 8px 0px #00b9ec" }}
                        >
                            CONTACTANOS
                        </h2>
                        <p className="text-black text-xl md:text-2xl font-bold">
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
                            className="space-y-6"
                        >
                            <div className="flex items-center gap-6 group cursor-pointer bg-white/20 backdrop-blur-sm rounded-2xl p-4 hover:bg-white/30 transition-colors">
                                <div className="w-14 h-14 rounded-full bg-white flex items-center justify-center">
                                    <Instagram className="w-7 h-7 text-[#ff7db2]" />
                                </div>
                                <div>
                                    <h3 className="text-black font-bold text-lg">Instagram</h3>
                                    <p className="text-black/70">@royalpetts</p>
                                </div>
                            </div>

                            <div className="flex items-center gap-6 group cursor-pointer bg-white/20 backdrop-blur-sm rounded-2xl p-4 hover:bg-white/30 transition-colors">
                                <div className="w-14 h-14 rounded-full bg-white flex items-center justify-center">
                                    <Smartphone className="w-7 h-7 text-[#00b9ec]" />
                                </div>
                                <div>
                                    <h3 className="text-black font-bold text-lg">WhatsApp</h3>
                                    <p className="text-black/70">+1 234 567 890</p>
                                </div>
                            </div>

                            <div className="flex items-center gap-6 group cursor-pointer bg-white/20 backdrop-blur-sm rounded-2xl p-4 hover:bg-white/30 transition-colors">
                                <div className="w-14 h-14 rounded-full bg-white flex items-center justify-center">
                                    <Mail className="w-7 h-7 text-[#fe9e5b]" />
                                </div>
                                <div>
                                    <h3 className="text-black font-bold text-lg">Email</h3>
                                    <p className="text-black/70">contacto@royalpetts.com</p>
                                </div>
                            </div>
                        </motion.div>

                        {/* CTA Card */}
                        <motion.div
                            initial={{ opacity: 0, scale: 0.8 }}
                            whileInView={{ opacity: 1, scale: 1 }}
                            transition={{ duration: 0.8, delay: 0.4 }}
                            viewport={{ once: true }}
                            className="bg-white p-8 rounded-3xl text-center"
                            style={{
                                boxShadow: "6px 6px 0px #ff7db2, 12px 12px 0px #00b9ec"
                            }}
                        >
                            <h3 className="font-skater text-3xl md:text-4xl text-[#ff7db2] mb-4" style={{ textShadow: "2px 2px 0px #00b9ec" }}>VISÍTANOS</h3>
                            <p className="text-gray-600 mb-8">
                                Agenda una cita para conocer a nuestros cachorros en persona.
                            </p>
                            <button
                                className="bg-[#ff7db2] text-white font-bold py-4 px-10 rounded-full hover:scale-105 transition-transform"
                                style={{
                                    boxShadow: "4px 4px 0px #00b9ec"
                                }}
                            >
                                AGENDAR CITA
                            </button>
                        </motion.div>

                    </div>
                </div>
            </motion.div>

        </section>
    );
};

export default ContactSection;
