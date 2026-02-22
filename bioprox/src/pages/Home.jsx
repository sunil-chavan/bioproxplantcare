import { useEffect, useState } from "react";
import HeroSlider from "../components/homes/HeroSlider";
import FeatureStrip from "../components/homes/FeatureStrip";
import CategorySlider from "../components/homes/CategorySlider";
import ProductSection from "../components/homes/ProcutSection";
import TestimonialSlider from "../components/homes/Testimonialslider";
import BlogSlider from "../components/homes/BlogSlider";
import { getFeaturedProducts } from "../api/productService";
import { getCategories } from "../api/categoryService";

const Home = () => {
    const [products, setProducts] = useState([]);
    const [categories, setCategories] = useState([]);

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        try {
            const [productsRes, categoriesRes] = await Promise.all([
                getFeaturedProducts(),
                getCategories()
            ]);
            // Handle both paginated and non-paginated responses
            setProducts(productsRes.data.data?.data || productsRes.data.data || productsRes.data || []);
            setCategories(categoriesRes.data.data || []);
        } catch (error) {
            console.error("Error fetching data:", error);
        }
    };

    return (
        <>
            <HeroSlider />
            <FeatureStrip />
            <CategorySlider categories={categories} />
            <ProductSection products={products} />
            <TestimonialSlider />
            <BlogSlider />
        </>
    );
};

export default Home;
