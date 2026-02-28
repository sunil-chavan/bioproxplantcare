import { Truck, ShieldCheck, RefreshCw, Leaf } from "lucide-react";

const FeatureStrip = () => {
    const features = [
        {
            icon: <Truck size={24} className="text-secondary" />,
            title: "Free Shipping",
            desc: "On orders above ₹999"
        },
        {
            icon: <Leaf size={24} className="text-secondary" />,
            title: "100% Organic",
            desc: "Certified pure seeds"
        },
        {
            icon: <ShieldCheck size={24} className="text-secondary" />,
            title: "Secure Payment",
            desc: "Safe & encrypted"
        },
        {
            icon: <RefreshCw size={24} className="text-secondary" />,
            title: "Easy Returns",
            desc: "7-day hassle-free"
        }
    ];

    return (
        <section className="py-12 bg-white border-b border-gray-100">
            <div className="container mx-auto px-6">
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 md:gap-12">
                    {features.map((item, index) => (
                        <div key={index} className="flex flex-row items-center text-left gap-4 p-4 rounded-2xl hover:bg-bg-soft/50 transition-colors group border border-transparent hover:border-gray-50">
                            <div className="w-14 h-14 bg-bg-soft rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform shadow-inner">
                                {item.icon}
                            </div>
                            <div>
                                <h4 className="text-primary font-black text-sm uppercase tracking-wider mb-1">
                                    {item.title}
                                </h4>
                                <p className="text-dark/40 text-xs font-bold leading-tight">
                                    {item.desc}
                                </p>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
};

export default FeatureStrip;
