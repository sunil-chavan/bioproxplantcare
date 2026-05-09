import React from 'react';
import { motion } from 'framer-motion';

const Loader = ({ fullScreen = false, text = "Loading..." }) => {
    const content = (
        <div className="flex flex-col items-center justify-center">
            <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 1.5, repeat: Infinity, ease: "linear" }}
                className="w-16 h-16 border-4 border-primary border-t-transparent rounded-full shadow-lg"
            />
            {text && <p className="mt-4 text-primary font-bold animate-pulse tracking-wider">{text}</p>}
        </div>
    );

    if (fullScreen) {
        return (
            <div className="fixed inset-0 bg-white/80 backdrop-blur-sm z-[200] flex items-center justify-center">
                {content}
            </div>
        );
    }

    return (
        <div className="w-full py-20 flex items-center justify-center">
            {content}
        </div>
    );
};

export default Loader;
