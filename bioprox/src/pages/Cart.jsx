import { useContext } from "react";
import { Link, useNavigate } from "react-router-dom";
import { CartContext } from "../context/CartContext";

const Cart = () => {
    const { cartItems, updateCart, removeCart } = useContext(CartContext);
    const navigate = useNavigate();

    const subtotal = cartItems.reduce((sum, item) => sum + (item.product?.price || 0) * item.quantity, 0);
    const shipping = subtotal > 999 ? 0 : 99;
    const total = subtotal + shipping;

    if (cartItems.length === 0) {
        return (
            <div className="min-h-[70vh] flex items-center justify-center bg-gray-50">
                <div className="text-center">
                    <div className="text-8xl mb-6">🛒</div>
                    <h2 className="text-3xl font-bold text-gray-900 mb-4">Your cart is empty</h2>
                    <p className="text-gray-600 mb-8">Add some amazing products to get started!</p>
                    <Link to="/shop" className="bg-green-700 text-white px-8 py-4 rounded-xl font-bold text-lg hover:bg-green-800 transition inline-block shadow-lg">
                        Browse Shop
                    </Link>
                </div>
            </div>
        );
    }

    return (
        <div className="bg-gray-50 min-h-screen py-12">
            <div className="container mx-auto px-6">
                <h1 className="text-4xl md:text-5xl font-bold text-green-900 mb-8">Shopping Cart</h1>

                <div className="grid lg:grid-cols-3 gap-8">
                    {/* Cart Items */}
                    <div className="lg:col-span-2 space-y-4">
                        {cartItems.map((item) => (
                            <div key={item.id} className="bg-white rounded-2xl p-6 shadow-sm hover:shadow-lg transition">
                                <div className="flex gap-6">
                                    {/* Product Image */}
                                    <Link to={`/product/${item.product?.id}`} className="shrink-0">
                                        <div className="w-32 h-32 bg-gray-100 rounded-xl overflow-hidden">
                                            <img
                                                src={item.product?.image || "https://images.unsplash.com/photo-1585320806297-9794b3e4eeae?w=300"}
                                                alt={item.product?.name}
                                                className="w-full h-full object-cover hover:scale-110 transition"
                                            />
                                        </div>
                                    </Link>

                                    {/* Product Info */}
                                    <div className="flex-grow">
                                        <div className="flex justify-between items-start mb-2">
                                            <Link to={`/product/${item.product?.id}`}>
                                                <h3 className="font-bold text-lg text-gray-900 hover:text-green-700 transition">
                                                    {item.product?.name}
                                                </h3>
                                            </Link>
                                            <button
                                                onClick={() => removeCart(item.id)}
                                                className="text-red-600 hover:text-red-800 font-semibold text-sm"
                                            >
                                                Remove
                                            </button>
                                        </div>

                                        <p className="text-2xl font-bold text-green-700 mb-4">₹{item.product?.price}</p>

                                        {/* Quantity Controls */}
                                        <div className="flex items-center gap-4">
                                            <div className="flex items-center border-2 border-gray-200 rounded-xl overflow-hidden">
                                                <button
                                                    onClick={() => updateCart(item.id, item.quantity - 1)}
                                                    disabled={item.quantity <= 1}
                                                    className="px-4 py-2 hover:bg-gray-100 disabled:opacity-50 transition font-bold"
                                                >
                                                    −
                                                </button>
                                                <span className="px-6 py-2 font-bold">{item.quantity}</span>
                                                <button
                                                    onClick={() => updateCart(item.id, item.quantity + 1)}
                                                    disabled={item.quantity >= (item.product?.stock || 999)}
                                                    className="px-4 py-2 hover:bg-gray-100 disabled:opacity-50 transition font-bold"
                                                >
                                                    +
                                                </button>
                                            </div>

                                            {item.product?.stock && item.quantity >= item.product.stock && (
                                                <span className="text-sm text-orange-600 font-semibold">Max stock reached</span>
                                            )}
                                        </div>

                                        <p className="text-sm text-gray-500 mt-3">
                                            Subtotal: <span className="font-bold text-gray-900">₹{(item.product?.price || 0) * item.quantity}</span>
                                        </p>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>

                    {/* Order Summary */}
                    <div className="lg:col-span-1">
                        <div className="bg-white rounded-2xl p-8 shadow-lg sticky top-24">
                            <h3 className="text-2xl font-bold text-gray-900 mb-6">Order Summary</h3>

                            <div className="space-y-4 mb-6">
                                <div className="flex justify-between text-gray-600">
                                    <span>Subtotal</span>
                                    <span className="font-semibold">₹{subtotal}</span>
                                </div>
                                <div className="flex justify-between text-gray-600">
                                    <span>Shipping</span>
                                    <span className="font-semibold">{shipping === 0 ? "FREE" : `₹${shipping}`}</span>
                                </div>
                                {subtotal < 999 && (
                                    <p className="text-sm text-orange-600 bg-orange-50 p-3 rounded-lg">
                                        Add ₹{999 - subtotal} more for free shipping!
                                    </p>
                                )}
                                <div className="border-t-2 pt-4 border-gray-200">
                                    <div className="flex justify-between text-xl font-bold text-gray-900">
                                        <span>Total</span>
                                        <span className="text-green-700">₹{total}</span>
                                    </div>
                                </div>
                            </div>

                            <button
                                onClick={() => navigate("/checkout")}
                                className="w-full bg-green-700 text-white py-4 rounded-xl font-bold text-lg hover:bg-green-800 transition-all shadow-xl hover:shadow-2xl hover:-translate-y-1 mb-4"
                            >
                                Proceed to Checkout
                            </button>

                            <Link to="/shop" className="block text-center text-green-700 font-semibold hover:underline">
                                Continue Shopping
                            </Link>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Cart;
