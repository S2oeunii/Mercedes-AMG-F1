import React, { useEffect, useLayoutEffect, useRef, useState, useCallback } from 'react'
import bgPattern from '../../../assets/img/race/Bg.png';
import mobileBg from '../../../assets/img/race/Bg_Mobile.png';
import MoreView from '../../../components/buttons/MoreView';
import ArrowLeft from '../../../components/buttons/arrowLeft';
import ArrowRight from '../../../components/buttons/arrowRight';
import miami from '../../../assets/img/race/Miami.png';
import canada from '../../../assets/img/race/Canada.png';
import monaco from '../../../assets/img/race/Monaco.png';
import spain from '../../../assets/img/race/Spain.png';
import austria from '../../../assets/img/race/Austria.png';
import miamiHover from '../../../assets/img/race/Miami_Hover.png';
import canadaHover from '../../../assets/img/race/Canada_Hover.png';
import monacoHover from '../../../assets/img/race/Monaco_Hover.png';
import spainHover from '../../../assets/img/race/Spain_Hover.png';
import austriaHover from '../../../assets/img/race/Austria_Hover.png';

const CARDS = [
  { id: 0, image: miami,   hoverImage: miamiHover },
  { id: 1, image: canada,  hoverImage: canadaHover },
  { id: 2, image: monaco,  hoverImage: monacoHover },
  { id: 3, image: spain,   hoverImage: spainHover },
  { id: 4, image: austria, hoverImage: austriaHover },
];

const TOTAL   = CARDS.length;       // 5
const CLONES  = 2;                  // 양쪽 클론 수

// [Spain, Austria, Miami, Canada, Monaco, Spain, Austria, Miami, Canada] — 9개
const EXTENDED_CARDS = [
  ...CARDS.slice(-CLONES),
  ...CARDS,
  ...CARDS.slice(0, CLONES),
];
const EXT_TOTAL  = EXTENDED_CARDS.length;  // 9
const REAL_START = CLONES;                 // 2 (첫 번째 실제 카드 = Miami)
const REAL_END   = CLONES + TOTAL - 1;    // 6 (마지막 실제 카드 = Austria)

const CARD_VW = 15.63;
const GAP_VW  = 2.40;

function lerp(keys, t) {
  if (t <= keys[0][0]) return keys[0][1];
  for (let i = 1; i < keys.length; i++) {
    if (t <= keys[i][0]) {
      const [t0, v0] = keys[i - 1];
      const [t1, v1] = keys[i];
      return v0 + ((v1 - v0) * (t - t0)) / (t1 - t0);
    }
  }
  return keys[keys.length - 1][1];
}

const WIDTH_KEYS   = [[0, 15.63], [1, 16.41], [2, 18.85]];
const ROT_KEYS     = [[0, 0],    [1, 18],    [2, 32]];
const OPACITY_KEYS = [[0, 1.0], [1, 0.6], [2, 0.3], [3, 0.0]];

const GAP_OUTER_VW = 4.05;
const _p1    = WIDTH_KEYS[0][1] / 2 + GAP_VW       + WIDTH_KEYS[1][1] / 2;
const _p2    = _p1 + WIDTH_KEYS[1][1] / 2 + GAP_OUTER_VW + WIDTH_KEYS[2][1] / 2;
const _step  = _p2 - _p1;
const POS_KEYS_VW = [[0, 0], [1, _p1], [2, _p2], [3, _p2 + _step], [4, _p2 + _step * 2]];

// onComplete 콜백 추가 — 스프링 완료 후 무한루프 점프 처리
function springTo(posRef, target, onUpdate, onComplete) {
  let velocity = 0;
  const stiffness = 300;
  const damping   = 30;
  let rafId;

  const step = () => {
    const dt    = 1 / 60;
    const force = -stiffness * (posRef.current - target) + -damping * velocity;
    velocity   += force * dt;
    posRef.current += velocity * dt;

    onUpdate(posRef.current);

    if (Math.abs(posRef.current - target) > 0.0005 || Math.abs(velocity) > 0.0005) {
      rafId = requestAnimationFrame(step);
    } else {
      posRef.current = target;
      onUpdate(target);
      onComplete?.();
    }
  };
  rafId = requestAnimationFrame(step);
  return () => cancelAnimationFrame(rafId);
}

