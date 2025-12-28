import { motion } from 'framer-motion';

const AccessoryCard = ({ name, price, color, image }) => {
    return (
        <motion.div
            whileHover={{ y: -10, rotate: 2 }}
            className="group relative bg-white p-6 rounded-3xl border-4 border-black shadow-[8px_8px_0px_#000] hover:shadow-[12px_12px_0px_#000] transition-all duration-300 overflow-hidden"
        >
            {/* Background Shape */}
            <div className={`absolute -top-10 -right-10 w-32 h-32 rounded-full opacity-20 transition-transform group-hover:scale-150`} style={{ backgroundColor: color }}></div>

            <div className="relative h-48 w-full mb-4 flex items-center justify-center">
                {/* Placeholder Image */}
                <div className="w-40 h-40 bg-gray-100 rounded-full flex items-center justify-center relative">
                    <span className="text-4xl">🦴</span>
                    <img src={image} alt={name} className="absolute inset-0 w-full h-full object-contain drop-shadow-xl transform group-hover:scale-110 transition-transform duration-500" />
                </div>
            </div>

            <div className="flex justify-between items-end">
                <div>
                    <span className="inline-block px-3 py-1 bg-black text-white text-xs font-bold uppercase rounded-full mb-2 tracking-wider">Nuevo</span>
                    <h3 className="text-2xl font-black text-royal-black leading-none mb-1 uppercase">{name}</h3>
                    <p className="text-sm font-bold text-gray-400">Premium Quality</p>
                </div>
                <div className="text-right">
                    <p className="text-3xl font-skater text-royal-blue">{price}</p>
                </div>
            </div>

            <button className="absolute bottom-0 left-0 w-full py-4 bg-black text-white font-bold uppercase tracking-widest translate-y-full group-hover:translate-y-0 transition-transform duration-300">
                Añadir al Carrito
            </button>
        </motion.div>
    )
}

const AccessoriesGrid = () => {
    const products = [
        { name: "Punk Collar", price: "$25", color: "#ff7db2", image: "/SEPARACION 4/FORMA JUGUETES Y ACCESORIOS.png" },
        { name: "Skater Vest", price: "$40", color: "#32f4bb", image: "/SEPARACION 4/FORMA JUGUETES Y ACCESORIOS.png" },
        { name: "Neon Leash", price: "$18", color: "#fe9e5b", image: "/SEPARACION 4/FORMA JUGUETES Y ACCESORIOS.png" },
        { name: "Royal Bowl", price: "$30", color: "#00b9ec", image: "/SEPARACION 4/FORMA JUGUETES Y ACCESORIOS.png" },
        { name: "Rock Toy", price: "$15", color: "#ffea20", image: "/SEPARACION 4/FORMA JUGUETES Y ACCESORIOS.png" },
        { name: "Bandana X", price: "$12", color: "#ff7db2", image: "/SEPARACION 4/FORMA JUGUETES Y ACCESORIOS.png" },
    ];

    return (
        <section className="py-32 bg-white relative overflow-hidden">
            {/* Section Title */}
            <div className="container mx-auto px-6 mb-20 text-center relative z-10">
                <motion.h2
                    initial={{ opacity: 0, y: 50 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    className="text-6xl md:text-8xl font-skater text-royal-black mb-4"
                >
                    ACCESORIOS <span className="text-royal-blue inline-block hover:animate-spin cursor-pointer">☢</span>
                </motion.h2>
                <p className="text-xl font-bold uppercase tracking-widest text-gray-400">Equipa a tu bestia</p>
            </div>

            {/* Grid */}
            <div className="container mx-auto px-6 relative z-10">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 md:gap-12">
                    {products.map((product, i) => (
                        <AccessoryCard key={i} {...product} />
                    ))}
                </div>
            </div>

            {/* Background Noise/Decoration */}
            <div className="absolute top-1/2 left-0 w-full h-32 bg-royal-black/5 -skew-y-3 pointer-events-none"></div>
        </section>
    );
};

export default AccessoriesGrid;
