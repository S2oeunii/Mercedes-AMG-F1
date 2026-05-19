import { useRef, useState } from 'react';
import Hero from './sections/Hero';
import TeamOverview from './sections/TeamOverview';
import Car from './sections/Car';
import Race from './sections/Race';
import Partners from './sections/Partners';

function Home() {
  const teamRef = useRef(null);
  const [heroStep, setHeroStep] = useState(0);

  const handleScrollToTeam = () => {
    teamRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <>
      <Hero
        onScrollDown={handleScrollToTeam}
        step={heroStep}
        setStep={setHeroStep}
      />
      <TeamOverview ref={teamRef} />
      <Car />
      <Race />
      <Partners />
    </>
  );
}

export default Home;
