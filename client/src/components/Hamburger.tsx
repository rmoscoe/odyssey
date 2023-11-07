import React from 'react';
import { Link } from 'react-router-dom';
import { useTheme } from '../utils/ThemeContext';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faX } from '@fortawesome/free-solid-svg-icons';
import { ReactComponent as Sword } from '../assets/sword.svg';
import { ReactComponent as Planet } from '../assets/planet.svg';
import Toggle from './Toggle';

interface HamburgerProps {
    toggleActive: () => void;
    hamburgerActive: boolean;
    handleLogout: (event: React.MouseEvent<HTMLAnchorElement | HTMLDivElement>) => void;
}

export default function Hamburger({ toggleActive, hamburgerActive, handleLogout }: HamburgerProps) {
    const { theme } = useTheme();

    const mobileLogout = (event: React.MouseEvent<HTMLAnchorElement | HTMLDivElement>) => {
        toggleActive();
        handleLogout(event);
    }

    return (
        <div className={hamburgerActive ? `fixed top-0 left-0 right-0 bg-${theme}-primary font-${theme}-text text-${theme}-accent text-3xl p-3 h-[80vh] w-full` : 'hidden'}>
            <section className="w-full flex justify-end">
                <div role="button" onClick={toggleActive} aria-label="menu" aria-expanded="false" className="ml-auto">
                    <FontAwesomeIcon className={`font-${theme}-text text-${theme}-accent text-3xl ml-auto`} icon={faX} />
                    <span aria-hidden="true"></span>
                    <span aria-hidden="true"></span>
                    <span aria-hidden="true"></span>
                </div>
            </section>

            <div className="flex h-full w-full content-center p-2">
                <section className={'my-auto w-full block'}>
                    <section className="mx-0 w-full text-m flex justify-center items-center mb-4">
                        <svg xmlns="http://www.w3.org/2000/svg" width="1.25em" height="1.25em" viewBox="0 0 100 100">
                            <Sword color={theme === 'fantasy' ? '#F7CE65' : '#FF54A4'} />
                        </svg>
                        <Toggle />
                        <svg xmlns="http://www.w3.org/2000/svg" width="1.25em" height="1.25em" viewBox="0 0 100 100">
                            <Planet color={theme === 'fantasy' ? '#F7CE65' : '#FF54A4'} />
                        </svg>
                    </section>
                    <Link to='/account/settings' onClick={toggleActive} className='block my-4 mx-0 w-full text-center'>Account Settings</Link>
                    <Link className={'block mt-4 mx-0 w-full text-center'} to='#' onClick={mobileLogout}>Logout</Link>
                </section>
            </div>
        </div>
    );
}