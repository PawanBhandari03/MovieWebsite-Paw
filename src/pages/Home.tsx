import { useEffect, useState } from 'react';
import Hero from '../components/Hero';
import MovieSlider from '../components/MovieSlider';
import {
    getTrendingMovies,
    getAnime,
    getWebSeries,
    getDramas,
    type TMDBMovie
} from '../services/tmdb';

const Home = () => {
    const [trendingMovies, setTrendingMovies] = useState<TMDBMovie[]>([]);
    const [trendingAnime, setTrendingAnime] = useState<TMDBMovie[]>([]);
    const [trendingSeries, setTrendingSeries] = useState<TMDBMovie[]>([]);
    const [trendingDrama, setTrendingDrama] = useState<TMDBMovie[]>([]);

    useEffect(() => {
        const fetchAllData = async () => {
            try {
                // Fetch all categories in parallel
                const [movies, anime, series, drama] = await Promise.all([
                    getTrendingMovies(),
                    getAnime(),
                    getWebSeries(),
                    getDramas()
                ]);

                // Update state
                setTrendingMovies(movies);
                setTrendingAnime(anime.results || []);
                setTrendingSeries(series.results || []);
                setTrendingDrama(drama.results || []);

            } catch (error) {
                console.error("Failed to fetch home page content:", error);
            }
        };

        fetchAllData();
    }, []);

    return (
        <div className="pb-8">
            <Hero />

            {/* Movies Content */}
            <div className="relative z-10 -mt-10 md:-mt-20 pb-8 space-y-12 md:space-y-24 pl-4 md:pl-12">
                <div className="pt-10 md:pt-20"> {/* Added spacing spacer */}
                    {trendingMovies.length > 0 && <MovieSlider title="Trending Movies" movies={trendingMovies} />}
                </div>

                {trendingAnime.length > 0 && <MovieSlider title="Trending Anime" movies={trendingAnime} />}
                <MovieSlider title="Trending Web Series" movies={trendingSeries} />
                <MovieSlider title="Trending Drama" movies={trendingDrama} />
            </div>
        </div>
    );
};

export default Home;