const Race = () => {
  // ── Desktop ──
  const posRef       = useRef(REAL_START);   // 2 = 첫 실제 카드(Miami)에서 시작
  const cancelAnim   = useRef(null);
  const itemRefs     = useRef([]);
  const cardRefs     = useRef([]);
  const wheelBlock   = useRef(false);
  const isDragging   = useRef(false);
  const dragStartX   = useRef(0);
  const dragStartPos = useRef(0);
  const trackRef     = useRef(null);

  // ── Mobile ──
  const [mobileIndex,       setMobileIndex]       = useState(REAL_START);
  const [mobileOffset,      setMobileOffset]       = useState(0);
  const [mobileDragOffset,  setMobileDragOffset]   = useState(0);
  const [isGrabbing,        setIsGrabbing]         = useState(false);
  const mobileListRef       = useRef(null);
  const mobileStartX        = useRef(0);
  const isMobileDragging    = useRef(false);
  const mobileDragOffsetRef = useRef(0);

  // ── Desktop: apply transforms ──
  const updateItems = useCallback((pos) => {
    const vw = window.innerWidth;
    itemRefs.current.forEach((el, i) => {
      if (!el) return;
      const offset    = i - pos;
      const absOffset = Math.abs(offset);

      const width   = lerp(WIDTH_KEYS, absOffset);
      const rotY    = -Math.sign(offset) * lerp(ROT_KEYS, absOffset);
      const opacity = lerp(OPACITY_KEYS, absOffset);
      const xPx     = Math.sign(offset) * lerp(POS_KEYS_VW, absOffset) * vw / 100;

      el.style.transform     = `translateX(calc(-50% + ${xPx}px)) translateY(-50%) rotateY(${rotY}deg)`;
      el.style.opacity       = String(opacity);
      el.style.zIndex        = String(100 - Math.round(absOffset * 10));
      el.style.pointerEvents = opacity < 0.01 ? 'none' : '';

      const cardEl = cardRefs.current[i];
      if (cardEl) {
        cardEl.style.width = `${width}vw`;
        cardEl.classList.toggle('group', Math.round(pos) === i);
      }
    });
  }, []);

  useEffect(() => {
    updateItems(posRef.current);
    const onResize = () => updateItems(posRef.current);
    window.addEventListener('resize', onResize);
    return () => window.removeEventListener('resize', onResize);
  }, [updateItems]);

  // 스프링 완료 후 클론 위치면 실제 위치로 점프 (데스크탑 무한루프)
  const doSnap = useCallback((target) => {
    const rounded = Math.round(target);
    const clamped = Math.max(0, Math.min(EXT_TOTAL - 1, rounded));
    cancelAnim.current?.();
    cancelAnim.current = springTo(posRef, clamped, updateItems, () => {
      const s = posRef.current;
      if (s < REAL_START) {
        posRef.current = s + TOTAL;
        updateItems(posRef.current);
      } else if (s > REAL_END) {
        posRef.current = s - TOTAL;
        updateItems(posRef.current);
      }
    });
  }, [updateItems]);

  // Desktop: wheel
  useEffect(() => {
    const el = trackRef.current;
    if (!el) return;
    const onWheel = (e) => {
      if (window.innerWidth < 640) return;
      e.preventDefault();
      if (wheelBlock.current) return;
      doSnap(Math.round(posRef.current) + (e.deltaY > 0 ? 1 : -1));
      wheelBlock.current = true;
      setTimeout(() => { wheelBlock.current = false; }, 650);
    };
    el.addEventListener('wheel', onWheel, { passive: false });
    return () => el.removeEventListener('wheel', onWheel);
  }, [doSnap]);

  // Desktop: mouse drag
  const onDesktopDown = (e) => {
    if (window.innerWidth < 640) return;
    cancelAnim.current?.();
    isDragging.current   = true;
    dragStartX.current   = e.clientX;
    dragStartPos.current = posRef.current;
  };
  const onDesktopMove = (e) => {
    if (!isDragging.current) return;
    const stepPx = POS_KEYS_VW[1][1] * window.innerWidth / 100;
    const dx     = e.clientX - dragStartX.current;
    const newPos = dragStartPos.current - dx / stepPx;
    posRef.current = Math.max(0, Math.min(EXT_TOTAL - 1, newPos));
    updateItems(posRef.current);
  };
  const onDesktopUp = () => {
    if (!isDragging.current) return;
    isDragging.current = false;
    doSnap(Math.round(posRef.current));
  };

  // Mobile: compute center offset (EXTENDED_CARDS 기준)
  useLayoutEffect(() => {
    const compute = () => {
      if (!mobileListRef.current || window.innerWidth >= 640) return;
      const cardW = 197, gap = 16;
      setMobileOffset(window.innerWidth / 2 - (mobileIndex * (cardW + gap) + cardW / 2));
    };
    compute();
    window.addEventListener('resize', compute);
    return () => window.removeEventListener('resize', compute);
  }, [mobileIndex]);

  // 모바일 무한루프: 클론 위치 정착 후 실제 위치로 순간 점프
  useEffect(() => {
    if (mobileIndex >= REAL_START && mobileIndex <= REAL_END) return;
    const realIdx = mobileIndex < REAL_START ? mobileIndex + TOTAL : mobileIndex - TOTAL;
    const timer = setTimeout(() => {
      setIsGrabbing(true);
      setMobileIndex(realIdx);
      requestAnimationFrame(() => requestAnimationFrame(() => setIsGrabbing(false)));
    }, 520);
    return () => clearTimeout(timer);
  }, [mobileIndex]);

  // Mobile: mouse drag
  const onMobileDown = (e) => {
    if (window.innerWidth >= 640) return;
    isMobileDragging.current    = true;
    mobileStartX.current        = e.clientX;
    mobileDragOffsetRef.current = 0;
    setIsGrabbing(true);
  };
  const onMobileMove = (e) => {
    if (!isMobileDragging.current) return;
    const cardW = 197, gap = 16, step = cardW + gap;
    const raw      = e.clientX - mobileStartX.current;
    const maxRight =  mobileIndex * step;
    const maxLeft  = -(EXT_TOTAL - 1 - mobileIndex) * step;
    const clamped  = Math.max(maxLeft, Math.min(maxRight, raw));
    mobileDragOffsetRef.current = clamped;
    setMobileDragOffset(clamped);
  };
  const onMobileUp = () => {
    if (!isMobileDragging.current) return;
    isMobileDragging.current = false;
    const cardW = 197, gap = 16;
    const shift = -mobileDragOffsetRef.current / (cardW + gap);
    const next  = Math.max(0, Math.min(EXT_TOTAL - 1, Math.round(mobileIndex + shift)));
    mobileDragOffsetRef.current = 0;
    setMobileDragOffset(0);
    setIsGrabbing(false);
    setMobileIndex(next);
  };

  return (
    <div className='bg-[linear-gradient(to_bottom,#000000db_0%,#00000033_100%)]
      sm:bg-[linear-gradient(to_bottom,#000000c7_0%,#00000033_100%)]
      relative py-25 lg:pt-[9.38vw] lg:pb-[10.42vw] px-6 sm:px-[14.58vw]
      w-full flex flex-col overflow-hidden'
    >
      <img src={bgPattern} className="absolute left-0 top-0 w-full h-auto hidden sm:block pointer-events-none" />
      <img src={mobileBg}  className="absolute left-0 top-0 w-full h-auto sm:hidden pointer-events-none" />

      <section className='relative z-10 flex flex-col h-full'>

        <span className="text-[#00F4D0]/70 font-pretendard font-semibold text-[clamp(14px,_1.35vw,_26px)] leading-none tracking-none">
          Upcoming Races
        </span>

        {/* 카드 영역 */}
        <div className='relative sm:h-[20.93vw] mt-15 mb-[45px] sm:mt-[6.41vw] sm:mb-[1.61vw] -mx-6 sm:mx-0'>
{/* 260520 수정사항 : 카드 불러와지는거 어색 => 해결 / 스크롤 이벤트 제거 */}
          {/* ── Desktop 3D carousel ── */}
          <div
            ref={trackRef}
            className='hidden sm:block absolute top-0 h-full cursor-grab active:cursor-grabbing select-none'
            style={{ left: 'calc(-14.58vw)', width: '100vw', perspective: '62.5vw' }}
            onMouseDown={onDesktopDown}
            onMouseMove={onDesktopMove}
            onMouseUp={onDesktopUp}
            onMouseLeave={onDesktopUp}
          >
            {EXTENDED_CARDS.map((card, i) => (
              <div
                key={i}
                ref={(el) => { itemRefs.current[i] = el; }}
                className='absolute left-1/2 top-1/2'
                style={{ willChange: 'transform, opacity' }}
              >
                <div
                  ref={(el) => { cardRefs.current[i] = el; }}
                  className='relative overflow-hidden'
                  style={{ width: `${CARD_VW}vw` }}
                >
                  <img src={card.image} alt="" className='w-full h-auto block pointer-events-none' draggable={false} />
                  <img
                    src={card.hoverImage} alt=""
                    className='absolute inset-0 w-full h-full object-cover pointer-events-none
                      translate-y-full group-hover:translate-y-0 transition-transform duration-500 ease-out'
                    draggable={false}
                  />
                </div>
              </div>
            ))}
          </div>

          {/* ── Mobile carousel ── */}
          <div
            ref={mobileListRef}
            className='sm:hidden w-full overflow-hidden cursor-grab active:cursor-grabbing'
            onMouseDown={onMobileDown}
            onMouseMove={onMobileMove}
            onMouseUp={onMobileUp}
            onMouseLeave={onMobileUp}
          >
            <div
              className='flex items-center gap-4'
              style={{
                transform:  `translateX(${mobileOffset + mobileDragOffset}px)`,
                transition: isGrabbing ? 'none' : 'transform 0.5s cubic-bezier(0.77, 0, 0.175, 1)',
                userSelect: 'none',
                willChange: 'transform',
              }}
            >
              {EXTENDED_CARDS.map((card, i) => {
                const dist  = Math.abs(i - mobileIndex);
                const scale = dist === 0 ? 1 : dist === 1 ? 0.87 : 0.77;
                return (
                  <div
                    key={i}
                    className={`flex-shrink-0 relative overflow-hidden w-[197px] h-[219px]
                      ${dist !== 0 ? 'opacity-40' : ''}`}
                    style={{
                      transform:       `scale(${scale})`,
                      transition:      'transform 0.5s cubic-bezier(0.77, 0, 0.175, 1), opacity 0.5s',
                      transformOrigin: 'center center',
                    }}
                  >
                    <img src={card.image} alt="" className='w-full h-auto block pointer-events-none' draggable={false} />
                  </div>
                );
              })}
            </div>
          </div>

          {/* Mobile arrows — 무한루프이므로 항상 활성 */}
          <div
            className='sm:hidden absolute left-6 top-1/2 -translate-y-1/2 z-20'
            onClick={() => setMobileIndex(i => Math.max(0, i - 1))}
          >
            <ArrowLeft />
          </div>
          <div
            className='sm:hidden absolute right-[39px] top-1/2 -translate-y-1/2 z-20'
            onClick={() => setMobileIndex(i => Math.min(EXT_TOTAL - 1, i + 1))}
          >
            <ArrowRight />
          </div>

        </div>

        <div className='flex justify-center'>
          <MoreView />
        </div>

      </section>
    </div>
  );
};

export default Race;
