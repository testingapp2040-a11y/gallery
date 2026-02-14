
import React, { useMemo, useState } from 'react';
import { QuizAnswers } from '../types';
import { OPTIONS, CURRENCIES } from '../constants';

interface QuizStepProps {
  step: number;
  answers: QuizAnswers;
  updateAnswers: (updates: Partial<QuizAnswers>) => void;
  onNext: () => void;
  onBack: () => void;
}

const PRODUCT_TOOLTIPS: Record<string, string> = {
  'AI-only handset': 'Designed for conversational-first experiences. Visitors can ask questions and receive real-time answers powered by Tree’d’s closed-domain AI model.',
  'NFC-only guide': 'A streamlined, tap-to-listen system. Visitors tap near exhibits to hear curated, pre-approved audio stories, no conversational AI layer included.',
  'AI + NFC handset': 'Tree’d complete system. Combines tap-triggered exhibit storytelling with real-time conversational AI. Visitors tap to start a curated story, then ask follow-up questions for deeper exploration.'
};

const formatNumber = (num: number) => {
  return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
};

const QuizStep: React.FC<QuizStepProps> = ({ step, answers, updateAnswers, onNext, onBack }) => {
  const [activeTooltip, setActiveTooltip] = useState<string | null>(null);
  
  const isValid = useMemo(() => {
    switch(step) {
      case 1:
        const baseValid = (answers.annualVisitors || 0) > 0 && answers.usage.length > 0;
        if (answers.chargeAdmission === 'Yes') {
          return baseValid && (answers.admissionFee || 0) > 0;
        }
        return baseValid && answers.chargeAdmission === 'No';
      case 2:
        return answers.products.length > 0;
      case 3:
        const productsSelected = answers.products.every(p => (answers.deviceCounts[p] || 0) > 0);
        return productsSelected && (answers.dashboardUsers || 0) > 0;
      case 4:
        return answers.languages.length > 0;
      case 5:
        return !!answers.pointsOfInterest && !!answers.updateFrequency;
      case 6:
        return answers.wifiStable !== '' && answers.powerStable !== '';
      case 7:
        return answers.objectives.length >= 1 && answers.objectives.length <= 3 && !!answers.commercialStructure;
      default:
        return false;
    }
  }, [step, answers]);

  const toggleMultiSelect = (key: keyof QuizAnswers, value: string) => {
    const current = (answers[key] as string[]) || [];
    const updated = current.includes(value) 
      ? current.filter(i => i !== value) 
      : [...current, value];
    updateAnswers({ [key]: updated });
  };

  const renderOptions = (key: keyof QuizAnswers, options: string[], isMulti = false, limit?: number) => {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {options.map((opt, index) => {
          const isSelected = isMulti 
            ? (answers[key] as string[]).includes(opt)
            : answers[key] === opt;
          
          const tooltip = key === 'products' ? PRODUCT_TOOLTIPS[opt] : null;
          
          return (
            <div key={opt} className="relative">
              <button
                onClick={() => {
                  if (isMulti) {
                    if (limit && !isSelected && (answers[key] as string[]).length >= limit) return;
                    toggleMultiSelect(key, opt);
                  } else {
                    updateAnswers({ [key]: opt });
                  }
                }}
                className={`p-6 w-full text-left rounded-2xl glass border transition-all duration-300 group relative animate-fade-in-up opacity-0 hover-glow ${
                  isSelected ? 'border-lime/60 bg-lime/[0.03]' : 'border-white/5'
                }`}
                style={{ animationDelay: `${150 + (index * 60)}ms` }}
              >
                <div className={`flex items-center justify-between transition-colors duration-300 ${isSelected ? 'text-lime' : 'text-white/50'}`}>
                  <div className="flex items-center gap-2">
                    <span className="font-semibold text-lg">{opt}</span>
                    {tooltip && (
                      <div 
                        className="relative z-[200]"
                        onMouseEnter={() => setActiveTooltip(opt)}
                        onMouseLeave={() => setActiveTooltip(null)}
                      >
                        {/* Larger hit target for hover */}
                        <div className="w-8 h-8 -m-2 flex items-center justify-center cursor-help">
                          <div className={`w-4 h-4 rounded-full border flex items-center justify-center text-[10px] transition-colors ${activeTooltip === opt ? 'border-lime text-lime' : 'border-white/20'}`}>
                            ?
                          </div>
                        </div>
                        
                        {/* React Managed Tooltip Overlay */}
                        {activeTooltip === opt && (
                          <div className="absolute bottom-[calc(100%+12px)] left-1/2 -translate-x-1/2 w-64 p-4 bg-[#111] border border-lime/30 rounded-xl text-[11px] leading-relaxed text-white shadow-2xl animate-in fade-in slide-in-from-bottom-2 duration-200 pointer-events-none">
                            {tooltip}
                            <div className="absolute top-full left-1/2 -translate-x-1/2 w-3 h-3 bg-[#111] border-r border-b border-lime/30 rotate-45 -translate-y-1.5"></div>
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                  {isMulti ? (
                    <div className={`w-5 h-5 rounded-md border-2 transition-all duration-300 flex items-center justify-center ${
                      isSelected ? 'border-lime bg-lime' : 'border-white/10 group-hover:border-white/30'
                    }`}>
                      {isSelected && (
                        <svg className="w-4 h-4 text-black" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={4} d="M5 13l4 4L19 7" />
                        </svg>
                      )}
                    </div>
                  ) : (
                    <div className={`w-5 h-5 rounded-full border-2 transition-all duration-300 flex items-center justify-center ${
                      isSelected ? 'border-lime bg-lime' : 'border-white/10 group-hover:border-white/30'
                    }`}>
                      {isSelected && <div className="w-2 h-2 rounded-full bg-black"></div>}
                    </div>
                  )}
                </div>
                <div className={`absolute inset-0 bg-lime/[0.02] rounded-2xl transition-opacity duration-500 ${isSelected ? 'opacity-100' : 'opacity-0 group-hover:opacity-100'}`}></div>
              </button>
            </div>
          );
        })}
      </div>
    );
  };

  const renderContent = () => {
    switch (step) {
      case 1:
        return (
          <div className="space-y-10" key="step-1">
            <div className="animate-fade-in-up opacity-0 stagger-1">
              <div className="flex items-baseline gap-3 mb-6">
                <label className="text-xl font-bold">Where will you use the devices?</label>
                <span className="text-[10px] text-white/20 font-bold uppercase tracking-widest">Select all that apply</span>
              </div>
              {renderOptions('usage', OPTIONS.usage, true)}
            </div>
            <div className="animate-fade-in-up opacity-0 stagger-2">
              <label className="block text-xl font-bold mb-6">Do you charge admission fees?</label>
              <div className="flex gap-4">
                {['Yes', 'No'].map(o => (
                  <button 
                    key={o}
                    onClick={() => updateAnswers({ chargeAdmission: o as 'Yes' | 'No' })}
                    className={`flex-1 py-5 rounded-2xl border transition-all duration-300 font-bold hover:scale-[1.01] ${answers.chargeAdmission === o ? 'bg-lime text-black border-lime shadow-[0_10px_25px_rgba(200,223,82,0.15)]' : 'glass border-white/5 text-white/30 hover:border-white/20'}`}
                  >
                    {o}
                  </button>
                ))}
              </div>
            </div>
            {answers.chargeAdmission === 'Yes' && (
              <div className="animate-fade-in-up opacity-0 stagger-3 flex flex-col items-center">
                <label className="block text-xl font-bold mb-6 text-center">How much is the fee?</label>
                <div className="flex items-center gap-4 w-full max-w-md justify-center">
                  <button 
                    onClick={() => updateAnswers({ admissionFee: Math.max(0, (answers.admissionFee || 0) - 1) })}
                    className="w-16 h-16 rounded-2xl glass border border-white/10 flex items-center justify-center text-2xl hover:border-lime/50 hover:text-lime transition-all active:scale-95 shrink-0"
                  >
                    -
                  </button>
                  <div className="flex-1 flex gap-2">
                    <input 
                      type="number" 
                      placeholder="Amount"
                      value={answers.admissionFee || ''}
                      onChange={(e) => updateAnswers({ admissionFee: Number(e.target.value) })}
                      className="flex-1 min-w-0 bg-white/[0.02] border-2 border-white/5 rounded-2xl px-4 py-4 focus:border-lime/30 outline-none transition-all font-bold text-2xl text-center"
                    />
                    <select 
                      value={answers.currency}
                      onChange={(e) => updateAnswers({ currency: e.target.value })}
                      className="bg-white/[0.02] border-2 border-white/5 rounded-2xl px-4 py-4 focus:border-lime/30 outline-none transition-all font-bold appearance-none cursor-pointer"
                    >
                      {CURRENCIES.map(c => <option key={c} value={c} className="bg-[#111]">{c}</option>)}
                    </select>
                  </div>
                  <button 
                    onClick={() => updateAnswers({ admissionFee: (answers.admissionFee || 0) + 1 })}
                    className="w-16 h-16 rounded-2xl glass border border-white/10 flex items-center justify-center text-2xl hover:border-lime/50 hover:text-lime transition-all active:scale-95 shrink-0"
                  >
                    +
                  </button>
                </div>
              </div>
            )}
            <div className="animate-fade-in-up opacity-0 stagger-4">
              <label className="block text-xl font-bold mb-6">How many annual visitors do you have?</label>
              <div className="flex items-center gap-5">
                <button 
                  onClick={() => updateAnswers({ annualVisitors: Math.max(0, (answers.annualVisitors || 0) - 5000) })}
                  className="w-16 h-16 md:w-20 md:h-20 rounded-2xl glass border border-white/10 flex items-center justify-center text-2xl md:text-3xl hover:border-lime/50 hover:text-lime transition-all active:scale-95 shrink-0"
                >
                  -
                </button>
                <div className="flex-1 min-h-[140px] flex items-center justify-center bg-white/[0.02] border-2 border-white/5 rounded-3xl group focus-within:border-lime/30 transition-all relative">
                  <div className="flex flex-col items-center justify-center text-center">
                    <input 
                      type="text"
                      value={answers.annualVisitors ? formatNumber(answers.annualVisitors) : ''}
                      onChange={(e) => {
                        const val = e.target.value.replace(/,/g, '');
                        if (/^\d*$/.test(val)) {
                          updateAnswers({ annualVisitors: Number(val) });
                        }
                      }}
                      placeholder="0"
                      className="w-full text-center bg-transparent border-none text-4xl md:text-5xl font-bold focus:ring-0 outline-none leading-none mb-2"
                    />
                    <p className="text-[9px] text-white/10 uppercase tracking-[0.4em] font-bold pointer-events-none group-focus-within:text-lime/40 leading-none">Visitors</p>
                  </div>
                </div>
                <button 
                  onClick={() => updateAnswers({ annualVisitors: (answers.annualVisitors || 0) + 5000 })}
                  className="w-16 h-16 md:w-20 md:h-20 rounded-2xl glass border border-white/10 flex items-center justify-center text-2xl md:text-3xl hover:border-lime/50 hover:text-lime transition-all active:scale-95 shrink-0"
                >
                  +
                </button>
              </div>
            </div>
          </div>
        );
      case 2:
        return (
          <div className="animate-fade-in-up opacity-0" key="step-2">
            <div className="flex items-baseline gap-3 mb-8">
              <label className="text-2xl font-bold">What devices are you most interested in?</label>
            </div>
            {renderOptions('products', OPTIONS.products, true)}
          </div>
        );
      case 3:
        return (
          <div className="space-y-12 animate-fade-in-up opacity-0" key="step-3">
            <div>
              <div className="mb-8">
                <label className="text-2xl font-bold block mb-2">Configure Quantities</label>
                <p className="text-sm text-white/30 tracking-tight">Set expected units for each selection.</p>
              </div>
              <div className="space-y-4">
                {answers.products.map((product, idx) => (
                  <div key={product} className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-6 glass rounded-2xl border border-white/5 animate-fade-in-up opacity-0 hover-glow" style={{ animationDelay: `${200 + idx * 100}ms` }}>
                    <span className="font-bold text-lg text-white/60">{product}</span>
                    <div className="flex items-center gap-4">
                      <button 
                        onClick={() => {
                          const count = Math.max(0, (answers.deviceCounts[product] || 0) - 10);
                          updateAnswers({ deviceCounts: { ...answers.deviceCounts, [product]: count } });
                        }}
                        className="w-12 h-12 rounded-xl glass border border-white/10 flex items-center justify-center hover:border-lime/50 transition-all active:scale-95"
                      >
                        -
                      </button>
                      <input 
                        type="number"
                        value={answers.deviceCounts[product] || ''}
                        onChange={(e) => {
                          const val = Number(e.target.value);
                          updateAnswers({ deviceCounts: { ...answers.deviceCounts, [product]: val } });
                        }}
                        className="w-24 text-center bg-white/[0.02] border-2 border-white/5 rounded-xl py-3 font-bold text-xl focus:border-lime/30 outline-none"
                      />
                      <button 
                        onClick={() => {
                          const count = (answers.deviceCounts[product] || 0) + 10;
                          updateAnswers({ deviceCounts: { ...answers.deviceCounts, [product]: count } });
                        }}
                        className="w-12 h-12 rounded-xl glass border border-white/10 flex items-center justify-center hover:border-lime/50 transition-all active:scale-95"
                      >
                        +
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="pt-10 border-t border-white/5 animate-fade-in-up opacity-0 stagger-3">
              <div className="mb-8">
                <label className="text-2xl font-bold block mb-3 leading-snug">
                  Dashboard Intelligence Access
                </label>
                <p className="text-sm text-white/30 max-w-lg">Manage, view, and report audio guide analytics</p>
              </div>
              <div className="flex items-center justify-center gap-6">
                <button 
                  onClick={() => updateAnswers({ dashboardUsers: Math.max(1, (answers.dashboardUsers || 1) - 1) })}
                  className="w-16 h-16 rounded-2xl glass border border-white/10 flex items-center justify-center text-2xl hover:border-lime/50 transition-all active:scale-95"
                >
                  -
                </button>
                <div className="flex-1 max-w-[240px] min-h-[140px] flex items-center justify-center bg-white/[0.02] border-2 border-white/5 rounded-3xl group focus-within:border-lime/30 transition-all relative">
                  <div className="flex flex-col items-center justify-center text-center">
                    <input 
                      type="number"
                      value={answers.dashboardUsers || ''}
                      onChange={(e) => updateAnswers({ dashboardUsers: Number(e.target.value) })}
                      placeholder="1"
                      className="w-full text-center bg-transparent border-none text-5xl font-bold focus:ring-0 outline-none leading-none mb-2"
                    />
                    <p className="text-[9px] text-white/10 uppercase tracking-[0.4em] font-bold pointer-events-none group-focus-within:text-lime/40 leading-none">Users</p>
                  </div>
                </div>
                <button 
                  onClick={() => updateAnswers({ dashboardUsers: (answers.dashboardUsers || 1) + 1 })}
                  className="w-16 h-16 rounded-2xl glass border border-white/10 flex items-center justify-center text-2xl hover:border-lime/50 transition-all active:scale-95"
                >
                  +
                </button>
              </div>
            </div>
          </div>
        );
      case 4:
        return (
          <div className="animate-fade-in-up opacity-0" key="step-4">
             <div className="flex items-baseline gap-3 mb-8">
                <label className="text-2xl font-bold">Choose Languages</label>
                <span className="text-[10px] text-white/20 font-bold uppercase tracking-widest">Select all that apply</span>
              </div>
            <div className="flex flex-wrap gap-3">
              {OPTIONS.languages.map((l, idx) => {
                const selected = answers.languages.includes(l);
                return (
                  <button
                    key={l}
                    onClick={() => toggleMultiSelect('languages', l)}
                    className={`px-8 py-4 rounded-2xl border transition-all duration-300 font-bold text-sm animate-fade-in-up opacity-0 hover:scale-[1.03] ${selected ? 'bg-lime text-black border-lime shadow-[0_5px_15px_rgba(200,223,82,0.15)]' : 'glass border-white/5 text-white/40 hover:border-white/20'}`}
                    style={{ animationDelay: `${100 + idx * 40}ms` }}
                  >
                    {l}
                  </button>
                );
              })}
            </div>
          </div>
        );
      case 5:
        return (
          <div className="space-y-12" key="step-5">
            <div className="animate-fade-in-up opacity-0 stagger-1">
              <label className="block text-2xl font-bold mb-8">Points of Interest to be covered?</label>
              {renderOptions('pointsOfInterest', OPTIONS.points)}
            </div>
            <div className="animate-fade-in-up opacity-0 stagger-3">
              <label className="block text-2xl font-bold mb-8">Update frequency of content?</label>
              {renderOptions('updateFrequency', OPTIONS.updates)}
            </div>
          </div>
        );
      case 6:
        const isOwnGallery = answers.usage.includes('Own gallery');
        const isExhibitions = answers.usage.includes('Exhibitions/fairs');
        
        let wifiQuestion = "Do you have stable Wi-Fi coverage?";
        let powerQuestion = "Do you have a constant power supply?";

        if (isOwnGallery && !isExhibitions) {
          wifiQuestion = "Do you have stable Wi-Fi coverage in your gallery?";
          powerQuestion = "Do you have a constant power supply near the front desk?";
        } else if (isExhibitions && !isOwnGallery) {
          wifiQuestion = "Do the locations of the exhibitions/fairs you participate in usually have Wi-Fi coverage?";
          powerQuestion = "Do your exhibition booths typically have a constant power supply?";
        } else if (isOwnGallery && isExhibitions) {
          wifiQuestion = "Do your gallery and exhibition spaces have stable Wi-Fi coverage?";
          powerQuestion = "Do you have reliable power at your gallery desk and exhibition booths?";
        }

        return (
          <div className="space-y-12 animate-fade-in-up opacity-0" key="step-6">
            <div className="animate-fade-in-up opacity-0 stagger-1">
              <label className="block text-2xl font-bold mb-8 text-center">{wifiQuestion}</label>
              <div className="grid grid-cols-2 gap-4 max-w-sm mx-auto">
                {['Yes', 'No'].map((o, idx) => (
                    <button 
                      key={o}
                      onClick={() => updateAnswers({ wifiStable: o as 'Yes' | 'No' })}
                      className={`py-5 rounded-2xl border transition-all duration-300 font-bold text-xl ${answers.wifiStable === o ? 'bg-lime text-black border-lime shadow-[0_10px_25px_rgba(200,223,82,0.15)]' : 'glass border-white/5 text-white/20 hover:border-white/10'}`}
                    >
                      {o}
                    </button>
                  ))}
              </div>
            </div>

            <div className="animate-fade-in-up opacity-0 stagger-2 pt-8 border-t border-white/5">
              <label className="block text-2xl font-bold mb-8 text-center">{powerQuestion}</label>
              <div className="grid grid-cols-2 gap-4 max-w-sm mx-auto">
                {['Yes', 'No'].map((o, idx) => (
                    <button 
                      key={o}
                      onClick={() => updateAnswers({ powerStable: o as 'Yes' | 'No' })}
                      className={`py-5 rounded-2xl border transition-all duration-300 font-bold text-xl ${answers.powerStable === o ? 'bg-lime text-black border-lime shadow-[0_10px_25px_rgba(200,223,82,0.15)]' : 'glass border-white/5 text-white/20 hover:border-white/10'}`}
                    >
                      {o}
                    </button>
                  ))}
              </div>
            </div>
          </div>
        );
      case 7:
        return (
          <div className="space-y-12" key="step-7">
            <div className="animate-fade-in-up opacity-0 stagger-1">
              <label className="block text-2xl font-bold mb-2">Primary Objective?</label>
              <p className="text-[10px] text-white/20 mb-8 font-bold uppercase tracking-widest">Select 1-3 Goals</p>
              {renderOptions('objectives', OPTIONS.objectives, true, 3)}
            </div>
            <div className="animate-fade-in-up opacity-0 stagger-3">
              <label className="block text-2xl font-bold mb-8">Preferred Commercial Structure</label>
              {renderOptions('commercialStructure', OPTIONS.commercials)}
            </div>
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div className="glass rounded-[2.5rem] p-10 md:p-14 border border-white/5 shadow-2xl relative max-w-3xl mx-auto backdrop-blur-3xl">
      <div className="relative z-10 min-h-[550px] flex flex-col justify-between">
        <div className="mb-12" key={step}>
           {renderContent()}
        </div>

        <div className="flex items-center justify-between pt-10 border-t border-white/5">
          <button 
            disabled={step === 1}
            onClick={onBack}
            className="px-10 py-5 rounded-2xl font-bold text-white/20 hover:text-white hover:bg-white/5 transition-all duration-300 disabled:opacity-0 disabled:pointer-events-none active:scale-95"
          >
            &larr; Previous
          </button>
          
          <button 
            disabled={!isValid}
            onClick={onNext}
            className={`px-14 py-5 rounded-2xl font-extrabold transition-all duration-300 transform ${isValid ? 'bg-lime text-black shadow-[0_10px_25px_rgba(200,223,82,0.15)] hover:scale-[1.03] active:scale-95 hover:shadow-[0_15px_40px_rgba(200,223,82,0.3)]' : 'bg-white/5 text-white/10 cursor-not-allowed'}`}
          >
            {step === 7 ? 'Generate Results' : 'Continue'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default QuizStep;
