import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useTheme } from '../utils/ThemeContext';
import { ReactComponent as Sword } from '../../public/sword.svg';
import { ReactComponent as Planet } from '../../public/planet.svg';
import Auth from '../utils/auth';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faNavicon } from '@fortawesome/free-solid-svg-icons';
import Hamburger from './Hamburger';

interface NavProps {
    currentPage: string,
    handlePageChange: (page: string) => void
}

const Nav = ({ currentPage }: NavProps) => {
    const { theme, toggleTheme } = useTheme();
    const navigate = useNavigate();
    const [hamburgerActive, setHamburgerActive] = useState(false);

    let showNav: string;

    switch (currentPage) {
        case 'My Adventures':
            showNav = 'hidden lg: flex';
            break;
        case 'New Adventure':
            showNav = 'hidden lg: flex';
            break;
        case 'Adventure Details':
            showNav = 'hidden lg: flex';
            break;
        case 'Account Settings':
            showNav = 'hidden';
            break;
        default:
            showNav = 'flex';
    }

    const handleLogout = (event: Event) => {
        event.preventDefault();
        Auth.logout();
        navigate('/');
    }

    const toggleActive = () => setHamburgerActive(!hamburgerActive);

    return (
        <nav className={`${showNav} flex justify-between self-end text-xl text-${theme}-accent content-end space-x-4 font-${theme}-text`}>
            {currentPage === 'Home' &&
                <>
                    <Link className={'hidden lg:block'} to='/account/new'>Get Started</Link>
                    <Link className={'hidden lg:block'} to='/login'>Log In</Link>
                </>
            }
            {(currentPage === 'My Adventures' || currentPage === 'New Adventure') &&
                <>
                    <Link className={'hidden lg:block'} to='/account-settings'>Account Settings</Link>
                    <Link className={'hidden lg:block'} to='#' onClick={handleLogout}>Logout</Link>
                </>
            }
            <section className="self-end text-sm flex">
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
            {(currentPage === 'My Adventures' || currentPage === 'New Adventure' || currentPage === 'Adventure Details') &&
                <>
                    <div role="button" className={"lg:hidden"} onClick={toggleActive} aria-label="menu" aria-expanded="false">
                        <FontAwesomeIcon className={`font-${theme}-text text-${theme}-accent text-2xl`} icon={faNavicon} />
                        <span aria-hidden="true"></span>
                        <span aria-hidden="true"></span>
                        <span aria-hidden="true"></span>
                    </div>
                    <Hamburger toggleActive={toggleActive} hamburgerActive={hamburgerActive} handleLogout={handleLogout}/>
                </>
            }
        </nav>
    );
}

export default Nav;