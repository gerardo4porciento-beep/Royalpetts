import React, { Suspense } from 'react';
import { Canvas } from '@react-three/fiber';
import { Environment, OrbitControls } from '@react-three/drei';
import { LogoModel } from './LogoModel';

export default function Scene3D() {
    return (
        <div className='fixed top-0 left-0 w-full h-full pointer-events-none z-50'>
            {/* Canvas is fixed on top. pointer-events-none allows clicking through to HTML below, 
            but we might need to enable events for the logo itself if interactive clicking is needed.
            For now, mouse move works globally on window so pointer-events-none is fine for rotation logic 
            driven by state.pointer, but OrbitControls would need events. 
            Since we want "MetaMask style" usually that just means look-at, not drag-to-spin.
        */}
            <Canvas camera={{ position: [0, 0, 10], fov: 45 }}>
                <ambientLight intensity={0.5} />
                <directionalLight position={[10, 10, 5]} intensity={1} />

                <Suspense fallback={null}>
                    <LogoModel />
                    <Environment preset="city" />
                </Suspense>
            </Canvas>
        </div>
    );
}
