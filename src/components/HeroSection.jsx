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
            <SpotLight
                position={[0, -5, 2]}
                angle={1}
                penumbra={1}
                intensity={2}
                color="#00b9ec"
                distance={10}
            />

            {/* Dynamic Elements (Idea 3: Atmosphere) */}
            <Stars radius={50} depth={50} count={3000} factor={4} saturation={1} fade speed={2} />
            <Sparkles count={300} scale={12} size={6} speed={0.4} opacity={0.6} color="#ffea20" />
            <Sparkles count={100} scale={15} size={10} speed={0.2} opacity={0.3} color="#ffffff" />

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
            // Only check for title and bg, allowing subtitle to be absent
            if (titleRef.current && bgRef.current) {
                const x = (e.clientX / window.innerWidth - 0.5) * 20;
                const y = (e.clientY / window.innerHeight - 0.5) * 20;

                gsap.to(titleRef.current, { x: x, y: y, duration: 1, ease: "power2.out" });

                // Optional subtitle parallax
                if (subtitleRef.current) {
                    gsap.to(subtitleRef.current, { x: x * 0.5, y: y * 0.5, duration: 1, ease: "power2.out" });
                }

                // Puppy and Shadow no longer track mouse (Fixed position)

                // Background moves slightly in opposite direction for depth
                gsap.to(bgRef.current, { x: -x * 0.5, y: -y * 0.5, duration: 1.2, ease: "power2.out" });
            }
        };

        window.addEventListener('mousemove', handleMouseMove);
        return () => {
            window.removeEventListener('mousemove', handleMouseMove);
            ctx.revert();
        };

    }, []);

    return (
        <section ref={containerRef} className="relative h-screen w-full overflow-hidden bg-[#050510]">

            {/* Animated Background Image Layer */}
            <div
                ref={bgRef}
                className="absolute -inset-[2.5%] w-[105%] h-[105%] z-0 bg-cover bg-center pointer-events-none saturate-150 contrast-125"
                style={{ backgroundImage: "url('/fondo_home3.svg')" }}
            ></div>

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
                    {/* Vignette Overlay for focus */}
                    <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,transparent_0%,#000000_120%)] pointer-events-none mix-blend-multiply opacity-50"></div>
                </div>
            )}

            {/* UI Content Layer (Grid Layout) */}
            <div className="relative z-10 w-full h-full max-w-[1600px] mx-auto grid grid-cols-12 px-6 lg:px-12 pointer-events-none">

                {/* Left Column: Typography & CTAs - Spans 7 cols on Desktop */}
                <div className="col-span-12 lg:col-span-7 flex flex-col justify-center items-start text-left h-full pt-20">

                    {/* H1 - Massive Title */}
                    <div className="relative overflow-visible p-2 -mt-[70px]">
                        <h1
                            ref={titleRef}
                            className="font-skater text-[4rem] sm:text-[6rem] lg:text-[7.5rem] leading-[0.9] text-white opacity-0 transform origin-left"
                            style={{ textShadow: "4px 4px 0px #ff7db2, 8px 8px 0px #00b9ec" }}
                        >
                            <span className="text-[5.5rem] sm:text-[8rem] lg:text-[9.5rem]">ENDLESS LOVE</span>
                        </h1>

                        {/* Grunge Texture Overlay on Text (CSS Mask equivalent) */}
                        <div className="absolute inset-0 pointer-events-none select-none mix-blend-overlay opacity-30">
                        </div>
                    </div>

                    {/* CTAs */}


                </div>

                {/* Right Column: Space for 3D Visuals & Puppy Image */}
                <div className="col-span-12 lg:col-span-5 pointer-events-none relative">
                    {/* Floating Puppy Image (Idea 2: Parallax, Idea 4: Rim Light) */}
                    {/* Mobile Version */}
                    <img
                        src="/frenchie_hero.gif?v=6"
                        alt="Cute Puppy"
                        className="lg:hidden relative bottom-0 w-full max-w-[380px] h-auto object-contain z-20 pointer-events-auto mx-auto"
                    />
                    {/* Desktop Version - Original positioning */}
                    <img
                        ref={puppyRef}
                        src="/frenchie_hero.gif?v=6"
                        alt="Cute Puppy"
                        className="hidden lg:block absolute bottom-0 left-[50px] w-[1365px] h-auto object-contain z-20 pointer-events-auto"
                    />
                </div>
            </div>



            {/* Restored Strong Bottom Gradient for extra intensity */}
            <div className="absolute bottom-0 left-0 w-full h-[30px] bg-gradient-to-t from-[#ff7db2] to-transparent z-[50] pointer-events-none opacity-100 mix-blend-normal"></div>



        </section>
    );
};

export default HeroSection;
