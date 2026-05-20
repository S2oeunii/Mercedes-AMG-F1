import React, { useRef, useState, useCallback, useEffect } from 'react'
import { Swiper, SwiperSlide } from 'swiper/react'
import 'swiper/css'
import MoreView from '../../../components/buttons/MoreView'

const data = [
  { title: ["Constructors'", 'Championships'], count: '8',   img: './img/sub/constructors.png' },
  { title: ["Drivers'",      'Championships'], count: '9',   img: './img/sub/drivers.png'      },
  { title: ['Wins',          null            ], count: '133', img: './img/sub/wins.png'         },
]

// 데스크탑 이미지 너비(vw) + 갭(vw) = 한 스텝 이동량
const STEP_VW = 34.90 + 2.08

const Legacy = () => {
  const sectionRef      = useRef(null)
  const thumbRef        = useRef(null)
  const mobileSwiperRef = useRef(null)
  const isScrolling     = useRef(false)
  const activeIndexRef  = useRef(0)
  const isDragging      = useRef(false)
  const dragStartX      = useRef(0)
  const [activeIndex, setActiveIndex] = useState(0)
  const [dragOffset,  setDragOffset]  = useState(0)
  const [isGrabbing,  setIsGrabbing]  = useState(false)

  useEffect(() => {
    activeIndexRef.current = activeIndex
  }, [activeIndex])

  /* ── 휠 → 단계별 이동
       섹션 중앙이 뷰포트 안에 있을 때만 캡처.
       getBoundingClientRect()로 매 이벤트마다 직접 계산 → IntersectionObserver 타이밍 이슈 없음 ── */
  useEffect(() => {
    const handleWheel = (e) => {
      const section = sectionRef.current
      if (!section) return

      const { top, bottom } = section.getBoundingClientRect()
      const center = (top + bottom) / 2
      if (center < 0 || center > window.innerHeight) return

      // 수평 스크롤은 무시
      if (Math.abs(e.deltaY) <= Math.abs(e.deltaX)) return

      const idx = activeIndexRef.current

      // 첫/마지막 아이템 경계에서 페이지 스크롤 통과
      if (e.deltaY > 0 && idx >= data.length - 1) return
      if (e.deltaY < 0 && idx <= 0) return

      e.preventDefault()
      if (isScrolling.current) return
      isScrolling.current = true

      const newIndex = e.deltaY > 0
        ? Math.min(activeIndexRef.current + 1, data.length - 1)
        : Math.max(activeIndexRef.current - 1, 0)

      setActiveIndex(newIndex)
      mobileSwiperRef.current?.slideTo(newIndex)
      // CSS transition(0.75s)과 동일한 타이밍으로 잠금 해제
      setTimeout(() => { isScrolling.current = false }, 750)
    }

    window.addEventListener('wheel', handleWheel, { passive: false })
    return () => window.removeEventListener('wheel', handleWheel)
  }, [])

  /* ── 모바일 커스텀 스크롤바 썸 위치 업데이트 ── */
  const updateThumb = useCallback((index) => {
    const thumb = thumbRef.current
    if (!thumb?.parentElement) return
    const trackWidth = thumb.parentElement.clientWidth
    const thumbWidth = trackWidth / data.length
    const maxLeft    = trackWidth - thumbWidth
    thumb.style.width = `${thumbWidth}px`
    thumb.style.left  = index === 0 ? '0px' : `${(index / (data.length - 1)) * maxLeft}px`
  }, [])

  useEffect(() => { updateThumb(activeIndex) }, [activeIndex, updateThumb])

  /* ── 데스크탑 이미지 드래그 ── */
  const handleDesktopMouseDown = useCallback((e) => {
    isDragging.current = true
    dragStartX.current = e.clientX
    document.body.style.userSelect = 'none'
    setIsGrabbing(true)

    const onMove = (ev) => {
      if (!isDragging.current) return
      setDragOffset(ev.clientX - dragStartX.current)
    }
    const onUp = (ev) => {
      if (!isDragging.current) return
      isDragging.current = false
      document.body.style.userSelect = ''
      document.removeEventListener('mousemove', onMove)
      document.removeEventListener('mouseup', onUp)
      setIsGrabbing(false)

      const delta = ev.clientX - dragStartX.current
      if (delta < -50) {
        setActiveIndex(prev => Math.min(prev + 1, data.length - 1))
      } else if (delta > 50) {
        setActiveIndex(prev => Math.max(prev - 1, 0))
      }
      setDragOffset(0)
    }

    document.addEventListener('mousemove', onMove)
    document.addEventListener('mouseup', onUp)
  }, [])

  /* ── 모바일 썸 드래그 (pointer events로 터치/마우스 통합) ── */
  const handleThumbPointerDown = useCallback((e) => {
    e.preventDefault()
    const thumb = thumbRef.current
    if (!thumb) return

    thumb.setPointerCapture(e.pointerId)

    const startX     = e.clientX
    const startLeft  = parseFloat(thumb.style.left) || 0
    const trackWidth = thumb.parentElement.clientWidth
    const thumbWidth = parseFloat(thumb.style.width) || 0

    const onMove = (ev) => {
      const newLeft  = Math.max(0, Math.min(trackWidth - thumbWidth, startLeft + ev.clientX - startX))
      thumb.style.left = `${newLeft}px`
      const ratio    = thumbWidth < trackWidth ? newLeft / (trackWidth - thumbWidth) : 0
      const newIndex = Math.round(ratio * (data.length - 1))
      mobileSwiperRef.current?.slideTo(newIndex)
    }
    const onUp = () => {
      thumb.removeEventListener('pointermove', onMove)
      thumb.removeEventListener('pointerup', onUp)
    }

    thumb.addEventListener('pointermove', onMove)
    thumb.addEventListener('pointerup', onUp)
  }, [])

  const { title, count } = data[activeIndex]

  return (
    <div
      ref={sectionRef}
      className='flex flex-col px-6 py-25 sm:px-[14.58vw] sm:pt-[9.38vw] sm:pb-[10.42vw] overflow-hidden'
    >

      {/* 상단 텍스트 */}
      <div className='flex flex-col gap-[28px] sm:gap-[5.21vw] w-full text-left items-start'>
        <span className='text-[#00F4D0] text-[14px] sm:text-[1.35vw] font-pretendard font-semibold leading-none tracking-none'>
          Built to Win
        </span>
        <p className='text-[#C0C7CE] text-[12px] sm:text-[1.35vw] font-pretendard font-light leading-[1.5] tracking-tight'>
          메르세데스는 Formula 1 역사에서 <br className='sm:hidden' />가장 뛰어난 성과를 기록한 팀 중 하나입니다.<br />
          다수의 챔피언십과 우승 기록은 팀의 기술력과 운영 역량을 보여줍니다.<br />
          지속적으로 축적된 성과는 현재의 경쟁력을 유지하는 중요한 기반입니다.
        </p>
      </div>

{/* 
  260520 수정사항
  swiper로 할거면 -> 스크롤 제거
  스크롤 이벤트로 스크롤 프로그레스 0.4이상일때 다음 사진과 숫자로 변경
  0.8일때 그 다음 사진과 숫자로 변경
*/}
      {/* 중단 */}
      <div className='flex flex-col-reverse sm:flex-row gap-[28px] sm:gap-[5.47vw] sm:items-end
          mt-20 sm:mt-[8.75vw] sm:mb-[6.56vw] sm:ml-[9.38vw]'>

        {/* 타이틀 + 카운트 */}
        <div className='w-full sm:w-auto shrink-0 flex sm:flex-col sm:gap-[1.56vw]
            justify-between sm:justify-center items-start
            text-white hover:text-[#00F4D0] font-archivo font-light tracking-none
            transition-colors duration-300 cursor-default'>
          <div className='sm:w-[12.50vw] flex flex-col gap-[10px] sm:gap-[1.04vw]'>
            <p key={activeIndex} className='text-[14px] sm:text-[1.04vw] leading-[1.25] animate-fade-in'>
              {title[0]}{title[1] && <><br />{title[1]}</>}
            </p>
            <div className='bg-white/30 w-[74px] sm:w-[4.95vw] h-[1px]'></div>
          </div>
          <p key={`count-${activeIndex}`} className='text-[100px] sm:text-[7.60vw] leading-none animate-fade-in'>
            {count}
          </p>
        </div>

        {/* ── 데스크탑: CSS transform 슬라이더 + 마우스 드래그 ── */}
        <div
          className='hidden sm:block flex-1 min-w-0 overflow-hidden cursor-grab active:cursor-grabbing select-none'
          onMouseDown={handleDesktopMouseDown}
        >
          <div
            className='flex gap-[2.08vw]'
            style={{
              transform: `translateX(calc(${-activeIndex} * ${STEP_VW}vw + ${dragOffset}px))`,
              transition: isGrabbing ? 'none' : 'transform 0.75s cubic-bezier(0.77, 0, 0.175, 1)',
            }}
          >
            {data.map(({ img }, i) => (
              <div key={i} className='w-[34.90vw] shrink-0'>
                <img className='w-full h-auto pointer-events-none' src={img} alt='' draggable='false' />
              </div>
            ))}
          </div>
        </div>

        {/* ── 모바일: Swiper + 커스텀 스크롤바 ── */}
        <div className='sm:hidden flex flex-col flex-1 min-w-0 gap-[50px]'>
          <Swiper
            loop={false}
            onSwiper={(swiper) => {
              mobileSwiperRef.current = swiper
              updateThumb(0)
            }}
            onSlideChange={(swiper) => {
              setActiveIndex(swiper.activeIndex)
              updateThumb(swiper.activeIndex)
            }}
            className='w-full'
          >
            {data.map(({ img }, i) => (
              <SwiperSlide key={i}>
                <img className='w-full h-auto pointer-events-none' src={img} alt='' draggable='false' />
              </SwiperSlide>
            ))}
          </Swiper>

          {/* 커스텀 스크롤바 */}
          <div className='relative h-[5px] rounded-full bg-white/30'>
            <div
              ref={thumbRef}
              onPointerDown={handleThumbPointerDown}
              className='absolute top-0 h-full rounded-full cursor-pointer touch-none'
              style={{
                background: 'linear-gradient(to right, #008E79 0%, #00F4D0 50%, #008E79 100%)',
                width: '0px',
                left: '0px',
              }}
            />
          </div>
        </div>

      </div>

      {/* MORE VIEW */}
      <div className='w-full hidden sm:flex items-center justify-center'>
        <MoreView />
      </div>
    </div>
  )
}

export default Legacy
