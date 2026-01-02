import { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import Section from '../components/Section';
import MovieCard from '../components/MovieCard';
import { getDramas, getImageUrl, type TMDBMovie } from '../services/tmdb';

const Dramas = () => {
    const [dramas, setDramas] = useState<TMDBMovie[]>([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const fetchDramas = async () => {
            setIsLoading(true);
            try {
                const data = await getDramas(currentPage);
                setDramas(data.results);
                setTotalPages(Math.min(data.total_pages, 500));
            } catch (error) {
                console.error("Failed to fetch dramas:", error);
            } finally {
                setIsLoading(false);
            }
        };
        fetchDramas();
    }, [currentPage]);

    const scrollToTop = () => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    const handlePageChange = (page: number) => {
        setCurrentPage(page);
        scrollToTop();
    };

    return (
        <div className="pt-24 pb-20 min-h-screen bg-primary">
            <Section title="Popular Dramas (Kdrama)">
                {isLoading ? (
                    <div className="text-white text-center w-full py-20">Loading...</div>
                ) : (
                    dramas.map((drama) => (
                        <MovieCard
                            key={drama.id}
                            id={drama.id}
                            title={drama.name || drama.title || 'Unknown'}
                            image={getImageUrl(drama.poster_path)}
                            rating={drama.vote_average}
                            year={new Date(drama.first_air_date || drama.release_date || Date.now()).getFullYear()}
                            category="Drama"
                        />
                    ))
                )}
            </Section>

            {/* Pagination */}
            {!isLoading && (
                <div className="max-w-7xl mx-auto px-4 md:px-12 mt-8 flex justify-center items-center gap-4">
                    <button
                        onClick={() => handlePageChange(currentPage - 1)}
                        disabled={currentPage === 1}
                        className="p-2 rounded-full bg-secondary hover:bg-accent/20 text-white disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                    >
                        <ChevronLeft className="w-6 h-6" />
                    </button>

                    <span className="text-gray-400 font-medium">
                        Page {currentPage} of {totalPages}
                    </span>

                    <button
                        onClick={() => handlePageChange(currentPage + 1)}
                        disabled={currentPage === totalPages}
                        className="p-2 rounded-full bg-secondary hover:bg-accent/20 text-white disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                    >
                        <ChevronRight className="w-6 h-6" />
                    </button>
                </div>
            )}
        </div>
    );
};

export default Dramas;
