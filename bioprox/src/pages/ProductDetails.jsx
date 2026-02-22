import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { getProductById } from "../api/productService";
import { useCart } from "../context/CartContext";

const ProductDetails = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [product, setProduct] = useState(null);
    const [loading, setLoading] = useState(true);
    const [quantity, setQuantity] = useState(1);
    const [selectedImage, setSelectedImage] = useState(0);
    const { addToCart } = useCart();

    useEffect(() => {
        fetchProduct();
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

    const handleAddToCart = () => {
        addToCart(product, quantity);
    };

    const images = product?.images || [product?.image] || ["https://images.unsplash.com/photo-1585320806297-9794b3e4eeae?w=800"];

    if (loading) {
        return (
            <div className="container mx-auto px-6 py-12">
                <div className="grid md:grid-cols-2 gap-12 animate-pulse">
                    <div>
                        <div className="bg-gray-200 aspect-square rounded-3xl mb-4"></div>
                        <div className="grid grid-cols-4 gap-4">
                            {[...Array(4)].map((_, i) => (
                                <div key={i} className="bg-gray-200 aspect-square rounded-xl"></div>
                            ))}
                        </div>
                    </div>
                    <div>
                        <div className="bg-gray-200 h-12 rounded mb-4"></div>
                        <div className="bg-gray-200 h-8 rounded w-1/3 mb-6"></div>
                        <div className="bg-gray-200 h-24 rounded mb-6"></div>
                        <div className="bg-gray-200 h-16 rounded"></div>
                    </div>
                </div>
            </div>
        );
    }

    if (!product) return null;

    return (
        <div className="bg-gray-50 min-h-screen py-12">
            <div className="container mx-auto px-6">
                {/* Breadcrumb */}
                <nav className="mb-8 text-sm">
                    <span className="text-gray-500 hover:text-green-700 cursor-pointer" onClick={() => navigate("/")}>Home</span>
                    <span className="mx-2 text-gray-400">/</span>
                    <span className="text-gray-500 hover:text-green-700 cursor-pointer" onClick={() => navigate("/shop")}>Shop</span>
                    <span className="mx-2 text-gray-400">/</span>
                    <span className="text-gray-900 font-semibold">{product.name}</span>
                </nav>

                <div className="grid md:grid-cols-2 gap-12 bg-white rounded-3xl p-8 shadow-lg">
                    {/* Image Gallery */}
                    <div>
                        <div className="aspect-square bg-gray-100 rounded-3xl overflow-hidden mb-6 shadow-inner">
                            <img
                                src={images[selectedImage]}
                                alt={product.name}
                                className="w-full h-full object-cover"
                            />
                        </div>
                        {images.length > 1 && (
                            <div className="grid grid-cols-4 gap-4">
                                {images.map((img, idx) => (
                                    <button
                                        key={idx}
                                        onClick={() => setSelectedImage(idx)}
                                        className={`aspect-square rounded-xl overflow-hidden border-4 transition ${selectedImage === idx ? "border-green-700" : "border-transparent hover:border-gray-300"}`}
                                    >
                                        <img src={img} alt={`${product.name} ${idx + 1}`} className="w-full h-full object-cover" />
                                    </button>
                                ))}
                            </div>
                        )}
                    </div>

                    {/* Product Info */}
                    <div>
                        <div className="mb-6">
                            {product.category && (
                                <span className="bg-green-100 text-green-800 px-4 py-1 rounded-full text-sm font-semibold">
                                    {product.category.name}
                                </span>
                            )}
                        </div>

                        <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">{product.name}</h1>

                        <div className="flex items-center gap-4 mb-6">
                            <div className="text-4xl font-bold text-green-700">₹{product.price}</div>
                            {product.sale_price && (
                                <div className="text-2xl text-gray-400 line-through">₹{product.sale_price}</div>
                            )}
                        </div>

                        <div className="mb-6">
                            {product.stock > 0 ? (
                                <div className="flex items-center gap-2 text-green-600">
                                    <span className="w-3 h-3 bg-green-600 rounded-full animate-pulse"></span>
                                    <span className="font-semibold">{product.stock} items in stock</span>
                                </div>
                            ) : (
                                <div className="flex items-center gap-2 text-red-600">
                                    <span className="w-3 h-3 bg-red-600 rounded-full"></span>
                                    <span className="font-semibold">Out of Stock</span>
                                </div>
                            )}
                        </div>

                        <div className="bg-gray-50 p-6 rounded-2xl mb-8">
                            <h3 className="font-bold text-lg mb-3 text-gray-900">Description</h3>
                            <p className="text-gray-600 leading-relaxed">
                                {product.description || "Premium organic gardening product. Perfect for indoor and outdoor gardens. Sustainably sourced and eco-friendly."}
                            </p>
                        </div>

                        {/* Quantity & Add to Cart */}
                        {product.stock > 0 && (
                            <div className="space-y-4">
                                <div>
                                    <label className="block text-sm font-semibold text-gray-700 mb-2">Quantity</label>
                                    <div className="flex items-center gap-4">
                                        <button
                                            onClick={() => setQuantity(Math.max(1, quantity - 1))}
                                            className="w-12 h-12 bg-gray-200 rounded-xl font-bold text-xl hover:bg-gray-300 transition"
                                        >
                                            −
                                        </button>
                                        <input
                                            type="number"
                                            value={quantity}
                                            onChange={(e) => setQuantity(Math.max(1, Math.min(product.stock, parseInt(e.target.value) || 1)))}
                                            className="w-20 h-12 text-center text-xl font-bold border-2 border-gray-200 rounded-xl focus:border-green-600 focus:outline-none"
                                            min="1"
                                            max={product.stock}
                                        />
                                        <button
                                            onClick={() => setQuantity(Math.min(product.stock, quantity + 1))}
                                            disabled={quantity >= product.stock}
                                            className="w-12 h-12 bg-gray-200 rounded-xl font-bold text-xl hover:bg-gray-300 transition disabled:opacity-50"
                                        >
                                            +
                                        </button>
                                    </div>
                                </div>

                                <button
                                    onClick={handleAddToCart}
                                    className="w-full bg-green-700 text-white py-5 rounded-2xl font-bold text-lg hover:bg-green-800 transition-all shadow-xl hover:shadow-2xl hover:-translate-y-1"
                                >
                                    Add to Cart
                                </button>
                            </div>
                        )}

                        {/* Features */}
                        <div className="mt-8 grid grid-cols-2 gap-4">
                            <div className="bg-green-50 p-4 rounded-xl text-center">
                                <div className="text-3xl mb-2">🌿</div>
                                <div className="font-semibold text-sm">100% Organic</div>
                            </div>
                            <div className="bg-green-50 p-4 rounded-xl text-center">
                                <div className="text-3xl mb-2">🚚</div>
                                <div className="font-semibold text-sm">Free Shipping</div>
                            </div>
                            <div className="bg-green-50 p-4 rounded-xl text-center">
                                <div className="text-3xl mb-2">💳</div>
                                <div className="font-semibold text-sm">Secure Payment</div>
                            </div>
                            <div className="bg-green-50 p-4 rounded-xl text-center">
                                <div className="text-3xl mb-2">🔁</div>
                                <div className="font-semibold text-sm">Easy Returns</div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ProductDetails;
