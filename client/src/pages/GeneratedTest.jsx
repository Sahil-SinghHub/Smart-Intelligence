import { useState, useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import api from '../api/client';
import Card from '../components/ui/Card';
import Button from '../components/ui/Button';
import { Brain, CheckCircle2, XCircle, Timer, ArrowRight, RotateCcw } from 'lucide-react';
import { motion } from 'framer-motion';

const GeneratedTest = () => {
    const [searchParams] = useSearchParams();
    const navigate = useNavigate();
    const topicId = searchParams.get('topicId');

    const [testData, setTestData] = useState(null);
    const [loading, setLoading] = useState(true);

    // Test Taking State
    const [userAnswers, setUserAnswers] = useState({});
    const [startTime, setStartTime] = useState(null);
    const [timeElapsed, setTimeElapsed] = useState(0);
    const [submitted, setSubmitted] = useState(false);
    const [results, setResults] = useState(null);

    useEffect(() => {
        const fetchTest = async () => {
            try {
                const { data } = await api.get(`/ai/generate-test?topicId=${topicId}`);
                setTestData(data);
                setStartTime(Date.now());
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

    // Timer Interval
    useEffect(() => {
        let interval;
        if (!submitted && startTime) {
            interval = setInterval(() => {
                setTimeElapsed(Math.floor((Date.now() - startTime) / 1000));
            }, 1000);
        }
        return () => clearInterval(interval);
    }, [startTime, submitted]);

    const handleOptionSelect = (questionId, option) => {
        if (submitted) return;
        setUserAnswers(prev => ({
            ...prev,
            [questionId]: option
        }));
    };

    const handleSubmit = async () => {
        if (!testData) return;

        const timeTaken = Math.floor((Date.now() - startTime) / 1000);

        let correctCount = 0;
        let wrongCount = 0;

        testData.questions.forEach(q => {
            if (userAnswers[q.id] === q.correctAnswer) {
                correctCount++;
            } else {
                wrongCount++;
            }
        });

        // Optimistic UI Result
        const resultData = {
            total: testData.questions.length,
            correct: correctCount,
            wrong: wrongCount,
            accuracy: Math.round((correctCount / testData.questions.length) * 100),
            timeTaken
        };

        setResults(resultData);
        setSubmitted(true);

        try {
            await api.post('/tests/submit', {
                topicId,
                totalQuestions: testData.questions.length,
                attempted: testData.questions.length, // Assuming all attempted for now, or just send total
                correct: correctCount,
                wrong: wrongCount,
                timeTaken: timeTaken
            });
        } catch (error) {
            console.error("Failed to submit test results", error);
            alert("Results saved locally but failed to sync to server.");
        }
    };

    const formatTime = (seconds) => {
        const mins = Math.floor(seconds / 60);
        const secs = seconds % 60;
        return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
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
                <Button onClick={() => navigate('/')} className="mt-4">Back to Headquarters</Button>
            </Card>
        );
    }

    const { meta, questions } = testData;

    return (
        <div className="max-w-3xl mx-auto space-y-8 pb-12">
            {/* Context Header */}
            <div className="flex items-center justify-between bg-black/40 backdrop-blur-md sticky top-4 z-10 p-4 rounded-xl border border-white/10 shadow-xl">
                <div>
                    <h2 className="text-sm text-gray-400 uppercase tracking-widest">{meta.subject}</h2>
                    <h1 className="text-xl font-bold text-white max-w-[300px] truncate">{meta.topic}</h1>
                </div>
                <div className="flex items-center gap-4">
                    <div className="flex items-center gap-2 text-cyan-300 bg-cyan-500/10 px-3 py-1.5 rounded-lg border border-cyan-500/20">
                        <Timer className="w-4 h-4" />
                        <span className="font-mono font-medium">{formatTime(timeElapsed)}</span>
                    </div>
                </div>
            </div>

            {/* Questions Feed */}
            <div className="space-y-6">
                {questions.map((q, index) => {
                    const isSelected = userAnswers[q.id];
                    const isCorrect = isSelected === q.correctAnswer;
                    const showFeedback = submitted;

                    return (
                        <motion.div
                            key={q.id}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: index * 0.1 }}
                        >
                            <Card className={`relative overflow-visible transition-all duration-300 ${showFeedback ? (isCorrect ? 'border-green-500/30 bg-green-900/10' : 'border-red-500/30 bg-red-900/10') : ''}`}>
                                <div className="absolute -left-3 -top-3 w-8 h-8 rounded-full bg-gradient-to-br from-cyan-500 to-blue-600 flex items-center justify-center font-bold text-white text-sm shadow-lg z-10">
                                    {index + 1}
                                </div>

                                <div className="mb-6 ml-2 mt-2">
                                    <h3 className="text-lg font-medium text-white leading-relaxed">
                                        {q.question}
                                    </h3>
                                </div>

                                {q.type === 'MCQ' && (
                                    <div className="grid grid-cols-1 gap-3 ml-2">
                                        {q.options.map((opt, i) => {
                                            const selected = userAnswers[q.id] === opt;
                                            let optionClass = "border-white/10 bg-white/5 hover:bg-white/10";

                                            if (showFeedback) {
                                                if (opt === q.correctAnswer) optionClass = "border-green-500 bg-green-500/20 text-green-200";
                                                else if (selected) optionClass = "border-red-500 bg-red-500/20 text-red-200";
                                                else optionClass = "opacity-50";
                                            } else {
                                                if (selected) optionClass = "border-cyan-500 bg-cyan-500/20 text-cyan-200 shadow-[0_0_15px_rgba(6,182,212,0.3)]";
                                            }

                                            return (
                                                <div
                                                    key={i}
                                                    onClick={() => handleOptionSelect(q.id, opt)}
                                                    className={`p-4 rounded-lg border transition-all cursor-pointer text-gray-300 ${optionClass}`}
                                                >
                                                    <div className="flex items-center justify-between">
                                                        <span>{opt}</span>
                                                        {showFeedback && opt === q.correctAnswer && <CheckCircle2 className="w-5 h-5 text-green-400" />}
                                                        {showFeedback && selected && opt !== q.correctAnswer && <XCircle className="w-5 h-5 text-red-400" />}
                                                    </div>
                                                </div>
                                            );
                                        })}
                                    </div>
                                )}

                                {showFeedback && (
                                    <motion.div
                                        initial={{ opacity: 0, height: 0 }}
                                        animate={{ opacity: 1, height: 'auto' }}
                                        className="mt-4 ml-2 p-4 rounded-lg bg-black/40 border border-white/10 text-sm"
                                    >
                                        <p className="text-gray-400 italic">
                                            <span className="font-semibold text-cyan-400">Explanation: </span>
                                            {q.explanation}
                                        </p>
                                    </motion.div>
                                )}
                            </Card>
                        </motion.div>
                    );
                })}
            </div>

            {/* Actions */}
            <div className="sticky bottom-6 flex justify-center pt-4">
                {!submitted ? (
                    <Button
                        onClick={handleSubmit}
                        className="w-full max-w-md bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 text-lg py-4 shadow-xl shadow-cyan-900/20"
                        disabled={Object.keys(userAnswers).length < questions.length}
                    >
                        {Object.keys(userAnswers).length < questions.length
                            ? `Answer all questions (${Object.keys(userAnswers).length}/${questions.length})`
                            : 'Submit Assessment'}
                    </Button>
                ) : (
                    <div className="bg-black/80 backdrop-blur-md p-6 rounded-2xl border border-white/10 shadow-2xl w-full max-w-lg text-center space-y-4">
                        <h3 className="text-2xl font-bold text-white">Assessment Complete</h3>
                        <div className="grid grid-cols-3 gap-4">
                            <div className="p-3 bg-green-500/10 rounded-lg border border-green-500/20">
                                <p className="text-xs text-green-400 uppercase">Score</p>
                                <p className="text-2xl font-bold text-white">{results.accuracy}%</p>
                            </div>
                            <div className="p-3 bg-blue-500/10 rounded-lg border border-blue-500/20">
                                <p className="text-xs text-blue-400 uppercase">Correct</p>
                                <p className="text-2xl font-bold text-white">{results.correct}/{results.total}</p>
                            </div>
                            <div className="p-3 bg-purple-500/10 rounded-lg border border-purple-500/20">
                                <p className="text-xs text-purple-400 uppercase">Time</p>
                                <p className="text-2xl font-bold text-white">{formatTime(results.timeTaken)}</p>
                            </div>
                        </div>
                        <Button onClick={() => navigate('/')} className="w-full">
                            Return to Dashboard <ArrowRight className="w-4 h-4 ml-2" />
                        </Button>
                    </div>
                )}
            </div>
        </div>
    );
};

export default GeneratedTest;
