import { useState, useEffect } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import Swal from "sweetalert2";
import toast from "react-hot-toast";
import { getOrderById, cancelOrder } from "../api/orderService";
import {
    ArrowLeft,
    Package,
    Truck,
    CheckCircle,
    Clock,
    Printer,
    MapPin,
    CreditCard,
    ShoppingBag,
    ChevronRight,
    HelpCircle,
    XCircle
} from "lucide-react";

const OrderDetails = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [order, setOrder] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchOrder();
        window.scrollTo(0, 0);
    }, [id]);

    const fetchOrder = async () => {
        setLoading(true);
        try {
            const res = await getOrderById(id);
            setOrder(res.data.data || res.data);
        } catch (error) {
            console.error("Error fetching order:", error);
            navigate("/orders");
        } finally {
            setLoading(false);
        }
    };

    const handleCancelOrder = async () => {
        const result = await Swal.fire({
            title: 'Cancel this order?',
            text: "This action cannot be undone and will stop your botanical delivery.",
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#EF4444',
            cancelButtonColor: '#10B981',
            confirmButtonText: 'Yes, cancel it',
            customClass: {
                popup: 'rounded-3xl border-none',
                confirmButton: 'rounded-xl px-8 py-3',
                cancelButton: 'rounded-xl px-8 py-3'
            }
        });

        if (result.isConfirmed) {
            try {
                await cancelOrder(id);
                Swal.fire({
                    title: 'Cancelled!',
                    text: 'Your order has been officially cancelled.',
                    icon: 'success',
                    customClass: { popup: 'rounded-3xl' }
                });
                fetchOrder();
            } catch (err) {
                toast.error(err.response?.data?.message || 'Failed to cancel order');
            }
        }
    };

    const getStatusConfig = (status) => {
        const s = status?.toLowerCase();
        const configs = {
            pending: { color: 'text-accent', bg: 'bg-accent/10', icon: Clock, label: 'Payment Pending' },
            processing: { color: 'text-blue-500', bg: 'bg-blue-50', icon: Package, label: 'Order Processing' },
            shipped: { color: 'text-purple-500', bg: 'bg-purple-50', icon: Truck, label: 'On its Way' },
            delivered: { color: 'text-secondary', bg: 'bg-secondary/10', icon: CheckCircle, label: 'Successfully Delivered' },
            cancelled: { color: 'text-red-500', bg: 'bg-red-50', icon: XCircle, label: 'Order Cancelled' }
        };
        return configs[s] || configs.pending;
    };

    const getStepStatus = (stepName, currentStatus) => {
        const steps = ['pending', 'processing', 'shipped', 'delivered'];
        const currentIndex = steps.indexOf(currentStatus?.toLowerCase());
        const stepIndex = steps.indexOf(stepName);

        if (currentStatus?.toLowerCase() === 'cancelled') return 'cancelled';
        if (stepIndex < currentIndex) return 'completed';
        if (stepIndex === currentIndex) return 'current';
        return 'upcoming';
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-bg-soft/30 py-20">
                <div className="container mx-auto px-6">
                    <div className="h-6 w-32 bg-gray-200 rounded animate-pulse mb-8"></div>
                    <div className="bg-white rounded-[2.5rem] p-12 shadow-sm animate-pulse h-96"></div>
                </div>
            </div>
        );
    }

    if (!order) return null;

    const statusConfig = getStatusConfig(order.status);
    const apiBase = import.meta.env.VITE_API_URL || '';

    return (
        <div className="min-h-screen bg-bg-soft/30 py-12 md:py-20 relative overflow-hidden print:bg-white print:p-0">
            {/* Background Decorations */}
            <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-secondary/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2 pointer-events-none no-print" />

            <div className="container relative z-10 mx-auto px-6 sm:px-8 max-w-6xl">

                {/* Invoice View (Print Only) */}
                <div className="hidden print:block mb-12 border-b-2 border-gray-100 pb-12">
                    <div className="flex justify-between items-start">
                        <div>
                            <div className="flex items-center gap-3 mb-4">
                                <div className="w-12 h-12 bg-primary rounded-xl flex items-center justify-center text-white text-2xl font-black">B</div>
                                <h1 className="text-4xl font-display font-black text-primary tracking-tighter">BIOPROX</h1>
                            </div>
                            <div className="text-dark/50 font-medium leading-relaxed">
                                <p>BioProx Botanical Care Pvt Ltd</p>
                                <p>102 Green Enclave, Pune - 411045</p>
                                <p>Maharashtra, India</p>
                                <p>GSTIN: 27AABCB1234F1Z5</p>
                            </div>
                        </div>
                        <div className="text-right">
                            <h2 className="text-5xl font-display font-black text-primary/10 mb-6 uppercase">Tax Invoice</h2>
                            <div className="space-y-2 text-sm">
                                <p><span className="text-dark/40 uppercase font-black tracking-widest mr-4">Order ID:</span> <span className="font-bold">#{order.order_number || order.id}</span></p>
                                <p><span className="text-dark/40 uppercase font-black tracking-widest mr-4">Date:</span> <span className="font-bold">{new Date(order.created_at).toLocaleDateString()}</span></p>
                                <p><span className="text-dark/40 uppercase font-black tracking-widest mr-4">Payment:</span> <span className="font-bold uppercase">{order.payment_method || 'Razorpay'}</span></p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Back Link */}
                <div className="mb-10 no-print">
                    <Link to="/orders" className="group inline-flex items-center gap-2 text-dark/40 font-black uppercase tracking-widest text-xs hover:text-primary transition-colors">
                        <ArrowLeft size={16} className="transition-transform group-hover:-translate-x-1" />
                        Back to My Orders
                    </Link>
                </div>

                {/* Header Card */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="bg-white rounded-[2.5rem] border border-gray-100 p-8 md:p-12 mb-8 shadow-xl shadow-primary/5 no-print"
                >
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-8 mb-12">
                        <div>
                            <div className="flex flex-wrap items-center gap-4 mb-4">
                                <h1 className="text-4xl font-display font-black text-primary tracking-tight">Order #{order.id}</h1>
                                <div className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-black uppercase tracking-widest ${statusConfig.bg} ${statusConfig.color}`}>
                                    <statusConfig.icon size={16} />
                                    {statusConfig.label}
                                </div>
                            </div>
                            <p className="text-dark/40 font-medium flex items-center gap-2">
                                <Calendar size={16} />
                                Placed on {new Date(order.created_at).toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric', hour: '2-digit', minute: '2-digit' })}
                            </p>
                        </div>
                        <div className="flex gap-4">
                            <button
                                onClick={() => window.print()}
                                className="btn-outline px-8 py-3.5 border-gray-100 flex items-center gap-2"
                            >
                                <Printer size={18} />
                                Print Receipt
                            </button>
                            {order.status?.toLowerCase() === 'pending' && (
                                <button
                                    onClick={handleCancelOrder}
                                    className="px-8 py-3.5 bg-red-50 text-red-500 rounded-2xl font-black uppercase tracking-widest text-xs hover:bg-red-500 hover:text-white transition-all shadow-lg shadow-red-500/10"
                                >
                                    Cancel Order
                                </button>
                            )}
                        </div>
                    </div>

                    {/* Stepper */}
                    {order.status?.toLowerCase() !== 'cancelled' && (
                        <div className="relative pt-4 pb-8 border-t border-gray-50 mt-12">
                            <div className="flex justify-between relative z-10">
                                {['Pending', 'Processing', 'Shipped', 'Delivered'].map((step, idx) => {
                                    const state = getStepStatus(step, order.status);
                                    return (
                                        <div key={step} className="flex flex-col items-center flex-1">
                                            <div className={`w-10 h-10 sm:w-14 sm:h-14 rounded-xl sm:rounded-2xl flex items-center justify-center transition-all duration-500 mb-2 sm:mb-4 ${state === 'completed' ? 'bg-secondary text-white shadow-xl shadow-secondary/20' :
                                                state === 'current' ? 'bg-primary text-white shadow-xl shadow-primary/20 scale-110' :
                                                    'bg-bg-soft text-dark/20'
                                                }`}>
                                                {state === 'completed' ? <CheckCircle size={24} /> :
                                                    step === 'Pending' ? <Clock size={24} /> :
                                                        step === 'Processing' ? <Package size={24} /> :
                                                            step === 'Shipped' ? <Truck size={24} /> :
                                                                <CheckCircle size={24} />}
                                            </div>
                                            <p className={`text-[8px] sm:text-[10px] font-black uppercase tracking-widest text-center ${state === 'upcoming' ? 'text-dark/20' : 'text-primary'
                                                }`}>{step}</p>
                                        </div>
                                    );
                                })}
                            </div>
                            <div className="absolute top-[2.25rem] sm:top-[3.25rem] left-[12.5%] right-[12.5%] h-1 bg-gray-50 -z-0">
                                <motion.div
                                    initial={{ width: 0 }}
                                    animate={{
                                        width: `${(['pending', 'processing', 'shipped', 'delivered'].indexOf(order.status?.toLowerCase()) ?? 0) * 33.33}%`
                                    }}
                                    className="h-full bg-secondary rounded-full shadow-[0_0_10px_rgba(16,185,129,0.5)]"
                                />
                            </div>
                        </div>
                    )}
                </motion.div>

                {/* Content Grid */}
                <div className="grid lg:grid-cols-3 gap-8">
                    {/* Items Section */}
                    <div className="lg:col-span-2">
                        <motion.div
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            className="bg-white rounded-[2.5rem] border border-gray-100 p-8 md:p-12 shadow-xl shadow-primary/5 print:border-none print:shadow-none print:p-0"
                        >
                            <h2 className="text-2xl font-display font-black text-primary mb-8 flex items-center gap-3">
                                <ShoppingBag size={24} className="text-secondary" />
                                Order Items
                            </h2>
                            <div className="space-y-8">
                                {order.items?.map((item, i) => (
                                    <div key={i} className="flex flex-col sm:flex-row items-center gap-8 pb-8 border-b border-gray-50 last:border-0">
                                        <div className="w-32 h-32 bg-bg-soft rounded-[2rem] overflow-hidden shrink-0 group border border-gray-100">
                                            <img
                                                src={item.product?.image ? (item.product.image.startsWith('http') ? item.product.image : `${apiBase}/storage/${item.product.image}`) : "https://via.placeholder.com/300?text=Botanical"}
                                                alt={item.product?.name}
                                                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                                            />
                                        </div>
                                        <div className="flex-grow text-center sm:text-left">
                                            <div className="mb-2">
                                                <span className="text-[10px] font-black uppercase tracking-widest text-secondary bg-secondary/10 px-3 py-1 rounded-full">
                                                    {item.product?.category?.name || 'Organic'}
                                                </span>
                                            </div>
                                            <h3 className="text-xl font-display font-black text-primary mb-2">{item.product?.name}</h3>
                                            <div className="flex flex-wrap justify-center sm:justify-start items-center gap-6">
                                                <div>
                                                    <p className="text-[10px] font-black uppercase tracking-widest text-dark/30 mb-0.5">Price</p>
                                                    <p className="text-sm font-bold text-primary">₹{item.price}</p>
                                                </div>
                                                <div>
                                                    <p className="text-[10px] font-black uppercase tracking-widest text-dark/30 mb-0.5">Quantity</p>
                                                    <p className="text-sm font-bold text-primary">{item.quantity} Units</p>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="text-center sm:text-right shrink-0">
                                            <p className="text-[10px] font-black uppercase tracking-widest text-dark/30 mb-0.5">Item Total</p>
                                            <p className="text-2xl font-black text-secondary">₹{item.total || (item.quantity * item.price)}</p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </motion.div>
                    </div>

                    {/* Summary Section */}
                    <div className="lg:col-span-1 space-y-8">
                        {/* Address Card */}
                        <motion.div
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            className="bg-white rounded-[2.5rem] border border-gray-100 p-8 shadow-xl shadow-primary/5 h-fit print:p-6"
                        >
                            <h3 className="text-xl font-display font-black text-primary mb-6 flex items-center gap-3">
                                <MapPin size={20} className="text-secondary" />
                                Delivery Details
                            </h3>
                            <div className="space-y-4">
                                <div className="p-4 bg-bg-soft rounded-2xl border border-gray-50">
                                    <p className="text-sm font-black text-primary mb-1 uppercase tracking-tight">{order.user?.name || 'Customer'}</p>
                                    <p className="text-sm text-dark/60 font-medium leading-relaxed">
                                        {order.shipping_address || order.address}<br />
                                        {order.city && `${order.city}, `}{order.state} {order.pincode && `- ${order.pincode}`}
                                    </p>
                                </div>
                                <div className="flex flex-col gap-2 pt-2">
                                    <p className="text-xs font-bold text-dark/40 flex items-center gap-2 tracking-tight">
                                        <span className="w-1.5 h-1.5 rounded-full bg-secondary" />
                                        {order.phone || '+91 - XXXXXXXXXX'}
                                    </p>
                                    <p className="text-xs font-bold text-dark/40 flex items-center gap-2 tracking-tight">
                                        <span className="w-1.5 h-1.5 rounded-full bg-secondary" />
                                        {order.email || 'support@bioprox.com'}
                                    </p>
                                </div>
                            </div>
                        </motion.div>

                        {/* Totals Card */}
                        <motion.div
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: 0.1 }}
                            className="bg-primary rounded-[2.5rem] p-8 text-white shadow-2xl shadow-primary/20 relative overflow-hidden print:bg-white print:text-primary print:border print:p-6 print:shadow-none"
                        >
                            <div className="absolute top-0 right-0 p-12 opacity-10 pointer-events-none no-print">
                                <CreditCard size={120} />
                            </div>

                            <h3 className="text-xl font-display font-black mb-8 border-b border-white/10 pb-4 print:border-gray-100">Order Summary</h3>
                            <div className="space-y-5 relative z-10">
                                <div className="flex justify-between items-center text-sm font-medium">
                                    <span className="text-white/60 print:text-dark/40 uppercase tracking-widest font-black text-[10px]">Subtotal</span>
                                    <span className="font-bold">₹{order.total_amount || order.subtotal || 0}</span>
                                </div>
                                <div className="flex justify-between items-center text-sm font-medium">
                                    <span className="text-white/60 print:text-dark/40 uppercase tracking-widest font-black text-[10px]">Shipping Fee</span>
                                    <span className="font-bold">{(!order.shipping_amount || order.shipping_amount === 0) ? 'FREE' : `₹${order.shipping_amount}`}</span>
                                </div>
                                {order.coupon_discount > 0 && (
                                    <div className="flex justify-between items-center text-sm font-medium text-secondary">
                                        <span className="uppercase tracking-widest font-black text-[10px]">Discount</span>
                                        <span className="font-bold">-₹{order.coupon_discount}</span>
                                    </div>
                                )}
                                <div className="pt-5 border-t border-white/20 print:border-gray-100 mt-5">
                                    <div className="flex justify-between items-end">
                                        <div>
                                            <p className="text-[10px] font-black uppercase tracking-[0.2em] text-white/40 print:text-dark/20 mb-1">Total Payable</p>
                                            <p className="text-4xl font-display font-black">₹{order.net_amount || order.total}</p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </motion.div>

                        {/* Support Card (no-print) */}
                        <div className="bg-white rounded-[2.5rem] border border-gray-100 p-8 shadow-sm no-print">
                            <h4 className="text-xs font-black uppercase tracking-widest text-primary mb-4 flex items-center gap-2">
                                <HelpCircle size={14} className="text-secondary" />
                                Need Assistance?
                            </h4>
                            <p className="text-xs text-dark/40 font-medium leading-relaxed mb-6">
                                If you have any questions regarding your order, our botanical experts are here to help.
                            </p>
                            <button className="w-full py-3 rounded-xl border border-gray-100 text-[10px] font-black uppercase tracking-widest text-primary hover:bg-bg-soft transition-colors">
                                Contact Support
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            <style>
                {`
                @media screen {
                    .print-only { display: none; }
                }
                @media print {
                    .no-print { display: none !important; }
                    body { background: white !important; margin: 0 !important; color: #002D15 !important; }
                    .container { max-width: 100% !important; padding: 2cm !important; }
                    .print-only { display: block !important; }
                    h1, h2, h3, p { color: #002D15 !important; }
                    * { -webkit-print-color-adjust: exact !important; print-color-adjust: exact !important; }
                    @page { margin: 0; }
                }
                `}
            </style>
        </div>
    );
};

export default OrderDetails;
