import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../api/client';
import Card from '../components/ui/Card';
import Button from '../components/ui/Button';
import { Sparkles } from 'lucide-react';

const AddTopic = () => {
    const [subject, setSubject] = useState('');
    const [topicName, setTopicName] = useState('');
    const [keyPoints, setKeyPoints] = useState('');
    const [difficulty, setDifficulty] = useState('Medium');
    const [priority, setPriority] = useState('Medium');
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const handleSuggest = async () => {
        if (!subject || !topicName) {
            alert('Please enter Subject and Topic Name first');
            return;
        }
        try {
            setLoading(true);
            const { data } = await api.get(`/ai/suggest-concepts?subject=${subject}&topic=${topicName}`);

            const current = keyPoints ? keyPoints + ', ' : '';
            // Handles case where suggestions might be empty or formatted differently
            if (data.suggestions && data.suggestions.length > 0) {
                setKeyPoints(current + data.suggestions.join(', '));
            } else {
                alert('No specific suggestions found. Try generic concepts.');
            }
        } catch (error) {
            console.error('Suggestion failed', error);
            alert('AI Suggestion unavailable at the moment.');
        } finally {
            setLoading(false);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            // Split key points by comma or newline and filter empty ones
            const pointsArray = keyPoints.split(/[,\n]+/).map(p => p.trim()).filter(p => p);

            await api.post('/topics/add', {
                subject,
                topicName,
                difficulty,
                priority,
                keyPoints: pointsArray
            });
            navigate('/');
        } catch (error) {
            console.error('Failed to add topic', error);
            const msg = error.response?.data?.message || 'Failed to add topic';
            alert(msg);
        }
    };

    return (
        <div className="max-w-2xl mx-auto">
            <Card>
                <div className="mb-6 border-b border-white/10 pb-4">
                    <h3 className="text-2xl font-bold text-white text-glow">Add New Module</h3>
                    <p className="text-gray-400">Register a new topic for AI analysis.</p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                            <label className="block text-sm font-medium text-gray-300 mb-2">Subject Domain</label>
                            <input
                                type="text"
                                required
                                className="w-full bg-black/20 border border-white/10 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-cyan-500/50 focus:ring-1 focus:ring-cyan-500/20"
                                placeholder="e.g. Physics"
                                value={subject}
                                onChange={(e) => setSubject(e.target.value)}
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-300 mb-2">Topic Identifier</label>
                            <input
                                type="text"
                                required
                                className="w-full bg-black/20 border border-white/10 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-cyan-500/50 focus:ring-1 focus:ring-cyan-500/20"
                                placeholder="e.g. Quantum Mechanics"
                                value={topicName}
                                onChange={(e) => setTopicName(e.target.value)}
                            />
                        </div>
                    </div>

                    <div>
                        <div className="flex justify-between items-center mb-2">
                            <label className="block text-sm font-medium text-gray-300">Key Concepts / Notes</label>
                            <button
                                type="button"
                                onClick={handleSuggest}
                                disabled={loading}
                                className="text-xs text-cyan-400 hover:text-cyan-300 flex items-center transition-colors disabled:opacity-50"
                            >
                                <Sparkles className="w-3 h-3 mr-1" />
                                {loading ? 'Synthesizing...' : 'AI Auto-Suggest'}
                            </button>
                        </div>
                        <textarea
                            className="w-full bg-black/20 border border-white/10 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-cyan-500/50 focus:ring-1 focus:ring-cyan-500/20 h-32 resize-none"
                            placeholder="Enter key facts, formulas, or concepts here (separated by commas or new lines)..."
                            value={keyPoints}
                            onChange={(e) => setKeyPoints(e.target.value)}
                        />
                        <p className="text-xs text-gray-500 mt-1">AI will use these points to generate custom tests.</p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                            <label className="block text-sm font-medium text-gray-300 mb-2">Complexity Level</label>
                            <select
                                className="w-full bg-black/20 border border-white/10 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-cyan-500/50 focus:ring-1 focus:ring-cyan-500/20 [&>option]:bg-slate-900"
                                value={difficulty}
                                onChange={(e) => setDifficulty(e.target.value)}
                            >
                                <option>Easy</option>
                                <option>Medium</option>
                                <option>Hard</option>
                            </select>
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-300 mb-2">Priority Status</label>
                            <select
                                className="w-full bg-black/20 border border-white/10 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-cyan-500/50 focus:ring-1 focus:ring-cyan-500/20 [&>option]:bg-slate-900"
                                value={priority}
                                onChange={(e) => setPriority(e.target.value)}
                            >
                                <option>Low</option>
                                <option>Medium</option>
                                <option>High</option>
                            </select>
                        </div>
                    </div>

                    <div className="pt-4">
                        <Button type="submit" className="w-full">
                            Register Module
                        </Button>
                    </div>
                </form>
            </Card>
        </div>
    );
};

export default AddTopic;
