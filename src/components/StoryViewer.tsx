import React, { useState, useEffect, useRef } from 'react';
import { ChevronLeft, ChevronRight, Play, Pause, Volume2, VolumeX } from 'lucide-react';

import img0 from '../assets/depoimentos/643040150_18563988286039353_4091002589689442203_n.jpg';
import img1 from '../assets/depoimentos/657746560_18573170743039353_2485825877386518290_n.jpg';
import img2 from '../assets/depoimentos/720874093_18591332413039353_7107044889420569339_n.jpg';
import img3 from '../assets/depoimentos/730633313_18596782819039353_372939902796588489_n.jpg';
import img4 from '../assets/depoimentos/730760208_18597859438039353_6031908255018035854_n.jpg';
import img5 from '../assets/depoimentos/730894780_18596785582039353_7554239165369584160_n.jpg';

import vid0 from '../assets/depoimentos/AQMVC96Hsrsei6w2quQ4iq2tsV-qyojJe02FhS7-_WqfmcW50rFveBhBL0QJdN1n6czPmjPSi5Tw2l6xTZ30ldsX.mp4';
import vid1 from '../assets/depoimentos/AQMfUFEQHpN_pDNGdkDxPocxzBe57pKQaGC7942mll1R83RRmf1VZM565PkS8ySu0YBhdY1SZWvmQ7JyqZCZY0aT4PpSdrUK4pK4Ca8.mp4';
import vid2 from '../assets/depoimentos/AQN3I0PUNrtjF5ihiVuaLqo9xUDWE88hr4B-vlf7Foexi4JGHxveV02LWUuFQmyweLcCot6lBDl9Cgx621LR0FcwIsw7WVrQhn7KOl4.mp4';
import vid3 from '../assets/depoimentos/AQN5PreoIeT56SnqpOMeZd6cgAxdlIlZMHl4zVKufr-UEp2GABoBbfI3Ulzuu1YER7luGcxb_FNd_K4_QwwLcXfx.mp4';
import vid4 from '../assets/depoimentos/AQN6zjV4BxeN8ySqNCgKJ9CtUGfjL0h9i-tyPTX4otCrvYQlOHtBG55ELzJX4P5u0r5MzHscsnqjNzNKXIcPE1gEvXr4RkdhycnsKCU.mp4';
import vid5 from '../assets/depoimentos/AQNRlZw91cVpag4qHhgb8S8XIUXy9J5SCQqCBR8Taaxk_Ebx1RSICaA1sSUErYQohIKFhAfHK4O7_8QE_XMlVL6bbwBLWjf70O902ZI.mp4';
import vid6 from '../assets/depoimentos/AQNd8FAYTynwsxySGGIxrY-M0KCDw19UtsmTL5LfIvm4Umt9Trv08wzJf2dj360zgT3-Qrve2NTgh9V7b4C36YDI926quMUqNuTOEFA.mp4';
import vid7 from '../assets/depoimentos/AQNdS4EUDY123GkeByLd2smUByGziWTNMSTTVQuErrJ0PD1Jr6hCgixt5TueOtDDrfllPq-mfqFwUMd37jMMIC9e4AuQd0hOiJa7wv0.mp4';
import vid8 from '../assets/depoimentos/AQNyBk0iOZ06HJ9yoYuxS-V7fBJCUiwmLUe0MQZkCBRQpT_SE25fyGa0dNIe61uO0sRzB8I0_qzHYFKd7Iyan8xgfuSsJqWrJKRQWCM.mp4';
import vid9 from '../assets/depoimentos/AQO3Z_r2NNoQQcioirADo6tqd6mBLRnff35uJ7eGV2VgLz5wWKBovYl11T8nRK4_XL3WItGSlQF3cXYAaT2vMcl7.mp4';
import vid10 from '../assets/depoimentos/AQOFfRrjGsBGZoqrlqykF0S6rX-lyJwf1yIfowU7Hcf2sw_ooRFIpPhwpQzYrhsbg8UB2ZBDsUEA3l8i7OKqc47B.mp4';
import vid11 from '../assets/depoimentos/AQOIT7xCW0e3ShVDVAgD_NBGrUtyykllTg3zrkXtWC3LO2zmqti7gEsofplEHiDF3fnibTnUxWIei-K7HDHQnZvZUoiYcagj4wOfJ84.mp4';
import vid12 from '../assets/depoimentos/AQOTr7lCEeZCZN1ky-Wq0zXtilLKpfJr-OgKQvWAV2bxIkRDyJlh7rMuuMSI9MCqvDTU_1-rL9FzDvSHZFdTEyeJi59NdiTIvxzg4x4.mp4';
import vid13 from '../assets/depoimentos/AQOmMi5d6z5I5-Z1gfUhsr2ORkLBYQws8oiZNM5MeDK1ZQxyhoDmU0hzrh-XB-IpdRXc3MeV-XC4JE_eUM9XRboHDw9kTF0lkX309Gs.mp4';
import vid14 from '../assets/depoimentos/AQP4oOSEAKgvTvdnTuy8esWbcQ70hx8BDvqX4g3Ghx_xtG9CSjb2e50MycTQ8ASAX0tSxDS2FYQrIm8gMOL2W24XadbYd8mNrRF6OG8.mp4';
import vid15 from '../assets/depoimentos/AQPZyuigmdqEcRKfYFrHlkD7p-idFN4BNbrD_WNjBiVZKvj495QkpGIiTdgCjXIPIEEFmljq40g2hJ2sgXDJ3IAMtUuPgv9aF69JqI8.mp4';

