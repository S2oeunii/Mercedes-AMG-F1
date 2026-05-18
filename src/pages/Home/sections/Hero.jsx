import { useEffect, useRef } from 'react';
import arrowDown from '../../../assets/icons/arrowDown.svg';
import bg1 from '../../../assets/img/hero/Hero_KeyVisual-1.jpg';
import bg2 from '../../../assets/img/hero/Hero_KeyVisual-2.jpg';
import bg3 from '../../../assets/img/hero/Hero_KeyVisual-3.jpg';
import mbg1 from '../../../assets/img/hero/Mobile_KeyVisual-1.png';
import mbg2 from '../../../assets/img/hero/Mobile_KeyVisual-2.png';
import mbg3 from '../../../assets/img/hero/Mobile_KeyVisual-3.png';

const bgImages   = [bg1, bg2, bg3];
const mbgImages  = [mbg1, mbg2, mbg3];

function Hero({ onScrollDown, step, setStep, isActive }) {
  const isScrolling = useRef(false);
  const stepRef = useRef(step);

  useEffect(() => {
    stepRef.current = step;
  }, [step]);

  useEffect(() => {
    if (!isActive) return;

    const handleWheel = (e) => {
      e.preventDefault();
      if (isScrolling.current) return;

      if (e.deltaY > 0) {
        if (stepRef.current === 2) {
          onScrollDown?.();
          return;
        }
        isScrolling.current = true;
        setStep((prev) => Math.min(prev + 1, 2));
        setTimeout(() => { isScrolling.current = false; }, 800);
      } else {
        if (stepRef.current === 0) return;
        isScrolling.current = true;
        setStep((prev) => Math.max(prev - 1, 0));
        setTimeout(() => { isScrolling.current = false; }, 800);
      }
    };

    window.addEventListener('wheel', handleWheel, { passive: false });
    return () => window.removeEventListener('wheel', handleWheel);
  }, [isActive, onScrollDown, setStep]);

  return (
    // 260518 수정사항 : 메인 swiper로 변경 -> 슬라이드로
    <section className="flex justify-between max-sm:items-start sm:items-end max-sm:pt-[171px] sm:pt-[25.5vw] px-[5.2vw] pb-[5.2vw] min-h-screen relative overflow-hidden">

      {/* 데스크탑 배경 */}
      <div
        className="hidden sm:flex absolute inset-0"
        style={{
          width: `${bgImages.length * 100}vw`,
          transform: `translateX(-${step * 100}vw)`,
          transition: 'transform 0.85s cubic-bezier(0.77, 0, 0.175, 1)',
        }}
      >
        {bgImages.map((img, i) => (
          <div
            key={i}
            className="h-full bg-cover bg-center flex-shrink-0"
            style={{ width: '100vw', backgroundImage: `url(${img})` }}
          />
        ))}
      </div>

      {/* 모바일 배경 — 세로 슬라이드 */}
      <div
        className="sm:hidden absolute inset-0 flex flex-col"
        style={{
          height: `${mbgImages.length * 100}vh`,
          transform: `translateY(-${step * 100}vh)`,
          transition: 'transform 0.85s cubic-bezier(0.77, 0, 0.175, 1)',
        }}
      >
        {mbgImages.map((img, i) => (
          <div
            key={i}
            className="w-full flex-shrink-0 bg-cover bg-center"
            style={{ height: '100vh', backgroundImage: `url(${img})` }}
          />
        ))}
      </div>

      {/* 타이틀 */}
      <h1 className="font-archivo font-black text-[clamp(40px,5.2vw,100px)] leading-none relative z-[100]">
        <span className={`title-transition ${step >= 1 ? 'text-stroke-white' : 'text-fill-white'}`}>
          Mercedes-AMG
        </span><br />

        <span className={`title-transition ${step === 1 ? 'text-fill-mint' : 'text-stroke-mint'}`}>
          PETRONAS
        </span><br />

        <span className={`title-transition ${step === 2 ? 'text-fill-white' : 'text-stroke-white'}`}>
          Formula 1<br />Team
        </span>
      </h1>

      {/* 스크롤 다운 버튼 — 모바일 숨김 */}
      <div
        className="max-sm:hidden group flex flex-col items-center gap-[0.31vw] cursor-pointer relative z-[100]"
        onClick={onScrollDown}
      >
        <span className="font-pretendard font-medium text-[0.83vw] text-white leading-none tracking-[-0.01em] text-center transition-colors duration-300 group-hover:text-[#00F4D0]">
          SCROLL<br />DOWN
        </span>

        <div className="w-[2.6vw] h-[6.51vw]
          border-2 border-white rounded-[2.6vw]
          relative overflow-hidden
          transition-colors duration-[300ms] ease-out
          group-hover:border-transparent
          before:absolute before:inset-0
          before:bg-gradient-to-b before:from-[#00F4D0] before:to-[#008E79]
          before:scale-y-0 before:origin-top
          group-hover:before:scale-y-100
          before:transition-transform before:duration-[300ms] before:ease-out"
        >
          <div className="z-10 absolute w-full h-1/2 bg-white/50 rounded-[1.3vw] top-0 animate-pill transition-opacity duration-300 group-hover:opacity-0" />
          <img src={arrowDown} className="z-10 absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-[1.35vw] h-auto" alt="scroll down" />
        </div>
      </div>

    </section>
  );
}

export default Hero;
