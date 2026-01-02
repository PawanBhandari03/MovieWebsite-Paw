import { useEffect, useState } from 'react';
import Hero from '../components/Hero';
import Section from '../components/Section';
import MovieCard from '../components/MovieCard';
import { getTrendingMovies, getTrendingMoviesToday, getPopularMovies, getImageUrl, type TMDBMovie } from '../services/tmdb';

const Home = () => {
    const [trendingToday, setTrendingToday] = useState<TMDBMovie[]>([]);
    const [trendingWeek, setTrendingWeek] = useState<TMDBMovie[]>([]);
    const [trendingMonth, setTrendingMonth] = useState<TMDBMovie[]>([]);

    useEffect(() => {
        const fetchMovies = async () => {
            try {
                const results = await Promise.allSettled([
                    getTrendingMoviesToday(),
                    getTrendingMovies(),
                    getPopularMovies() // Using popular as proxy for monthly trending
                ]);

                if (results[0].status === 'fulfilled') {
                    setTrendingToday(results[0].value);
                }

                if (results[1].status === 'fulfilled') {
                    setTrendingWeek(results[1].value);
                }

                if (results[2].status === 'fulfilled') {
                    setTrendingMonth(results[2].value?.results || []);
                }
            } catch (error) {
                console.error("Critical failure in fetching movies:", error);
            }
        };
        fetchMovies();
    }, []);

    return (
        <div className="pb-20">
            <Hero />

            <div className="-mt-10 relative z-20 space-y-12">
                <Section title="Trending Today">
                    {trendingToday.slice(0, 12).map((movie) => (
                        <MovieCard
                            key={movie.id}
                            id={movie.id}
                            title={movie.title || movie.name || 'Unknown'}
                            image={getImageUrl(movie.poster_path)}
                            rating={movie.vote_average}
                            year={new Date(movie.release_date || movie.first_air_date || Date.now()).getFullYear()}
                            category="Movie"
                            mediaType="movie"
                        />
                    ))}
                </Section>

                <Section title="Trending This Week">
                    {trendingWeek.slice(0, 12).map((movie) => (
                        <MovieCard
                            key={movie.id}
                            id={movie.id}
                            title={movie.title || movie.name || 'Unknown'}
                            image={getImageUrl(movie.poster_path)}
                            rating={movie.vote_average}
                            year={new Date(movie.release_date || movie.first_air_date || Date.now()).getFullYear()}
                            category="Movie"
                            mediaType="movie"
                        />
                    ))}
                </Section>

                <Section title="Trending This Month">
                    {trendingMonth.slice(0, 12).map((movie) => (
                        <MovieCard
                            key={movie.id}
                            id={movie.id}
                            title={movie.title || movie.name || 'Unknown'}
                            image={getImageUrl(movie.poster_path)}
                            rating={movie.vote_average}
                            year={new Date(movie.release_date || movie.first_air_date || Date.now()).getFullYear()}
                            category="Movie"
                            mediaType="movie"
                        />
                    ))}
                </Section>
            </div>
        </div>
    );
};

export default Home;
