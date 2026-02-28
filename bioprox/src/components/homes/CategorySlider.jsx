import { Link } from "react-router-dom";
import { motion } from "framer-motion";

const CategorySlider = ({ categories = [] }) => {
    // Fallback if no categories are provided from API
    const displayCategories = categories?.length > 0 ? categories : [
        { id: 1, name: "Indoor Plants", image: "https://images.unsplash.com/photo-1545241047-6083a3684587?w=800" },
        { id: 2, name: "Garden Tools", image: "https://images.unsplash.com/photo-1592419044706-39796d40f98c?w=800" },
        { id: 3, name: "Organic Seeds", image: "https://images.unsplash.com/photo-1523348837708-15d4a09cfac2?w=800" },
    ];

    return (
        <section className="container mx-auto px-6">
            <div className="flex flex-col md:flex-row justify-between items-end mb-12 gap-6">
                <div>
                    <h2 className="text-3xl md:text-4xl font-display font-black text-primary mb-2">
                        Shop by Category
                    </h2>
                    <p className="text-dark/50 font-medium tracking-tight">
                        Explore our curated selection of botanical essentials.
                    </p>
                </div>
                <Link to="/shop" className="text-secondary font-black uppercase tracking-widest text-sm hover:underline">
                    All Categories
                </Link>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-4 gap-6">
                {displayCategories.slice(0, 3).map((category, i) => (
                    <motion.div
                        key={category.id}
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: i * 0.1 }}
                        className="group relative h-64 overflow-hidden rounded-3xl bg-bg-soft"
                    >
                        <img
                            src={category.image}
                            alt={category.name}
                            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110 opacity-80"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-primary/80 via-transparent to-transparent opacity-60 group-hover:opacity-80 transition-opacity" />

                        <div className="absolute inset-0 p-8 flex flex-col justify-end">
                            <h3 className="text-2xl font-display font-black text-white mb-2">
                                {category.name}
                            </h3>
                            <Link
                                to={`/shop?category=${category.id}`}
                                className="w-fit flex items-center gap-2 text-white/90 text-xs font-black uppercase tracking-widest group/btn"
                            >
                                <span className="h-[2px] w-8 bg-secondary transition-all group-hover/btn:w-12" />
                                Browse Products
                            </Link>
                        </div>
                    </motion.div>
                ))}
            </div>
        </section>
    );
};

export default CategorySlider;
