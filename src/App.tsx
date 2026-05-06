import React, { useState, useEffect, useRef } from 'react';
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
    }, 40);
    return () => clearInterval(interval);
  }, [onComplete]);

  return (
    <motion.div
      initial={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-[#FFFDF5]"
    >
      <div className="w-64 h-64 mb-8">
        <img 
          src="https://media.tenor.com/7S872pXl_N0AAAAi/milk-and-mocha-bear.gif" 
          alt="Loading GIF" 
          className="w-full h-full object-contain"
        />
      </div>
      <div className="text-2xl font-handwritten text-[#DCAE96] mb-4">
        Assembling 365 days of memories...
      </div>
      <div className="w-64 h-4 bg-gray-200 rounded-full overflow-hidden relative">
        <motion.div 
          className="h-full bg-[#83C5BE]"
          initial={{ width: 0 }}
          animate={{ width: `${progress}%` }}
        />
        {progress === 100 && (
          <motion.div 
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            className="absolute inset-0 flex items-center justify-center text-red-500"
          >
            <Heart fill="currentColor" size={24} />
          </motion.div>
        )}
      </div>
      <div className="mt-2 text-[#E29578] font-bold">{progress}%</div>
    </motion.div>
  );
};

const Countdown = ({ targetDate, onComplete }: { targetDate: Date, onComplete?: () => void }) => {
  const [timeLeft, setTimeLeft] = useState({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0,
    isOver: false
  });

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

      const days = Math.floor(diff / (1000 * 60 * 60 * 24));
      const hours = Math.floor((diff / (1000 * 60 * 60)) % 24);
      const minutes = Math.floor((diff / 1000 / 60) % 60);
      const seconds = Math.floor((diff / 1000) % 60);

      setTimeLeft({ days, hours, minutes, seconds, isOver: false });
    }, 1000);

    return () => clearInterval(timer);
  }, [targetDate, onComplete]);

  return (
    <div className="flex flex-wrap justify-center gap-6 md:gap-12 text-[#E29578]">
      {[
        { label: 'Days', value: timeLeft.days },
        { label: 'Hours', value: timeLeft.hours },
        { label: 'Minutes', value: timeLeft.minutes },
        { label: 'Seconds', value: timeLeft.seconds },
      ].map((item) => (
        <div key={item.label} className="flex flex-col items-center bg-white/40 backdrop-blur-sm p-6 rounded-3xl min-w-[120px] md:min-w-[160px] shadow-sm border border-white/50">
          <motion.span
            key={item.value}
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="text-5xl md:text-7xl font-bold font-pacifico"
          >
            {item.value}
          </motion.span>
          <span className="text-lg md:text-xl uppercase tracking-[0.2em] font-handwritten text-[#83C5BE] mt-2">
            {item.label}
          </span>
        </div>
      ))}
    </div>
  );
};

