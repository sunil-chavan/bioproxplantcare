import { Link } from "react-router-dom";

const CategorySlider = () => {

    const categories = [
        { id: 1, name: "Seeds", image: "https://images.unsplash.com/photo-1589927986089-35812388d1f4?w=500" },
        { id: 2, name: "Grow Bags", image: "https://images.unsplash.com/photo-1598514982901-58fef3a9a7b1?w=500" },
        { id: 3, name: "Tools", image: "https://images.unsplash.com/photo-1524594154908-edd9e7f0d6c2?w=500" },
    ];

    return (
        <section className="py-20 bg-white">
            <div className="container mx-auto px-6">
                <h2 className="text-3xl md:text-4xl font-bold text-center text-green-900 mb-12">
                    Shop By Category
                </h2>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    {categories.map(cat => (
                        <Link
                            key={cat.id}
                            to={`/shop?category=${cat.id}`}
                            className="relative group overflow-hidden rounded-3xl shadow-lg"
                        >
                            <img src={cat.image} className="w-full h-72 object-cover group-hover:scale-110 transition duration-500" />
                            <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
                                <h3 className="text-white text-2xl font-bold">{cat.name}</h3>
                            </div>
                        </Link>
                    ))}
                </div>
            </div>
        </section>
    );
};

export default CategorySlider;
