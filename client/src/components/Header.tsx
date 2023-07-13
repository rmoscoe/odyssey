import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useTheme } from '../utils/ThemeContext';
import Nav from './Nav';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faNavicon } from '@fortawesome/free-solid-svg-icons';
import Hamburger from './Hamburger';
import Auth from '../utils/auth';

interface HeaderProps {
    currentPage: string,
}

const Header = ({ currentPage }: HeaderProps) => {
    const { theme } = useTheme();
    const [hamburgerActive, setHamburgerActive] = useState(false);
    const navigate = useNavigate();

    const toggleActive = () => setHamburgerActive(!hamburgerActive);

    const handleLogout = (event: React.MouseEvent<HTMLAnchorElement | HTMLDivElement>) => {
        event.preventDefault();
        Auth.logout();
        navigate('/');
    }

    return (
        <header className={`bg-${theme}-primary w-full p-3 flex justify-between items-center fixed top-0 z-50`}>
            <div className="flex items-center">
                <Link to={(currentPage === 'Home' || currentPage === 'Create Account' || currentPage === 'Login') ? '/' : '/adventures'}>
                    <img src="/static/logo192.png" alt="Odyssey logo: a sailing ship on rough seas surrounded by a compass rose" className="max-w-[4rem]" />
                </Link>
                <Link to={(currentPage === 'Home' || currentPage === 'Create Account' || currentPage === 'Login') ? '/' : '/adventures'}>
                    <h1 className={`${theme}-title justify-self-center self-center text-center lg:text-start lg:justify-self-start lg:text-5xl lg:px-2`}>Odyssey</h1>
                </Link>
            </div>
            {(currentPage !== 'Account Settings' && currentPage !== 'Password Reset Confirm') &&
                <Nav currentPage={currentPage} handleLogout={handleLogout} />
            }
            {(currentPage === 'My Adventures' || currentPage === 'New Adventure' || currentPage === 'Adventure Details') &&
                <>
                    <div role="button" className={"lg:hidden"} onClick={toggleActive} aria-label="menu" aria-expanded="false">
                        <FontAwesomeIcon className={`font-${theme}-text text-[color:${theme}-accent] text-2xl`} icon={faNavicon} />
                        <span aria-hidden="true"></span>
                        <span aria-hidden="true"></span>
                        <span aria-hidden="true"></span>
                    </div>
                    <Hamburger toggleActive={toggleActive} hamburgerActive={hamburgerActive} handleLogout={handleLogout} />
                </>
            }
        </header>
    );
}

export default Header;