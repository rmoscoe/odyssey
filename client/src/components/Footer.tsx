import React from 'react';
import { useTheme } from '../utils/ThemeContext';

const Footer = () => {
    const { theme } = useTheme;

    return Footer(
        <footer className={`bg-${theme}-contrast text-${theme}-footer-text`}>

        </footer>
    );
}