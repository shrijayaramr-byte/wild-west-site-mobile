import { useEffect, useRef, useState } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import FinalPeel from './FinalPeel';

gsap.registerPlugin(ScrollTrigger);

// --- Components ---

const Navbar = () => {
  const [offset, setOffset] = useState(0);
  const [lastScrollY, setLastScrollY] = useState(0);
  const [isScrollingUp, setIsScrollingUp] = useState(false);
  const navRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      const navHeight = navRef.current?.offsetHeight || 80;
      const diff = lastScrollY - currentScrollY;

      if (currentScrollY <= 10) {
        setOffset(0);
        setIsScrollingUp(false);
      } else if (diff < 0) {
        setIsScrollingUp(false);
        setOffset((prev) => {
          let newOffset = prev + diff;
          if (newOffset < -navHeight) return -navHeight;
          return newOffset;
        });
      } else if (diff > 0) {
        setIsScrollingUp(true);
        setOffset(0);
      }

      setLastScrollY(currentScrollY);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, [lastScrollY]);

  const handleStart = () => {
    window.location.reload();
  };

  return (
    <nav 
      ref={navRef}
      className={`fixed top-0 left-0 w-full z-50 bg-transparent will-change-transform ease-out ${isScrollingUp ? 'transition-transform duration-1000' : ''}`}
      style={{ transform: `translateY(${offset}px)` }}
    >
      <div className="w-full px-6 md:px-20 py-4 md:py-8 flex items-center justify-between relative h-16 md:h-24">

        {/* Left: Icon Logo - Normal size */}
        <div className="cursor-pointer z-50 flex-shrink-0" onClick={handleStart}>
          <img 
            src="logotrans.png" 
            alt="Logo" 
            className="h-10 md:h-20 w-auto object-contain"
          />
        </div>

        {/* Right: Wild West Text Logo - Normal size */}
        <div className="cursor-pointer z-50 flex-shrink-0" onClick={handleStart}>
          <img 
            src="wildlogo.png" 
            alt="Wild West" 
            className="h-14 md:h-28 w-auto object-contain"
          />
        </div>

      </div>
    </nav>
  );
};

const BowlAnimation = () => {
  const images = ['q1.png', 'q2.png', 'q3.png', 'q4.png', 'q5.png', 'q6.png', 'q7.png', 'q8.png'];
  const [index, setIndex] = useState(0);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const timer = setInterval(() => {
      setIndex((prev) => (prev + 1) % images.length);
    }, 1000);
    return () => clearInterval(timer);
  }, [images.length]);

  return (
    <div ref={containerRef} className="relative w-full max-w-2xl aspect-square mx-auto flex items-center justify-center">
      {images.map((src, i) => (
        <img
          key={src}
          src={src}
          alt={`Bowl Step ${i + 1}`}
          style={{ 
            transform: i === 0 ? 'scale(1.1)' : 'none',
            zIndex: index === i ? 10 : 1,
            clipPath: 'inset(0 0 12% 0)', // Removes the bottom shadow/reflection
          }}
          className={`absolute inset-0 w-4/5 h-4/5 m-auto object-contain ${index === i ? 'opacity-100 block' : 'opacity-0 hidden'}`}
        />
      ))}
    </div>
  );
};

