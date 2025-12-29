import React, { useEffect } from 'react';
import { motion } from 'framer-motion';

const InstagramSection = () => {
    // Load Fouita widget script
    useEffect(() => {
        const script = document.createElement('script');
        script.src = 'https://wdg.fouita.com/widgets/0x38a13c.js';
        script.async = true;
        document.body.appendChild(script);

        return () => {
            // Cleanup script on unmount
            const existingScript = document.querySelector('script[src="https://wdg.fouita.com/widgets/0x38a13c.js"]');
            if (existingScript) {
                existingScript.remove();
            }
        };
    }, []);

    return (
        <section className="relative py-20 px-6">
            {/* Container with same style as carousel */}
            <motion.div
                initial={{ opacity: 0, y: 150, scale: 0.85, rotateX: 15 }}
                whileInView={{ opacity: 1, y: 0, scale: 1, rotateX: 0 }}
                transition={{ duration: 1, type: "spring", bounce: 0.2 }}
                viewport={{ once: true, amount: 0.2 }}
                className="w-[65vw] max-w-4xl mx-auto rounded-3xl overflow-hidden border-[8px] border-[#34f4ce] p-6 md:p-8"
                style={{
                    background: '#ffffff',
                    boxShadow: "8px 8px 0px #ff7db2, 16px 16px 0px #00b9ec, 24px 24px 0px #ffffff, -8px -8px 0px #ff7db2, -16px -16px 0px #00b9ec, -24px -24px 0px #ffffff",
                    transformStyle: 'preserve-3d',
                    perspective: '1500px'
                }}
            >


                {/* Fouita Instagram Widget */}
                <div
                    data-key="Grid Instagram Feed"
                    className="ft"
                    id="fthozih1z"
                />


            </motion.div>
        </section>
    );
};

export default InstagramSection;
