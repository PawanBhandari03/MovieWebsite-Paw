import { useSearchParams } from 'react-router-dom';
import Section from '../components/Section';
import MovieCard from '../components/MovieCard';
import { searchMovies, getImageUrl, type TMDBMovie } from '../services/tmdb';
import { useEffect, useState } from 'react';

const Search = () => {
    const [searchParams] = useSearchParams();
    const query = searchParams.get('q') || '';
    const [results, setResults] = useState<TMDBMovie[]>([]);
    const [isLoading, setIsLoading] = useState(false);

    useEffect(() => {
        const fetchResults = async () => {
            if (query) {
                setIsLoading(true);
                try {
                    const data = await searchMovies(query);
                    setResults(data.results);
                } catch (error) {
                    console.error("Search failed:", error);
                } finally {
                    setIsLoading(false);
                }
            } else {
                setResults([]);
            }
        };
        fetchResults();
    }, [query]);

    return (
        <div className="pt-24 pb-20 min-h-screen bg-primary">
            <Section title={`Search Results for "${query}"`}>
                {isLoading ? (
                    <div className="text-white text-center w-full py-10">Searching...</div>
                ) : results.length > 0 ? (
                    results.map((movie) => (
                        <MovieCard
                            key={movie.id}
                            id={movie.id}
                            title={movie.title || movie.name || 'Unknown'}
                            image={getImageUrl(movie.poster_path)}
                            rating={movie.vote_average}
                            year={new Date(movie.release_date || movie.first_air_date || Date.now()).getFullYear()}
                            category="Movie"
                        />
                    ))
                ) : (
                    <div className="text-center text-gray-400 mt-10">
                        <p className="text-xl">No results found for "{query}"</p>
                        <p className="mt-2">Try searching for a different title.</p>
                    </div>
                )}
            </Section>
        </div>
    );
};

export default Search;
