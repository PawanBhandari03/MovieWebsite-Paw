import type { ReactNode } from 'react';
import { motion } from 'framer-motion';

interface SectionProps {
    title: string;
    children: ReactNode;
}

const Section = ({ title, children }: SectionProps) => {
    return (
        <div className="py-8 px-4 md:px-12 max-w-7xl mx-auto">
            <motion.h2
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                className="text-2xl font-bold text-white mb-6 border-l-4 border-accent pl-4"
            >
                {title}
            </motion.h2>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                {children}
            </div>
        </div>
    );
};

export default Section;
