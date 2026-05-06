import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import confetti from 'canvas-confetti';
import { Heart, Flower2, Music, Sparkles } from 'lucide-react';

// --- Components ---

const LoadingScreen = ({ onComplete }: { onComplete: () => void }) => {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval);
          setTimeout(onComplete, 800);
          return 100;
        }
        return prev + 1;
      });
    }, 30);
    return () => clearInterval(interval);
  }, [onComplete]);

  return (
    <motion.div
      initial={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-[9999] flex flex-col items-center justify-center bg-[#FFFDF5] w-screen h-screen"
    >
      <div className="flex flex-col items-center max-w-xs w-full px-6 text-center">
        <div className="w-48 h-48 md:w-64 md:h-64 mb-6">
          <img 
            src="https://media.tenor.com/7S872pXl_N0AAAAi/milk-and-mocha-bear.gif" 
            alt="Loading GIF" 
            className="w-full h-full object-contain"
          />
        </div>
        <div className="text-2xl md:text-3xl font-handwritten text-[#DCAE96] mb-6 leading-relaxed">
          Assembling 365 days <br /> of memories...
        </div>
        <div className="w-full h-2 bg-gray-100 rounded-full overflow-hidden relative border border-gray-100 shadow-inner">
          <motion.div 
            className="h-full bg-gradient-to-r from-[#83C5BE] to-[#E29578]"
            initial={{ width: 0 }}
            animate={{ width: `${progress}%` }}
          />
        </div>
        <div className="mt-4 flex items-center gap-2">
           <Heart size={16} className={`${progress === 100 ? 'text-red-500 fill-red-500' : 'text-gray-300'} transition-colors`} />
           <span className="text-[#E29578] font-bold font-quicksand">{progress}%</span>
        </div>
      </div>
    </motion.div>
  );
};

const Countdown = ({ targetDate, onComplete }: { targetDate: Date, onComplete?: () => void }) => {
  const [timeLeft, setTimeLeft] = useState({ days: 0, hours: 0, minutes: 0, seconds: 0, isOver: false });

  useEffect(() => {
    const timer = setInterval(() => {
      const now = new Date();
      const diff = targetDate.getTime() - now.getTime();
      if (diff <= 0) {
        setTimeLeft(prev => ({ ...prev, isOver: true }));
        clearInterval(timer);
        if (onComplete) onComplete();
        return;
      }
      setTimeLeft({
        days: Math.floor(diff / (1000 * 60 * 60 * 24)),
        hours: Math.floor((diff / (1000 * 60 * 60)) % 24),
        minutes: Math.floor((diff / 1000 / 60) % 60),
        seconds: Math.floor((diff / 1000) % 60),
        isOver: false
      });
    }, 1000);
    return () => clearInterval(timer);
  }, [targetDate, onComplete]);

  return (
    <div className="flex flex-wrap justify-center gap-4 md:gap-8 text-[#E29578]">
      {[
        { label: 'Days', value: timeLeft.days },
        { label: 'Hours', value: timeLeft.hours },
        { label: 'Minutes', value: timeLeft.minutes },
        { label: 'Seconds', value: timeLeft.seconds },
      ].map((item) => (
        <div key={item.label} className="flex flex-col items-center bg-white/40 backdrop-blur-sm p-4 md:p-6 rounded-2xl min-w-[80px] md:min-w-[120px] shadow-sm">
          <motion.span key={item.value} className="text-3xl md:text-6xl font-bold font-pacifico">{item.value}</motion.span>
          <span className="text-[10px] md:text-sm uppercase tracking-widest font-bold text-[#83C5BE] mt-1">{item.label}</span>
        </div>
      ))}
    </div>
  );
};

const LoveGarden = () => {
  const [activeNote, setActiveNote] = useState<string | null>(null);
  const [showMusic, setShowMusic] = useState(false);
  const flowers = [
    { id: 1, note: "I love the way you laugh at my silly jokes.", color: "#E29578" },
    { id: 2, note: "You make every day feel like a dream.", color: "#83C5BE" },
    { id: 3, note: "Thank you for being my best friend.", color: "#D4A373" },
    { id: 4, note: "I'm so lucky to have you by my side.", color: "#FFB4A2" },
    { id: 5, note: "You are my favorite person in the world.", color: "#B5838D", isGolden: true },
    { id: 6, note: "I can't wait for many more years with you.", color: "#E5989B" },
  ];

  return (
    <div className="relative py-20 bg-[#FFFDF5] text-center px-4 overflow-hidden">
      <h2 className="text-4xl md:text-6xl font-handwritten text-[#DCAE96] mb-12">Love Garden</h2>
      <div className="flex flex-wrap justify-center gap-8 md:gap-12">
        {flowers.map((flower) => (
          <motion.div
            key={flower.id}
            whileHover={{ scale: 1.2 }}
            onClick={() => { setActiveNote(flower.note); if (flower.isGolden) setShowMusic(true); }}
            className="cursor-pointer relative"
          >
            <div className={`w-16 h-16 md:w-20 md:h-20 flex items-center justify-center rounded-full ${flower.isGolden ? 'bg-yellow-100 shadow-lg' : 'bg-white shadow-md'}`}>
              <Flower2 style={{ color: flower.isGolden ? '#F59E0B' : flower.color }} size={40} />
            </div>
          </motion.div>
        ))}
      </div>
      <AnimatePresence>
        {activeNote && (
          <motion.div initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0 }} className="mt-12 p-6 bg-white rounded-3xl shadow-xl max-w-sm mx-auto border-2 border-[#83C5BE] relative">
            <button onClick={() => setActiveNote(null)} className="absolute top-2 right-2 text-gray-400">✕</button>
            <p className="text-xl font-handwritten text-[#E29578]">{activeNote}</p>
            {showMusic && activeNote.includes("favorite person") && <div className="mt-4 text-[#83C5BE] animate-pulse flex items-center justify-center gap-2"><Music size={16} /><span>Playing Our Song...</span></div>}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

const PolaroidTimeline = () => {
  const moments = [
    { title: "Where it started", date: "Day 1", img: "https://images.unsplash.com/photo-1517048676732-d65bc937f952?q=80&w=2070&auto=format&fit=crop", note: "Our first coffee date." },
    { title: "First Trip", date: "Day 45", img: "https://images.unsplash.com/photo-1511632765486-a01980e01a18?q=80&w=2070&auto=format&fit=crop", note: "Adventure awaits!" },
    { title: "Lazy Sundays", date: "Day 120", img: "https://images.unsplash.com/photo-1527631746610-bca00a040d60?q=80&w=1974&auto=format&fit=crop", note: "Simply being with you." },
    { title: "True Love", date: "Day 200", img: "https://images.unsplash.com/photo-1518199266791-5375a83190b7?q=80&w=2070&auto=format&fit=crop", note: "The best is yet to come." },
    { title: "One Year!", date: "Day 365", img: "https://images.unsplash.com/photo-1531747118685-ca8fa6e08806?q=80&w=2018&auto=format&fit=crop", note: "I love you forever." }
  ];

  return (
    <div className="py-20 bg-[#FFFDF5] overflow-hidden">
      <div className="px-6 mb-8 text-center">
        <h2 className="text-4xl md:text-8xl font-handwritten text-[#DCAE96] mb-2 text-shadow">Our Memories</h2>
        <p className="text-[#83C5BE] font-bold tracking-widest uppercase text-xs">← Swipe to see →</p>
      </div>
      <div className="flex overflow-x-auto gap-4 px-6 pb-12 snap-x snap-mandatory scroll-smooth no-scrollbar touch-pan-x">
        {moments.map((moment, idx) => (
          <div key={idx} className="flex-shrink-0 w-[85vw] md:w-96 snap-center">
            <div className="bg-white p-3 pb-12 shadow-2xl border border-gray-100 rounded-sm transform transition-transform" style={{ rotate: `${idx % 2 === 0 ? -1 : 1}deg` }}>
              <div className="relative aspect-[4/5] overflow-hidden rounded-sm bg-gray-50">
                <img src={moment.img} alt={moment.title} className="w-full h-full object-cover" />
                <div className="absolute top-2 right-2 opacity-60"><img src="https://media.tenor.com/0i_p7H2uWf0AAAAi/sparkles.gif" className="w-8 h-8" alt="Sparkle" /></div>
              </div>
              <div className="mt-4 px-1 text-left">
                <h3 className="text-2xl font-handwritten text-[#E29578] mb-1">{moment.title}</h3>
                <p className="text-[10px] text-[#83C5BE] font-bold uppercase tracking-widest mb-2">{moment.date}</p>
                <p className="text-base font-handwritten text-gray-600 italic">"{moment.note}"</p>
              </div>
              <div className="absolute bottom-3 right-3 opacity-20"><Heart size={16} /></div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

const EmergencyHug = () => {
  const [showHug, setShowHug] = useState(false);
  const handleHug = () => { setShowHug(true); confetti({ particleCount: 150, spread: 70, origin: { y: 0.6 } }); setTimeout(() => setShowHug(false), 5000); };

  return (
    <div className="py-24 flex flex-col items-center justify-center relative px-6">
      <h2 className="text-5xl md:text-8xl font-handwritten text-[#DCAE96] mb-12">Feeling down?</h2>
      <motion.button whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} onClick={handleHug} className="relative px-12 py-8 bg-white border-2 border-[#83C5BE] rounded-[2rem] shadow-xl group overflow-hidden">
        <div className="absolute inset-0 bg-[#83C5BE] translate-y-full group-hover:translate-y-0 transition-transform duration-500" />
        <span className="relative z-10 text-3xl md:text-5xl font-handwritten text-[#83C5BE] group-hover:text-white transition-colors duration-500">Click for a Hug</span>
      </motion.button>
      <AnimatePresence>
        {showHug && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 backdrop-blur-xl p-6" onClick={() => setShowHug(false)}>
            <motion.div initial={{ scale: 0.8 }} animate={{ scale: 1 }} className="relative w-full max-w-2xl">
              <img src="https://media.tenor.com/V7RzI-5G80cAAAAi/baymax-hug.gif" alt="Hug" className="w-full rounded-[2rem] border-4 border-white shadow-2xl" />
              <h2 className="absolute -bottom-16 left-0 right-0 text-center text-5xl md:text-8xl font-pacifico text-white">I LOVE YOU!</h2>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

const Footer = () => (
  <footer className="py-32 bg-white text-center px-6 relative overflow-hidden">
    <div className="max-w-4xl mx-auto pt-16 border-t border-gray-100">
      <h2 className="text-4xl md:text-7xl text-[#DCAE96] mb-6 font-handwritten">Next 365 pages with you.</h2>
      <p className="text-3xl md:text-4xl font-handwritten text-[#E29578] mb-12 italic">See you in Volume 2.</p>
      <div className="flex flex-col items-center gap-6">
        <img src="https://media.tenor.com/fA1a2C3eK-sAAAAi/mailbox-love.gif" alt="Mailbox" className="w-32 h-32 object-contain" />
        <span className="text-xs text-[#83C5BE] uppercase tracking-[0.4em] font-bold">Volume 1: Complete</span>
      </div>
    </div>
  </footer>
);

export default function App() {
  const [loading, setLoading] = useState(true);
  const [isLocked, setIsLocked] = useState(true);
  const TARGET_DATE = new Date("2025-05-09T00:00:00+05:45");

  useEffect(() => { if (new Date() >= TARGET_DATE) setIsLocked(false); }, []);
  const handleCountdownEnd = () => { setIsLocked(false); confetti({ particleCount: 200, spread: 100 }); };

  return (
    <div className="min-h-screen bg-[#FFFDF5]">
      <AnimatePresence>
        {loading && <LoadingScreen onComplete={() => setLoading(false)} />}
      </AnimatePresence>

      {!loading && (
        <motion.main initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 1 }}>
          {isLocked ? (
            <section className="min-h-screen flex flex-col items-center justify-center p-8 text-center">
              <img src="https://media.tenor.com/2Y0W9Z-8O0wAAAAi/stars-stardust.gif" alt="Stars" className="w-24 h-24 mb-6" />
              <h1 className="text-5xl md:text-8xl font-handwritten text-[#DCAE96] mb-8">Almost Time...</h1>
              <Countdown targetDate={TARGET_DATE} onComplete={handleCountdownEnd} />
              <p className="mt-12 font-handwritten text-2xl text-[#E29578] italic">Counting down until it's officially ours.</p>
            </section>
          ) : (
            <div className="relative">
              <section className="min-h-screen flex flex-col items-center justify-center py-40 px-6 relative">
                <div className="flex justify-between w-full max-w-md mb-8 md:hidden">
                  <img src="https://media.tenor.com/o669T96XmToAAAAi/pusheen-heart.gif" alt="Pusheen" className="w-16 h-16" />
                  <img src="https://media.tenor.com/2Y0W9Z-8O0wAAAAi/stars-stardust.gif" alt="Stars" className="w-16 h-16" />
                </div>
                <h1 className="text-[3rem] md:text-[10rem] text-center font-handwritten text-[#DCAE96] leading-tight mb-8">
                  Happy 1 Year, <br className="md:hidden" /> <span className="text-[#E29578]">Babe!</span>
                </h1>
                <div className="bg-white/60 backdrop-blur-xl p-8 md:p-24 rounded-[3rem] shadow-2xl border-2 border-white mx-4 max-w-4xl text-center">
                   <h3 className="text-3xl md:text-6xl font-pacifico text-[#E29578] mb-6">Chapter 1 Complete</h3>
                   <div className="text-5xl md:text-9xl font-bold text-[#83C5BE]">365 <span className="text-xl md:text-4xl text-gray-400">DAYS</span></div>
                   <p className="mt-6 text-gray-500 font-handwritten text-2xl md:text-4xl italic">& forever to go</p>
                </motion.div>
                <div className="mt-20"><Heart className="text-red-400 animate-pulse" size={64} fill="currentColor" /></div>
              </section>
              <LoveGarden />
              <PolaroidTimeline />
              <EmergencyHug />
              <Footer />
            </div>
          )}
        </motion.main>
      )}
    </div>
  );
}
