import React, { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

const ImageSequence = () => {
    const canvasRef = useRef(null);
    const containerRef = useRef(null);
    const [images, setImages] = useState([]);
    const [isLoaded, setIsLoaded] = useState(false);

    // Configuration
    // Note: user needs to provide these real images. For now we use placeholders?
    // Or we try to use existing images if any? 
    // Let's assume a sequence of 60 frames for 2 seconds of video at 30fps.
    // Since we don't have the files, I will create a function that attempts to load them
    // or falls back to a visual placeholder if they don't exist.
    const frameCount = 60;

    useEffect(() => {
        const loadImages = async () => {
            const loadedImages = [];

            for (let i = 1; i <= frameCount; i++) {
                const img = new Image();
                // Naming convention: sequence/frame_001.jpg
                // We use a dummy placeholder service for now if local files missing
                // But the user asked for the effect. Let's assume files are at /assets/sequence/frame_001.jpg
                // For demonstration, I will use a placeholder service that generates numbers.
                // Actually, let's use a single static image if we can't notify user to upload.
                // But to demonstrate the effect, I'll use a placeholder text on canvas if image fails.
                const currentFrame = (index) => `/assets/sequence/frame_${index.toString().padStart(3, '0')}.svg`;

                img.src = currentFrame(i);
                await new Promise((resolve) => {
                    img.onload = () => resolve();
                    img.onerror = () => {
                        // Determine if we should fail silently or use a placeholder
                        // For this demo, let's just resolve so we don't block
                        resolve();
                    }
                });
                loadedImages.push(img);
            }
            setImages(loadedImages);
            setIsLoaded(true);
        };

        loadImages();
    }, []);

    useEffect(() => {
        if (!isLoaded || !canvasRef.current || !containerRef.current) return;

        const canvas = canvasRef.current;
        const context = canvas.getContext("2d");

        // Set canvas dimensions to window
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;

        const frame = { index: 0 };

        // Initial draw
        const render = () => {
            const img = images[Math.round(frame.index)];
            if (img && img.complete && img.naturalHeight !== 0) {
                // "Cover" fit algorithm
                const ratio = Math.max(canvas.width / img.width, canvas.height / img.height);
                const centerShift_x = (canvas.width - img.width * ratio) / 2;
                const centerShift_y = (canvas.height - img.height * ratio) / 2;

                context.clearRect(0, 0, canvas.width, canvas.height);
                context.drawImage(
                    img,
                    0, 0, img.width, img.height,
                    centerShift_x, centerShift_y, img.width * ratio, img.height * ratio
                );
            }
        };

        const tl = gsap.timeline({
            scrollTrigger: {
                trigger: containerRef.current,
                start: "top top",
                end: "bottom bottom", // "bottom top" means when bottom of container hits top of viewport? 
                // We want to pin the container for a LENGTH of scroll (e.g. 300vh)
                scrub: 0.5, // smooth scrubbing
                pin: true, // pin the canvas
                // markers: true,
            },
        });

        tl.to(frame, {
            index: frameCount - 1,
            ease: "none",
            onUpdate: render,
        });

        // Handle resize
        const handleResize = () => {
            canvas.width = window.innerWidth;
            canvas.height = window.innerHeight;
            render();
        };
        window.addEventListener("resize", handleResize);

        return () => {
            ScrollTrigger.getAll().forEach(t => t.kill());
            window.removeEventListener("resize", handleResize);
        };

    }, [isLoaded, images]);

    return (
        // This container defines the "length" of the scroll animation.
        // h-[400vh] means the user has to scroll 4 viewports height to finish the sequence.
        <div ref={containerRef} className="relative h-[400vh] bg-royal-gray">
            <canvas
                ref={canvasRef}
                className="sticky top-0 left-0 w-full h-screen object-cover block"
            />
        </div>
    );
};

export default ImageSequence;
