import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useTheme } from '../utils/ThemeContext';
import { validateEmail, validatePassword } from '../utils/helpers';
import Auth from '../utils/auth';
import CSRFToken from '../components/CSRFToken';
import Cookies from 'js-cookie';

type PageProps = {
    handlePageChange: (page: string) => void;
}

export default function Login({ handlePageChange }: PageProps) {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [notification, setNotification] = useState('');
    const { theme } = useTheme();
    const navigate = useNavigate();
    
    if (Auth.loggedIn()) {
        navigate('/adventures');
    }

    handlePageChange('Login');

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        e.preventDefault();

        const { target } = e;
        const inputId = target.id;
        const inputValue = target.value;

        target.classList.remove("invalid-entry");

        if (inputId === 'email-field') {
            setEmail(inputValue);
        } else {
            setPassword(inputValue);
        }

        switch (notification) {
            case 'Please enter a valid email address':
                if (inputId === 'email-field') {
                    setNotification('');
                }
                break;
            case 'Please enter your password or click "Forgot Password?"':
                if (inputId === 'password-field') {
                    setNotification('');
                }
                break;
            default:
                document.querySelectorAll(".invalid-entry").forEach((node) => {
                    node.classList.remove("invalid-entry");
                });
        }
    }

    const handleEmailLoseFocus = (e: React.FocusEvent<HTMLInputElement>) => {
        if (!validateEmail(email)) {
            setNotification('Please enter a valid email address');
            const inputElement = e.target as HTMLInputElement;
            inputElement.classList.add("invalid-entry");
        }
    }

    const handlePasswordLoseFocus = (e: React.FocusEvent<HTMLInputElement>) => {
        if (!validatePassword(password)) {
            setNotification('Please enter your password or click "Forgot Password?"');
            const inputElement = e.target as HTMLInputElement;
            inputElement.classList.add("invalid-entry");
        }
    }

    const handleLoginSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        if (!validateEmail(email)) {
            setNotification('Please enter a valid email address');
            document.getElementById('email-input')?.classList.add('invalid-entry');
            return;
        }

        if (!validatePassword(password)) {
            setNotification('Please enter your password or click "Forgot Password?"');
            document.getElementById('password-input')?.classList.add('invalid-entry');
            return;
        }

        const user = {
            username: email,
            password: password
        }

        try {
            const token = await Auth.login(user, Cookies.get('csrftoken'));
            if (token) {
                navigate('/adventures');
            }

        } catch (error) {
            error === 'Invalid email or password' ? setNotification('Invalid email or password') : setNotification('An error occured while logging in. Please try again.');
            console.error(error);
        }

        setEmail('');
        setPassword('');
    }

    return (
        <main className="mt-[5.5rem] w-full flex justify-center p-2 h-overlay relative">
            <section className={`absolute top-[2%] bottom-7 inset-x-2.5 bg-${theme}-contrast rounded-[2rem] justify-center p-3 lg:w-3/5 lg:mx-auto`}>
                <h2 className={`font-${theme}-heading text-center text-${theme}-form-heading text-[1.75rem] mx-auto mb-5 lg:text-4xl`}>Log in to Odyssey</h2>
                <p className={`text-center mx-auto w-[95%] mb-4 ${theme}-text lg:w-3/5`}>The journey continues. {theme === 'fantasy' ? 'Speak friend and enter.' : 'Voice authorization required.'}</p>
                {notification === 'An error occured while logging in. Please try again.' &&
                    <p className={`text-center mx-auto w-[95%] mb-4 ${theme}-text lg:w-3/5`}>{notification}</p>
                }
                <form autoComplete="on" id="login-form" className="mx-auto w-[95%] lg:w-3/5" onSubmit={handleLoginSubmit}>
                    <CSRFToken />
                    <div className="mb-4">
                        <label htmlFor="email-field" className={`${theme}-label`}>Email</label>
                        <input
                            type="email"
                            id="email-field"
                            name="email-field"
                            className={`bg-${theme}-field border-${theme}-primary border-[3px] rounded-xl text-${theme}-text w-full text-lg px-1 py-2 mt-2`}
                            value={email}
                            onChange={handleInputChange}
                            onBlur={handleEmailLoseFocus}
                            required
                        />
                        {notification === 'Please enter a valid email address' &&
                            <p className={`${theme}-text mt-2`}>{notification}</p>
                        }
                    </div>
                    <div className="mb-4">
                        <label htmlFor="password-field" className={`${theme}-label`}>Password</label>
                        <input
                            type="password"
                            autoComplete="current-password"
                            id="password-field"
                            name="password-field"
                            pattern="(?=.*[a-z])(?=.*[A-Z])(?=.*\d).*"
                            minLength={8}
                            className={`bg-${theme}-field border-${theme}-primary border-[3px] rounded-xl text-${theme}-text w-full text-lg px-1 py-2 mt-2`}
                            value={password}
                            onChange={handleInputChange}
                            onBlur={handlePasswordLoseFocus}
                            required
                        />
                        <Link to='/account/reset-password' className={`block mt-1 ml-auto w-full px-1 text-right font-${theme}-text link-text`}>Forgot Password?</Link>
                        {notification === 'Please enter your password or click "Forgot Password?"' &&
                            <p className={`${theme}-text mt-2`}>{notification}</p>
                        }
                    </div>
                    <input
                        type="submit"
                        id="submit-login"
                        className={`mt-4 py-2 w-full border-${theme}-button-alt-border border-[3px] rounded-xl bg-${theme}-primary text-${theme}-accent text-lg font-${theme}-text`}
                        value="Submit"
                    />
                </form>
                <p className={`${theme}-text mt-4 mx-auto w-[95%] lg:w-3/5`}>
                    New to Odyssey? &nbsp;
                    <Link className="link-text" to="/account/new">Create an account for FREE.</Link>
                </p>
            </section>
        </main>
    );
}