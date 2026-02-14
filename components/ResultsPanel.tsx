
import React, { useEffect, useState } from 'react';
import { QuizAnswers } from '../types';

interface ResultsPanelProps {
  answers: QuizAnswers;
  onReset: () => void;
}

const ExpandIcon = () => (
  <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
    <path d="M15 3h6v6M9 21H3v-6M21 3l-7 7M3 21l7-7" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
);

const CloseIcon = () => (
  <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
    <path d="M18 6L6 18M6 6l12 12" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
);

const ResultsPanel: React.FC<ResultsPanelProps> = ({ answers, onReset }) => {
  const [isVisible, setIsVisible] = useState(false);
  const [expandedCard, setExpandedCard] = useState<string | null>(null);

  useEffect(() => {
    setIsVisible(true);
  }, []);

  const getRecommendation = () => {
    let recs = [];
    let why = [];

    if (answers.wifiStable === 'No' || answers.powerStable === 'No') {
      recs.push("Edge-Optimized NFC Guide");
      why.push("Given the potential technical constraints, our low-power, edge-first NFC solution ensures visitor service stays active even without consistent connectivity.");
    } else {
      recs.push("Cloud-Sync AI Handsets");
      why.push("Your stable infrastructure allows for a seamless, real-time AI experience using our high-performance connected handsets.");
    }

    if (answers.languages.length >= 3 || answers.objectives.includes('Improve accessibility')) {
      recs.push("Multilingual AI Core Service");
      why.push("Our AI engine will automatically serve native content to your international visitors in " + answers.languages.length + " languages.");
    }

    if (parseInt(answers.pointsOfInterest) >= 20 || answers.updateFrequency.includes('Monthly')) {
      recs.push("Dynamic CMS Dashboard");
      why.push("Your high POI volume necessitates our centralized cloud management platform for rapid updates.");
    }

    return { 
      items: Array.from(new Set(recs)), 
      summary: why.slice(0, 3).join(" ") 
    };
  };

  const getQuoteLink = () => {
    const subject = encodeURIComponent("Quotation Request - Tree'd History Guide");
    const profile = [
      "GALLERY PROFILE SUMMARY:",
      "-------------------------",
      `Usage Locations: ${answers.usage.join(', ')}`,
      `Admission: ${answers.chargeAdmission}${answers.chargeAdmission === 'Yes' ? ` (${answers.admissionFee} ${answers.currency})` : ''}`,
      `Annual Visitors: ${answers.annualVisitors.toLocaleString()}`,
      `Total Devices: ${Object.values(answers.deviceCounts).reduce((a, b) => a + b, 0)}`,
      "-------------------------",
      "",
      "Please provide a formal quotation.",
    ].join('\n');
    
    return `mailto:mo@treed.co?subject=${subject}&body=${encodeURIComponent(profile)}`;
  };

  const recData = getRecommendation();
  const totalDevices = Object.values(answers.deviceCounts).reduce((a: number, b: number) => a + b, 0);

  const toggleExpand = (id: string) => {
    if (expandedCard === id) setExpandedCard(null);
    else setExpandedCard(id);
  };

  return (
    <div className={`transition-all duration-1000 transform ${isVisible ? 'translate-y-0 opacity-100' : 'translate-y-20 opacity-0'}`}>
      <div className="text-center mb-16">
        <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6 tracking-tight leading-tight">Your Recommended <br /><span className="text-lime">Gallery Roadmap</span></h2>
        <p className="text-white/30 max-w-xl mx-auto font-light leading-relaxed">Based on your specific gallery context and visitor objectives, we have generated the following high-performance configuration.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8 auto-rows-min">
        {/* Recommendation Card */}
        <div 
          className={`transition-all duration-500 ease-in-out relative group ${
            expandedCard === 'recs' ? 'md:col-span-3 z-20' : expandedCard ? 'hidden' : 'md:col-span-2'
          }`}
        >
          <div className={`glass rounded-[2.5rem] p-10 md:p-14 border border-lime/10 bg-lime/[0.03] relative overflow-hidden h-full`}>
            <button 
              onClick={() => toggleExpand('recs')}
              className="absolute top-6 right-6 w-10 h-10 flex items-center justify-center rounded-xl glass border border-white/5 md:opacity-0 md:group-hover:opacity-100 transition-all duration-300 hover:border-lime/40 text-white/30 hover:text-lime z-10"
            >
              {expandedCard === 'recs' ? <CloseIcon /> : <ExpandIcon />}
            </button>
            
            <div className="relative z-10">
              <span className="inline-block px-4 py-1.5 rounded-full bg-lime text-black font-bold text-[9px] uppercase tracking-[0.2em] mb-8">Recommended</span>
              <div className="space-y-8 mb-12">
                {recData.items.map((item, i) => (
                  <div key={i} className="flex items-start gap-5">
                    <div className="mt-1.5 w-6 h-6 rounded-full bg-lime flex items-center justify-center shrink-0 shadow-[0_0_15px_rgba(200,223,82,0.4)]">
                      <svg className="w-3.5 h-3.5 text-black" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={4} d="M5 13l4 4L19 7" />
                      </svg>
                    </div>
                    <h4 className={`${expandedCard === 'recs' ? 'text-4xl md:text-5xl' : 'text-3xl md:text-4xl'} font-bold leading-tight tracking-tight`}>{item}</h4>
                  </div>
                ))}
              </div>

              <div className={`p-8 bg-black/40 rounded-3xl border border-white/5 mb-12 ${expandedCard === 'recs' ? 'max-w-4xl' : ''}`}>
                <h5 className="text-[10px] font-bold text-lime uppercase tracking-widest mb-4">Strategic Reasoning</h5>
                <p className={`text-white/50 leading-relaxed font-light italic ${expandedCard === 'recs' ? 'text-xl md:text-2xl' : 'text-lg'}`}>
                  "{recData.summary}"
                </p>
              </div>

              <div className={`flex flex-col sm:flex-row gap-5 ${expandedCard === 'recs' ? 'max-w-xl' : ''}`}>
                <a 
                  href={getQuoteLink()}
                  className="flex-1 bg-white text-black font-bold py-5 rounded-2xl hover:bg-lime transition-all transform hover:-translate-y-1 shadow-2xl flex items-center justify-center text-center no-underline text-lg"
                >
                  Request Quotation
                </a>
                <a 
                  href="https://treed.co/booking"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex-1 glass border border-white/10 hover:border-white/30 font-bold py-5 rounded-2xl transition-all flex items-center justify-center text-center text-lg"
                >
                  Strategy Call
                </a>
              </div>
            </div>
          </div>
        </div>

        {/* Summary Card */}
        <div 
          className={`transition-all duration-500 ease-in-out relative group ${
            expandedCard === 'summary' ? 'md:col-span-3 z-20' : expandedCard ? 'hidden' : 'md:col-span-1'
          }`}
        >
          <div className={`glass rounded-[2rem] p-8 border border-white/5 h-full flex flex-col justify-between transition-all`}>
            <button 
              onClick={() => toggleExpand('summary')}
              className="absolute top-6 right-6 w-10 h-10 flex items-center justify-center rounded-xl glass border border-white/5 md:opacity-0 md:group-hover:opacity-100 transition-all duration-300 hover:border-lime/40 text-white/30 hover:text-lime z-10"
            >
              {expandedCard === 'summary' ? <CloseIcon /> : <ExpandIcon />}
            </button>
            
            <div className="w-full">
              <h3 className="text-xs font-bold mb-8 text-white/30 tracking-[0.3em] uppercase">Metrics Summary</h3>
              <ul className={`space-y-4 mb-10 ${expandedCard === 'summary' ? 'grid grid-cols-1 md:grid-cols-2 gap-x-12' : ''}`}>
                {[
                  { label: 'Units Needed', value: totalDevices.toLocaleString(), accent: true },
                  { label: 'Admission Fee', value: answers.chargeAdmission === 'Yes' ? `${answers.admissionFee} ${answers.currency}` : 'No Fee' },
                  { label: 'Footfall', value: answers.annualVisitors.toLocaleString() },
                  { label: 'Admins', value: `${answers.dashboardUsers}`, accent: true },
                  { 
                    label: 'Wi-Fi Coverage', 
                    value: answers.wifiStable === 'Yes' ? 'Available' : 'Weak', 
                    customColor: answers.wifiStable === 'Yes' ? 'text-lime' : 'text-red-500' 
                  },
                  { 
                    label: 'Power Supply', 
                    value: answers.powerStable === 'Yes' ? 'Stable' : 'Unreliable', 
                    customColor: answers.powerStable === 'Yes' ? 'text-lime' : 'text-red-500' 
                  }
                ].map((item, i) => (
                  <li key={i} className={`flex justify-between items-center py-2.5 border-b border-white/5 ${expandedCard === 'summary' ? 'md:py-5' : ''}`}>
                    <span className={`text-white/40 ${expandedCard === 'summary' ? 'text-lg' : 'text-[13px]'}`}>{item.label}</span>
                    <span className={`font-bold ${expandedCard === 'summary' ? 'text-lg' : 'text-[13px]'} ${(item as any).customColor ? (item as any).customColor : item.accent ? 'text-lime' : ''}`}>
                      {item.value}
                    </span>
                  </li>
                ))}
              </ul>
            </div>
            
            <button 
              onClick={onReset}
              className="w-full py-4 text-white/30 hover:text-white font-bold text-xs tracking-widest uppercase transition-all border border-white/5 rounded-2xl hover:bg-white/5 mt-auto"
            >
              Retake Questionnaire
            </button>
          </div>
        </div>

        {/* Profile Details Card */}
        <div 
          className={`transition-all duration-500 ease-in-out relative group ${
            expandedCard === 'profile' ? 'md:col-span-3 z-20' : expandedCard ? 'hidden' : 'md:col-span-3'
          }`}
        >
          <div className={`glass rounded-[2.5rem] p-10 md:p-14 border border-white/5 transition-all h-full`}>
            <button 
              onClick={() => toggleExpand('profile')}
              className="absolute top-8 right-8 w-10 h-10 flex items-center justify-center rounded-xl glass border border-white/5 md:opacity-0 md:group-hover:opacity-100 transition-all duration-300 hover:border-lime/40 text-white/30 hover:text-lime z-10"
            >
              {expandedCard === 'profile' ? <CloseIcon /> : <ExpandIcon />}
            </button>
            
            <h3 className="text-xl font-bold mb-10 flex items-center gap-4">
              <div className="w-1.5 h-7 bg-lime rounded-full shadow-[0_0_15px_#c8df52]"></div>
              Deep Analysis Data
            </h3>
            <div className={`grid grid-cols-1 md:grid-cols-2 gap-x-20 gap-y-12 ${expandedCard === 'profile' ? 'lg:grid-cols-4' : 'lg:grid-cols-2'}`}>
              <DetailItem label="Implementation Site" value={answers.usage.join(', ')} />
              <DetailItem label="Inventory Mapping" value={answers.products.map(p => `${p} (${answers.deviceCounts[p] || 0})`).join(', ')} />
              <DetailItem label="Intelligence Permissions" value={`${answers.dashboardUsers} Users`} />
              <DetailItem label="Language Matrix" value={answers.languages.join(', ')} />
              <DetailItem label="Curation Depth" value={`${answers.pointsOfInterest} POIs`} />
              <DetailItem label="Refresh Rate" value={answers.updateFrequency} />
              <DetailItem label="Commercial Intent" value={answers.commercialStructure} />
              <DetailItem label="Strategic KPIs" value={answers.objectives.join(' • ')} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const DetailItem = ({ label, value }: { label: string, value: string }) => (
  <div className="space-y-2">
    <p className="text-[9px] uppercase tracking-[0.4em] font-bold text-white/20 leading-none">{label}</p>
    <p className="text-xl font-medium text-white/80 tracking-tight leading-snug">{value}</p>
  </div>
);

export default ResultsPanel;
