import { useTheme } from '../utils/ThemeContext';

export default function Toggle() {
    const { theme, toggleTheme } = useTheme();

    return (
        <label className={`relative inline-block w-16 h-7 p-2`}>
            <div className={`absolute appearance-none mx-2 cursor-pointer top-0 right-0 bottom-0 left-0 bg-${theme}-toggle-void border-${theme}-toggle-border border-4 rounded-[34px] duration-300 peer focus:outline-none`}></div>
            <input
                type="checkbox"
                role="switch"
                id="theme-toggle"
                checked={theme === 'sci-fi'}
                className={`peer/toggle hidden`}
                onChange={toggleTheme}
            />
            <span className={`absolute left-3 top-1 h-5 w-5 rounded-full transition-transform duration-300 transform peer-checked/toggle:translate-x-5 bg-${theme}-toggle-switch cursor-pointer`}></span>
        </label>
    );
}