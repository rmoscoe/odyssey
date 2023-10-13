/// <reference types="vite-plugin-svgr/client" />

import { Link } from 'react-router-dom';
import { useTheme } from '../utils/ThemeContext';
import { ReactComponent as Sword } from '../assets/sword.svg';
import { ReactComponent as Planet } from '../assets/planet.svg';
import Toggle from './Toggle';

interface NavProps {
    currentPage: string,
    handleLogout: (event: React.MouseEvent<HTMLAnchorElement | HTMLDivElement>) => void
}

const Nav = ({ currentPage, handleLogout }: NavProps) => {
    const { theme } = useTheme();

    let showNav: string;

    switch (currentPage) {
        case 'My Adventures':
            showNav = 'hidden lg:flex';
            break;
        case 'New Adventure':
            showNav = 'hidden lg:flex';
            break;
        case 'Adventure Details':
            showNav = 'hidden lg:flex';
            break;
        case 'Account Settings':
            showNav = 'hidden';
            break;
        default:
            showNav = 'flex';
    }

    return (
        <nav className={`${showNav} justify-between self-end justify-self-end text-xl text-${theme}-accent items-end py-1 font-${theme}-text`}>
            {currentPage === 'Home' &&
                <>
                    <Link className={'hidden lg:block lg:ml-10'} to='/account/new'>Get Started</Link>
                    <Link className={'hidden lg:block lg:ml-10'} to='/login'>Log In</Link>
                </>
            }
            {(currentPage === 'My Adventures' || currentPage === 'New Adventure') &&
                <>
                    <Link className={'hidden lg:block lg:ml-10'} to='/account/settings'>Account Settings</Link>
                    <Link className={'hidden lg:block lg:ml-10'} to='#' onClick={handleLogout}>Logout</Link>
                </>
            }
            <section className="self-end text-m flex items-center justify-self-start lg:ml-10">
                <svg xmlns="http://www.w3.org/2000/svg" width="1.25em" height="1.25em" viewBox="0 0 100 100">
                    <Sword color={theme==='fantasy' ? '#F7CE65' : '#FF54A4'}/>
                </svg>
                <Toggle />
                {/* <label className={`relative inline-block w-16 h-7 p-2`}>
                    <div className={`absolute appearance-none mx-2 cursor-pointer top-0 right-0 bottom-0 left-0 bg-${theme}-toggle-void border-${theme}-toggle-border border-4 rounded-[34px] duration-300 peer focus:outline-none`}></div>
                    <input 
                        type="checkbox" 
                        role="switch"
                        id="theme-toggle" 
                        checked={theme === 'sci-fi'} 
                        className={`peer/toggle hidden`} 
                        onChange={toggleTheme} 
                    />
                    <span className={`absolute left-3 top-1 h-5 w-5 rounded-full transition-transform duration-300 transform peer-checked/toggle:translate-x-5 bg-${theme}-toggle-switch cursor-pointer`}></span>
                </label> */}
                <svg xmlns="http://www.w3.org/2000/svg" width="1.25em" height="1.25em" viewBox="0 0 100 100">
                    <Planet color={theme==='fantasy' ? '#F7CE65' : '#FF54A4'}/>
                </svg>
            </section>
        </nav>
    );
}

export default Nav;