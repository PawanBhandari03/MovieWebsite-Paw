import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useList, type ListType } from '../context/ListContext';

import { motion, AnimatePresence } from 'framer-motion';
import { Link, useNavigate } from 'react-router-dom';
import { Star, X } from 'lucide-react';

const MyList = () => {
    const { isLoggedIn } = useAuth();
    const { lists, removeFromList } = useList();
    const navigate = useNavigate();
    const [activeTab, setActiveTab] = useState<ListType>('watching');

    const tabs: { id: ListType; label: string }[] = [
        { id: 'watched', label: 'Watched' },
        { id: 'watching', label: 'Watching' },
        { id: 'pending', label: 'Pending' },
        { id: 'favourites', label: 'Favourites' },
    ];

    if (!isLoggedIn) {
        return (
            <div className="pt-24 pb-20 min-h-screen bg-primary flex items-center justify-center">
                <div className="text-center p-8 bg-secondary/50 backdrop-blur-md rounded-2xl border border-gray-800 max-w-md w-full mx-4">
                    <h2 className="text-2xl font-bold mb-4 text-white">Login Required</h2>
                    <p className="text-gray-400 mb-6">Please login to access your personal list and track your favorite movies and shows.</p>
                    <button
                        onClick={() => navigate('/auth')}
                        className="px-6 py-3 bg-accent hover:bg-accent/80 text-white rounded-full font-semibold transition-all duration-300 shadow-lg hover:shadow-accent/20"
                    >
                        Login to use this part
                    </button>
                </div>
            </div>
        );
    }

    const currentList = lists[activeTab];

    return (
        <div className="pt-24 pb-20 min-h-screen bg-primary">
            <div className="max-w-7xl mx-auto px-4 md:px-12">
                <h1 className="text-3xl font-bold text-white mb-8">My List</h1>

                {/* Tabs */}
                <div className="flex flex-wrap gap-4 mb-8 border-b border-gray-800 pb-4">
                    {tabs.map((tab) => (
                        <button
                            key={tab.id}
                            onClick={() => setActiveTab(tab.id)}
                            className={`px-4 py-2 rounded-full text-sm font-medium transition-all duration-300 relative ${activeTab === tab.id ? 'text-white' : 'text-gray-400 hover:text-white'
                                }`}
                        >
                            {tab.label}
                            {activeTab === tab.id && (
                                <motion.div
                                    layoutId="activeTab"
                                    className="absolute inset-0 bg-white/10 rounded-full"
                                    transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                                />
                            )}
                        </button>
                    ))}
                </div>

                {/* Content */}
                <AnimatePresence mode="wait">
                    <motion.div
                        key={activeTab}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -20 }}
                        transition={{ duration: 0.2 }}
                    >
                        <div className="mt-8">
                            {currentList.length === 0 ? (
                                <div className="text-center text-gray-400 py-12 bg-secondary/30 rounded-xl border border-gray-800/50">
                                    <h3 className="text-xl font-semibold mb-2">No items in {tabs.find(t => t.id === activeTab)?.label}</h3>
                                    <p>Start adding content to this section!</p>
                                </div>
                            ) : (
                                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                                    {currentList.map((item) => (
                                        <div key={item.id} className="relative group">
                                            <Link to={`/movie/${item.id}`} state={{ category: item.media_type === 'tv' ? 'TV Show' : 'Movie' }}>
                                                <div className="aspect-video rounded-xl overflow-hidden mb-2 relative">
                                                    <img
                                                        src={`https://image.tmdb.org/t/p/w500${item.poster_path}`}
                                                        alt={item.title}
                                                        className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
                                                    />
                                                    <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                                                        <div className="flex items-center gap-1 text-yellow-400 font-bold">
                                                            <Star className="w-5 h-5 fill-current" />
                                                            {item.vote_average.toFixed(1)}
                                                        </div>
                                                    </div>
                                                </div>
                                                <h3 className="text-white font-medium truncate group-hover:text-accent transition-colors">{item.title}</h3>
                                            </Link>
                                            <button
                                                onClick={(e) => {
                                                    e.preventDefault();
                                                    removeFromList(item.id, activeTab);
                                                }}
                                                className="absolute top-2 right-2 p-1.5 bg-black/50 hover:bg-red-500/80 text-white rounded-full opacity-0 group-hover:opacity-100 transition-all duration-300 backdrop-blur-sm"
                                                title="Remove from list"
                                            >
                                                <X className="w-4 h-4" />
                                            </button>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    </motion.div>
                </AnimatePresence>
            </div>
        </div>
    );
};

export default MyList;
