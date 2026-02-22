import { useParams, useNavigate } from "react-router-dom";

const BlogDetails = () => {
    const { id } = useParams();
    const navigate = useNavigate();

    // Mock blog data - replace with API call
    const blog = {
        id,
        title: "The Ultimate Guide to Indoor Plant Care",
        date: "February 14, 2026",
        author: "BioProx Team",
        image: "https://images.unsplash.com/photo-1463320726281-696a485928c7?w=1200",
        content: `
            <h2>Introduction to Indoor Plants</h2>
            <p>Indoor plants are more than just decorative elements; they bring life, color, and fresh air into your home. Whether you're a seasoned gardener or just starting your plant journey, this guide will help you create a thriving indoor garden.</p>
            
            <h2>Choosing the Right Plants</h2>
            <p>Not all plants are created equal when it comes to indoor care. Here are some beginner-friendly options:</p>
            <ul>
                <li><strong>Snake Plant:</strong> Extremely low maintenance and tolerates low light</li>
                <li><strong>Pothos:</strong> Fast-growing and very forgiving</li>
                <li><strong>Spider Plant:</strong> Great for beginners and air purification</li>
                <li><strong>ZZ Plant:</strong> Drought-tolerant and thrives in various conditions</li>
            </ul>

            <h2>Essential Care Tips</h2>
            <h3>1. Light Requirements</h3>
            <p>Understanding your plant's light needs is crucial. Most indoor plants prefer bright, indirect light. Avoid direct sunlight which can scorch leaves.</p>

            <h3>2. Watering Schedule</h3>
            <p>Overwatering is the #1 killer of indoor plants. Always check soil moisture before watering. Most plants prefer to dry out between waterings.</p>

            <h3>3. Humidity & Temperature</h3>
            <p>Maintain consistent temperatures between 65-75°F. Many tropical plants appreciate extra humidity from misting or pebble trays.</p>

            <h3>4. Fertilizing</h3>
            <p>Feed your plants during the growing season (spring and summer) with a balanced liquid fertilizer every 2-4 weeks.</p>

            <h2>Common Problems & Solutions</h2>
            <p><strong>Yellow Leaves:</strong> Usually indicates overwatering or nutrient deficiency.</p>
            <p><strong>Brown Tips:</strong> Often caused by low humidity or fluoride in tap water.</p>
            <p><strong>Drooping:</strong> Can mean either too much or too little water - check soil moisture.</p>

            <h2>Conclusion</h2>
            <p>With these tips, you're well on your way to becoming a successful plant parent. Remember, every plant is unique, and learning their individual needs is part of the journey. Happy planting!</p>
        `
    };

    return (
        <div className="bg-gray-50 min-h-screen py-12">
            <div className="container mx-auto px-6 max-w-4xl">
                {/* Back Button */}
                <button
                    onClick={() => navigate("/")}
                    className="text-green-700 font-semibold hover:underline mb-6 inline-flex items-center gap-2"
                >
                    ← Back to Home
                </button>

                {/* Article */}
                <article className="bg-white rounded-3xl shadow-lg overflow-hidden">
                    {/* Featured Image */}
                    <div className="aspect-[21/9] overflow-hidden">
                        <img
                            src={blog.image}
                            alt={blog.title}
                            className="w-full h-full object-cover"
                        />
                    </div>

                    {/* Content */}
                    <div className="p-8 md:p-12">
                        {/* Meta */}
                        <div className="flex flex-wrap gap-4 text-sm text-gray-600 mb-6">
                            <span className="flex items-center gap-2">
                                📅 {blog.date}
                            </span>
                            <span className="flex items-center gap-2">
                                ✍️ {blog.author}
                            </span>
                        </div>

                        {/* Title */}
                        <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-8 leading-tight">
                            {blog.title}
                        </h1>

                        {/* Article Content */}
                        <div
                            className="prose prose-lg max-w-none prose-headings:text-gray-900 prose-headings:font-bold prose-h2:text-3xl prose-h2:mt-12 prose-h2:mb-4 prose-h3:text-2xl prose-h3:mt-8 prose-h3:mb-3 prose-p:text-gray-700 prose-p:leading-relaxed prose-p:mb-6 prose-ul:my-6 prose-li:text-gray-700 prose-strong:text-gray-900"
                            dangerouslySetInnerHTML={{ __html: blog.content }}
                        />

                        {/* Tags */}
                        <div className="mt-12 pt-8 border-t-2">
                            <h3 className="text-sm font-semibold text-gray-600 mb-3">Tags:</h3>
                            <div className="flex flex-wrap gap-2">
                                {['Indoor Plants', 'Plant Care', 'Gardening', 'Home Decor'].map(tag => (
                                    <span
                                        key={tag}
                                        className="bg-green-100 text-green-800 px-4 py-2 rounded-full text-sm font-semibold"
                                    >
                                        {tag}
                                    </span>
                                ))}
                            </div>
                        </div>

                        {/* Share */}
                        <div className="mt-8 pt-8 border-t-2">
                            <h3 className="text-sm font-semibold text-gray-600 mb-3">Share this article:</h3>
                            <div className="flex gap-4">
                                <button className="bg-blue-600 text-white px-6 py-3 rounded-xl font-semibold hover:bg-blue-700 transition">
                                    Facebook
                                </button>
                                <button className="bg-sky-500 text-white px-6 py-3 rounded-xl font-semibold hover:bg-sky-600 transition">
                                    Twitter
                                </button>
                                <button className="bg-green-600 text-white px-6 py-3 rounded-xl font-semibold hover:bg-green-700 transition">
                                    WhatsApp
                                </button>
                            </div>
                        </div>
                    </div>
                </article>

                {/* Related Articles */}
                <div className="mt-12">
                    <h2 className="text-3xl font-bold text-gray-900 mb-6">Related Articles</h2>
                    <div className="grid md:grid-cols-3 gap-6">
                        {[1, 2, 3].map(i => (
                            <div key={i} className="bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-lg transition cursor-pointer">
                                <div className="aspect-video bg-gray-200"></div>
                                <div className="p-6">
                                    <h3 className="font-bold text-lg mb-2 line-clamp-2">
                                        Plant Care Article {i}
                                    </h3>
                                    <p className="text-gray-600 text-sm">Feb {10 + i}, 2026</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default BlogDetails;
