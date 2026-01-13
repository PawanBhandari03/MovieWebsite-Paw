import { useState, useEffect } from 'react';
import { Play, ChevronLeft, ChevronRight } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { getTrendingMovies, getImageUrl, type TMDBMovie } from '../services/tmdb';

const Hero = () => {
    const [movies, setMovies] = useState<TMDBMovie[]>([]);
    const [currentIndex, setCurrentIndex] = useState(0);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchMovies = async () => {
            try {
                const trending = await getTrendingMovies();
                setMovies(trending.slice(0, 10)); // Take top 10 movies
            } catch (error) {
                console.error("Error fetching trending movies:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchMovies();
    }, []);

    useEffect(() => {
        if (movies.length === 0) return;

        const interval = setInterval(() => {
            setCurrentIndex((prev) => (prev + 1) % movies.length);
        }, 8000); // Change slide every 8 seconds

        return () => clearInterval(interval);
    }, [movies]);

    const handleNext = () => {
        setCurrentIndex((prev) => (prev + 1) % movies.length);
    };

    const handlePrev = () => {
        setCurrentIndex((prev) => (prev - 1 + movies.length) % movies.length);
    };

    if (loading) {
        return (
            <div className="h-[85vh] w-full flex items-center justify-center bg-black">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary-500"></div>
            </div>
        );
    }

    if (movies.length === 0) return null;

    const currentMovie = movies[currentIndex];

    return (
        <div className="relative h-[60vh] md:h-screen w-full overflow-hidden group">
            <AnimatePresence mode="wait">
                <motion.div
                    key={currentIndex}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.7 }}
                    className="absolute inset-0"
                >
                    {/* Background Image */}
                    <div
                        className="absolute inset-0 bg-cover bg-center bg-no-repeat transition-transform duration-[10000ms] ease-linear transform scale-105"
                        style={{
                            backgroundImage: `url("${getImageUrl(currentMovie.backdrop_path, 'original')}")`,
                        }}
                    >
                        <div className="absolute inset-0 bg-gradient-to-t from-primary via-primary/50 to-transparent" />
                        <div className="absolute inset-0 bg-gradient-to-r from-primary via-primary/50 to-transparent" />
                    </div>
                </motion.div>
            </AnimatePresence>

            {/* Content */}
            <div className="relative z-10 h-full flex flex-col md:flex-row items-center md:items-end justify-center md:justify-between px-4 md:px-12 max-w-[1920px] mx-auto pb-20 md:pb-40 gap-8 md:gap-0">
                <div className="max-w-3xl space-y-4 md:space-y-6 pt-0 md:pt-20 text-center md:text-left flex flex-col items-center md:items-start">
                    <motion.div
                        key={`content-${currentIndex}`}
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8, delay: 0.2, ease: "easeOut" }}
                    >

                        <h1 className="text-3xl md:text-7xl font-bold text-white mt-2 leading-tight drop-shadow-2xl">
                            {currentMovie.title || currentMovie.name}
                        </h1>
                    </motion.div>

                    <motion.p
                        key={`desc-${currentIndex}`}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8, delay: 0.4, ease: "easeOut" }}
                        className="text-gray-300 text-sm md:text-xl line-clamp-3 drop-shadow-lg max-w-2xl"
                    >
                        {currentMovie.overview}
                    </motion.p>
                </div>

                <motion.div
                    key={`button-${currentIndex}`}
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.5, delay: 0.5 }}
                    className="flex flex-wrap gap-4 mt-0 md:mt-0 md:pl-8 md:pr-24 justify-center md:justify-start"
                >
                    <button
                        onClick={() => navigate(`/movie/${currentMovie.id}`)}
                        className="flex items-center gap-4 group cursor-pointer"
                    >
                        <div className="w-16 h-16 md:w-20 md:h-20 rounded-full border-2 border-accent flex items-center justify-center group-hover:scale-110 transition-transform duration-300 shadow-[0_0_15px_rgba(56,189,248,0.5)]">
                            <Play className="w-8 h-8 md:w-10 md:h-10 text-accent fill-accent ml-1" />
                        </div>
                        <span className="text-2xl md:text-3xl font-bold tracking-widest text-white drop-shadow-lg group-hover:text-accent transition-colors">
                            WATCH NOW!
                        </span>
                    </button>
                </motion.div>
            </div>

            {/* Navigation Buttons */}
            <button
                onClick={handlePrev}
                className="block absolute left-4 top-1/2 -translate-y-1/2 p-3 bg-black/30 backdrop-blur-sm text-white rounded-full hover:bg-accent hover:text-primary transition-all border border-white/10 hover:border-accent z-20 opacity-100 md:opacity-0 md:group-hover:opacity-100 duration-300"
                aria-label="Previous Slide"
            >
                <ChevronLeft className="w-8 h-8" />
            </button>
            <button
                onClick={handleNext}
                className="block absolute right-4 top-1/2 -translate-y-1/2 p-3 bg-black/30 backdrop-blur-sm text-white rounded-full hover:bg-accent hover:text-primary transition-all border border-white/10 hover:border-accent z-20 opacity-100 md:opacity-0 md:group-hover:opacity-100 duration-300"
                aria-label="Next Slide"
            >
                <ChevronRight className="w-8 h-8" />
            </button>

            {/* Indicators */}
            <div className="absolute bottom-6 md:bottom-10 left-1/2 -translate-x-1/2 flex gap-2 z-20">
                {movies.map((_, index) => (
                    <button
                        key={index}
                        onClick={() => setCurrentIndex(index)}
                        className={`w-1.5 h-1.5 md:w-2 md:h-2 rounded-full transition-all ${index === currentIndex ? 'bg-accent w-4 md:w-6' : 'bg-gray-500 hover:bg-gray-400'
                            }`}
                        aria-label={`Go to slide ${index + 1}`}
                    />
                ))}
            </div>
        </div>
    );
};

export default Hero;
