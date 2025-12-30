import React from 'react';

const LogoLoop = () => {
    const items = Array(15).fill(null);

    return (
        <section className="relative py-10 overflow-hidden">
            <div className="flex animate-marquee">
                {items.map((_, index) => (
                    <div key={index} className="flex items-center gap-10 mx-10 flex-shrink-0">
                        <span
                            className="font-skater text-6xl md:text-8xl lg:text-9xl text-white whitespace-nowrap"
                            style={{ textShadow: "4px 4px 0px #ff7db2, 8px 8px 0px #00b9ec" }}
                        >
                            ROYALPETTS
                        </span>

                        <img
                            src="/SEPARACION 6/LOGO 3.png"
                            alt="Royal Petts Logo"
                            className="w-24 h-24 md:w-32 md:h-32 lg:w-44 lg:h-44 object-contain flex-shrink-0 brightness-0 invert drop-shadow-[0_0_15px_rgba(255,255,255,0.8)] rotate-[45deg]"
                        />
                    </div>
                ))}
            </div>

            <style>{`
                @keyframes marquee {
                    0% {
                        transform: translateX(0);
                    }
                    100% {
                        transform: translateX(-50%);
                    }
                }
                .animate-marquee {
                    animation: marquee 40s linear infinite;
                }
            `}</style>
        </section>
    );
};

export default LogoLoop;
