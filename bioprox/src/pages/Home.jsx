import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import HeroSlider from "../components/homes/HeroSlider";
import FeatureStrip from "../components/homes/FeatureStrip";
import CategorySlider from "../components/homes/CategorySlider";
import ProductSection from "../components/homes/ProductSection";
import TestimonialSlider from "../components/homes/Testimonialslider";
import BlogSlider from "../components/homes/BlogSlider";
import { getFeaturedProducts } from "../api/productService";
import { getCategories } from "../api/categoryService";

const Home = () => {
    const [products, setProducts] = useState([]);
    const [categories, setCategories] = useState([]);

    useEffect(() => {
        fetchData();
        window.scrollTo(0, 0);
    }, []);

    const fetchData = async () => {
        try {
            const [productsRes, categoriesRes] = await Promise.all([
                getFeaturedProducts(),
                getCategories()
            ]);
            setProducts(productsRes.data.data?.data || productsRes.data.data || productsRes.data || []);
            setCategories(categoriesRes.data.data || []);
        } catch (error) {
            console.error("Error fetching data:", error);
        }
    };

    const fadeInUp = {
        initial: { opacity: 0, y: 30 },
        whileInView: { opacity: 1, y: 0 },
        viewport: { once: true },
        transition: { duration: 0.6 }
    };

    return (
        <div className="overflow-hidden">
            <HeroSlider />
            <motion.div {...fadeInUp}>
                <FeatureStrip />
            </motion.div>

            <motion.div {...fadeInUp} className="py-8 sm:py-12">
                <CategorySlider categories={categories} />
            </motion.div>

            <motion.div {...fadeInUp} className="py-8 sm:py-12 bg-gray-50/50">
                <ProductSection products={products} />
            </motion.div>

            <motion.div {...fadeInUp} className="py-10 sm:py-20 relative overflow-hidden">
                <div className="absolute top-0 left-0 w-64 h-64 bg-accent/5 rounded-full blur-3xl -translate-x-1/2 -translate-y-1/2" />
                <TestimonialSlider />
            </motion.div>

            <motion.div {...fadeInUp} className="py-10 sm:py-20 bg-primary/5">
                <BlogSlider />
            </motion.div>
        </div>
    );
};

export default Home;
