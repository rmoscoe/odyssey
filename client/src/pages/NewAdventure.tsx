import React, { useState } from 'react';
import { useTheme } from '../utils/ThemeContext';
import axios from 'axios';
import Auth from '../utils/auth';
import CSRFToken from '../components/CSRFToken';
import Spinner from '../components/Spinner';

interface NewAdventureProps {
    currentPage: string;
    handlePageChange: (page: string) => void;
}

export default function NewAdventure({ handlePageChange }: NewAdventureProps) {
    const { theme } = useTheme();

    return (
        <></>
    );
}