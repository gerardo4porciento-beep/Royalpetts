import React, { useRef, useEffect, Suspense, useState } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import {
    Environment,
    Float,
    Stars,
    Sparkles,
    Image,
    SpotLight,
    Cloud,
    PerspectiveCamera
} from '@react-three/drei';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { motion } from 'framer-motion';

// Register Plugin safely
if (typeof window !== 'undefined') {
    gsap.registerPlugin(ScrollTrigger);
}

// --- Error Boundary Component ---
class ErrorBoundary extends React.Component {
    constructor(props) {
        super(props);
        this.state = { hasError: false };
    }

    static getDerivedStateFromError(error) {
        return { hasError: true };
    }

    componentDidCatch(error, errorInfo) {
        console.error("3D Scene Error:", error, errorInfo);
    }

    render() {
        if (this.state.hasError) {
            return this.props.FallbackComponent ? <this.props.FallbackComponent /> : null;
        }

        return this.props.children;
    }
}

// --- 3D Components ---

const FloatingPet = ({ url, position, rotation, scale, speed = 1 }) => {
    const meshRef = useRef();

    // Mouse parallax effect in 3D
    useFrame((state) => {
        const t = state.clock.getElapsedTime();
        const mouseX = state.pointer.x;
        const mouseY = state.pointer.y;

        if (meshRef.current) {
            // Floating movement
            meshRef.current.position.y = position[1] + Math.sin(t * speed) * 0.2;

            // Mouse look
            meshRef.current.rotation.y = rotation[1] + (mouseX * 0.1);
            meshRef.current.rotation.x = rotation[0] - (mouseY * 0.05);
        }
    });

    return (
        <group ref={meshRef} position={position} rotation={rotation} scale={scale}>
            <Image url={url} transparent opacity={1} />
        </group>
    );
};

const SceneContent = () => {
    return (
        <>
            <PerspectiveCamera makeDefault position={[0, 0, 8]} fov={50} />

            {/* Ambient Atmosphere */}
            <ambientLight intensity={0.5} color="#4a4a8a" />

            {/* Dramatic Lighting (Rim Lights) */}
            <SpotLight
                position={[-5, 5, 5]}
                angle={0.5}
                penumbra={1}
                intensity={5}
                color="#32f4bb"
                castShadow
                distance={20}
            />
            <SpotLight
                position={[5, 1, 5]}
                angle={0.5}
                penumbra={1}
                intensity={5}
                color="#ff7db2"
                castShadow
                distance={20}
            />

            {/* Dynamic Elements (Atmosphere) - Removed stars, sparkles and spotlight */}

            {/* Dynamic Elements (Atmosphere) - Removed stars */}
            <Environment preset="night" blur={0.5} />
        </>
    );
};

// --- Main Component ---

