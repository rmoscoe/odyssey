import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useTheme } from '../utils/ThemeContext';
import Nav from './Nav';
import Hamburger from './Hamburger';

interface HeaderProps {
    currentPage: string,
    handlePageChange: () => void;
}

const Header = ({currentPage, handlePageChange}: HeaderProps) => {
    const { theme } = useTheme();


    return (
        <header className={`bg-${theme}-primary px-3 py-2 flex justify-between content-center`}>
            <Link to={(currentPage === 'Home' || currentPage === 'Create Account' || currentPage === 'Login') ? '/' : '/my-adventures'}>
                <img src="../../public/logo192.png" alt="Odyssey logo: a sailing ship on rough seas surrounded by a compass rose" className="max-w-[10rem]" />
            </Link>
            <h1 className={`text-${theme}-primary text-5xl font-${theme}-title text-center mx-auto lg:mx-0 lg:text-left`}>Odyssey</h1>
            {currentPage !== 'Account Settings' &&
                <Nav currentPage={currentPage} handlePageChange={handlePageChange}/>
            }
            {(currentPage === 'My Adventures' || currentPage === 'New Adventure' || currentPage === 'Adventure Details') &&
                <Hamburger currentPage={currentPage} handlePageChange={handlePageChange} />
            }
        </header>
    );
}

export default Header;