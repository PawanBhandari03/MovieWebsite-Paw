import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Tv, Globe, Users, Star, ArrowRight, Shield, Zap, Heart, Mail, X } from 'lucide-react';
import { useState } from 'react';

const LandingPage = () => {
    const [isContactOpen, setIsContactOpen] = useState(false);
    const fadeIn = {
        initial: { opacity: 0, y: 20 },
        whileInView: { opacity: 1, y: 0 },
        viewport: { once: true },
        transition: { duration: 0.6 }
    };

    const staggerContainer = {
        hidden: { opacity: 0 },
        show: {
            opacity: 1,
            transition: {
                staggerChildren: 0.1
            }
        }
    };

    return (
        <div className="min-h-screen bg-primary text-white overflow-x-hidden font-sans">
            {/* Hero Section */}
            <section className="relative h-screen flex items-center justify-center overflow-hidden">
                <div className="absolute inset-0 z-0">
                    <div className="absolute inset-0 bg-gradient-to-t from-primary via-primary/80 to-transparent z-10" />
                    <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1626814026160-2237a95fc5a0?q=80&w=2940&auto=format&fit=crop')] bg-cover bg-center opacity-30 animate-pulse-slow" />
                </div>

                <div className="container mx-auto px-4 z-20 text-center">
                    <motion.div
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ duration: 0.8, ease: "easeOut" }}
                    >
                        <h1 className="text-6xl md:text-8xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-white via-accent to-purple-500 mb-6 drop-shadow-2xl tracking-tight">
                            PawFlix
                        </h1>
                        <p className="text-xl md:text-3xl text-gray-300 mb-10 max-w-3xl mx-auto font-light">
                            Watch Movies and TV Shows Free Official Website
                        </p>
                        <Link to="/home">
                            <motion.button
                                whileHover={{ scale: 1.05, boxShadow: "0 0 25px rgba(56, 189, 248, 0.5)" }}
                                whileTap={{ scale: 0.95 }}
                                className="px-10 py-4 bg-gradient-to-r from-accent to-blue-600 rounded-full text-white font-bold text-lg shadow-xl hover:shadow-2xl transition-all flex items-center gap-3 mx-auto"
                            >
                                Go to Homepage <ArrowRight size={24} />
                            </motion.button>
                        </Link>
                    </motion.div>
                </div>
            </section>

            {/* What is PawFlix? */}
            <section className="py-24 bg-secondary/30 relative">
                <div className="container mx-auto px-4">
                    <motion.div
                        {...fadeIn}
                        className="max-w-4xl mx-auto text-center"
                    >
                        <h2 className="text-4xl md:text-5xl font-bold mb-8 text-white">What is PawFlix?</h2>
                        <p className="text-lg text-gray-300 leading-relaxed mb-6">
                            PawFlix is a premium streaming platform designed to bring the cinema experience directly to your screen. We believe entertainment should be accessible to everyone, which is why we offer a vast library of movies, TV shows, anime, and web series completely free of charge.
                        </p>
                        <p className="text-lg text-gray-300 leading-relaxed">
                            Whether you're into the latest blockbusters, timeless classics, or trending international dramas, PawFlix has something for you. Our platform is built with modern web technologies to ensure a smooth, high-quality viewing experience on any device's browser, without the need for downloads or subscriptions.
                        </p>
                    </motion.div>
                </div>
            </section>

            {/* Features Grid */}
            <section className="py-24 bg-primary relative">
                <div className="container mx-auto px-4">
                    <motion.h2 {...fadeIn} className="text-4xl font-bold text-center mb-16">Features & Benefits</motion.h2>

                    <motion.div
                        variants={staggerContainer}
                        initial="hidden"
                        whileInView="show"
                        viewport={{ once: true }}
                        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
                    >
                        {[
                            { icon: <Tv size={32} />, title: "Extensive Library", desc: "Start watching thousands of movies, series, and anime instantly." },
                            { icon: <Globe size={32} />, title: "Web Optimized", desc: "Enjoy a seamless experience directly in your browser on any device." },
                            { icon: <Zap size={32} />, title: "Fast Streaming", desc: "High-speed playback with minimal buffering for uninterrupted viewing." },
                            { icon: <Users size={32} />, title: "User Friendly", desc: "Clean interface designed for easy navigation and discovery." },
                            { icon: <Shield size={32} />, title: "No Sign-up Required", desc: "Start watching immediately without complicated registration forms." },
                            { icon: <Heart size={32} />, title: "Personalized List", desc: "Create your own watchlist to keep track of your favorite shows." }
                        ].map((feature, idx) => (
                            <motion.div
                                key={idx}
                                variants={{ hidden: { y: 20, opacity: 0 }, show: { y: 0, opacity: 1 } }}
                                className="bg-secondary/50 p-8 rounded-2xl hover:bg-secondary transition-colors border border-white/5 hover:border-accent/30 group"
                            >
                                <div className="bg-accent/10 w-16 h-16 rounded-full flex items-center justify-center text-accent mb-6 group-hover:scale-110 transition-transform">
                                    {feature.icon}
                                </div>
                                <h3 className="text-2xl font-bold mb-4">{feature.title}</h3>
                                <p className="text-gray-400">{feature.desc}</p>
                            </motion.div>
                        ))}
                    </motion.div>
                </div>
            </section>

            {/* Contact Modal */}
            <AnimatePresence>
                {isContactOpen && (
                    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            onClick={() => setIsContactOpen(false)}
                            className="absolute inset-0 bg-black/60 backdrop-blur-sm"
                        />
                        <motion.div
                            initial={{ opacity: 0, scale: 0.9, y: 20 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.9, y: 20 }}
                            className="relative bg-secondary p-8 rounded-2xl border border-white/10 shadow-2xl max-w-md w-full z-10 overflow-hidden"
                        >
                            <div className="absolute top-0 right-0 p-4">
                                <button
                                    onClick={() => setIsContactOpen(false)}
                                    className="p-2 hover:bg-white/10 rounded-full transition-colors text-gray-400 hover:text-white"
                                >
                                    <X size={24} />
                                </button>
                            </div>

                            <div className="text-center">
                                <div className="bg-accent/10 w-16 h-16 rounded-full flex items-center justify-center text-accent mx-auto mb-6">
                                    <Mail size={32} />
                                </div>

                                <h2 className="text-3xl font-bold text-white mb-2">Contact Us</h2>
                                <p className="text-gray-400 mb-8">
                                    Have feedback or found a bug? I'd love to hear from you.
                                </p>

                                <p className="text-sm text-gray-500 uppercase tracking-wider font-semibold mb-2">Email Us At</p>
                                <a
                                    href="mailto:contact.pawandev@gmail.com?subject=Feedback about the website"
                                    className="text-xl md:text-2xl font-bold text-white hover:text-accent transition-colors block mb-8 break-all"
                                >
                                    contact.pawandev@gmail.com
                                </a>

                                <a
                                    href="mailto:contact.pawandev@gmail.com?subject=Feedback about the website"
                                    className="block w-full"
                                >
                                    <motion.button
                                        whileHover={{ scale: 1.02 }}
                                        whileTap={{ scale: 0.98 }}
                                        className="w-full py-3 bg-accent text-primary font-bold rounded-xl hover:bg-white transition-colors shadow-lg shadow-accent/20"
                                    >
                                        Contact via Email
                                    </motion.button>
                                </a>

                                <p className="text-gray-500 text-xs mt-6">
                                    I usually respond within 24–48 hours.
                                </p>
                            </div>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>

            {/* Comparison Table */}
            <section className="py-24 bg-secondary/20">
                <div className="container mx-auto px-4">
                    <motion.h2 {...fadeIn} className="text-4xl font-bold text-center mb-16">Why Choose PawFlix?</motion.h2>

                    <div className="overflow-x-auto max-w-5xl mx-auto bg-secondary/40 rounded-3xl p-4 md:p-8 border border-white/5">
                        <table className="w-full text-left border-collapse min-w-[600px] md:min-w-0">
                            <thead>
                                <tr className="border-b border-white/10">
                                    <th className="p-2 md:p-4 text-sm md:text-xl font-semibold">Platform</th>
                                    <th className="p-2 md:p-4 text-sm md:text-xl font-semibold">Key Features</th>
                                    <th className="p-2 md:p-4 text-sm md:text-xl font-semibold">User Rating</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-white/5">
                                <tr className="bg-accent/5">
                                    <td className="p-3 md:p-6 font-bold text-accent flex items-center gap-2 text-sm md:text-base">
                                        <Star className="fill-accent" size={18} /> PawFlix
                                    </td>
                                    <td className="p-3 md:p-6 text-gray-300 text-sm md:text-base">Modern UI, Free Access, Huge Library</td>
                                    <td className="p-3 md:p-6 font-bold text-green-400 text-sm md:text-base">9/10</td>
                                </tr>
                                <tr>
                                    <td className="p-3 md:p-6 font-semibold text-gray-400 text-sm md:text-base">Generic Stream</td>
                                    <td className="p-3 md:p-6 text-gray-500 text-sm md:text-base">Ad-heavy, Slow buffering</td>
                                    <td className="p-3 md:p-6 text-gray-500 text-sm md:text-base">6/10</td>
                                </tr>
                                <tr>
                                    <td className="p-3 md:p-6 font-semibold text-gray-400 text-sm md:text-base">Movies2Watch</td>
                                    <td className="p-3 md:p-6 text-gray-500 text-sm md:text-base">Good library, Cluttered UI</td>
                                    <td className="p-3 md:p-6 text-gray-500 text-sm md:text-base">8/10</td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                </div>
            </section>

            {/* FAQ */}
            <section className="py-24 bg-secondary/20">
                <div className="container mx-auto px-4 max-w-4xl">
                    <motion.h2 {...fadeIn} className="text-4xl font-bold text-center mb-16">Frequently Asked Questions</motion.h2>
                    <div className="space-y-4">
                        {[
                            { q: "What is PawFlix?", a: "PawFlix is a free streaming platform where you can watch movies, TV shows, and anime online." },
                            { q: "Is it completely free?", a: "Yes, you can watch all content on PawFlix for free without any hidden subscription fees." },
                            { q: "Do I need to download an app?", a: "No, PawFlix is fully optimized for web browsers. You can stream directly on your phone, tablet, or PC." },
                            { q: "Can I save movies to a list?", a: "Yes! Create an account to add movies and shows to your personal 'My List' for easy access." }
                        ].map((faq, i) => (
                            <motion.div
                                key={i}
                                initial={{ opacity: 0, x: -20 }}
                                whileInView={{ opacity: 1, x: 0 }}
                                transition={{ delay: i * 0.1 }}
                                className="bg-primary p-6 rounded-xl border border-white/5 hover:border-accent/30 transition-colors"
                            >
                                <h3 className="font-bold text-lg mb-2 text-white">{faq.q}</h3>
                                <p className="text-gray-400">{faq.a}</p>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Contact Section */}


            {/* Footer */}
            <footer className="bg-secondary py-12 border-t border-white/5">
                <div className="container mx-auto px-4 text-center">
                    <h2 className="text-2xl font-bold text-white mb-6">PawFlix</h2>
                    <div className="flex justify-center gap-8 mb-8 text-gray-400">
                        <a href="#" className="hover:text-accent transition-colors">Home</a>
                        <a href="#" className="hover:text-accent transition-colors">Movies</a>
                        <a href="#" className="hover:text-accent transition-colors">TV Shows</a>
                        <button onClick={() => setIsContactOpen(true)} className="hover:text-accent transition-colors">Contact</button>
                    </div>
                    <p className="text-gray-600 mb-2 max-w-3xl mx-auto text-sm">
                        PawFlix does not store any files on it's server. It only links to the media which is hosted on 3rd party services like YouTube, Dailymotion, Ok.ru, Vidsrc, Cineby, Streamtape and more.
                    </p>
                    <p className="text-gray-600">© 2026 PawFlix. All rights not reserved.</p>
                </div>
            </footer>
        </div>
    );
};

export default LandingPage;
