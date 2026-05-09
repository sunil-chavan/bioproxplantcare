import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowRight, Sparkles, ChevronLeft, ChevronRight } from "lucide-react";
import { getSliders } from "../../api/sliderService";

const HeroSlider = () => {
    const [sliders, setSliders] = useState([]);
    const [currentIndex, setCurrentIndex] = useState(0);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchSliders = async () => {
            try {
                const response = await getSliders();
                const data = response?.data?.data || [];
                setSliders(data);
            } catch (error) {
                console.error("Error fetching sliders:", error);
            } finally {
                setLoading(false);
            }
        };
        fetchSliders();
    }, []);

    // Auto play
    useEffect(() => {
        if (sliders.length <= 1) return;

        const interval = setInterval(() => {
            setCurrentIndex((prev) => (prev + 1) % sliders.length);
        }, 5000000);

        return () => clearInterval(interval);
    }, [sliders]);

    const nextSlide = () => {
        setCurrentIndex((prev) => (prev + 1) % sliders.length);
    };

    const prevSlide = () => {
        setCurrentIndex((prev) => (prev - 1 + sliders.length) % sliders.length);
    };

    if (loading) {
        return (
            <section className="h-[60vh] sm:h-[70vh] flex items-center justify-center bg-bg-soft">
                <div className="w-10 h-10 border-4 border-primary/20 border-t-primary rounded-full animate-spin"></div>
            </section>
        );
    }

    if (sliders.length === 0) return null;

    const currentSlider = sliders[currentIndex];

    return (
        <section
            className="relative w-full overflow-hidden bg-bg-soft
            h-[60vh] sm:h-[70vh] lg:h-[80vh]"
        >

            {/* Background Image */}
            <AnimatePresence mode="wait">
                <motion.div
                    key={currentIndex}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.6 }}
                    className="absolute inset-0"
                >
                    <img
                        src={currentSlider.image}
                        alt={currentSlider.title}
                        className="w-full h-full object-cover object-center"
                    />

                    {/* Overlay */}
                    <div className="absolute inset-0 bg-black/40"></div>
                </motion.div>
            </AnimatePresence>

            {/* Content */}
            <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-full flex items-center">

                <div className="max-w-2xl text-white">

                    <AnimatePresence mode="wait">
                        <motion.div
                            key={currentIndex}
                            initial={{ opacity: 0, y: 40 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -40 }}
                            transition={{ duration: 0.5 }}
                        >

                            {/* Subtitle */}
                            <div className="mb-4 sm:mb-5">
                                <span className="inline-flex items-center gap-2 bg-white/20 backdrop-blur-md px-3 py-1.5 rounded-full text-xs sm:text-sm font-semibold">
                                    <Sparkles size={16} />
                                    {currentSlider.subtitle || "Fresh & Organic"}
                                </span>
                            </div>

                            {/* Title */}
                            <h1 className="text-2xl sm:text-4xl md:text-5xl lg:text-6xl font-bold leading-tight mb-5 sm:mb-6">
                                {currentSlider.title}
                            </h1>

                            {/* Button */}
                            <Link
                                to={currentSlider.link || "/shop"}
                                className="inline-flex items-center gap-2 
                                bg-secondary hover:bg-secondary/90
                                text-white px-5 sm:px-8 py-3 sm:py-4
                                text-sm sm:text-base rounded-lg
                                transition-all duration-300"
                            >
                                Explore Now
                                <ArrowRight size={18} />
                            </Link>

                        </motion.div>
                    </AnimatePresence>

                </div>

            </div>

            {/* Slider Controls (same style as before) */}
            {sliders.length > 1 && (
                <div className="absolute bottom-6 right-4 sm:bottom-10 sm:right-10 flex gap-3 sm:gap-4 z-20">

                    <button
                        onClick={prevSlide}
                        className="w-9 h-9 sm:w-12 sm:h-12 rounded-full border border-white/40 flex items-center justify-center text-white hover:bg-white hover:text-black transition-all"
                    >
                        <ChevronLeft size={18} />
                    </button>

                    <button
                        onClick={nextSlide}
                        className="w-9 h-9 sm:w-12 sm:h-12 rounded-full border border-white/40 flex items-center justify-center text-white hover:bg-white hover:text-black transition-all"
                    >
                        <ChevronRight size={18} />
                    </button>

                </div>
            )}

            {/* Pagination Dots */}
            <div className="absolute bottom-4 sm:bottom-6 left-1/2 -translate-x-1/2 flex gap-2">

                {sliders.map((_, i) => (
                    <button
                        key={i}
                        onClick={() => setCurrentIndex(i)}
                        className={`h-2 rounded-full transition-all duration-300 ${i === currentIndex
                            ? "w-6 sm:w-8 bg-white"
                            : "w-2 bg-white/40"
                            }`}
                    />
                ))}

            </div>

        </section>
    );
};

export default HeroSlider;