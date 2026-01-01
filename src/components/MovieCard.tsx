import { motion } from 'framer-motion';
import { Star, Play } from 'lucide-react';
import { Link } from 'react-router-dom';

interface MovieProps {
    id: string | number;
    title: string;
    image: string;
    rating: number;
    year: number;
    category: string;
}

const MovieCard = ({ id, title, image, rating, year, category }: MovieProps) => {
    return (
        <Link to={`/movie/${id}`} state={{ title, image, rating, year, category }}>
            <motion.div
                className="group relative h-[300px] md:h-[350px] rounded-xl overflow-hidden cursor-pointer"
                whileHover={{ scale: 1.05 }}
                transition={{ duration: 0.3 }}
            >
                <img
                    src={image}
                    alt={title}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                    onError={(e) => {
                        e.currentTarget.src = 'https://placehold.co/500x750/1e293b/ffffff?text=No+Image';
                    }}
                />

                <div className="absolute inset-0 bg-gradient-to-t from-primary via-transparent to-transparent opacity-80 group-hover:opacity-100 transition-opacity duration-300" />

                <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    <div className="w-12 h-12 rounded-full bg-accent/90 flex items-center justify-center shadow-[0_0_20px_rgba(56,189,248,0.5)]">
                        <Play className="w-5 h-5 text-primary fill-current ml-1" />
                    </div>
                </div>

                <div className="absolute bottom-0 left-0 w-full p-4 transform translate-y-2 group-hover:translate-y-0 transition-transform duration-300">
                    <div className="flex items-center gap-2 text-xs text-accent font-medium mb-1">
                        <span>{year}</span>
                        <span>•</span>
                        <span>{category}</span>
                    </div>
                    <h3 className="text-white font-bold text-lg leading-tight mb-1">{title}</h3>
                    <div className="flex items-center gap-1 text-yellow-400 text-sm">
                        <Star className="w-4 h-4 fill-current" />
                        <span>{rating > 0 ? rating : 'N/A'}</span>
                    </div>
                </div>
            </motion.div>
        </Link>
    );
};

export default MovieCard;
