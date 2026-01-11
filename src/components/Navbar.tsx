import { useState, useEffect, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Search, User, Menu, X, PawPrint, Bookmark } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '../lib/utils';
import { useAuth } from '../context/AuthContext';
import { searchMovies, getImageUrl, type TMDBMovie } from '../services/tmdb';

const Navbar = () => {
    const { isLoggedIn } = useAuth();
    const [isScrolled, setIsScrolled] = useState(false);
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const [isSearchOpen, setIsSearchOpen] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');
    const [recommendations, setRecommendations] = useState<TMDBMovie[]>([]);
    const [showRecommendations, setShowRecommendations] = useState(false);

    const navigate = useNavigate();
    const searchInputRef = useRef<HTMLInputElement>(null);

    useEffect(() => {
        const handleScroll = () => {
            if (window.scrollY > 0) {
                setIsScrolled(true);
            } else {
                setIsScrolled(false);
            }
        };

        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    useEffect(() => {
        if (isSearchOpen && searchInputRef.current) {
            searchInputRef.current.focus();
        }
    }, [isSearchOpen]);

    useEffect(() => {
        const fetchRecommendations = async () => {
            if (searchQuery.trim().length >= 2) {
                try {
                    const response = await searchMovies(searchQuery);
                    setRecommendations(response.results.slice(0, 5)); // Limit to 5 results
                    setShowRecommendations(true);
                } catch (error) {
                    console.error("Error fetching recommendations:", error);
                }
            } else {
                setRecommendations([]);
                setShowRecommendations(false);
            }
        };

        const timeoutId = setTimeout(fetchRecommendations, 300); // Debounce
        return () => clearTimeout(timeoutId);
    }, [searchQuery]);

    const handleSearchSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (searchQuery.trim()) {
            navigate(`/search?q=${encodeURIComponent(searchQuery)}`);
            setIsSearchOpen(false);
            setSearchQuery('');
            setShowRecommendations(false);
        }
    };

    const handleRecommendationClick = (id: number) => {
        navigate(`/movie/${id}`);
        setIsSearchOpen(false);
        setSearchQuery('');
        setShowRecommendations(false);
    };

    const navLinks = [
        { name: 'Home', path: '/home' },
        { name: 'Movies', path: '/movies' },
        { name: 'Anime', path: '/anime' },
        { name: 'Web Series', path: '/web-series' },
        { name: 'Dramas', path: '/dramas' },
        { name: 'Genres', path: '/genres' },
    ];

    return (
        <nav
            className={cn(
                "fixed top-0 w-full z-50 transition-all duration-300 ease-in-out px-4 md:px-12 py-6",
                isScrolled ? "bg-primary/80 backdrop-blur-md shadow-lg" : "bg-transparent"
            )}
        >
            <div className="flex items-center justify-between max-w-[1920px] mx-auto">
                {/* Logo */}
                <Link to="/home" className="flex items-center gap-3 text-3xl md:text-4xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-accent to-purple-500">
                    <PawPrint className="w-10 h-10 md:w-12 md:h-12 text-accent" />
                    <span>PawFlix</span>
                </Link>

                {/* Desktop Navigation */}
                <div className="hidden md:flex items-center space-x-8">
                    {navLinks.map((link) => (
                        <Link
                            key={link.name}
                            to={link.path}
                            className="text-gray-300 hover:text-white transition-colors text-lg font-medium relative group"
                        >
                            {link.name}
                            <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-accent transition-all duration-300 group-hover:w-full" />
                        </Link>
                    ))}
                </div>

                {/* Icons */}
                <div className="hidden md:flex items-center space-x-6 relative">
                    {/* Search Bar */}
                    <div className="flex items-center relative">
                        <AnimatePresence>
                            {(isSearchOpen || (window.innerWidth < 768 && isSearchOpen)) && (
                                <motion.div
                                    initial={{ width: 0, opacity: 0 }}
                                    animate={{ width: window.innerWidth < 768 ? '200px' : '300px', opacity: 1 }}
                                    exit={{ width: 0, opacity: 0 }}
                                    className="mr-2 relative"
                                >
                                    <form onSubmit={handleSearchSubmit}>
                                        <input
                                            ref={searchInputRef}
                                            type="text"
                                            placeholder="Search..."
                                            value={searchQuery}
                                            onChange={(e) => setSearchQuery(e.target.value)}
                                            className="w-full bg-secondary/90 border border-gray-600 rounded-full px-4 py-1 text-sm text-white focus:outline-none focus:border-accent"
                                        />
                                    </form>

                                    {/* Recommendations Dropdown */}
                                    {showRecommendations && recommendations.length > 0 && (
                                        <motion.div
                                            initial={{ opacity: 0, y: 10 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            exit={{ opacity: 0, y: 10 }}
                                            transition={{ duration: 0.2 }}
                                            className="absolute top-full left-0 w-full bg-secondary/95 backdrop-blur-xl border border-gray-800 rounded-xl mt-2 overflow-hidden shadow-2xl z-50 max-h-[60vh] overflow-y-auto"
                                        >
                                            {recommendations.map((movie, index) => (
                                                <motion.div
                                                    key={movie.id}
                                                    initial={{ opacity: 0, x: -10 }}
                                                    animate={{ opacity: 1, x: 0 }}
                                                    transition={{ delay: index * 0.05 }}
                                                    onClick={() => handleRecommendationClick(movie.id)}
                                                    className="flex items-center gap-3 p-3 hover:bg-white/10 cursor-pointer transition-colors border-b border-gray-700/50 last:border-0"
                                                >
                                                    <img
                                                        src={getImageUrl(movie.poster_path, 'w92')}
                                                        alt={movie.title}
                                                        className="w-10 h-14 object-cover rounded"
                                                    />
                                                    <div>
                                                        <p className="text-sm font-medium text-white line-clamp-1">{movie.title}</p>
                                                        <p className="text-xs text-gray-400">{movie.release_date?.split('-')[0] || 'N/A'}</p>
                                                    </div>
                                                </motion.div>
                                            ))}
                                        </motion.div>
                                    )}
                                </motion.div>
                            )}
                        </AnimatePresence>
                        <Search
                            className="w-5 h-5 text-gray-300 hover:text-white cursor-pointer transition-colors"
                            onClick={() => setIsSearchOpen(!isSearchOpen)}
                        />
                    </div>




                    {/* My List */}
                    <Link to="/mylist" className="flex items-center gap-2 text-gray-300 hover:text-white transition-colors group">
                        <Bookmark className="w-6 h-6 group-hover:fill-accent group-hover:text-accent transition-colors" />
                        <span className="text-lg font-medium hidden lg:block">My List</span>
                    </Link>

                    {/* Profile */}
                    <Link to={isLoggedIn ? "/profile" : "/auth"}>
                        <div className="w-8 h-8 rounded-full bg-gradient-to-br from-gray-700 to-gray-900 flex items-center justify-center border border-gray-600 cursor-pointer hover:border-accent transition-colors">
                            <User className="w-4 h-4 text-gray-300" />
                        </div>
                    </Link>
                </div>

                {/* Mobile Icons & Menu Button */}
                <div className="flex md:hidden items-center space-x-4">
                    {/* Mobile Search */}
                    {/* Mobile Search */}
                    <div className="flex items-center">
                        <AnimatePresence>
                            {isSearchOpen && (
                                <motion.div
                                    initial={{ opacity: 0, y: -10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    exit={{ opacity: 0, y: -10 }}
                                    transition={{ duration: 0.2 }}
                                    className="absolute inset-x-0 top-full mt-2 left-0 right-0 px-4 bg-primary/95 backdrop-blur-md py-4 border-b border-white/10 shadow-2xl md:hidden"
                                >
                                    <form onSubmit={handleSearchSubmit}>
                                        <input
                                            ref={searchInputRef}
                                            type="text"
                                            placeholder="Search movies, shows..."
                                            value={searchQuery}
                                            onChange={(e) => setSearchQuery(e.target.value)}
                                            className="w-full bg-secondary border border-gray-600 rounded-xl px-4 py-3 text-base text-white focus:outline-none focus:border-accent shadow-inner"
                                            autoFocus
                                        />
                                    </form>

                                    {/* Recommendations Dropdown Mobile */}
                                    {showRecommendations && recommendations.length > 0 && (
                                        <div className="mt-4 flex flex-col gap-2 max-h-[60vh] overflow-y-auto">
                                            {recommendations.map((movie) => (
                                                <div
                                                    key={movie.id}
                                                    onClick={() => handleRecommendationClick(movie.id)}
                                                    className="flex items-center gap-3 p-2 rounded-lg hover:bg-white/5 active:bg-white/10 transition-colors cursor-pointer"
                                                >
                                                    <img
                                                        src={getImageUrl(movie.poster_path, 'w92')}
                                                        alt={movie.title}
                                                        className="w-10 h-14 object-cover rounded-md flex-shrink-0"
                                                    />
                                                    <div className="flex-1 min-w-0">
                                                        <h4 className="text-sm font-medium text-white truncate">{movie.title}</h4>
                                                        <p className="text-xs text-gray-400">{movie.release_date?.split('-')[0] || 'N/A'}</p>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    )}
                                </motion.div>
                            )}
                        </AnimatePresence>
                        <Search
                            className="w-6 h-6 text-gray-300 active:scale-95 transition-transform"
                            onClick={() => setIsSearchOpen(!isSearchOpen)}
                        />
                    </div>

                    <button
                        className="text-white"
                        onClick={() => setIsMobileMenuOpen(true)}
                    >
                        <Menu className="w-6 h-6" />
                    </button>
                </div>
            </div>



            {/* Mobile Menu Overlay */}
            <AnimatePresence>
                {isMobileMenuOpen && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 z-[60] bg-black/60 backdrop-blur-sm md:hidden"
                        onClick={() => setIsMobileMenuOpen(false)}
                    >
                        <motion.div
                            initial={{ x: '100%' }}
                            animate={{ x: 0 }}
                            exit={{ x: '100%' }}
                            transition={{ type: "spring", damping: 25, stiffness: 200 }}
                            className="absolute right-0 top-0 h-full w-[80%] max-w-sm bg-secondary border-l border-gray-800 shadow-2xl p-6 flex flex-col"
                            onClick={(e) => e.stopPropagation()}
                        >
                            <div className="flex justify-between items-center mb-8">
                                <span className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-accent to-purple-500">
                                    Menu
                                </span>
                                <button
                                    onClick={() => setIsMobileMenuOpen(false)}
                                    className="p-2 hover:bg-white/10 rounded-full transition-colors"
                                >
                                    <X className="w-6 h-6 text-gray-400" />
                                </button>
                            </div>

                            <div className="flex flex-col space-y-6">
                                {navLinks.filter(link => link.name !== 'My List').map((link) => (
                                    <Link
                                        key={link.name}
                                        to={link.path}
                                        className="text-gray-300 hover:text-white text-xl font-medium transition-colors flex items-center justify-between group"
                                        onClick={() => setIsMobileMenuOpen(false)}
                                    >
                                        {link.name}
                                        <span className="opacity-0 group-hover:opacity-100 text-accent transition-opacity">→</span>
                                    </Link>
                                ))}
                            </div>

                            <div className="mt-8 pt-8 border-t border-gray-800">
                                <p className="text-sm text-gray-500 font-semibold mb-4 uppercase tracking-wider">Your Lists</p>
                                <div className="flex flex-col space-y-4">
                                    <Link to="/mylist" className="text-gray-400 hover:text-white transition-colors" onClick={() => setIsMobileMenuOpen(false)}>
                                        Watch List
                                    </Link>
                                    <Link to={isLoggedIn ? "/profile" : "/auth"} className="text-gray-400 hover:text-white transition-colors" onClick={() => setIsMobileMenuOpen(false)}>
                                        {isLoggedIn ? "Profile" : "Sign In"}
                                    </Link>
                                </div>
                            </div>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </nav>
    );
};

export default Navbar;
