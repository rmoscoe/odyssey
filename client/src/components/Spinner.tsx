import { useTheme } from '../utils/ThemeContext';

export default function Spinner() {
    const { theme } = useTheme();

    return (
        <div className={`${theme}-spinner`}></div>
    );
}