const STORIES = [
  { type: 'image', url: img0 },
  { type: 'image', url: img1 },
  { type: 'image', url: img2 },
  { type: 'image', url: img3 },
  { type: 'image', url: img4 },
  { type: 'image', url: img5 },
  { type: 'video', url: vid0 },
  { type: 'video', url: vid1 },
  { type: 'video', url: vid2 },
  { type: 'video', url: vid3 },
  { type: 'video', url: vid4 },
  { type: 'video', url: vid5 },
  { type: 'video', url: vid6 },
  { type: 'video', url: vid7 },
  { type: 'video', url: vid8 },
  { type: 'video', url: vid9 },
  { type: 'video', url: vid10 },
  { type: 'video', url: vid11 },
  { type: 'video', url: vid12 },
  { type: 'video', url: vid13 },
  { type: 'video', url: vid14 },
  { type: 'video', url: vid15 }
];

export function StoryViewer() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const [isMuted, setIsMuted] = useState(true);
  const videoRef = useRef<HTMLVideoElement>(null);
  const STORY_DURATION = 5000; // 5 seconds for images
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  const [isInView, setIsInView] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  const nextStory = () => {
    setCurrentIndex((prevIndex) => (prevIndex + 1) % STORIES.length);
  };

  const prevStory = () => {
    setCurrentIndex((prevIndex) => (prevIndex === 0 ? STORIES.length - 1 : prevIndex - 1));
  };

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        setIsInView(entry.isIntersecting);
      },
      { threshold: 0.5 }
    );

    if (containerRef.current) {
      observer.observe(containerRef.current);
    }

    return () => {
      if (containerRef.current) {
        observer.unobserve(containerRef.current);
      }
    };
  }, []);

  useEffect(() => {
    if (timerRef.current) {
      clearTimeout(timerRef.current);
    }
    
    if (isPaused || !isInView) {
      if (videoRef.current) {
        videoRef.current.pause();
      }
      return;
    }

    const currentStory = STORIES[currentIndex];
    
    if (currentStory.type === 'image') {
      timerRef.current = setTimeout(() => {
        nextStory();
      }, STORY_DURATION);
    } else if (currentStory.type === 'video' && videoRef.current) {
      videoRef.current.play().catch(e => console.log('Video play failed', e));
      // Video ending is handled by onEnded event
    }

    return () => {
      if (timerRef.current) {
        clearTimeout(timerRef.current);
      }
    };
  }, [currentIndex, isPaused, isInView]);

  return (
    <div ref={containerRef} className="relative w-[260px] sm:w-[300px] lg:w-[320px] h-[520px] sm:h-[600px] lg:h-[640px] bg-[#0A0E1A] rounded-[3rem] border-[12px] border-slate-900 shadow-2xl shadow-blue-500/10 overflow-hidden flex flex-col mx-auto">
      {/* Phone Notch */}
      <div className="absolute top-0 inset-x-0 h-5 bg-slate-900 rounded-b-2xl w-24 sm:w-28 mx-auto z-50"></div>

      {/* Progress Bars */}
      <div className="absolute top-8 left-0 right-0 px-4 flex gap-1 z-40">
        {STORIES.map((_, idx) => (
          <div key={idx} className="flex-1 h-1 bg-white/30 rounded-full overflow-hidden">
            <div 
              className="h-full bg-white origin-left will-change-transform ease-linear"
              style={{
                transform: `scaleX(${idx === currentIndex ? ((isPaused || !isInView) ? 0.5 : 1) : idx < currentIndex ? 1 : 0})`,
                transitionProperty: 'transform',
                transitionDuration: idx === currentIndex && !isPaused && isInView && STORIES[currentIndex].type === 'image' ? `${STORY_DURATION}ms` : '150ms'
              }}
            />
          </div>
        ))}
      </div>

      {/* Story Content */}
      <div className="w-full h-full relative z-10 bg-black flex items-center justify-center">
        {STORIES[currentIndex].type === 'image' ? (
          <img 
            src={STORIES[currentIndex].url} 
            alt="Feedback" 
            className="w-full h-full object-contain"
          />
        ) : (
          <video
            ref={videoRef}
            src={STORIES[currentIndex].url}
            className="w-full h-full object-contain"
            playsInline
            autoPlay
            muted={isMuted}
            onEnded={nextStory}
            onClick={() => setIsPaused(!isPaused)}
          />
        )}
      </div>

      {/* Touch Areas */}
      <div className="absolute inset-0 z-20 flex">
        <div className="w-1/3 h-full cursor-pointer" onClick={prevStory}></div>
        <div className="w-1/3 h-full cursor-pointer" onClick={() => setIsPaused(!isPaused)}></div>
        <div className="w-1/3 h-full cursor-pointer" onClick={nextStory}></div>
      </div>
      
      {/* Controls Overlay */}
      <div className="absolute top-14 right-4 z-40 flex gap-4">
        {STORIES[currentIndex].type === 'video' && (
          <button 
            onClick={(e) => { e.stopPropagation(); setIsMuted(!isMuted); }}
            className="w-10 h-10 rounded-full bg-black/50 backdrop-blur-md flex items-center justify-center text-white border border-white/20"
          >
            {isMuted ? <VolumeX className="w-5 h-5" /> : <Volume2 className="w-5 h-5" />}
          </button>
        )}
      </div>
      
      {isPaused && (
        <div className="absolute inset-0 z-30 flex items-center justify-center pointer-events-none">
          <div className="w-16 h-16 rounded-full bg-black/50 backdrop-blur-md flex items-center justify-center text-white">
             <Pause className="w-8 h-8" />
          </div>
        </div>
      )}
    </div>
  );
}
