import { useState, useContext, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { CartContext } from "../context/CartContext";
import { useAuth } from "../context/AuthContext";
import { createOrder, verifyPayment } from "../api/orderService";
import toast from "react-hot-toast";
import { CreditCard, Truck, ShieldCheck } from "lucide-react";

const Checkout = () => {
    const { cartItems, clearCart } = useContext(CartContext);
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const [paymentMethod, setPaymentMethod] = useState(null);

    const { user } = useAuth(); // Destructure user from useAuth

    const [formData, setFormData] = useState({
        name: "",
        email: "",
        phone: "",
        address: "",
        city: "",
        state: "",
        pincode: "",
        notes: ""
    });

    useEffect(() => {
        if (user) {
            setFormData(prev => ({
                ...prev,
                name: user.name || prev.name,
                email: user.email || prev.email
            }));
        }
    }, [user]);

    const subtotal = cartItems.reduce((sum, item) => sum + (item.product?.price || 0) * item.quantity, 0);
    const shipping = subtotal > 999 ? 0 : 99;
    const total = subtotal + shipping;

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const loadRazorpayScript = () => {
        return new Promise((resolve) => {
            const script = document.createElement("script");
            script.src = "https://checkout.razorpay.com/v1/checkout.js";
            script.onload = () => resolve(true);
            script.onerror = () => resolve(false);
            document.body.appendChild(script);
        });
    };

    const handleRazorpayPayment = async (orderResponse) => {
        const res = await loadRazorpayScript();

        if (!res) {
            toast.error("Razorpay SDK failed to load. Are you online?");
            setLoading(false);
            return;
        }

        const options = {
            key: import.meta.env.VITE_RAZORPAY_KEY_ID,
            amount: orderResponse.net_amount * 100,
            currency: "INR",
            name: "BioProx Plant Care",
            description: "Order Payment",
            image: "/assets/logo.png",
            order_id: orderResponse.razorpay_order_id,
            handler: async function (response) {
                try {
                    setLoading(true);
                    const verifyRes = await verifyPayment({
                        razorpay_order_id: response.razorpay_order_id,
                        razorpay_payment_id: response.razorpay_payment_id,
                        razorpay_signature: response.razorpay_signature,
                    });

                    if (verifyRes.data.success) {
                        toast.success("Payment successful! 🎉");
                        clearCart();
                        navigate(`/order-success/${orderResponse.id}`);
                    } else {
                        toast.error("Payment verification failed. Contact support.");
                    }
                } catch (err) {
                    toast.error("Error verifying payment.");
                } finally {
                    setLoading(false);
                }
            },
            prefill: {
                name: formData.name,
                email: formData.email,
                contact: formData.phone,
            },
            theme: {
                color: "#15803d",
            },
            modal: {
                ondismiss: function () {
                    setLoading(false);
                    toast.error("Payment cancelled");
                }
            }
        };

        const paymentObject = new window.Razorpay(options);
        paymentObject.open();
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!paymentMethod) {
            toast.error("Please select a payment method");
            setError("Please select a payment method");
            return;
        }

        setError("");
        setLoading(true);

        try {
            const orderData = {
                ...formData,
                shipping_amount: shipping,
                net_amount: total,
                shipping_address: formData.address,
                payment_method: paymentMethod,
                items: cartItems.map(item => ({
                    product_id: item.product.id,
                    quantity: item.quantity,
                    price: item.product.price
                })),
                notes: formData.notes
            };

            const res = await createOrder(orderData);
            const order = res.data?.data || res.data;

            if (res.data?.success) {
                if (paymentMethod === "online") {
                    handleRazorpayPayment(order);
                } else {
                    toast.success("Order placed successfully! 🎉");
                    clearCart();
                    navigate(`/order-success/${order.id}`);
                }
            } else {
                throw new Error(res.data?.message || "Order placement failed");
            }
        } catch (err) {
            console.error("Order Error:", err);
            const errorMessage = err.response?.data?.message || err.message || "Order placement failed";
            setError(errorMessage);

            if (err.response?.data?.errors) {
                Object.values(err.response.data.errors).flat().forEach(msg => toast.error(msg));
            } else {
                toast.error(errorMessage);
            }
            setLoading(false);
        }
    };

    const { loading: authLoading } = useAuth();

    useEffect(() => {
        if (!authLoading && !user && !localStorage.getItem("customer_token")) {
            navigate("/login?redirect=checkout");
        }
    }, [user, authLoading, navigate]);

    if (authLoading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-green-500"></div>
            </div>
        );
    }

    if (cartItems.length === 0) {
        navigate("/cart");
        return null;
    }

    return (
        <div className="bg-gray-50 min-h-screen py-12">
            <div className="container mx-auto px-4 sm:px-6">
                <h1 className="text-4xl md:text-5xl font-bold text-green-900 mb-8">Checkout</h1>

                {error && (
                    <div className="bg-red-50 border-2 border-red-200 text-red-700 px-6 py-4 rounded-2xl mb-6">
                        {error}
                    </div>
                )}

                <form onSubmit={handleSubmit}>
                    <div className="grid lg:grid-cols-3 gap-8">
                        {/* Shipping Form */}
                        <div className="lg:col-span-2 space-y-8">
                            <div className="bg-white rounded-3xl p-5 sm:p-8 shadow-sm border border-gray-100">
                                <h2 className="text-2xl font-bold text-gray-900 mb-8">Shipping Information</h2>

                                <div className="grid md:grid-cols-2 gap-6">
                                    <div>
                                        <label className="block text-sm font-semibold text-gray-700 mb-2">Full Name *</label>
                                        <input
                                            type="text"
                                            name="name"
                                            value={formData.name}
                                            onChange={handleChange}
                                            required
                                            className="w-full px-5 py-3 border border-gray-200 rounded-2xl focus:ring-2 focus:ring-green-500/20 focus:border-green-600 focus:outline-none transition-all bg-gray-50/50"
                                            placeholder="John Doe"
                                        />
                                    </div>

                                    <div>
                                        <label className="block text-sm font-semibold text-gray-700 mb-2">Email *</label>
                                        <input
                                            type="email"
                                            name="email"
                                            value={formData.email}
                                            onChange={handleChange}
                                            required
                                            className="w-full px-5 py-3 border border-gray-200 rounded-2xl focus:ring-2 focus:ring-green-500/20 focus:border-green-600 focus:outline-none transition-all bg-gray-50/50"
                                            placeholder="you@example.com"
                                        />
                                    </div>

                                    <div>
                                        <label className="block text-sm font-semibold text-gray-700 mb-2">Phone Number *</label>
                                        <input
                                            type="tel"
                                            name="phone"
                                            value={formData.phone}
                                            onChange={handleChange}
                                            required
                                            className="w-full px-5 py-3 border border-gray-200 rounded-2xl focus:ring-2 focus:ring-green-500/20 focus:border-green-600 focus:outline-none transition-all bg-gray-50/50"
                                            placeholder="+91 9876543210"
                                        />
                                    </div>

                                    <div className="md:col-span-2">
                                        <label className="block text-sm font-semibold text-gray-700 mb-2">Detailed Shipping Address *</label>
                                        <textarea
                                            name="address"
                                            value={formData.address}
                                            onChange={handleChange}
                                            required
                                            rows="3"
                                            className="w-full px-5 py-3 border border-gray-200 rounded-2xl focus:ring-2 focus:ring-green-500/20 focus:border-green-600 focus:outline-none transition-all bg-gray-50/50 resize-none"
                                            placeholder="House No / Street Name / Landmark"
                                        ></textarea>
                                    </div>

                                    <div>
                                        <label className="block text-sm font-semibold text-gray-700 mb-2">City *</label>
                                        <input
                                            type="text"
                                            name="city"
                                            value={formData.city}
                                            onChange={handleChange}
                                            required
                                            className="w-full px-5 py-3 border border-gray-200 rounded-2xl focus:ring-2 focus:ring-green-500/20 focus:border-green-600 focus:outline-none transition-all bg-gray-50/50"
                                            placeholder="City"
                                        />
                                    </div>

                                    <div>
                                        <label className="block text-sm font-semibold text-gray-700 mb-2">State *</label>
                                        <input
                                            type="text"
                                            name="state"
                                            value={formData.state}
                                            onChange={handleChange}
                                            required
                                            className="w-full px-5 py-3 border border-gray-200 rounded-2xl focus:ring-2 focus:ring-green-500/20 focus:border-green-600 focus:outline-none transition-all bg-gray-50/50"
                                            placeholder="State"
                                        />
                                    </div>

                                    <div>
                                        <label className="block text-sm font-semibold text-gray-700 mb-2">Pincode *</label>
                                        <input
                                            type="text"
                                            name="pincode"
                                            value={formData.pincode}
                                            onChange={handleChange}
                                            required
                                            className="w-full px-5 py-3 border border-gray-200 rounded-2xl focus:ring-2 focus:ring-green-500/20 focus:border-green-600 focus:outline-none transition-all bg-gray-50/50"
                                            placeholder="6-digit Pincode"
                                        />
                                    </div>

                                    <div className="md:col-span-2">
                                        <label className="block text-sm font-semibold text-gray-700 mb-2">Order Notes (Optional)</label>
                                        <textarea
                                            name="notes"
                                            value={formData.notes}
                                            onChange={handleChange}
                                            rows="2"
                                            className="w-full px-5 py-3 border border-gray-200 rounded-2xl focus:ring-2 focus:ring-green-500/20 focus:border-green-600 focus:outline-none transition-all bg-gray-50/50 resize-none"
                                            placeholder="Any special instructions for delivery..."
                                        ></textarea>
                                    </div>
                                </div>
                            </div>

                            {/* Payment Method */}
                            <div className="bg-white rounded-3xl p-5 sm:p-8 shadow-sm border border-gray-100">
                                <h2 className="text-2xl font-bold text-gray-900 mb-8">Payment Method</h2>
                                <div className="grid md:grid-cols-2 gap-4">
                                    <div
                                        onClick={() => setPaymentMethod("cod")}
                                        className={`cursor-pointer p-6 rounded-2xl border-2 transition-all flex items-center gap-4 ${paymentMethod === "cod"
                                            ? "border-green-600 bg-green-50 shadow-md"
                                            : "border-gray-100 bg-white hover:border-gray-200"
                                            }`}
                                    >
                                        <div className={`p-3 rounded-xl ${paymentMethod === "cod" ? "bg-green-600 text-white" : "bg-gray-100 text-gray-500"}`}>
                                            <Truck size={24} />
                                        </div>
                                        <div>
                                            <h4 className="font-bold text-gray-900">Cash on Delivery</h4>
                                            <p className="text-sm text-gray-500">Pay when you receive</p>
                                        </div>
                                    </div>

                                    <div
                                        onClick={() => setPaymentMethod("online")}
                                        className={`cursor-pointer p-6 rounded-2xl border-2 transition-all flex items-center gap-4 ${paymentMethod === "online"
                                            ? "border-green-600 bg-green-50 shadow-md"
                                            : "border-gray-100 bg-white hover:border-gray-200"
                                            }`}
                                    >
                                        <div className={`p-3 rounded-xl ${paymentMethod === "online" ? "bg-green-600 text-white" : "bg-gray-100 text-gray-500"}`}>
                                            <CreditCard size={24} />
                                        </div>
                                        <div>
                                            <h4 className="font-bold text-gray-900">Online Payment</h4>
                                            <p className="text-sm text-gray-500">Razorpay / UPI / Cards</p>
                                        </div>
                                    </div>
                                </div>

                                <div className="mt-6 flex items-center gap-2 text-sm text-gray-500 justify-center bg-gray-50 py-3 rounded-xl">
                                    <ShieldCheck size={16} className="text-green-600" />
                                    <span>Secure payments handled by Razorpay encryption</span>
                                </div>
                            </div>
                        </div>

                        {/* Order Summary */}
                        <div className="lg:col-span-1">
                            <div className="bg-white rounded-3xl p-8 shadow-sm border border-gray-100 sticky top-24">
                                <h3 className="text-2xl font-bold text-gray-900 mb-6">Order Summary</h3>

                                <div className="space-y-4 mb-6 max-h-80 overflow-y-auto pr-2 custom-scrollbar">
                                    {cartItems.map(item => (
                                        <div key={item.id} className="flex gap-4">
                                            <div className="w-16 h-16 bg-gray-50 rounded-xl overflow-hidden shrink-0 border border-gray-100">
                                                <img
                                                    src={item.product?.image || "https://via.placeholder.com/100"}
                                                    alt={item.product?.name}
                                                    className="w-full h-full object-cover"
                                                />
                                            </div>
                                            <div className="flex-grow">
                                                <h4 className="font-semibold text-sm line-clamp-2 text-gray-800">{item.product?.name}</h4>
                                                <p className="text-gray-500 text-xs mt-1">Qty: {item.quantity}</p>
                                                <p className="font-bold text-green-700 mt-1">₹{(item.product?.price || 0) * item.quantity}</p>
                                            </div>
                                        </div>
                                    ))}
                                </div>

                                <div className="border-t border-gray-100 pt-6 space-y-4">
                                    <div className="flex justify-between text-gray-600">
                                        <span>Subtotal</span>
                                        <span className="font-bold text-gray-900">₹{subtotal}</span>
                                    </div>
                                    <div className="flex justify-between text-gray-600">
                                        <span>Shipping</span>
                                        <span className={`font-bold ${shipping === 0 ? "text-green-600" : "text-gray-900"}`}>
                                            {shipping === 0 ? "FREE" : `₹${shipping}`}
                                        </span>
                                    </div>
                                    <div className="border-t border-gray-100 pt-4">
                                        <div className="flex justify-between items-center">
                                            <span className="text-gray-900 font-bold">Total Amount</span>
                                            <span className="text-3xl font-black text-green-800">₹{total}</span>
                                        </div>
                                    </div>
                                </div>

                                <button
                                    type="submit"
                                    disabled={loading}
                                    className="w-full mt-8 bg-green-700 text-white py-4 rounded-2xl font-bold text-lg hover:bg-green-800 transition-all shadow-lg hover:shadow-xl hover:-translate-y-1 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-3"
                                >
                                    {loading ? (
                                        <>
                                            <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                                            <span>Processing...</span>
                                        </>
                                    ) : (
                                        <span>{paymentMethod === "cod" ? "Place COD Order" : "Proceed to Payment"}</span>
                                    )}
                                </button>

                                <p className="text-[10px] text-gray-400 text-center mt-6 leading-relaxed">
                                    By placing this order, you agree to BioProx Plant Care's <br />
                                    <span className="underline cursor-pointer">Terms of Service</span> and <span className="underline cursor-pointer">Privacy Policy</span>
                                </p>
                            </div>
                        </div>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default Checkout;
