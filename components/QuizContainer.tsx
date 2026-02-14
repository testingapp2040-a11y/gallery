
import React, { useState, useEffect } from 'react';
import ProgressBar from './ProgressBar';
import QuizStep from './QuizStep';
import { QuizAnswers } from '../types';

interface QuizContainerProps {
  answers: QuizAnswers;
  setAnswers: React.Dispatch<React.SetStateAction<QuizAnswers>>;
  onFinish: () => void;
}

const QuizContainer: React.FC<QuizContainerProps> = ({ answers, setAnswers, onFinish }) => {
  const [currentStep, setCurrentStep] = useState(1);
  const [animationState, setAnimationState] = useState<'idle' | 'morphing-out' | 'morphing-in'>('idle');
  const [isSurging, setIsSurging] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [showProgress, setShowProgress] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setShowProgress(true), 100);
    return () => clearTimeout(timer);
  }, []);

  const updateAnswers = (updates: Partial<QuizAnswers>) => {
    setAnswers(prev => ({ ...prev, ...updates }));
  };

  const handleNext = () => {
    if (currentStep < 7) {
      triggerMorphTransition('next');
    } else {
      startProcessing();
    }
  };

  const startProcessing = () => {
    setIsProcessing(true);
    setShowProgress(false);
    setTimeout(() => {
      onFinish();
    }, 2500);
  };

  const handleBack = () => {
    if (currentStep > 1) {
      triggerMorphTransition('back');
    }
  };

  const triggerMorphTransition = (direction: 'next' | 'back') => {
    setAnimationState('morphing-out');
    
    if (direction === 'next') {
      setTimeout(() => setIsSurging(true), 400);
    }

    setTimeout(() => {
      if (direction === 'next') setCurrentStep(prev => prev + 1);
      else setCurrentStep(prev => prev - 1);
      
      setAnimationState('morphing-in');
      
      setTimeout(() => {
        setAnimationState('idle');
        setIsSurging(false);
      }, 500);
    }, 400);
  };

  const getAnimationClass = () => {
    if (animationState === 'morphing-out') return 'page-morph-exit';
    if (animationState === 'morphing-in') return 'page-morph-enter';
    return '';
  };

  if (isProcessing) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] text-center px-6">
        <div className="relative w-32 h-32 mb-10">
          <div className="absolute inset-0 rounded-full border-4 border-white/5"></div>
          <div className="absolute inset-0 rounded-full border-t-4 border-lime animate-spin-slow"></div>
          <div className="absolute inset-0 flex items-center justify-center">
            <svg className="w-12 h-12 text-lime animate-pulse" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
            </svg>
          </div>
        </div>
        <h2 className="text-3xl font-bold mb-4 tracking-tight">Generating Your Profile</h2>
        <p className="text-white/40 max-w-sm mx-auto leading-relaxed">
          Mapping your gallery context to optimal device configurations...
        </p>
      </div>
    );
  }

  return (
    <div className="relative w-full pt-16 md:pt-24 flex flex-col items-center">
      <ProgressBar currentStep={currentStep} isSurging={isSurging} isVisible={showProgress} />
      
      {/* The Shooting Star: Takes off from the right-side button area of the card */}
      {animationState === 'morphing-out' && (
        <div className="fixed z-[101] pointer-events-none" style={{ 
          bottom: 'calc(50vh - 200px)', // Aligns roughly with the action buttons on the centered card
          right: 'calc(50% - 250px)'   // Aligns with the right side of the card where 'Continue' sits
        }}>
          <div className="w-6 h-6 bg-lime rounded-full blur-[2px] animate-streak shadow-[0_0_40px_10px_#c8df52]">
            <div className="absolute top-full left-1/2 -translate-x-1/2 w-4 h-20 bg-gradient-to-t from-transparent to-lime/40 blur-sm"></div>
          </div>
        </div>
      )}

      <div className={`w-full transition-all will-change-transform ${getAnimationClass()}`}>
        <QuizStep 
          step={currentStep}
          answers={answers}
          updateAnswers={updateAnswers}
          onNext={handleNext}
          onBack={handleBack}
        />
      </div>
    </div>
  );
};

export default QuizContainer;
