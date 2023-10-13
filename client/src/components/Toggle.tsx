// import { useTheme } from '../utils/ThemeContext';

export default function Toggle() {
    // const { theme, toggleTheme } = useTheme();

    return (
        <label htmlFor="themeToggle" className="flex cursor-pointer select-none items-center">
            <div className="relative">
                <input type="checkbox" id="themeToggle" className="sr-only" />
                <div className="block h-8 w-14 rounded-full bg-[#E5E7EB]"></div>
                <div
                    className="switch absolute left-1 top-1 h-6 w-6 rounded-full bg-white transition"
                ></div>
            </div>
        </label>
    );
}