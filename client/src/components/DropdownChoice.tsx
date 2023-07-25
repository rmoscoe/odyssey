import { useTheme } from '../utils/ThemeContext';

interface DropdownChoiceProps {
    choices: string[];
    handleMenuClick: () => void;
}

export default function DropdownChoice({ choices, handleMenuClick }: DropdownChoiceProps) {
    const { theme } = useTheme();

    return choices.map((choice, i) => (
        <div onClick={handleMenuClick} key={`choice-${i}`} className={`${theme}-dropdown-choice`} >
            {choice}
        </div>
    ));
}