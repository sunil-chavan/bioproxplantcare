import { Link, useNavigate } from "react-router-dom";
import { useContext, useState, useEffect } from "react";
import { AuthContext } from "../../context/AuthContext";
import { CartContext } from "../../context/CartContext";
import { motion, AnimatePresence } from "framer-motion";
import { User, LogOut, ShoppingBag, ShoppingCart, Menu, X, ChevronDown, Search } from "lucide-react";
import { toast } from "react-hot-toast";
import logo from "../../assets/bio-prox.png";
import AdvancedSearch from "./AdvancedSearch";

const Navbar = () => {
    const { user, logout } = useContext(AuthContext);
    const { cartItems } = useContext(CartContext);
    const [menuOpen, setMenuOpen] = useState(false);
    const [userMenuOpen, setUserMenuOpen] = useState(false);
    const [isScrolled, setIsScrolled] = useState(false);
    const navigate = useNavigate();

    useEffect(() => {
        const handleScroll = () => {
            setIsScrolled(window.scrollY > 20);
        };
        window.addEventListener("scroll", handleScroll);
        return () => window.removeEventListener("scroll", handleScroll);
    }, []);

    const navLinks = [
        { name: "Home", path: "/" },
        { name: "Seeds", path: "/shop?category=seeds" },
        { name: "Grow Bags", path: "/shop?category=grow-bags" },
        { name: "Tools", path: "/shop?category=tools" },
    ];

    return (
        <nav className={`sticky top-0 z-[100] transition-all duration-300 ${isScrolled ? "bg-white/95 backdrop-blur-md shadow-sm py-2" : "bg-white py-4"}`}>
            <div className="container mx-auto px-6 flex justify-between items-center">

                {/* Logo Section */}
                <Link to="/" className="flex items-center gap-2 shrink-0">
                    <img src={logo} alt="BioProx Plant Care" className="h-8 md:h-12 w-auto object-contain" />
                </Link>

                {/* Desktop Navigation Links */}
                <div className="hidden md:flex items-center gap-6">
                    {navLinks.map((link) => (
                        <Link
                            key={link.name}
                            to={link.path}
                            className="text-[10px] font-black uppercase tracking-widest text-dark/70 hover:text-primary transition-colors relative group"
                        >
                            {link.name}
                            <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-secondary transition-all duration-300 group-hover:w-full"></span>
                        </Link>
                    ))}
                </div>

                {/* Header Actions (Desktop & Mobile) */}
                <div className="flex items-center gap-1 md:gap-6">
                    {/* Advanced Search Bar (Hidden on Mobile) */}
                    <div className="flex-1 max-w-md mx-4 hidden lg:block">
                        <AdvancedSearch />
                    </div>

                    <div className="flex items-center gap-1 md:gap-4">
                        {/* Mobile Search - Just triggers the same AdvancedSearch logic if we can, or we just rely on the toggle below */}
                        <div className="md:hidden flex-1 max-w-[120px] xs:max-w-none">
                            <AdvancedSearch isMobile />
                        </div>

                        <Link to="/cart" className="relative text-dark/60 hover:text-primary transition-all hover:scale-110 p-2">
                            <ShoppingCart size={22} />
                            {cartItems.length > 0 && (
                                <span className="absolute top-1 right-1 bg-secondary text-white text-[9px] font-black w-4 h-4 flex items-center justify-center rounded-full shadow-lg">
                                    {cartItems.length}
                                </span>
                            )}
                        </Link>

                        {/* Desktop User Profile */}
                        <div className="hidden md:block relative">
                            <button
                                onClick={() => setUserMenuOpen(!userMenuOpen)}
                                className="flex items-center gap-2 group"
                            >
                                <div className="w-10 h-10 bg-bg-soft rounded-full flex items-center justify-center text-dark/40 group-hover:bg-primary group-hover:text-white transition-all">
                                    <User size={18} />
                                </div>
                                <ChevronDown size={14} className={`text-dark/40 transition-transform duration-300 ${userMenuOpen ? "rotate-180" : ""}`} />
                            </button>

                            {/* Dropdown */}
                            {userMenuOpen && (
                                <div className="absolute right-0 mt-4 w-60 bg-white rounded-xl shadow-2xl border border-gray-100 overflow-hidden z-50 py-2">
                                    {user ? (
                                        <>
                                            <div className="px-5 py-3 border-b border-gray-50 mb-2">
                                                <p className="text-[10px] font-black text-dark/30 uppercase tracking-[0.2em] mb-1">Authenticated</p>
                                                <p className="text-sm font-bold text-primary truncate">{user.name}</p>
                                            </div>
                                            <Link
                                                to="/orders"
                                                className="flex items-center gap-3 px-5 py-3 text-sm font-bold text-dark/70 hover:bg-bg-soft hover:text-primary transition"
                                                onClick={() => setUserMenuOpen(false)}
                                            >
                                                <ShoppingBag size={18} />
                                                Order History
                                            </Link>
                                            <button
                                                onClick={async () => {
                                                    try {
                                                        await logout();
                                                        toast.success('Signed out securely');
                                                        navigate('/');
                                                    } catch (error) {
                                                        toast.error('Logout failed');
                                                    } finally {
                                                        setUserMenuOpen(false);
                                                    }
                                                }}
                                                className="w-full flex items-center gap-3 px-5 py-3 text-sm font-bold text-red-500 hover:bg-red-50 transition border-t border-gray-50 mt-2"
                                            >
                                                <LogOut size={18} />
                                                Log Out
                                            </button>
                                        </>
                                    ) : (
                                        <div className="p-4 space-y-3">
                                            <Link to="/login" className="btn-primary w-full py-2.5 text-sm" onClick={() => setUserMenuOpen(false)}>Sign In</Link>
                                            <Link to="/register" className="btn-outline w-full py-2.5 text-sm" onClick={() => setUserMenuOpen(false)}>Create Account</Link>
                                        </div>
                                    )}
                                </div>
                            )}
                        </div>

                        {/* Mobile Menu Toggle */}
                        <button
                            className="md:hidden p-2 rounded-xl bg-bg-soft text-primary active:scale-90 transition-all ml-1"
                            onClick={() => setMenuOpen(!menuOpen)}
                        >
                            {menuOpen ? <X size={24} /> : <Menu size={24} />}
                        </button>
                    </div>
                </div>
            </div>

            {/* Mobile Menu Overlay */}
            <AnimatePresence>
                {menuOpen && (
                    <>
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            onClick={() => setMenuOpen(false)}
                            className="md:hidden fixed inset-0 bg-dark/20 backdrop-blur-sm z-[90]"
                        />
                        <motion.div
                            initial={{ x: "100%" }}
                            animate={{ x: 0 }}
                            exit={{ x: "100%" }}
                            transition={{ type: "spring", damping: 25, stiffness: 200 }}
                            className="md:hidden fixed top-0 right-0 h-full w-[80%] max-w-sm bg-white shadow-2xl z-[100] p-8 flex flex-col"
                        >
                            <div className="flex justify-between items-center mb-8">
                                <img src={logo} alt="BioProx" className="h-8 w-auto" />
                                <button onClick={() => setMenuOpen(false)} className="p-2 bg-bg-soft rounded-lg text-primary">
                                    <X size={20} />
                                </button>
                            </div>

                            <div className="flex flex-col gap-6 overflow-y-auto flex-grow pb-8">
                                <p className="text-[10px] font-black uppercase tracking-widest text-dark/30 mb-2">Navigation</p>
                                {navLinks.map((link) => (
                                    <Link
                                        key={link.name}
                                        to={link.path}
                                        className="text-xl font-bold text-dark/70 hover:text-primary transition-colors flex items-center justify-between"
                                        onClick={() => setMenuOpen(false)}
                                    >
                                        {link.name}
                                        <ChevronDown size={16} className="-rotate-90 opacity-20" />
                                    </Link>
                                ))}
                                <Link
                                    to="/cart"
                                    className="text-xl font-bold text-dark/70 hover:text-primary transition-colors flex items-center justify-between"
                                    onClick={() => setMenuOpen(false)}
                                >
                                    My Basket
                                    <span className="bg-secondary text-white text-[10px] h-6 px-2 min-w-[24px] flex items-center justify-center rounded-full font-black">
                                        {cartItems.length}
                                    </span>
                                </Link>

                                <div className="mt-4 pt-8 border-t border-gray-50 flex flex-col gap-6">
                                    <p className="text-[10px] font-black uppercase tracking-widest text-dark/30 mb-2">Account</p>
                                    {user ? (
                                        <>
                                            <div className="flex items-center gap-4 p-4 bg-bg-soft rounded-2xl">
                                                <div className="w-12 h-12 bg-primary text-white rounded-full flex items-center justify-center font-bold">
                                                    {user.name.charAt(0)}
                                                </div>
                                                <div className="flex-grow min-w-0">
                                                    <p className="text-sm font-bold text-primary truncate">{user.name}</p>
                                                    <p className="text-[10px] text-dark/40 font-medium">Active Member</p>
                                                </div>
                                            </div>
                                            <Link
                                                to="/orders"
                                                className="text-lg font-bold text-dark/70 hover:text-primary flex items-center gap-3"
                                                onClick={() => setMenuOpen(false)}
                                            >
                                                <ShoppingBag size={20} /> Order History
                                            </Link>
                                            <button
                                                onClick={async () => {
                                                    try {
                                                        await logout();
                                                        toast.success('Signed out securely');
                                                        navigate('/');
                                                        setMenuOpen(false);
                                                    } catch (error) {
                                                        toast.error('Logout failed');
                                                    }
                                                }}
                                                className="text-lg font-bold text-red-500 flex items-center gap-3 mt-4"
                                            >
                                                <LogOut size={20} /> Log Out
                                            </button>
                                        </>
                                    ) : (
                                        <div className="flex flex-col gap-3">
                                            <Link to="/login" className="btn-primary w-full py-4" onClick={() => setMenuOpen(false)}>Login</Link>
                                            <Link to="/register" className="btn-outline w-full py-4" onClick={() => setMenuOpen(false)}>Create Account</Link>
                                        </div>
                                    )}
                                </div>
                            </div>

                            <div className="pt-8 border-t border-gray-50">
                                <p className="text-[10px] font-black text-dark/20 uppercase tracking-widest text-center">
                                    BioProx Care © {new Date().getFullYear()}
                                </p>
                            </div>
                        </motion.div>
                    </>
                )}
            </AnimatePresence>
        </nav>
    );
};

export default Navbar;
