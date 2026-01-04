
import { useParams, useSearchParams, useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { ArrowLeft } from 'lucide-react';
import Section from '../components/Section';
import MovieCard from '../components/MovieCard';
import { getDiscoverMovies, getDiscoverTV, getDiscoverAnime, getImageUrl, type TMDBMovie } from '../services/tmdb';

const GenreResults = () => {
    const { id } = useParams();
    const [searchParams] = useSearchParams();
    const navigate = useNavigate();
    const genreName = searchParams.get('name') || 'Genre';

    const [movies, setMovies] = useState<TMDBMovie[]>([]);
    const [tvShows, setTvShows] = useState<TMDBMovie[]>([]);
    const [anime, setAnime] = useState<TMDBMovie[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            if (!id) return;
            setIsLoading(true);
            try {
                // Fetch all categories in parallel
                const [movieData, tvData, animeData] = await Promise.all([
                    getDiscoverMovies(id),
                    getDiscoverTV(id),
                    getDiscoverAnime(id)
                ]);

                setMovies(movieData.results);
                setTvShows(tvData.results);
                setAnime(animeData.results);
            } catch (error) {
                console.error("Failed to fetch genre data:", error);
            } finally {
                setIsLoading(false);
            }
        };

        fetchData();
        window.scrollTo(0, 0);
    }, [id]);

    if (isLoading) {
        return <div className="min-h-screen bg-primary flex items-center justify-center text-white">Loading...</div>;
    }

    // Check if we have any results at all
    const hasResults = movies.length > 0 || tvShows.length > 0 || anime.length > 0;

    return (
        <div className="pt-24 pb-20 min-h-screen bg-primary">
            <div className="px-4 md:px-12 mb-8">
                <button
                    onClick={() => navigate('/genres')}
                    className="flex items-center gap-2 text-gray-400 hover:text-white transition-colors mb-6 group"
                >
                    <ArrowLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
                    <span className="font-medium">Back to Genres</span>
                </button>
                <h1 className="text-3xl md:text-5xl font-bold text-white mb-2">{genreName}</h1>
                <p className="text-gray-400">Explore movies, series, and anime in {genreName}</p>
            </div>

            {!hasResults ? (
                <div className="px-4 md:px-12 text-gray-400">No results found for this genre.</div>
            ) : (
                <div className="space-y-12">
                    {movies.length > 0 && (
                        <Section title="Movies">
                            {movies.map((movie) => (
                                <MovieCard
                                    key={movie.id}
                                    id={movie.id}
                                    title={movie.title || 'Unknown'}
                                    image={getImageUrl(movie.poster_path)}
                                    rating={movie.vote_average}
                                    year={new Date(movie.release_date || Date.now()).getFullYear()}
                                    category="Movie"
                                    mediaType="movie"
                                    overview={movie.overview}
                                    genreIds={movie.genre_ids}
                                />
                            ))}
                        </Section>
                    )}

                    {tvShows.length > 0 && (
                        <Section title="TV Series">
                            {tvShows.map((show) => (
                                <MovieCard
                                    key={show.id}
                                    id={show.id}
                                    title={show.name || 'Unknown'}
                                    image={getImageUrl(show.poster_path)}
                                    rating={show.vote_average}
                                    year={new Date(show.first_air_date || Date.now()).getFullYear()}
                                    category="TV Show"
                                    mediaType="tv"
                                    overview={show.overview}
                                    genreIds={show.genre_ids}
                                />
                            ))}
                        </Section>
                    )}

                    {anime.length > 0 && (
                        <Section title="Anime">
                            {anime.map((show) => (
                                <MovieCard
                                    key={show.id}
                                    id={show.id}
                                    title={show.name || 'Unknown'}
                                    image={getImageUrl(show.poster_path)}
                                    rating={show.vote_average}
                                    year={new Date(show.first_air_date || Date.now()).getFullYear()}
                                    category="Anime"
                                    mediaType="tv"
                                    overview={show.overview}
                                    genreIds={show.genre_ids}
                                />
                            ))}
                        </Section>
                    )}
                </div>
            )}
        </div>
    );
};

export default GenreResults;
