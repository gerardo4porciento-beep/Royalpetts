import React from 'react';
import SmoothScroll from './SmoothScroll';
import HeroSection from './HeroSection';
import ParticleBackground from './ParticleBackground';

// import AccessoriesGrid from './AccessoriesGrid'; // REMOVED
// import Footer from './Footer'; // REMOVED
import Navbar from './Navbar';
import GallerySection from './GallerySection';
import ScrollGuidePath from './ScrollGuidePath';
import FamilySection from './FamilySection';
import ContactSection from './ContactSection';
import LogoLoop from './LogoLoop';
import InstagramSection from './InstagramSection';
import WhatsAppButton from './WhatsAppButton';

import { motion, useScroll, useSpring } from 'framer-motion';

import "./LandingPage.css";

const LandingPage = () => {
    const { scrollYProgress } = useScroll();
    const scaleX = useSpring(scrollYProgress, {
        stiffness: 100,
        damping: 30,
        restDelta: 0.001
    });

    const bgRef = React.useRef(null);

    React.useEffect(() => {
        const handleMouseMove = (e) => {
            if (!bgRef.current) return;
            const { clientX, clientY } = e;
            const { innerWidth, innerHeight } = window;

            // Calculate movement (inverted for depth feel)
            // Range: -20px to +20px horizontally, -10px to +10px vertically
            const x = (innerWidth / 2 - clientX) / 80;
            const y = (innerHeight / 2 - clientY) / 100;

            bgRef.current.style.transform = `translate(${x}px, ${y}px) scale(1.05)`;
        };

        window.addEventListener('mousemove', handleMouseMove);
        return () => window.removeEventListener('mousemove', handleMouseMove);
    }, []);

    return (
        <SmoothScroll>
            {/* Main Wrapper */}
            <div
                id="scrolly-main-wrapper"
                className="relative bg-[#07acdd] text-white selection:bg-royal-pink selection:text-white overflow-x-hidden"
            >

                {/* Global Background (Parallax Active) */}
                <div
                    ref={bgRef}
                    className="absolute top-0 left-0 w-full h-full z-0 pointer-events-none transition-transform duration-100 ease-out will-change-transform"
                    style={{
                        backgroundColor: '#07acdd', // Matches top sky blue
                        backgroundImage: "url('/fondo_landing.webp')",
                        backgroundSize: '100% auto',
                        backgroundRepeat: 'no-repeat',
                        backgroundPosition: 'top center',
                        transform: 'scale(1.05)', // Initial scale to allow movement
                        filter: 'saturate(1.3) brightness(1.1)' // More vibrant colors
                    }}
                ></div>

                {/* Magical Particle Atmosphere */}
                <ParticleBackground />
                {/* Global Progress Bar */}
                <motion.div
                    className="fixed top-0 left-0 right-0 h-2 bg-gradient-to-r from-royal-blue via-royal-green to-royal-yellow z-50 origin-left"
                    style={{ scaleX }}
                />

                {/* Path Tracing Scroll Effect */}
                <ScrollGuidePath />

                {/* Navigation (Simplified for Immersion) */}
                <Navbar />

                {/* WhatsApp Floating Button */}
                <WhatsAppButton />

                <main>
                    <HeroSection />
                    <GallerySection />
                    <LogoLoop />

                    {/* New Sections */}
                    <FamilySection />
                    {/* <InstagramSection /> - Oculto temporalmente */}
                    <ContactSection />
                </main>

                {/* Footer Removed as requested */}
            </div>
        </SmoothScroll>
    );
};

export default LandingPage;
