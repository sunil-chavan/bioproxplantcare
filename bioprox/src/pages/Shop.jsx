import { useState, useEffect, useMemo } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { getProducts } from "../api/productService";
import { getCategories } from "../api/categoryService";
import { useCart } from "../context/CartContext";
import { motion, AnimatePresence } from "framer-motion";
import { Filter, X, ChevronRight, SlidersHorizontal, ShoppingCart } from "lucide-react";
import Loader from "../components/common/Loader";

const Shop = () => {
    const [products, setProducts] = useState([]);
    const [categories, setCategories] = useState([]);
    const [pagination, setPagination] = useState({});
    const [loading, setLoading] = useState(true);
    const [searchParams, setSearchParams] = useSearchParams();
    const [sortBy, setSortBy] = useState("newest");
    const [mobileFilterOpen, setMobileFilterOpen] = useState(false);
    const { addToCart } = useCart();

    const selectedCategory = searchParams.get("category") || "";
    const searchQuery = searchParams.get("search") || "";

    useEffect(() => {
        fetchData();
    }, [selectedCategory, searchQuery]);

    const fetchData = async () => {
        setLoading(true);
        try {
            const [productsRes, categoriesRes] = await Promise.all([
                getProducts({
                    category: selectedCategory,
                    search: searchQuery,
                }),
                getCategories(),
            ]);

            const productData = productsRes.data.data;

            setProducts(productData?.data || []);
            setPagination({
                currentPage: productData?.current_page,
                lastPage: productData?.last_page,
            });

            setCategories(categoriesRes.data.data || []);
        } catch (error) {
            console.error("Error fetching data:", error);
            setProducts([]);
            setCategories([]);
        } finally {
            setLoading(false);
        }
    };

    const handleCategoryFilter = (categoryId) => {
        const params = {};

        if (categoryId) params.category = categoryId;
        if (searchQuery) params.search = searchQuery;

        setSearchParams(params);
        setMobileFilterOpen(false);
    };

    const sortProducts = (productsToSort) => {
        const sorted = [...productsToSort];

        switch (sortBy) {
            case "price-asc":
                return sorted.sort(
                    (a, b) =>
                        (a.sale_price || a.price) -
                        (b.sale_price || b.price)
                );
            case "price-desc":
                return sorted.sort(
                    (a, b) =>
                        (b.sale_price || b.price) -
                        (a.sale_price || a.price)
                );
            case "name":
                return sorted.sort((a, b) =>
                    a.name.localeCompare(b.name)
                );
            default:
                return sorted;
        }
    };

    const sortedProducts = useMemo(() => {
        return sortProducts(products);
    }, [products, sortBy]);

    return (
        <div className="bg-gray-50 min-h-screen py-12">
            <div className="container mx-auto px-6">

                {/* Header */}
                <div className="mb-10">
                    <h1 className="text-4xl md:text-5xl font-bold text-green-900 mb-3">
                        Shop
                    </h1>
                    <p className="text-gray-600 text-lg">
                        {searchQuery
                            ? `Results for "${searchQuery}"`
                            : "Browse our premium organic collection"}
                    </p>

                    <div className="mt-6 flex flex-wrap items-center justify-between gap-4">
                        <div className="flex items-center gap-3">
                            <label className="text-sm font-semibold text-gray-700">
                                Sort by:
                            </label>
                            <select
                                value={sortBy}
                                onChange={(e) => setSortBy(e.target.value)}
                                className="px-4 py-2 border rounded-xl focus:border-green-600 focus:outline-none bg-white text-sm font-bold"
                            >
                                <option value="newest">Newest First</option>
                                <option value="price-asc">
                                    Price: Low to High
                                </option>
                                <option value="price-desc">
                                    Price: High to Low
                                </option>
                                <option value="name">Name: A-Z</option>
                            </select>
                        </div>

                        {/* Mobile Filter Button */}
                        <button
                            onClick={() => setMobileFilterOpen(true)}
                            className="lg:hidden flex items-center gap-2 bg-white border border-gray-200 px-5 py-2.5 rounded-xl text-sm font-bold text-primary shadow-sm active:scale-95 transition-all"
                        >
                            <Filter size={18} />
                            Filters
                        </button>
                    </div>
                </div>

                {/* Mobile Filter Drawer */}
                <AnimatePresence>
                    {mobileFilterOpen && (
                        <>
                            <motion.div
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                exit={{ opacity: 0 }}
                                onClick={() => setMobileFilterOpen(false)}
                                className="fixed inset-0 bg-dark/40 backdrop-blur-sm z-[110] lg:hidden"
                            />
                            <motion.div
                                initial={{ y: "100%" }}
                                animate={{ y: 0 }}
                                exit={{ y: "100%" }}
                                transition={{ type: "spring", damping: 25, stiffness: 200 }}
                                className="fixed bottom-0 left-0 w-full bg-white rounded-t-[2.5rem] z-[120] p-8 max-h-[85vh] overflow-y-auto lg:hidden"
                            >
                                <div className="flex justify-between items-center mb-8">
                                    <div className="flex items-center gap-3">
                                        <div className="p-2 bg-secondary/10 rounded-lg text-secondary">
                                            <SlidersHorizontal size={20} />
                                        </div>
                                        <h3 className="text-xl font-black text-primary uppercase tracking-tight">Filters</h3>
                                    </div>
                                    <button onClick={() => setMobileFilterOpen(false)} className="p-2 bg-bg-soft rounded-full text-primary">
                                        <X size={20} />
                                    </button>
                                </div>

                                <div className="space-y-6 pb-12">
                                    <div>
                                        <p className="text-[10px] font-black uppercase tracking-widest text-dark/30 mb-4">Categories</p>
                                        <div className="grid grid-cols-1 gap-3">
                                            <button
                                                onClick={() => handleCategoryFilter("")}
                                                className={`w-full flex items-center justify-between px-5 py-4 rounded-2xl transition-all font-bold ${!selectedCategory
                                                    ? "bg-primary text-white shadow-lg shadow-primary/20"
                                                    : "bg-bg-soft text-dark/60"
                                                    }`}
                                            >
                                                <span>All Products</span>
                                                {!selectedCategory && <ChevronRight size={18} />}
                                            </button>

                                            {categories.map((cat) => (
                                                <button
                                                    key={cat.id}
                                                    onClick={() => handleCategoryFilter(cat.id)}
                                                    className={`w-full flex items-center justify-between px-5 py-4 rounded-2xl transition-all font-bold ${selectedCategory == cat.id
                                                        ? "bg-primary text-white shadow-lg shadow-primary/20"
                                                        : "bg-bg-soft text-dark/60"
                                                        }`}
                                                >
                                                    <span>{cat.name}</span>
                                                    {selectedCategory == cat.id && <ChevronRight size={18} />}
                                                </button>
                                            ))}
                                        </div>
                                    </div>
                                </div>
                            </motion.div>
                        </>
                    )}
                </AnimatePresence>

                <div className="grid lg:grid-cols-4 gap-8">

                    {/* Sidebar */}
                    <aside className="hidden lg:block lg:col-span-1">
                        <div className="bg-white rounded-2xl shadow-sm p-6 sticky top-24">
                            <h3 className="text-xl font-bold mb-6">
                                Categories
                            </h3>

                            <div className="space-y-3 max-h-[calc(100vh-250px)] overflow-y-auto pr-2 scrollbar-hide">
                                <button
                                    onClick={() => handleCategoryFilter("")}
                                    className={`w-full text-left px-4 py-3 rounded-xl transition font-medium ${!selectedCategory
                                        ? "bg-green-700 text-white"
                                        : "hover:bg-gray-100"
                                        }`}
                                >
                                    All Products
                                </button>

                                {categories.map((cat) => (
                                    <button
                                        key={cat.id}
                                        onClick={() =>
                                            handleCategoryFilter(cat.id)
                                        }
                                        className={`w-full text-left px-4 py-3 rounded-xl transition font-medium ${selectedCategory == cat.id
                                            ? "bg-green-700 text-white"
                                            : "hover:bg-gray-100"
                                            }`}
                                    >
                                        {cat.name}
                                    </button>
                                ))}
                            </div>
                        </div>
                    </aside>

                    {/* Products */}
                    <div className="lg:col-span-3">

                        {loading ? (
                            <Loader fullScreen={false} text="Loading products..." />
                        ) : sortedProducts.length === 0 ? (
                            <div className="text-center py-20 bg-white rounded-[2.5rem] border border-gray-100 shadow-sm px-6">
                                <div className="text-6xl mb-6">🌱</div>
                                <h3 className="text-2xl font-black text-primary mb-2">
                                    No products found
                                </h3>
                                <p className="text-dark/40 font-bold max-w-xs mx-auto mb-8">
                                    We couldn't find anything matching your current filters. Try a different selection!
                                </p>
                                <button
                                    onClick={() => handleCategoryFilter("")}
                                    className="btn-primary"
                                >
                                    Reset Filters
                                </button>
                            </div>
                        ) : (
                            <div className="grid grid-cols-1 xs:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-4 3xl:grid-cols-5 gap-4 md:gap-6">
                                {sortedProducts.map((product) => {
                                    const finalPrice =
                                        product.sale_price ||
                                        product.price;

                                    const discount =
                                        product.sale_price &&
                                        Math.round(
                                            ((product.price -
                                                product.sale_price) /
                                                product.price) *
                                            100
                                        );

                                    return (
                                        <div
                                            key={product.id}
                                            className="bg-white rounded-2xl shadow-sm hover:shadow-2xl transition-all duration-300 group overflow-hidden"
                                        >
                                            <Link
                                                to={`/product/${product.id}`}
                                                className="block"
                                            >
                                                <div className="aspect-square overflow-hidden bg-gray-100 relative">

                                                    {discount && (
                                                        <div className="absolute top-3 left-3 bg-red-500 text-white text-xs font-bold px-3 py-1 rounded-full shadow-lg">
                                                            {discount}% OFF
                                                        </div>
                                                    )}

                                                    <img
                                                        src={
                                                            product.image ? (product.image.startsWith('http') ? product.image : `${import.meta.env.VITE_API_URL}/storage/${product.image}`) :
                                                                "https://images.unsplash.com/photo-1585320806297-9794b3e4eeae?w=500"
                                                        }
                                                        alt={product.name}
                                                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                                                    />
                                                </div>
                                            </Link>

                                            <div className="p-4 md:p-6">
                                                <h3 className="text-sm md:text-lg font-bold text-gray-900 mb-1 md:mb-2 line-clamp-2 min-h-[2.5rem] md:min-h-0">
                                                    {product.name}
                                                </h3>

                                                <p className="hidden md:block text-gray-600 text-sm mb-3 line-clamp-2">
                                                    {product.description ||
                                                        "Premium quality product"}
                                                </p>

                                                <div className="flex flex-col md:flex-row md:items-center justify-between mb-4 gap-2">
                                                    <div>
                                                        <p className="text-lg md:text-2xl font-black text-green-700">
                                                            ₹{finalPrice}
                                                        </p>
                                                        {product.sale_price && (
                                                            <p className="text-xs md:text-sm text-gray-400 line-through">
                                                                ₹{product.price}
                                                            </p>
                                                        )}
                                                    </div>

                                                    <div className="hidden sm:block">
                                                        {product.stock > 0 ? (
                                                            <span className="text-[10px] text-green-600 font-bold bg-green-50 px-2 py-1 rounded-full uppercase tracking-widest">
                                                                In Stock
                                                            </span>
                                                        ) : (
                                                            <span className="text-[10px] text-red-600 font-bold bg-red-50 px-2 py-1 rounded-full uppercase tracking-widest">
                                                                Sold Out
                                                            </span>
                                                        )}
                                                    </div>
                                                </div>

                                                <button
                                                    onClick={() =>
                                                        addToCart(
                                                            product,
                                                            1
                                                        )
                                                    }
                                                    disabled={
                                                        product.stock === 0
                                                    }
                                                    className="w-full bg-primary text-white py-2.5 md:py-3 rounded-xl font-bold text-xs md:text-sm hover:scale-105 transition-all duration-300 shadow-lg disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                                                >
                                                    <ShoppingCart size={16} />
                                                    <span className="hidden xs:inline">
                                                        {product.stock > 0
                                                            ? "Add to Cart"
                                                            : "Sold Out"}
                                                    </span>
                                                </button>
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Shop;
