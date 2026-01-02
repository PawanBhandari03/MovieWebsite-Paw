import { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import Section from '../components/Section';
import MovieCard from '../components/MovieCard';
import { getAnime, getImageUrl, type TMDBMovie } from '../services/tmdb';

const Anime = () => {
    const [animeList, setAnimeList] = useState<TMDBMovie[]>([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const fetchAnime = async () => {
            setIsLoading(true);
            try {
                const data = await getAnime(currentPage);
                setAnimeList(data.results);
                setTotalPages(Math.min(data.total_pages, 500));
            } catch (error) {
                console.error("Failed to fetch anime:", error);
            } finally {
                setIsLoading(false);
            }
        };
        fetchAnime();
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
            <Section title="Anime Series">
                {isLoading ? (
                    <div className="text-white text-center w-full py-20">Loading...</div>
                ) : (
                    animeList.map((anime) => (
                        <MovieCard
                            key={anime.id}
                            id={anime.id}
                            title={anime.name || anime.title || 'Unknown'}
                            image={getImageUrl(anime.poster_path)}
                            rating={anime.vote_average}
                            year={new Date(anime.first_air_date || anime.release_date || Date.now()).getFullYear()}
                            category="Anime"
                            mediaType="tv"
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

export default Anime;
