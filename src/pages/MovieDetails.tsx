import { useParams, Link, useLocation, useNavigate } from 'react-router-dom';
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

const EMBED_DOMAINS = [
    'vidsrc-embed.su',
    'vidsrcme.su',
    'vsrc.su'
];

const MovieDetails = () => {
    const { id } = useParams();
    const location = useLocation();
    const [movie, setMovie] = useState<TVShowDetails | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [selectedSeason, setSelectedSeason] = useState(1);
    const [selectedEpisode, setSelectedEpisode] = useState(1);
    const [episodes, setEpisodes] = useState<Episode[]>([]);
    const { addToList, checkListStatus } = useList();
    const { isLoggedIn } = useAuth();
    const navigate = useNavigate();

    // Derived state - instant, no useEffect lag
    const isTvShow = location.pathname.includes('/tv/');
    const mediaType = isTvShow ? 'tv' : 'movie';

    const [currentEmbedIndex, setCurrentEmbedIndex] = useState(0);

    // Reset embed source when content changes
    useEffect(() => {
        setCurrentEmbedIndex(0);
    }, [id, mediaType, selectedSeason, selectedEpisode]);

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
        const fetchDetails = async () => {
            if (!id) return;

            setIsLoading(true);
            setError(null);
            setMovie(null);

            try {
                if (mediaType === 'movie') {
                    console.log('Fetching movie details for ID:', id);
                    const data = await getMovieDetails(id);
                    setMovie(data);
                } else {
                    console.log('Fetching TV details for ID:', id);
                    const data = await getTVDetails(Number(id));
                    setMovie(data);
                    try {
                        const seasonData = await getTVSeasonDetails(Number(id), 1);
                        setEpisodes(seasonData.episodes);
                    } catch (e) {
                        console.warn("Failed to fetch season details", e);
                    }
                }
            } catch (error: any) {
                console.error("Failed to fetch details:", error);
                setError(error.message || "Failed to load content");
                setMovie(null);
            } finally {
                setIsLoading(false);
            }
        };

        fetchDetails();
    }, [id, mediaType]);

    // ... handle handleAddToList ...

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

    if (error || !movie) {
        return (
            <div className="min-h-screen bg-primary flex flex-col items-center justify-center text-white gap-4">
                <div className="text-xl">Content not found</div>
                <div className="text-sm text-gray-400">
                    {mediaType === 'tv' ? 'TV Show' : 'Movie'} ID: {id}
                </div>
                {error && <div className="text-red-400 text-sm">Error: {error}</div>}
                <Link to="/home" className="px-4 py-2 bg-secondary rounded-lg hover:bg-accent transition-colors">
                    Back to Home
                </Link>
            </div>
        );
    }



    const handleEmbedError = () => {
        if (currentEmbedIndex < EMBED_DOMAINS.length) {
            setCurrentEmbedIndex(prev => prev + 1);
        }
    };

    const currentDomain = EMBED_DOMAINS[currentEmbedIndex];
    const showPlayer = currentEmbedIndex < EMBED_DOMAINS.length;

    const embedUrl = mediaType === 'movie'
        ? `https://${currentDomain}/embed/movie/${id}`
        : `https://${currentDomain}/embed/tv/${id}/${selectedSeason}/${selectedEpisode}`;

    // Helper to render the player content
    const renderPlayer = () => {
        if (!showPlayer) {
            return (
                <div className="w-full h-full flex flex-col items-center justify-center bg-gray-900 text-white p-6 text-center z-10">
                    <p className="text-xl font-semibold mb-2">Video is not available on your network.</p>
                    <p className="text-gray-400 mb-6">Please try another connection or check back later.</p>
                    <button
                        onClick={() => setCurrentEmbedIndex(0)}
                        className="px-6 py-2 bg-secondary hover:bg-accent text-white rounded-lg transition-colors font-medium border border-gray-700"
                    >
                        Retry Servers
                    </button>
                </div>
            );
        }

        return (
            <iframe
                key={`${embedUrl}-${currentEmbedIndex}`} // Force re-render on source change
                src={embedUrl}
                className="w-full h-full"
                allowFullScreen
                allow="autoplay; encrypted-media; picture-in-picture"
                referrerPolicy="origin"
                title="Player"
                onError={handleEmbedError}
            />
        );
    };

    const trailer = movie.videos?.results
        .filter(video => video.site === 'YouTube')
        .sort((a, b) => {
            const typePriority: { [key: string]: number } = {
                'Trailer': 1,
                'Teaser': 2,
                'Clip': 3,
                'Opening Credits': 4,
                'Featurette': 5
            };
            const priorityA = typePriority[a.type] || 99;
            const priorityB = typePriority[b.type] || 99;
            return priorityA - priorityB;
        })[0];

    return (
        <div className="min-h-screen bg-primary flex flex-col pt-16">
            {/* Full Width Player Section */}
            <div className="w-full bg-black aspect-video md:aspect-[21/9] lg:h-[85vh] relative group">
                <div className="absolute top-4 left-4 z-20">
                    <Link to="/home" className="inline-flex items-center gap-2 text-white/80 hover:text-white bg-black/50 p-2 rounded-full backdrop-blur-sm transition-colors">
                        <ArrowLeft className="w-6 h-6" />
                    </Link>
                </div>

                {renderPlayer()}

                {/* Server Switcher Control */}
                {showPlayer && (
                    <div className="absolute top-4 right-4 z-20 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                        <button
                            onClick={() => setCurrentEmbedIndex((prev) => (prev + 1) % EMBED_DOMAINS.length)}
                            className="flex items-center gap-2 px-4 py-2 bg-black/70 hover:bg-secondary text-white rounded-lg backdrop-blur-sm border border-white/10 transition-all text-sm font-medium"
                        >
                            <span>Server {currentEmbedIndex + 1}</span>
                            <span className="text-gray-400">|</span>
                            <span className="text-accent hover:underline">Switch</span>
                        </button>
                    </div>
                )}
            </div>

            {/* Content Grid */}
            <div className="w-full px-4 md:px-8 py-8">
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 md:gap-12">

                    {/* Left Column: Details & Description (2/3 width) */}
                    <div className="lg:col-span-2 space-y-8">
                        <div>
                            <h1 className="text-3xl md:text-6xl font-bold text-white mb-4">{movie.title || movie.name}</h1>

                            <div className="flex flex-wrap items-center gap-4 text-gray-300 mb-6">
                                {(movie.release_date || movie.first_air_date) && (
                                    <span className="px-3 py-1 bg-secondary rounded-full text-sm font-medium border border-gray-700">
                                        {new Date(movie.release_date || movie.first_air_date || '').getFullYear()}
                                    </span>
                                )}
                                <span className="flex items-center gap-1 text-yellow-400 font-semibold">
                                    <Star className="w-4 h-4 fill-current" />
                                    {movie.vote_average.toFixed(1)}
                                </span>
                                {movie.runtime && (
                                    <span className="text-gray-400">{Math.floor(movie.runtime / 60)}h {movie.runtime % 60}m</span>
                                )}

                                {/* Add to List Dropdown */}
                                <div className="relative group z-10">
                                    <button className="flex items-center gap-2 px-4 py-2 bg-secondary/50 hover:bg-secondary rounded-full transition-all duration-300 border border-gray-700 text-sm md:text-base">
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

                            {/* Genres (if available) */}
                            {movie.genres && (
                                <div className="flex flex-wrap gap-2 mb-6">
                                    {movie.genres.map(g => (
                                        <span key={g.id} className="text-xs text-gray-400 border border-gray-700 px-2 py-1 rounded">{g.name}</span>
                                    ))}
                                </div>
                            )}


                            <p className="text-gray-300 text-base md:text-lg leading-relaxed">
                                {movie.overview}
                            </p>
                        </div>

                        {mediaType === 'tv' && (
                            <div className="p-6 bg-secondary/30 rounded-xl border border-gray-800">
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
                    </div>

                    {/* Right Column: Sidebar (Trailer, Cast, Recommendations) */}
                    <div className="space-y-8">
                        {/* Trailer Section (Sidebar on desktop) */}
                        {trailer && (
                            <div className="w-full lg:w-full flex-shrink-0">
                                <h3 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
                                    <Play className="w-5 h-5 text-red-500 fill-current" />
                                    Trailer
                                </h3>
                                <div className="aspect-video w-full rounded-xl overflow-hidden shadow-lg border border-gray-800 bg-black">
                                    <iframe
                                        src={`https://www.youtube.com/embed/${trailer.key}`}
                                        title="Trailer"
                                        className="w-full h-full"
                                        allowFullScreen
                                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                                    />
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {/* Main Cast Section - Center Aligned & Full Width */}
            {movie.credits && movie.credits.cast.length > 0 && (
                <div className="w-full px-4 md:px-12 py-12 bg-black/20">
                    <div className="max-w-7xl mx-auto text-center">
                        <h2 className="text-3xl font-bold text-white mb-8">Main Cast</h2>
                        <div className="flex flex-wrap justify-center gap-8">
                            {movie.credits.cast.slice(0, 10).map((actor) => (
                                <div key={actor.id} className="flex flex-col items-center group">
                                    <div className="w-24 h-24 md:w-32 md:h-32 rounded-full overflow-hidden border-2 border-gray-800 group-hover:border-accent transition-all duration-300 mb-3 shadow-lg">
                                        <img
                                            src={actor.profile_path
                                                ? `https://image.tmdb.org/t/p/w200${actor.profile_path}`
                                                : 'https://placehold.co/200x200/1e293b/ffffff?text=No+Image'}
                                            alt={actor.name}
                                            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                                        />
                                    </div>
                                    <h3 className="text-white font-medium text-sm md:text-base">{actor.name}</h3>
                                    <p className="text-gray-400 text-xs md:text-sm">{actor.character}</p>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            )}

            {/* Recommendations Section - Full Width Edge to Edge */}
            {movie.similar && movie.similar.results.length > 0 && (
                <div className="w-full py-12">
                    <div className="px-4 md:px-12 mb-6">
                        <h2 className="text-2xl font-bold text-white">You May Also Like</h2>
                    </div>

                    <div className="w-full overflow-x-auto pb-8 scrollbar-hide">
                        <div className="flex px-4 md:px-4 gap-4 min-w-max">
                            {movie.similar.results.map((similarMovie) => (
                                <Link
                                    to={`/${similarMovie.media_type || 'movie'}/${similarMovie.id}`}
                                    key={similarMovie.id}
                                    className="block group w-[160px] md:w-[240px] flex-shrink-0"
                                >
                                    <div className="aspect-[2/3] rounded-xl overflow-hidden relative mb-3 shadow-[0_0_15px_rgba(0,0,0,0.5)] border border-gray-800 group-hover:border-gray-600 transition-all">
                                        <img
                                            src={`https://image.tmdb.org/t/p/w400${similarMovie.poster_path}`}
                                            alt={similarMovie.title || similarMovie.name}
                                            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                                            loading="lazy"
                                        />
                                        <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center backdrop-blur-[2px]">
                                            <div className="w-12 h-12 rounded-full bg-accent/90 flex items-center justify-center shadow-lg transform scale-0 group-hover:scale-100 transition-transform duration-300">
                                                <Play className="w-6 h-6 text-primary fill-current ml-1" />
                                            </div>
                                        </div>
                                    </div>
                                    <h3 className="text-white font-medium truncate group-hover:text-accent transition-colors">
                                        {similarMovie.title || similarMovie.name}
                                    </h3>
                                    <div className="flex items-center gap-2 text-xs text-gray-400">
                                        <Star className="w-3 h-3 text-yellow-500 fill-current" />
                                        <span>{similarMovie.vote_average.toFixed(1)}</span>
                                        <span>•</span>
                                        <span>{new Date(similarMovie.release_date || similarMovie.first_air_date || Date.now()).getFullYear()}</span>
                                    </div>
                                </Link>
                            ))}
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default MovieDetails;
