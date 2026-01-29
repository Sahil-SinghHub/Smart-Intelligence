import { useState, useEffect } from 'react';
import api from '../api/client';
import { AlertCircle, CheckCircle, TrendingUp, Sparkles, Activity, Trash2 } from 'lucide-react';
import { motion } from 'framer-motion';
import Card from '../components/ui/Card';
import Button from '../components/ui/Button';
import { cn } from '../lib/utils';

const Dashboard = () => {
    const [revisionPlan, setRevisionPlan] = useState([]);
    const [direction, setDirection] = useState('');
    const [stats, setStats] = useState({ weak: 0, medium: 0, strong: 0 });

    const fetchData = async () => {
        try {
            const planRes = await api.get('/ai/revision-plan');
            setRevisionPlan(planRes.data);

            const s = { weak: 0, medium: 0, strong: 0 };
            planRes.data.forEach(p => {
                if (p.classification === 'Weak') s.weak++;
                else if (p.classification === 'Medium') s.medium++;
                else if (p.classification === 'Strong') s.strong++;
            });
            setStats(s);

            const dirRes = await api.get('/ai/direction');
            setDirection(dirRes.data.message);
        } catch (error) {
            console.error('Error fetching dashboard data', error);
        }
    };

    useEffect(() => {
        fetchData();
    }, []);

    const handleDelete = async (id) => {
        if (!window.confirm('Are you sure you want to delete this topic? This action cannot be undone.')) return;
        try {
            await api.delete(`/topics/${id}`);
            // Optimistic update or refetch
            setRevisionPlan(prev => prev.filter(item => item._id !== id));
            // Update stats locally or refetch
            fetchData();
        } catch (error) {
            console.error('Error deleting topic', error);
            alert('Failed to delete topic');
        }
    };

    const container = {
        hidden: { opacity: 0 },
        show: {
            opacity: 1,
            transition: {
                staggerChildren: 0.1
            }
        }
    };

    return (
        <motion.div
            variants={container}
            initial="hidden"
            animate="show"
            className="space-y-8"
        >
            {/* Header Section */}
            <div className="text-center space-y-2">
                <h1 className="text-4xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-cyan-300 via-white to-purple-400 text-glow">
                    Command Center
                </h1>
                <p className="text-gray-400 max-w-lg mx-auto">
                    AI-driven insights to optimize your study trajectory.
                </p>
            </div>

            {/* Direction & Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <Card className="md:col-span-2 relative group">
                    <div className="absolute top-0 right-0 p-4 opacity-50">
                        <Sparkles className="w-6 h-6 text-purple-400 animate-pulse" />
                    </div>
                    <h3 className="text-lg font-medium text-cyan-300 mb-2 flex items-center">
                        <Activity className="w-5 h-5 mr-2" /> Daily Directive
                    </h3>
                    <div className="mt-4 p-4 rounded-lg bg-white/5 border border-white/5">
                        <p className="text-lg text-gray-200 leading-relaxed font-light">
                            {direction || "Calibrating AI..."}
                        </p>
                    </div>
                </Card>

                <Card>
                    <h3 className="text-lg font-medium text-purple-300 mb-6 text-center">Performance Matrix</h3>
                    <div className="grid grid-cols-1 gap-4">
                        <div className="flex items-center justify-between p-3 rounded-lg bg-red-500/10 border border-red-500/20">
                            <span className="text-red-300 text-sm">Weak Areas</span>
                            <span className="text-2xl font-bold text-red-400">{stats.weak}</span>
                        </div>
                        <div className="flex items-center justify-between p-3 rounded-lg bg-yellow-500/10 border border-yellow-500/20">
                            <span className="text-yellow-300 text-sm">In Progress</span>
                            <span className="text-2xl font-bold text-yellow-400">{stats.medium}</span>
                        </div>
                        <div className="flex items-center justify-between p-3 rounded-lg bg-cyan-500/10 border border-cyan-500/20">
                            <span className="text-cyan-300 text-sm">Mastered</span>
                            <span className="text-2xl font-bold text-cyan-400">{stats.strong}</span>
                        </div>
                    </div>
                </Card>
            </div>

            {/* Revision Plan Feed */}
            <div className="space-y-4">
                <div className="flex items-center justify-between">
                    <h3 className="text-xl font-semibold text-white">Revision Protocol</h3>
                    <span className="text-xs px-2 py-1 rounded-full bg-white/10 text-gray-400 border border-white/5">
                        {revisionPlan.length} Active Modules
                    </span>
                </div>

                <motion.div
                    className="grid grid-cols-1 gap-4"
                    variants={container}
                >
                    {revisionPlan.map((item, index) => (
                        <Card key={index} className="flex flex-col md:flex-row gap-6 items-start md:items-center group">
                            <div className="flex-shrink-0">
                                <div className={cn(
                                    "w-12 h-12 rounded-full flex items-center justify-center border",
                                    item.classification === 'Weak' ? "bg-red-500/20 border-red-500/50 text-red-400" :
                                        item.classification === 'Medium' ? "bg-yellow-500/20 border-yellow-500/50 text-yellow-400" :
                                            "bg-cyan-500/20 border-cyan-500/50 text-cyan-400"
                                )}>
                                    {item.classification === 'Weak' && <AlertCircle className="w-6 h-6" />}
                                    {item.classification === 'Medium' && <TrendingUp className="w-6 h-6" />}
                                    {item.classification === 'Strong' && <CheckCircle className="w-6 h-6" />}
                                </div>
                            </div>

                            <div className="flex-grow">
                                <div className="flex items-center space-x-2 mb-1">
                                    <h4 className="text-lg font-medium text-white">{item.topic}</h4>
                                    <span className="text-xs text-gray-500 uppercase tracking-wider border border-white/10 px-2 rounded-md">
                                        {item.subject}
                                    </span>
                                </div>

                                <ul className="text-sm text-gray-400 space-y-1 mt-2">
                                    {item.strategy.map((s, i) => (
                                        <li key={i} className="flex items-start">
                                            <span className="mr-2 text-cyan-500/50">•</span> {s}
                                        </li>
                                    ))}
                                </ul>
                            </div>

                            <div className="flex-shrink-0 text-right min-w-[120px] flex flex-col gap-2 items-end">
                                <div>
                                    <p className="text-xs text-gray-500 mb-1">Next Evaluation</p>
                                    <p className="text-sm font-semibold text-cyan-300 bg-cyan-500/10 px-3 py-1 rounded-full border border-cyan-500/20 inline-block">
                                        {new Date(item.nextTestDate).toLocaleDateString()}
                                    </p>
                                </div>
                                <div className="flex items-center gap-2">
                                    <Button
                                        variant="ghost"
                                        className="text-xs p-2 h-auto text-red-400 hover:text-red-300 hover:bg-red-500/10"
                                        onClick={() => handleDelete(item._id)}
                                        title="Delete Topic"
                                    >
                                        <Trash2 className="w-4 h-4" />
                                    </Button>
                                    <Button
                                        variant="ghost"
                                        className="text-xs py-1 px-2 h-auto text-purple-300 hover:text-purple-200"
                                        onClick={() => window.location.href = `/generate-test?topicId=${item._id}`}
                                    >
                                        Generate AI Test
                                    </Button>
                                </div>
                            </div>
                        </Card>
                    ))}

                    {revisionPlan.length === 0 && (
                        <Card className="text-center py-12 opacity-50">
                            <p className="text-gray-400">System idle. Initialize by adding study topics.</p>
                        </Card>
                    )}
                </motion.div>
            </div>
        </motion.div>
    );
};

export default Dashboard;
