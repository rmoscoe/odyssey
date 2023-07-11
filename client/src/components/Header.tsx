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
    handlePageChange: (page: string) => void
}

const Header = ({ currentPage, handlePageChange }: HeaderProps) => {
    const { theme } = useTheme();
    const [hamburgerActive, setHamburgerActive] = useState(false);
    const navigate = useNavigate();

    const toggleActive = () => setHamburgerActive(!hamburgerActive);

    const handleLogout = (event: Event) => {
        event.preventDefault();
        Auth.logout();
        navigate('/');
    }

    return (
        <header className={`bg-${theme}-primary px-3 py-2 flex justify-between content-center fixed top-0 z-50`}>
            <Link to={(currentPage === 'Home' || currentPage === 'Create Account' || currentPage === 'Login') ? '/' : '/adventures'}>
                <img src="../../public/logo192.png" alt="Odyssey logo: a sailing ship on rough seas surrounded by a compass rose" className="max-w-[10rem]" />
            </Link>
            <Link to={(currentPage === 'Home' || currentPage === 'Create Account' || currentPage === 'Login') ? '/' : '/adventures'}>
                <h1 className={`text-${theme}-accent text-5xl font-${theme}-title text-center mx-auto lg:mx-0 lg:text-left`}>Odyssey</h1>
            </Link>
            {(currentPage !== 'Account Settings' && currentPage !== 'Password Reset Confirm') &&
                <Nav currentPage={currentPage} handlePageChange={handlePageChange} handleLogout={handleLogout}/>
            }
            {(currentPage === 'My Adventures' || currentPage === 'New Adventure' || currentPage === 'Adventure Details') &&
                <>
                    <div role="button" className={"lg:hidden"} onClick={toggleActive} aria-label="menu" aria-expanded="false">
                        <FontAwesomeIcon className={`font-${theme}-text text-${theme}-accent text-2xl`} icon={faNavicon} />
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