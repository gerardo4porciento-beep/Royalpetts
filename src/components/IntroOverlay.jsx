import React, { useState, useEffect } from 'react';

const IntroOverlay = ({ onComplete }) => {
    const [isVisible, setIsVisible] = useState(true);

    // Fallback timeout in case video fails or user has "data-saver" preventing autoplay
    useEffect(() => {
        const timer = setTimeout(() => {
            handleEnd();
        }, 8000); // 8 seconds fallback
        return () => clearTimeout(timer);
    }, []);

    const handleEnd = () => {
        setIsVisible(false);
        // Wait for fade out animation (1s) before unmounting
        setTimeout(() => {
            onComplete();
        }, 1000);
    };

    return (
        <div
            className={`fixed inset-0 z-[100] bg-black flex items-center justify-center transition-opacity duration-1000 ${isVisible ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}
        >
            <video
                autoPlay
                muted
                playsInline
                className="w-full h-full object-cover"
                onEnded={handleEnd}
            >
                <source src="/assets/video/intro.mp4" type="video/mp4" />
                {/* Fallback text if video missing */}
            </video>
        </div>
    );
};

export default IntroOverlay;
