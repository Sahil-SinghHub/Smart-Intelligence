import { Outlet } from 'react-router-dom';
import Navbar from './Navbar';

const Layout = () => {
    return (
        <div className="min-h-screen text-gray-100 font-sans selection:bg-cyan-500/30">
            <div className="fixed inset-0 pointer-events-none z-[-1]">
                <div className="absolute top-[-20%] left-[-10%] w-[50%] h-[50%] bg-purple-900/20 rounded-full blur-[120px]" />
                <div className="absolute bottom-[-20%] right-[-10%] w-[50%] h-[50%] bg-cyan-900/20 rounded-full blur-[120px]" />
            </div>

            <Navbar />

            <main className="max-w-5xl mx-auto py-24 px-4 sm:px-6 lg:px-8 relative z-10">
                <Outlet />
            </main>
        </div>
    );
};

export default Layout;
