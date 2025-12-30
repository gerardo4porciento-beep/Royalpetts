import React, { useState } from 'react';
import GridMotion from './GridMotion';
import breedInfo from '../data/breed_info.json';
import { motion, AnimatePresence } from 'framer-motion';

const GallerySection = () => {
    const [selectedBreed, setSelectedBreed] = useState(null);
    const [selectedImage, setSelectedImage] = useState(null);

    // Pet images with breed mapping
    const items = [
        { image: '/ROYALPETTS LIVE CONECT/Bulldog Frances/bulldogfrances1.jpg', breed: 'Bulldog Frances' },
        { image: '/ROYALPETTS LIVE CONECT/Pomerania/pomerania1.jpg', breed: 'Pomerania' },
        { image: '/ROYALPETTS LIVE CONECT/Golden Retriever/goldenretriever1.jpg', breed: 'Golden Retriever' },
        { image: '/ROYALPETTS LIVE CONECT/Chihuahua/chihuahua1.jpg', breed: 'Chihuahua' },
        { image: '/ROYALPETTS LIVE CONECT/Husky/husky1.jpg', breed: 'Husky' },
        { image: '/ROYALPETTS LIVE CONECT/Goldendoodle/goldendoodle1.jpg', breed: 'Goldendoodle' },
        { image: '/ROYALPETTS LIVE CONECT/Maltipoo/maltipoo1.jpg', breed: 'Maltipoo' },
        { image: '/ROYALPETTS LIVE CONECT/Bulldog Frances/bulldogfrances2.jpg', breed: 'Bulldog Frances' },
        { image: '/ROYALPETTS LIVE CONECT/Pomerania/pomerania2.jpg', breed: 'Pomerania' },
        { image: '/ROYALPETTS LIVE CONECT/Golden Retriever/goldenretriever2.jpg', breed: 'Golden Retriever' },
        { image: '/ROYALPETTS LIVE CONECT/Chihuahua/chihuahua2.jpg', breed: 'Chihuahua' },
        { image: '/ROYALPETTS LIVE CONECT/Husky/husky2.jpg', breed: 'Husky' },
        { image: '/ROYALPETTS LIVE CONECT/Goldendoodle/goldendoodle2.jpg', breed: 'Goldendoodle' },
        { image: '/ROYALPETTS LIVE CONECT/Beagle/beagle1.jpg', breed: 'Beagle' },
        { image: '/ROYALPETTS LIVE CONECT/Bulldog Frances/bulldogfrances3.jpg', breed: 'Bulldog Frances' },
        { image: '/ROYALPETTS LIVE CONECT/Pomerania/pomerania3.jpg', breed: 'Pomerania' },
        { image: '/ROYALPETTS LIVE CONECT/Caniche Toy Rojo/canichetoyrojo1.jpg', breed: 'Caniche' },
        { image: '/ROYALPETTS LIVE CONECT/Chihuahua/chihuahua3.jpg', breed: 'Chihuahua' },
        { image: '/ROYALPETTS LIVE CONECT/Husky/husky3.jpg', breed: 'Husky' },
        { image: '/ROYALPETTS LIVE CONECT/Goldendoodle/goldendoodle3.jpg', breed: 'Goldendoodle' },
        { image: '/ROYALPETTS LIVE CONECT/Beagle/beagle2.jpg', breed: 'Beagle' },
        { image: '/ROYALPETTS LIVE CONECT/Bulldog Frances/bulldogfrances4.jpg', breed: 'Bulldog Frances' },
        { image: '/ROYALPETTS LIVE CONECT/Pomerania/pomerania4.jpg', breed: 'Pomerania' },
        { image: '/ROYALPETTS LIVE CONECT/Caniche Toy Rojo/canichetoyrojo2.jpg', breed: 'Caniche' },
        { image: '/ROYALPETTS LIVE CONECT/Chihuahua/chihuahua4.jpg', breed: 'Chihuahua' },
        { image: '/ROYALPETTS LIVE CONECT/Doberman/doberman1.jpg', breed: 'Doberman' },
        { image: '/ROYALPETTS LIVE CONECT/Bulldog Frances/bulldogfrances5.jpg', breed: 'Bulldog Frances' },
        { image: '/ROYALPETTS LIVE CONECT/Pomerania/pomerania5.jpg', breed: 'Pomerania' },
    ];

    const handleImageClick = (item) => {
        const info = breedInfo[item.breed];
        if (info) {
            setSelectedBreed({ name: item.breed, ...info });
            setSelectedImage(item.image);
        }
    };

    const closeCard = () => {
        setSelectedBreed(null);
        setSelectedImage(null);
    };

    const whatsappMessage = selectedBreed
        ? `Hola, estoy interesado en un cachorro de ${selectedBreed.name}`
        : '';
    const whatsappUrl = `https://wa.me/584129461175?text=${encodeURIComponent(whatsappMessage)}`;

    return (
        <section id="gallery" className="relative min-h-screen py-20">
            {/* Wide Container */}
            <motion.div
                initial={{ opacity: 0, y: 150, scale: 0.85, rotateX: 15 }}
                whileInView={{ opacity: 1, y: 0, scale: 1, rotateX: 0 }}
                transition={{ duration: 1, type: "spring", bounce: 0.2 }}
                viewport={{ once: true, amount: 0.2 }}
                className="w-[92vw] sm:w-[85vw] mx-auto h-[60vh] sm:h-[80vh] rounded-3xl overflow-hidden border-[3px] md:border-[4px] border-[#34f4ce] bg-white"
                style={{
                    transformStyle: 'preserve-3d',
                    perspective: '1500px',
                    boxShadow: window.innerWidth < 640
                        ? "4px 4px 0px #ff7db2, 8px 8px 0px #00b9ec"
                        : "6px 6px 0px #ff7db2, 12px 12px 0px #00b9ec"
                }}
            >
                <GridMotion items={items} onItemClick={handleImageClick} />
            </motion.div>

            {/* Breed Info Card Modal */}
            <AnimatePresence>
                {selectedBreed && (
                    <>
                        {/* Backdrop */}
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            onClick={closeCard}
                            className="fixed inset-0 bg-black/50 z-[9990] flex items-center justify-center"
                        >
                            {/* Card - Responsive Layout: Vertical on mobile, Horizontal on desktop */}
                            <motion.div
                                initial={{ opacity: 0, scale: 0.9, y: 20 }}
                                animate={{ opacity: 1, scale: 1, y: 0 }}
                                exit={{ opacity: 0, scale: 0.9, y: 20 }}
                                onClick={(e) => e.stopPropagation()}
                                className="w-[85vw] max-w-[500px] md:max-w-[700px] max-h-[85vh] overflow-y-auto bg-white rounded-3xl overflow-hidden shadow-2xl flex flex-col md:flex-row"
                                style={{
                                    boxShadow: window.innerWidth < 640 ? "4px 4px 0px #ff7db2" : "6px 6px 0px #ff7db2, 12px 12px 0px #00b9ec",
                                    fontFamily: "'Inter', 'Segoe UI', sans-serif"
                                }}
                            >
                                {/* Image - Full width on mobile, fixed width on desktop */}
                                <div className="w-full h-[180px] md:w-[280px] md:h-auto flex-shrink-0 overflow-hidden">
                                    <img
                                        src={selectedImage}
                                        alt={selectedBreed.name}
                                        className="w-full h-full object-cover"
                                    />
                                </div>

                                {/* Right - Content (Smaller) */}
                                <div className="flex-1 p-3 relative flex flex-col justify-between">
                                    {/* Close Button */}
                                    <button
                                        onClick={closeCard}
                                        className="absolute top-2 right-2 w-6 h-6 bg-gray-100 rounded-full flex items-center justify-center text-gray-500 hover:bg-gray-200 transition-colors text-xs"
                                    >
                                        ✕
                                    </button>

                                    <div className="flex-1">
                                        <h3 className="font-skater text-xl text-[#34f4ce] mb-2 pr-6"
                                            style={{ textShadow: "1px 1px 0px #ff7db2" }}
                                        >
                                            {selectedBreed.name}
                                        </h3>

                                        <p className="text-gray-700 text-[11px] font-bold mb-3 leading-relaxed">
                                            {selectedBreed.description}
                                        </p>

                                        {/* Quick Info */}
                                        <div className="flex flex-wrap gap-2">
                                            <span className="bg-gray-100 rounded px-2 py-1 text-[10px] font-bold">
                                                <span className="text-[#00b9ec]">Tamaño:</span> {selectedBreed.size}
                                            </span>
                                            <span className="bg-gray-100 rounded px-2 py-1 text-[10px] font-bold">
                                                <span className="text-[#ff7db2]">Vida:</span> {selectedBreed.lifeExpectancy}
                                            </span>
                                        </div>
                                    </div>

                                    {/* WhatsApp Button */}
                                    <a
                                        href={whatsappUrl}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="block w-full py-1.5 bg-[#34f4ce] text-black font-semibold text-[10px] text-center rounded-full hover:scale-105 transition-transform"
                                        style={{
                                            boxShadow: "2px 2px 0px #ff7db2"
                                        }}
                                    >
                                        💬 CONSULTAR
                                    </a>
                                </div>
                            </motion.div>
                        </motion.div>
                    </>
                )}
            </AnimatePresence>
        </section>
    );
};

export default GallerySection;
