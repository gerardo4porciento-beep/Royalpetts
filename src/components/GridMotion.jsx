import { useEffect, useRef } from 'react';
import { gsap } from 'gsap';

const GridMotion = ({ items = [], onItemClick = null }) => {
    const gridRef = useRef(null);
    const rowRefs = useRef([]);

    const totalItems = 28;
    const defaultItems = Array.from({ length: totalItems }, (_, index) => `Item ${index + 1}`);
    const combinedItems = items.length > 0 ? items.slice(0, totalItems) : defaultItems;

    useEffect(() => {
        gsap.ticker.lagSmoothing(0);
        let time = 0;

        const updateMotion = () => {
            time += 0.008;
            const maxMoveAmount = 100;
            const baseDuration = 1.2;
            const inertiaFactors = [0.6, 0.4, 0.3, 0.2];

            rowRefs.current.forEach((row, index) => {
                if (row) {
                    const direction = index % 2 === 0 ? 1 : -1;
                    const moveAmount = Math.sin(time + index * 0.5) * maxMoveAmount * direction;

                    gsap.to(row, {
                        x: moveAmount,
                        duration: baseDuration + inertiaFactors[index % inertiaFactors.length],
                        ease: 'power3.out',
                        overwrite: 'auto'
                    });
                }
            });
        };

        const removeAnimationLoop = gsap.ticker.add(updateMotion);

        return () => {
            removeAnimationLoop();
        };
    }, []);

    const handleClick = (item) => {
        if (onItemClick && typeof item === 'object' && item.breed) {
            onItemClick(item);
        }
    };

    return (
        <div ref={gridRef} className="h-full w-full overflow-hidden bg-[#34f4ce]">
            <section
                className="w-full h-full overflow-hidden relative flex items-center justify-center"
                style={{
                    backgroundColor: '#34f4ce'
                }}
            >
                {/* Rotated Grid Container */}
                <div
                    className="relative flex flex-col gap-4"
                    style={{
                        transform: 'rotate(-12deg) scale(1.3)',
                        transformOrigin: 'center center'
                    }}
                >
                    {Array.from({ length: 4 }, (_, rowIndex) => (
                        <div
                            key={rowIndex}
                            className="flex gap-4"
                            style={{
                                willChange: 'transform',
                                marginLeft: rowIndex % 2 === 0 ? '0px' : '-80px'
                            }}
                            ref={el => {
                                if (el) rowRefs.current[rowIndex] = el;
                            }}
                        >
                            {Array.from({ length: 7 }, (_, itemIndex) => {
                                const content = combinedItems[rowIndex * 7 + itemIndex];
                                const imageSrc = typeof content === 'object' ? content.image : content;
                                const isClickable = typeof content === 'object' && content.breed;

                                return (
                                    <div
                                        key={itemIndex}
                                        className={`relative flex-shrink-0 ${isClickable ? 'cursor-pointer hover:scale-105 transition-transform duration-300' : ''}`}
                                        style={{
                                            width: '220px',
                                            height: '160px'
                                        }}
                                        onClick={() => handleClick(content)}
                                    >
                                        <div
                                            className="absolute inset-0 overflow-hidden bg-gradient-to-br from-gray-300 via-white to-gray-400 flex items-center justify-center"
                                            style={{
                                                borderRadius: '20px',
                                                boxShadow: '0 4px 20px rgba(0,0,0,0.4)'
                                            }}
                                        >
                                            {typeof imageSrc === 'string' && (imageSrc.startsWith('http') || imageSrc.startsWith('/')) ? (
                                                <img
                                                    src={imageSrc}
                                                    alt="Pet"
                                                    className="w-full h-full object-cover"
                                                    style={{ borderRadius: '20px' }}
                                                />
                                            ) : (
                                                <div className="p-4 text-center text-gray-500 font-bold">{content}</div>
                                            )}
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    ))}
                </div>
            </section>
        </div>
    );
};

export default GridMotion;
