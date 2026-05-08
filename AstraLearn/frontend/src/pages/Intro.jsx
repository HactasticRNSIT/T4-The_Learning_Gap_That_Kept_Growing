import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { Brain, ShieldCheck, Zap, ArrowRight } from 'lucide-react';

const Intro = () => {
  const navigate = useNavigate();
  const [bootSequence, setBootSequence] = useState(0);
  const [isLoaded, setIsLoaded] = useState(false);

  const logs = [
    "Initializing Neural Core...",
    "Syncing Student Databases...",
    "Calibrating Predictive Models...",
    "Secure Link Established."
  ];

  useEffect(() => {
    if (bootSequence < logs.length) {
      const timer = setTimeout(() => setBootSequence(prev => prev + 1), 600);
      return () => clearTimeout(timer);
    } else {
      setIsLoaded(true);
    }
  }, [bootSequence]);

  return (
    <div className="relative flex min-h-screen flex-col items-center justify-center overflow-hidden bg-[#020617] text-white font-sans">
      
      {/* BACKGROUND LAYER */}
      <div className="absolute inset-0 z-0 opacity-20">
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#1e293b_1px,transparent_1px),linear-gradient(to_bottom,#1e293b_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)]" />
      </div>
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-primary/5 rounded-full blur-[140px] pointer-events-none" />

      <div className="relative z-10 w-full max-w-3xl px-6 text-center">
        
        {/* LOGO ANIMATION */}
        <motion.div
          initial={{ scale: 0.5, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 1, ease: [0.22, 1, 0.36, 1] }}
          className="mb-10 flex justify-center"
        >
          <div className="relative">
            <motion.div 
              animate={{ rotate: 360 }}
              transition={{ duration: 12, repeat: Infinity, ease: "linear" }}
              className="absolute -inset-6 rounded-full border border-dashed border-primary/30" 
            />
            <motion.div 
              animate={{ scale: [1, 1.05, 1] }}
              transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
              className="flex h-28 w-28 items-center justify-center rounded-[2rem] bg-primary text-black shadow-[0_0_60px_rgba(var(--primary-rgb),0.5)]"
            >
              <Brain size={54} strokeWidth={2.5} />
            </motion.div>
          </div>
        </motion.div>

        {/* TITLE SECTION */}
        <div className="relative flex flex-col items-center">
          <motion.h1 className="flex overflow-hidden text-7xl font-[1000] tracking-tighter md:text-9xl">
            {"ASTRALEARN".split("").map((letter, index) => (
              <motion.span
                key={index}
                initial={{ y: "110%", opacity: 0, filter: "blur(10px)" }}
                animate={{ y: 0, opacity: 1, filter: "blur(0px)" }}
                transition={{
                  duration: 0.8,
                  delay: 0.3 + index * 0.08,
                  ease: [0.215, 0.61, 0.355, 1],
                }}
                className={index > 4 ? "text-primary" : "text-white"}
              >
                {letter}
              </motion.span>
            ))}
          </motion.h1>

          <motion.div
            initial={{ width: 0, opacity: 0 }}
            animate={{ width: "100%", opacity: [0, 1, 0] }}
            transition={{ delay: 1.5, duration: 0.6, ease: "easeInOut" }}
            className="absolute bottom-2 h-[3px] bg-primary shadow-[0_0_20px_#primary]"
          />

          <motion.p
            initial={{ opacity: 0, letterSpacing: "0.2em" }}
            animate={{ opacity: 1, letterSpacing: "0.5em" }}
            transition={{ delay: 2, duration: 1.5 }}
            className="mt-6 text-[10px] font-black text-slate-500 uppercase md:text-xs"
          >
            Neural Architecture v3.0 // Predictive Learning Core
          </motion.p>
        </div>

        {/* TERMINAL BOOT SEQUENCE */}
        <div className="mt-12 min-h-[90px] font-mono text-sm tracking-[0.15em] text-slate-500">
          <AnimatePresence mode="popLayout">
            {logs.slice(0, bootSequence + 1).map((log, i) => (
              <motion.p
                key={i}
                initial={{ opacity: 0, x: -15 }}
                animate={{ opacity: 1, x: 0 }}
                className={i === bootSequence ? "text-primary font-bold" : "text-slate-700"}
              >
                <span className="opacity-50">{i === bootSequence ? ">" : "✓"}</span> {log}
              </motion.p>
            ))}
          </AnimatePresence>
        </div>

        {/* ENTRANCE BUTTON - Directed to /home */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: isLoaded ? 1 : 0, y: isLoaded ? 0 : 30 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="mt-16"
        >
          <button
            onClick={() => navigate('/home')}
            className="group relative inline-flex items-center gap-6 rounded-full bg-white px-12 py-6 text-xl font-[1000] text-black transition-all hover:bg-primary hover:scale-105 active:scale-95 shadow-[0_0_30px_rgba(255,255,255,0.1)]"
          >
            LAUNCH INTERFACE
            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-black/5 group-hover:bg-black/10">
              <ArrowRight size={24} className="transition-transform group-hover:translate-x-1" />
            </div>
            <div className="absolute -inset-1 -z-10 animate-pulse rounded-full bg-primary/20 blur-xl group-hover:bg-primary/40" />
          </button>
        </motion.div>

        {/* FOOTER METADATA */}
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: isLoaded ? 1 : 0 }}
          className="mt-24 flex justify-center gap-16 border-t border-white/5 pt-10"
        >
          {[
            { icon: ShieldCheck, label: "ENCRYPTED" },
            { icon: Zap, label: "LOW LATENCY" }
          ].map((item, i) => (
            <div key={i} className="flex flex-col items-center gap-3">
              <item.icon size={20} className="text-primary/50" />
              <span className="text-[9px] font-black tracking-[0.3em] text-slate-600 uppercase italic">
                {item.label}
              </span>
            </div>
          ))}
        </motion.div>
      </div>
    </div>
  );
};

export default Intro;