import { useTheme } from '../utils/ThemeContext';

interface DropdownChoiceProps {
    choices: string[] | number[];
}

export default function DropdownChoice({ choices }: DropdownChoiceProps) {
    const { theme } = useTheme();

    return choices.map((choice, i) => (
        <option key={`choice-${i}`} value={choice} className={`${theme}-dropdown-choice wrap-menu-text py-2 w-[30ch] whitespace-normal`} >
            {choice}
        </option>
    ));
}