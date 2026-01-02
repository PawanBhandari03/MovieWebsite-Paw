import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';

const genres = [
    { id: 28, name: "Action" },
    { id: 12, name: "Adventure" },
    { id: 16, name: "Animation" },
    { id: 35, name: "Comedy" },
    { id: 80, name: "Crime" },
    { id: 99, name: "Documentary" },
    { id: 18, name: "Drama" },
    { id: 10751, name: "Family" },
    { id: 14, name: "Fantasy" },
    { id: 36, name: "History" },
    { id: 27, name: "Horror" },
    { id: 10402, name: "Music" },
    { id: 9648, name: "Mystery" },
    { id: 10749, name: "Romance" },
    { id: 878, name: "Science Fiction" },
    { id: 10770, name: "TV Movie" },
    { id: 53, name: "Thriller" },
    { id: 10752, name: "War" },
    { id: 37, name: "Western" },
    { id: 10759, name: "Action & Adventure" },
    { id: 10762, name: "Kids" },
    { id: 10763, name: "News" },
    { id: 10764, name: "Reality" },
    { id: 10765, name: "Sci-Fi & Fantasy" },
    { id: 10766, name: "Soap" },
    { id: 10767, name: "Talk" },
    { id: 10768, name: "War & Politics" },
];

const Genres = () => {
    const navigate = useNavigate();

    return (
        <div className="pt-24 pb-20 min-h-screen bg-primary">
            <div className="max-w-7xl mx-auto px-4">
                <div className="text-center mb-16 space-y-4">
                    <h1 className="text-3xl md:text-5xl font-bold text-white">
                        Watch Movies and TV Series by category on Paw.
                    </h1>
                    <p className="text-gray-400 max-w-2xl mx-auto text-lg">
                        Watch variety of genres like Thriller, Rom-com, Mystery, Action, kdrama and more on Paw.
                        Browse categories and find the next great story that will capture your imagination.
                    </p>
                </div>

                <div className="flex flex-wrap justify-center gap-4 max-w-5xl mx-auto">
                    {genres.map((genre, index) => (
                        <motion.button
                            key={genre.id}
                            initial={{ opacity: 0, scale: 0.9 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ delay: index * 0.02 }}
                            onClick={() => navigate(`/search?genre=${genre.id}`)}
                            className="px-6 py-2 rounded-full border border-gray-700 bg-secondary/50 text-gray-300 hover:text-accent hover:border-accent transition-all duration-300 backdrop-blur-sm text-sm md:text-base font-medium"
                        >
                            {genre.name}
                        </motion.button>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default Genres;
