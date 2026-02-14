
import React, { useEffect, useState } from 'react';

interface HeroProps {
  onStart: () => void;
}

const Hero: React.FC<HeroProps> = ({ onStart }) => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    setIsVisible(true);
  }, []);

  return (
    <div className="relative h-full w-full flex flex-col items-center justify-center px-4 text-center overflow-hidden">
      {/* Animated Background Mesh */}
      <div className="absolute inset-0 z-0 pointer-events-none">
        <svg className="absolute w-full h-full opacity-10" viewBox="0 0 100 100" preserveAspectRatio="none">
          <defs>
            <pattern id="grid" width="10" height="10" patternUnits="userSpaceOnUse">
              <path d="M 10 0 L 0 0 0 10" fill="none" stroke="#c8df52" strokeWidth="0.1" />
            </pattern>
          </defs>
          <rect width="100" height="100" fill="url(#grid)" />
        </svg>
      </div>

      <div className={`z-10 transition-all duration-1000 transform ${isVisible ? 'translate-y-0 opacity-100' : 'translate-y-20 opacity-0'}`}>
        <div className="inline-block px-4 py-1.5 rounded-full glass border border-lime/20 text-lime text-[10px] font-bold tracking-[0.2em] uppercase mb-8 animate-pulse-slow">
          Next-Gen Audio Solutions
        </div>
        
        <h1 className="text-5xl md:text-7xl lg:text-8xl font-bold tracking-tight mb-8 max-w-5xl mx-auto leading-[1.05]">
          Find the right audio guide <br />
          <span className="text-lime">setup for your gallery.</span>
        </h1>
        
        <p className="text-lg md:text-xl text-white/50 max-w-2xl mx-auto mb-14 font-light leading-relaxed">
          Unlock personalized insights and tailored device recommendations through 
          our comprehensive gallery context evaluation engine.
        </p>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-6">
          <button 
            onClick={onStart}
            className="group relative px-12 py-5 bg-lime text-black font-bold rounded-2xl overflow-hidden transition-all duration-300 hover:scale-[1.05] active:scale-95 shadow-[0_10px_30px_rgba(200,223,82,0.2)] hover:shadow-[0_15px_50px_rgba(200,223,82,0.4)]"
          >
            <span className="relative z-10 text-lg">Start the Quiz</span>
            <div className="absolute inset-0 bg-white opacity-0 group-hover:opacity-20 transition-opacity duration-300"></div>
          </button>
          
          <a 
            href="https://treed.co/booking" 
            target="_blank" 
            rel="noopener noreferrer"
            className="px-12 py-5 text-white font-bold rounded-2xl glass border border-white/10 hover:border-lime/40 hover:bg-lime/5 transition-all duration-300 hover:scale-[1.05] active:scale-95 flex items-center justify-center"
          >
            Book a Demo
          </a>
        </div>
      </div>

      <div className="absolute bottom-12 left-1/2 -translate-x-1/2 flex flex-col items-center gap-4 text-white/10">
        <span className="text-[9px] uppercase tracking-[0.4em] font-bold">Intelligent Analysis</span>
        <div className="w-[1px] h-14 bg-gradient-to-b from-white/20 to-transparent"></div>
      </div>
    </div>
  );
};

export default Hero;
