import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { ShoppingCart, Star, Eye } from "lucide-react";

const ProductSection = ({ products }) => {
    // If no products provided, use dummy ones for layout testing
    const displayProducts = products?.length > 0 ? products.slice(0, 4) : [
        { id: 1, name: "Premium Tomato Seeds", price: 199, image: "https://images.unsplash.com/photo-1592928302636-c83cf1e1a2f2?w=800", category: { name: "Seeds" } },
        { id: 2, name: "Eco-Pro Grow Bag", price: 299, image: "https://images.unsplash.com/photo-1603912699214-92627f304eb6?w=800", category: { name: "Grow Bags" } },
        { id: 3, name: "Garden Tool Set", price: 799, image: "https://images.unsplash.com/photo-1561998338-13ad7883b20f?w=800", category: { name: "Tools" } },
        { id: 4, name: "Organic Fertilizer", price: 449, image: "https://images.unsplash.com/photo-1615811361523-6bd03d7748e7?w=800", category: { name: "Supplements" } },
    ];

    return (
        <section className="py-10 bg-bg-soft/30">
            <div className="container mx-auto px-6">
                <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-12 gap-6">
                    <div>
                        <h2 className="text-3xl md:text-4xl font-display font-black text-primary mb-2">
                            Bestselling Botanical Care
                        </h2>
                        <p className="text-dark/50 font-medium tracking-tight">
                            Trusted by 10,000+ home gardeners for guaranteed results.
                        </p>
                    </div>
                    <Link to="/shop" className="btn-outline w-full md:w-auto px-6 py-2.5 text-sm uppercase tracking-widest text-center">
                        View Shop
                    </Link>
                </div>

                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 2xl:grid-cols-5 gap-4 md:gap-8">
                    {displayProducts.map((product, i) => (
                        <motion.div
                            key={product.id}
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: i * 0.1, duration: 0.5 }}
                            className="group bg-white rounded-2xl border border-gray-100 p-3 hover:shadow-2xl hover:border-secondary/20 transition-all duration-500"
                        >
                            <div className="relative aspect-square overflow-hidden rounded-xl bg-bg-soft mb-4">
                                <img
                                    src={product.image}
                                    alt={product.name}
                                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                                />

                                {/* Quick Actions */}
                                <div className="absolute top-3 right-3 flex flex-col gap-2 transform translate-x-12 opacity-0 group-hover:translate-x-0 group-hover:opacity-100 transition-all duration-300">
                                    <Link
                                        to={`/products/${product.id}`}
                                        className="w-10 h-10 bg-white text-primary rounded-full shadow-lg flex items-center justify-center hover:bg-secondary hover:text-white transition-all"
                                    >
                                        <Eye size={18} />
                                    </Link>
                                </div>

                                {product.category && (
                                    <div className="absolute bottom-3 left-3 bg-white/90 px-3 py-1 rounded-lg text-[9px] font-black uppercase tracking-widest text-primary">
                                        {product.category.name}
                                    </div>
                                )}
                            </div>

                            <div className="px-2 pb-2">
                                <div className="flex items-center gap-1 text-accent mb-2">
                                    {[...Array(5)].map((_, i) => (
                                        <Star key={i} size={12} className="fill-current" />
                                    ))}
                                    <span className="text-[10px] font-black text-dark/40 ml-1">(4.9)</span>
                                </div>
                                <h3 className="text-lg font-bold text-primary truncate mb-1 group-hover:text-secondary transition-colors">
                                    {product.name}
                                </h3>
                                <div className="flex items-center justify-between mt-4">
                                    <p className="text-xl font-black text-primary">₹{product.price}</p>
                                    <button className="p-2.5 bg-secondary text-white rounded-xl hover:bg-primary transition-all active:scale-95 shadow-lg shadow-secondary/20">
                                        <ShoppingCart size={18} />
                                    </button>
                                </div>
                            </div>
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    );
};

export default ProductSection;
