import { useState, useEffect } from 'react';
import { Play, Info, ChevronLeft, ChevronRight } from 'lucide-react';
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
        <div className="relative h-[85vh] w-full overflow-hidden group">
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
            <div className="relative z-10 h-full flex items-center px-4 md:px-12 max-w-7xl mx-auto">
                <div className="max-w-2xl space-y-6 pt-20">
                    <motion.div
                        key={`content-${currentIndex}`}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5, delay: 0.3 }}
                    >
                        <span className="text-accent font-semibold tracking-wider uppercase text-sm">
                            #{currentIndex + 1} Trending
                        </span>
                        <h1 className="text-4xl md:text-6xl font-bold text-white mt-2 leading-tight drop-shadow-lg">
                            {currentMovie.title || currentMovie.name}
                        </h1>
                    </motion.div>

                    <motion.p
                        key={`desc-${currentIndex}`}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5, delay: 0.4 }}
                        className="text-gray-300 text-lg md:text-xl line-clamp-3 drop-shadow-md"
                    >
                        {currentMovie.overview}
                    </motion.p>

                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5, delay: 0.5 }}
                        className="flex flex-wrap gap-4"
                    >
                        <button
                            onClick={() => navigate(`/movie/${currentMovie.id}`)}
                            className="flex items-center gap-2 px-8 py-3 bg-accent text-primary font-bold rounded-full hover:bg-accent/90 transition-all transform hover:scale-105 shadow-[0_0_20px_rgba(56,189,248,0.5)]"
                        >
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

            {/* Navigation Buttons */}
            <button
                onClick={handlePrev}
                className="absolute left-4 top-1/2 -translate-y-1/2 p-3 bg-black/30 backdrop-blur-sm text-white rounded-full hover:bg-accent hover:text-primary transition-all border border-white/10 hover:border-accent z-20 opacity-0 group-hover:opacity-100 duration-300"
                aria-label="Previous Slide"
            >
                <ChevronLeft className="w-8 h-8" />
            </button>
            <button
                onClick={handleNext}
                className="absolute right-4 top-1/2 -translate-y-1/2 p-3 bg-black/30 backdrop-blur-sm text-white rounded-full hover:bg-accent hover:text-primary transition-all border border-white/10 hover:border-accent z-20 opacity-0 group-hover:opacity-100 duration-300"
                aria-label="Next Slide"
            >
                <ChevronRight className="w-8 h-8" />
            </button>

            {/* Indicators */}
            <div className="absolute bottom-10 left-1/2 -translate-x-1/2 flex gap-2 z-20">
                {movies.map((_, index) => (
                    <button
                        key={index}
                        onClick={() => setCurrentIndex(index)}
                        className={`w-2 h-2 rounded-full transition-all ${index === currentIndex ? 'bg-accent w-6' : 'bg-gray-500 hover:bg-gray-400'
                            }`}
                        aria-label={`Go to slide ${index + 1}`}
                    />
                ))}
            </div>
        </div>
    );
};

export default Hero;
