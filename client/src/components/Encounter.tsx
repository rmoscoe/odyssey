import React, { useState, useEffect } from 'react';
import { useTheme } from '../utils/ThemeContext';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTrashAlt, faPencil, faFloppyDisk, faPlus } from '@fortawesome/free-solid-svg-icons';

type Encounter = {
    id: number | undefined;
    encounter_type: string | null;
    description: string | null;
    stats: string | null;
}

interface EncounterProps {
    encounter: Encounter;
    handleDeleteClick: () => void;
    editEncounter: boolean;
    deleting: string;
    setDeleting: (value: string) => void;
    sequence: number;
    editScene: boolean;
}

export default function Encounter({ encounter, handleDeleteClick, editEncounter, deleting, setDeleting, sequence, editScene}: EncounterProps) {
    const [encounterType, setEncounterType] = useState('');
    const [encounterDescription, setEncounterDescription] = useState('');

    return (
        <></>
    );
}