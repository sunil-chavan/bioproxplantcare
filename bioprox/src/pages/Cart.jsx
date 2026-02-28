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
            <div className="container mx-auto px-4 sm:px-6">
                <h1 className="text-4xl md:text-5xl font-bold text-green-900 mb-8">Shopping Cart</h1>

                <div className="grid lg:grid-cols-3 gap-8">
                    {/* Cart Items */}
                    <div className="lg:col-span-2 space-y-4">
                        {cartItems.map((item) => (
                            <div key={item.id} className="bg-white rounded-2xl p-4 sm:p-6 shadow-sm hover:shadow-lg transition">
                                <div className="flex flex-col sm:flex-row gap-6">
                                    {/* Product Image */}
                                    <Link to={`/product/${item.product?.id}`} className="shrink-0 mx-auto sm:mx-0">
                                        <div className="w-24 h-24 sm:w-32 sm:h-32 bg-gray-100 rounded-xl overflow-hidden">
                                            <img
                                                src={item.product?.image || "https://images.unsplash.com/photo-1585320806297-9794b3e4eeae?w=300"}
                                                alt={item.product?.name}
                                                className="w-full h-full object-cover hover:scale-110 transition"
                                            />
                                        </div>
                                    </Link>

                                    {/* Product Info */}
                                    <div className="flex-grow text-center sm:text-left">
                                        <div className="flex flex-col sm:flex-row justify-between items-center sm:items-start mb-2 gap-2">
                                            <Link to={`/product/${item.product?.id}`}>
                                                <h3 className="font-bold text-lg text-gray-900 hover:text-green-700 transition">
                                                    {item.product?.name}
                                                </h3>
                                            </Link>
                                            <button
                                                onClick={() => removeCart(item.id)}
                                                className="text-red-500 hover:text-red-700 font-bold text-xs uppercase tracking-widest bg-red-50 px-3 py-1.5 rounded-lg"
                                            >
                                                Remove
                                            </button>
                                        </div>

                                        <p className="text-xl sm:text-2xl font-black text-green-700 mb-4">₹{item.product?.price}</p>

                                        {/* Quantity Controls */}
                                        <div className="flex flex-col sm:flex-row items-center gap-4">
                                            <div className="flex items-center bg-bg-soft border border-gray-100 rounded-xl overflow-hidden p-0.5">
                                                <button
                                                    onClick={() => updateCart(item.id, item.quantity - 1)}
                                                    disabled={item.quantity <= 1}
                                                    className="w-10 h-10 flex items-center justify-center hover:bg-white transition font-black text-lg disabled:opacity-20"
                                                >
                                                    −
                                                </button>
                                                <span className="w-10 text-center font-black">{item.quantity}</span>
                                                <button
                                                    onClick={() => updateCart(item.id, item.quantity + 1)}
                                                    disabled={item.quantity >= (item.product?.stock || 999)}
                                                    className="w-10 h-10 flex items-center justify-center hover:bg-white transition font-black text-lg disabled:opacity-20"
                                                >
                                                    +
                                                </button>
                                            </div>

                                            {item.product?.stock && item.quantity >= item.product.stock && (
                                                <span className="text-[10px] text-orange-600 font-black uppercase tracking-widest">Max stock</span>
                                            )}
                                        </div>

                                        <p className="text-xs font-bold text-dark/30 mt-4">
                                            Subtotal: <span className="font-black text-primary">₹{(item.product?.price || 0) * item.quantity}</span>
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
