import React from 'react';
import { Link } from 'react-router-dom';
import { useTheme } from '../utils/ThemeContext';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faX } from '@fortawesome/free-solid-svg-icons';
import { ReactComponent as Sword } from '../assets/sword.svg';
import { ReactComponent as Planet } from '../assets/planet.svg';

interface HamburgerProps {
    toggleActive: () => void;
    hamburgerActive: boolean;
    handleLogout: (event: React.MouseEvent<HTMLAnchorElement | HTMLDivElement>) => void;
}

export default function Hamburger({ toggleActive, hamburgerActive, handleLogout }: HamburgerProps) {
    const { theme, toggleTheme } = useTheme();

    return (
        <div className={hamburgerActive ? `fixed top-0 left-0 right-0 bg-${theme}-primary font-${theme}-text text-${theme}-accent text-2xl p-2 h-[80vh] w-full` : 'hidden'}>
            <div role="button" onClick={toggleActive} aria-label="menu" aria-expanded="false">
                <FontAwesomeIcon className={`font-${theme}-text text-${theme}-accent text-2xl ml-auto`} icon={faX} />
                <span aria-hidden="true"></span>
                <span aria-hidden="true"></span>
                <span aria-hidden="true"></span>
            </div>
            <section className='my-auto w-full flex justify-center'>
                <section className="mx-auto mb-3.5 text-sm flex">
                    <svg xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" viewBox="0 0 100 100" style={{ fill: `${theme}-accent` }}>
                        <Sword />
                    </svg>
                    <label className={`relative inline-block w-16 h-6`}>
                        <input type="checkbox" id="theme-toggle" checked={theme === 'sci-fi'} className={`absolute ml-[5px] cursor-pointer top-0 right-0 bottom-0 left-0 bg-${theme}-toggle-void border-${theme}-toggle-border border-4 rounded-[34px] duration-300 peer before:absolute before:h-4 before:w-4 before:bottom-1 before:left:1 before:bg-${theme}-toggle-switch before:duration-300 before:rounded-[50%] before:peer-checked:translate-x-6`} onChange={toggleTheme} />
                    </label>
                    <svg xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" viewBox="0 0 100 100" style={{ fill: `${theme}-accent` }}>
                        <Planet />
                    </svg>
                </section>
                <Link to='/account/settings' className='my-3.5 mx-auto text-center'>Account Settings</Link>
                <Link className={'mt-3.5 mx-auto text-center'} to='#' onClick={handleLogout}>Logout</Link>
            </section>
        </div>
    );
}