const Hero = () => {
  const heroRef = useRef(null);
  const bowlRef = useRef(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      // 1. THE BURRITO Pop (Simple Entry)
      gsap.from('.burrito-headline-centered', {
        scale: 0.8,
        opacity: 0,
        duration: 1.5,
        ease: 'back.out(1.7)',
      });

      // 2. BOLD FLAVOR (Sequenced to appear after)
      gsap.from('.hero-anim', {
        y: 40,
        opacity: 0,
        stagger: 0.1,
        duration: 1.2,
        delay: 0.6, // Delay so it appears after the main headline begins
        ease: 'power3.out',
      });

      // 3. JUICY CHEESY Pop (Triggered on Scroll, but not scrubbed)
      gsap.from('.loaded-headline', {
        scale: 0.8,
        opacity: 0,
        duration: 1.2,
        ease: 'back.out(1.7)',
        scrollTrigger: {
          trigger: '.loaded-headline',
          start: 'top 85%',
        }
      });

      // Floating Animation for the Bowl (Slower)
      gsap.to(bowlRef.current, {
        y: '+=20',
        duration: 4,
        ease: 'sine.inOut',
        repeat: -1,
        yoyo: true,
      });
    }, heroRef);
    return () => ctx.revert();
  }, []);

  return (
    <section ref={heroRef} id="hero" className="relative min-h-screen pt-32 pb-20 px-2 md:px-4 flex flex-col items-center justify-center bg-[#F5E3CD]">
      <div className="w-full max-w-[99vw] flex flex-col items-center text-center">
        
        {/* Layered Content Container - Moved UP as a whole */}
        <div className="relative w-full h-[60vh] md:h-[80vh] flex items-center justify-center mb-[40vw] md:mb-[20vw] -translate-y-[10vh] md:-translate-y-[15vh]" style={{ perspective: '1000px' }}>
          
          {/* BOLD FLAVOR (Permanent Styles) */}
          <div 
            className="absolute left-1/2 top-1/2 z-50 pointer-events-none bold-flavor-wrapper"
            style={{ 
              letterSpacing: '0.1vw',
            }}
          >
            <h2 
              className="hero-anim bold-flavor-hero text-center whitespace-pre-line"
            >
              BOLD{"\n"}FLAVOR
            </h2>
          </div>

          {/* Headline (Base Layer - Centered) */}
          <div className="hero-anim burrito-text-wrapper-centered w-full absolute z-10 translate-y-0">
            <h1 className="burrito-headline-centered">THE BURRITO</h1>
          </div>

          {/* Bowl Positioning Wrapper (Middle Layer - behind Tempt) */}
          <div className="hero-anim absolute w-full max-w-4xl flex items-center justify-center z-20 pointer-events-none translate-y-[25vw] md:translate-y-[15vw]">
            {/* Bowl Animation Wrapper (Handles the floating effect) */}
            <div ref={bowlRef} className="w-full flex items-center justify-center scale-[1.2] md:scale-[1.5]">
               <BowlAnimation />
            </div>
          </div>

          {/* Tempt Image (Top Layer - sitting in front of bowl bottom) */}
          <div className="hero-anim absolute w-full flex justify-center z-30 pointer-events-none translate-y-[55vw] md:translate-y-[35vw]">
            <img 
              src="temptlogo.png" 
              alt="Tempt" 
              className="w-[95vw] md:w-[90vw] max-w-[1200px] h-auto object-contain"
            />
          </div>

        </div>

        {/* Tagline and CTA removed per request */}
      </div>
    </section>
  );
};

const Features = () => {
  return (
    <section id="ritual" className="py-32 px-8 bg-[#F5E3CD]">
      <div className="max-w-7xl mx-auto min-h-[50vh]">
        {/* Content removed per user request */}
      </div>
    </section>
  );
};

