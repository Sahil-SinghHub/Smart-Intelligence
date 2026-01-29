import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../api/client';
import Card from '../components/ui/Card';
import Button from '../components/ui/Button';

const TakeTest = () => {
    const [topics, setTopics] = useState([]);
    const [selectedTopic, setSelectedTopic] = useState('');
    const [totalQuestions, setTotalQuestions] = useState(10);
    const [correct, setCorrect] = useState(0);
    const [wrong, setWrong] = useState(0);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchTopics = async () => {
            try {
                const { data } = await api.get('/topics');
                setTopics(data);
                if (data.length > 0) setSelectedTopic(data[0]._id);
            } catch (error) {
                console.error('Failed to fetch topics', error);
            }
        };
        fetchTopics();
    }, []);

    const handleSubmit = async (e) => {
        e.preventDefault();
        const attempted = parseInt(correct) + parseInt(wrong);
        try {
            await api.post('/tests/submit', {
                topicId: selectedTopic,
                totalQuestions: parseInt(totalQuestions),
                attempted,
                correct: parseInt(correct),
                wrong: parseInt(wrong),
            });
            navigate('/');
        } catch (error) {
            console.error('Failed to submit test', error);
            alert('Failed to submit test');
        }
    };

    return (
        <div className="max-w-2xl mx-auto">
            <Card>
                <div className="mb-6 border-b border-white/10 pb-4">
                    <h3 className="text-2xl font-bold text-white text-glow">Log Test Results</h3>
                    <p className="text-gray-400">Input data to update specific topic algorithms.</p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-6">
                    <div>
                        <label className="block text-sm font-medium text-gray-300 mb-2">Select Topic</label>
                        <select
                            className="w-full bg-black/20 border border-white/10 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-cyan-500/50 focus:ring-1 focus:ring-cyan-500/20 [&>option]:bg-slate-900"
                            value={selectedTopic}
                            onChange={(e) => setSelectedTopic(e.target.value)}
                        >
                            {topics.map((t) => (
                                <option key={t._id} value={t._id}>{t.topicName} ({t.subject})</option>
                            ))}
                        </select>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-300 mb-2">Total Questions in Test</label>
                        <input
                            type="number"
                            required
                            className="w-full bg-black/20 border border-white/10 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-cyan-500/50 focus:ring-1 focus:ring-cyan-500/20"
                            value={totalQuestions}
                            onChange={(e) => setTotalQuestions(e.target.value)}
                        />
                    </div>

                    <div className="grid grid-cols-2 gap-6">
                        <div>
                            <label className="block text-sm font-medium text-green-400 mb-2">Correct Answers</label>
                            <input
                                type="number"
                                required
                                className="w-full bg-green-500/10 border border-green-500/30 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-green-500 focus:ring-1 focus:ring-green-500/20"
                                value={correct}
                                onChange={(e) => setCorrect(e.target.value)}
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-red-400 mb-2">Wrong Answers</label>
                            <input
                                type="number"
                                required
                                className="w-full bg-red-500/10 border border-red-500/30 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-red-500 focus:ring-1 focus:ring-red-500/20"
                                value={wrong}
                                onChange={(e) => setWrong(e.target.value)}
                            />
                        </div>
                    </div>

                    <div className="pt-4">
                        <Button type="submit" className="w-full bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 border-none">
                            Submit & Analyze
                        </Button>
                    </div>
                </form>
            </Card>
        </div>
    );
};

export default TakeTest;
