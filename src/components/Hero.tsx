import { Play, Info } from 'lucide-react';
import { motion } from 'framer-motion';

const Hero = () => {
    return (
        <div className="relative h-[85vh] w-full overflow-hidden">
            {/* Background Image */}
            <div
                className="absolute inset-0 bg-cover bg-center bg-no-repeat"
                style={{
                    backgroundImage: 'url("https://images.unsplash.com/photo-1626814026160-2237a95fc5a0?q=80&w=2070&auto=format&fit=crop")',
                }}
            >
                <div className="absolute inset-0 bg-gradient-to-t from-primary via-primary/50 to-transparent" />
                <div className="absolute inset-0 bg-gradient-to-r from-primary via-primary/50 to-transparent" />
            </div>

            {/* Content */}
            <div className="relative z-10 h-full flex items-center px-4 md:px-12 max-w-7xl mx-auto">
                <div className="max-w-2xl space-y-6 pt-20">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8, delay: 0.2 }}
                    >
                        <span className="text-accent font-semibold tracking-wider uppercase text-sm">Now Streaming</span>
                        <h1 className="text-5xl md:text-7xl font-bold text-white mt-2 leading-tight">
                            Cyber Chronicles: <br />
                            <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-600">The Awakening</span>
                        </h1>
                    </motion.div>

                    <motion.p
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8, delay: 0.4 }}
                        className="text-gray-300 text-lg md:text-xl line-clamp-3"
                    >
                        In a future where humanity has merged with machines, a lone hacker discovers a conspiracy that threatens to rewrite reality itself. Join the resistance in this visual masterpiece.
                    </motion.p>

                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8, delay: 0.6 }}
                        className="flex flex-wrap gap-4"
                    >
                        <button className="flex items-center gap-2 px-8 py-3 bg-accent text-primary font-bold rounded-full hover:bg-accent/90 transition-all transform hover:scale-105 shadow-[0_0_20px_rgba(56,189,248,0.5)]">
                            <Play className="w-5 h-5 fill-current" />
                            Watch Now
                        </button>
                        <button className="flex items-center gap-2 px-8 py-3 bg-white/10 backdrop-blur-md text-white font-bold rounded-full hover:bg-white/20 transition-all border border-white/20">
                            <Info className="w-5 h-5" />
                            More Info
                        </button>
                    </motion.div>
                </div>
            </div>
        </div>
    );
};

export default Hero;
