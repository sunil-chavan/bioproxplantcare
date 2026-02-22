import { Link } from "react-router-dom";

const ProductSection = () => {

    const products = [
        { id: 1, name: "Tomato Seeds", price: 199, image: "https://images.unsplash.com/photo-1592928302636-c83cf1e1a2f2?w=500" },
        { id: 2, name: "Premium Grow Bag", price: 299, image: "https://images.unsplash.com/photo-1603912699214-92627f304eb6?w=500" },
        { id: 3, name: "Garden Tool Set", price: 799, image: "https://images.unsplash.com/photo-1561998338-13ad7883b20f?w=500" },
    ];

    return (
        <section className="py-20 bg-gray-50">
            <div className="container mx-auto px-6">

                <h2 className="text-3xl md:text-4xl font-bold text-center text-green-900 mb-12">
                    Best Sellers
                </h2>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
                    {products.map(product => (
                        <div key={product.id} className="bg-white rounded-3xl shadow-md hover:shadow-xl transition p-6">
                            <img src={product.image} className="h-60 w-full object-cover rounded-2xl mb-4" />
                            <h3 className="text-xl font-semibold mb-2">{product.name}</h3>
                            <p className="text-green-700 font-bold text-lg mb-4">₹{product.price}</p>
                            <Link
                                to={`/product/${product.id}`}
                                className="bg-green-600 text-white px-6 py-2 rounded-full hover:bg-green-700 transition"
                            >
                                View Details
                            </Link>
                        </div>
                    ))}
                </div>

            </div>
        </section>
    );
};

export default ProductSection;
