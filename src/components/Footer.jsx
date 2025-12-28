import { motion } from 'framer-motion';

const Footer = () => {
    return (
        <footer className="relative bg-royal-black text-white pt-32 pb-10 overflow-hidden">
            {/* Large Background Text */}
            <div className="absolute top-0 left-0 w-full pointer-events-none opacity-10 select-none">
                <h2 className="text-[20vw] font-skater leading-none text-center text-white">ROYAL</h2>
            </div>

            <div className="container mx-auto px-6 relative z-10">
                <div className="grid md:grid-cols-4 gap-12 mb-20">
                    <div className="md:col-span-2">
                        <h3 className="text-5xl font-skater mb-6 text-royal-blue">ROYALPETTS</h3>
                        <p className="text-xl text-gray-400 max-w-md font-bold uppercase tracking-wide">
                            Redefiniendo el estilo para las mascotas más cool del bloque. Únete a la revolución.
                        </p>
                    </div>

                    <div>
                        <h4 className="font-black uppercase tracking-widest text-lg mb-6 border-b-2 border-royal-pink inline-block pb-2">Explora</h4>
                        <ul className="space-y-4 font-bold text-gray-300">
                            <li><a href="#" className="hover:text-royal-pink transition-colors">Rockstars</a></li>
                            <li><a href="#" className="hover:text-royal-green transition-colors">Accesorios</a></li>
                            <li><a href="#" className="hover:text-royal-orange transition-colors">Manifesto</a></li>
                            <li><a href="#" className="hover:text-royal-yellow transition-colors">Contacto</a></li>
                        </ul>
                    </div>

                    <div>
                        <h4 className="font-black uppercase tracking-widest text-lg mb-6 border-b-2 border-royal-green inline-block pb-2">Social</h4>
                        <div className="flex gap-4">
                            {['Instagram', 'TikTok', 'Twitter'].map((social) => (
                                <motion.a
                                    key={social}
                                    whileHover={{ y: -5, rotate: 5 }}
                                    href="#"
                                    className="w-12 h-12 bg-white text-royal-black rounded-full flex items-center justify-center font-bold text-xl hover:bg-royal-blue hover:text-white transition-colors border-2 border-black shadow-[4px_4px_0px_#32f4bb]"
                                >
                                    {social[0]}
                                </motion.a>
                            ))}
                        </div>
                    </div>
                </div>

                <div className="border-t border-gray-800 pt-10 flex flex-col md:flex-row justify-between items-center text-sm font-bold tracking-wider text-gray-500">
                    <p>&copy; 2025 RoyalPetts Store. All Rights Reserved.</p>
                    <p>Designed with <span className="text-royal-pink">♥</span> by Antigravity</p>
                </div>
            </div>

            {/* Bottom Decoration */}
            <div className="absolute bottom-0 left-0 w-full h-4 bg-gradient-to-r from-royal-blue via-royal-pink to-royal-yellow"></div>
        </footer>
    );
};

export default Footer;
