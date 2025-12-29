import React, { useEffect } from 'react';
import { motion } from 'framer-motion';
import { Instagram, Smartphone, Mail } from 'lucide-react';

const ContactInstagramSection = () => {
    // Load Fouita widget script
    useEffect(() => {
        const script = document.createElement('script');
        script.src = 'https://wdg.fouita.com/widgets/0x38a13c.js';
        script.async = true;
        document.body.appendChild(script);

        return () => {
            const existingScript = document.querySelector('script[src="https://wdg.fouita.com/widgets/0x38a13c.js"]');
            if (existingScript) {
                existingScript.remove();
            }
        };
    }, []);

    return (
        <section className="relative py-20 px-6">
            {/* Grid: Instagram Widget + Contact Side by Side */}
            <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-12 items-stretch">

                {/* Instagram Widget Container */}
                <motion.div
                    initial={{ opacity: 0, x: -100, rotateY: -15 }}
                    whileInView={{ opacity: 1, x: 0, rotateY: 0 }}
                    transition={{ duration: 0.8, type: "spring", bounce: 0.2 }}
                    viewport={{ once: true, amount: 0.2 }}
                    className="rounded-3xl overflow-hidden border-[8px] border-[#34f4ce] p-6"
                    style={{
                        background: '#ffffff',
                        boxShadow: "8px 8px 0px #ff7db2, 16px 16px 0px #00b9ec, 24px 24px 0px #ffffff, -8px -8px 0px #ff7db2, -16px -16px 0px #00b9ec, -24px -24px 0px #ffffff",
                        transformStyle: 'preserve-3d',
                        perspective: '1000px'
                    }}
                >
                    {/* Fouita Instagram Widget */}
                    <div
                        data-key="Grid Instagram Feed"
                        className="ft"
                        id="fthozih1z"
                    />
                </motion.div>

                {/* Contact Container */}
                <motion.div
                    initial={{ opacity: 0, x: 100, rotateY: 15 }}
                    whileInView={{ opacity: 1, x: 0, rotateY: 0 }}
                    transition={{ duration: 0.8, delay: 0.2, type: "spring", bounce: 0.2 }}
                    viewport={{ once: true, amount: 0.2 }}
                    className="rounded-3xl overflow-hidden border-[8px] border-[#34f4ce] p-6 md:p-8"
                    style={{
                        background: '#34f4ce',
                        boxShadow: "8px 8px 0px #ff7db2, 16px 16px 0px #00b9ec, 24px 24px 0px #ffffff, -8px -8px 0px #ff7db2, -16px -16px 0px #00b9ec, -24px -24px 0px #ffffff",
                        transformStyle: 'preserve-3d',
                        perspective: '1000px'
                    }}
                >
                    {/* Header */}
                    <h2
                        className="font-skater text-3xl md:text-4xl text-white leading-[0.9] mb-6 text-center"
                        style={{ textShadow: "3px 3px 0px #ff7db2" }}
                    >
                        CONTACTANOS
                    </h2>

                    {/* Contact Info */}
                    <div className="space-y-4 mb-6">
                        <div className="flex items-center gap-4 bg-white/20 backdrop-blur-sm rounded-2xl p-3 hover:bg-white/30 transition-colors cursor-pointer">
                            <div className="w-12 h-12 rounded-full bg-white flex items-center justify-center">
                                <Instagram className="w-6 h-6 text-[#ff7db2]" />
                            </div>
                            <div>
                                <h3 className="text-black font-bold">Instagram</h3>
                                <p className="text-black/70 text-sm">@royalpetts</p>
                            </div>
                        </div>

                        <div className="flex items-center gap-4 bg-white/20 backdrop-blur-sm rounded-2xl p-3 hover:bg-white/30 transition-colors cursor-pointer">
                            <div className="w-12 h-12 rounded-full bg-white flex items-center justify-center">
                                <Smartphone className="w-6 h-6 text-[#00b9ec]" />
                            </div>
                            <div>
                                <h3 className="text-black font-bold">WhatsApp</h3>
                                <p className="text-black/70 text-sm">+1 234 567 890</p>
                            </div>
                        </div>

                        <div className="flex items-center gap-4 bg-white/20 backdrop-blur-sm rounded-2xl p-3 hover:bg-white/30 transition-colors cursor-pointer">
                            <div className="w-12 h-12 rounded-full bg-white flex items-center justify-center">
                                <Mail className="w-6 h-6 text-[#fe9e5b]" />
                            </div>
                            <div>
                                <h3 className="text-black font-bold">Email</h3>
                                <p className="text-black/70 text-sm">contacto@royalpetts.com</p>
                            </div>
                        </div>
                    </div>

                    {/* CTA Button */}
                    <div className="text-center">
                        <button
                            className="bg-white text-[#ff7db2] font-bold py-3 px-8 rounded-full hover:scale-105 transition-transform"
                            style={{
                                boxShadow: "4px 4px 0px #ff7db2"
                            }}
                        >
                            AGENDAR CITA
                        </button>
                    </div>
                </motion.div>
            </div>
        </section>
    );
};

export default ContactInstagramSection;
