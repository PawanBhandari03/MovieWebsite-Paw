import { useSearchParams } from 'react-router-dom';
import Section from '../components/Section';
import MovieCard from '../components/MovieCard';
import { searchMulti, getImageUrl, type TMDBMovie } from '../services/tmdb';
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
                    const data = await searchMulti(query);
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

    const getCategory = (item: TMDBMovie) => {
        if (item.media_type === 'tv') {
            // Simple heuristic to label known genres if we had them, otherwise just TV Show
            if (item.origin_country?.includes('KR')) return 'Drama'; // Optional polish
            if (item.origin_country?.includes('JP') && item.genre_ids?.includes(16)) return 'Anime';
            return 'TV Show';
        }
        return 'Movie';
    };

    return (
        <div className="pt-24 pb-20 min-h-screen bg-primary">
            <Section title={`Search Results for "${query}"`}>
                {isLoading ? (
                    <div className="text-white text-center w-full py-10">Searching...</div>
                ) : results.length > 0 ? (
                    results.map((item) => (
                        <MovieCard
                            key={item.id}
                            id={item.id}
                            title={item.title || item.name || 'Unknown'}
                            image={getImageUrl(item.poster_path)}
                            rating={item.vote_average}
                            year={new Date(item.release_date || item.first_air_date || Date.now()).getFullYear()}
                            category={getCategory(item)}
                            mediaType={item.media_type as 'movie' | 'tv'}
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
