import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Home, LayoutGrid, Package, ShoppingCart, MessageCircle } from 'lucide-react';
import { useCart } from '../../context/CartContext';

const BottomNav = () => {
    const location = useLocation();
    const { cartItems } = useCart();
    const cartCount = cartItems.reduce((acc, item) => acc + item.quantity, 0);

    const navItems = [
        {
            icon: <Home size={24} />,
            label: 'Home',
            path: '/',
        },
        {
            icon: <LayoutGrid size={24} />,
            label: 'Collections',
            path: '/shop',
        },
        {
            icon: <Package size={24} />,
            label: 'Track Order',
            path: '/orders',
        },
        {
            icon: <div className="relative">
                <ShoppingCart size={24} />
                {cartCount > 0 && (
                    <span className="absolute -top-2 -right-2 bg-accent text-white text-[10px] font-black w-5 h-5 flex items-center justify-center rounded-full border-2 border-white">
                        {cartCount}
                    </span>
                )}
            </div>,
            label: 'Cart',
            path: '/cart',
        },
        {
            icon: <MessageCircle size={24} />,
            label: 'Contact',
            path: 'https://wa.me/917066118118',
            isExternal: true,
        },
    ];

    return (
        <div className="lg:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-gray-100 px-2 pt-2 pb-safe z-[100] shadow-[0_-5px_20px_rgba(0,0,0,0.05)]">
            <div className="flex justify-around items-end">
                {navItems.map((item) => {
                    const isActive = location.pathname === item.path;

                    if (item.isExternal) {
                        return (
                            <a
                                key={item.label}
                                href={item.path}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="flex flex-col items-center gap-1 p-2 text-dark/40 active:scale-95 transition-all"
                            >
                                <div className="text-[#25D366]">
                                    {item.icon}
                                </div>
                                <span className="text-[10px] font-black uppercase tracking-tight">
                                    {item.label}
                                </span>
                            </a>
                        );
                    }

                    return (
                        <Link
                            key={item.label}
                            to={item.path}
                            className={`flex flex-col items-center gap-1 p-2 transition-all active:scale-95 ${isActive ? 'text-primary' : 'text-dark/40'
                                }`}
                        >
                            <div className={`${isActive ? 'scale-110' : ''}`}>
                                {item.icon}
                            </div>
                            <span className="text-[10px] font-black uppercase tracking-tight">
                                {item.label}
                            </span>
                            {isActive && (
                                <div className="w-1 h-1 bg-primary rounded-full" />
                            )}
                        </Link>
                    );
                })}
            </div>
        </div>
    );
};

export default BottomNav;
