import { Link } from "react-router-dom";

const BlogSlider = () => {

    const blogs = [
        { id: 1, title: "Top 5 Winter Vegetables", image: "https://images.unsplash.com/photo-1518843025960-d60217f226f5?w=500" },
        { id: 2, title: "Urban Gardening Tips", image: "https://images.unsplash.com/photo-1598514982901-58fef3a9a7b1?w=500" },
        { id: 3, title: "How to Use Grow Bags", image: "https://images.unsplash.com/photo-1586773860418-d37222d8fce3?w=500" },
    ];

    return (
        <section className="py-20 bg-white">
            <div className="container mx-auto px-6">

                <h2 className="text-3xl md:text-4xl font-bold text-center text-green-900 mb-12">
                    Gardening Tips & Blogs
                </h2>

                <div className="grid md:grid-cols-3 gap-10">
                    {blogs.map(blog => (
                        <Link key={blog.id} to={`/blog/${blog.id}`} className="group">
                            <img src={blog.image} className="h-60 w-full object-cover rounded-2xl mb-4 group-hover:scale-105 transition" />
                            <h3 className="text-xl font-semibold group-hover:text-green-700 transition">
                                {blog.title}
                            </h3>
                        </Link>
                    ))}
                </div>

            </div>
        </section>
    );
};

export default BlogSlider;
