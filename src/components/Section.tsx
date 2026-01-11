import type { ReactNode } from 'react';

interface SectionProps {
    title: string;
    children: ReactNode;
}

const Section = ({ title, children }: SectionProps) => {
    return (
        <div className="py-8 px-4 md:px-12 max-w-[1920px] mx-auto">
            <div className="flex items-center gap-4 mb-6">
                <div className="h-8 w-1.5 bg-accent rounded-full" />
                <h2 className="text-2xl md:text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-accent to-purple-500 uppercase tracking-wide">
                    {title}
                </h2>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4 md:gap-6">
                {children}
            </div>
        </div>
    );
};

export default Section;
