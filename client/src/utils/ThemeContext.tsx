import React, { useState, useContext, useEffect } from 'react';

interface ThemeProviderProps {
    children: React.ReactNode
}

interface ThemeContextProps {
    theme: string,
    toggleTheme: () => void
}

export const ThemeContext = React.createContext<ThemeContextProps>({
    theme: 'fantasy', // eslint-disable-next-line @typescript-eslint/no-empty-function
    toggleTheme: () => {} 
});

export const useTheme = (): ThemeContextProps => useContext(ThemeContext);

export default function ThemeProvider({ children }: ThemeProviderProps):JSX.Element {
    const savedTheme = localStorage.getItem('theme') || 'fantasy';
    const [theme, setTheme] = useState(savedTheme);
    useEffect(() => {
        document.body.className = theme;
    }, [theme]);

    const toggleTheme = () => {
        if (theme === 'fantasy') {
            setTheme('sci-fi');
            localStorage.setItem('theme', 'sci-fi');
        } else {
            setTheme('fantasy');
            localStorage.setItem('theme', 'fantasy');
        }
    };

    return (
        <ThemeContext.Provider value={{ theme, toggleTheme }}>
            {children}
        </ThemeContext.Provider>
    );
}