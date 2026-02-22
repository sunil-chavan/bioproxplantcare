import { useState, useEffect } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import toast from "react-hot-toast";
import { getOrderById, cancelOrder } from "../api/orderService";
import { ArrowLeft, Package, Truck, CheckCircle, Clock } from "lucide-react";
const OrderDetails = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [order, setOrder] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchOrder();
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
            title: 'Are you sure?',
            text: "You want to cancel this order? This action cannot be undone!",
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#d33',
            cancelButtonColor: '#3085d6',
            confirmButtonText: 'Yes, cancel it!'
        });

        if (result.isConfirmed) {
            try {
                await cancelOrder(id);
                Swal.fire('Cancelled!', 'Order has been cancelled.', 'success');
                fetchOrder(); // Refresh order data
            } catch (err) {
                toast.error(err.response?.data?.message || 'Failed to cancel order');
            }
        }
    };

    const getStatusColor = (status) => {
        const colors = {
            pending: "bg-yellow-100 text-yellow-800 border-yellow-300",
            processing: "bg-blue-100 text-blue-800 border-blue-300",
            shipped: "bg-purple-100 text-purple-800 border-purple-300",
            delivered: "bg-green-100 text-green-800 border-green-300",
            cancelled: "bg-red-100 text-red-800 border-red-300"
        };
        return colors[status] || "bg-gray-100 text-gray-800 border-gray-300";
    };

    const getStatusSteps = (status) => {
        const steps = ['pending', 'processing', 'shipped', 'delivered'];
        const currentIndex = steps.indexOf(status);
        return steps.map((step, index) => ({
            name: step,
            completed: index <= currentIndex,
            current: index === currentIndex
        }));
    };

    if (loading) {
        return (
            <div className="container mx-auto px-6 py-12">
                <div className="bg-white rounded-3xl p-8 animate-pulse">
                    <div className="bg-gray-200 h-8 rounded w-1/3 mb-6"></div>
                    <div className="bg-gray-200 h-64 rounded mb-6"></div>
                    <div className="bg-gray-200 h-32 rounded"></div>
                </div>
            </div>
        );
    }

    if (!order) return null;

    const statusSteps = getStatusSteps(order.status);

    return (
        <div className="bg-gray-50 min-h-screen py-12 main-content">
            <div className="container mx-auto px-6">
                {/* Printable Invoice Header (Hidden on screen) */}
                <div className="print-only mb-10 pb-8 border-b-2">
                    <div className="flex justify-between items-start">
                        <div>
                            <h1 className="text-4xl font-black text-green-800 mb-2">BIOPROX</h1>
                            <p className="text-gray-500 font-medium tracking-tight">Your Green Partner</p>
                            <div className="mt-4 text-sm text-gray-600 leading-relaxed">
                                <p>pune, Maharashtra, India</p>
                                <p>Contact: +91 1234567890</p>
                                <p>Email: support@bioprox.com</p>
                            </div>
                        </div>
                        <div className="text-right">
                            <h2 className="text-2xl font-bold text-gray-900 mb-4">TAX INVOICE</h2>
                            <div className="text-sm text-gray-700 space-y-1">
                                <p><span className="font-bold">Invoice #:</span> {order.order_number || order.id}</p>
                                <p><span className="font-bold">Date:</span> {new Date(order.created_at).toLocaleDateString()}</p>
                                <p><span className="font-bold">Payment Status:</span> {order.payment_status?.toUpperCase()}</p>
                                <p><span className="font-bold">Order Status:</span> {order.status?.toUpperCase()}</p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Header */}
                <div className="mb-8 no-print">
                    <button
                        onClick={() => navigate("/orders")}
                        className="text-green-700 font-semibold hover:underline mb-4 inline-flex items-center gap-2"
                    >
                        ← Back to Orders
                    </button>
                    <div className="flex flex-col md:flex-row md:items-center md:justify-between">
                        <div>
                            <h1 className="text-4xl font-bold text-green-900 mb-2">Order #{order.order_number || order.id}</h1>
                            <p className="text-gray-600">
                                Placed on {new Date(order.created_at).toLocaleDateString('en-IN', {
                                    year: 'numeric',
                                    month: 'long',
                                    day: 'numeric',
                                    hour: '2-digit',
                                    minute: '2-digit'
                                })}
                            </p>
                            <button
                                onClick={() => window.print()}
                                className="mt-4 inline-flex items-center gap-2 text-sm font-medium text-green-700 bg-green-50 px-4 py-2 rounded-lg hover:bg-green-100 transition"
                            >
                                📄 Download Invoice
                            </button>
                        </div>
                        <div className="mt-4 md:mt-0">
                            <span className={`px-6 py-3 rounded-full font-bold border-2 ${getStatusColor(order.status)}`}>
                                {order.status?.toUpperCase()}
                            </span>
                        </div>
                    </div>
                </div>

                {/* Order Tracking */}
                {order.status !== 'cancelled' && (
                    <div className="bg-white rounded-2xl p-8 shadow-lg mb-8 no-print">
                        <h2 className="text-2xl font-bold text-gray-900 mb-8">Order Tracking</h2>
                        <div className="relative">
                            <div className="flex justify-between">
                                {statusSteps.map((step, index) => (
                                    <div key={step.name} className="flex flex-col items-center flex-1">
                                        <div className={`w-12 h-12 rounded-full flex items-center justify-center font-bold border-4 mb-3 ${step.completed ? 'bg-green-700 text-white border-green-700' : 'bg-gray-100 text-gray-400 border-gray-300'}`}>
                                            {step.completed ? '✓' : index + 1}
                                        </div>
                                        <p className={`text-sm font-semibold capitalize ${step.completed ? 'text-gray-900' : 'text-gray-400'}`}>
                                            {step.name}
                                        </p>
                                    </div>
                                ))}
                            </div>
                            <div className="absolute top-6 left-0 right-0 h-1 bg-gray-200 -z-10">
                                <div
                                    className="h-full bg-green-700 transition-all duration-500"
                                    style={{ width: `${(statusSteps.filter(s => s.completed).length - 1) * 33.33}%` }}
                                />
                            </div>
                        </div>
                    </div>
                )}

                <div className="grid lg:grid-cols-3 gap-8">
                    {/* Order Items */}
                    <div className="lg:col-span-2">
                        <div className="bg-white rounded-2xl p-8 shadow-lg invoice-card">
                            <h2 className="text-2xl font-bold text-gray-900 mb-6 invoice-title">Order Items</h2>
                            <div className="space-y-6">
                                {order.items?.map((item, idx) => (
                                    <div key={idx} className="flex gap-6 pb-6 border-b last:border-0 flex-col sm:flex-row items-center sm:items-start invoice-item">
                                        <div className="w-24 h-24 bg-gray-100 rounded-xl overflow-hidden shrink-0 no-print">
                                            <img
                                                src={item.product?.image ? `${import.meta.env.VITE_API_URL || ''}/storage/${item.product.image}` : "https://via.placeholder.com/100"}
                                                alt={item.product?.name}
                                                className="w-full h-full object-cover"
                                                onError={(e) => { e.target.onerror = null; e.target.src = "https://via.placeholder.com/100?text=No+Image"; }}
                                            />
                                        </div>
                                        <div className="flex-grow text-center sm:text-left">
                                            <h3 className="font-bold text-lg text-gray-900 mb-2">
                                                {item.product?.name}
                                            </h3>
                                            <p className="text-gray-600 mb-2 font-medium">Quantity: {item.quantity}</p>
                                            <p className="text-gray-600 font-medium">Price: ₹{item.price} each</p>
                                        </div>
                                        <div className="text-center sm:text-right">
                                            <p className="text-2xl font-bold text-green-700 invoice-item-total">
                                                ₹{item.total || (item.quantity * item.price)}
                                            </p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>

                    {/* Shipping & Payment Info */}
                    <div className="lg:col-span-1 space-y-6">
                        {/* Shipping Address */}
                        <div className="bg-white rounded-2xl p-6 shadow-lg address-card">
                            <h3 className="text-xl font-bold text-gray-900 mb-4">Shipping Address</h3>
                            <div className="text-gray-700 leading-relaxed">
                                <p className="font-bold text-gray-900 mb-1">{order.user?.name || 'Customer'}</p>
                                <p className="font-semibold text-gray-800">{order.shipping_address || order.address}</p>
                                <p>{order.city && `${order.city}, `}{order.state} {order.pincode && `- ${order.pincode}`}</p>
                                <p className="mt-2 text-sm text-gray-600 font-medium">{order.phone && `📞 ${order.phone}`}</p>
                                <p className="text-sm text-gray-600 font-medium">{order.email && `📧 ${order.email}`}</p>
                            </div>
                        </div>

                        {/* Order Summary */}
                        <div className="bg-white rounded-2xl p-6 shadow-lg summary-card">
                            <h3 className="text-xl font-bold text-gray-900 mb-4">Order Summary</h3>
                            <div className="space-y-3">
                                <div className="flex justify-between text-gray-600 font-medium">
                                    <span>Subtotal</span>
                                    <span className="font-bold text-gray-900">₹{order.total_amount || order.subtotal || 0}</span>
                                </div>
                                <div className="flex justify-between text-gray-600 font-medium">
                                    <span>Shipping</span>
                                    <span className="font-bold text-gray-900">
                                        {(!order.shipping_amount || order.shipping_amount === 0) ? 'FREE' : `₹${order.shipping_amount}`}
                                    </span>
                                </div>
                                <div className="border-t-2 pt-3">
                                    <div className="flex justify-between text-xl font-bold">
                                        <span>Total</span>
                                        <span className="text-green-700 invoice-total-amount">₹{order.net_amount || order.total}</span>
                                    </div>
                                </div>
                            </div>

                            {/* Actions */}
                            <div className="mt-6 flex flex-col gap-3 no-print">
                                {order.status === 'pending' && (
                                    <button
                                        onClick={handleCancelOrder}
                                        className="w-full bg-red-50 text-red-600 py-3 rounded-xl font-bold hover:bg-red-100 transition"
                                    >
                                        Cancel Order
                                    </button>
                                )}

                                <button
                                    onClick={() => window.print()}
                                    className="w-full bg-green-50 text-green-700 py-3 rounded-xl font-bold hover:bg-green-100 transition flex items-center justify-center gap-2"
                                >
                                    <span>📄</span> Download Invoice
                                </button>
                            </div>
                        </div>

                        {/* Order Notes */}
                        {order.notes && (
                            <div className="bg-yellow-50 border-2 border-yellow-200 rounded-2xl p-6 no-print">
                                <h3 className="text-sm font-bold text-gray-900 mb-2">Order Notes</h3>
                                <p className="text-sm text-gray-700">{order.notes}</p>
                            </div>
                        )}
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
                    .main-content { padding-top: 0 !important; background: white !important; }
                    .bg-gray-50 { background: white !important; }
                    .shadow-lg { box-shadow: none !important; border: 1px solid #e5e7eb !important; }
                    .rounded-2xl { border-radius: 0 !important; }
                    .container { max-width: 100% !important; width: 100% !important; padding: 0 !important; }
                    .print-only { display: block !important; }
                    .invoice-card { border: none !important; padding: 0 !important; }
                    .invoice-title { margin-bottom: 1.5rem !important; }
                    .summary-card, .address-card { border: 1px solid #e5e7eb !important; }
                    body { color: black !important; }
                    .text-green-700 { color: #166534 !important; }
                    .invoice-total-amount { font-size: 1.5rem !important; }
                }
                `}
            </style>
        </div>
    );
};

export default OrderDetails;
