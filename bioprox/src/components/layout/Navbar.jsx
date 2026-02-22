import { Link } from "react-router-dom";
import { useContext, useState, useEffect, useRef } from "react";
import { AuthContext } from "../../context/AuthContext";
import { CartContext } from "../../context/CartContext";
import { User, LogOut, ShoppingBag } from "lucide-react";

const Navbar = () => {
    const { user, logout } = useContext(AuthContext);
    const { cartItems } = useContext(CartContext);
    const [menuOpen, setMenuOpen] = useState(false);
    const [userMenuOpen, setUserMenuOpen] = useState(false);

    return (
        <nav className="bg-white shadow-md sticky top-0 z-50 backdrop-blur-md">
            <div className="container mx-auto px-6 py-4 flex justify-between items-center">

                {/* Logo */}
                <Link to="/" className="text-2xl font-bold text-green-800">
                    BioProxPlantCare
                </Link>

                {/* Desktop Menu */}
                <div className="hidden md:flex items-center gap-8 font-medium">
                    <Link to="/" className="hover:text-green-700 transition">Home</Link>
                    <Link to="/shop" className="hover:text-green-700 transition">Shop</Link>
                    <Link to="/orders" className="hover:text-green-700 transition">Orders</Link>

                    <Link to="/cart" className="relative">
                        🛒
                        {cartItems.length > 0 && (
                            <span className="absolute -top-2 -right-3 bg-green-600 text-white text-xs px-2 py-0.5 rounded-full">
                                {cartItems.length}
                            </span>
                        )}
                    </Link>

                    {/* Profile Dropdown */}
                    <div className="relative">
                        <button
                            onClick={() => setUserMenuOpen(!userMenuOpen)}
                            className="flex items-center gap-2 hover:text-green-700 transition"
                        >
                            <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center text-green-700">
                                <User size={20} />
                            </div>
                            {user && <span className="text-sm font-medium">{user.name || "User"}</span>}
                        </button>

                        {/* Dropdown Menu */}
                        {/* User Menu Dropdown */}
                        {userMenuOpen && (
                            <div className="absolute right-0 mt-2 w-48 bg-white rounded-xl shadow-xl border border-gray-100 overflow-hidden z-50 animate-fade-in-up">
                                {user ? (
                                    <>
                                        <div className="px-4 py-3 border-b border-gray-100 mb-2">
                                            <p className="text-sm font-medium text-gray-900 truncate">{user.name}</p>
                                            <p className="text-xs text-gray-500 truncate">{user.email}</p>
                                        </div>

                                        <Link
                                            to="/orders"
                                            className="flex items-center gap-3 px-4 py-2 text-sm text-gray-700 hover:bg-green-50 hover:text-green-700 transition"
                                            onClick={() => setUserMenuOpen(false)}
                                        >
                                            <ShoppingBag size={16} />
                                            My Orders
                                        </Link>

                                        <button
                                            onClick={async () => {
                                                try {
                                                    await logout();
                                                    toast.success('Logged out successfully');
                                                    navigate('/');
                                                } catch (error) {
                                                    toast.error('Logout failed');
                                                } finally {
                                                    setUserMenuOpen(false);
                                                }
                                            }}
                                            className="w-full flex items-center gap-3 px-4 py-2 text-sm text-red-600 hover:bg-red-50 transition mt-1"
                                        >
                                            <LogOut size={16} />
                                            Logout
                                        </button>
                                    </>
                                ) : (
                                    <div className="p-2 space-y-2">
                                        <Link
                                            to="/login"
                                            className="block w-full text-center px-4 py-2 bg-green-700 text-white rounded-lg text-sm font-medium hover:bg-green-800 transition"
                                            onClick={() => setUserMenuOpen(false)}
                                        >
                                            Login
                                        </Link>
                                        <Link
                                            to="/register"
                                            className="block w-full text-center px-4 py-2 border border-green-700 text-green-700 rounded-lg text-sm font-medium hover:bg-green-50 transition"
                                            onClick={() => setUserMenuOpen(false)}
                                        >
                                            Register
                                        </Link>
                                    </div>
                                )}
                            </div>
                        )}
                    </div>
                </div>

                {/* Mobile Button */}
                <button
                    className="md:hidden text-2xl"
                    onClick={() => setMenuOpen(!menuOpen)}
                >
                    ☰
                </button>
            </div>

            {/* Mobile Menu */}
            {menuOpen && (
                <div className="md:hidden bg-white shadow-lg p-6 space-y-4">
                    <Link to="/" onClick={() => setMenuOpen(false)}>Home</Link>
                    <Link to="/shop" onClick={() => setMenuOpen(false)}>Shop</Link>
                    <Link to="/cart" onClick={() => setMenuOpen(false)}>Cart</Link>
                    <Link to="/orders" onClick={() => setMenuOpen(false)}>Orders</Link>
                </div>
            )}
        </nav>
    );
};

export default Navbar;
