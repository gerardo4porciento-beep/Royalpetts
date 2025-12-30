import { useEffect } from 'react'
import Lenis from '@studio-freight/lenis'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

export default function SmoothScroll({ children }) {
    useEffect(() => {
        const lenis = new Lenis({
            duration: 2.5,
            easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
            direction: 'vertical',
            gestureDirection: 'vertical',
            smooth: true,
            mouseMultiplier: 0.3,
            smoothTouch: false,
            touchMultiplier: 2,
        })

        lenis.on('scroll', ScrollTrigger.update)

        function raf(time) {
            lenis.raf(time)
            requestAnimationFrame(raf)
        }

        requestAnimationFrame(raf)

        return () => {
            lenis.destroy()
        }
    }, [])

    return (
        <>
            {children}
        </>
    )
}
