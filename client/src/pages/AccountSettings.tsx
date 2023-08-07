import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTheme } from '../utils/ThemeContext';
import { validateEmail, validatePassword } from '../utils/helpers';
import axios from 'axios';
import Auth from '../utils/auth';
import CSRFToken from '../components/CSRFToken';
import Spinner from '../components/Spinner';

type PageProps = {
    handlePageChange: (page: string) => void;
}

interface user {
    username: string;
    email: string;
    password: string;
}

export default function CreateAccount({ handlePageChange }: PageProps) {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [notification, setNotification] = useState('');
    const { theme } = useTheme();
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);

    if (!Auth.loggedIn()) {
        navigate('/login');
    }

    handlePageChange('Account Settings');

    useEffect(() => {
        const retrieveEmail = async () => {
            const pk = Auth.getToken().fields.user;
            try {
                const user = await axios.get(`/api/users/${pk}/`);
                setEmail(user.data.email);
            } catch (err) {
                console.error(err);
            }
        }

        retrieveEmail();

    }, []);

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        e.preventDefault();

        const { target } = e;
        const inputId = target.id;
        const inputValue = target.value;

        target.classList.remove("invalid-entry");

        if (inputId === 'change-email') {
            setEmail(inputValue);
        } else if (inputId === 'change-password') {
            setPassword(inputValue);
        } else {
            setConfirmPassword(inputValue);
        }

        switch (notification) {
            case 'Please enter a valid email address':
                if (inputId === 'change-email') {
                    setNotification('');
                }
                break;
            case 'This email address is already in use. Please try a different email address or log in using this email address.':
                if (inputId === 'change-email') {
                    setNotification('');
                }
                break;
            case 'Password must contain at least 8 characters, including an uppercase letter, a lowercase letter, and a number. Password cannot be too similar to Email and cannot match common passwords (e.g., "Password1")':
                if (inputId === 'change-password') {
                    setNotification('');
                }
                break;
            case 'Password confirmation must match Password entered above':
                if (inputId === 'confirm-change-password') {
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
        if (email && !validateEmail(email)) {
            setNotification('Please enter a valid email address');
            const inputElement = e.target as HTMLInputElement;
            inputElement.classList.add("invalid-entry");
        }
    }

    const handlePasswordLoseFocus = (e: React.FocusEvent<HTMLInputElement>) => {
        if (password && !validatePassword(password)) {
            setNotification('Password must contain at least 8 characters, including an uppercase letter, a lowercase letter, and a number. Password cannot be too similar to Email and cannot match common passwords (e.g., "Password1")');
            const inputElement = e.target as HTMLInputElement;
            inputElement.classList.add("invalid-entry");
        }
    }

    const handleConfirmPasswordLoseFocus = (e: React.FocusEvent<HTMLInputElement>) => {
        if (password && password !== confirmPassword) {
            setNotification('Password confirmation must match Password entered above');
            const inputElement = e.target as HTMLInputElement;
            inputElement.classList.add("invalid-entry");
        }
    }

    const emailInUse = () => {
        setNotification('This email address is already in use. Please try a different email address or log in using this email address.');
        document.getElementById('change-email')?.classList.add('invalid-entry');
    }

    const saveChanges = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setLoading(true);

        if (email && !validateEmail(email)) {
            setNotification('Please enter a valid email address');
            document.getElementById('change-email')?.classList.add('invalid-entry');
            setLoading(false);
            return;
        }

        if (password && !validatePassword(password)) {
            setNotification('Password must contain at least 8 characters, including an uppercase letter, a lowercase letter, and a number. Password cannot be too similar to Email and cannot match common passwords (e.g., "Password1")');
            document.getElementById('change-password')?.classList.add('invalid-entry');
            setLoading(false);
            return;
        }

        if (password && password !== confirmPassword) {
            setNotification('Password confirmation must match Password entered above');
            document.getElementById('confirm-change-password')?.classList.add('invalid-entry');
            setLoading(false);
            return;
        }

        const user: Partial<user> = {};
        
        if (email !== '') {
            user.username = email;
            user.email = email;
        }

        if (password !== '') {
            user.password = password;
        }

        const pk = Auth.getToken().fields.user;

        try {
            await axios.patch(`/api/users/${pk}/`, user, { headers: { 'X-CSRFToken': document.querySelector('.csrf')?.getAttribute('value') } });
            setLoading(false);
            navigate('/adventures');

        } catch (error) {
            setEmail('');
            setPassword('');
            setConfirmPassword('');
            setLoading(false);

            error === 'Username already in use' ? emailInUse() : setNotification('An error occured while updating your account. Please try again.');
            console.error(error);
        }
    }

    return (
        <main className="mt-[5.5rem] w-full flex justify-center p-2 h-overlay relative">
            <section className={`absolute top-[2%] bottom-7 inset-x-2.5 bg-${theme}-contrast rounded-[2rem] justify-center p-3 lg:w-3/5 lg:mx-auto`}>
                <h2 className={`font-${theme}-heading text-center text-${theme}-form-heading text-[1.75rem] mx-auto mb-5 lg:text-4xl`}>Account Settings</h2>
                {notification === 'An error occured while creating an account. Please try again.' &&
                    <p className={`mx-auto w-[95%] mb-4 ${theme}-text lg:w-3/5`}>{notification}</p>
                }
                {loading && <Spinner />}
                <form autoComplete="on" id="signup-form" className="mx-auto w-[95%] lg:w-3/5" onSubmit={saveChanges}>
                    <CSRFToken />
                    <div className="mb-4">
                        <label htmlFor="change-email" className={`${theme}-label`}>Email</label>
                        <input
                            type="email"
                            id="change-email"
                            name="change-email"
                            className={`bg-${theme}-field border-${theme}-primary border-[3px] rounded-xl text-${theme}-text text-lg w-full px-1 py-2 mt-2`}
                            value={email}
                            onChange={handleInputChange}
                            onBlur={handleEmailLoseFocus}
                            disabled={loading}
                        />
                        {(notification === 'Please enter a valid email address' || notification === 'This email address is already in use. Please try a different email address or log in using this email address.') &&
                            <p className={`${theme}-text mt-2`}>{notification}</p>
                        }
                    </div>
                    <div className="mb-4">
                        <label htmlFor="change-password" className={`${theme}-label`}>Password</label>
                        <input
                            type="password"
                            autoComplete="new-password"
                            id="change-password"
                            name="change-password"
                            pattern="(?=.*[a-z])(?=.*[A-Z])(?=.*\d).*"
                            minLength={8}
                            className={`bg-${theme}-field border-${theme}-primary border-[3px] rounded-xl text-${theme}-text text-lg w-full px-1 py-2 mt-2`}
                            value={password}
                            onChange={handleInputChange}
                            onBlur={handlePasswordLoseFocus}
                            disabled={loading}
                        />
                        {notification === 'Password must contain at least 8 characters, including an uppercase letter, a lowercase letter, and a number. Password cannot be too similar to Email and cannot match common passwords (e.g., "Password1")' &&
                            <p className={`${theme}-text mt-2`}>{notification}</p>
                        }
                    </div>
                    <div className="mb-4">
                        <label htmlFor="confirm-change-password" className={`${theme}-label`}>Confirm Password</label>
                        <input
                            type="password"
                            autoComplete="on"
                            id="confirm-change-password"
                            name="confirm-change-password"
                            pattern="(?=.*[a-z])(?=.*[A-Z])(?=.*\d).*"
                            minLength={8}
                            className={`bg-${theme}-field border-${theme}-primary border-[3px] rounded-xl text-${theme}-text text-lg w-full px-1 py-2 mt-2`}
                            value={confirmPassword}
                            onChange={handleInputChange}
                            onBlur={handleConfirmPasswordLoseFocus}
                            disabled={loading}
                        />
                        {notification === 'Password confirmation must match Password entered above' &&
                            <p className={`${theme}-text mt-2`}>{notification}</p>
                        }
                    </div>

                    <input
                        type="submit"
                        id="submit-update-account"
                        className={`mt-4 py-2 w-full border-${theme}-button-alt-border border-[3px] rounded-xl bg-${theme}-primary text-lg text-${theme}-accent font-${theme}-text`}
                        value="Save Changes"
                        disabled={loading}
                    />
                </form>
            </section>
        </main>
    );
}