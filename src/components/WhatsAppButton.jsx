import React from 'react';
import { motion } from 'framer-motion';
import { Smartphone } from 'lucide-react';

const WhatsAppButton = () => {
    // Replace with your actual number
    const phoneNumber = "584129461175";
    const message = "Hola, vengo de tu pagina web, estoy interesado en un cachorrito";
    const whatsappUrl = `https://wa.me/${phoneNumber}?text=${encodeURIComponent(message)}`;

    return (
        <a
            href={whatsappUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="fixed bottom-6 right-6 z-[9999] flex items-center justify-center group"
            aria-label="Contactar por WhatsApp"
        >
            <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                className="w-14 h-14 bg-[#25D366] rounded-full flex items-center justify-center shadow-lg hover:shadow-xl transition-shadow relative"
            >
                <Smartphone className="text-white w-7 h-7" />

                {/* Ping animation effect */}
                <span className="absolute inline-flex h-full w-full rounded-full bg-[#25D366] opacity-75 animate-ping -z-10"></span>
            </motion.div>

            {/* Tooltip on Desktop */}
            <span className="absolute right-full mr-3 bg-white text-black px-3 py-1 rounded-lg text-sm font-bold shadow-md opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap hidden md:block pointer-events-none">
                ¡Hablemos!
            </span>
        </a>
    );
};

export default WhatsAppButton;
