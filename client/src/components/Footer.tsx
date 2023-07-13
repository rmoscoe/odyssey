import { useTheme } from '../utils/ThemeContext';

const Footer = () => {
    const { theme } = useTheme();

    return (
        <footer className={`bg-${theme}-contrast text-${theme}-footer-text flex justify-center content-center p-2 fixed bottom-0 z-50 font-${theme}-text w-full`}>
            <p className="flex justify-center items-center text-center w-full">
                <span>©&nbsp;</span>Ryan Moscoe 2023</p>
        </footer>
    );
}

export default Footer;