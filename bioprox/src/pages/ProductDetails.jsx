import { useState, useEffect, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { ChevronRight, Heart, ShieldCheck, Truck, RefreshCw, Star, Info } from "lucide-react";
import { getProductById } from "../api/productService";
import { useCart } from "../context/CartContext";
import { motion, AnimatePresence } from "framer-motion";

const ProductDetails = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [product, setProduct] = useState(null);
    const [loading, setLoading] = useState(true);
    const [quantity, setQuantity] = useState(1);
    const [selectedImage, setSelectedImage] = useState(0);
    const [isZoomed, setIsZoomed] = useState(false);
    const [zoomPos, setZoomPos] = useState({ x: 0, y: 0 });
    const { addToCart } = useCart();
    const mainImageRef = useRef(null);

    useEffect(() => {
        fetchProduct();
        window.scrollTo(0, 0);
    }, [id]);

    const fetchProduct = async () => {
        setLoading(true);
        try {
            const res = await getProductById(id);
            setProduct(res.data.data || res.data);
        } catch (error) {
            console.error("Error fetching product:", error);
            navigate("/shop");
        } finally {
            setLoading(false);
        }
    };

    const handleMouseMove = (e) => {
        if (!mainImageRef.current) return;
        const { left, top, width, height } = mainImageRef.current.getBoundingClientRect();
        const x = ((e.pageX - left) / width) * 100;
        const y = ((e.pageY - (top + window.scrollY)) / height) * 100;
        setZoomPos({ x, y });
    };

    const handleAddToCart = () => {
        addToCart(product, quantity);
    };

    const apiBase = import.meta.env.VITE_API_URL;
    const images = (product?.images?.length > 0 ? product.images : [product?.image].filter(Boolean)).map(img =>
        (img && typeof img === 'string' && img.startsWith('http')) ? img : `${apiBase}/storage/${img}`
    );
    if (images.length === 0) images.push("https://images.unsplash.com/photo-1585320806297-9794b3e4eeae?w=800");

    if (loading) {
        return (
            <div className="container mx-auto px-6 py-20 animate-pulse">
                <div className="grid lg:grid-cols-2 gap-12">
                    <div className="aspect-[4/5] bg-bg-soft rounded-2xl" />
                    <div className="space-y-6">
                        <div className="h-10 bg-bg-soft rounded w-3/4" />
                        <div className="h-6 bg-bg-soft rounded w-1/4" />
                        <div className="h-32 bg-bg-soft rounded" />
                    </div>
                </div>
            </div>
        );
    }

    if (!product) return null;

    return (
        <div className="bg-white min-h-screen pb-24 lg:pb-10 pt-10">
            <div className="container mx-auto px-6">
                {/* Breadcrumb */}
                <nav className="mb-6 md:mb-10 flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-dark/30">
                    <button onClick={() => navigate("/")} className="hover:text-secondary transition-colors">Home</button>
                    <ChevronRight size={12} />
                    <button onClick={() => navigate("/shop")} className="hover:text-secondary transition-colors">Shop</button>
                    <ChevronRight size={12} />
                    <span className="text-primary truncate max-w-[150px]">{product.name}</span>
                </nav>

                {/* Mobile Title Section (Visible only on mobile) */}
                <div className="lg:hidden mb-6">
                    <div className="flex items-center gap-2 mb-3">
                        {product.category && (
                            <span className="bg-secondary/10 text-secondary font-black px-3 py-1 rounded-lg text-[8px] uppercase tracking-widest">
                                {product.category.name}
                            </span>
                        )}
                        <span className="text-[10px] text-accent font-black flex items-center gap-1">
                            <Star size={10} className="fill-current" /> 4.9
                        </span>
                    </div>
                    <h1 className="text-2xl font-display font-black text-primary leading-tight mb-2">
                        {product.name}
                    </h1>
                    <div className="flex items-baseline gap-3">
                        <span className="text-3xl font-black text-secondary tracking-tighter">₹{product.price}</span>
                        {product.sale_price && (
                            <span className="text-lg text-dark/20 line-through font-bold">₹{product.sale_price}</span>
                        )}
                    </div>
                </div>

                <div className="grid lg:grid-cols-12 gap-8 lg:gap-12 items-start">
                    {/* Left: Desktop Gallery (Vertical) */}
                    <div className="lg:col-span-1 hidden lg:flex flex-col gap-4 max-h-[600px] overflow-y-auto pr-2 custom-scrollbar">
                        {images.map((img, idx) => (
                            <button
                                key={idx}
                                onMouseEnter={() => setSelectedImage(idx)}
                                className={`w-full aspect-square rounded-xl overflow-hidden border-2 transition-all duration-300 ${selectedImage === idx ? "border-secondary shadow-lg shadow-secondary/10" : "border-gray-50 hover:border-gray-200"}`}
                            >
                                <img src={img} alt="" className="w-full h-full object-cover" />
                            </button>
                        ))}
                    </div>

                    {/* Middle: Main Image Preview */}
                    <div className="lg:col-span-5 relative group cursor-crosshair">
                        <div
                            ref={mainImageRef}
                            className="aspect-[4/5] bg-bg-soft rounded-2xl overflow-hidden border border-gray-100 relative shadow-sm"
                            onMouseEnter={() => !/iPhone|iPad|iPod|Android/i.test(navigator.userAgent) && setIsZoomed(true)}
                            onMouseLeave={() => setIsZoomed(false)}
                            onMouseMove={handleMouseMove}
                        >
                            <img
                                src={images[selectedImage]}
                                alt={product.name}
                                className={`w-full h-full object-cover transition-transform duration-300 ${isZoomed ? 'scale-0' : 'scale-100'}`}
                            />

                            {/* Zoom Overlay (Desktop only) */}
                            <AnimatePresence>
                                {isZoomed && (
                                    <motion.div
                                        initial={{ opacity: 0 }}
                                        animate={{ opacity: 1 }}
                                        exit={{ opacity: 0 }}
                                        className="absolute inset-0 z-10 bg-no-repeat w-full h-full bg-cover"
                                        style={{
                                            backgroundImage: `url(${images[selectedImage]})`,
                                            backgroundPosition: `${zoomPos.x}% ${zoomPos.y}%`,
                                            backgroundSize: '250%'
                                        }}
                                    />
                                )}
                            </AnimatePresence>
                        </div>

                        {/* Mobile Gallery (Horizontal) */}
                        <div className="flex lg:hidden gap-3 mt-4 overflow-x-auto pb-4 scrollbar-hide px-1">
                            {images.map((img, idx) => (
                                <button
                                    key={idx}
                                    onClick={() => setSelectedImage(idx)}
                                    className={`w-16 min-w-[64px] aspect-square rounded-xl overflow-hidden border-2 transition-all ${selectedImage === idx ? "border-secondary shadow-md" : "border-gray-100"}`}
                                >
                                    <img src={img} alt="" className="w-full h-full object-cover" />
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Right: Product Content */}
                    <div className="lg:col-span-6 space-y-8">
                        <div className="hidden lg:block">
                            <div className="flex items-center gap-2 mb-4">
                                {product.category && (
                                    <span className="bg-secondary/10 text-secondary font-black px-4 py-1.5 rounded-lg text-[9px] uppercase tracking-widest">
                                        {product.category.name}
                                    </span>
                                )}
                                <span className="bg-bg-soft text-primary font-black px-4 py-1.5 rounded-lg text-[9px] uppercase tracking-widest flex items-center gap-1.5">
                                    <ShieldCheck size={12} className="text-secondary" /> 100% Organic Content
                                </span>
                            </div>

                            <div className="flex justify-between items-start gap-4 mb-2">
                                <h1 className="text-3xl md:text-4xl font-display font-black text-primary leading-tight">
                                    {product.name}
                                </h1>
                                <button className="p-3 rounded-xl bg-bg-soft text-dark/30 hover:text-red-500 hover:bg-red-50 transition-all border border-transparent hover:border-red-100">
                                    <Heart size={20} />
                                </button>
                            </div>

                            <div className="flex items-center gap-3">
                                <div className="flex items-center gap-1 text-accent">
                                    {[...Array(5)].map((_, i) => (
                                        <Star key={i} size={14} className="fill-current" />
                                    ))}
                                    <span className="text-xs font-black text-dark/40 ml-1 mt-0.5">4.9 (124 reviews)</span>
                                </div>
                            </div>
                        </div>

                        <div className="hidden lg:flex items-baseline gap-4">
                            <span className="text-4xl font-black text-secondary tracking-tighter">₹{product.price}</span>
                            {product.sale_price && (
                                <span className="text-xl text-dark/20 line-through font-bold">₹{product.sale_price}</span>
                            )}
                            {product.sale_price && (
                                <span className="bg-accent/10 text-accent px-3 py-1 rounded-lg font-black text-xs uppercase tracking-widest">
                                    Save {Math.round(((product.sale_price - product.price) / product.sale_price) * 100)}%
                                </span>
                            )}
                        </div>

                        <div className="prose prose-sm max-w-none text-dark/60 font-medium leading-relaxed">
                            <p>{product.description || "Premium botanical care for your sanctuary. This selection offers unparalleled quality, sustainably sourced and handled with absolute expertise to ensure the best results for your garden."}</p>
                        </div>

                        <div className="p-4 bg-bg-soft rounded-2xl border border-gray-100 flex items-start gap-3">
                            <Info size={18} className="text-secondary mt-0.5 shrink-0" />
                            <p className="text-[11px] font-bold text-dark/50 leading-tight">
                                This product is eligible for our <span className="text-secondary">Growth Guarantee</span>. If you don't see results in 30 days, we'll replace it for free.
                            </p>
                        </div>

                        <hr className="border-gray-50" />

                        {/* Purchase Section (Hidden on Mobile, replaced by sticky footer) */}
                        <div className="hidden lg:block space-y-6">
                            <div className="flex items-center gap-8">
                                <div className="flex items-center bg-bg-soft border border-gray-100 rounded-xl p-1">
                                    <button
                                        onClick={() => setQuantity(Math.max(1, quantity - 1))}
                                        className="w-10 h-10 flex items-center justify-center font-black text-lg text-primary hover:text-secondary transition-colors"
                                    >
                                        −
                                    </button>
                                    <input
                                        type="number"
                                        value={quantity}
                                        onChange={(e) => setQuantity(Math.max(1, Math.min(product.stock, parseInt(e.target.value) || 1)))}
                                        className="w-12 bg-transparent text-center text-sm font-black focus:outline-none"
                                    />
                                    <button
                                        onClick={() => setQuantity(Math.min(product.stock || 99, quantity + 1))}
                                        className="w-10 h-10 flex items-center justify-center font-black text-lg text-primary hover:text-secondary transition-colors"
                                    >
                                        +
                                    </button>
                                </div>
                                <div className="flex items-center gap-2">
                                    {product.stock > 0 ? (
                                        <div className="flex flex-col">
                                            <span className="text-secondary font-black text-xs uppercase tracking-widest flex items-center gap-1.5">
                                                <span className="w-1.5 h-1.5 bg-secondary rounded-full"></span>
                                                In Stock
                                            </span>
                                            <span className="text-[10px] text-dark/30 font-bold">{product.stock} units available</span>
                                        </div>
                                    ) : (
                                        <span className="text-red-500 font-black text-xs uppercase tracking-widest flex items-center gap-1.5">
                                            <span className="w-1.5 h-1.5 bg-red-500 rounded-full"></span>
                                            Sold Out
                                        </span>
                                    )}
                                </div>
                            </div>

                            <div className="flex gap-4">
                                <button
                                    onClick={handleAddToCart}
                                    disabled={!product.stock}
                                    className="flex-1 btn-primary py-4 text-base shadow-xl shadow-secondary/20 font-black disabled:bg-gray-200 disabled:shadow-none flex items-center justify-center gap-2"
                                >
                                    Add to Cart
                                </button>
                                <button className="flex-1 btn-outline py-4 text-base font-black hover:bg-bg-soft flex items-center justify-center gap-2">
                                    Buy Now
                                </button>
                            </div>
                        </div>

                        {/* Mobile Features List */}
                        <div className="lg:hidden grid grid-cols-2 gap-4 pt-4">
                            <div className="flex flex-col items-center text-center p-3 bg-bg-soft/50 rounded-2xl gap-2 border border-gray-50">
                                <ShieldCheck size={20} className="text-secondary" />
                                <span className="text-[10px] font-bold text-dark/70 leading-tight">100% Genuine Organic</span>
                            </div>
                            <div className="flex flex-col items-center text-center p-3 bg-bg-soft/50 rounded-2xl gap-2 border border-gray-50">
                                <Truck size={20} className="text-secondary" />
                                <span className="text-[10px] font-bold text-dark/70 leading-tight">Free Shipping above ₹499</span>
                            </div>
                        </div>

                        {/* Trust Badges */}
                        <div className="grid grid-cols-2 lg:grid-cols-3 gap-4 pt-4">
                            <div className="flex items-center gap-3 p-3 rounded-xl bg-bg-soft/50 group border border-transparent hover:border-gray-100 transition-all">
                                <div className="p-2 rounded-lg bg-white text-secondary shadow-sm shadow-secondary/5 group-hover:scale-110 transition-transform">
                                    <Truck size={20} />
                                </div>
                                <div>
                                    <div className="font-black text-[10px] uppercase tracking-wider text-primary">Fast Delivery</div>
                                    <div className="text-[9px] text-dark/40 font-bold">2-4 Business Days</div>
                                </div>
                            </div>
                            <div className="flex items-center gap-3 p-3 rounded-xl bg-bg-soft/50 group border border-transparent hover:border-gray-100 transition-all">
                                <div className="p-2 rounded-lg bg-white text-secondary shadow-sm shadow-secondary/5 group-hover:scale-110 transition-transform">
                                    <ShieldCheck size={20} />
                                </div>
                                <div>
                                    <div className="font-black text-[10px] uppercase tracking-wider text-primary">Secure Policy</div>
                                    <div className="text-[9px] text-dark/40 font-bold">Safe & Encrypted</div>
                                </div>
                            </div>
                            <div className="flex items-center gap-3 p-3 rounded-xl bg-bg-soft/50 group border border-transparent hover:border-gray-100 transition-all">
                                <div className="p-2 rounded-lg bg-white text-secondary shadow-sm shadow-secondary/5 group-hover:scale-110 transition-transform">
                                    <RefreshCw size={20} />
                                </div>
                                <div>
                                    <div className="font-black text-[10px] uppercase tracking-wider text-primary">Easy Returns</div>
                                    <div className="text-[9px] text-dark/40 font-bold">7-Day Free Window</div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Sticky Mobile Footer */}
            <div className="lg:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-gray-100 p-4 z-[90] shadow-[0_-10px_20px_rgba(0,0,0,0.05)] flex gap-3">
                <button
                    onClick={handleAddToCart}
                    disabled={!product.stock}
                    className="flex-1 bg-bg-soft text-primary py-4 rounded-xl font-black text-sm active:scale-95 transition-all disabled:opacity-50"
                >
                    Add to Cart
                </button>
                <button
                    disabled={!product.stock}
                    className="flex-1 bg-secondary text-white py-4 rounded-xl font-black text-sm shadow-lg shadow-secondary/20 active:scale-95 transition-all disabled:opacity-50"
                >
                    Buy Now
                </button>
            </div>
        </div>
    );
};

export default ProductDetails;
