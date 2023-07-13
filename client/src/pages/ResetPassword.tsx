import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useTheme } from '../utils/ThemeContext';
import { validateEmail } from '../utils/helpers';
import axios from 'axios';

type PageProps = {
    handlePageChange: (page: string) => void;
}

export default function ResetPassword ({ handlePageChange }: PageProps) {
    const [email, setEmail] = useState('');
    const [notification, setNotification] = useState('');
    const { theme } = useTheme();
    const [instructions, setInstructions] = useState("Enter your email and we'll send you instructions to reset your password");

    handlePageChange('Reset Password');

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        e.preventDefault();

        const { target } = e;
        const inputValue = target.value;

        target.classList.remove("invalid-entry");

        setEmail(inputValue);

        notification === 'Please enter a valid email address' ? setNotification('') : document.querySelectorAll(".invalid-entry").forEach(node => node.classList.remove("invalid-entry"));
    }

    const handleEmailLoseFocus = (e: React.FocusEvent<HTMLInputElement>) => {
        if (!validateEmail(email)) {
            setNotification('Please enter a valid email address');
            const inputElement = e.target as HTMLInputElement;
            inputElement.classList.add("invalid-entry");
        }
    }

    const handleResetSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        if (!validateEmail(email)) {
            setNotification('Please enter a valid email address');
            document.getElementById('email-input')?.classList.add('invalid-entry');
            return;
        }

        try {
            const response = await axios.post('/api/password/reset', email);
            if (response.status === 200) {
                setInstructions('Your request to reset your password has been submitted. If the email address you provided matches one on file with Odyssey, you will receive an email momentarily with further instructions.');
                setNotification('');
            } else {
                setNotification('Oops! Something went wrong. Please try again.');
            }

            setEmail('');

        } catch (error) {
            setEmail('');

            setNotification('Oops! Something went wrong. Please try again.');
            console.error(error);
        }
    }

    return (
        <main className="mt-[6.5rem] w-full flex content-center p-1.5 h-screen">
            <section className={`bg-${theme}-contrast rounded-3xl h-[90%] w-[97%] lg:w-3/5`}>
                <h2 className={`font-${theme}-heading text-${theme}-form-heading text-3xl mx-auto mb-5 lg:text-4xl`}>Reset Password</h2>
                <p className={`text-center mx-auto w-[95%] mb-4 ${theme}-text lg:w-3/5`}>{instructions}</p>
                {notification === 'Oops! Something went wrong. Please try again.' &&
                    <p className={`text-center mx-auto w-[95%] mb-4 ${theme}-text lg:w-3/5`}>{notification}</p>
                }
                <form autoComplete="on" id="reset-request-form" className="mx-auto w-[95%] lg:w-3/5" onSubmit={handleResetSubmit}>
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
                    <input
                        type="submit"
                        id="submit-reset-password"
                        className={`mt-4 w-full border-${theme}-button-alt-border border-[3px] rounded-2xl bg-${theme}-primary text-${theme}-accent font-${theme}-text`}
                        value="Submit"
                    />
                </form>
                <p className={`${theme}-text mt-9 mx-auto w-[95%] text-center lg:w-3/5`}>Just remembered your password {`${theme}` === 'fantasy' ? 'by casting a memory charm?' : 'with the help of a neural scanner?'}</p>
                <Link to="/login" className={`${theme}-text mx-auto w-[95%] text-center lg:w-3/5`}>Log in.</Link>
            </section>
        </main>
    );
}