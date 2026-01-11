import { useRef, useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import MovieCard from './MovieCard';
import { getImageUrl, type TMDBMovie } from '../services/tmdb';

interface MovieSliderProps {
    title: string;
    movies: TMDBMovie[];
}

const MovieSlider = ({ title, movies }: MovieSliderProps) => {
    const sliderRef = useRef<HTMLDivElement>(null);
    const [showLeftArrow, setShowLeftArrow] = useState(false);
    const [showRightArrow, setShowRightArrow] = useState(true);

    const checkScroll = () => {
        if (sliderRef.current) {
            const { scrollLeft, scrollWidth, clientWidth } = sliderRef.current;
            setShowLeftArrow(scrollLeft > 0);
            setShowRightArrow(scrollLeft < scrollWidth - clientWidth - 10); // buffer
        }
    };

    useEffect(() => {
        checkScroll();
        window.addEventListener('resize', checkScroll);
        return () => window.removeEventListener('resize', checkScroll);
    }, [movies]);

    const scroll = (direction: 'left' | 'right') => {
        if (sliderRef.current) {
            const { current } = sliderRef;
            const scrollAmount = direction === 'left' ? -current.clientWidth : current.clientWidth;
            current.scrollBy({ left: scrollAmount, behavior: 'smooth' });
            // Timeout to allow scroll to happen before checking
            setTimeout(checkScroll, 300);
        }
    };

    if (!movies || movies.length === 0) return null;

    return (
        <div className="py-4 md:py-8 relative group/slider">
            {/* Attractive Header */}
            <div className="mb-6 md:mb-10 relative px-4 md:px-0">
                <div className="relative flex items-center gap-4">
                    <div className="h-8 w-1.5 bg-accent rounded-full animate-pulse" />
                    <h2 className="text-2xl md:text-4xl font-bold text-white tracking-wide uppercase drop-shadow-md">
                        {title}
                    </h2>
                    <div className="h-[1px] flex-grow bg-gradient-to-r from-accent/50 to-transparent ml-4" />
                </div>
            </div>

            <div className="relative">
                {/* Left Button */}
                {showLeftArrow && (
                    <button
                        onClick={() => scroll('left')}
                        className="absolute left-0 top-1/2 -translate-y-1/2 z-20 p-2 text-white/70 hover:text-accent hover:scale-125 transition-all duration-300 -ml-4 md:-ml-8"
                        aria-label="Scroll left"
                    >
                        <ChevronLeft size={40} strokeWidth={1.5} />
                    </button>
                )}

                {/* Slider Container */}
                <div
                    ref={sliderRef}
                    onScroll={checkScroll}
                    className="flex gap-4 overflow-x-auto scrollbar-hide scroll-smooth pb-8 px-1"
                    style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
                >
                    {movies.map((movie) => (
                        <div key={movie.id} className="w-[150px] md:w-[220px] flex-shrink-0 transition-transform duration-300 hover:z-20 hover:scale-105">
                            <MovieCard
                                id={movie.id}
                                title={movie.title || movie.name || 'Unknown'}
                                image={getImageUrl(movie.poster_path)}
                                rating={movie.vote_average}
                                year={new Date(movie.release_date || movie.first_air_date || Date.now()).getFullYear()}
                                category={movie.media_type === 'tv' ? 'TV Show' : 'Movie'}
                                mediaType={movie.media_type === 'tv' ? 'tv' : 'movie'}
                                overview={movie.overview}
                                genreIds={movie.genre_ids}
                            />
                        </div>
                    ))}
                </div>

                {/* Right Button */}
                {showRightArrow && (
                    <button
                        onClick={() => scroll('right')}
                        className="absolute right-0 top-1/2 -translate-y-1/2 z-20 p-2 text-white/70 hover:text-accent hover:scale-125 transition-all duration-300 -mr-4 md:-mr-8"
                        aria-label="Scroll right"
                    >
                        <ChevronRight size={40} strokeWidth={1.5} />
                    </button>
                )}
            </div>
        </div>
    );
};

export default MovieSlider;
