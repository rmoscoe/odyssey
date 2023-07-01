import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useTheme } from '../utils/ThemeContext';
import { validateEmail, validatePassword } from '../utils/helpers';
import axios from 'axios';

type PageProps = {
    currentPage: string;
    handlePageChange: (page: string) => void;
}

export default function CreateAccount ({ currentPage, handlePageChange }: PageProps) {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [notification, setNotification] = useState('');
    const theme = useTheme();
    const navigate = useNavigate();

    handlePageChange('Create Account');

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        e.preventDefault();

        const { target } = e;
        const inputType = target.name;
        const inputValue = target.value;

        target.classList.remove("invalid-entry");

        if (inputType === 'email') {
            setEmail(inputValue);
        } else if (inputType === 'password') {
            setPassword(inputValue);
        } else {
            setConfirmPassword(inputValue);
        }

        switch (notification) {
            case 'Please enter a valid email address':
                if (inputType === 'email') {
                    setNotification('');
                }
                break;
            case 'This email address is already in use. Please try a different email address or proceed to login':
                if (inputType === 'email') {
                    setNotification('');
                }
                break;
            case 'Password must contain at least 8 characters, including an uppercase letter, a lowercase letter, and a number. Password cannot be too similar to Email and cannot match common passwords (e.g., "Password1")':
                if (inputType === 'password') {
                    setNotification('');
                }
                break;
            case 'Password confirmation must match Password entered above':
                if (inputType === 'confirmPassword') {
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
            setNotification('Password must contain at least 8 characters, including an uppercase letter, a lowercase letter, and a number. Password cannot be too similar to Email and cannot match common passwords (e.g., "Password1")');
            const inputElement = e.target as HTMLInputElement;
            inputElement.classList.add("invalid-entry");
        }
    }

    const handleConfirmPasswordLoseFocus = (e: React.FocusEvent<HTMLInputElement>) => {
        if (password !== confirmPassword) {
            setNotification('Password confirmation must match Password entered above');
            const inputElement = e.target as HTMLInputElement;
            inputElement.classList.add("invalid-entry");
        }
    }

    const emailInUse = () => {
        setNotification('This email address is already in use. Please try a different email address or proceed to login');
        document.getElementById('email-input')?.classList.add('invalid-entry');
    }

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        if (!validateEmail(email)) {
            setNotification('Please enter a valid email address');
            document.getElementById('email-input')?.classList.add('invalid-entry');
            return;
        }

        if (!validatePassword(password)) {
            setNotification('Password must contain at least 8 characters, including an uppercase letter, a lowercase letter, and a number. Password cannot be too similar to Email and cannot match common passwords (e.g., "Password1")');
            document.getElementById('password-input')?.classList.add('invalid-entry');
            return;
        }

        if (password !== confirmPassword) {
            setNotification('Password confirmation must match Password entered above');
            document.getElementById('confirm-password-input')?.classList.add('invalid-entry');
            return;
        }

        const user = {
            username: email,
            email: email,
            password: password
        }

        try {
            const response = await axios.post('/api/users/', user);
            // log the user in and store the token in localStorage
            const token = response.data.token;
            localStorage.setItem('odysseyToken', token);
            navigate('/adventures');

        } catch (error) {
            setEmail('');
            setPassword('');
            setConfirmPassword('');

            error === 'Username already in use' ? emailInUse() : setNotification('An error occured while creating an account. Please try again.');
            console.error(error);
        }
    }

    return (
        <main className="mt-44 w-full flex content-center p-1.5 h-screen">
            <section className={`bg-${theme}-contrast rounded-3xl h-[90%] w-[97%] lg:w-3/5`}>
                <h2 className={`font-${theme}-heading text-${theme}-form-heading text-3xl mx-auto mb-5 lg:text-4xl`}>Create an Account</h2>
                {notification === 'An error occured while creating an account. Please try again.' &&
                    <p className={`mx-auto w-[95%] mb-4 ${theme}-text lg:w-3/5`}>{notification}</p>
                }
                <form autoComplete="on" id="signup-form" className="mx-auto w-[95%] lg:w-3/5" onSubmit={handleSubmit}>
                    <label htmlFor="email-input" className={`${theme}-label mb-2`}>Email</label>
                    <input 
                        type="email" 
                        id="email-input" 
                        name="email-input" 
                        pattern="^([a-z0-9]{1})([a-z0-9_.!#$%&'*+-/=?^`{|}~]{0,63})@([\da-z.-]{1,253})\.([a-z.]{2,6})$" 
                        className={`bg-${theme}-field border-${theme}-primary border-[3px] rounded-lg text-${theme}-text w-full`} 
                        value={email}
                        onChange={handleInputChange}
                        onBlur={handleEmailLoseFocus}
                        required
                    />
                    {(notification === 'Please enter a valid email address' || notification === 'This email address is already in use. Please try a different email address or proceed to login') &&
                        <p className={`${theme}-text`}>{notification}</p>
                    }
                    <label htmlFor="password-input" className={`${theme}-label mt-4 mb-2`}>Password</label>
                    <input 
                        type="password" 
                        autoComplete="new-password"
                        id="password-input" 
                        name="password-input" 
                        pattern="^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)$"
                        minLength={8}
                        className={`bg-${theme}-field border-${theme}-primary border-[3px] rounded-lg text-${theme}-text w-full`} 
                        value={password}
                        onChange={handleInputChange}
                        onBlur={handlePasswordLoseFocus}
                        required
                    />
                    {notification === 'Password must contain at least 8 characters, including an uppercase letter, a lowercase letter, and a number. Password cannot be too similar to Email and cannot match common passwords (e.g., "Password1")' &&
                        <p className={`${theme}-text`}>{notification}</p>
                    }
                    <label htmlFor="confirm-password-input" className={`${theme}-label mt-4 mb-2`}>Confirm Password</label>
                    <input 
                        type="password" 
                        autoComplete="on"
                        id="confirm-password-input" 
                        name="confirm-password-input" 
                        pattern="^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)$"
                        minLength={8}
                        className={`bg-${theme}-field border-${theme}-primary border-[3px] rounded-lg text-${theme}-text w-full`} 
                        value={confirmPassword}
                        onChange={handleInputChange}
                        onBlur={handleConfirmPasswordLoseFocus}
                        required
                    />
                    {notification === 'Password confirmation must match Password entered above' &&
                        <p className={`${theme}-text`}>{notification}</p>
                    }
                    <input
                        type="submit"
                        id="submit-create-account"
                        className={`mt-4 w-full border-${theme}-button-alt-border border-[3px] rounded-2xl bg-${theme}-primary text-${theme}-accent font-${theme}-text`}
                        value="Create Account"
                    />
                </form>
                <p className={`${theme}-text mt-4 mx-auto w-[95%] lg:w-3/5`}>
                    Already have an account? 
                    <Link to="/login">Log in.</Link>
                </p>
            </section>
        </main>
    );
}