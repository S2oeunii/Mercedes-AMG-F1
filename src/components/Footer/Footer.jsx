import React from 'react'
import Logo from '../../assets/logo/footer-logo.svg';
import MobileLogo from '../../assets/logo/footer-logo_mobile.svg';

const Footer = () => {
  return (
    <>
      <footer>
        <div className='hidden sm:flex flex-col w-full items-center justify-center gap-[2.71vw]
          bg-black py-[7.81vw] px-[14.58vw]'
        >
          <img className="w-[70.83vw] h-auto" src={Logo} alt="logo" />
          <div className='bg-[#C0C7CE] w-full h-[0.10vw]'></div>
          <div className='flex w-full items-center justify-between'>
            <div className='flex flex-col gap-[1.15vw]'>
              <p className='text-white/70 text-[1.15vw] font-pretendard font-light leading-tight tracking-none'>
                <span className='font-medium text-white text-[1.35vw]'>Follow Us</span><br />
                Visit our official social media channels
              </p>

              <div className='flex gap-[2.60vw] items-center justify-center'>
                <img className='h-[1.61vw] w-auto' src='./icons/facebook.svg' alt='facebook' />
                <img className='h-[1.61vw] w-auto' src='./icons/instagram.svg' alt='instagram' />
                <img className='h-[1.27vw] w-auto' src='./icons/x.svg' alt='x' />
                <img className='h-[1.12vw] w-auto' src='./icons/youtube.svg' alt='youtube' />
                <img className='h-[1.45vw] w-auto' src='./icons/tiktok.svg' alt='tiktok' />
              </div>
            </div>
            <div className='flex flex-col gap-[0.89vw] text-right text-[1.15vw] font-pretendard leading-normal'>
              <p className='text-white font-semibold tracking-tight'>
                미디어 센터 | 메르세데스-벤츠 아카이브 | 쿠키 정책 | 개인정보 처리방침 | 이용 약관
              </p>
              <p className='text-white/70 font-light tracking-none'>
                ©2026 Mercedes-Benz Grand Prix Ltd. All rights reserved.
              </p>
            </div>
          </div>
        </div>

        <div className='sm:hidden flex flex-col w-full items-center justify-center gap-[50px]
          bg-black py-[60px] px-[24px]'
        >
          <div className='flex flex-col gap-[28px] w-[345px]'>
            <img className="w-full h-auto" src={MobileLogo} alt="logo" />
            <div className='bg-[#C0C7CE] w-full h-[0.5px]'></div>
          </div>
          
          <div className='flex flex-col gap-[34px] w-[345px] items-center justify-center'>
            <div className='flex flex-col gap-[15px]'>
              <div className='flex w-[271px] justify-between font-pretendard leading-normal tracking-none'>
                <p className='font-medium text-white text-[14px]'>
                  Follow Us 
                </p>
                <p className='font-light text-white/70 text-[12px]'>
                  Visit our official social media channels
                </p>
              </div>
              <div className='flex gap-[38px] items-center justify-center'>
                <img className='h-[30px] w-auto' src='./icons/facebook.svg' alt='facebook' />
                <img className='h-[27px] w-auto' src='./icons/instagram.svg' alt='instagram' />
                <img className='h-[24px] w-auto' src='./icons/x.svg' alt='x' />
                <img className='h-[20px] w-auto' src='./icons/youtube.svg' alt='youtube' />
                <img className='h-[27px] w-auto' src='./icons/tiktok.svg' alt='tiktok' />
              </div>
            </div>

            <div className='flex flex-col gap-[8px] items-center justify-center font-pretendard font-light leading-normal'>
              <p className='text-white text-center sm:text-right text-[14px] tracking-tight'>
                미디어 센터 | 메르세데스-벤츠 아카이브<br />
                쿠키 정책 | 개인정보 처리방침 | 이용 약관
              </p>
              <p className='text-white/70 text-[12px] tracking-none'>
                ©2026 Mercedes-Benz Grand Prix Ltd. All rights reserved.
              </p>
            </div>
          </div>
        </div>
      </footer>
    </>
  )
}

export default Footer