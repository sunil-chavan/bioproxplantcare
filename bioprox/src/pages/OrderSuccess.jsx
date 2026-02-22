import { useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { CheckCircle } from "lucide-react";

const OrderSuccess = () => {
    const { id } = useParams();
    const navigate = useNavigate();

    useEffect(() => {
        const timer = setTimeout(() => {
            navigate(`/orders/${id}`);
        }, 3000);

        return () => clearTimeout(timer);
    }, [id, navigate]);

    return (
        <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center p-6 text-center">
            <div className="bg-white rounded-3xl p-12 shadow-xl max-w-md w-full animate-fade-in-up">
                <div className="w-24 h-24 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
                    <CheckCircle className="w-12 h-12 text-green-600" />
                </div>
                <h1 className="text-3xl font-bold text-gray-900 mb-4">Order Placed!</h1>
                <p className="text-gray-600 text-lg mb-8">
                    Your order <span className="font-semibold text-gray-900">#{id}</span> has been confirmed.
                </p>
                <div className="animate-pulse text-green-700 font-medium">
                    Redirecting to order details...
                </div>
                <button
                    onClick={() => navigate(`/orders/${id}`)}
                    className="mt-8 text-sm text-gray-400 hover:text-gray-600 underline"
                >
                    Click here if not redirected
                </button>
            </div>
        </div>
    );
};

export default OrderSuccess;
