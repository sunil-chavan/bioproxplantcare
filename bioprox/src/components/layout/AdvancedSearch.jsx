import { useState, useEffect, useRef } from "react";
import { Search, X, ArrowRight, ShoppingCart, Star, Flame, ArrowLeft, Heart, ChevronRight, ChevronLeft } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { getProducts } from "../../api/productService";
import { useCart } from "../../context/CartContext";
import { Link, useNavigate } from "react-router-dom";

const AdvancedSearch = ({ isMobile }) => {
    const [isOpen, setIsOpen] = useState(false);
    const [query, setQuery] = useState("");
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(false);
    const searchRef = useRef(null);
    const scrollContainerRef = useRef(null);
    const navigate = useNavigate();
    const { addToCart } = useCart();
    const apiBase = import.meta.env.VITE_API_URL;

    const trendingSearches = [
        "Winter Vegetable Seeds",
        "Flower Seeds",
        "Gardening Tools",
        "Flower Bulbs",
        "Grow Bags",
        "Best Sellers",
        "Winter Flowers Seed",
        "New Arrivals"
    ];

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (searchRef.current && !searchRef.current.contains(event.target)) {
                setIsOpen(false);
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    useEffect(() => {
        if (isOpen) {
            fetchInitialProducts();
        }
    }, [isOpen]);

    const fetchInitialProducts = async () => {
        setLoading(true);
        try {
            const res = await getProducts({ limit: 6 });
            const data = (res.data.data || res.data)?.data || (res.data.data || res.data);
            if (Array.isArray(data)) {
                setProducts(data);
            }
        } catch (error) {
            console.error("Error fetching search recommendations:", error);
        } finally {
            setLoading(false);
        }
    };

    const handleSearch = (term) => {
        const searchTerm = term || query;
        if (searchTerm.trim()) {
            navigate(`/shop?search=${encodeURIComponent(searchTerm.trim())}`);
            setIsOpen(false);
        }
    };

    const handleKeyDown = (e) => {
        if (e.key === "Enter") {
            handleSearch();
        }
    };

    const scroll = (direction) => {
        if (scrollContainerRef.current) {
            const { scrollLeft, clientWidth } = scrollContainerRef.current;
            const scrollAmount = clientWidth * 0.8;
            scrollContainerRef.current.scrollTo({
                left: direction === 'left' ? scrollLeft - scrollAmount : scrollLeft + scrollAmount,
                behavior: 'smooth'
            });
        }
    };

    return (
        <div className="relative" ref={searchRef}>
            {/* Search Trigger */}
            {isMobile ? (
                <button
                    onClick={() => setIsOpen(true)}
                    className="p-2 text-dark/60 hover:text-primary transition-all active:scale-95"
                >
                    <Search size={22} />
                </button>
            ) : (
                <div className="relative group min-w-[300px]">
                    <input
                        type="text"
                        value={query}
                        onChange={(e) => setQuery(e.target.value)}
                        onFocus={() => setIsOpen(true)}
                        onKeyDown={handleKeyDown}
                        placeholder="Search For Seeds, Tools..."
                        className="w-full h-11 pl-12 pr-4 bg-bg-soft/50 border border-gray-100 rounded-full text-sm font-medium focus:outline-none focus:ring-2 focus:ring-secondary/20 focus:border-secondary transition-all"
                    />
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-dark/30 group-focus-within:text-secondary" size={20} />
                </div>
            )}

            {/* Dropdown Overlay */}
            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial={{ opacity: 0, y: 10, scale: 0.98 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: 10, scale: 0.98 }}
                        className="fixed inset-0 sm:absolute sm:top-full sm:right-0 sm:inset-auto sm:mt-3 w-full sm:w-[800px] h-full sm:h-auto max-w-full sm:max-w-[calc(100vw-2rem)] bg-white sm:bg-white sm:rounded-3xl sm:rounded-[2.5rem] shadow-[0_32px_64px_-16px_rgba(0,0,0,0.1)] border-none sm:border sm:border-gray-100 overflow-y-auto z-[1000] p-0 sm:p-8"
                    >
                        {/* Mobile Header with Search Input */}
                        <div className="sticky top-0 bg-white z-[1010] flex items-center gap-3 p-4 sm:hidden border-b border-gray-100 mb-6">
                            <button onClick={() => setIsOpen(false)} className="p-2 text-primary">
                                <ArrowLeft size={24} />
                            </button>
                            <div className="flex-1 relative">
                                <input
                                    type="text"
                                    value={query}
                                    onChange={(e) => setQuery(e.target.value)}
                                    onKeyDown={handleKeyDown}
                                    autoFocus
                                    placeholder="Search For Seeds, Tools..."
                                    className="w-full h-11 bg-bg-soft border border-gray-200 rounded-lg pl-4 pr-10 text-sm text-primary focus:outline-none focus:border-primary"
                                />
                                <Search className="absolute right-3 top-1/2 -translate-y-1/2 text-primary/40" size={18} />
                            </div>
                        </div>

                        <div className="p-6 sm:p-0">
                            {/* Section: Trending Searches */}
                            <div className="mb-10">
                                <div className="flex items-center gap-2 mb-6">
                                    <Flame size={16} className="text-secondary" />
                                    <h3 className="text-[10px] font-black uppercase tracking-[0.2em] text-dark/40">Trending Searches</h3>
                                </div>
                                <div className="flex flex-wrap gap-2">
                                    {trendingSearches.map((term, i) => (
                                        <button
                                            key={i}
                                            onClick={() => handleSearch(term)}
                                            className="group flex items-center gap-2 px-4 py-2 bg-bg-soft border border-gray-200 rounded-xl text-xs font-bold text-primary hover:bg-secondary hover:text-white hover:border-secondary transition-all"
                                        >
                                            {term}
                                            <ArrowRight size={14} className="opacity-40 group-hover:translate-x-1 group-hover:opacity-100 transition-all" />
                                        </button>
                                    ))}
                                </div>
                            </div>

                            {/* Section: Recommended For You */}
                            <div>
                                <div className="flex items-center justify-between mb-6">
                                    <div className="flex items-center gap-2">
                                        <Star size={16} className="text-accent" />
                                        <h3 className="text-[10px] font-black uppercase tracking-[0.2em] text-dark/40">Recommended For You</h3>
                                    </div>
                                    <div className="flex items-center gap-4 sm:gap-6">
                                        <Link to="/shop" className="text-[10px] font-black uppercase tracking-widest text-secondary hover:text-primary transition-colors">
                                            View Gallery
                                        </Link>
                                        <div className="flex items-center gap-2">
                                            <button
                                                onClick={() => scroll('left')}
                                                className="w-8 h-8 rounded-full bg-bg-soft border border-gray-200 flex items-center justify-center text-primary/40 hover:bg-secondary hover:text-white hover:border-secondary transition-all"
                                            >
                                                <ChevronLeft size={16} />
                                            </button>
                                            <button
                                                onClick={() => scroll('right')}
                                                className="w-8 h-8 rounded-full bg-bg-soft border border-gray-200 flex items-center justify-center text-primary/40 hover:bg-secondary hover:text-white hover:border-secondary transition-all"
                                            >
                                                <ChevronRight size={16} />
                                            </button>
                                        </div>
                                    </div>
                                </div>

                                <div className="relative group/slider">
                                    <div
                                        ref={scrollContainerRef}
                                        className="flex gap-4 sm:gap-6 overflow-x-auto pb-6 scrollbar-hide -mx-2 px-2 custom-scrollbar"
                                    >
                                        {loading ? (
                                            [...Array(3)].map((_, i) => (
                                                <div key={i} className="min-w-[220px] max-w-[220px] aspect-[4/5] bg-white/5 rounded-3xl animate-pulse" />
                                            ))
                                        ) : (
                                            products.map((product) => (
                                                <div key={product.id} className="min-w-[200px] sm:min-w-[240px] max-w-[200px] sm:max-w-[240px] group/item">
                                                    <div className="bg-white rounded-[1.5rem] sm:rounded-[2rem] border border-gray-100 p-2 sm:p-3 hover:border-secondary/30 transition-all duration-500 overflow-hidden relative shadow-sm">
                                                        {/* Image Area */}
                                                        <div className="aspect-square rounded-xl sm:rounded-2xl overflow-hidden bg-white mb-3 sm:mb-4 relative">
                                                            <img
                                                                src={product.image ? (product.image.startsWith('http') ? product.image : `${apiBase}/storage/${product.image}`) : "https://via.placeholder.com/400"}
                                                                alt={product.name}
                                                                className="w-full h-full object-contain p-2 sm:p-4 group-hover/item:scale-110 transition-transform duration-700"
                                                            />
                                                            {product.sale_price && (
                                                                <div className="absolute top-2 left-2 bg-red-600 text-[8px] font-black uppercase tracking-widest px-2 py-1 rounded-md text-white">
                                                                    -{Math.round(((product.sale_price - product.price) / product.sale_price) * 100)}%
                                                                </div>
                                                            )}
                                                            <button className="absolute bottom-2 right-2 w-8 h-8 rounded-full bg-white/90 shadow-sm flex items-center justify-center text-red-500 hover:bg-white transition-colors">
                                                                <Heart size={16} />
                                                            </button>
                                                        </div>

                                                        {/* Content */}
                                                        <div className="px-1 pb-1">
                                                            <h4 className="text-xs sm:text-sm font-bold text-primary line-clamp-1 mb-1">
                                                                {product.name}
                                                            </h4>
                                                            <div className="flex items-center gap-1 text-[9px] text-accent mb-2">
                                                                {[...Array(5)].map((_, i) => (
                                                                    <Star key={i} size={10} className={i < 4 ? "fill-current" : "text-white/20"} />
                                                                ))}
                                                                <span className="text-dark/30 ml-1">4.37 | 71</span>
                                                            </div>
                                                            <div className="mb-3">
                                                                <span className="text-base sm:text-lg font-black text-primary">₹{product.price}</span>
                                                                <span className="text-[10px] text-dark/40 line-through ml-2">₹{product.sale_price || product.price + 30}</span>
                                                            </div>
                                                            <button
                                                                onClick={() => addToCart(product, 1)}
                                                                className="w-full h-10 rounded-xl bg-primary text-white flex items-center justify-center gap-2 hover:bg-secondary transition-all border border-primary/10 text-xs font-bold uppercase tracking-widest shadow-md active:scale-95"
                                                            >
                                                                <ShoppingCart size={16} />
                                                                Add To Cart
                                                            </button>
                                                        </div>
                                                    </div>
                                                </div>
                                            ))
                                        )}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
};

export default AdvancedSearch;
