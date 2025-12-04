'use client';

import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowLeft, ArrowRight, X, Sparkles, Download, Loader2, Receipt, Smartphone, Volume2, VolumeX, BadgeCheck } from 'lucide-react';
import { toPng } from 'html-to-image';
import { generateWrapData } from './dataGenerator';

// --- HELPER FUNCTIONS ---

interface SlideData {
  id: number;
  title: string;
  metric: string | number;
  subtext: string;
  theme: string;
}

const getThemeColors = (theme: string) => {
  switch (theme) {
    case 'blue': return { bg: 'bg-gray-900', text: 'text-blue-400', bar: 'bg-blue-600' };
    case 'green': return { bg: 'bg-gray-900', text: 'text-green-400', bar: 'bg-green-600' };
    case 'red': return { bg: 'bg-gray-900', text: 'text-red-400', bar: 'bg-red-600' };
    case 'purple': return { bg: 'bg-gray-900', text: 'text-purple-400', bar: 'bg-purple-600' };
    case 'final': return { bg: 'bg-gradient-to-br from-green-900 to-black', text: 'text-yellow-400', bar: 'bg-yellow-500' };
    default: return { bg: 'bg-gray-900', text: 'text-white', bar: 'bg-white' };
  }
};

// --- COMPONENT: RECEIPT VIEW ---

const ReceiptView = ({ data, handle, verified }: { data: SlideData[], handle: string, verified: boolean }) => {
  const receiptRef = useRef<HTMLDivElement>(null);
  const [isDownloading, setIsDownloading] = useState(false);

  const downloadReceipt = async () => {
    if (!receiptRef.current) return;
    setIsDownloading(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 100));
      const dataUrl = await toPng(receiptRef.current, { cacheBust: true, pixelRatio: 2, backgroundColor: '#f3f4f6' });
      const link = document.createElement('a');
      link.href = dataUrl;
      link.download = `KOX-Receipt-${handle}.png`;
      link.click();
    } catch (e) {
      console.error(e);
      alert("Error saving receipt.");
    } finally {
      setIsDownloading(false);
    }
  };

  return (
    <div className="w-full h-full flex flex-col items-center justify-center p-4 bg-gray-900 overflow-y-auto">
      <div ref={receiptRef} className="bg-white text-black w-full max-w-[340px] p-6 shadow-2xl relative font-mono text-sm leading-relaxed">
        <div className="absolute -top-2 left-0 w-full h-4 bg-white receipt-top-edge"></div>
        <div className="text-center mb-6 border-b-2 border-black border-dashed pb-4">
          <h2 className="text-2xl font-black tracking-tighter mb-1">KOX WRAP '24</h2>
          <p className="uppercase text-xs">Kenyans On X Certified</p>
          <p className="text-xs mt-1 text-gray-500">{new Date().toLocaleString()}</p>
          
          {/* HANDLE + VERIFIED TICK */}
          <div className="flex items-center justify-center gap-1 mt-2">
            <p className="font-bold">@{handle}</p>
            {verified && <BadgeCheck className="w-4 h-4 text-blue-500 fill-blue-100" />}
          </div>
        </div>
        <div className="space-y-3 mb-6">
          {data.map((item) => (
            <div key={item.id} className="flex flex-col border-b border-gray-300 pb-2 border-dotted last:border-0">
              <span className="uppercase text-xs text-gray-600 mb-1">{item.title}</span>
              <div className="flex justify-between items-end font-bold text-base">
                <span className="line-clamp-1 w-2/3">{item.subtext.substring(0, 15)}...</span>
                <span>{String(item.metric).length > 8 ? 'HIGH' : item.metric}</span>
              </div>
            </div>
          ))}
        </div>
        <div className="border-t-2 border-black border-dashed pt-4 text-center">
          <div className="flex justify-between font-black text-lg mb-4"><span>TOTAL VIBES</span><span>100%</span></div>
          <p className="text-[10px] text-center mb-2">THANK YOU FOR HUSTLING</p>
          <div className="h-12 w-3/4 mx-auto flex items-stretch justify-center gap-1 opacity-80">{[...Array(20)].map((_, i) => (<div key={i} className={`bg-black ${Math.random() > 0.5 ? 'w-1' : 'w-0.5'}`}></div>))}</div>
          <p className="text-[10px] tracking-[0.5em] mt-1">129384-KE</p>
        </div>
         <div className="absolute -bottom-2 left-0 w-full h-4 bg-white receipt-bottom-edge"></div>
      </div>
      <div className="mt-8 flex gap-4">
        <button onClick={downloadReceipt} disabled={isDownloading} className="flex items-center bg-green-600 text-white px-6 py-3 rounded-full font-bold shadow-lg hover:bg-green-500 transition">
          {isDownloading ? <Loader2 className="w-5 h-5 animate-spin" /> : <><Download className="w-5 h-5 mr-2" /> Save Receipt</>}
        </button>
      </div>
    </div>
  );
};

