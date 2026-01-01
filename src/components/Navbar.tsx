import { useState, useEffect, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Search, Bell, User, Menu, X, PawPrint } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '../lib/utils';
import { useAuth } from '../context/AuthContext';

const Navbar = () => {
    const { isLoggedIn } = useAuth();
    const [isScrolled, setIsScrolled] = useState(false);
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const [isSearchOpen, setIsSearchOpen] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');
    const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);

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

    const handleSearchSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (searchQuery.trim()) {
            navigate(`/search?q=${encodeURIComponent(searchQuery)}`);
            setIsSearchOpen(false);
            setSearchQuery('');
        }
    };

    const notifications = [
        { id: 1, text: "New movie 'The Gentleman' added!", time: "2m ago" },
        { id: 2, text: "Your subscription expires in 3 days", time: "1h ago" },
        { id: 3, text: "Top 10 movies of the week", time: "5h ago" },
    ];

    const navLinks = [
        { name: 'Home', path: '/' },
        { name: 'Movies', path: '/movies' },
        { name: 'Anime', path: '/anime' },

        { name: 'My List', path: '/mylist' },
    ];

    return (
        <nav
            className={cn(
                "fixed top-0 w-full z-50 transition-all duration-300 ease-in-out px-4 md:px-12 py-4",
                isScrolled ? "bg-primary/80 backdrop-blur-md shadow-lg" : "bg-transparent"
            )}
        >
            <div className="flex items-center justify-between max-w-7xl mx-auto">
                {/* Logo */}
                <Link to="/" className="flex items-center gap-2 text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-accent to-purple-500">
                    <PawPrint className="w-8 h-8 text-accent" />
                    <span>Paw</span>
                </Link>

                {/* Desktop Navigation */}
                <div className="hidden md:flex items-center space-x-8">
                    {navLinks.map((link) => (
                        <Link
                            key={link.name}
                            to={link.path}
                            className="text-gray-300 hover:text-white transition-colors text-sm font-medium relative group"
                        >
                            {link.name}
                            <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-accent transition-all duration-300 group-hover:w-full" />
                        </Link>
                    ))}
                </div>

                {/* Icons */}
                <div className="hidden md:flex items-center space-x-6 relative">
                    {/* Search Bar */}
                    <div className="flex items-center">
                        <AnimatePresence>
                            {isSearchOpen && (
                                <motion.form
                                    initial={{ width: 0, opacity: 0 }}
                                    animate={{ width: 200, opacity: 1 }}
                                    exit={{ width: 0, opacity: 0 }}
                                    onSubmit={handleSearchSubmit}
                                    className="mr-2 overflow-hidden"
                                >
                                    <input
                                        ref={searchInputRef}
                                        type="text"
                                        placeholder="Titles, people, genres"
                                        value={searchQuery}
                                        onChange={(e) => setSearchQuery(e.target.value)}
                                        className="w-full bg-secondary/50 border border-gray-600 rounded-full px-4 py-1 text-sm text-white focus:outline-none focus:border-accent"
                                    />
                                </motion.form>
                            )}
                        </AnimatePresence>
                        <Search
                            className="w-5 h-5 text-gray-300 hover:text-white cursor-pointer transition-colors"
                            onClick={() => setIsSearchOpen(!isSearchOpen)}
                        />
                    </div>

                    {/* Notifications */}
                    <div className="relative">
                        <Bell
                            className="w-5 h-5 text-gray-300 hover:text-white cursor-pointer transition-colors"
                            onClick={() => setIsNotificationsOpen(!isNotificationsOpen)}
                        />
                        {/* Notification Dropdown */}
                        <AnimatePresence>
                            {isNotificationsOpen && (
                                <motion.div
                                    initial={{ opacity: 0, y: 10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    exit={{ opacity: 0, y: 10 }}
                                    className="absolute right-0 top-full mt-4 w-80 bg-secondary/95 backdrop-blur-xl border border-gray-800 rounded-xl shadow-2xl overflow-hidden"
                                >
                                    <div className="p-4 border-b border-gray-800">
                                        <h3 className="text-white font-semibold">Notifications</h3>
                                    </div>
                                    <div className="max-h-64 overflow-y-auto">
                                        {notifications.map((notif) => (
                                            <div key={notif.id} className="p-4 hover:bg-white/5 transition-colors border-b border-gray-800/50 last:border-0 cursor-pointer">
                                                <p className="text-sm text-gray-200">{notif.text}</p>
                                                <p className="text-xs text-gray-500 mt-1">{notif.time}</p>
                                            </div>
                                        ))}
                                    </div>
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </div>

                    {/* Profile */}
                    <Link to={isLoggedIn ? "/profile" : "/auth"}>
                        <div className="w-8 h-8 rounded-full bg-gradient-to-br from-gray-700 to-gray-900 flex items-center justify-center border border-gray-600 cursor-pointer hover:border-accent transition-colors">
                            <User className="w-4 h-4 text-gray-300" />
                        </div>
                    </Link>
                </div>

                {/* Mobile Menu Button */}
                <button
                    className="md:hidden text-white"
                    onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                >
                    {isMobileMenuOpen ? <X /> : <Menu />}
                </button>
            </div>

            {/* Mobile Menu */}
            <AnimatePresence>
                {isMobileMenuOpen && (
                    <motion.div
                        initial={{ opacity: 0, y: -20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -20 }}
                        className="absolute top-full left-0 w-full bg-secondary/95 backdrop-blur-xl p-6 md:hidden flex flex-col space-y-4 border-b border-gray-800"
                    >
                        {navLinks.map((link) => (
                            <Link
                                key={link.name}
                                to={link.path}
                                className="text-gray-300 hover:text-white text-lg font-medium"
                                onClick={() => setIsMobileMenuOpen(false)}
                            >
                                {link.name}
                            </Link>
                        ))}
                    </motion.div>
                )}
            </AnimatePresence>
        </nav>
    );
};

export default Navbar;
