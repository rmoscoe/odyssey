import React, { useState, useContext, useEffect } from 'react';

interface ThemeProviderProps {
    children: React.ReactNode
}

interface ThemeContextProps {
    theme: string,
    toggleTheme: () => void
}

export const ThemeContext = React.createContext<ThemeContextProps>({
    theme: 'fantasy',
    toggleTheme: () => {}
});

export const useTheme = (): ThemeContextProps => useContext(ThemeContext);

export default function ThemeProvider({ children }: ThemeProviderProps):JSX.Element {
    let savedTheme = localStorage.getItem('theme') || 'fantasy';
    const [theme, setTheme] = useState(savedTheme);
    const toggleTheme = () => {
        if (theme === 'fantasy') {
            setTheme('sci-fi');
        } else {
            setTheme('fantasy');
        }
        localStorage.setItem('theme', theme);
    };

    useEffect(() => {
        document.body.className = theme;
    }, [theme]);

    return (
        <ThemeContext.Provider value={{ theme, toggleTheme }}>
            {children}
        </ThemeContext.Provider>
    );
}