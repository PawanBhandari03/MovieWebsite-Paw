import type { ReactNode } from 'react';

interface SectionProps {
    title: string;
    children: ReactNode;
}

const Section = ({ title, children }: SectionProps) => {
    return (
        <div className="py-8 px-4 md:px-12 max-w-7xl mx-auto">
            <h2 className="text-2xl font-bold text-white mb-6 border-l-4 border-accent pl-4">
                {title}
            </h2>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                {children}
            </div>
        </div>
    );
};

export default Section;
