import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useTheme } from '../utils/ThemeContext';
import { validateEmail, validatePassword } from '../utils/helpers';

export default function CreateAccount () {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [notification, setNotification] = useState('');
    const [submitted, setSubmitted] = useState(false);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState();
    const [confirmation, setConfirmation] = useState(false);
    const theme = useTheme();

    const handleInputChange = (e) => {
        e.preventDefault();

        const { target } = e;
        const inputType = target.name;
        const inputValue = target.value;

        setConfirmation(false);
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

        const handleEmailLoseFocus = (e: FocusEvent) => {
            if (!validateEmail(email)) {
                setNotification('Please enter a valid email address');
                const inputElement = e.target as HTMLInputElement;
                inputElement.classList.add("invalid-entry");
            }
        }

        const handlePasswordLoseFocus = (e: FocusEvent) => {
            if (!validatePassword(password)) {
                setNotification('Password must contain at least 8 characters, including an uppercase letter, a lowercase letter, and a number. Password cannot be too similar to Email and cannot match common passwords (e.g., "Password1")');
                const inputElement = e.target as HTMLInputElement;
                inputElement.classList.add("invalid-entry");
            }
        }

        const handleConfirmPasswordLoseFocus = (e: FocusEvent) => {
            if (password !== confirmPassword) {
                setNotification('Password confirmation must match Password entered above');
                const inputElement = e.target as HTMLInputElement;
                inputElement.classList.add("invalid-entry");
            }
        }

        
    }
}