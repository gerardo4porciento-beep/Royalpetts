import React from 'react';
import SmoothScroll from './SmoothScroll';
import HeroSection from './HeroSection';
import ParticleBackground from './ParticleBackground';

// import AccessoriesGrid from './AccessoriesGrid'; // REMOVED
// import Footer from './Footer'; // REMOVED as per user request
import Navbar from './Navbar';
import GallerySection from './GallerySection';
// import ScrollGuidePath from './ScrollGuidePath'; // REMOVED as per user request
import FamilySection from './FamilySection';
import ContactSection from './ContactSection';
import LogoLoop from './LogoLoop';
import FallingText from './FallingText';

// WhatsApp widget implemented via script in index.html

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
            {/* FIXED BACKGROUNDS (Moved outside main wrapper to prevent stacking issues) */}
            {/* Mobile background (visible on screens < md) */}
            <img
                src="/FONDO_MOBILE4.png"
                alt="Mobile background"
                className="fixed left-0 w-full z-[-1] pointer-events-none object-cover md:hidden"
                style={{
                    top: '40px',
                    height: 'calc(100vh - 40px)',
                    backgroundColor: '#07acdd',
                    transform: 'scale(1.05)',
                }}
            />

            {/* Desktop background (visible on md and larger) */}
            <div
                ref={bgRef}
                className="absolute inset-0 w-full z-[-1] pointer-events-none hidden md:block"
                style={{
                    backgroundImage: "url('/fondo todo el landing.png')",
                    backgroundSize: 'cover',
                    backgroundPosition: 'top',
                    backgroundRepeat: 'no-repeat',
                    backgroundColor: '#07acdd',
                    transform: 'scale(1.05)',
                }}
            ></div>

            {/* Frenchie GIF anchor - Mobile Only - Z-index fixed */}
            <img
                src="/frenchie_hero.gif"
                alt="Frenchie background"
                className="fixed bottom-0 left-0 w-[240px] z-[0] pointer-events-none md:hidden"
                style={{
                    transform: 'rotate(5deg) scale(1.1)',
                    filter: 'drop-shadow(0 0 15px rgba(7, 172, 221, 0.4))'
                }}
            />

            {/* Main Content Wrapper */}
            <div
                id="scrolly-main-wrapper"
                className="relative text-white selection:bg-royal-pink selection:text-white overflow-x-hidden"
            >

                {/* Magical Particle Atmosphere */}
                <ParticleBackground />
                {/* Global Progress Bar */}
                <motion.div
                    className="fixed top-0 left-0 right-0 h-2 bg-gradient-to-r from-royal-blue via-royal-green to-royal-yellow z-50 origin-left"
                    style={{ scaleX }}
                />

                {/* Path Tracing Scroll Effect */}
                {/* Path Tracing Scroll Effect - REMOVED */}
                {/* <ScrollGuidePath /> */}

                {/* Navigation (Simplified for Immersion) */}
                <Navbar />

                {/* WhatsApp Floating Button */}
                {/* WhatsApp Widget is loaded via index.html script */}

                <main className="relative z-10">
                    <HeroSection />
                    <GallerySection />
                    <LogoLoop />

                    {/* New Sections */}
                    <FamilySection />

                    <ContactSection />
                </main>

                {/* <Footer /> - REMOVED */}
            </div>
        </SmoothScroll>
    );
};

export default LandingPage;
