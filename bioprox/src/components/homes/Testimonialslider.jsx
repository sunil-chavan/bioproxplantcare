const TestimonialSlider = () => {

    const testimonials = [
        { name: "Priya S.", text: "Amazing quality seeds! My terrace garden looks beautiful." },
        { name: "Rahul M.", text: "Fast delivery and premium packaging. Loved it!" },
        { name: "Anita K.", text: "Grow bags are strong and reusable. Worth every rupee." }
    ];

    return (
        <section className="py-20 bg-green-900 text-white">
            <div className="container mx-auto px-6 text-center">

                <h2 className="text-3xl md:text-4xl font-bold mb-12">
                    What Our Customers Say
                </h2>

                <div className="grid md:grid-cols-3 gap-8">
                    {testimonials.map((t, i) => (
                        <div key={i} className="bg-green-800 p-8 rounded-2xl shadow-lg">
                            <p className="mb-4 italic">"{t.text}"</p>
                            <h4 className="font-semibold">{t.name}</h4>
                        </div>
                    ))}
                </div>

            </div>
        </section>
    );
};

export default TestimonialSlider;
