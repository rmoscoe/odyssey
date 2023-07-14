import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useTheme } from '../utils/ThemeContext';
import { validateEmail, validatePassword } from '../utils/helpers';
import axios from 'axios';
import Auth from '../utils/auth';

type PageProps = {
    handlePageChange: (page: string) => void;
}

export default function CreateAccount({ handlePageChange }: PageProps) {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [notification, setNotification] = useState('');
    const { theme } = useTheme();
    const navigate = useNavigate();

    if (Auth.loggedIn()) {
        navigate('/adventures');
    }

    handlePageChange('Create Account');

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        e.preventDefault();

        const { target } = e;
        const inputId = target.id;
        const inputValue = target.value;

        target.classList.remove("invalid-entry");

        if (inputId === 'email-input') {
            setEmail(inputValue);
        } else if (inputId === 'password-input') {
            setPassword(inputValue);
        } else {
            setConfirmPassword(inputValue);
        }

        switch (notification) {
            case 'Please enter a valid email address':
                if (inputId === 'email-input') {
                    setNotification('');
                }
                break;
            case 'This email address is already in use. Please try a different email address or proceed to login':
                if (inputId === 'email-input') {
                    setNotification('');
                }
                break;
            case 'Password must contain at least 8 characters, including an uppercase letter, a lowercase letter, and a number. Password cannot be too similar to Email and cannot match common passwords (e.g., "Password1")':
                if (inputId === 'password-input') {
                    setNotification('');
                }
                break;
            case 'Password confirmation must match Password entered above':
                if (inputId === 'confirm-password-input') {
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
        console.log("Validating email");
        if (!validateEmail(email)) {
            setNotification('Please enter a valid email address');
            const inputElement = e.target as HTMLInputElement;
            inputElement.classList.add("invalid-entry");
        }
    }

    const handlePasswordLoseFocus = (e: React.FocusEvent<HTMLInputElement>) => {
        console.log("Validating password");
        if (!validatePassword(password)) {
            setNotification('Password must contain at least 8 characters, including an uppercase letter, a lowercase letter, and a number. Password cannot be too similar to Email and cannot match common passwords (e.g., "Password1")');
            const inputElement = e.target as HTMLInputElement;
            inputElement.classList.add("invalid-entry");
        }
    }

    const handleConfirmPasswordLoseFocus = (e: React.FocusEvent<HTMLInputElement>) => {
        console.log("Validaing password confirmation");
        if (password !== confirmPassword) {
            setNotification('Password confirmation must match Password entered above');
            const inputElement = e.target as HTMLInputElement;
            inputElement.classList.add("invalid-entry");
        }
    }

    const emailInUse = () => {
        console.log("Email in use");
        setNotification('This email address is already in use. Please try a different email address or proceed to login');
        document.getElementById('email-input')?.classList.add('invalid-entry');
    }

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        console.log("Submitting new user data");

        if (!validateEmail(email)) {
            console.log("Failed email validation");
            setNotification('Please enter a valid email address');
            document.getElementById('email-input')?.classList.add('invalid-entry');
            return;
        }

        if (!validatePassword(password)) {
            console.log("Failed password validation");
            setNotification('Password must contain at least 8 characters, including an uppercase letter, a lowercase letter, and a number. Password cannot be too similar to Email and cannot match common passwords (e.g., "Password1")');
            document.getElementById('password-input')?.classList.add('invalid-entry');
            return;
        }

        if (password !== confirmPassword) {
            console.log("Failed confirm password validation");
            setNotification('Password confirmation must match Password entered above');
            document.getElementById('confirm-password-input')?.classList.add('invalid-entry');
            return;
        }

        const user = {
            username: email,
            email: email,
            password: password
        }
        console.log("User: ", user);

        try {
            console.log("Calling database");
            const response = await axios.post('/api/users/', user);
            // log the user in and store the token in localStorage
            const token = response.data.token;
            console.log(token);
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
        <main className="mt-[5.5rem] w-full flex justify-center p-2 h-overlay relative">
            <section className={`absolute top-[2%] bottom-7 inset-x-2.5 bg-${theme}-contrast rounded-[2rem] justify-center p-3 lg:w-3/5 lg:mx-auto`}>
                <h2 className={`font-${theme}-heading text-center text-${theme}-form-heading text-[1.75rem] mx-auto mb-5 lg:text-4xl`}>Create an Account</h2>
                {notification === 'An error occured while creating an account. Please try again.' &&
                    <p className={`mx-auto w-[95%] mb-4 ${theme}-text lg:w-3/5`}>{notification}</p>
                }
                <form autoComplete="on" id="signup-form" className="mx-auto w-[95%] lg:w-3/5" onSubmit={handleSubmit}>
                    <div className="mb-4">
                        <label htmlFor="email-input" className={`${theme}-label`}>Email</label>
                        <input
                            type="email"
                            id="email-input"
                            name="email-input"
                            // pattern="([a-z0-9]{1})([a-z0-9_.!#$%&'*+-/=?^`{|}~]{0,63})@([0-9a-z.-]{1,253})\.([a-z.]{2,6})"
                            className={`bg-${theme}-field border-${theme}-primary border-[3px] rounded-xl text-${theme}-text text-lg w-full px-1 py-2 mt-2`}
                            value={email}
                            onChange={handleInputChange}
                            onBlur={handleEmailLoseFocus}
                            required
                        />
                        {(notification === 'Please enter a valid email address' || notification === 'This email address is already in use. Please try a different email address or proceed to login') &&
                            <p className={`${theme}-text mt-2`}>{notification}</p>
                        }
                    </div>
                    <div className="mb-4">
                        <label htmlFor="password-input" className={`${theme}-label`}>Password</label>
                        <input
                            type="password"
                            autoComplete="new-password"
                            id="password-input"
                            name="password-input"
                            pattern="(?=.*[a-z])(?=.*[A-Z])(?=.*\d).*"
                            minLength={8}
                            className={`bg-${theme}-field border-${theme}-primary border-[3px] rounded-xl text-${theme}-text text-lg w-full px-1 py-2 mt-2`}
                            value={password}
                            onChange={handleInputChange}
                            onBlur={handlePasswordLoseFocus}
                            required
                        />
                        {notification === 'Password must contain at least 8 characters, including an uppercase letter, a lowercase letter, and a number. Password cannot be too similar to Email and cannot match common passwords (e.g., "Password1")' &&
                            <p className={`${theme}-text mt-2`}>{notification}</p>
                        }
                    </div>
                    <div className="mb-4">
                        <label htmlFor="confirm-password-input" className={`${theme}-label`}>Confirm Password</label>
                        <input
                            type="password"
                            autoComplete="on"
                            id="confirm-password-input"
                            name="confirm-password-input"
                            pattern="(?=.*[a-z])(?=.*[A-Z])(?=.*\d).*"
                            minLength={8}
                            className={`bg-${theme}-field border-${theme}-primary border-[3px] rounded-xl text-${theme}-text text-lg w-full px-1 py-2 mt-2`}
                            value={confirmPassword}
                            onChange={handleInputChange}
                            onBlur={handleConfirmPasswordLoseFocus}
                            required
                        />
                        {notification === 'Password confirmation must match Password entered above' &&
                            <p className={`${theme}-text mt-2`}>{notification}</p>
                        }
                    </div>

                    <input
                        type="submit"
                        id="submit-create-account"
                        className={`mt-4 py-2 w-full border-${theme}-button-alt-border border-[3px] rounded-xl bg-${theme}-primary text-lg text-${theme}-accent font-${theme}-text`}
                        value="Create Account"
                    />
                </form>
                <p className={`${theme}-text mt-4 mx-auto w-[95%] lg:w-3/5`}>
                    Already have an account? &nbsp;
                    <Link className="link-text" to="/login">Log in.</Link>
                </p>
            </section>
        </main>
    );
}