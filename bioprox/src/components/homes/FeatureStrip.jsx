const FeatureStrip = () => {
    const features = [
        "🚚 Free Shipping Above ₹999",
        "🌱 100% Organic Products",
        "💳 Secure Payments",
        "🔁 Easy Returns"
    ];

    return (
        <div className="bg-green-900 text-white py-4">
            <div className="container mx-auto flex flex-wrap justify-center gap-6 text-sm md:text-base font-medium">
                {features.map((item, index) => (
                    <span key={index}>{item}</span>
                ))}
            </div>
        </div>
    );
};

export default FeatureStrip;
