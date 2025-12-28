import React, { useEffect, useRef, useState } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { MotionPathPlugin } from 'gsap/MotionPathPlugin';

gsap.registerPlugin(ScrollTrigger, MotionPathPlugin);

const ScrollGuidePath = () => {
    const maskPathRef = useRef(null);
    const visiblePathRef = useRef(null);
    const pawRef = useRef(null);
    const [pathD, setPathD] = useState('');

    useEffect(() => {
        const updatePath = () => {
            const w = window.innerWidth;
            const h = document.documentElement.scrollHeight;

            // "Doodle" Logic - Wide Horizontal Swings
            const startX = w * 0.1;
            const startY = 0;

            let d = `M ${startX},${startY} `;
            // Segment 1: Swoop to top-right
            d += `C ${w * 0.5},${h * 0.02} ${w * 0.9},${h * 0.05} ${w * 0.9},${h * 0.1} `;
            // Segment 2: Extreme Zig Zags
            d += `C ${w * 0.9},${h * 0.15} ${w * 0.1},${h * 0.12} ${w * 0.1},${h * 0.2} `; // Left
            d += `C ${w * 0.1},${h * 0.28} ${w * 0.9},${h * 0.25} ${w * 0.9},${h * 0.3} `; // Right
            d += `C ${w * 0.9},${h * 0.38} ${w * 0.2},${h * 0.35} ${w * 0.2},${h * 0.4} `; // Left
            d += `C ${w * 0.2},${h * 0.48} ${w * 0.8},${h * 0.45} ${w * 0.8},${h * 0.5} `; // Right

            // Segment 3: Vertical finish
            d += `C ${w * 0.8},${h * 0.6} ${w * 0.5},${h * 0.6} ${w * 0.5},${h * 0.7} `;
            d += `C ${w * 0.5},${h * 0.8} ${w * 0.5},${h * 0.9} ${w * 0.5},${h}`;

            setPathD(d);

            // Re-calculate gradient stops based on sections if possible
            const gradient = document.getElementById('brandRibbon');
            if (gradient) {
                // Approximate positions
                const heroEnd = window.innerHeight / h;
                const galleryEnd = (window.innerHeight * 2.5) / h; // Approx

                const stops = gradient.children;
                if (stops.length >= 6) {
                    // Hero Section (Blue/Pink)
                    stops[0].setAttribute('offset', '0');
                    stops[1].setAttribute('offset', heroEnd);
                    // Gallery (Pink/Orange)
                    stops[2].setAttribute('offset', heroEnd);
                    stops[3].setAttribute('offset', galleryEnd);
                    // Rest (Blue)
                    stops[4].setAttribute('offset', galleryEnd);
                    stops[5].setAttribute('offset', '1');
                }
                gradient.setAttribute('y2', '1'); // Use percentages (0 to 1) if boundingBox, or h if userSpaceOnUse
            }
        };

        updatePath();
        window.addEventListener('resize', updatePath);
        return () => window.removeEventListener('resize', updatePath);
    }, []);

    useEffect(() => {
        if (!pathD || !maskPathRef.current || !visiblePathRef.current) return;

        const pathLength = maskPathRef.current.getTotalLength();
        const maskPath = maskPathRef.current;

        // Reset
        gsap.set(maskPath, { strokeDasharray: pathLength, strokeDashoffset: pathLength });
        gsap.set(pawRef.current, { opacity: 1 });

        // Continuous Scroll - No Pinning (to avoid "white space" issue)
        ScrollTrigger.create({
            trigger: "#scrolly-main-wrapper",
            start: "top top",
            end: "bottom bottom",
            scrub: 1,
            animation: gsap.timeline()
                .to(maskPath, {
                    strokeDashoffset: 0,
                    ease: "none"
                })
                .to(pawRef.current, {
                    motionPath: {
                        path: visiblePathRef.current,
                        align: visiblePathRef.current,
                        autoRotate: true,
                        alignOrigin: [0.5, 0.5],
                        start: 0,
                        end: 1
                    },
                    ease: "none"
                }, 0)
        });

    }, [pathD]);

    return (
        <div className="absolute top-0 left-0 w-full h-full pointer-events-none z-[5] overflow-hidden mix-blend-multiply">
            <svg
                className="w-full h-full"
                style={{ height: '100%' }}
                xmlns="http://www.w3.org/2000/svg"
            >
                <defs>
                    <linearGradient id="brandRibbon" x1="0" y1="0" x2="0" y2="1">
                        {/* Dynamic Stops */}
                        <stop offset="0" stopColor="#ff7db2" />    {/* Pink */}
                        <stop offset="0.2" stopColor="#ff7db2" />
                        <stop offset="0.2" stopColor="#fe9e5b" />  {/* Orange */}
                        <stop offset="0.5" stopColor="#fe9e5b" />
                        <stop offset="0.5" stopColor="#00b9ec" />  {/* Blue */}
                        <stop offset="1" stopColor="#00b9ec" />
                    </linearGradient>

                    <mask id="drawingMask">
                        <path
                            ref={maskPathRef}
                            d={pathD}
                            fill="none"
                            stroke="white"
                            strokeWidth="14"
                            strokeLinecap="round"
                        />
                    </mask>
                </defs>

                {/* Visible Path (The Ribbon) */}
                <path
                    ref={visiblePathRef}
                    d={pathD}
                    fill="none"
                    stroke="url(#brandRibbon)"
                    strokeWidth="12"
                    strokeLinecap="round"
                    mask="url(#drawingMask)"
                    className="drop-shadow-lg"
                />

                {/* Leading Paw Icon */}
                <g ref={pawRef} style={{ opacity: 0 }}>
                    <circle r="8" fill="white" stroke="#ff7db2" strokeWidth="2" />
                </g>
            </svg>
        </div>
    );
};

export default ScrollGuidePath;
