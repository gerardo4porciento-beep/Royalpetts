import React, { useEffect, useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const PawCursor = () => {
    const [mousePos, setMousePos] = useState({ x: -100, y: -100 });
    const [isPointer, setIsPointer] = useState(false);
    const [trail, setTrail] = useState([]);
    const [isBuzzing, setIsBuzzing] = useState(false);

    // Limits for trail items to avoid performance issues
    const MAX_TRAIL = 12;

    useEffect(() => {
        const handleMouseMove = (e) => {
            const { clientX, clientY, target } = e;
            setMousePos({ x: clientX, y: clientY });

            // Check if hovering interactive elements
            const interactive = target.closest('a, button, .cursor-pointer, input');
            setIsPointer(!!interactive);

            // Add trail item occasionally or based on distance
            if (Math.random() > 0.85) {
                const id = Date.now();
                setTrail(prev => [
                    ...prev.slice(-MAX_TRAIL),
                    { id, x: clientX, y: clientY, rotation: Math.random() * 360 }
                ]);
            }
        };

        const handleMouseDown = () => setIsBuzzing(true);
        const handleMouseUp = () => setIsBuzzing(false);

        window.addEventListener('mousemove', handleMouseMove);
        window.addEventListener('mousedown', handleMouseDown);
        window.addEventListener('mouseup', handleMouseUp);

        // Occasional spontaneous buzz
        const buzzInterval = setInterval(() => {
            if (Math.random() > 0.7) {
                setIsBuzzing(true);
                setTimeout(() => setIsBuzzing(false), 200);
            }
        }, 3000);

        return () => {
            window.removeEventListener('mousemove', handleMouseMove);
            window.removeEventListener('mousedown', handleMouseDown);
            window.removeEventListener('mouseup', handleMouseUp);
            clearInterval(buzzInterval);
        };
    }, []);

    // Remove trail items after animation
    useEffect(() => {
        const timer = setInterval(() => {
            setTrail(prev => prev.filter(t => Date.now() - t.id < 1000));
        }, 500);
        return () => clearInterval(timer);
    }, []);

    return (
        <div className="fixed inset-0 pointer-events-none z-[99999] overflow-hidden hidden lg:block">
            {/* Trail */}
            <AnimatePresence>
                {trail.map((step) => (
                    <motion.img
                        key={step.id}
                        src="/paw_v2.png"
                        initial={{ opacity: 0.6, scale: 0.3, x: step.x - 12, y: step.y - 12, rotate: step.rotation }}
                        animate={{ opacity: 0, scale: 0.1, y: step.y + 10 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 1, ease: "easeOut" }}
                        className="absolute w-6 h-6 grayscale opacity-40"
                    />
                ))}
            </AnimatePresence>

            {/* Main Cursor */}
            <motion.div
                className="absolute w-10 h-10 flex items-center justify-center p-1 bg-white rounded-full shadow-lg border-2 border-orange-400"
                animate={{
                    x: mousePos.x - 20,
                    y: mousePos.y - 20,
                    scale: isPointer ? 1.4 : 1,
                    rotate: isBuzzing ? [0, -5, 5, -5, 5, 0] : 0,
                    transition: {
                        x: { type: "spring", damping: 25, stiffness: 250 },
                        y: { type: "spring", damping: 25, stiffness: 250 },
                        rotate: { duration: 0.2, repeat: isBuzzing ? Infinity : 0 }
                    }
                }}
            >
                <img
                    src="/paw_v2.png"
                    alt="cursor"
                    className="w-full h-full object-contain"
                />
            </motion.div>

            {/* Inverted style for better feedback */}
            <style>{`
                body, * {
                    cursor: none !important;
                }
                a, button, .cursor-pointer {
                    cursor: none !important;
                }
            `}</style>
        </div>
    );
};

export default PawCursor;
