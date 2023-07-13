import React, { useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { useTheme } from '../utils/ThemeContext';
import { validatePassword } from '../utils/helpers';
import axios from 'axios';

type PageProps = {
    handlePageChange: (page: string) => void;
}

export default function PasswordResetConfirm ({ handlePageChange }: PageProps) {
    const { uidb64, token } = useParams();
    const [uid] = useState(uidb64);
    const [tokenValue] = useState(token);
    const [newPassword, setNewPassword] = useState('');
    const [confirmNewPassword, setConfirmNewPassword] = useState('');
    const [notification, setNotification] = useState('');
    const { theme }  = useTheme();
    const [instructions, setInstructions] = useState('Enter your new password below.');

    handlePageChange('Password Reset Confirm');

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        e.preventDefault();

        const { target } = e;
        const inputType = target.name;
        const inputValue = target.value;

        target.classList.remove("invalid-entry");

        if (inputType === 'newPassword') {
            setNewPassword(inputValue);
        } else {
            setConfirmNewPassword(inputValue);
        }

        switch (notification) {
            case 'Please enter a new password':
                if (inputType === 'newPassword') {
                    setNotification('');
                }
                break;
            case 'Password must contain at least 8 characters, including an uppercase letter, a lowercase letter, and a number. Password cannot be too similar to Email and cannot match common passwords (e.g., "Password1")':
                if (inputType === 'newPassword') {
                    setNotification('');
                }
                break;
            case 'Password confirmation must match new password entered above':
                if (inputType === 'confirmNewPassword') {
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

        if (!validatePassword(newPassword)) {
            setNotification('Password must contain at least 8 characters, including an uppercase letter, a lowercase letter, and a number. Password cannot be too similar to Email and cannot match common passwords (e.g., "Password1")');
            document.getElementById('new-password-input')?.classList.add('invalid-entry');
            return;
        }

        if (newPassword !== confirmNewPassword) {
            setNotification('Password confirmation must match new password entered above');
            document.getElementById('confirm-new-password-input')?.classList.add('invalid-entry');
            return;
        }

        const data = {
            uidb64: uid,
            token: tokenValue,
            password: newPassword
        }

        try {
            const response = await axios.post('/api/password/reset/confirm/', data);
            response.status === 200 ? setInstructions('Your password has been successfully updated. Please proceed to login.') : setInstructions('An error occured while setting your new password. Please try again.');

        } catch (error) {
            setNotification('An error occured while setting your new password. Please try again.');
            console.error(error);
        }

        setNewPassword('');
        setConfirmNewPassword('');
    }

    return (
        <main className="mt-44 w-full flex content-center p-1.5 h-screen">
            <section className={`bg-${theme}-contrast rounded-3xl h-[90%] w-[97%] lg:w-3/5`}>
                <h2 className={`font-${theme}-heading text-${theme}-form-heading text-3xl mx-auto mb-5 lg:text-4xl`}>Set New Password</h2>
                <p className={`mx-auto text-center w-[95%] ${theme}-text lg:w-3/5`}>{instructions}</p>
                {instructions === 'Your password has been successfully updated. Please proceed to login.' &&
                    <Link className={`${theme}-text text-center mx-auto w-[95%] lg:w-3/5`} to='/login'>Log in.</Link>
                }
                <form autoComplete="on" id="new-password-form" className="mt-4 mx-auto w-[95%] lg:w-3/5" onSubmit={handleSubmit}>
                <label htmlFor="new-password-input" className={`${theme}-label mt-4 mb-2`}>Password</label>
                    <input 
                        type="password" 
                        autoComplete="new-password"
                        id="new-password-input" 
                        name="new-password-input" 
                        pattern="^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)$"
                        minLength={8}
                        className={`bg-${theme}-field border-${theme}-primary border-[3px] rounded-lg text-${theme}-text w-full`} 
                        value={newPassword}
                        onChange={handleInputChange}
                        onBlur={handlePasswordLoseFocus}
                        required
                    />
                    {notification === 'Password must contain at least 8 characters, including an uppercase letter, a lowercase letter, and a number. Password cannot be too similar to Email and cannot match common passwords (e.g., "Password1")' &&
                        <p className={`${theme}-text`}>{notification}</p>
                    }
                    <label htmlFor="confirm-new-password-input" className={`${theme}-label mt-4 mb-2`}>Confirm Password</label>
                    <input 
                        type="password" 
                        autoComplete="on"
                        id="confirm-new-password-input" 
                        name="confirm-new-password-input" 
                        pattern="^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)$"
                        minLength={8}
                        className={`bg-${theme}-field border-${theme}-primary border-[3px] rounded-lg text-${theme}-text w-full`} 
                        value={confirmNewPassword}
                        onChange={handleInputChange}
                        onBlur={handleConfirmPasswordLoseFocus}
                        required
                    />
                    {notification === 'Password confirmation must match new password entered above' &&
                        <p className={`${theme}-text`}>{notification}</p>
                    }
                    <input
                        type="submit"
                        id="submit-reset-password"
                        className={`mt-4 w-full border-${theme}-button-alt-border border-[3px] rounded-2xl bg-${theme}-primary text-${theme}-accent font-${theme}-text`}
                        value="Submit"
                    />
                </form>
            </section>
        </main>
    );
}