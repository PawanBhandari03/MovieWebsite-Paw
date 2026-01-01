import { useParams, Link, useLocation, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowLeft, Play, Star, Plus, Check, ChevronDown } from 'lucide-react';
import { useList, type ListType } from '../context/ListContext';
import { useAuth } from '../context/AuthContext';
import { useEffect, useState } from 'react';
import { getMovieDetails, getTVDetails, getTVSeasonDetails, type TMDBMovie } from '../services/tmdb';

interface TVShowDetails extends TMDBMovie {
    seasons?: {
        season_number: number;
        episode_count: number;
        name: string;
    }[];
}

interface Episode {
    episode_number: number;
    name: string;
    still_path: string | null;
}

const MovieDetails = () => {
    const { id } = useParams();
    const location = useLocation();
    const [movie, setMovie] = useState<TVShowDetails | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [mediaType, setMediaType] = useState<'movie' | 'tv'>('movie');
    const [selectedSeason, setSelectedSeason] = useState(1);
    const [selectedEpisode, setSelectedEpisode] = useState(1);
    const [episodes, setEpisodes] = useState<Episode[]>([]);
    const { addToList, checkListStatus } = useList();
    const { isLoggedIn } = useAuth();
    const navigate = useNavigate();

    const handleAddToList = (type: ListType) => {
        if (!isLoggedIn) {
            navigate('/auth');
            return;
        }

        if (!movie || !id) return;

        addToList({
            id: Number(id),
            title: movie.title || movie.name || '',
            poster_path: movie.poster_path || '',
            media_type: mediaType,
            vote_average: movie.vote_average
        }, type);
    };

    useEffect(() => {
        const state = location.state as { category?: string } | null;
        if (state?.category === 'Anime' || state?.category === 'TV Show') {
            setMediaType('tv');
        } else {
            setMediaType('movie');
        }
    }, [location.state]);

    useEffect(() => {
        const fetchDetails = async () => {
            if (id) {
                setIsLoading(true);
                try {
                    if (mediaType === 'movie') {
                        const data = await getMovieDetails(id);
                        setMovie(data);
                    } else {
                        const data = await getTVDetails(Number(id));
                        setMovie(data);
                        const seasonData = await getTVSeasonDetails(Number(id), 1);
                        setEpisodes(seasonData.episodes);
                    }
                } catch (error) {
                    console.error("Failed to fetch details:", error);
                } finally {
                    setIsLoading(false);
                }
            }
        };
        fetchDetails();
    }, [id, mediaType]);

    useEffect(() => {
        const fetchEpisodes = async () => {
            if (mediaType === 'tv' && id) {
                try {
                    const seasonData = await getTVSeasonDetails(Number(id), selectedSeason);
                    setEpisodes(seasonData.episodes);
                } catch (error) {
                    console.error("Failed to fetch episodes:", error);
                }
            }
        };
        fetchEpisodes();
    }, [selectedSeason, id, mediaType]);

    if (isLoading) {
        return <div className="min-h-screen bg-primary flex items-center justify-center text-white">Loading...</div>;
    }

    if (!movie) {
        return <div className="min-h-screen bg-primary flex items-center justify-center text-white">Content not found</div>;
    }

    const embedUrl = mediaType === 'movie'
        ? `https://rivestream.org/embed?type=movie&id=${id}`
        : `https://rivestream.org/embed?type=tv&id=${id}&season=${selectedSeason}&episode=${selectedEpisode}`;

    return (
        <div className="min-h-screen bg-primary flex flex-col pt-20">
            <div className="px-4 md:px-8">
                <Link to="/" className="inline-flex items-center gap-2 text-white hover:text-accent transition-colors mb-6">
                    <ArrowLeft className="w-6 h-6" />
                    <span>Back to Home</span>
                </Link>
            </div>

            <div className="flex-1 flex flex-col items-center px-4 md:px-12 pb-20">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="w-full max-w-6xl"
                >
                    <div className="aspect-video w-full bg-black rounded-xl overflow-hidden shadow-2xl border border-gray-800 mb-8">
                        <iframe
                            src={embedUrl}
                            className="w-full h-full"
                            allowFullScreen
                            allow="autoplay; encrypted-media; picture-in-picture"
                            referrerPolicy="origin"
                            title="Player"
                        />
                    </div>

                    <div className="text-left">
                        <h1 className="text-3xl md:text-5xl font-bold text-white mb-4">{movie.title || movie.name}</h1>

                        <div className="flex flex-wrap items-center gap-4 text-gray-300 mb-6">
                            {(movie.release_date || movie.first_air_date) && (
                                <span className="px-3 py-1 bg-secondary rounded-full text-sm font-medium border border-gray-700">
                                    {new Date(movie.release_date || movie.first_air_date || '').getFullYear()}
                                </span>
                            )}
                            <span className="flex items-center gap-1 text-yellow-400">
                                <Star className="w-4 h-4 fill-current" />
                                {movie.vote_average.toFixed(1)}
                            </span>

                            {/* Add to List Dropdown */}
                            <div className="relative ml-4 group">
                                <button className="flex items-center gap-2 px-4 py-2 bg-secondary/50 hover:bg-secondary rounded-full transition-all duration-300 border border-gray-700">
                                    {checkListStatus(Number(id)) ? (
                                        <>
                                            <Check className="w-4 h-4 text-green-500" />
                                            <span className="text-green-500 capitalize">{checkListStatus(Number(id))}</span>
                                        </>
                                    ) : (
                                        <>
                                            <Plus className="w-4 h-4" />
                                            <span>Add to List</span>
                                        </>
                                    )}
                                    <ChevronDown className="w-4 h-4" />
                                </button>

                                <div className="absolute top-full left-0 mt-2 w-48 bg-secondary border border-gray-700 rounded-xl shadow-xl overflow-hidden opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300 z-50">
                                    {(['watched', 'watching', 'pending', 'favourites'] as const).map((type) => (
                                        <button
                                            key={type}
                                            onClick={() => handleAddToList(type)}
                                            className={`w-full text-left px-4 py-3 hover:bg-white/10 transition-colors flex items-center justify-between ${checkListStatus(Number(id)) === type ? 'text-accent' : 'text-gray-300'
                                                }`}
                                        >
                                            <span className="capitalize">{type}</span>
                                            {checkListStatus(Number(id)) === type && <Check className="w-4 h-4" />}
                                        </button>
                                    ))}
                                </div>
                            </div>
                        </div>

                        {mediaType === 'tv' && (
                            <div className="mb-8 p-6 bg-secondary/30 rounded-xl border border-gray-800">
                                <h3 className="text-xl font-semibold text-white mb-4 flex items-center gap-2">
                                    <Play className="w-5 h-5 text-accent" />
                                    Select Episode
                                </h3>
                                <div className="flex flex-col md:flex-row gap-4">
                                    <select
                                        value={selectedSeason}
                                        onChange={(e) => {
                                            setSelectedSeason(Number(e.target.value));
                                            setSelectedEpisode(1);
                                        }}
                                        className="bg-primary text-white p-3 rounded-lg border border-gray-700 focus:border-accent outline-none min-w-[150px]"
                                    >
                                        {movie.seasons?.filter(s => s.season_number > 0).map((season) => (
                                            <option key={season.season_number} value={season.season_number}>
                                                Season {season.season_number}
                                            </option>
                                        ))}
                                    </select>

                                    <select
                                        value={selectedEpisode}
                                        onChange={(e) => setSelectedEpisode(Number(e.target.value))}
                                        className="bg-primary text-white p-3 rounded-lg border border-gray-700 focus:border-accent outline-none flex-1"
                                    >
                                        {episodes.map((episode) => (
                                            <option key={episode.episode_number} value={episode.episode_number}>
                                                Episode {episode.episode_number}: {episode.name}
                                            </option>
                                        ))}
                                    </select>
                                </div>
                            </div>
                        )}

                        <p className="text-gray-400 text-lg leading-relaxed max-w-4xl">
                            {movie.overview}
                        </p>
                    </div>
                </motion.div>
            </div>
        </div>
    );
};

export default MovieDetails;
