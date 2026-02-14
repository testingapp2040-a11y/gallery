
import React, { useState, useEffect, useRef } from 'react';
import Hero from './components/Hero';
import QuizContainer from './components/QuizContainer';
import ResultsPanel from './components/ResultsPanel';
import { QuizAnswers } from './types';

const INITIAL_ANSWERS: QuizAnswers = {
  usage: [],
  chargeAdmission: '',
  admissionFee: 0,
  currency: 'EUR',
  annualVisitors: 0,
  products: [],
  deviceCounts: {},
  dashboardUsers: 1,
  languages: [],
  pointsOfInterest: '',
  updateFrequency: '',
  wifiStable: '',
  powerStable: '',
  objectives: [],
  commercialStructure: ''
};

const App: React.FC = () => {
  const [answers, setAnswers] = useState<QuizAnswers>(() => {
    const saved = localStorage.getItem('treed_quiz_progress');
    return saved ? JSON.parse(saved) : INITIAL_ANSWERS;
  });
  const [isQuizFinished, setIsQuizFinished] = useState(false);
  const [scrollY, setScrollY] = useState(0);
  const quizSectionRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleScroll = () => {
      setScrollY(window.scrollY);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    localStorage.setItem('treed_quiz_progress', JSON.stringify(answers));
  }, [answers]);

  const startQuiz = () => {
    quizSectionRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const handleFinish = () => {
    setIsQuizFinished(true);
  };

  const resetQuiz = () => {
    setAnswers(INITIAL_ANSWERS);
    setIsQuizFinished(false);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <main className="bg-dark min-h-screen text-white selection:bg-lime selection:text-black overflow-hidden relative">
      {/* Parallax Background Blobs */}
      <div className="fixed inset-0 pointer-events-none z-0">
        <div 
          className="absolute top-0 left-0 w-full h-full bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] opacity-10"
        ></div>
        <div 
          className="absolute -top-[5%] -left-[5%] w-[50%] h-[50%] bg-lime rounded-full blur-[200px] opacity-[0.05] transition-transform duration-75"
          style={{ transform: `translate(${scrollY * 0.05}px, ${scrollY * 0.1}px)` }}
        ></div>
        <div 
          className="absolute bottom-[5%] right-[5%] w-[40%] h-[40%] bg-lime rounded-full blur-[180px] opacity-[0.04] transition-transform duration-75"
          style={{ transform: `translate(-${scrollY * 0.03}px, -${scrollY * 0.08}px)` }}
        ></div>
      </div>

      <div className="relative z-10">
        <section className="h-screen snap-start">
          <Hero onStart={startQuiz} />
        </section>

        <section ref={quizSectionRef} className="min-h-screen flex items-center justify-center py-24 px-4 snap-start relative">
          <div className="w-full max-w-4xl mx-auto">
            {!isQuizFinished ? (
              <QuizContainer 
                answers={answers} 
                setAnswers={setAnswers} 
                onFinish={handleFinish} 
              />
            ) : (
              <ResultsPanel answers={answers} onReset={resetQuiz} />
            )}
          </div>
        </section>
      </div>

      <footer className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50 text-[10px] uppercase tracking-widest text-white/30 font-medium bg-black/50 px-4 py-2 rounded-full backdrop-blur-md border border-white/5">
        Tree'd &copy; 2026 &bull; Next-Gen Audio Guides
      </footer>
    </main>
  );
};

export default App;
