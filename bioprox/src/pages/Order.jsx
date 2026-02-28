import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Package, ChevronRight, Calendar, MapPin, CreditCard, ShoppingBag } from "lucide-react";
import { getOrders } from "../api/orderService";

const Order = () => {
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchOrders();
        window.scrollTo(0, 0);
    }, []);

    const fetchOrders = async () => {
        setLoading(true);
        try {
            const res = await getOrders();
            const data = res.data.data || res.data || [];
            setOrders(Array.isArray(data) ? data : []);
        } catch (error) {
            console.error("Error fetching orders:", error);
            setOrders([]);
        } finally {
            setLoading(false);
        }
    };

    const getStatusStyles = (status) => {
        const s = status?.toLowerCase();
        switch (s) {
            case 'delivered':
                return "bg-secondary/10 text-secondary border-secondary/20";
            case 'pending':
                return "bg-accent/10 text-accent border-accent/20";
            case 'processing':
                return "bg-blue-50 text-blue-600 border-blue-100";
            case 'cancelled':
                return "bg-red-50 text-red-600 border-red-100";
            default:
                return "bg-gray-50 text-gray-600 border-gray-100";
        }
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-bg-soft/30 py-20">
                <div className="container mx-auto px-6">
                    <div className="h-10 w-48 bg-gray-200 rounded-lg animate-pulse mb-12"></div>
                    <div className="space-y-6">
                        {[1, 2, 3].map(i => (
                            <div key={i} className="h-40 bg-white rounded-3xl animate-pulse shadow-sm"></div>
                        ))}
                    </div>
                </div>
            </div>
        );
    }

    if (orders.length === 0) {
        return (
            <div className="min-h-[80vh] flex items-center justify-center bg-white px-6">
                <div className="text-center max-w-md">
                    <div className="w-24 h-24 bg-bg-soft rounded-full flex items-center justify-center mx-auto mb-8 text-primary/20">
                        <ShoppingBag size={48} />
                    </div>
                    <h2 className="text-3xl font-display font-black text-primary mb-4">No orders yet?</h2>
                    <p className="text-dark/50 font-medium mb-10">
                        Your garden is waiting for its first botanical companions. Explore our premium collection today.
                    </p>
                    <Link to="/shop" className="btn-primary w-full py-4 text-lg shadow-xl shadow-primary/10">
                        Start Shopping
                    </Link>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-bg-soft/30 py-20 relative overflow-hidden">
            {/* Background Accents */}
            <div className="absolute top-0 right-0 w-96 h-96 bg-secondary/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2 pointer-events-none" />
            <div className="absolute bottom-0 left-0 w-96 h-96 bg-primary/5 rounded-full blur-3xl translate-y-1/2 -translate-x-1/2 pointer-events-none" />

            <div className="container relative z-10 mx-auto px-6">
                <div className="flex flex-col md:flex-row justify-between items-end mb-12 gap-6">
                    <div>
                        <h1 className="text-4xl md:text-5xl font-display font-black text-primary mb-2">My Purchase History</h1>
                        <p className="text-dark/40 font-medium tracking-tight">Manage and track your organic botanical orders.</p>
                    </div>
                    <div className="bg-white px-4 py-2 rounded-xl border border-gray-100 shadow-sm text-xs font-black uppercase tracking-widest text-primary">
                        Total Orders: {orders.length}
                    </div>
                </div>

                <div className="space-y-6">
                    {orders.map((order, i) => (
                        <motion.div
                            key={order.id}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: i * 0.1 }}
                            className="group bg-white rounded-3xl border border-gray-100 p-6 md:p-8 hover:shadow-2xl hover:border-secondary/20 transition-all duration-500"
                        >
                            <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-8">
                                <div className="flex-grow">
                                    <div className="flex flex-wrap items-center gap-4 mb-4">
                                        <div className="bg-primary/5 text-primary px-4 py-1.5 rounded-lg text-xs font-black uppercase tracking-widest">
                                            Order #{order.id}
                                        </div>
                                        <div className={`px-4 py-1.5 rounded-lg text-[10px] font-black uppercase tracking-widest border ${getStatusStyles(order.status)}`}>
                                            {order.status || 'Pending'}
                                        </div>
                                    </div>

                                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
                                        <div className="flex items-center gap-3">
                                            <div className="w-10 h-10 rounded-xl bg-bg-soft flex items-center justify-center text-primary/40">
                                                <Calendar size={18} />
                                            </div>
                                            <div>
                                                <p className="text-[10px] font-black uppercase tracking-widest text-dark/30 mb-0.5">Order Date</p>
                                                <p className="text-sm font-bold text-primary">
                                                    {new Date(order.created_at).toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' })}
                                                </p>
                                            </div>
                                        </div>

                                        <div className="flex items-center gap-3">
                                            <div className="w-10 h-10 rounded-xl bg-bg-soft flex items-center justify-center text-primary/40">
                                                <CreditCard size={18} />
                                            </div>
                                            <div>
                                                <p className="text-[10px] font-black uppercase tracking-widest text-dark/30 mb-0.5">Total Amount</p>
                                                <p className="text-sm font-bold text-primary">₹{order.net_amount || order.total_amount}</p>
                                            </div>
                                        </div>

                                        <div className="flex items-center gap-3">
                                            <div className="w-10 h-10 rounded-xl bg-bg-soft flex items-center justify-center text-primary/40">
                                                <Package size={18} />
                                            </div>
                                            <div>
                                                <p className="text-[10px] font-black uppercase tracking-widest text-dark/30 mb-0.5">Item Count</p>
                                                <p className="text-sm font-bold text-primary">{order.items?.length || 0} Products</p>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Product Previews */}
                                    {order.items && order.items.length > 0 && (
                                        <div className="flex flex-wrap gap-3">
                                            {order.items.slice(0, 5).map((item, idx) => (
                                                <div key={idx} className="w-14 h-14 rounded-xl border border-gray-100 p-1 bg-white shadow-sm overflow-hidden group/thumb relative">
                                                    <img
                                                        src={item.product?.image ? (item.product.image.startsWith('http') ? item.product.image : `${import.meta.env.VITE_API_URL}/storage/${item.product.image}`) : "https://via.placeholder.com/100?text=P"}
                                                        alt={item.product?.name}
                                                        className="w-full h-full object-contain group-hover/thumb:scale-110 transition-transform duration-500"
                                                    />
                                                </div>
                                            ))}
                                            {order.items.length > 5 && (
                                                <div className="w-14 h-14 rounded-xl bg-bg-soft flex items-center justify-center text-[10px] font-black text-primary border border-dashed border-primary/20">
                                                    +{order.items.length - 5}
                                                </div>
                                            )}
                                        </div>
                                    )}
                                </div>

                                <div className="flex lg:flex-col gap-4">
                                    <Link
                                        to={`/orders/${order.id}`}
                                        className="btn-primary flex-grow lg:flex-grow-0 px-8 py-3.5 shadow-lg shadow-primary/10"
                                    >
                                        Order Details
                                        <ChevronRight size={18} />
                                    </Link>
                                    <button className="btn-outline flex-grow lg:flex-grow-0 px-8 py-3.5 border-gray-200">
                                        Need Help?
                                    </button>
                                </div>
                            </div>
                        </motion.div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default Order;
