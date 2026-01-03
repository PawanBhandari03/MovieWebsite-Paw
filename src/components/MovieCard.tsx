
import { Star, Play } from 'lucide-react';
import { Link } from 'react-router-dom';

interface MovieProps {
    id: string | number;
    title: string;
    image: string;
    rating: number;
    year: number;
    category: string;
    mediaType?: 'movie' | 'tv';
}

const GENRES: { [key: number]: string } = {
    28: 'Action', 12: 'Adventure', 16: 'Animation', 35: 'Comedy', 80: 'Crime',
    99: 'Documentary', 18: 'Drama', 10751: 'Family', 14: 'Fantasy', 36: 'History',
    27: 'Horror', 10402: 'Music', 9648: 'Mystery', 10749: 'Romance', 878: 'Sci-Fi',
    10770: 'TV Movie', 53: 'Thriller', 10752: 'War', 37: 'Western'
};

interface MovieProps {
    id: string | number;
    title: string;
    image: string;
    rating: number;
    year: number;
    category: string;
    mediaType?: 'movie' | 'tv';
    overview?: string;
    genreIds?: number[];
}

const MovieCard = ({ id, title, image, rating, year, category, mediaType, overview, genreIds }: MovieProps) => {
    const linkPath = mediaType === 'tv' ? `/tv/${id}` : `/movie/${id}`;
    const genres = genreIds?.slice(0, 3).map(id => GENRES[id]).filter(Boolean).join(' • ');

    return (
        <Link to={linkPath} state={{ title, image, rating, year, category, mediaType }}>
            <div className="group relative h-[300px] md:h-[350px] w-full rounded-xl overflow-hidden cursor-pointer transition-all duration-300 hover:scale-[1.02] hover:shadow-xl hover:shadow-primary/50 z-10 hover:z-20 border border-transparent hover:border-gray-700">
                {/* Main Image */}
                <img
                    src={image}
                    alt={title}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                    loading="lazy"
                    onError={(e) => {
                        e.currentTarget.src = 'https://placehold.co/500x750/1e293b/ffffff?text=No+Image';
                    }}
                />

                {/* Default Gradient Overlay - Always visible at bottom for Title */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent opacity-80 group-hover:opacity-90 transition-opacity duration-300" />

                {/* Unhovered Content (Title, Rating, Year) */}
                <div className="absolute bottom-0 left-0 w-full p-4 transition-transform duration-300 transform group-hover:-translate-y-2">
                    <div className="flex items-center gap-2 text-xs text-accent font-medium mb-1 opacity-100 group-hover:opacity-0 transition-opacity duration-200 absolute -top-4">
                        <span>{year}</span>
                    </div>

                    <h3 className="text-white font-bold text-lg leading-tight mb-1 relative z-10 group-hover:text-accent transition-colors">
                        {title}
                    </h3>

                    <div className="flex items-center gap-2 text-yellow-400 text-sm group-hover:hidden">
                        <Star className="w-4 h-4 fill-current" />
                        <span>{rating > 0 ? rating.toFixed(1) : 'N/A'}</span>
                    </div>
                </div>

                {/* Hover Overlay Content - Appears/Slides up on hover */}
                <div className="absolute inset-0 flex flex-col justify-end p-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300 bg-black/60 backdrop-blur-[2px]">

                    {/* Play Button - Centered */}
                    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 transform scale-50 group-hover:scale-100 transition-transform duration-300 delay-75">
                        <div className="w-12 h-12 rounded-full bg-accent/90 flex items-center justify-center shadow-[0_0_20px_rgba(56,189,248,0.5)]">
                            <Play className="w-5 h-5 text-primary fill-current ml-1" />
                        </div>
                    </div>

                    {/* Detailed Info (Moves up slightly) */}
                    <div className="translate-y-4 group-hover:translate-y-0 transition-transform duration-300">
                        {/* Header Row */}
                        <div className="flex items-center justify-between mb-2">
                            <div className="flex items-center gap-2 text-green-400 font-bold text-xs">
                                <span>{rating.toFixed(1)} Match</span>
                                <span className="px-1.5 py-0.5 border border-gray-500 rounded text-gray-300 font-normal">{year}</span>
                            </div>
                            <div className="flex gap-2">
                                <button className="p-1.5 rounded-full border border-gray-400 hover:bg-white hover:text-black hover:border-white text-gray-300 transition-colors">
                                    <Star className="w-3 h-3" />
                                </button>
                            </div>
                        </div>

                        {/* Genres */}
                        {genres && (
                            <div className="text-xs text-gray-300 mb-2 font-medium line-clamp-1">
                                {genres}
                            </div>
                        )}

                        {/* Overview */}
                        {overview && (
                            <p className="text-[11px] text-gray-400 line-clamp-3 leading-relaxed">
                                {overview}
                            </p>
                        )}
                    </div>
                </div>
            </div>
        </Link>
    );
};

export default MovieCard;
