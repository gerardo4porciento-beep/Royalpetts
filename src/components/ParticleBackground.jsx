import { useEffect, useRef } from 'react';

const ParticleBackground = () => {
    const canvasRef = useRef(null);

    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;

        const ctx = canvas.getContext('2d');
        let animationFrameId;
        let particles = [];

        // Set canvas size
        const resizeCanvas = () => {
            canvas.width = window.innerWidth;
            canvas.height = window.innerHeight;
        };
        resizeCanvas();
        window.addEventListener('resize', resizeCanvas);

        // Particle class
        class Particle {
            constructor() {
                this.reset();
                this.y = Math.random() * canvas.height; // Initial random position
            }

            reset() {
                this.x = Math.random() * canvas.width;
                this.y = canvas.height + 20;
                this.size = Math.random() * 4 + 2; // 2-6px
                this.speedY = Math.random() * 0.5 + 0.3; // 0.3-0.8 upward
                this.speedX = (Math.random() - 0.5) * 0.3; // Slight horizontal drift
                this.opacity = Math.random() * 0.3 + 0.2; // 0.2-0.5
                this.wobble = Math.random() * Math.PI * 2;
                this.wobbleSpeed = Math.random() * 0.02 + 0.01;

                // Random type: 0 = sparkle, 1 = heart, 2 = bone
                this.type = Math.floor(Math.random() * 3);

                // Random color from royal palette
                const colors = ['#ffea20', '#ff7db2', '#ffffff'];
                this.color = colors[Math.floor(Math.random() * colors.length)];
            }

            update() {
                this.y -= this.speedY;
                this.wobble += this.wobbleSpeed;
                this.x += Math.sin(this.wobble) * 0.5 + this.speedX;

                // Fade out near top
                if (this.y < 100) {
                    this.opacity -= 0.01;
                }

                // Reset if out of bounds
                if (this.y < -20 || this.opacity <= 0) {
                    this.reset();
                }
            }

            draw() {
                ctx.save();
                ctx.globalAlpha = this.opacity;
                ctx.fillStyle = this.color;

                if (this.type === 0) {
                    // Sparkle (circle)
                    ctx.beginPath();
                    ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
                    ctx.fill();
                } else if (this.type === 1) {
                    // Heart shape
                    this.drawHeart(this.x, this.y, this.size);
                } else {
                    // Bone shape
                    this.drawBone(this.x, this.y, this.size);
                }

                ctx.restore();
            }

            drawHeart(x, y, size) {
                const scale = size / 6;
                ctx.beginPath();
                ctx.moveTo(x, y + scale * 2);
                ctx.bezierCurveTo(x, y, x - scale * 3, y - scale * 2, x - scale * 3, y + scale);
                ctx.bezierCurveTo(x - scale * 3, y + scale * 3, x, y + scale * 5, x, y + scale * 6);
                ctx.bezierCurveTo(x, y + scale * 5, x + scale * 3, y + scale * 3, x + scale * 3, y + scale);
                ctx.bezierCurveTo(x + scale * 3, y - scale * 2, x, y, x, y + scale * 2);
                ctx.fill();
            }

            drawBone(x, y, size) {
                const scale = size / 4;
                ctx.beginPath();
                // Simplified bone shape using rectangles
                ctx.fillRect(x - scale, y - scale * 0.5, scale * 2, scale);
                ctx.beginPath();
                ctx.arc(x - scale, y, scale * 0.8, 0, Math.PI * 2);
                ctx.fill();
                ctx.beginPath();
                ctx.arc(x + scale, y, scale * 0.8, 0, Math.PI * 2);
                ctx.fill();
            }
        }

        // Create particles
        const particleCount = 40; // Low density for premium feel
        for (let i = 0; i < particleCount; i++) {
            particles.push(new Particle());
        }

        // Animation loop
        const animate = () => {
            ctx.clearRect(0, 0, canvas.width, canvas.height);

            particles.forEach(particle => {
                particle.update();
                particle.draw();
            });

            animationFrameId = requestAnimationFrame(animate);
        };

        animate();

        // Cleanup
        return () => {
            window.removeEventListener('resize', resizeCanvas);
            cancelAnimationFrame(animationFrameId);
        };
    }, []);

    return (
        <canvas
            ref={canvasRef}
            className="fixed inset-0 pointer-events-none"
            style={{ zIndex: 30 }}
        />
    );
};

export default ParticleBackground;
