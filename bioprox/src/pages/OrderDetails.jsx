import { useState, useEffect } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import Swal from "sweetalert2";
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
    Phone,
    Mail,
    User,
    XCircle
} from "lucide-react";
import Loader from "../components/common/Loader";

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
            text: "This action cannot be undone.",
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#EF4444',
            cancelButtonColor: '#10B981',
            confirmButtonText: 'Yes, cancel it',
        });

        if (result.isConfirmed) {
            try {
                await cancelOrder(id);
                toast.success('Order cancelled successfully');
                fetchOrder();
            } catch (err) {
                toast.error(err.response?.data?.message || 'Failed to cancel order');
            }
        }
    };

    if (loading) return <Loader fullScreen={true} text="Loading Order Details..." />;
    if (!order) return null;

    const apiBase = import.meta.env.VITE_API_URL || '';

    const getStatusColor = (status) => {
        const s = status?.toLowerCase();
        switch (s) {
            case 'pending': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
            case 'processing': return 'bg-blue-100 text-blue-800 border-blue-200';
            case 'shipped': return 'bg-purple-100 text-purple-800 border-purple-200';
            case 'delivered': return 'bg-green-100 text-green-800 border-green-200';
            case 'cancelled': return 'bg-red-100 text-red-800 border-red-200';
            default: return 'bg-gray-100 text-gray-800 border-gray-200';
        }
    };

    const steps = ['pending', 'processing', 'shipped', 'delivered'];
    const currentStatusIndex = steps.indexOf(order.status?.toLowerCase());
    const isCancelled = order.status?.toLowerCase() === 'cancelled';

    return (
        <div className="bg-gray-50 min-h-screen py-10 pb-20">
            <div className="container mx-auto px-4 max-w-6xl">
                
                {/* Back Button */}
                <Link to="/orders" className="inline-flex items-center text-sm font-medium text-gray-500 hover:text-primary mb-6 transition-colors">
                    <ArrowLeft size={16} className="mr-2" />
                    Back to Orders
                </Link>

                {/* Header Section */}
                <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 mb-8 flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div>
                        <div className="flex flex-wrap items-center gap-3 mb-2">
                            <h1 className="text-2xl font-bold text-gray-900">Order #{order.order_number || order.id}</h1>
                            <span className={`px-3 py-1 rounded-full text-xs font-semibold border ${getStatusColor(order.status)} uppercase tracking-wider`}>
                                {order.status}
                            </span>
                        </div>
                        <p className="text-sm text-gray-500">
                            Placed on {new Date(order.created_at).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit' })}
                        </p>
                    </div>
                    
                    <div className="flex items-center gap-3">
                        <button 
                            onClick={() => window.print()}
                            className="flex items-center justify-center gap-2 px-5 py-2.5 bg-white border border-gray-200 text-gray-700 rounded-xl hover:bg-gray-50 font-medium text-sm transition-colors w-full md:w-auto shadow-sm"
                        >
                            <Printer size={16} />
                            Print Receipt
                        </button>
                        {order.status?.toLowerCase() === 'pending' && (
                            <button 
                                onClick={handleCancelOrder}
                                className="flex items-center justify-center gap-2 px-5 py-2.5 bg-white border border-red-200 text-red-600 rounded-xl hover:bg-red-50 font-medium text-sm transition-colors w-full md:w-auto shadow-sm"
                            >
                                <XCircle size={16} />
                                Cancel Order
                            </button>
                        )}
                    </div>
                </div>

                {/* Order Status Tracker */}
                {!isCancelled && (
                    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 md:p-10 mb-8 overflow-hidden">
                        <h2 className="text-lg font-bold text-gray-900 mb-8">Order Status</h2>
                        <div className="relative">
                            {/* Progress Line */}
                            <div className="absolute top-1/2 left-0 w-full h-1 bg-gray-100 -translate-y-1/2 rounded-full hidden sm:block"></div>
                            <div 
                                className="absolute top-1/2 left-0 h-1 bg-primary -translate-y-1/2 rounded-full transition-all duration-500 hidden sm:block"
                                style={{ width: `${(Math.max(0, currentStatusIndex) / (steps.length - 1)) * 100}%` }}
                            ></div>

                            <div className="flex flex-col sm:flex-row justify-between relative z-10 gap-8 sm:gap-0">
                                {steps.map((step, index) => {
                                    const isCompleted = index <= currentStatusIndex;
                                    const isCurrent = index === currentStatusIndex;
                                    
                                    let Icon = Clock;
                                    if (step === 'processing') Icon = Package;
                                    if (step === 'shipped') Icon = Truck;
                                    if (step === 'delivered') Icon = CheckCircle;

                                    return (
                                        <div key={step} className="flex sm:flex-col items-center gap-4 sm:gap-3 flex-1 sm:text-center relative">
                                            {/* Mobile Vertical Line */}
                                            {index !== steps.length - 1 && (
                                                 <div className={`absolute left-5 sm:hidden w-1 h-full -bottom-10 z-[-1] ${isCompleted ? 'bg-primary' : 'bg-gray-100'}`}></div>
                                            )}

                                            <div className={`w-10 h-10 sm:w-12 sm:h-12 rounded-full flex items-center justify-center border-4 border-white shadow-sm transition-colors duration-300 z-10 ${
                                                isCompleted ? 'bg-primary text-white' : 'bg-gray-100 text-gray-400'
                                            }`}>
                                                <Icon size={isCurrent ? 24 : 20} />
                                            </div>
                                            <div>
                                                <p className={`text-sm font-bold capitalize ${isCompleted ? 'text-gray-900' : 'text-gray-400'}`}>
                                                    {step}
                                                </p>
                                                {isCurrent && (
                                                    <p className="text-xs text-primary font-medium mt-1 hidden sm:block">Current Stage</p>
                                                )}
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                        </div>
                    </div>
                )}

                {/* Main Content Grid */}
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                    
                    {/* Left Column: Order Items */}
                    <div className="lg:col-span-8">
                        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                            <div className="px-6 py-4 border-b border-gray-100 bg-gray-50/50">
                                <h2 className="text-lg font-bold text-gray-900">Order Items</h2>
                            </div>
                            
                            <div className="divide-y divide-gray-100">
                                {order.items?.map((item, i) => (
                                    <div key={i} className="p-6 flex flex-col sm:flex-row items-start sm:items-center gap-4 hover:bg-gray-50/50 transition-colors">
                                        {/* Product Image */}
                                        <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-xl border border-gray-100 bg-white overflow-hidden flex-shrink-0">
                                            <img 
                                                src={item.product?.image ? (item.product.image.startsWith('http') ? item.product.image : `${apiBase}/storage/${item.product.image}`) : "https://via.placeholder.com/150?text=Product"}
                                                alt={item.product?.name}
                                                className="w-full h-full object-cover"
                                            />
                                        </div>
                                        
                                        {/* Product Details */}
                                        <div className="flex-1 min-w-0">
                                            <h3 className="text-base font-bold text-gray-900 mb-1 truncate">{item.product?.name}</h3>
                                            <p className="text-sm text-gray-500 mb-2">
                                                Category: <span className="font-medium text-gray-700">{item.product?.category?.name || 'N/A'}</span>
                                            </p>
                                            <div className="flex items-center gap-4">
                                                <div className="bg-gray-100 px-3 py-1 rounded-lg">
                                                    <p className="text-xs text-gray-500 font-medium">Qty: <span className="text-gray-900 font-bold">{item.quantity}</span></p>
                                                </div>
                                                <p className="text-sm font-bold text-gray-900">₹{item.price}</p>
                                            </div>
                                        </div>
                                        
                                        {/* Item Total */}
                                        <div className="sm:text-right mt-4 sm:mt-0 w-full sm:w-auto flex justify-between sm:block border-t sm:border-0 pt-4 sm:pt-0 border-gray-100">
                                            <p className="text-xs text-gray-500 font-medium mb-1 sm:block hidden">Total</p>
                                            <p className="text-sm text-gray-500 font-medium sm:hidden">Item Total</p>
                                            <p className="text-lg font-bold text-primary">₹{item.total || (item.quantity * item.price)}</p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>

                    {/* Right Column: Delivery & Payment Summary */}
                    <div className="lg:col-span-4 space-y-8">
                        
                        {/* Delivery Details */}
                        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                            <div className="px-6 py-4 border-b border-gray-100 bg-gray-50/50">
                                <h2 className="text-lg font-bold text-gray-900">Delivery Details</h2>
                            </div>
                            <div className="p-6 space-y-4">
                                <div className="flex items-start gap-3">
                                    <User size={18} className="text-gray-400 mt-0.5" />
                                    <div>
                                        <p className="text-xs text-gray-500 font-medium mb-0.5">Customer</p>
                                        <p className="text-sm font-bold text-gray-900">{order.user?.name || 'Guest User'}</p>
                                    </div>
                                </div>
                                <div className="flex items-start gap-3">
                                    <MapPin size={18} className="text-gray-400 mt-0.5" />
                                    <div>
                                        <p className="text-xs text-gray-500 font-medium mb-0.5">Shipping Address</p>
                                        <p className="text-sm text-gray-700 leading-relaxed">
                                            {order.shipping_address || order.address}<br />
                                            {order.city && `${order.city}, `}{order.state} {order.pincode && `- ${order.pincode}`}
                                        </p>
                                    </div>
                                </div>
                                <div className="flex items-start gap-3">
                                    <Phone size={18} className="text-gray-400 mt-0.5" />
                                    <div>
                                        <p className="text-xs text-gray-500 font-medium mb-0.5">Phone</p>
                                        <p className="text-sm text-gray-700">{order.phone || 'N/A'}</p>
                                    </div>
                                </div>
                                <div className="flex items-start gap-3">
                                    <Mail size={18} className="text-gray-400 mt-0.5" />
                                    <div>
                                        <p className="text-xs text-gray-500 font-medium mb-0.5">Email</p>
                                        <p className="text-sm text-gray-700 break-all">{order.email || 'N/A'}</p>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Payment Summary */}
                        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                            <div className="px-6 py-4 border-b border-gray-100 bg-gray-50/50 flex items-center justify-between">
                                <h2 className="text-lg font-bold text-gray-900">Payment Summary</h2>
                                <CreditCard size={20} className="text-gray-400" />
                            </div>
                            <div className="p-6">
                                <div className="space-y-4 mb-6">
                                    <div className="flex justify-between items-center text-sm">
                                        <span className="text-gray-500">Subtotal</span>
                                        <span className="font-bold text-gray-900">₹{order.total_amount || order.subtotal || 0}</span>
                                    </div>
                                    <div className="flex justify-between items-center text-sm">
                                        <span className="text-gray-500">Shipping</span>
                                        <span className="font-bold text-gray-900">{(!order.shipping_amount || order.shipping_amount === 0) ? 'Free' : `₹${order.shipping_amount}`}</span>
                                    </div>
                                    {order.coupon_discount > 0 && (
                                        <div className="flex justify-between items-center text-sm">
                                            <span className="text-gray-500">Discount</span>
                                            <span className="font-bold text-red-500">-₹{order.coupon_discount}</span>
                                        </div>
                                    )}
                                </div>
                                <div className="border-t border-dashed border-gray-200 pt-4 pb-2">
                                    <div className="flex justify-between items-center">
                                        <span className="text-base font-bold text-gray-900">Total Amount</span>
                                        <span className="text-2xl font-black text-primary">₹{order.net_amount || order.total}</span>
                                    </div>
                                    <div className="mt-2 text-right">
                                        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-[10px] font-bold uppercase tracking-wider bg-gray-100 text-gray-600">
                                            {order.payment_status === 'paid' ? (
                                                <><CheckCircle size={12} className="text-green-500"/> Paid via {order.payment_method || 'Online'}</>
                                            ) : (
                                                <><Clock size={12} className="text-yellow-500"/> Pending Payment</>
                                            )}
                                        </span>
                                    </div>
                                </div>
                            </div>
                        </div>

                    </div>
                </div>
            </div>
            
            {/* Print Styles */}
            <style>
                {`
                @media print {
                    body { background: white !important; margin: 0 !important; color: #111827 !important; }
                    .container { max-width: 100% !important; padding: 0 !important; }
                    button, a { display: none !important; }
                    .shadow-sm { box-shadow: none !important; }
                    .border { border-color: #e5e7eb !important; }
                    * { -webkit-print-color-adjust: exact !important; print-color-adjust: exact !important; }
                    @page { margin: 1cm; }
                }
                `}
            </style>
        </div>
    );
};

export default OrderDetails;
