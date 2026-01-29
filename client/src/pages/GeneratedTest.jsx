import { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import api from '../api/client';
import Card from '../components/ui/Card';
import Button from '../components/ui/Button';
import { Brain, CheckCircle2, HelpCircle } from 'lucide-react';
import { motion } from 'framer-motion';

const GeneratedTest = () => {
    const [searchParams] = useSearchParams();
    const topicId = searchParams.get('topicId');
    const [testData, setTestData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [showAnswers, setShowAnswers] = useState({});

    useEffect(() => {
        const fetchTest = async () => {
            try {
                const { data } = await api.get(`/ai/generate-test?topicId=${topicId}`);
                setTestData(data);
            } catch (error) {
                console.error('Failed to generate test', error);
            } finally {
                setLoading(false);
            }
        };

        if (topicId) {
            fetchTest();
        }
    }, [topicId]);

    const toggleAnswer = (id) => {
        setShowAnswers(prev => ({
            ...prev,
            [id]: !prev[id]
        }));
    };

    if (loading) {
        return (
            <div className="flex flex-col items-center justify-center min-h-[50vh] text-center">
                <div className="w-16 h-16 border-4 border-cyan-500 border-t-transparent rounded-full animate-spin mb-4" />
                <p className="text-cyan-300 text-glow">Synthesizing Examination Matrix...</p>
            </div>
        );
    }

    if (!testData) {
        return (
            <Card className="text-center py-12">
                <p className="text-red-400">Failed to load assessment modules.</p>
            </Card>
        );
    }

    const { meta, questions } = testData;

    return (
        <div className="max-w-3xl mx-auto space-y-8">
            <div className="text-center space-y-2">
                <div className="inline-flex items-center justify-center p-3 rounded-full bg-cyan-500/10 mb-4">
                    <Brain className="w-8 h-8 text-cyan-400" />
                </div>
                <h1 className="text-3xl font-bold text-white text-glow">Adaptive Assessment: {meta.topic}</h1>
                <p className="text-gray-400">
                    Level: <span className="text-cyan-300">{meta.difficulty}</span> •
                    Questions: <span className="text-cyan-300">{meta.totalQuestions}</span>
                </p>
            </div>

            <div className="space-y-6">
                {questions.map((q, index) => (
                    <motion.div
                        key={q.id}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.1 }}
                    >
                        <Card className="relative overflow-visible">
                            <div className="absolute -left-3 -top-3 w-8 h-8 rounded-full bg-gradient-to-br from-cyan-500 to-blue-600 flex items-center justify-center font-bold text-white text-sm shadow-lg">
                                {index + 1}
                            </div>

                            <div className="mb-4 ml-2">
                                <span className="text-xs uppercase tracking-wider text-gray-500 border border-white/10 px-2 py-0.5 rounded mr-2">
                                    {q.type}
                                </span>
                                <h3 className="text-xl font-medium text-white mt-2 leading-relaxed">
                                    {q.question}
                                </h3>
                            </div>

                            {q.type === 'MCQ' && (
                                <div className="grid grid-cols-1 gap-2 mb-6 ml-2">
                                    {q.options.map((opt, i) => (
                                        <div key={i} className="p-3 rounded-lg border border-white/10 bg-white/5 hover:bg-white/10 transition-colors cursor-pointer text-gray-300">
                                            {opt}
                                        </div>
                                    ))}
                                </div>
                            )}

                            <div className="ml-2">
                                <Button
                                    onClick={() => toggleAnswer(q.id)}
                                    variant="ghost"
                                    className="text-xs py-2 px-3 h-auto"
                                >
                                    {showAnswers[q.id] ? 'Hide Evaluation' : 'Reveal Solution'}
                                </Button>

                                {showAnswers[q.id] && (
                                    <motion.div
                                        initial={{ opacity: 0, height: 0 }}
                                        animate={{ opacity: 1, height: 'auto' }}
                                        className="mt-4 p-4 rounded-lg bg-green-500/10 border border-green-500/20 text-sm"
                                    >
                                        <div className="flex items-start gap-3 mb-2">
                                            <CheckCircle2 className="w-5 h-5 text-green-400 flex-shrink-0 mt-0.5" />
                                            <div>
                                                <p className="font-semibold text-green-300 mb-1">
                                                    Correct Answer: {q.correctAnswer || 'See Explanation'}
                                                </p>
                                                {q.answerKey && (
                                                    <p className="text-gray-300 mb-2">{q.answerKey}</p>
                                                )}
                                                <p className="text-gray-400 italic border-t border-green-500/20 pt-2 mt-2">
                                                    <HelpCircle className="w-3 h-3 inline mr-1" />
                                                    {q.explanation}
                                                </p>
                                            </div>
                                        </div>
                                    </motion.div>
                                )}
                            </div>
                        </Card>
                    </motion.div>
                ))}
            </div>
        </div>
    );
};

export default GeneratedTest;
