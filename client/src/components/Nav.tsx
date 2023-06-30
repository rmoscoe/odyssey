import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useTheme } from '../utils/ThemeContext';

interface NavProps {
    currentPage: string,
    handlePageChange: (page: string) => void
}

const Nav = ({ currentPage, handlePageChange }: NavProps) => {
    const { theme } = useTheme();
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
        // logout
    }

    return (
        <nav className={`${showNav} justify-between self-end text-xl text-${theme}-accent content-end space-x-4`}>
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
        </nav>
    );
}

export default Nav;