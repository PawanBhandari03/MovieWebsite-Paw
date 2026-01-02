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
                        <p>&copy; 2024 Cinema App. All rights reserved.</p>
                        <div className="flex space-x-6 mt-4 md:mt-0">
                            <a href="#" className="hover:text-white transition-colors">Privacy Policy</a>
                            <a href="#" className="hover:text-white transition-colors">Terms of Service</a>
                        </div>
                    </div>
                </footer>
            )}
        </div>
    );
};

export default Layout;
