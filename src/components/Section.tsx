import type { ReactNode } from 'react';

interface SectionProps {
    title: string;
    children: ReactNode;
}

const Section = ({ title, children }: SectionProps) => {
    return (
        <div className="py-8 px-4 md:px-12 max-w-[1920px] mx-auto">
            <h2 className="text-2xl font-bold text-white mb-6 border-l-4 border-accent pl-4">
                {title}
            </h2>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4 md:gap-6">
                {children}
            </div>
        </div>
    );
};

export default Section;
