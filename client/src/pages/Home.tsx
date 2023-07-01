import React, { useState } from 'react';
import { useTheme } from '../utils/ThemeContext';
import { useNavigate } from 'react-router-dom';

function Home() {
    const { theme } = useTheme();
    const navigate = useNavigate();

    const getStartedHandler = () => navigate('/account/new');

    const logInHandler = () => navigate('/login');

    return (
        <main className="mt-44 h-screen">
            <section id="hero" className={`bg-${theme}-accent lg:p-1`}>
                <div className="w-full lg:hidden">
                    <img className="w-full lg:hidden" src={theme === 'fantasy' ? '../../public/dragon.png' : '../../public/space-battle.png'} alt={theme === 'fantasy' ? '3 adventurers facing a large, menacing, red dragon, framed by a stone archway' : 'several spaceships shooting lasers at each other in orbit of a blue planet with nearby explosions'} />
                    <button onClick={getStartedHandler} className={`fixed top-[65%] left-[7%] w-[40%] border-${theme}-accent border-[3px] rounded-2xl bg-${theme}-primary text-${theme}-accent font-${theme}-text`}>Get Started</button>
                    <button onClick={logInHandler} className={`fixed top-[65%] left-[53%] w-[40%] border-${theme}-accent border-[3px] rounded-2xl bg-${theme}-primary text-${theme}-accent font-${theme}-text`}>Log In</button>
                </div>
                <div className={`w-full hidden bg-${theme}-contrast lg:block`}>
                    <img className="m-1 w-full" src={`../../public/hero-${theme}.png`} alt={theme === 'fantasy' ? 'Left: adventurers standing in front of a large, red dragon, framed by a stone archway. Center: many multi-colored polyhedral dice in a bag. Right: Three armored adventurers in a cavern.' : 'Left: a battle between ships in outer space. Center: many multi-colored polyhedral dice in a bag. Right: a futuristic spaceship control room with a control panel that wraps around the front and a center console, flanked by chairs for the pilot and co-pilot.'}/>
                </div>
            </section>

            <section className="mt-2 p-2">
                <h2 className={`font-${theme}-heading text-${theme}-heading text-3xl lg:text-4xl`}>Generate Adventures for Tabletop Roleplaying Games</h2>
                <div className="flex my-1 justify-between">
                    <p className={`mr-1 ${theme}-text`}>Let AI craft a thrilling adventure for your next RPG session in seconds.</p>
                    <button onClick={getStartedHandler} className={`hidden ml-1 border-${theme}-accent border-[3px] rounded-2xl bg-${theme}-primary text-${theme}-accent font-${theme}-text lg:block`}>Get Started</button>
                </div>
            </section>
        </main>
    );

}

export default Home;