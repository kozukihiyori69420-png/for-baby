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
      particleCount: 200,
      spread: 90,
      origin: { y: 0.5 },
      colors: ['#E29578', '#83C5BE', '#FFB4A2']
    });
    
    setTimeout(() => setShowHug(false), 5000);
  };

  return (
    <div className="py-40 flex flex-col items-center justify-center relative">
      <div className="absolute inset-0 bg-white/30 backdrop-blur-sm -z-10" />
      
      <motion.div 
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        className="text-center mb-12"
      >
        <h2 className="text-5xl md:text-7xl font-handwritten text-[#DCAE96] mb-4">Feeling down?</h2>
        <p className="text-xl text-[#83C5BE] uppercase tracking-[0.2em]">You deserve this</p>
      </motion.div>

      <motion.button
        whileHover={{ scale: 1.1, rotate: [0, -2, 2, 0] }}
        whileTap={{ scale: 0.9 }}
        onClick={handleHug}
        className="relative group p-4"
      >
        <div className="absolute inset-0 bg-[#83C5BE] rounded-full blur-xl opacity-20 group-hover:opacity-40 transition-opacity" />
        <div className="px-16 py-10 bg-[#83C5BE] text-white rounded-[3rem] text-4xl md:text-6xl font-handwritten shadow-2xl hover:bg-[#72b4ad] transition-all relative z-10 border-4 border-white">
          Click for a Squishy Hug
          <motion.div 
            className="absolute -top-6 -right-6 bg-white p-3 rounded-full shadow-lg"
            animate={{ scale: [1, 1.3, 1], rotate: [0, 15, -15, 0] }}
            transition={{ repeat: Infinity, duration: 2 }}
          >
            <Heart size={40} className="text-red-500" fill="currentColor" />
          </motion.div>
        </div>
      </motion.button>

      <AnimatePresence>
        {showHug && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] flex items-center justify-center bg-black/40 backdrop-blur-md"
            onClick={() => setShowHug(false)}
          >
            <motion.div 
              initial={{ scale: 0.5, rotate: -10 }}
              animate={{ scale: 1, rotate: 0 }}
              exit={{ scale: 0.5, rotate: 10 }}
              className="relative w-full max-w-3xl px-6"
            >
               <img 
                src="https://media.tenor.com/V7RzI-5G80cAAAAi/baymax-hug.gif" 
                alt="Big Hero 6 Hug" 
                className="w-full rounded-[4rem] shadow-[0_0_100px_rgba(255,255,255,0.3)] border-8 border-white"
              />
              <motion.div 
                initial={{ y: 50, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.3 }}
                className="absolute -bottom-20 left-0 right-0 text-center"
              >
                <h2 className="text-6xl md:text-8xl font-pacifico text-white drop-shadow-lg">I LOVE YOU!</h2>
              </motion.div>
            </motion.div>
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
            <div className="relative">
              {/* Background Decorations */}
              <div className="fixed inset-0 pointer-events-none opacity-20">
                {[...Array(20)].map((_, i) => (
                  <motion.div
                    key={i}
                    className="absolute"
                    initial={{ 
                      x: Math.random() * window.innerWidth, 
                      y: Math.random() * window.innerHeight 
                    }}
                    animate={{ 
                      y: [null, Math.random() * -100, Math.random() * 100],
                      rotate: [0, 360]
                    }}
                    transition={{ 
                      duration: 10 + Math.random() * 20, 
                      repeat: Infinity, 
                      ease: "linear" 
                    }}
                  >
                    <Heart size={Math.random() * 40 + 10} className="text-[#E29578]" />
                  </motion.div>
                ))}
              </div>

              {/* Section 1: Hero */}
              <section className="min-h-screen flex flex-col items-center justify-center py-60 px-8 relative">
                <motion.div 
                  initial={{ opacity: 0, y: 50 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 1 }}
                  className="relative z-10 flex flex-col items-center"
                >
                  <div className="relative mb-12">
                    <motion.div 
                      animate={{ rotate: [0, 10, -10, 0] }}
                      transition={{ duration: 5, repeat: Infinity }}
                      className="absolute -top-32 -left-20 md:-left-40 hidden sm:block"
                    >
                      <img src="https://media.tenor.com/o669T96XmToAAAAi/pusheen-heart.gif" alt="Pusheen" className="w-40 md:w-56" />
                    </motion.div>
                    
                    <motion.div 
                      animate={{ y: [0, -20, 0] }}
                      transition={{ duration: 3, repeat: Infinity }}
                      className="absolute -top-32 -right-20 md:-right-40 hidden sm:block"
                    >
                      <img src="https://media.tenor.com/2Y0W9Z-8O0wAAAAi/stars-stardust.gif" alt="Stars" className="w-40 md:w-56" />
                    </motion.div>

                    <h1 className="text-7xl md:text-[10rem] text-center font-handwritten text-[#DCAE96] leading-none">
                      Happy 1 Year, <br/>
                      <span className="text-[#E29578]">Babe!</span>
                    </h1>
                  </div>

                  <motion.div 
                    initial={{ scale: 0 }}
                    whileInView={{ scale: 1 }}
                    transition={{ delay: 0.5, type: 'spring' }}
                    className="mb-12 text-center text-2xl md:text-3xl text-[#83C5BE] font-bold tracking-[0.5em] uppercase"
                  >
                    365 Days of Us
                  </motion.div>

                  <motion.div 
                    whileHover={{ scale: 1.02 }}
                    className="bg-white/70 backdrop-blur-xl p-12 md:p-24 rounded-[5rem] shadow-2xl border-4 border-white relative group"
                  >
                    <div className="absolute -inset-4 border-2 border-dashed border-[#83C5BE] rounded-[6rem] opacity-30 group-hover:opacity-100 transition-opacity" />
                    <h3 className="text-4xl md:text-6xl font-pacifico text-[#E29578] text-center mb-10">Chapter 1 Complete</h3>
                    <div className="text-6xl md:text-9xl font-bold text-[#83C5BE] text-center drop-shadow-sm font-quicksand">
                      365 <span className="text-2xl md:text-4xl">Days</span>
                    </div>
                    <div className="mt-8 text-center text-gray-400 font-handwritten text-3xl">& Forever to Go</div>
                  </motion.div>

                  <motion.div 
                    initial={{ opacity: 0 }}
                    whileInView={{ opacity: 1 }}
                    transition={{ delay: 1 }}
                    className="mt-20 flex flex-col items-center"
                  >
                    <Heart className="text-red-400 animate-pulse mb-4" size={100} fill="currentColor" />
                    <div className="w-px h-32 bg-gradient-to-b from-[#83C5BE] to-transparent" />
                  </motion.div>
                </motion.div>
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
            </div>
          )}
        </motion.main>
      )}
    </div>
  );
}
