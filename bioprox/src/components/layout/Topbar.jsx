import { Leaf, Truck } from "lucide-react";

const TopBar = () => {
    return (
        <div className="bg-primary text-white text-[11px] uppercase tracking-[0.2em] font-bold py-2.5 px-6 hidden sm:flex justify-between items-center border-b border-white/10">
            <div className="flex items-center gap-2">
                <Leaf size={12} className="text-accent" />
                <span>100% Organic & Sustainable</span>
            </div>
            <div className="flex items-center gap-2">
                <Truck size={12} className="text-accent" />
                <span>Free Shipping on Orders Above ₹999</span>
            </div>
        </div>
    );
};

export default TopBar;
