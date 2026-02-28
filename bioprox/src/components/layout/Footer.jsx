import { Link } from "react-router-dom";
import { Mail, Phone, MapPin, Instagram, Facebook, Twitter, Youtube, ArrowRight } from "lucide-react";
import logo from "../../assets/bio-prox.png";

const Footer = () => {
    return (
        <footer className="bg-primary text-white pt-24 pb-12">
            <div className="container mx-auto px-6">
                <div className="grid md:grid-cols-12 gap-16 mb-20">

                    {/* Brand Section */}
                    <div className="md:col-span-4 space-y-8">
                        <Link to="/" className="inline-block bg-white p-2 rounded-xl">
                            <img src={logo} alt="BioProx Plant Care" className="h-12 w-auto object-contain" />
                        </Link>
                        <p className="text-white/60 font-medium leading-relaxed max-w-sm">
                            Discover the essence of pure botanical care. We provide premium organic seeds and sustainable gardening tools for modern homes across India.
                        </p>
                        <div className="flex gap-4">
                            {[Instagram, Facebook, Twitter, Youtube].map((Icon, idx) => (
                                <button key={idx} className="w-10 h-10 rounded-lg bg-white/5 border border-white/10 flex items-center justify-center hover:bg-secondary hover:text-white transition-all duration-300">
                                    <Icon size={18} />
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Quick Links */}
                    <div className="md:col-span-2">
                        <h4 className="text-sm font-black uppercase tracking-[0.2em] text-secondary mb-8">Navigation</h4>
                        <ul className="space-y-4 font-bold text-white/60">
                            <li><Link to="/shop" className="hover:text-white transition-colors flex items-center gap-2 group"><ArrowRight size={14} className="opacity-0 group-hover:opacity-100 -ml-5 transition-all w-0 group-hover:w-4" /> Shop</Link></li>
                            <li><Link to="/orders" className="hover:text-white transition-colors flex items-center gap-2 group"><ArrowRight size={14} className="opacity-0 group-hover:opacity-100 -ml-5 transition-all w-0 group-hover:w-4" /> Orders</Link></li>
                            <li><Link to="/blogs" className="hover:text-white transition-colors flex items-center gap-2 group"><ArrowRight size={14} className="opacity-0 group-hover:opacity-100 -ml-5 transition-all w-0 group-hover:w-4" /> Blog</Link></li>
                            <li><Link to="/about" className="hover:text-white transition-colors flex items-center gap-2 group"><ArrowRight size={14} className="opacity-0 group-hover:opacity-100 -ml-5 transition-all w-0 group-hover:w-4" /> About</Link></li>
                        </ul>
                    </div>

                    {/* Contact Info */}
                    <div className="md:col-span-3">
                        <h4 className="text-sm font-black uppercase tracking-[0.2em] text-secondary mb-8">Get in Touch</h4>
                        <ul className="space-y-6">
                            <li className="flex gap-4 text-white/60">
                                <MapPin size={24} className="text-secondary shrink-0" />
                                <span className="font-medium text-sm">123 Botanical Square, Green Valley Park, Bangalore, KA 560001</span>
                            </li>
                            <li className="flex gap-4 text-white/60">
                                <Phone size={20} className="text-secondary shrink-0" />
                                <span className="font-medium text-sm">+91 98765 43210</span>
                            </li>
                            <li className="flex gap-4 text-white/60">
                                <Mail size={20} className="text-secondary shrink-0" />
                                <span className="font-medium text-sm">grow@bioprox.in</span>
                            </li>
                        </ul>
                    </div>

                    {/* Newsletter */}
                    <div className="md:col-span-3">
                        <h4 className="text-sm font-black uppercase tracking-[0.2em] text-secondary mb-8">Newsletter</h4>
                        <p className="text-white/60 text-sm font-medium mb-6">Join our green community for weekly tips and exclusive offers.</p>
                        <form className="space-y-3">
                            <input
                                type="email"
                                placeholder="Email address"
                                className="w-full bg-white/5 border border-white/10 rounded-xl px-5 py-3 outline-none focus:border-secondary transition-colors font-bold text-sm"
                            />
                            <button className="w-full bg-secondary text-white py-3 rounded-xl font-black text-xs uppercase tracking-widest hover:bg-emerald-500 transition-colors">
                                SUBSCRIBE
                            </button>
                        </form>
                    </div>
                </div>

                <div className="pt-12 border-t border-white/5 flex flex-col md:flex-row justify-between items-center gap-6">
                    <p className="text-white/40 text-[10px] font-black uppercase tracking-widest">
                        © {new Date().getFullYear()} BioProx Care. All rights reserved.
                    </p>
                    <div className="flex gap-8 text-[10px] font-black uppercase tracking-widest text-white/40">
                        <button className="hover:text-white transition-colors">Privacy</button>
                        <button className="hover:text-white transition-colors">Terms</button>
                    </div>
                </div>
            </div>
        </footer>
    );
};

export default Footer;
