import { useRef } from 'react';
import { motion, useTransform, useScroll } from 'framer-motion';

const Card = ({ title, subtitle, color, rotate, image }) => {
    return (
        <motion.div
            whileHover={{ scale: 1.05, rotate: 0, zIndex: 10 }}
            className={`relative w-80 h-[28rem] rounded-3xl p-6 flex-shrink-0 cursor-pointer transition-all duration-300 transform ${rotate}`}
            style={{ backgroundColor: color }}
        >
            {/* Sticker Border Effect */}
            <div className="absolute -inset-2 bg-white rounded-[2rem] -z-10 translate-y-2 translate-x-1 opacity-100 group-hover:translate-x-0 group-hover:translate-y-0 transition-all"></div>

            <div className="h-2/3 w-full bg-black/10 rounded-2xl mb-4 overflow-hidden relative">
                {/* Placeholder for Pet Image */}
                <div className="absolute inset-0 bg-white/20 backdrop-blur-sm"></div>
                <img src={image} alt={title} className="w-full h-full object-cover mix-blend-overlay opacity-80" />
                <div className="absolute bottom-2 right-2 bg-white px-3 py-1 rounded-full font-bold text-xs uppercase tracking-wider">
                    Adopt Me
                </div>
            </div>

            <h3 className="text-4xl font-skater text-white drop-shadow-md mb-1">{title}</h3>
            <p className="text-white font-bold uppercase tracking-wide opacity-90">{subtitle}</p>

            <button className="mt-4 w-full py-3 bg-white text-royal-black font-black uppercase tracking-wider rounded-xl hover:bg-black hover:text-white transition-colors">
                Ver Perfil
            </button>
        </motion.div>
    )
}

const RockstarCarousel = () => {
    const targetRef = useRef(null);
    const { scrollYProgress } = useScroll({
        target: targetRef,
    });

    const x = useTransform(scrollYProgress, [0, 1], ["1%", "-55%"]);

    const pets = [
        { title: "Spike", subtitle: "The Punk Rebel", color: "#ff7db2", rotate: "rotate-2", image: "/SEPARACION 4/FORMA MASCOTAS.png" },
        { title: "Luna", subtitle: "Cosmic Skater", color: "#32f4bb", rotate: "-rotate-1", image: "/SEPARACION 4/FORMA MASCOTAS.png" },
        { title: "Rocky", subtitle: "Heavy Metal Dog", color: "#fe9e5b", rotate: "rotate-3", image: "/SEPARACION 4/FORMA MASCOTAS.png" },
        { title: "Coco", subtitle: "Grunge Queen", color: "#00b9ec", rotate: "-rotate-2", image: "/SEPARACION 4/FORMA MASCOTAS.png" },
        { title: "Thor", subtitle: "Thunder Paw", color: "#ffea20", rotate: "rotate-1", image: "/SEPARACION 4/FORMA MASCOTAS.png" },
        { title: "Bella", subtitle: "Pop Princess", color: "#ff7db2", rotate: "-rotate-3", image: "/SEPARACION 4/FORMA MASCOTAS.png" },
    ];

    return (
        <section ref={targetRef} className="relative h-[300vh] bg-royal-gray">
            <div className="sticky top-0 flex h-screen items-center overflow-hidden">
                <div className="absolute top-10 left-10 z-10">
                    <h2 className="text-8xl font-skater text-royal-black leading-none drop-shadow-[5px_5px_0px_white]">
                        NUESTROS<br /><span className="text-royal-pink">ROCKSTARS</span>
                    </h2>
                </div>

                <motion.div style={{ x }} className="flex gap-16 pl-[40vw]">
                    {pets.map((pet, i) => (
                        <Card key={i} {...pet} />
                    ))}
                </motion.div>

                {/* Decorative Background Elements */}
                <div className="absolute -bottom-20 -left-20 w-96 h-96 bg-royal-blue/20 rounded-full blur-[100px] pointer-events-none"></div>
                <div className="absolute top-20 right-20 w-72 h-72 bg-royal-orange/20 rounded-full blur-[80px] pointer-events-none"></div>
            </div>
        </section>
    );
};

export default RockstarCarousel;
