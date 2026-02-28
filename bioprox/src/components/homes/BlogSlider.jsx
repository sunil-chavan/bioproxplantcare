import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { getBlogs } from "../../api/blogService";
import { motion } from "framer-motion";
import { ArrowRight, CalendarDays } from "lucide-react";

const BlogSlider = () => {
    const [blogs, setBlogs] = useState([]);

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        try {
            const res = await getBlogs();
            const data = (res.data.data || res.data)?.data || (res.data.data || res.data);
            if (Array.isArray(data) && data.length > 0) {
                setBlogs(data.slice(0, 3));
            } else {
                setBlogs([
                    { id: 1, title: "Top 5 Winter Vegetables to Grow in India", image: "https://images.unsplash.com/photo-1518843025960-d60217f226f5?w=800", created_at: "2024-02-15" },
                    { id: 2, title: "10 Urban Gardening Tips for Beginners", image: "https://images.unsplash.com/photo-1598514982901-58fef3a9a7b1?w=800", created_at: "2024-02-10" },
                    { id: 3, title: "How to Use Grow Bags Effectively", image: "https://images.unsplash.com/photo-1586773860418-d37222d8fce3?w=800", created_at: "2024-02-05" },
                ]);
            }
        } catch (error) {
            console.error("Error fetching blogs:", error);
        }
    };

    return (
        <section className="py-24 bg-bg-soft/20">
            <div className="container mx-auto px-6">
                <div className="flex flex-col md:flex-row justify-between items-end mb-16 gap-6">
                    <div>
                        <h2 className="text-3xl md:text-4xl font-display font-black text-primary mb-2">
                            Grower's Stories
                        </h2>
                        <p className="text-dark/40 font-medium">
                            Real experiences, expert advice, and sustainable growth tips.
                        </p>
                    </div>
                    <Link to="/blogs" className="text-secondary font-black text-sm uppercase tracking-widest border-b-2 border-secondary pb-1 hover:text-primary hover:border-primary transition-all flex items-center gap-2">
                        Read All Stories <ArrowRight size={16} />
                    </Link>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 md:gap-10 mb-20">
                    {blogs.map((blog, i) => (
                        <motion.div
                            key={blog.id}
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: i * 0.1, duration: 0.5 }}
                        >
                            <Link to={`/blog/${blog.id}`} className="group block h-full">
                                <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden hover:shadow-xl hover:border-secondary/20 transition-all duration-500 flex flex-col h-full">
                                    <div className="relative aspect-[16/10] overflow-hidden bg-bg-soft">
                                        <img
                                            src={blog.image}
                                            alt={blog.title}
                                            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                                        />
                                        <div className="absolute top-4 left-4 bg-white/95 px-3 py-1.5 rounded-lg flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-primary shadow-sm">
                                            <CalendarDays size={12} className="text-secondary" />
                                            {new Date(blog.created_at).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' })}
                                        </div>
                                    </div>
                                    <div className="p-6 flex flex-col flex-grow">
                                        <h3 className="text-xl font-display font-bold text-primary group-hover:text-secondary transition-colors mb-4 line-clamp-2">
                                            {blog.title}
                                        </h3>
                                        <div className="mt-auto flex items-center justify-between">
                                            <span className="text-[10px] font-black uppercase tracking-widest text-dark/30">Community Story</span>
                                            <div className="w-8 h-8 rounded-full bg-bg-soft flex items-center justify-center text-primary group-hover:bg-primary group-hover:text-white transition-all">
                                                <ArrowRight size={16} />
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </Link>
                        </motion.div>
                    ))}
                </div>

                {/* The "Strip" mentioned by the user */}
                <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    viewport={{ once: true }}
                    className="relative overflow-hidden rounded-3xl bg-primary py-12 px-8 md:px-16"
                >
                    <div className="absolute inset-0 opacity-10 pointer-events-none">
                        <img src="https://images.unsplash.com/photo-1518531966227-f4529946d92e?w=1200" className="w-full h-full object-cover" alt="Texture" />
                    </div>
                    <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-8">
                        <div>
                            <h3 className="text-3xl md:text-4xl font-display font-black text-white mb-2">
                                Ready to join the green revolution?
                            </h3>
                            <p className="text-white/60 font-medium">
                                Get 10% off on your first order with code: <span className="text-secondary font-black">BIOPROX10</span>
                            </p>
                        </div>
                        <Link to="/shop" className="btn-primary bg-secondary hover:bg-white hover:text-secondary px-8 sm:px-10 py-3 sm:py-4 text-sm sm:text-lg shadow-2xl shadow-secondary/20 whitespace-nowrap">
                            Shop Now <ArrowRight size={20} />
                        </Link>
                    </div>
                </motion.div>
            </div>
        </section>
    );
};

export default BlogSlider;
