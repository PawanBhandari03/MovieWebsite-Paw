import { useEffect, useState } from 'react';
import Hero from '../components/Hero';
import Section from '../components/Section';
import MovieCard from '../components/MovieCard';
import { getTrendingMovies, getImageUrl, type TMDBMovie } from '../services/tmdb';

const Home = () => {
    const [trending, setTrending] = useState<TMDBMovie[]>([]);

    useEffect(() => {
        const fetchMovies = async () => {
            try {
                const movies = await getTrendingMovies();
                setTrending(movies);
            } catch (error) {
                console.error("Failed to fetch trending movies:", error);
            }
        };
        fetchMovies();
    }, []);

    return (
        <div className="pb-20">
            <Hero />

            <div className="-mt-20 relative z-20">
                <Section title="Trending Now">
                    {trending.slice(0, 12).map((movie) => (
                        <MovieCard
                            key={movie.id}
                            id={movie.id}
                            title={movie.title || movie.name || 'Unknown'}
                            image={getImageUrl(movie.poster_path)}
                            rating={movie.vote_average}
                            year={new Date(movie.release_date || movie.first_air_date || Date.now()).getFullYear()}
                            category="Movie"
                        />
                    ))}
                </Section>
            </div>
        </div>
    );
};

export default Home;
