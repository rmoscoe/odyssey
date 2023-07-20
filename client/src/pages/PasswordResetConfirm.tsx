import React, { useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { useTheme } from '../utils/ThemeContext';
import { validatePassword } from '../utils/helpers';
import axios from 'axios';
import CSRFToken from '../components/CSRFToken';
import Spinner from '../components/Spinner';

type PageProps = {
    handlePageChange: (page: string) => void;
}

export default function PasswordResetConfirm({ handlePageChange }: PageProps) {
    const { uidb64, token } = useParams();
    const [uid] = useState(uidb64);
    const [tokenValue] = useState(token);
    const [newPassword, setNewPassword] = useState('');
    const [confirmNewPassword, setConfirmNewPassword] = useState('');
    const [notification, setNotification] = useState('');
    const { theme } = useTheme();
    const [instructions, setInstructions] = useState('Enter your new password below.');
    const [loading, setLoading] = useState(false);

    handlePageChange('Password Reset Confirm');

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        e.preventDefault();

        const { target } = e;
        const inputId = target.id;
        const inputValue = target.value;

        target.classList.remove("invalid-entry");

        if (inputId === 'new-password-input') {
            setNewPassword(inputValue);
        } else {
            setConfirmNewPassword(inputValue);
        }

        switch (notification) {
            case 'Please enter a new password':
                if (inputId === 'new-password-input') {
                    setNotification('');
                }
                break;
            case 'Password must contain at least 8 characters, including an uppercase letter, a lowercase letter, and a number. Password cannot be too similar to Email and cannot match common passwords (e.g., "Password1")':
                if (inputId === 'new-password-input') {
                    setNotification('');
                }
                break;
            case 'Password confirmation must match new password entered above':
                if (inputId === 'confirm-new-password-input') {
                    setNotification('');
                }
                break;
            default:
                document.querySelectorAll(".invalid-entry").forEach((node) => {
                    node.classList.remove("invalid-entry");
                });
        }
    }

    const handlePasswordLoseFocus = (e: React.FocusEvent<HTMLInputElement>) => {
        if (!validatePassword(newPassword)) {
            setNotification('Password must contain at least 8 characters, including an uppercase letter, a lowercase letter, and a number. Password cannot be too similar to Email and cannot match common passwords (e.g., "Password1")');
            const inputElement = e.target as HTMLInputElement;
            inputElement.classList.add("invalid-entry");
        }
    }

    const handleConfirmPasswordLoseFocus = (e: React.FocusEvent<HTMLInputElement>) => {
        if (newPassword !== confirmNewPassword) {
            setNotification('Password confirmation must match new password entered above');
            const inputElement = e.target as HTMLInputElement;
            inputElement.classList.add("invalid-entry");
        }
    }

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setLoading(true);

        if (!validatePassword(newPassword)) {
            setNotification('Password must contain at least 8 characters, including an uppercase letter, a lowercase letter, and a number. Password cannot be too similar to Email and cannot match common passwords (e.g., "Password1")');
            document.getElementById('new-password-input')?.classList.add('invalid-entry');
            setLoading(false);
            return;
        }

        if (newPassword !== confirmNewPassword) {
            setNotification('Password confirmation must match new password entered above');
            document.getElementById('confirm-new-password-input')?.classList.add('invalid-entry');
            setLoading(false);
            return;
        }

        const data = {
            uidb64: uid,
            token: tokenValue,
            password: newPassword
        }
        console.log(data);
        
        let response;

        try {
            response = await axios.post('/api/password/reset/confirm/', data, { headers: { 'X-CSRFToken': document.querySelector('.csrf')?.getAttribute('value')}});
            response.status === 200 ? setInstructions('Your password has been successfully updated. Please proceed to login.') : setInstructions('Your request to reset your password has expired. Please return to the Login page and log in or click "Forgot Password" again.');
            setLoading(false);
        } catch (error) {
            response?.status === 400 ? setInstructions('Your request to reset your password has expired. Please return to the Login page and log in or click "Forgot Password" again.') : setInstructions('An error occured while setting your new password. Please try again.');
            setLoading(false);
            console.error(error);
        }

        setNewPassword('');
        setConfirmNewPassword('');
    }

    return (
        <main className="mt-[5.5rem] w-full flex justify-center p-2 h-overlay relative">
            <section className={`absolute top-[2%] bottom-7 inset-x-2.5 bg-${theme}-contrast rounded-[2rem] justify-center p-3 lg:w-3/5 lg:mx-auto`}>
                <h2 className={`font-${theme}-heading text-center text-${theme}-form-heading text-[1.75rem] mx-auto mb-5 lg:text-4xl`}>Set New Password</h2>
                <p className={`mx-auto text-center w-[95%] ${theme}-text lg:w-3/5`}>{instructions}</p>
                {instructions === 'Your password has been successfully updated. Please proceed to login.' &&
                    <Link className={`block link-text text-center mx-auto w-[95%] lg:w-3/5`} to='/login'>Log in.</Link>
                }
                {loading && <Spinner />}
                <form autoComplete="on" id="new-password-form" className="mt-4 mx-auto w-[95%] lg:w-3/5" onSubmit={handleSubmit}>
                    <CSRFToken />
                    <div className="mb-4">
                        <label htmlFor="new-password-input" className={`${theme}-label`}>Password</label>
                        <input
                            type="password"
                            autoComplete="new-password"
                            id="new-password-input"
                            name="new-password-input"
                            pattern="(?=.*[a-z])(?=.*[A-Z])(?=.*\d).*"
                            minLength={8}
                            className={`bg-${theme}-field border-${theme}-primary border-[3px] rounded-xl text-${theme}-text w-full text-lg px-1 py-2 mt-2`}
                            value={newPassword}
                            onChange={handleInputChange}
                            onBlur={handlePasswordLoseFocus}
                            required
                            disabled={loading}
                        />
                        {notification === 'Password must contain at least 8 characters, including an uppercase letter, a lowercase letter, and a number. Password cannot be too similar to Email and cannot match common passwords (e.g., "Password1")' &&
                            <p className={`${theme}-text mt-2`}>{notification}</p>
                        }
                    </div>
                    <div className="mb-4">
                        <label htmlFor="confirm-new-password-input" className={`${theme}-label`}>Confirm Password</label>
                        <input
                            type="password"
                            autoComplete="on"
                            id="confirm-new-password-input"
                            name="confirm-new-password-input"
                            pattern="(?=.*[a-z])(?=.*[A-Z])(?=.*\d).*"
                            minLength={8}
                            className={`bg-${theme}-field border-${theme}-primary border-[3px] rounded-xl text-${theme}-text w-full px-1 py-2 mt-2`}
                            value={confirmNewPassword}
                            onChange={handleInputChange}
                            onBlur={handleConfirmPasswordLoseFocus}
                            required
                            disabled={loading}
                        />
                        {notification === 'Password confirmation must match new password entered above' &&
                            <p className={`${theme}-text mt-2`}>{notification}</p>
                        }
                    </div>

                    <input
                        type="submit"
                        id="submit-reset-password"
                        className={`mt-4 py-2 w-full border-${theme}-button-alt-border border-[3px] rounded-xl bg-${theme}-primary text-${theme}-accent text-lg font-${theme}-text`}
                        value="Submit"
                        disabled={loading}
                    />
                </form>
            </section>
        </main>
    );
}