import { Link } from "react-router-dom";

const HeroSlider = () => {
    return (
        <section className="relative h-[85vh] flex items-center justify-center overflow-hidden">

            <img
                src="https://images.unsplash.com/photo-1466692476868-aef1dfb1e735?q=80&w=1920"
                alt="Garden"
                className="absolute inset-0 w-full h-full object-cover"
            />

            <div className="absolute inset-0 bg-gradient-to-r from-black/70 via-green-900/60 to-green-700/70"></div>

            <div className="relative z-10 text-center px-6">
                <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold text-white mb-6 leading-tight">
                    Grow Naturally. <br /> Live Sustainably.
                </h1>

                <p className="text-lg md:text-xl text-green-100 max-w-2xl mx-auto mb-8">
                    Organic seeds, eco grow bags & premium gardening tools for modern India.
                </p>

                <Link
                    to="/shop"
                    className="bg-green-600 hover:bg-green-700 text-white px-10 py-4 rounded-full text-lg font-semibold transition-all duration-300 shadow-lg"
                >
                    Shop Now
                </Link>
            </div>
        </section>
    );
};

export default HeroSlider;
