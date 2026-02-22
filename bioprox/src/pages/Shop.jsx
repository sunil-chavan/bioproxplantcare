import { useState, useEffect, useMemo } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { getProducts } from "../api/productService";
import { getCategories } from "../api/categoryService";
import { useCart } from "../context/CartContext";

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

                    <div className="mt-6 flex items-center gap-3">
                        <label className="text-sm font-semibold text-gray-700">
                            Sort by:
                        </label>
                        <select
                            value={sortBy}
                            onChange={(e) => setSortBy(e.target.value)}
                            className="px-4 py-2 border rounded-xl focus:border-green-600 focus:outline-none bg-white"
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
                </div>

                <div className="grid lg:grid-cols-4 gap-8">

                    {/* Sidebar */}
                    <aside className="hidden lg:block lg:col-span-1">
                        <div className="bg-white rounded-2xl shadow-sm p-6 sticky top-24">
                            <h3 className="text-xl font-bold mb-6">
                                Categories
                            </h3>

                            <div className="space-y-3">
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
                            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
                                {[...Array(6)].map((_, i) => (
                                    <div key={i} className="bg-white rounded-2xl p-6 animate-pulse">
                                        <div className="bg-gray-200 aspect-square rounded-xl mb-4"></div>
                                        <div className="bg-gray-200 h-6 rounded mb-2"></div>
                                        <div className="bg-gray-200 h-4 rounded w-2/3 mb-4"></div>
                                        <div className="bg-gray-200 h-12 rounded"></div>
                                    </div>
                                ))}
                            </div>
                        ) : sortedProducts.length === 0 ? (
                            <div className="text-center py-20">
                                <div className="text-6xl mb-4">🌱</div>
                                <p className="text-gray-500 text-xl font-semibold mb-2">
                                    No products found
                                </p>
                                <p className="text-gray-400">
                                    Try adjusting filters
                                </p>
                            </div>
                        ) : (
                            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
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
                                                            product.image ||
                                                            "https://images.unsplash.com/photo-1585320806297-9794b3e4eeae?w=500"
                                                        }
                                                        alt={product.name}
                                                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                                                    />
                                                </div>
                                            </Link>

                                            <div className="p-6">
                                                <h3 className="text-lg font-bold text-gray-900 mb-2 line-clamp-2">
                                                    {product.name}
                                                </h3>

                                                <p className="text-gray-600 text-sm mb-3 line-clamp-2">
                                                    {product.description ||
                                                        "Premium quality product"}
                                                </p>

                                                <div className="flex items-center justify-between mb-4">
                                                    <div>
                                                        <p className="text-2xl font-bold text-green-700">
                                                            ₹{finalPrice}
                                                        </p>
                                                        {product.sale_price && (
                                                            <p className="text-sm text-gray-400 line-through">
                                                                ₹{product.price}
                                                            </p>
                                                        )}
                                                    </div>

                                                    {product.stock > 0 ? (
                                                        <span className="text-sm text-green-600 font-semibold bg-green-50 px-3 py-1 rounded-full">
                                                            In Stock
                                                        </span>
                                                    ) : (
                                                        <span className="text-sm text-red-600 font-semibold bg-red-50 px-3 py-1 rounded-full">
                                                            Out of Stock
                                                        </span>
                                                    )}
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
                                                    className="w-full bg-gradient-to-r from-green-600 to-green-800 text-white py-3 rounded-xl font-semibold hover:scale-105 transition-all duration-300 shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
                                                >
                                                    🛒{" "}
                                                    {product.stock > 0
                                                        ? "Add to Cart"
                                                        : "Out of Stock"}
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
