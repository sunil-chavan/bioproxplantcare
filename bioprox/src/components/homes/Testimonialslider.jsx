import { useState, useEffect } from "react";
import { getTestimonials } from "../../api/testimonialService";
import { Star } from "lucide-react";
import { motion } from "framer-motion";

const TestimonialSlider = () => {
    const [testimonials, setTestimonials] = useState([]);

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        try {
            const res = await getTestimonials();
            const data = (res.data.data || res.data)?.data || (res.data.data || res.data);
            if (Array.isArray(data) && data.length > 0) {
                setTestimonials(data.slice(0, 3));
            } else {
                setTestimonials([
                    { name: "Priya Sharma", message: "Amazing quality seeds! My terrace garden looks beautiful and healthy within just a few weeks.", designation: "Home Gardener", rating: 5 },
                    { name: "Rahul Mehta", message: "Fast delivery and premium packaging. The grow bags are incredibly durable and eco-friendly.", designation: "Plant Enthusiast", rating: 5 },
                    { name: "Anita Kapoor", message: "The best gardening tools I've used. Sustainably sourced and worth every single rupee.", designation: "Urban Farmer", rating: 5 }
                ]);
            }
        } catch (error) {
            console.error("Failed to fetch testimonials", error);
        }
    };

    return (
        <section className="py-24 bg-white border-y border-gray-100">
            <div className="container mx-auto px-6">
                <div className="text-center mb-16">
                    <h2 className="text-3xl md:text-4xl font-display font-black text-primary mb-4">
                        Grower's Stories
                    </h2>
                    <p className="text-dark/40 font-medium max-w-xl mx-auto">
                        Real results from our community of 10,000+ passionate gardeners across India.
                    </p>
                </div>

                <div className="grid md:grid-cols-3 gap-8">
                    {testimonials.map((t, i) => (
                        <motion.div
                            key={i}
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: i * 0.1, duration: 0.5 }}
                            className="bg-white p-8 rounded-2xl border border-gray-100 shadow-sm hover:shadow-xl hover:border-secondary/20 transition-all duration-500 flex flex-col"
                        >
                            <div className="flex gap-1 mb-6">
                                {[...Array(t.rating || 5)].map((_, idx) => (
                                    <Star key={idx} size={14} className="text-secondary fill-secondary" />
                                ))}
                            </div>

                            <p className="text-primary/70 font-medium text-lg mb-8 flex-grow leading-relaxed">
                                "{t.message}"
                            </p>

                            <div className="flex items-center gap-4 pt-6 border-t border-gray-50">
                                {t.image ? (
                                    <img src={t.image} alt={t.name} className="w-12 h-12 rounded-full object-cover border-2 border-secondary/20" />
                                ) : (
                                    <div className="w-12 h-12 rounded-full bg-secondary/10 flex items-center justify-center text-secondary font-bold text-lg uppercase">
                                        {t.name[0]}
                                    </div>
                                )}
                                <div>
                                    <h4 className="font-bold text-primary">{t.name}</h4>
                                    <span className="text-[10px] font-black uppercase tracking-widest text-dark/30">{t.designation}</span>
                                </div>
                            </div>
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    );
};

export default TestimonialSlider;
