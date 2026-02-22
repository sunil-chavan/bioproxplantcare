import { useNavigate } from "react-router-dom";

const NotFound = () => {
    const navigate = useNavigate();

    return (
        <div className="min-h-[80vh] flex items-center justify-center bg-gradient-to-br from-green-50 via-white to-green-50">
            <div className="text-center px-6">
                <div className="text-9xl mb-6">🌿</div>
                <h1 className="text-8xl md:text-9xl font-bold text-green-700 mb-4">404</h1>
                <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
                    Page Not Found
                </h2>
                <p className="text-gray-600 text-lg mb-8 max-w-md mx-auto">
                    Oops! The page you're looking for seems to have wandered off into the garden.
                </p>
                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                    <button
                        onClick={() => navigate(-1)}
                        className="bg-gray-200 text-gray-900 px-8 py-4 rounded-xl font-bold text-lg hover:bg-gray-300 transition inline-block shadow-lg"
                    >
                        ← Go Back
                    </button>
                    <button
                        onClick={() => navigate("/")}
                        className="bg-green-700 text-white px-8 py-4 rounded-xl font-bold text-lg hover:bg-green-800 transition inline-block shadow-lg"
                    >
                        🏠 Go Home
                    </button>
                </div>
            </div>
        </div>
    );
};

export default NotFound;
