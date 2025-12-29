import React, { useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import breedInfo from '../data/breed_info.json';
import { X } from 'lucide-react';

const BreedModal = ({ pet, onClose }) => {
    // Lock body scroll when modal is open
    useEffect(() => {
        if (pet) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = 'unset';
        }
        return () => { document.body.style.overflow = 'unset'; };
    }, [pet]);

    if (!pet) return null;

    // Normalize keys to find match (case insensitive, remove spaces if needed, or simple match)
    // The gallery titles are usually clean like "Golden Retriever" or "Beagle"
    // The JSON keys should match these titles.
    const info = breedInfo[pet.title] || {
        description: "Información detallada sobre esta maravillosa raza próximamente.",
        size: "N/A",
        origin: "N/A",
        lifeExpectancy: "N/A",
        temperament: "Amigable y leal"
    };

    return (
        <AnimatePresence>
            {pet && (
                <motion.div
                    className="fixed inset-0 z-[9999] flex items-center justify-center p-4 sm:p-8"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                >
                    {/* Backdrop */}
                    <div
                        className="absolute inset-0 bg-black/80 backdrop-blur-md"
                        onClick={onClose}
                    ></div>

                    {/* Modal Card */}
                    <motion.div
                        className="relative bg-white w-full max-w-5xl rounded-[2rem] overflow-hidden shadow-2xl flex flex-col md:flex-row max-h-[90vh]"
                        initial={{ scale: 0.9, y: 20, opacity: 0 }}
                        animate={{ scale: 1, y: 0, opacity: 1 }}
                        exit={{ scale: 0.9, y: 20, opacity: 0 }}
                        transition={{ type: "spring", damping: 25, stiffness: 300 }}
                    >
                        {/* Close Button */}
                        <button
                            onClick={onClose}
                            className="absolute top-4 right-4 z-50 p-3 bg-red-500 hover:bg-red-600 rounded-full shadow-xl transition-all hover:scale-110 active:scale-95"
                        >
                            <X className="w-8 h-8 text-white stroke-[3px]" />
                        </button>

                        {/* Left Side: Image */}
                        <div className="w-full md:w-1/2 h-[40vh] md:h-auto relative bg-gray-100">
                            <img
                                src={pet.image}
                                alt={pet.title}
                                className="w-full h-full object-cover"
                            />
                            {/* Gradient Overlay for text visibility if needed */}
                            <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent md:hidden"></div>

                            {/* Title on Mobile (Over Image) */}
                            <div className="absolute bottom-6 left-6 md:hidden">
                                <h2
                                    className="font-skater text-5xl text-white"
                                    style={{ textShadow: `2px 2px 0px ${pet.color}` }}
                                >
                                    {pet.title}
                                </h2>
                            </div>
                        </div>

                        {/* Right Side: Content */}
                        <div className="w-full md:w-1/2 p-8 md:p-12 flex flex-col overflow-y-auto bg-white">

                            {/* Title Desktop */}
                            <h2
                                className="hidden md:block font-skater text-7xl mb-6 text-royal-black"
                                style={{ textShadow: `3px 3px 0px ${pet.color}` }}
                            >
                                {pet.title}
                            </h2>

                            {/* Main Description */}
                            <p className="text-gray-600 text-lg leading-relaxed mb-8">
                                {info.description}
                            </p>

                            {/* Details Grid */}
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mb-8">
                                <div className="bg-royal-black p-4 rounded-xl border border-royal-blue/30">
                                    <h4 className="font-bold text-royal-blue text-sm uppercase mb-1">Tamaño</h4>
                                    <p className="font-semibold text-white">{info.size}</p>
                                </div>
                                <div className="bg-royal-black p-4 rounded-xl border border-royal-green/30">
                                    <h4 className="font-bold text-royal-green text-sm uppercase mb-1">Origen</h4>
                                    <p className="font-semibold text-white">{info.origin}</p>
                                </div>
                                <div className="bg-royal-black p-4 rounded-xl border border-royal-pink/30">
                                    <h4 className="font-bold text-royal-pink text-sm uppercase mb-1">Vida media</h4>
                                    <p className="font-semibold text-white">{info.lifeExpectancy}</p>
                                </div>
                                <div className="bg-royal-black p-4 rounded-xl border border-royal-orange/30">
                                    <h4 className="font-bold text-royal-orange text-sm uppercase mb-1">Temperamento</h4>
                                    <p className="font-semibold text-white">{info.temperament}</p>
                                </div>
                            </div>

                            {/* Action Button */}
                            <div className="mt-auto">
                                <button className="w-full py-4 rounded-xl font-bold text-white text-xl transition-transform hover:scale-[1.02] active:scale-[0.98] shadow-lg"
                                    style={{ backgroundColor: pet.color }}
                                >
                                    ¡Lo quiero!
                                </button>
                            </div>

                        </div>
                    </motion.div>
                </motion.div>
            )}
        </AnimatePresence>
    );
};

export default BreedModal;
