import React from 'react'

const images = [
    { src: './img/sub/per1.png', className: 'w-[12.14vw] sm:w-[139px]' },
    { src: './img/sub/per2.png', className: 'w-[12.50vw] sm:w-[144px]' },
    { src: './img/sub/per3.png', className: 'w-[11.61vw] sm:w-[133px]' },
    { src: './img/sub/per4.png', className: 'w-[14.38vw] sm:w-[171px]' },
    { src: './img/sub/per5.png', className: 'w-[11.82vw] sm:w-[136px]' },
    { src: './img/sub/per6.png', className: 'w-[12.50vw] sm:w-[144px]' },
    { src: './img/sub/per7.png', className: 'w-[13.54vw] sm:w-[157px]' },
    { src: './img/sub/per8.png', className: 'w-[17.50vw] sm:w-[201px]' },
]

const Performance = () => {
  return (
    <div className='flex flex-col gap-20 sm:gap-[9.95vw] px-6 py-25 sm:px-[14.58vw] sm:pt-[9.38vw] sm:pb-[10.42vw] overflow-hidden'>
      <div className='flex flex-col gap-[28px] sm:gap-[5.21vw] w-full text-left items-start'>
        <span className='text-[#00F4D0] text-[14px] sm:text-[1.35vw] font-pretendard font-semibold leading-none tracking-none'>
          All in Performance
        </span>
        <p className='text-[#C0C7CE] text-[12px] sm:text-[1.35vw] font-pretendard font-light leading-[1.5] tracking-tight'>
          메르세데스 팀은 'All in Performance'라는 철학 아래 운영되는 조직입니다.<br />
          모든 구성원은 최고의 결과를 목표로 각자의 역할에 집중하고 있습니다.<br />
          전문성과 협업을 기반으로 지속적인 발전을 이루며,<br />
          변화와 도전을 통해 새로운 기준을 만들어가고 있습니다.
        </p>
      </div>

{/* 
  260520
  이미지 중간에 끊기지 않게
*/}

      {/* imgContainer: 부모 padding을 음수 마진으로 탈출, overflow-hidden으로 뷰포트 클리핑 */}
      <div className='imgContainer -mx-6 sm:-mx-[14.58vw] overflow-hidden'>
        {/* 이미지를 2벌 렌더링 → translateX(-50%)로 원본 1벌 너비만큼 이동 → 무한 루프 */}
        <div className='flex gap-3 sm:gap-[1.04vw] pr-3 sm:pr-[1.04vw] items-end w-max animate-marquee will-change-transform'>
          {[...images, ...images].map(({ src, className }, i) => (
            <img key={i} src={src} className={`${className} h-auto shrink-0`} alt='' draggable='false' />
          ))}
        </div>
      </div>
    </div>
  )
}

export default Performance
