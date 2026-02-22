const Footer = () => {
    return (
        <footer className="bg-green-900 text-white mt-16">
            <div className="container mx-auto px-6 py-12 grid md:grid-cols-4 gap-8">

                <div>
                    <h3 className="text-xl font-bold mb-4">BioProxPlantCare</h3>
                    <p className="text-green-200">
                        Premium organic gardening products delivered across India.
                    </p>
                </div>

                <div>
                    <h4 className="font-semibold mb-3">Quick Links</h4>
                    <ul className="space-y-2 text-green-200">
                        <li>Shop</li>
                        <li>Orders</li>
                        <li>Cart</li>
                    </ul>
                </div>

                <div>
                    <h4 className="font-semibold mb-3">Support</h4>
                    <ul className="space-y-2 text-green-200">
                        <li>Contact Us</li>
                        <li>FAQs</li>
                        <li>Privacy Policy</li>
                    </ul>
                </div>

                <div>
                    <h4 className="font-semibold mb-3">Newsletter</h4>
                    <input
                        type="email"
                        placeholder="Enter your email"
                        className="w-full px-4 py-2 rounded-full text-gray-800"
                    />
                </div>

            </div>

            <div className="bg-green-800 text-center py-4 text-sm">
                © {new Date().getFullYear()} BioProxPlantCare. All rights reserved.
            </div>
        </footer>
    );
};

export default Footer;
