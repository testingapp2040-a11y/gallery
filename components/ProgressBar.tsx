
import React from 'react';
import { STEPS } from '../constants';

interface ProgressBarProps {
  currentStep: number;
  isSurging?: boolean;
  isVisible: boolean;
}

const ProgressBar: React.FC<ProgressBarProps> = ({ currentStep, isSurging, isVisible }) => {
  const step = STEPS.find(s => s.id === currentStep) || STEPS[0];
  
  return (
    <div 
      className={`fixed top-0 left-0 w-full z-[100] glass px-6 h-14 flex items-center justify-between border-b border-white/5 transition-all duration-700 cubic-bezier(0.16, 1, 0.3, 1) ${
        isVisible ? 'translate-y-0 opacity-100' : '-translate-y-full opacity-0 pointer-events-none'
      } ${isSurging ? 'bg-white/5 border-lime/30' : ''}`}
    >
      <div className="flex flex-col justify-center">
        <div className="flex items-center gap-2 mb-1">
          <span className="text-[9px] font-bold tracking-[0.2em] uppercase text-white/30">Intelligence Progress</span>
          <span className={`text-[9px] font-bold tracking-[0.2em] uppercase transition-colors duration-500 ${isSurging ? 'text-white' : 'text-lime'}`}>
            {step.percentage}%
          </span>
        </div>
        <div className="w-48 h-1 bg-white/5 rounded-full overflow-hidden relative">
          <div 
            className={`h-full bg-lime transition-all duration-1000 ease-out relative ${isSurging ? 'animate-bar-surge shadow-[0_0_20px_#c8df52]' : 'shadow-[0_0_10px_rgba(200,223,82,0.3)]'}`}
            style={{ width: `${step.percentage}%` }}
          >
            {isSurging && (
              <div className="absolute inset-0 bg-white/50 animate-pulse"></div>
            )}
          </div>
        </div>
      </div>
      
      <div className="text-right">
        <span className="text-[10px] font-bold tracking-widest uppercase text-white/40 block">Step {currentStep} of 7</span>
        <span className={`text-[11px] font-bold tracking-widest uppercase block transition-all duration-500 ${isSurging ? 'text-lime translate-x-[-5px]' : 'text-white'}`}>
          {step.title}
        </span>
      </div>
    </div>
  );
};

export default ProgressBar;