// --- COMPONENT: KOX SLIDE ---

interface KoxSlideProps extends SlideData {
  direction: number;
  handle: string;
  verified: boolean;
}

const KoxSlide: React.FC<KoxSlideProps> = ({ title, metric, subtext, theme, direction, handle, verified }) => {
  const { bg, text } = getThemeColors(theme);
  const slideRef = useRef<HTMLDivElement>(null);
  const [isDownloading, setIsDownloading] = useState(false);
  
  const variants = {
    initial: (direction: number) => ({ x: direction > 0 ? '100%' : '-100%', opacity: 0 }),
    animate: { x: 0, opacity: 1 },
    exit: (direction: number) => ({ x: direction < 0 ? '100%' : '-100%', opacity: 0 }),
  };

  const textVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: (i: number) => ({ opacity: 1, y: 0, transition: { delay: i * 0.1 + 0.5, duration: 0.5 } }),
  };

  const handleShare = () => {
      const wrapLink = encodeURIComponent(window.location.href);
      const shareText = encodeURIComponent(`I just checked my KOX Business Wrap! Apparently I'm a "${metric}" 😭. Check yours here:\n`);
      const hashtags = encodeURIComponent('KOXWrapped,Kenya');
      window.open(`https://twitter.com/intent/tweet?text=${shareText}&url=${wrapLink}&hashtags=${hashtags}`, '_blank');
  };

  const handleDownload = async () => {
    if (!slideRef.current) return;
    setIsDownloading(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 100));
      const dataUrl = await toPng(slideRef.current, { cacheBust: true, pixelRatio: 2, backgroundColor: '#111827' });
      const link = document.createElement('a');
      link.href = dataUrl;
      link.download = `KOX-Wrap-Persona.png`;
      link.click();
    } catch (error) {
      console.error("Screenshot failed", error);
      alert("Could not generate image.");
    } finally {
      setIsDownloading(false);
    }
  };

  return (
    <motion.div
      key={title}
      ref={slideRef}
      custom={direction}
      variants={variants}
      initial="initial"
      animate="animate"
      exit="exit"
      transition={{ type: 'tween', duration: 0.4 }}
      className={`absolute inset-0 w-full h-full p-8 flex flex-col justify-center items-center text-center ${bg} text-white`}
    >
      {/* HEADER WITH HANDLE & TICK */}
      <div className="absolute top-12 flex items-center gap-2 opacity-50">
          <p className="text-sm font-bold tracking-widest uppercase">@{handle}</p>
          {verified && <BadgeCheck className="w-4 h-4 text-blue-400 fill-blue-900" />}
      </div>

      <motion.h3 custom={1} variants={textVariants} initial="hidden" animate="visible" className="text-xl font-bold uppercase mb-4 tracking-wider text-gray-400 mt-10">{title}</motion.h3>
      <motion.div custom={2} variants={textVariants} initial="hidden" animate="visible" className={`my-8 font-extrabold ${text} break-words`}>
        {typeof metric === 'number' || String(metric).length < 20 ? <p className="text-6xl md:text-8xl">{metric}</p> : <p className="text-4xl md:text-6xl max-w-sm">{metric}</p>}
      </motion.div>
      <motion.p custom={3} variants={textVariants} initial="hidden" animate="visible" className="text-lg md:text-xl font-medium max-w-xs text-gray-300">{subtext}</motion.p>
      {theme === 'final' && (
        <motion.div custom={4} variants={textVariants} initial="hidden" animate="visible" className="mt-12 flex flex-col gap-3 w-full max-w-xs relative z-50">
          <button onClick={handleShare} className="flex items-center justify-center bg-white text-black font-bold py-3 px-6 rounded-full shadow-lg hover:bg-gray-200 transition w-full">Post on <X className="w-5 h-5 ml-2" /></button>
          <button onClick={(e) => { e.stopPropagation(); handleDownload(); }} disabled={isDownloading} className="flex items-center justify-center bg-gray-800 border border-gray-600 text-white font-bold py-3 px-6 rounded-full shadow-lg hover:bg-gray-700 transition w-full">
            {isDownloading ? <><Loader2 className="w-5 h-5 ml-2 animate-spin" /></> : <>Save for WhatsApp <Download className="w-5 h-5 ml-2" /></>}
          </button>
        </motion.div>
      )}
    </motion.div>
  );
};