const LoveGarden = () => {
  const [activeNote, setActiveNote] = useState<string | null>(null);
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const [showMusic, setShowMusic] = useState(false);
  
  const flowers = [
    { id: 1, note: "I love the way you laugh at my silly jokes.", color: "#E29578" },
    { id: 2, note: "You make every day feel like a dream.", color: "#83C5BE" },
    { id: 3, note: "Thank you for being my best friend.", color: "#D4A373" },
    { id: 4, note: "I'm so lucky to have you by my side.", color: "#FFB4A2" },
    { id: 5, note: "You are my favorite person in the world.", color: "#B5838D", isGolden: true },
    { id: 6, note: "I can't wait for many more years with you.", color: "#E5989B" },
  ];

  const handleMouseMove = (e: React.MouseEvent) => {
    const rect = e.currentTarget.getBoundingClientRect();
    setMousePos({ x: e.clientX - rect.left, y: e.clientY - rect.top });
  };

  return (
    <div 
      className="relative py-20 bg-[#FFFDF5] overflow-hidden cursor-none"
      onMouseMove={handleMouseMove}
    >
      {/* Custom Bee Cursor for this section */}
      <motion.div 
        className="fixed pointer-events-none z-40 w-12 h-12"
        animate={{ x: mousePos.x, y: mousePos.y }}
        transition={{ type: 'spring', damping: 20, stiffness: 150, mass: 0.5 }}
        style={{ position: 'absolute' }}
      >
        <img src="https://media.tenor.com/T_62E76K7z8AAAAi/bee-joy.gif" alt="Bee" className="w-full h-full" />
      </motion.div>

      <div className="max-w-4xl mx-auto text-center px-4">
        <h2 className="text-4xl md:text-5xl mb-12 text-[#DCAE96]">The "Why I Love You" Garden</h2>
        <div className="flex flex-wrap justify-center gap-12">
          {flowers.map((flower) => (
            <motion.div
              key={flower.id}
              whileHover={{ scale: 1.2, rotate: 10 }}
              onClick={() => {
                setActiveNote(flower.note);
                if (flower.isGolden) setShowMusic(true);
              }}
              className="cursor-pointer relative group"
            >
              <div className={`w-16 h-16 md:w-20 md:h-20 flex items-center justify-center rounded-full ${flower.isGolden ? 'bg-yellow-100 shadow-[0_0_15px_rgba(251,191,36,0.6)]' : 'bg-white'}`}>
                {flower.isGolden ? (
                  <Flower2 className="text-yellow-500" size={48} />
                ) : (
                  <Flower2 style={{ color: flower.color }} size={40} />
                )}
              </div>
              <motion.div 
                className="absolute -top-2 -right-2 opacity-0 group-hover:opacity-100"
                animate={{ rotate: 360 }}
                transition={{ duration: 4, repeat: Infinity, ease: "linear" }}
              >
                <Sparkles className="text-yellow-400" size={16} />
              </motion.div>
            </motion.div>
          ))}
        </div>

        <AnimatePresence>
          {activeNote && (
            <motion.div
              initial={{ opacity: 0, y: 20, scale: 0.8 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 20, scale: 0.8 }}
              className="mt-16 p-6 bg-white rounded-2xl shadow-lg border-2 border-[#83C5BE] max-w-md mx-auto relative"
            >
              <button 
                onClick={() => setActiveNote(null)}
                className="absolute top-2 right-2 text-gray-400 hover:text-gray-600"
              >
                ✕
              </button>
              <p className="text-xl font-handwritten text-[#E29578]">{activeNote}</p>
              {showMusic && activeNote.includes("favorite person") && (
                <div className="mt-4 flex flex-col items-center gap-2 text-[#83C5BE]">
                  <div className="flex items-center gap-2 animate-pulse">
                    <Music size={20} />
                    <span className="text-sm">Playing "Our Song" ✨</span>
                  </div>
                  <div className="w-full bg-gray-100 h-1 rounded-full overflow-hidden">
                    <motion.div 
                      className="h-full bg-[#83C5BE]"
                      animate={{ width: ["0%", "100%"] }}
                      transition={{ duration: 10, repeat: Infinity }}
                    />
                  </div>
                </div>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

const PolaroidTimeline = () => {
  const scrollRef = useRef<HTMLDivElement>(null);
  
  const moments = [
    {
      title: "Where it all started",
      date: "Day 1",
      /* REPLACE the URL below with your photo! */
      img: "https://images.unsplash.com/photo-1517048676732-d65bc937f952?q=80&w=2070&auto=format&fit=crop",
      note: "That first awkward coffee date..."
    },
    {
      title: "Our funniest fail",
      date: "Day 45",
      /* REPLACE the URL below with your photo! */
      img: "https://images.unsplash.com/photo-1511632765486-a01980e01a18?q=80&w=2070&auto=format&fit=crop",
      note: "Remember the burnt pizza night? 😂"
    },
    {
      title: "Adventures together",
      date: "Day 120",
      /* REPLACE the URL below with your photo! */
      img: "https://images.unsplash.com/photo-1527631746610-bca00a040d60?q=80&w=1974&auto=format&fit=crop",
      note: "Hiking until our feet hurt."
    },
    {
      title: "The moment I knew",
      date: "Day 200",
      /* REPLACE the URL below with your photo! */
      img: "https://images.unsplash.com/photo-1518199266791-5375a83190b7?q=80&w=2070&auto=format&fit=crop",
      note: "I knew I loved you then."
    },
    {
      title: "Volume 1 Finale",
      date: "Day 365",
      /* REPLACE the URL below with your photo! */
      img: "https://images.unsplash.com/photo-1531747118685-ca8fa6e08806?q=80&w=2018&auto=format&fit=crop",
      note: "Happy 1 Year Anniversary!"
    }
  ];

  return (
    <div className="py-20 bg-[#FFFDF5] overflow-hidden">
      <h2 className="text-4xl md:text-5xl text-center mb-16 text-[#DCAE96]">Our Polaroid Timeline</h2>
      <div 
        ref={scrollRef}
        className="flex overflow-x-auto gap-12 px-12 pb-12 scrollbar-hide snap-x"
        style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
      >
        {moments.map((moment, idx) => (
          <motion.div
            key={idx}
            className="flex-shrink-0 w-80 snap-center relative"
            whileHover={{ y: -10 }}
          >
            <div className="polaroid relative bg-white p-4 pt-4 pb-12 shadow-xl transform" style={{ rotate: `${idx % 2 === 0 ? -2 : 2}deg` }}>
              <div className="tape bg-gray-200/50 absolute -top-4 left-1/2 -translate-x-1/2 w-24 h-8 rotate-1"></div>
              <div className="relative overflow-hidden aspect-square group">
                <img src={moment.img} alt={moment.title} className="w-full h-full object-cover grayscale-[20%] group-hover:grayscale-0 transition-all" />
                <motion.div 
                  initial={{ opacity: 0, scale: 0 }}
                  whileHover={{ opacity: 1, scale: 1 }}
                  className="absolute inset-0 flex items-center justify-center bg-black/20"
                >
                  <img src="https://media.tenor.com/tYt696P33n4AAAAi/cute-ghost.gif" className="w-16 h-16" alt="Ghost" />
                </motion.div>
                <div className="absolute top-2 right-2">
                   <img src="https://media.tenor.com/0i_p7H2uWf0AAAAi/sparkles.gif" className="w-8 h-8" alt="Sparkle" />
                </div>
              </div>
              <div className="mt-4">
                <h3 className="text-2xl font-handwritten text-[#E29578]">{moment.title}</h3>
                <p className="text-xs text-gray-400 font-bold mb-1 uppercase tracking-widest">{moment.date}</p>
                <p className="text-sm font-handwritten text-gray-600">{moment.note}</p>
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
};

const EmergencyHug = () => {
  const [showHug, setShowHug] = useState(false);

  const handleHug = () => {
    setShowHug(true);
    confetti({
      particleCount: 150,
      spread: 70,
      origin: { y: 0.6 },
      colors: ['#E29578', '#83C5BE', '#FFB4A2']
    });
    
    // Heart confetti
    const end = Date.now() + 3 * 1000;
    const colors = ['#ff69b4', '#ff1493', '#ff0000'];

    (function frame() {
      confetti({
        particleCount: 3,
        angle: 60,
        spread: 55,
        origin: { x: 0 },
        colors: colors
      });
      confetti({
        particleCount: 3,
        angle: 120,
        spread: 55,
        origin: { x: 1 },
        colors: colors
      });

      if (Date.now() < end) {
        requestAnimationFrame(frame);
      }
    }());

    setTimeout(() => setShowHug(false), 5000);
  };

  return (
    <div className="py-20 flex flex-col items-center justify-center bg-[#FFFDF5]">
      <motion.button
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        onClick={handleHug}
        className="px-12 py-6 bg-[#83C5BE] text-white rounded-full text-3xl font-handwritten shadow-2xl hover:bg-[#72b4ad] transition-colors relative group"
      >
        Click for an Instant Hug
        <motion.div 
          className="absolute -top-4 -right-4"
          animate={{ scale: [1, 1.2, 1] }}
          transition={{ repeat: Infinity, duration: 2 }}
        >
          ❤️
        </motion.div>
      </motion.button>

      <AnimatePresence>
        {showHug && (
          <motion.div
            initial={{ opacity: 0, scale: 0.5 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.5 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-white/60 backdrop-blur-sm pointer-events-none"
          >
            <div className="relative w-full max-w-2xl px-4">
               <img 
                src="https://media.tenor.com/V7RzI-5G80cAAAAi/baymax-hug.gif" 
                alt="Big Hero 6 Hug" 
                className="w-full rounded-3xl shadow-2xl"
              />
              <motion.div 
                initial={{ y: 20 }}
                animate={{ y: 0 }}
                className="absolute -bottom-10 left-0 right-0 text-center"
              >
                <h2 className="text-4xl font-pacifico text-[#E29578]">Warm Hug Sent!</h2>
              </motion.div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

const Footer = () => {
  return (
    <footer className="py-20 bg-white text-center px-4 relative overflow-hidden">
      <div className="max-w-2xl mx-auto border-t-2 border-dashed border-[#83C5BE] pt-12">
        <h2 className="text-3xl md:text-4xl text-[#DCAE96] mb-6">
          I can’t wait to write the next 365 pages with you.
        </h2>
        <p className="text-2xl font-handwritten text-[#E29578] mb-12">See you in Volume 2.</p>
        
        <div className="flex flex-col items-center gap-4">
          <div className="relative w-24 h-24">
            <img 
              src="https://media.tenor.com/fA1a2C3eK-sAAAAi/mailbox-love.gif" 
              alt="Mailbox" 
              className="w-full h-full object-contain"
            />
          </div>
          <div className="text-xs text-gray-400 uppercase tracking-widest font-bold">
            Volume 1: Complete • Volume 2: Loading...
          </div>
        </div>
      </div>
      
      {/* Decorative stars */}
      <div className="absolute top-10 left-10 text-[#83C5BE] opacity-30"><Sparkles size={40} /></div>
      <div className="absolute bottom-10 right-10 text-[#E29578] opacity-30"><Sparkles size={40} /></div>
    </footer>
  );
};

// --- Main App ---

export default function App() {
  const [loading, setLoading] = useState(true);
  const [isLocked, setIsLocked] = useState(true);

  // May 9th, 12 AM Nepali Time (NPT is UTC +5:45)
  // For 2024, 2025, or 2026? Assuming 2026 based on current year instructions
  const TARGET_DATE = new Date("2026-05-09T00:00:00+05:45");

  useEffect(() => {
    // Check if current time is already past target
    if (new Date() >= TARGET_DATE) {
      setIsLocked(false);
    }
  }, []);

  const handleCountdownEnd = () => {
    setIsLocked(false);
    confetti({
      particleCount: 200,
      spread: 100,
      origin: { y: 0.6 }
    });
  };

  return (
    <div className="min-h-screen">
      <AnimatePresence>
        {loading && <LoadingScreen onComplete={() => setLoading(false)} />}
      </AnimatePresence>

      {!loading && (
        <motion.main
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1 }}
        >
          {isLocked ? (
            /* LOCK SCREEN - Hardcore Countdown */
            <section className="min-h-screen flex flex-col items-center justify-center p-8 bg-[#FFFDF5] text-center">
              <motion.div 
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                className="max-w-4xl"
              >
                <div className="mb-12">
                  <img src="https://media.tenor.com/2Y0W9Z-8O0wAAAAi/stars-stardust.gif" alt="Stars" className="w-32 h-32 mx-auto mb-6" />
                  <h1 className="text-6xl md:text-8xl font-handwritten text-[#DCAE96] mb-4">Almost Time...</h1>
                  <p className="text-xl md:text-2xl text-[#83C5BE] font-bold tracking-[0.3em] uppercase">The Magic Begins In:</p>
                </div>

                <Countdown targetDate={TARGET_DATE} onComplete={handleCountdownEnd} />

                <div className="mt-16 flex flex-col items-center gap-4">
                  <div className="flex gap-4">
                    <img src="https://media.tenor.com/o669T96XmToAAAAi/pusheen-heart.gif" alt="Pusheen" className="w-20" />
                    <img src="https://media.tenor.com/7S872pXl_N0AAAAi/milk-and-mocha-bear.gif" alt="Mocha" className="w-20" />
                  </div>
                  <p className="font-handwritten text-2xl text-[#E29578] italic">Counting every second until it's officially ours.</p>
                </div>
              </motion.div>
            </section>
          ) : (
            /* FULL UNLOCKED SITE */
            <>
              {/* Section 1: Hero */}
              <section className="min-h-screen flex flex-col items-center justify-center py-40 px-8 relative overflow-hidden">
                <div className="absolute top-20 left-10 md:left-40 animate-bounce-slow hidden sm:block">
                  <img src="https://media.tenor.com/o669T96XmToAAAAi/pusheen-heart.gif" alt="Pusheen" className="w-32 md:w-48" />
                </div>
                <div className="absolute top-20 right-10 md:right-40 animate-bounce-slow delay-500 hidden sm:block">
                  <img src="https://media.tenor.com/2Y0W9Z-8O0wAAAAi/stars-stardust.gif" alt="Stars" className="w-32 md:w-48" />
                </div>

                <motion.h1 
                  initial={{ y: -50 }}
                  whileInView={{ y: 0 }}
                  className="text-6xl md:text-9xl text-center font-handwritten text-[#DCAE96] mb-12"
                >
                  Happy 1 Year, <span className="text-[#E29578]">Babe</span>!
                </motion.h1>

                <div className="mb-12 text-center text-2xl text-[#83C5BE] font-bold tracking-[0.4em]">
                  365 DAYS OF US
                </div>

                <div className="bg-white/50 backdrop-blur-md p-10 md:p-20 rounded-[4rem] shadow-xl border-2 border-white/80">
                   <h3 className="text-4xl md:text-5xl font-pacifico text-[#E29578] text-center mb-8">Official Time Passed:</h3>
                   <div className="text-5xl md:text-7xl font-bold text-[#83C5BE] text-center">365 Days & Forever</div>
                </div>

                <motion.div 
                  initial={{ scale: 0 }}
                  whileInView={{ scale: 1 }}
                  className="mt-20"
                >
                  <Heart className="text-red-400 animate-pulse" size={80} fill="currentColor" />
                </motion.div>
                
                <div className="absolute bottom-20 left-1/2 -translate-x-1/2 animate-bounce text-center">
                  <p className="text-sm text-gray-400 uppercase tracking-widest mb-4">Scroll down for your garden</p>
                  <div className="w-1 h-12 bg-[#83C5BE] mx-auto rounded-full" />
                </div>
              </section>

              {/* Section 2: Garden */}
              <div className="py-20">
                <LoveGarden />
              </div>

              {/* Section 3: Timeline */}
              <div className="py-40">
                <PolaroidTimeline />
              </div>

              {/* Section 4: Hug */}
              <div className="py-20">
                <EmergencyHug />
              </div>

              {/* Section 5: Footer */}
              <Footer />
            </>
          )}
        </motion.main>
      )}
    </div>
  );
}
