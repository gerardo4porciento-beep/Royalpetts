import React from 'react';

const PuppyLoveTicker = () => {
    // Content unit to be repeated
    const TickerContent = () => (
        <div className="flex items-center gap-12 px-6">
            {/* Item 1 */}
            <div className="flex items-center gap-3">
                <span className="text-2xl">🐾</span>
                <span className="tracking-widest font-black uppercase">ROYALPETTS CACHORROS</span>
            </div>

            {/* Item 2 */}
            <div className="flex items-center gap-3">
                <span className="text-red-500 text-2xl">❤️</span>
                <span className="tracking-widest font-black uppercase">AMOR EN CUATRO PATAS</span>
            </div>

            {/* Item 3 */}
            <div className="flex items-center gap-3">
                <span className="text-2xl">🐾</span>
                <span className="tracking-widest font-black uppercase">COMPAÑEROS DE VIDA</span>
            </div>

            {/* Item 4 */}
            <div className="flex items-center gap-3">
                <span className="text-red-500 text-2xl">❤️</span>
            </div>
        </div>
    );

    return (
        <div className="w-full bg-[#fceef5] overflow-hidden py-4 border-y-2 border-white/50 relative z-40">
            {/* The infinite scrolling container */}
            <div className="animate-scroll-ticker flex items-center text-[#8e6e7b] font-sans font-bold text-lg md:text-xl whitespace-nowrap select-none">
                {/* We repeat the content multiple times to ensure continuous fill */}
                <TickerContent />
                <TickerContent />
                <TickerContent />
                <TickerContent />
                <TickerContent />
                <TickerContent />
            </div>
        </div>
    );
};

export default PuppyLoveTicker;
