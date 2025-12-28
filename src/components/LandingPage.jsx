import React from 'react';
import SmoothScroll from './SmoothScroll';
import HeroSection from './HeroSection';

// import AccessoriesGrid from './AccessoriesGrid'; // REMOVED
// import Footer from './Footer'; // REMOVED
import Navbar from './Navbar';
import GallerySection from './GallerySection';
import ScrollGuidePath from './ScrollGuidePath';
import FamilySection from './FamilySection';
import ContactSection from './ContactSection';

import { motion, useScroll, useSpring } from 'framer-motion';

import "./LandingPage.css";

const LandingPage = () => {
    const { scrollYProgress } = useScroll();
    const scaleX = useSpring(scrollYProgress, {
        stiffness: 100,
        damping: 30,
        restDelta: 0.001
    });

    return (
        <SmoothScroll>
            <div id="scrolly-main-wrapper" className="relative bg-royal-black text-white selection:bg-royal-pink selection:text-white">
                {/* Global Progress Bar */}
                <motion.div
                    className="fixed top-0 left-0 right-0 h-2 bg-gradient-to-r from-royal-blue via-royal-green to-royal-yellow z-50 origin-left"
                    style={{ scaleX }}
                />

                {/* Path Tracing Scroll Effect */}
                <ScrollGuidePath />

                {/* Navigation (Simplified for Immersion) */}
                <Navbar />

                <main>
                    <HeroSection />
                    <GallerySection />

                    {/* New Sections */}
                    <FamilySection />
                    <ContactSection />
                </main>

                {/* Footer Removed as requested */}
            </div>
        </SmoothScroll>
    );
};

export default LandingPage;

