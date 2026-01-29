import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { LogOut, BookOpen, LayoutDashboard, FilePlus, ClipboardList } from 'lucide-react';
import { motion } from 'framer-motion';
import { cn } from '../lib/utils';
import Button from './ui/Button';

const NavLink = ({ to, children, icon: Icon }) => {
    const location = useLocation();
    const isActive = location.pathname === to;

    return (
        <Link to={to} className="relative group">
            <div className={cn(
                "flex items-center space-x-2 px-3 py-2 rounded-lg transition-colors",
                isActive ? "text-cyan-300 bg-white/5" : "text-gray-400 hover:text-white hover:bg-white/5"
            )}>
                <Icon className={cn("w-4 h-4", isActive && "text-cyan-400 drop-shadow-[0_0_5px_rgba(0,243,255,0.5)]")} />
                <span className="text-sm font-medium">{children}</span>
            </div>
        </Link>
    );
};

const Navbar = () => {
    const { user, logout } = useAuth();
    const navigate = useNavigate();

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    if (!user) return null;

    return (
        <motion.div
            initial={{ y: -100, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            className="fixed top-4 left-0 right-0 z-50 flex justify-center px-4"
        >
            <div className="glass-panel rounded-full px-6 py-3 flex items-center justify-between w-full max-w-5xl shadow-[0_10px_40px_-5px_rgba(0,0,0,0.5)]">
                <div className="flex items-center space-x-8">
                    <Link to="/" className="flex items-center space-x-2 group">
                        <div className="p-2 rounded-full bg-cyan-500/10 border border-cyan-500/30 group-hover:bg-cyan-500/20 transition-colors">
                            <BookOpen className="h-5 w-5 text-cyan-400" />
                        </div>
                        <span className="font-bold text-lg tracking-wide text-transparent bg-clip-text bg-gradient-to-r from-cyan-300 to-purple-400">
                            SmartRevise
                        </span>
                    </Link>

                    <div className="hidden md:flex items-center space-x-1 border-l border-white/10 pl-6">
                        <NavLink to="/" icon={LayoutDashboard}>Dashboard</NavLink>
                        <NavLink to="/add-topic" icon={FilePlus}>Add Topic</NavLink>
                        <NavLink to="/test" icon={ClipboardList}>Take Test</NavLink>
                    </div>
                </div>

                <div className="flex items-center space-x-4">
                    <div className="text-right hidden sm:block">
                        <p className="text-xs text-gray-400">Welcome back</p>
                        <p className="text-sm font-semibold text-gray-200">{user.name}</p>
                    </div>
                    <Button
                        className="rounded-full px-4 py-2 text-xs flex items-center bg-red-500/10 text-red-400 border-red-500/20 hover:bg-red-500/20 hover:shadow-none"
                        onClick={handleLogout}
                        variant="ghost"
                    >
                        <LogOut className="mr-2 h-3 w-3" /> Logout
                    </Button>
                </div>
            </div>
        </motion.div>
    );
};

export default Navbar;
