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
                // Ensure we have an array
                const data = response.data.data || [];
                setSliders(data);
            } catch (error) {
                console.error("Error fetching sliders:", error);
            } finally {
                setLoading(false);
            }
        };
        fetchSliders();
    }, []);

    // Auto-play
    useEffect(() => {
        if (sliders.length <= 1) return;
        const interval = setInterval(() => {
            setCurrentIndex((prev) => (prev + 1) % sliders.length);
        }, 5000);
        return () => clearInterval(interval);
    }, [sliders]);

    const nextSlide = () => setCurrentIndex((prev) => (prev + 1) % sliders.length);
    const prevSlide = () => setCurrentIndex((prev) => (prev - 1 + sliders.length) % sliders.length);

    if (loading) {
        return (
            <section className="h-[70vh] bg-bg-soft flex items-center justify-center">
                <div className="w-12 h-12 border-4 border-primary/20 border-t-primary rounded-full animate-spin"></div>
            </section>
        );
    }

    if (sliders.length === 0) {
        // Fallback static slide if no admin data
        return (
            <section className="relative h-[70vh] flex items-center overflow-hidden bg-bg-soft">
                <div className="absolute inset-0 z-0">
                    <img src="https://images.unsplash.com/photo-1466692476868-aef1dfb1e735?q=80&w=1920" className="w-full h-full object-cover opacity-20" alt="Fallback" />
                </div>
                <div className="container relative z-10 px-6">
                    <h1 className="text-5xl md:text-7xl font-display font-black text-primary">Your Green Journey Starts Here</h1>
                </div>
            </section>
        );
    }

    const currentSlider = sliders[currentIndex];

    return (
        <section className="relative h-[70vh] min-h-[500px] flex items-center overflow-hidden bg-bg-soft">
            <AnimatePresence mode="wait">
                <motion.div
                    key={currentIndex}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.8 }}
                    className="absolute inset-0 z-0"
                >
                    <img
                        src={currentSlider.image}
                        alt={currentSlider.title}
                        className="w-full h-full object-cover opacity-20 grayscale-[20%]"
                    />
                    <div className="absolute inset-0 bg-gradient-to-r from-bg-soft via-bg-soft/80 to-transparent"></div>
                </motion.div>
            </AnimatePresence>

            <div className="container relative z-10 px-6">
                <div className="max-w-3xl">
                    <AnimatePresence mode="wait">
                        <motion.div
                            key={currentIndex}
                            initial={{ opacity: 0, x: 50 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: -50 }}
                            transition={{ duration: 0.5 }}
                        >
                            <div className="flex items-center gap-2 mb-6 text-primary">
                                <span className="bg-secondary/10 text-secondary px-4 py-1.5 rounded-full text-xs font-black uppercase tracking-widest flex items-center gap-2">
                                    <Sparkles size={14} /> {currentSlider.subtitle || '100% Organic & Sustainable'}
                                </span>
                            </div>

                            <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-7xl font-display font-black text-primary mb-6 leading-[1.1] md:leading-[1.05] tracking-tight">
                                {currentSlider.title}
                            </h1>

                            <div className="flex flex-wrap gap-4">
                                <Link
                                    to={currentSlider.link || "/shop"}
                                    className="btn-primary px-6 sm:px-10 py-3 sm:py-4 text-sm sm:text-lg shadow-xl shadow-primary/10"
                                >
                                    Explore Menu
                                    <ArrowRight size={20} />
                                </Link>
                            </div>
                        </motion.div>
                    </AnimatePresence>
                </div>
            </div>

            {/* Slider Controls - Hidden on small mobile */}
            {sliders.length > 1 && (
                <div className="absolute bottom-10 right-6 sm:right-10 hidden sm:flex gap-4 z-20">
                    <button onClick={prevSlide} className="w-10 h-10 sm:w-12 sm:h-12 rounded-full border border-primary/20 flex items-center justify-center text-primary hover:bg-primary hover:text-white transition-all">
                        <ChevronLeft size={18} />
                    </button>
                    <button onClick={nextSlide} className="w-10 h-10 sm:w-12 sm:h-12 rounded-full border border-primary/20 flex items-center justify-center text-primary hover:bg-primary hover:text-white transition-all">
                        <ChevronRight size={18} />
                    </button>
                </div>
            )}

            {/* Pagination Dots */}
            <div className="absolute left-1/2 bottom-8 -translate-x-1/2 flex gap-2 z-20">
                {sliders.map((_, i) => (
                    <button
                        key={i}
                        onClick={() => setCurrentIndex(i)}
                        className={`w-2 h-2 rounded-full transition-all ${i === currentIndex ? "w-8 bg-secondary" : "bg-primary/20"}`}
                    />
                ))}
            </div>

            {/* Side Branding - Hide on all but very large screens */}
            <div className="absolute top-1/2 right-6 -translate-y-1/2 p-6 hidden 2xl:block pointer-events-none">
                <div className="flex flex-col gap-8 text-primary/10 text-6xl font-black uppercase vertical-text tracking-tighter select-none">
                    <span>ORGANIC</span>
                    <span>PURE</span>
                    <span>LOCAL</span>
                </div>
            </div>
        </section>
    );
};

export default HeroSlider;
