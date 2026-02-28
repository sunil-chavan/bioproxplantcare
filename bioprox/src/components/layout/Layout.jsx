import Navbar from "./Navbar";
import Footer from "./Footer";
import TopBar from "./Topbar";
import BottomNav from "./BottomNav";

const Layout = ({ children }) => {
    return (
        <div className="flex flex-col min-h-screen bg-gray-50 text-gray-800">
            <TopBar />
            <Navbar />
            <main className="flex-1 pb-20 lg:pb-0">{children}</main>
            <Footer />
            <BottomNav />
        </div>
    );
};

export default Layout;
