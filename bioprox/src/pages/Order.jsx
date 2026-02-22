import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { getOrders } from "../api/orderService";

const Order = () => {
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchOrders();
    }, []);

    const fetchOrders = async () => {
        setLoading(true);
        try {
            const res = await getOrders();
            setOrders(res.data.data || res.data || []);
        } catch (error) {
            console.error("Error fetching orders:", error);
            setOrders([]);
        } finally {
            setLoading(false);
        }
    };

    const getStatusColor = (status) => {
        const colors = {
            pending: "bg-yellow-100 text-yellow-800",
            processing: "bg-blue-100 text-blue-800",
            shipped: "bg-purple-100 text-purple-800",
            delivered: "bg-green-100 text-green-800",
            cancelled: "bg-red-100 text-red-800"
        };
        return colors[status] || "bg-gray-100 text-gray-800";
    };

    if (loading) {
        return (
            <div className="container mx-auto px-6 py-12">
                <h1 className="text-4xl font-bold text-green-900 mb-8">My Orders</h1>
                <div className="space-y-4">
                    {[...Array(3)].map((_, i) => (
                        <div key={i} className="bg-white rounded-2xl p-6 animate-pulse">
                            <div className="bg-gray-200 h-6 rounded w-1/4 mb-4"></div>
                            <div className="bg-gray-200 h-4 rounded w-1/2 mb-4"></div>
                            <div className="bg-gray-200 h-8 rounded w-full"></div>
                        </div>
                    ))}
                </div>
            </div>
        );
    }

    if (orders.length === 0) {
        return (
            <div className="min-h-[70vh] flex items-center justify-center bg-gray-50">
                <div className="text-center">
                    <div className="text-8xl mb-6">📦</div>
                    <h2 className="text-3xl font-bold text-gray-900 mb-4">No orders yet</h2>
                    <p className="text-gray-600 mb-8">Start shopping to see your orders here</p>
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
                <h1 className="text-4xl md:text-5xl font-bold text-green-900 mb-8">My Orders</h1>

                <div className="space-y-6">
                    {orders.map(order => (
                        <div key={order.id} className="bg-white rounded-2xl p-6 md:p-8 shadow-sm hover:shadow-lg transition">
                            <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6">
                                <div>
                                    <h3 className="text-xl font-bold text-gray-900 mb-2">
                                        Order #{order.id}
                                    </h3>
                                    <p className="text-gray-600 text-sm">
                                        Placed on {new Date(order.created_at).toLocaleDateString('en-IN', {
                                            year: 'numeric',
                                            month: 'long',
                                            day: 'numeric'
                                        })}
                                    </p>
                                </div>
                                <div className="mt-4 md:mt-0">
                                    <span className={`px-4 py-2 rounded-full font-semibold text-sm ${getStatusColor(order.status)}`}>
                                        {order.status?.toUpperCase()}
                                    </span>
                                </div>
                            </div>

                            <div className="grid md:grid-cols-2 gap-6 mb-6">
                                <div>
                                    <h4 className="font-semibold text-gray-900 mb-3">Shipping Address</h4>
                                    <p className="text-gray-600 text-sm leading-relaxed">
                                        {order.shipping_address || order.address}<br />
                                        {order.city && `${order.city}, `}{order.state} {order.pincode && `- ${order.pincode}`}<br />
                                        {order.phone && `📞 ${order.phone}`}
                                    </p>
                                </div>

                                <div>
                                    <h4 className="font-semibold text-gray-900 mb-3">Order Summary</h4>
                                    <div className="space-y-1 text-sm">
                                        <div className="flex justify-between text-gray-600">
                                            <span>Items ({order.items?.length || 0})</span>
                                            <span>₹{order.total_amount || 0}</span>
                                        </div>
                                        <div className="flex justify-between text-gray-600">
                                            <span>Shipping</span>
                                            <span>₹{order.shipping_amount ?? 0}</span>
                                        </div>
                                        <div className="flex justify-between font-bold text-gray-900 pt-2 border-t">
                                            <span>Total</span>
                                            <span className="text-green-700">₹{order.net_amount || order.total || 0}</span>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {order.items && order.items.length > 0 && (
                                <div className="border-t pt-6">
                                    <h4 className="font-semibold text-gray-900 mb-4">Items</h4>
                                    <div className="space-y-3">
                                        {order.items.map((item, idx) => (
                                            <div key={idx} className="flex gap-4">
                                                <div className="w-16 h-16 bg-gray-100 rounded-lg overflow-hidden shrink-0">
                                                    <img
                                                        src={item.product?.image ? `${import.meta.env.VITE_API_URL || ''}/storage/${item.product.image}` : "https://via.placeholder.com/100"}
                                                        alt={item.product?.name}
                                                        className="w-full h-full object-cover"
                                                        onError={(e) => { e.target.onerror = null; e.target.src = "https://via.placeholder.com/100?text=No+Image"; }}
                                                    />
                                                </div>
                                                <div className="flex-grow">
                                                    <h5 className="font-semibold text-sm">{item.product?.name}</h5>
                                                    <p className="text-gray-600 text-sm">Qty: {item.quantity} × ₹{item.price}</p>
                                                </div>
                                                <div className="text-right">
                                                    <p className="font-bold text-green-700">₹{item.total || (item.quantity * item.price)}</p>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}

                            <div className="flex gap-4 mt-6 pt-6 border-t">
                                <Link
                                    to={`/orders/${order.id}`}
                                    className="bg-green-700 text-white px-6 py-3 rounded-xl font-semibold hover:bg-green-800 transition"
                                >
                                    View Details
                                </Link>
                                {order.status === 'pending' && (
                                    <button className="border-2 border-red-600 text-red-600 px-6 py-3 rounded-xl font-semibold hover:bg-red-50 transition">
                                        Cancel Order
                                    </button>
                                )}
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default Order;