const HeroSection = () => {
    const puppyRef = useRef(null);
    const shadowRef = useRef(null);
    const containerRef = useRef(null);
    const titleRef = useRef(null);
    const subtitleRef = useRef(null);
    const buttonsRef = useRef(null);
    const bgRef = useRef(null);

    const [isMobile, setIsMobile] = useState(false);

    useEffect(() => {
        const checkMobile = () => setIsMobile(window.innerWidth < 1024);
        checkMobile();
        window.addEventListener('resize', checkMobile);
        return () => window.removeEventListener('resize', checkMobile);
    }, []);

    useEffect(() => {
        const ctx = gsap.context(() => {
            const tl = gsap.timeline({ defaults: { ease: "power4.out" } });

            // Initial Text Reveal Animation
            if (titleRef.current) {
                tl.fromTo(titleRef.current,
                    { x: -100, opacity: 0, scale: 1.2 },
                    { x: 0, opacity: 1, scale: 1, duration: 1.5, delay: 0.5 }
                );
            }





            if (subtitleRef.current) {
                tl.fromTo(subtitleRef.current,
                    { x: -50, opacity: 0 },
                    { x: 0, opacity: 1, duration: 1 },
                    "-=1"
                );
            }
            if (buttonsRef.current && buttonsRef.current.children.length > 0) {
                tl.fromTo(buttonsRef.current.children,
                    { y: 50, opacity: 0 },
                    { y: 0, opacity: 1, stagger: 0.2, duration: 0.8 },
                    "-=0.8"
                );
            }
        }, containerRef);

        // Parallax on Text & Background (Mouse Move)
        const handleMouseMove = (e) => {
            // Only check for title, allowing others to be absent
            if (titleRef.current) {
                const x = (e.clientX / window.innerWidth - 0.5) * 20;
                const y = (e.clientY / window.innerHeight - 0.5) * 20;

                gsap.to(titleRef.current, { x: x, y: y, duration: 1, ease: "power2.out" });

                // Optional subtitle parallax
                if (subtitleRef.current) {
                    gsap.to(subtitleRef.current, { x: x * 0.5, y: y * 0.5, duration: 1, ease: "power2.out" });
                }
            }
        };

        window.addEventListener('mousemove', handleMouseMove);
        return () => {
            window.removeEventListener('mousemove', handleMouseMove);
            ctx.revert();
        };

    }, []);

    return (
        <section ref={containerRef} className="relative h-screen w-full overflow-hidden">

            {/* 3D Scene Layer (Absolute Background/Interactive) - Desktop Only */}
            {!isMobile && (
                <div className="absolute inset-0 z-5 h-full w-full">
                    <Canvas shadows gl={{ antialias: true, alpha: true }} dpr={[1, 2]}>
                        <Suspense fallback={null}>
                            <ErrorBoundary FallbackComponent={() => null}>
                                <SceneContent />
                            </ErrorBoundary>
                        </Suspense>
                    </Canvas>

                    {/* Vignette Overlay removed */}
                </div>
            )}

            {/* UI Content Layer (Grid Layout) */}
            <div className="relative z-10 w-full h-full max-w-[1600px] mx-auto grid grid-cols-12 px-6 lg:px-12 pointer-events-none">

                {/* Left Column: Typography & CTAs - Spans 7 cols on Desktop */}
                <div className="col-span-12 lg:col-span-7 flex flex-col justify-center items-center lg:items-start text-center lg:text-left h-full pt-16 lg:pt-20 order-first">

                    {/* H1 - Massive Title */}
                    <div ref={titleRef} className="relative overflow-visible p-2 mt-[125px] lg:mt-[405px] flex flex-col items-center lg:items-start gap-0 opacity-0">
                        <h1
                            className="font-skater text-[4.5rem] sm:text-[6rem] lg:text-[7.5rem] leading-[0.8] text-white transform origin-left"
                            style={{ textShadow: "4px 4px 0px #ff7db2, 8px 8px 0px #00b9ec" }}
                        >
                            {'AMOR'.split('').map((letter, index) => (
                                <motion.span
                                    key={`amor-${index}`}
                                    className="text-[3.5rem] sm:text-[6rem] lg:text-[9rem] inline-block"
                                    initial={{ opacity: 0, y: 50 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{
                                        opacity: { duration: 0.5, delay: index * 0.05 },
                                        y: { duration: 0.5, delay: index * 0.05, type: "spring" }
                                    }}
                                    whileHover={{
                                        scale: 1.2,
                                        rotate: Math.random() > 0.5 ? 10 : -10,
                                        color: '#34f4ce',
                                        transition: { duration: 0.2 }
                                    }}
                                >
                                    {letter}
                                </motion.span>
                            ))}
                        </h1>
                        <h1
                            className="font-skater text-[3rem] sm:text-[4.5rem] lg:text-[6rem] leading-[0.8] text-white transform origin-left mt-[-10px] sm:mt-[-20px]"
                            style={{
                                textShadow: "4px 4px 0px #ff7db2, 8px 8px 0px #00b9ec",
                                opacity: 1 // subtitleRef handles some reveal, but let's keep it consistent
                            }}
                        >
                            {'INCONDICIONAL'.split('').map((letter, index) => (
                                <motion.span
                                    key={`inc-${index}`}
                                    className="text-[2.2rem] sm:text-[4rem] lg:text-[6.5rem] inline-block"
                                    initial={{ opacity: 0, y: 50 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{
                                        opacity: { duration: 0.5, delay: 0.3 + index * 0.05 },
                                        y: { duration: 0.5, delay: 0.3 + index * 0.05, type: "spring" }
                                    }}
                                    whileHover={{
                                        scale: 1.2,
                                        rotate: Math.random() > 0.5 ? 10 : -10,
                                        color: '#34f4ce',
                                        transition: { duration: 0.2 }
                                    }}
                                >
                                    {letter}
                                </motion.span>
                            ))}
                        </h1>
                    </div>      {/* end title div */}

                    {/* CTAs */}
                    <div ref={buttonsRef} className="flex flex-wrap gap-4 mt-12 lg:mt-16 justify-center lg:justify-start pointer-events-auto">
                        <button
                            className="bg-[#ff7db2] text-white font-bold py-4 px-10 rounded-full hover:scale-105 transition-transform"
                            style={{ boxShadow: "4px 4px 0px #00b9ec" }}
                        >
                            VER CACHORROS
                        </button>
                        <button
                            className="bg-white text-black font-bold py-4 px-10 rounded-full hover:scale-105 transition-transform border-2 border-transparent"
                            style={{ boxShadow: "4px 4px 0px #ff7db2" }}
                        >
                            INFO RESERVAS
                        </button>
                    </div>
                </div>      {/* end col-span-12 typography column */}

                {/* Grunge Texture Overlay on Text (CSS Mask equivalent) */}
                <div className="absolute inset-0 pointer-events-none select-none mix-blend-overlay opacity-30">
                </div>
            </div>

            {/* Right Column: Space for 3D Visuals & Puppy Image */}
            <div className="col-span-12 lg:col-span-5 pointer-events-none relative h-full flex items-start lg:items-center justify-center lg:justify-end order-last">
                {/* Video popping out of hole - responsive */}
                <video
                    src="/video home.mp4"
                    autoPlay
                    loop
                    muted
                    playsInline
                    preload="metadata"
                    className="w-[213px] sm:w-[500px] lg:w-[763px] fixed lg:absolute z-0 lg:z-20 animate-fade-in-up object-cover"
                    style={{
                        top: 'calc(25% - 80px)', // moved down another 10px
                        left: '50%',
                        transform: 'translateX(calc(-50% + 160px)) rotate(-5deg)', // moved right another 40px
                        bottom: window.innerWidth >= 1024 ? '35%' : 'auto',
                        right: window.innerWidth >= 1024 ? 'calc(10% - 80px)' : 'auto',
                        maskImage: 'radial-gradient(closest-side at 35% 50%, black 85%, transparent 100%)',
                        WebkitMaskImage: 'radial-gradient(closest-side at 35% 50%, black 85%, transparent 100%)',
                        filter: 'drop-shadow(0 0 15px #00D2FF)'
                    }}
                />
            </div>
        </div>




        </section >
    );
};

export default HeroSection;
