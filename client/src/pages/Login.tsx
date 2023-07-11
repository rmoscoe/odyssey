import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useTheme } from '../utils/ThemeContext';
import { validateEmail, validatePassword } from '../utils/helpers';
import Auth from '../utils/auth';

type PageProps = {
    currentPage: string;
    handlePageChange: (page: string) => void;
}

export default function Login({ currentPage, handlePageChange }: PageProps) {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [notification, setNotification] = useState('');
    const theme = useTheme();
    const navigate = useNavigate();

    if (Auth.loggedIn()) {
        navigate('/adventures');
    }

    handlePageChange('Login');

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        e.preventDefault();

        const { target } = e;
        const inputType = target.name;
        const inputValue = target.value;

        target.classList.remove("invalid-entry");

        if (inputType === 'email') {
            setEmail(inputValue);
        } else {
            setPassword(inputValue);
        }

        switch (notification) {
            case 'Please enter a valid email address':
                if (inputType === 'email') {
                    setNotification('');
                }
                break;
            case 'Please enter your password or click "Forgot Password?"':
                if (inputType === 'password') {
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
            const token = await Auth.login(user);
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
        <main className="mt-44 w-full flex content-center p-1.5 h-screen">
            <section className={`bg-${theme}-contrast rounded-3xl h-[90%] w-[97%] lg:w-3/5`}>
                <h2 className={`font-${theme}-heading text-${theme}-form-heading text-3xl mx-auto mb-5 lg:text-4xl`}>Log in to Odyssey</h2>
                <p className={`text-center mx-auto w-[95%] mb-4 ${theme}-text lg:w-3/5`}>The journey continues. Speak friend and enter.</p>
                {notification === 'An error occured while logging in. Please try again.' &&
                    <p className={`text-center mx-auto w-[95%] mb-4 ${theme}-text lg:w-3/5`}>{notification}</p>
                }
                <form autoComplete="on" id="login-form" className="mx-auto w-[95%] lg:w-3/5" onSubmit={handleLoginSubmit}>
                    <label htmlFor="email-field" className={`${theme}-label mb-2`}>Email</label>
                    <input
                        type="email"
                        id="email-field"
                        name="email-field"
                        pattern="^([a-z0-9]{1})([a-z0-9_.!#$%&'*+-/=?^`{|}~]{0,63})@([\da-z.-]{1,253})\.([a-z.]{2,6})$"
                        className={`bg-${theme}-field border-${theme}-primary border-[3px] rounded-lg text-${theme}-text w-full`}
                        value={email}
                        onChange={handleInputChange}
                        onBlur={handleEmailLoseFocus}
                        required
                    />
                    {notification === 'Please enter a valid email address' &&
                        <p className={`${theme}-text`}>{notification}</p>
                    }
                    <label htmlFor="password-field" className={`${theme}-label mt-4 mb-2`}>Password</label>
                    <input
                        type="password"
                        autoComplete="current-password"
                        id="password-field"
                        name="password-field"
                        pattern="^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)$"
                        minLength={8}
                        className={`bg-${theme}-field border-${theme}-primary border-[3px] rounded-lg text-${theme}-text w-full`}
                        value={password}
                        onChange={handleInputChange}
                        onBlur={handlePasswordLoseFocus}
                        required
                    />
                    <Link to='/account/reset-password' className={`ml-auto mr-1 font${theme}-text`}>Forgot Password?</Link>
                    {notification === 'Please enter your password or click "Forgot Password?"' &&
                        <p className={`${theme}-text`}>{notification}</p>
                    }
                    <input
                        type="submit"
                        id="submit-login"
                        className={`mt-4 w-full border-${theme}-button-alt-border border-[3px] rounded-2xl bg-${theme}-primary text-${theme}-accent font-${theme}-text`}
                        value="Submit"
                    />
                </form>
                <p className={`${theme}-text mt-4 mx-auto w-[95%] lg:w-3/5`}>
                    New to Odyssey?
                    <Link to="/account/new">Create an account for FREE.</Link>
                </p>
            </section>
        </main>
    );
}