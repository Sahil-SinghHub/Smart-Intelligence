import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import Card from '../components/ui/Card';
import Button from '../components/ui/Button';
import { BookOpen } from 'lucide-react';

const Login = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const { login } = useAuth();
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await login(email, password);
            navigate('/');
        } catch (err) {
            setError(err.response?.data?.message || 'Login failed');
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center p-4 relative overflow-hidden">
            {/* Background Elements */}
            <div className="absolute inset-0 z-[-1]">
                <div className="absolute top-[20%] left-[20%] w-[30%] h-[30%] bg-purple-900/30 rounded-full blur-[100px]" />
                <div className="absolute bottom-[20%] right-[20%] w-[30%] h-[30%] bg-cyan-900/30 rounded-full blur-[100px]" />
            </div>

            <Card className="max-w-md w-full border-t border-white/20">
                <div className="text-center mb-8">
                    <BookOpen className="h-12 w-12 text-cyan-400 mx-auto mb-4 drop-shadow-[0_0_15px_rgba(0,243,255,0.5)]" />
                    <h2 className="text-3xl font-bold text-white text-glow">Welcome Back</h2>
                    <p className="text-gray-400 mt-2">Sign in to your revision command center</p>
                </div>

                <form className="space-y-6" onSubmit={handleSubmit}>
                    {error && <div className="p-3 rounded bg-red-500/10 border border-red-500/20 text-red-400 text-center text-sm">{error}</div>}

                    <div className="space-y-4">
                        <div>
                            <input
                                type="email"
                                required
                                className="w-full bg-black/20 border border-white/10 rounded-lg px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-cyan-500/50 focus:ring-1 focus:ring-cyan-500/20 transition-all"
                                placeholder="Email address"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                            />
                        </div>
                        <div>
                            <input
                                type="password"
                                required
                                className="w-full bg-black/20 border border-white/10 rounded-lg px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-cyan-500/50 focus:ring-1 focus:ring-cyan-500/20 transition-all"
                                placeholder="Password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                            />
                        </div>
                    </div>

                    <Button type="submit" className="w-full">
                        Initiate Session
                    </Button>

                    <div className="text-center">
                        <Link to="/signup" className="text-sm text-cyan-400 hover:text-cyan-300 transition-colors">
                            New user? Create access credentials
                        </Link>
                    </div>
                </form>
            </Card>
        </div>
    );
};

export default Login;
