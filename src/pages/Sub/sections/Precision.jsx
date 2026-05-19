import React from 'react'
import { motion } from 'framer-motion'
import historyLine from '../../../assets/icons/historyLine.svg'

// ESLint no-unused-vars 오탐 방지
const MotionDiv = motion.div

// power3.out cubic-bezier 근사값
const EASE = [0.215, 0.61, 0.355, 1]

const slideVariants = (fromX) => ({
  hidden:  { opacity: 0, x: fromX },
  visible: { opacity: 1, x: 0, transition: { duration: 1.4, ease: EASE } },
})

const viewportConfig = { once: false, amount: 0.15 }

const Precision = () => (
  <div className='overflow-x-hidden'>
    <div
      className='relative flex flex-col gap-[140px] items-center justify-center
          px-6 py-25 sm:px-[18.23vw] sm:pt-[9.38vw] sm:pb-[10.42vw]
          sm:min-h-[110vw]'
    >
      <img src={historyLine} alt='' className='hidden sm:block w-[1.56vw] h-auto' />

      {/* 1954 — 우측에서 슬라이드인 */}
      <MotionDiv
        variants={slideVariants(120)}
        initial='hidden'
        whileInView='visible'
        viewport={viewportConfig}
        className='sm:absolute sm:top-[13.85vw] sm:left-[16.30vw]
            w-full sm:w-auto items-end flex flex-col gap-[22px] sm:gap-[1.46vw]'
      >
        <img className='w-[289px] sm:w-[27.19vw] h-auto' src='/img/sub/precision_1.png' alt='' />
        <div className='flex flex-col gap-[26px] sm:gap-[2.34vw]'>
          <div className='flex flex-col gap-[10px] sm:gap-[0.83vw] items-end'>
            <h3 className='text-[#00F4D0] text-[32px] sm:text-[2.50vw] font-archivo font-semibold leading-none tracking-none'>1954</h3>
            <div className='w-[280px] sm:w-[20.63vw] h-[1px] bg-white/50'></div>
          </div>
          <p className='text-right text-white/70 text-[14px] sm:text-[1.15vw] font-pretendard font-regular leading-[1.25] tracking-[-0.025em]'>
            메르세데스-벤츠 워크스 팀<br />
            정교한 엔지니어링을 기반으로 Formula 1 데뷔
          </p>
        </div>
      </MotionDiv>

      {/* 1968 — 좌측에서 슬라이드인 */}
      <MotionDiv
        variants={slideVariants(-120)}
        initial='hidden'
        whileInView='visible'
        viewport={viewportConfig}
        className='sm:absolute sm:top-[38.85vw] sm:right-[21.15vw]
            w-full sm:w-auto items-start flex flex-col gap-[22px] sm:gap-[1.46vw]'
      >
        <img className='w-[277px] sm:w-[22.34vw] h-auto' src='/img/sub/precision_2.png' alt='' />
        <div className='flex flex-col gap-[26px] sm:gap-[2.34vw]'>
          <div className='flex flex-col gap-[10px] sm:gap-[0.83vw] items-start'>
            <h3 className='text-[#00F4D0] text-[32px] sm:text-[2.50vw] font-archivo font-semibold leading-none tracking-none'>1968</h3>
            <div className='w-[280px] sm:w-[20.63vw] h-[1px] bg-white/50'></div>
          </div>
          <p className='text-left text-white/70 text-[14px] sm:text-[1.15vw] font-pretendard font-regular leading-[1.25] tracking-[-0.025em]'>
            팀의 전신인 마트라 인터내셔널의 창단 연도<br />
            모터스포츠 기술과 운영의 기반이 되는 조직 형성
          </p>
        </div>
      </MotionDiv>

      {/* 2010 ~ Present — 우측에서 슬라이드인 */}
      <MotionDiv
        variants={slideVariants(120)}
        initial='hidden'
        whileInView='visible'
        viewport={viewportConfig}
        className='sm:absolute sm:top-[77.29vw] sm:left-[20.10vw]
            w-full sm:w-auto items-end flex flex-col gap-[22px] sm:gap-[1.46vw]'
      >
        <img className='w-[289px] sm:w-[23.39vw] h-auto' src='/img/sub/precision_3.png' alt='' />
        <div className='flex flex-col gap-[26px] sm:gap-[2.34vw]'>
          <div className='flex flex-col gap-[10px] sm:gap-[0.83vw] items-end'>
            <h3 className='text-[#00F4D0] text-[32px] sm:text-[2.50vw] font-archivo font-semibold leading-none tracking-none'>2010 ~ Present</h3>
            <div className='w-[280px] sm:w-[20.63vw] h-[1px] bg-white/50'></div>
          </div>
          <p className='text-right text-white/70 text-[14px] sm:text-[1.15vw] font-pretendard font-regular leading-[1.25] tracking-[-0.025em]'>
            현대적인 Formula 1 팀으로 재출범<br />
            데이터 기반 전략과 기술 혁신을 통해 경쟁력을<br className='hidden sm:flex' />
            지속적으로 강화
          </p>
        </div>
      </MotionDiv>
    </div>
  </div>
)

export default Precision
