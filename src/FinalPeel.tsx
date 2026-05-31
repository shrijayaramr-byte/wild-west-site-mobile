import React, { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

const FinalPeel: React.FC = () => {
  const stickerRef = useRef<HTMLDivElement>(null);
  const triggerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!stickerRef.current || !triggerRef.current) return;

    const sticker = stickerRef.current;
    const trigger = triggerRef.current;

    // Set initial state (98% peeled)
    gsap.set(sticker, {
      '--sticker-peelback-current': '98%'
    } as any);

    const st = ScrollTrigger.create({
      trigger: trigger,
      start: "top bottom", // Start unpeeling as soon as it starts to be visible
      end: "top 20%",       // Fully unpeeled as it moves towards the top
      scrub: 0.5,
      onUpdate: (self) => {
        // Interpolate 98% -> 0% based on progress
        const currentPeel = gsap.utils.interpolate(98, 0, self.progress);
        sticker.style.setProperty('--sticker-peelback-current', currentPeel + '%');
      }
    });

    return () => {
      st.kill();
    };
  }, []);

  return (
    <div className="relative w-full h-0 z-50 pointer-events-none">
      <div 
        className="sticker-wrapper absolute right-4 md:right-20 -top-[150px] md:-top-[200px]" 
        ref={triggerRef} 
        style={{
          position: 'absolute',
          width: 'clamp(200px, 40vw, 400px)',
          height: 'clamp(200px, 40vw, 400px)',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          pointerEvents: 'auto'
        }}
      >
        <div 
          className="sticker-container" 
          ref={stickerRef} 
          style={{
            position: 'relative',
            width: '100%',
            height: '100%',
            willChange: 'transform'
          }}
        >
          <div 
            className="sticker-main"
            style={{
              position: 'absolute',
              inset: 0,
              width: '100%',
              height: '100%',
              clipPath: 'polygon(-10% calc(var(--sticker-peelback-current) + 1px), 110% calc(var(--sticker-peelback-current) + 1px), 110% 110%, -10% 110%)',
              zIndex: 1,
              backfaceVisibility: 'hidden'
            }}
          >
            <img src="sticker_final.png" alt="Front" className="w-full h-full object-contain block" />
          </div>
          <div 
            className="flap"
            style={{
              position: 'absolute',
              inset: 0,
              width: '100%',
              height: '100%',
              transform: 'scaleY(-1)',
              top: 'calc(-100% + 2 * var(--sticker-peelback-current) - 1px)',
              clipPath: 'polygon(-10% -10%, 110% -10%, 110% var(--sticker-peelback-current), -10% var(--sticker-peelback-current))',
              zIndex: 2,
              backfaceVisibility: 'hidden'
            }}
          >
            <img src="back_final.png" alt="Back" className="w-full h-full object-contain block" />
          </div>
        </div>
      </div>
    </div>
  );
};

export default FinalPeel;
