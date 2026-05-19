import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay } from 'swiper/modules';
import 'swiper/css';

import arrowDown from '../../../assets/icons/arrowDown.svg';
import bg1 from '../../../assets/img/hero/Hero_KeyVisual-1.jpg';
import bg2 from '../../../assets/img/hero/Hero_KeyVisual-2.jpg';
import bg3 from '../../../assets/img/hero/Hero_KeyVisual-3.jpg';
import mbg1 from '../../../assets/img/hero/Mobile_KeyVisual-1.png';
import mbg2 from '../../../assets/img/hero/Mobile_KeyVisual-2.png';
import mbg3 from '../../../assets/img/hero/Mobile_KeyVisual-3.png';

const desktopBgs = [bg1, bg2, bg3];
const mobileBgs  = [mbg1, mbg2, mbg3];

const autoplayConfig = {
  delay: 1000,
  disableOnInteraction: false,
};

function Hero({ onScrollDown, step, setStep }) {
  return (
    // 260518 수정사항 : 메인 swiper로 변경 -> 슬라이드로
    <section className="flex justify-between max-sm:items-start sm:items-end max-sm:pt-[171px] sm:pt-[25.5vw] px-[5.2vw] pb-[5.2vw] min-h-screen relative overflow-hidden">

      {/* 데스크탑 — 가로 스와이퍼 */}
      <Swiper
        modules={[Autoplay]}
        direction="horizontal"
        autoplay={autoplayConfig}
        speed={850}
        loop={true}
        onSlideChange={(swiper) => setStep(swiper.realIndex)}
        className="!hidden sm:!block !absolute !inset-0 !w-full !h-full"
      >
        {desktopBgs.map((img, i) => (
          <SwiperSlide key={i} className="!w-full !h-full">
            <div className="absolute inset-0 bg-cover bg-center" style={{ backgroundImage: `url(${img})` }} />
          </SwiperSlide>
        ))}
      </Swiper>

      {/* 모바일 — 세로 스와이퍼 */}
      <Swiper
        modules={[Autoplay]}
        direction="vertical"
        autoplay={autoplayConfig}
        speed={850}
        loop={true}
        onSlideChange={(swiper) => setStep(swiper.realIndex)}
        className="sm:!hidden !absolute !inset-0 !w-full !h-full"
      >
        {mobileBgs.map((img, i) => (
          <SwiperSlide key={i} className="!w-full !h-full">
            <div className="absolute inset-0 bg-cover bg-center" style={{ backgroundImage: `url(${img})` }} />
          </SwiperSlide>
        ))}
      </Swiper>

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
