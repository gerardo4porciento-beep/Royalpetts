import React, { useRef, useLayoutEffect } from 'react';
import { useGLTF } from '@react-three/drei';
import { useFrame, useThree } from '@react-three/fiber';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

export function LogoModel() {
    const { nodes, materials } = useGLTF('/assets/3d/hitem3d.glb', '/assets/3d/draco-gltf/');
    // Note: draco path optional if needed, adding just in case. 
    // If user provides standard GLB, useGLTF handles it.

    const meshRef = useRef();
    const { viewport, size } = useThree();

    // Mouse rotation effect (MetaMask style)
    useFrame((state) => {
        if (!meshRef.current) return;

        // Smooth rotation towards mouse position
        // x: vertical mouse = rotation around x axis
        // y: horizontal mouse = rotation around y axis
        const x = (state.pointer.y * viewport.height) / 20;
        const y = (state.pointer.x * viewport.width) / 20;

        // Using simple lerp for smoothness
        meshRef.current.rotation.x += (x - meshRef.current.rotation.x) * 0.1;
        meshRef.current.rotation.y += (y - meshRef.current.rotation.y) * 0.1;
    });

    useLayoutEffect(() => {
        if (!meshRef.current) return;

        // Scroll Animation
        // Moves from center (large) to top-left navbar area (small)
        // We'll approximate the navbar position in 3D space

        // Convert 30px to 3D units for lowering the model
        const pxToUnit = (viewport.height / size.height);
        const yOffset = 30 * pxToUnit;

        const tl = gsap.timeline({
            scrollTrigger: {
                trigger: "body",
                start: "top top",
                end: "200px top", // Adjust based on scroll distance desired
                scrub: 1, // Smooth scrubbing
            }
        });

        // Initial State (Hero Center)
        tl.fromTo(meshRef.current.position,
            { x: 0, y: -yOffset, z: 0 }, // Lowered 30px
            {
                x: -viewport.width / 2.5, // Move left roughly to logo pos
                y: viewport.height / 2.5, // Move up roughly to navbar
                z: 0
            },
            0);

        tl.fromTo(meshRef.current.scale,
            { x: 3.125, y: 3.125, z: 3.125 }, // Start Big (2.5 * 1.25)
            { x: 0.5, y: 0.5, z: 0.5 }, // End Small (Logo size)
            0);

        return () => {
            if (tl.scrollTrigger) tl.scrollTrigger.kill();
            tl.kill();
        }
    }, [viewport, size]);

    // Adjust "nodes.Scene" or "nodes.Logo" depending on GLB structure
    // Using primitive to be safe if we don't know node names
    const glo = useGLTF('/assets/3d/hitem3d.glb');

    return (
        <primitive
            object={glo.scene}
            ref={meshRef}
            scale={[3.125, 3.125, 3.125]}
        />
    );
}

useGLTF.preload('/assets/3d/hitem3d.glb');
