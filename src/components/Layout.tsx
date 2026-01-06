import type { ReactNode } from 'react';
import Navbar from './Navbar';

interface LayoutProps {
    children: ReactNode;
}

import { useLocation } from 'react-router-dom';

const Layout = ({ children }: LayoutProps) => {
    const location = useLocation();
    const isLandingPage = location.pathname === '/';

    return (
        <div className="min-h-screen bg-primary text-white overflow-x-hidden">
            {!isLandingPage && <Navbar />}
            <main>
                {children}
            </main>
            {!isLandingPage && (
                <footer className="bg-secondary py-8 px-4 md:px-12 mt-20 border-t border-gray-800">
                    <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center text-gray-400 text-sm">
                        <div className="md:max-w-2xl text-center md:text-left mb-4 md:mb-0">
                            <p className="leading-relaxed">
                                Pawflix does not store any files on it's server. It only links to the media
                                which is hosted on 3rd party services like YouTube, Dailymotion, Ok.ru,
                                Vidsrc, Cineby, Streamtape and more.
                            </p>
                        </div>
                        <div className="text-center md:text-right">
                            <p>&copy; 2026 Pawflix. All rights not reserved.</p>
                        </div>
                    </div>
                </footer>
            )}
        </div>
    );
};

export default Layout;
