import React, { useRef, useState, useCallback, useEffect } from 'react'
import MoreView from '../../../components/buttons/MoreView'

const data = [
  { title: ["Constructors'", 'Championships'], count: '8',   img: './img/sub/constructors.png' },
  { title: ["Drivers'",      'Championships'], count: '9',   img: './img/sub/drivers.png'      },
  { title: ['Wins',          null            ], count: '133', img: './img/sub/wins.png'         },
]

const Legacy = () => {
  const ulRef        = useRef(null)
  const thumbRef     = useRef(null)
  const isDragging   = useRef(false)
  const dragStartX   = useRef(0)
  const dragScroll   = useRef(0)
  const targetScroll = useRef(0)
  const rafId        = useRef(null)
  const [activeIndex, setActiveIndex] = useState(0)

  const updateThumb = useCallback(() => {
    const ul    = ulRef.current
    const thumb = thumbRef.current
    if (!ul || !thumb) return
    const track       = thumb.parentElement
    const trackWidth  = track.clientWidth
    const ratio       = ul.clientWidth / ul.scrollWidth
    const thumbWidth  = Math.max(trackWidth * ratio, 20)
    const scrollable  = ul.scrollWidth - ul.clientWidth
    const scrollRatio = scrollable > 0 ? ul.scrollLeft / scrollable : 0
    thumb.style.width = `${thumbWidth}px`
    thumb.style.left  = `${scrollRatio * (trackWidth - thumbWidth)}px`
  }, [])

  const handleScroll = useCallback(() => {
    const ul = ulRef.current
    if (!ul) return
    const lis = ul.querySelectorAll('li')
    if (lis.length < 2) return
    const step = Math.abs(
      lis[1].getBoundingClientRect().left - lis[0].getBoundingClientRect().left
    )
    if (!step) return
    setActiveIndex(
      Math.min(Math.max(Math.round(ul.scrollLeft / step), 0), data.length - 1)
    )
    updateThumb()
  }, [updateThumb])

  /* ── 스크롤 이벤트 ── */
  useEffect(() => {
    const ul = ulRef.current
    if (!ul) return
    ul.addEventListener('scroll', handleScroll, { passive: true })
    updateThumb()
    return () => ul.removeEventListener('scroll', handleScroll)
  }, [handleScroll, updateThumb])

  /* ── 마우스 드래그 + 휠 가로 스크롤 ── */
  useEffect(() => {
    const ul = ulRef.current
    if (!ul) return

    const onMouseDown = (e) => {
      isDragging.current = true
      dragStartX.current = e.clientX
      dragScroll.current = ul.scrollLeft
      ul.style.cursor = 'grabbing'
      ul.style.scrollSnapType = 'none'
      document.body.style.userSelect = 'none'
    }

    const onMouseMove = (e) => {
      if (!isDragging.current) return
      ul.scrollLeft = dragScroll.current - (e.clientX - dragStartX.current)
    }

    const onMouseUp = () => {
      if (!isDragging.current) return
      isDragging.current = false
      ul.style.cursor = ''
      ul.style.scrollSnapType = ''
      document.body.style.userSelect = ''
    }

    // 세로 휠 → 부드러운 가로 스크롤 (RAF lerp)
    const animateScroll = () => {
      const diff = targetScroll.current - ul.scrollLeft
      if (Math.abs(diff) < 0.5) {
        ul.scrollLeft = targetScroll.current
        rafId.current = null
        return
      }
      ul.scrollLeft += diff * 0.1
      rafId.current = requestAnimationFrame(animateScroll)
    }

    const onWheel = (e) => {
      if (Math.abs(e.deltaY) <= Math.abs(e.deltaX)) return
      e.preventDefault()
      const max = ul.scrollWidth - ul.clientWidth
      targetScroll.current = Math.max(0, Math.min(max, targetScroll.current + e.deltaY * 1.5))
      if (!rafId.current) rafId.current = requestAnimationFrame(animateScroll)
    }

    ul.addEventListener('mousedown', onMouseDown)
    document.addEventListener('mousemove', onMouseMove)
    document.addEventListener('mouseup', onMouseUp)
    ul.addEventListener('wheel', onWheel, { passive: false })

    return () => {
      ul.removeEventListener('mousedown', onMouseDown)
      document.removeEventListener('mousemove', onMouseMove)
      document.removeEventListener('mouseup', onMouseUp)
      ul.removeEventListener('wheel', onWheel)
      if (rafId.current) cancelAnimationFrame(rafId.current)
    }
  }, [])

  /* ── 모바일 커스텀 스크롤바 썸 드래그 ── */
  const handleThumbMouseDown = useCallback((e) => {
    e.preventDefault()
    const ul    = ulRef.current
    const thumb = thumbRef.current
    if (!ul || !thumb) return

    const startX          = e.clientX
    const startScrollLeft = ul.scrollLeft

    const onMove = (moveEvent) => {
      const trackWidth = thumb.parentElement.clientWidth
      const thumbWidth = parseFloat(thumb.style.width) || 0
      const scrollable = ul.scrollWidth - ul.clientWidth
      ul.scrollLeft = startScrollLeft + ((moveEvent.clientX - startX) / (trackWidth - thumbWidth)) * scrollable
    }
    const onUp = () => {
      document.removeEventListener('mousemove', onMove)
      document.removeEventListener('mouseup', onUp)
    }
    document.addEventListener('mousemove', onMove)
    document.addEventListener('mouseup', onUp)
  }, [])

  const { title, count } = data[activeIndex]

  return (
    <div className='flex flex-col px-6 py-25 sm:px-[14.58vw] sm:pt-[9.38vw] sm:pb-[10.42vw] overflow-hidden'>

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

{/* 260518 수정사항 : 스크롤에 따라 다음으로 이동하도록 */}
      {/* 중단: ulDesc + ul */}
      <div className='flex flex-col-reverse sm:flex-row gap-[28px] sm:gap-[5.47vw] sm:items-end
          mt-20 sm:mt-[8.75vw] sm:mb-[6.56vw] sm:ml-[9.38vw]'>

        {/* ulDesc */}
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

        {/* ul + 모바일 커스텀 스크롤바 */}
        <div className='flex flex-col flex-1 min-w-0'>
          <ul
            ref={ulRef}
            className='flex gap-5 sm:gap-[2.08vw] sm:pr-[8.59vw]
              overflow-x-auto scrollbar-hide snap-x snap-mandatory cursor-grab'
          >
            {data.map(({ img }, i) => (
              <li key={i} className='w-[345px] sm:w-[34.90vw] shrink-0 snap-start'>
                <img className='w-full h-auto pointer-events-none' src={img} alt='' draggable='false' />
              </li>
            ))}
          </ul>

          {/* 모바일 전용 커스텀 스크롤바 */}
          <div className='sm:hidden mt-[50px] relative h-[5px] rounded-full bg-white/30'>
            <div
              ref={thumbRef}
              onMouseDown={handleThumbMouseDown}
              className='absolute top-0 h-full rounded-full cursor-pointer'
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