// --- MAIN PAGE COMPONENT ---

export default function Home() {
  const [showWrap, setShowWrap] = useState(false);
  const [handle, setHandle] = useState('');
  const [category, setCategory] = useState('general');
  const [verified, setVerified] = useState(false); // <--- NEW STATE
  const [wrapData, setWrapData] = useState<any[]>([]);
  
  const [currentIndex, setCurrentIndex] = useState(0);
  const [direction, setDirection] = useState(0);
  const [viewMode, setViewMode] = useState<'story' | 'receipt'>('story');

  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [isMuted, setIsMuted] = useState(false);

  const toggleAudio = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (audioRef.current) {
      audioRef.current.muted = !audioRef.current.muted;
      setIsMuted(audioRef.current.muted);
    }
  };

  const handleGenerate = (e: React.FormEvent) => {
    e.preventDefault();
    if (!handle) return;
    
    const data = generateWrapData(handle, category);
    setWrapData(data);
    setShowWrap(true);

    if (audioRef.current) {
      audioRef.current.volume = 0.4;
      audioRef.current.currentTime = 0;
      audioRef.current.play().catch(err => console.log("Audio play failed:", err));
      setIsMuted(false);
    }
  };

  const handleClose = () => {
    setShowWrap(false);
    setCurrentIndex(0);
    if (audioRef.current) audioRef.current.pause();
  };

  const navigate = (newIndex: number, newDirection: number) => {
    if (newIndex >= 0 && newIndex < wrapData.length) {
      setDirection(newDirection);
      setCurrentIndex(newIndex);
    }
  };

  const handleTap = (e: React.MouseEvent<HTMLDivElement>) => {
    if (viewMode === 'receipt') return;
    const rect = e.currentTarget.getBoundingClientRect();
    if (e.clientX - rect.left > rect.width / 2) navigate(currentIndex + 1, 1);
    else navigate(currentIndex - 1, -1);
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-black relative">
      <audio ref={audioRef} src="/vibe.mp3" loop />

      {!showWrap && (
        <div className="min-h-screen bg-black text-white flex flex-col items-center justify-center p-4 w-full">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="max-w-md w-full bg-gray-900 border border-gray-800 rounded-2xl p-8 shadow-2xl">
            <div className="flex justify-center mb-6">
              <div className="bg-green-500 p-3 rounded-full bg-opacity-20"><Sparkles className="w-8 h-8 text-green-400" /></div>
            </div>
            <h1 className="text-3xl font-extrabold text-center mb-2">KOX Business Wrapped</h1>
            <p className="text-gray-400 text-center mb-8">Did you survive the TL in 2024? Enter your handle to audit your hustle.</p>
            <form onSubmit={handleGenerate} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-400 mb-1">X (Twitter) Handle</label>
                <div className="relative">
                  <span className="absolute left-3 top-3 text-gray-500">@</span>
                  <input type="text" required value={handle} onChange={(e) => setHandle(e.target.value)} placeholder="KevoTheVendor" className="w-full bg-black border border-gray-700 rounded-lg py-3 pl-8 pr-4 focus:ring-2 focus:ring-green-500 focus:outline-none transition" />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-400 mb-1">Hustle Category</label>
                <select value={category} onChange={(e) => setCategory(e.target.value)} aria-label="Hustle Category" className="w-full bg-black border border-gray-700 rounded-lg py-3 px-4 focus:ring-2 focus:ring-green-500 focus:outline-none transition appearance-none">
                  <option value="general">General Hustler</option>
                  <option value="thrift">Mtumba / Thrift</option>
                  <option value="tech">Tech / Dev / Writing</option>
                  <option value="food">Food / Pastries</option>
                </select>
              </div>

              {/* FAKE VERIFICATION TOGGLE */}
              <div className="flex items-center gap-3 bg-gray-800 p-3 rounded-lg border border-gray-700 cursor-pointer" onClick={() => setVerified(!verified)}>
                  <div className={`w-5 h-5 rounded border flex items-center justify-center transition ${verified ? 'bg-blue-500 border-blue-500' : 'border-gray-500'}`}>
                      {verified && <BadgeCheck className="w-4 h-4 text-white" />}
                  </div>
                  <span className="text-sm font-medium text-gray-300">Add Fake Verification? (Costs 0 bob)</span>
              </div>

              <button type="submit" className="w-full bg-green-600 hover:bg-green-500 text-white font-bold py-4 rounded-lg shadow-lg flex items-center justify-center gap-2 transition-all transform hover:scale-[1.02] mt-6">
                Generate My Wrap <ArrowRight className="w-5 h-5" />
              </button>
            </form>
            <p className="text-xs text-center text-gray-600 mt-6">*This is for vibes. Not affiliated with X.</p>
          </motion.div>
        </div>
      )}

      {showWrap && (
        <div className="relative w-full h-screen max-w-md max-h-[90vh] overflow-hidden md:rounded-xl shadow-2xl bg-gray-900">
          <div className="absolute top-4 left-4 right-4 z-[60] flex justify-between items-center pointer-events-none">
             <button onClick={toggleAudio} className="pointer-events-auto bg-black/40 backdrop-blur-md text-white p-2 rounded-full border border-white/20 hover:bg-white/20 transition">
                {isMuted ? <VolumeX className="w-5 h-5" /> : <Volume2 className="w-5 h-5 animate-pulse text-green-400" />}
             </button>
             <button onClick={(e) => { e.stopPropagation(); setViewMode(viewMode === 'story' ? 'receipt' : 'story'); }} className="pointer-events-auto bg-black/40 backdrop-blur-md text-white p-2 rounded-full border border-white/20 hover:bg-white/20 transition flex items-center gap-2 text-xs font-bold px-3">
              {viewMode === 'story' ? <><Receipt className="w-4 h-4" /> Receipt</> : <><Smartphone className="w-4 h-4" /> Story</>}
            </button>
          </div>

          {viewMode === 'story' && (
            <div className="w-full h-full cursor-pointer" onClick={handleTap}>
              <div className="absolute top-0 left-0 w-full h-2 z-20 flex p-1 gap-1">
                {wrapData.map((_, idx) => (
                  <div key={idx} className="h-1 flex-1 bg-gray-700 rounded-full overflow-hidden">
                    <motion.div className={`h-full ${idx <= currentIndex ? getThemeColors(wrapData[idx].theme).bar : 'bg-transparent'}`} initial={{ width: idx < currentIndex ? '100%' : '0%' }} animate={{ width: idx < currentIndex ? '100%' : (idx === currentIndex ? '100%' : '0%') }} transition={{ duration: idx === currentIndex ? 3 : 0 }} />
                  </div>
                ))}
              </div>
              <div className="absolute top-0 left-0 w-1/2 h-full z-10 opacity-0 md:opacity-10 hover:opacity-10 flex items-center justify-start pointer-events-none transition">{currentIndex > 0 && <ArrowLeft className="w-6 h-6 text-white ml-2" />}</div>
              <div className="absolute top-0 right-0 w-1/2 h-full z-10 opacity-0 md:opacity-10 hover:opacity-10 flex items-center justify-end pointer-events-none transition">{currentIndex < wrapData.length - 1 && <ArrowRight className="w-6 h-6 text-white mr-2" />}</div>
              <AnimatePresence initial={false} custom={direction} mode="wait">
                <KoxSlide key={wrapData[currentIndex].id} {...wrapData[currentIndex]} direction={direction} handle={handle} verified={verified} />
              </AnimatePresence>
            </div>
          )}

          {viewMode === 'receipt' && <ReceiptView data={wrapData} handle={handle} verified={verified} />}
        </div>
      )}

      {showWrap && (
        <button onClick={handleClose} title="Close" className="fixed top-4 left-4 md:top-8 md:left-8 text-white bg-black/50 p-2 rounded-full backdrop-blur-md z-50 hover:bg-white/20 transition hidden md:block">
          <X className="w-6 h-6" />
        </button>
      )}
       {showWrap && (
        <button onClick={handleClose} title="Close" className="md:hidden absolute top-4 left-4 z-[70] text-white bg-black/50 p-2 rounded-full backdrop-blur-md opacity-0 pointer-events-none">
        </button>
      )}
    </div>
  );
}