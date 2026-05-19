import { Link } from 'react-router-dom';
import Logo from '../../assets/logo/header-logo.svg';
import NavIcon from '../../assets/icons/nav.svg';

const navItems = [
  { label: 'TEAM',     to: '/team', reload: true },
  { label: 'CAR',      to: '/team', reload: true },
  { label: 'RACE',     to: '/team', reload: true },
  { label: 'PARTNERS', to: '/team', reload: true },
];

const Header = ({ menuOpen: isOpen, setMenuOpen: setIsOpen }) => {

  return (
    <>
      <header className="fixed top-0 left-0 w-full z-[999] flex flex-col">
        <div className="sm:hidden h-[44px] w-full" />
        <div className="px-[24px] py-[17px] sm:px-[5.21vw] sm:py-[1.04vw] flex justify-between items-center">
          <a href="/">
            <img className="w-[101px] lg:w-[160px] h-auto" src={Logo} alt="Mercedes-Benz Logo" />
          </a>

          {/* 데스크탑 nav */}
          <ul className="hidden sm:flex gap-[2.6vw] font-archivo font-semibold text-[24px] leading-none tracking-[-0.01em]">
            {navItems.map(({ label, to, reload }) => (
              <li
                key={label}
                className="list-none py-[0.1vw] relative
                  after:content-[''] after:absolute after:left-0 after:bottom-[-0.1vw]
                  after:w-0 after:h-[3px]
                  after:bg-gradient-to-r after:from-[#00F4D0] after:to-[#C0C7CE]
                  after:transition-[width] after:duration-300 after:ease-out
                  hover:after:w-full"
              >
                {reload
                  ? <a href={to} className="text-white">{label}</a>
                  : <Link to={to} className="text-white">{label}</Link>
                }
              </li>
            ))}
          </ul>

          {/* 모바일 햄버거 버튼 */}
          <button
            className="sm:hidden cursor-pointer"
            onClick={() => setIsOpen(true)}
            aria-label="메뉴 열기"
          >
            <img src={NavIcon} style={{ width: '24px', height: '15px' }} alt="nav" />
          </button>
        </div>
      </header>

      {/* 풀스크린 팝업 */}
      {isOpen && (
        <div className="fixed inset-0 z-[1000] bg-black flex flex-col items-center justify-center">
          <button
            className="absolute top-[1.5rem] right-[5.21vw] text-white text-[32px] leading-none cursor-pointer"
            onClick={() => setIsOpen(false)}
            aria-label="메뉴 닫기"
          >
            ✕
          </button>

          <ul className="flex flex-col items-start gap-10 px-[5.21vw] w-full">
            {navItems.map(({ label, to, reload }) => (
              <li key={label} className="list-none">
                {reload ? (
                  <a
                    href={to}
                    className="popup-nav-link text-[#00F4D0] sm:text-white font-archivo font-semibold text-[40px] leading-none tracking-[-0.01em]
                      relative transition-colors duration-300
                      after:content-[''] after:absolute after:left-0 after:bottom-[-0.3rem]
                      after:w-0 after:h-[3px]
                      after:bg-gradient-to-r after:from-[#00F4D0] after:to-[#C0C7CE]
                      after:transition-[width] after:duration-300 after:ease-out
                      sm:hover:after:w-full"
                  >
                    {label}
                  </a>
                ) : (
                  <Link
                    to={to}
                    className="popup-nav-link text-[#00F4D0] sm:text-white font-archivo font-semibold text-[40px] leading-none tracking-[-0.01em]
                      relative transition-colors duration-300
                      after:content-[''] after:absolute after:left-0 after:bottom-[-0.3rem]
                      after:w-0 after:h-[3px]
                      after:bg-gradient-to-r after:from-[#00F4D0] after:to-[#C0C7CE]
                      after:transition-[width] after:duration-300 after:ease-out
                      sm:hover:after:w-full"
                    onClick={() => setIsOpen(false)}
                  >
                    {label}
                  </Link>
                )}
              </li>
            ))}
          </ul>
        </div>
      )}
    </>
  );
};

export default Header;