const StackingCards = () => {
  useEffect(() => {
    const cards = document.querySelectorAll('.stacking-card');
    cards.forEach((card, i) => {
      if (i === cards.length - 1) return;
      ScrollTrigger.create({
        trigger: card,
        start: 'top top',
        pin: true,
        pinSpacing: false,
        scrub: true,
        animation: gsap.to(card, {
          scale: 0.9,
          opacity: 0.5,
          filter: 'blur(20px)',
          ease: 'none',
        }),
      });
    });
  }, []);

  const protocols = [
    { step: '01', title: 'Sourcing the Wild', desc: 'We iterate through over 40 frontier variants to find the perfect grain.' },
    { step: '02', title: 'The Assembly', desc: 'A proprietary vertical stacking logic ensures optimal flavor density.' },
    { step: '03', title: 'The Manifest', desc: 'Finalized with a high-pressure cream sear and organic seasoning.' },
  ];

  return (
    <section className="bg-charcoal">
      {protocols.map((p, i) => (
        <div key={i} className="stacking-card h-screen flex items-center justify-center px-8 bg-charcoal border-t border-cream/10">
          <div className="max-w-4xl w-full flex flex-col md:flex-row items-center gap-12">
            <div className="text-[12rem] font-sans font-bold text-cream/5 leading-none">{p.step}</div>
            <div className="space-y-6">
              <h3 className="text-4xl md:text-6xl font-bold text-cream tracking-tighter">{p.title}</h3>
              <p className="text-xl text-cream/40 max-w-md">{p.desc}</p>
              <div className="w-full h-[1px] bg-clay/30 relative overflow-hidden">
                 <div className="absolute inset-0 bg-clay w-1/3 animate-scan" />
              </div>
            </div>
          </div>
        </div>
      ))}
    </section>
  );
};

const Footer = () => (
  <footer className="bg-charcoal pt-32 pb-12 px-8 rounded-t-5xl text-cream/40">
    <div className="max-w-7xl mx-auto">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-20">
        <div className="col-span-1 md:col-span-2">
          <div className="text-4xl font-sans font-bold text-cream mb-6 tracking-tighter">WILD WEST</div>
          <p className="max-w-xs leading-relaxed">Engineered for the frontier. Born in the dust. Stay wild.</p>
        </div>
        <div>
          <h4 className="text-cream font-bold mb-6 text-sm uppercase tracking-widest">Protocol</h4>
          <ul className="space-y-4 text-sm">
            <li><a href="#" className="hover:text-clay transition-colors">Manifesto</a></li>
            <li><a href="#" className="hover:text-clay transition-colors">Origins</a></li>
            <li><a href="#" className="hover:text-clay transition-colors">The Feast</a></li>
          </ul>
        </div>
        <div>
          <h4 className="text-cream font-bold mb-6 text-sm uppercase tracking-widest">Status</h4>
          <div className="flex items-center gap-2 font-mono text-xs">
            <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
            <span>SYSTEM OPERATIONAL</span>
          </div>
        </div>
      </div>
      <div className="pt-12 border-t border-cream/5 flex flex-col md:flex-row justify-between items-center gap-6 text-xs">
        <p>© 2026 WILD WEST FRONTIER LOGISTICS. ALL RIGHTS RESERVED.</p>
        <div className="flex gap-8">
          <a href="#">Privacy</a>
          <a href="#">Terms</a>
        </div>
      </div>
    </div>
  </footer>
);

export default function App() {
  return (
    <div className="bg-[#F5E3CD] selection:bg-moss/30">
      <Navbar />
      <Hero />
      <FinalPeel />
      
      {/* New Headline below the sticker */}
      <section className="bg-[#F5E3CD] pt-56 pb-20 flex flex-col items-center">
        <div className="w-full max-w-[99vw] text-center">
          <h2 className="loaded-headline">
            JUICY CHEESY<br />FULLY LOADED
          </h2>
        </div>
      </section>

      <Features />
      <section className="py-32 px-8 bg-moss text-cream overflow-hidden">
        <div className="max-w-4xl mx-auto text-center space-y-8">
          <p className="text-sm font-mono uppercase tracking-[0.5em] opacity-40">The Manifesto</p>
          <div className="text-3xl md:text-5xl font-sans font-bold leading-tight tracking-tighter">
            Most kitchens focus on <span className="opacity-40">standardized speed.</span>
          </div>
          <div className="text-5xl md:text-8xl drama-text text-clay">
            We focus on <span className="text-cream">Untamed Density.</span>
          </div>
        </div>
      </section>
      <StackingCards />
      <Footer />
    </div>
  );
}
