import React, { useState } from 'react';
import petsData from '../data/gallery_pets.json'; // Importing generated data
import BreedModal from './BreedModal';

// Split data into two rows for the marquee
const half = Math.ceil(petsData.length / 2);
const row1Pets = petsData.slice(0, half);
const row2Pets = petsData.slice(half);

// Component for Marquee Items
const MarqueeItem = ({ pet, onClick }) => (
    <div
        className="relative flex-shrink-0 w-[220px] h-[220px] sm:w-[280px] sm:h-[280px] mx-0 rounded-none bg-black overflow-hidden group transition-all duration-500 hover:scale-105 hover:z-20 border-y-[16px] sm:border-y-[24px] border-black border-r-[2px] border-gray-900"
        style={{
            boxShadow: `0 0 0 rgba(0,0,0,0)` // Default header
        }}
        // Using inline style for dynamic hover shadow is tricky in React without state, 
        // so we'll use a group-hover tactic or just rely on CSS variables if we could.
        // Instead, let's use a nested div for the glow or standard tailwind utilities if colors were standard.
        // Since colors are dynamic, we will use a workaround.
        onMouseEnter={(e) => {
            e.currentTarget.style.boxShadow = `0 15px 40px ${pet.color}66`; // 66 = 40% opacity
        }}
        onMouseLeave={(e) => {
            e.currentTarget.style.boxShadow = 'none';
        }}
        onClick={() => onClick && onClick(pet)}
    >
        {/* Sprocket Holes Simulation (Top) */}
        <div className="absolute top-[-14px] sm:top-[-20px] left-0 w-full h-[12px] flex justify-between px-1 pointer-events-none z-30">
            {[...Array(8)].map((_, i) => <div key={i} className="w-[8px] h-[6px] sm:w-[12px] sm:h-[8px] bg-white/30 rounded-sm"></div>)}
        </div>

        {/* Image */}
        <img
            src={pet.image}
            alt={pet.title}
            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110 group-hover:blur-[0px]"
        />

        {/* Sprocket Holes Simulation (Bottom) */}
        <div className="absolute bottom-[-14px] sm:bottom-[-20px] left-0 w-full h-[12px] flex justify-between px-1 pointer-events-none z-30">
            {[...Array(8)].map((_, i) => <div key={i} className="w-[8px] h-[6px] sm:w-[12px] sm:h-[8px] bg-white/30 rounded-sm"></div>)}
        </div>

        {/* Gradient Overlay for Text Readability */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>

        {/* Ribbon/Text Overlay */}
        <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-300 transform group-hover:scale-100 scale-90">
            {/* Glassmorphism Badge */}
            <div
                className="px-4 py-2 sm:px-6 sm:py-3 bg-opacity-90 backdrop-blur-md rounded-lg shadow-2xl transform flex justify-center items-center border border-white/20"
                style={{ backgroundColor: pet.color }}
            >
                <h3
                    className="text-[1.5rem] sm:text-[2rem] font-skater text-royal-blue leading-none tracking-wide drop-shadow-lg"
                    style={{ textShadow: "2px 2px 0px #ffffff" }}
                >
                    {pet.title}
                </h3>
            </div>
        </div>
    </div>
);

const GallerySection = () => {
    const [selectedPet, setSelectedPet] = useState(null);

    return (
        <section id="gallery" className="relative min-h-screen bg-cover bg-center flex flex-col justify-center overflow-hidden py-24" style={{ backgroundImage: "url('/fondo_galeria.png')" }}>

            {/* Header */}
            <div className="absolute top-10 left-6 md:left-12 z-20 pointer-events-none">
                <h2
                    className="font-skater text-[4rem] sm:text-[6rem] lg:text-[7rem] text-white leading-[0.9] transform origin-left"
                    style={{ textShadow: "4px 4px 0px #ff7db2, 8px 8px 0px #00b9ec" }}
                >
                    GALERÍA
                </h2>
                <div className="absolute inset-0 pointer-events-none select-none mix-blend-overlay opacity-30"></div>
            </div>

            {/* Marquee Container */}
            <div className="flex flex-col gap-0 mt-20 md:mt-[50px] relative z-10">

                {/* --- Row 1: Moving LEFT --- */}
                <div
                    className="relative w-full overflow-hidden transform -rotate-1 hover:rotate-0 transition-transform duration-700 ease-out"
                    style={{ maskImage: 'linear-gradient(to right, transparent, black 5%, black 95%, transparent)' }}
                >
                    <div className="flex w-max animate-marquee gap-8 py-2"> {/* Reduced padding */}
                        {/* Render Row 1 */}
                        {row1Pets.map((pet, i) => (
                            <MarqueeItem key={"r1-" + i} pet={pet} onClick={setSelectedPet} />
                        ))}
                        {/* Duplicate for Loop */}
                        {row1Pets.map((pet, i) => (
                            <MarqueeItem key={"r1-dup-" + i} pet={pet} onClick={setSelectedPet} />
                        ))}
                        {/* Duplicate Again for Safety */}
                        {row1Pets.length < 10 && row1Pets.map((pet, i) => (
                            <MarqueeItem key={"r1-tri-" + i} pet={pet} onClick={setSelectedPet} />
                        ))}
                    </div>
                </div>

                {/* --- Row 2: Moving RIGHT --- */}
                <div
                    className="relative w-full overflow-hidden transform rotate-1 hover:rotate-0 transition-transform duration-700 ease-out"
                    style={{ maskImage: 'linear-gradient(to right, transparent, black 5%, black 95%, transparent)' }}
                >
                    <div className="flex w-max animate-marquee-reverse gap-8 py-2"> {/* Reduced padding */}
                        {/* Render Row 2 */}
                        {row2Pets.map((pet, i) => (
                            <MarqueeItem key={"r2-" + i} pet={pet} onClick={setSelectedPet} />
                        ))}
                        {/* Duplicate for Loop */}
                        {row2Pets.map((pet, i) => (
                            <MarqueeItem key={"r2-dup-" + i} pet={pet} onClick={setSelectedPet} />
                        ))}
                        {/* Duplicate Again for Safety */}
                        {row2Pets.length < 10 && row2Pets.map((pet, i) => (
                            <MarqueeItem key={"r2-tri-" + i} pet={pet} onClick={setSelectedPet} />
                        ))}
                    </div>
                </div>

            </div>

            {/* Background Decor */}
            <div className="absolute -bottom-20 -left-20 w-96 h-96 bg-royal-blue/20 rounded-full blur-[100px] pointer-events-none mix-blend-multiply"></div>
            <div className="absolute top-20 right-20 w-72 h-72 bg-royal-orange/20 rounded-full blur-[80px] pointer-events-none mix-blend-multiply"></div>

            {/* Details Modal */}
            <BreedModal pet={selectedPet} onClose={() => setSelectedPet(null)} />

        </section>
    );
};

export default GallerySection;
