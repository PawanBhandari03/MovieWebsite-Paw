import { useState } from 'react';
import { User, Settings, LogOut, ChevronDown, ChevronUp, Save, Bell, Play } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';

const Profile = () => {
    const { user, logout, updateUser, deleteAccount } = useAuth();
    const navigate = useNavigate();
    const [activeSection, setActiveSection] = useState<'details' | 'settings' | null>(null);

    // Edit Form State
    const [name, setName] = useState(user?.name || '');
    const [bio, setBio] = useState(user?.bio || '');
    const [isEditing, setIsEditing] = useState(false);

    // Settings State
    const [notifications, setNotifications] = useState(true);
    const [autoplay, setAutoplay] = useState(true);

    const handleLogout = () => {
        logout();
        navigate('/');
    };

    const handleSaveProfile = () => {
        updateUser({ name, bio });
        setIsEditing(false);
    };

    const toggleSection = (section: 'details' | 'settings') => {
        setActiveSection(activeSection === section ? null : section);
    };

    if (!user) return null;

    return (
        <div className="pt-24 pb-20 min-h-screen bg-primary flex justify-center">
            <div className="w-full max-w-2xl px-4">
                <h1 className="text-3xl font-bold text-white mb-8">My Profile</h1>

                <div className="bg-secondary/50 backdrop-blur-sm rounded-xl p-8 border border-gray-800">
                    {/* Header */}
                    <div className="flex items-center gap-6 mb-8">
                        <div className="w-20 h-20 rounded-full bg-gradient-to-br from-accent to-purple-600 flex items-center justify-center text-3xl font-bold text-white">
                            {user.name.charAt(0).toUpperCase()}
                        </div>
                        <div>
                            <h2 className="text-2xl font-bold text-white">{user.name}</h2>
                            <p className="text-gray-400">{user.email}</p>
                            {user.bio && <p className="text-gray-300 text-sm mt-2 italic">"{user.bio}"</p>}
                            <div className="mt-2 inline-block px-3 py-1 bg-accent/20 text-accent rounded-full text-xs font-medium">
                                Premium Member
                            </div>
                        </div>
                    </div>

                    <div className="space-y-4">
                        {/* Account Details Section */}
                        <div className="bg-primary/50 rounded-lg overflow-hidden transition-all duration-300">
                            <button
                                onClick={() => toggleSection('details')}
                                className="w-full flex items-center justify-between p-4 hover:bg-primary/80 transition-colors"
                            >
                                <div className="flex items-center gap-4">
                                    <div className="p-2 bg-gray-800 rounded-lg">
                                        <User className="w-5 h-5 text-gray-300" />
                                    </div>
                                    <span className="text-gray-200 font-medium">Account Details</span>
                                </div>
                                {activeSection === 'details' ? <ChevronUp className="w-4 h-4 text-gray-400" /> : <ChevronDown className="w-4 h-4 text-gray-400" />}
                            </button>

                            <AnimatePresence>
                                {activeSection === 'details' && (
                                    <motion.div
                                        initial={{ height: 0, opacity: 0 }}
                                        animate={{ height: 'auto', opacity: 1 }}
                                        exit={{ height: 0, opacity: 0 }}
                                        className="border-t border-gray-800"
                                    >
                                        <div className="p-4 space-y-4">
                                            <div className="space-y-2">
                                                <label className="text-sm text-gray-400">Full Name</label>
                                                <input
                                                    type="text"
                                                    value={name}
                                                    onChange={(e) => { setName(e.target.value); setIsEditing(true); }}
                                                    className="w-full bg-black/20 border border-gray-700 rounded-lg py-2 px-4 text-white focus:border-accent outline-none"
                                                />
                                            </div>
                                            <div className="space-y-2">
                                                <label className="text-sm text-gray-400">Bio</label>
                                                <textarea
                                                    value={bio}
                                                    onChange={(e) => { setBio(e.target.value); setIsEditing(true); }}
                                                    className="w-full bg-black/20 border border-gray-700 rounded-lg py-2 px-4 text-white focus:border-accent outline-none min-h-[80px]"
                                                    placeholder="Tell us about yourself..."
                                                />
                                            </div>
                                            <div className="space-y-2">
                                                <label className="text-sm text-gray-400">Email (Read-only)</label>
                                                <input
                                                    type="text"
                                                    value={user.email}
                                                    disabled
                                                    className="w-full bg-black/40 border border-gray-800 rounded-lg py-2 px-4 text-gray-500 cursor-not-allowed"
                                                />
                                            </div>
                                            {isEditing && (
                                                <button
                                                    onClick={handleSaveProfile}
                                                    className="flex items-center gap-2 px-4 py-2 bg-accent hover:bg-accent/80 text-white rounded-lg text-sm font-medium transition-colors ml-auto"
                                                >
                                                    <Save className="w-4 h-4" />
                                                    Save Changes
                                                </button>
                                            )}
                                        </div>
                                    </motion.div>
                                )}
                            </AnimatePresence>
                        </div>

                        {/* Settings Section */}
                        <div className="bg-primary/50 rounded-lg overflow-hidden transition-all duration-300">
                            <button
                                onClick={() => toggleSection('settings')}
                                className="w-full flex items-center justify-between p-4 hover:bg-primary/80 transition-colors"
                            >
                                <div className="flex items-center gap-4">
                                    <div className="p-2 bg-gray-800 rounded-lg">
                                        <Settings className="w-5 h-5 text-gray-300" />
                                    </div>
                                    <span className="text-gray-200 font-medium">Settings</span>
                                </div>
                                {activeSection === 'settings' ? <ChevronUp className="w-4 h-4 text-gray-400" /> : <ChevronDown className="w-4 h-4 text-gray-400" />}
                            </button>

                            <AnimatePresence>
                                {activeSection === 'settings' && (
                                    <motion.div
                                        initial={{ height: 0, opacity: 0 }}
                                        animate={{ height: 'auto', opacity: 1 }}
                                        exit={{ height: 0, opacity: 0 }}
                                        className="border-t border-gray-800"
                                    >
                                        <div className="p-4 space-y-4">
                                            <div className="flex items-center justify-between">
                                                <div className="flex items-center gap-3">
                                                    <Bell className="w-4 h-4 text-gray-400" />
                                                    <span className="text-gray-300">Email Notifications</span>
                                                </div>
                                                <button
                                                    onClick={() => setNotifications(!notifications)}
                                                    className={`w-10 h-5 rounded-full relative transition-colors ${notifications ? 'bg-accent' : 'bg-gray-700'}`}
                                                >
                                                    <div className={`absolute top-1 w-3 h-3 rounded-full bg-white transition-all ${notifications ? 'left-6' : 'left-1'}`} />
                                                </button>
                                            </div>
                                            <div className="flex items-center justify-between">
                                                <div className="flex items-center gap-3">
                                                    <Play className="w-4 h-4 text-gray-400" />
                                                    <span className="text-gray-300">Autoplay Trailers</span>
                                                </div>
                                                <button
                                                    onClick={() => setAutoplay(!autoplay)}
                                                    className={`w-10 h-5 rounded-full relative transition-colors ${autoplay ? 'bg-accent' : 'bg-gray-700'}`}
                                                >
                                                    <div className={`absolute top-1 w-3 h-3 rounded-full bg-white transition-all ${autoplay ? 'left-6' : 'left-1'}`} />
                                                </button>
                                            </div>
                                        </div>
                                    </motion.div>
                                )}
                            </AnimatePresence>
                        </div>

                        {/* Sign Out Button */}
                        <button
                            onClick={handleLogout}
                            className="w-full flex items-center justify-between p-4 bg-red-500/10 rounded-lg hover:bg-red-500/20 transition-colors group mt-8"
                        >
                            <div className="flex items-center gap-4">
                                <div className="p-2 bg-red-500/20 rounded-lg group-hover:bg-red-500/30 transition-colors">
                                    <LogOut className="w-5 h-5 text-red-400" />
                                </div>
                                <span className="text-red-400 font-medium">Sign Out</span>
                            </div>
                        </button>

                        {/* Delete Account Button */}
                        <button
                            onClick={() => {
                                if (window.confirm('Are you sure you want to delete your account? This action cannot be undone and will delete all your data.')) {
                                    deleteAccount();
                                    navigate('/');
                                }
                            }}
                            className="w-full flex items-center justify-between p-4 bg-red-500/10 rounded-lg hover:bg-red-500/20 transition-colors group mt-4 border border-red-500/20"
                        >
                            <div className="flex items-center gap-4">
                                <div className="p-2 bg-red-500/20 rounded-lg group-hover:bg-red-500/30 transition-colors">
                                    <LogOut className="w-5 h-5 text-red-500" />
                                </div>
                                <span className="text-red-500 font-medium">Delete Account</span>
                            </div>
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Profile;
