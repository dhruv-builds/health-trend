import { useState, useEffect } from 'react';

interface ProcessingModalProps {
  fileName: string;
}

const healthFacts = [
  "Vitamin D levels often drop during winter months due to reduced sun exposure.",
  "Not all cholesterol is 'bad' — HDL cholesterol actually helps remove harmful LDL from your bloodstream.",
  "Your hemoglobin A1c reflects your average blood sugar over the past 2-3 months.",
  "Iron absorption increases when paired with vitamin C-rich foods.",
  "Thyroid hormones affect nearly every organ in your body, including your heart, brain, and metabolism.",
  "Creatinine levels can temporarily rise after intense exercise.",
];

export const ProcessingModal = ({ fileName }: ProcessingModalProps) => {
  const [currentFactIndex, setCurrentFactIndex] = useState(0);
  const [isFactVisible, setIsFactVisible] = useState(true);

  useEffect(() => {
    const interval = setInterval(() => {
      // Fade out
      setIsFactVisible(false);
      
      // Wait for fade-out to fully complete before changing content
      setTimeout(() => {
        setCurrentFactIndex((prev) => (prev + 1) % healthFacts.length);
        // Small delay before fade-in to prevent overlap
        requestAnimationFrame(() => {
          setIsFactVisible(true);
        });
      }, 500); // Match the CSS transition duration exactly
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-center justify-center">
      <div className="bg-card rounded-2xl p-6 sm:p-8 max-w-md w-full mx-4 shadow-2xl border border-border">
        {/* Pulsing title */}
        <h2 className="text-xl font-bold text-center text-foreground animate-pulse-slow">
          Analyzing your health data...
        </h2>

        {/* Rotating facts - absolute positioning prevents layout shifts */}
        <div className="mt-6 text-center min-h-[6rem] relative overflow-hidden flex items-start justify-center">
          <p 
            key={currentFactIndex}
            className={`absolute inset-x-0 top-0 text-sm text-muted-foreground px-2
              transition-all duration-500 ease-out will-change-[opacity,transform]
              ${isFactVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-2'}`}
          >
            <span className="font-medium">Did you know?</span> {healthFacts[currentFactIndex]}
          </p>
        </div>

        {/* Footer */}
        <p className="mt-6 text-xs text-muted-foreground/70 text-center">
          Extracting markers from {fileName}...
        </p>
      </div>
    </div>
  );
};
