import React, { useState, useEffect } from 'react';
import { useTheme } from '../utils/ThemeContext';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTrashAlt, faPencil, faFloppyDisk, faPlus } from '@fortawesome/free-solid-svg-icons';
import Encounter from './Encounter';

type Encounter = {
    id: number | undefined;
    encounter_type: string | null;
    description: string | null;
    stats: string | null;
}

type Scene = {
    sequence: number;
    challenge: string | null;
    setting: string | null;
    encounter_set: Encounter[];
    plot_twist: string | null;
    clue: string | null;
}

interface SceneProps {
    scenes: Scene[];
    handleDeleteClick: () => void;
    editScene: boolean;
    sceneToEdit: number;
    deleting: string;
    setDeleting: (value: string) => void;
}

export default function Scene({ scenes, handleDeleteClick, editScene, sceneToEdit, deleting, setDeleting }: SceneProps) {
    const { theme } = useTheme();
    const [edit, setEdit] = useState(editScene);
    const [editEncounter, setEditEncounter] = useState(false);
    const [currentScene, setCurrentScene] = useState(sceneToEdit);
    const [challengeText, setChallengeText] = useState('');
    const [settingText, setSettingText] = useState('');
    const [encounters, setEncounters] = useState<Encounter[]>([]);
    const [plotTwist, setPlotTwist] = useState<string | null>(null);
    const [clue, setClue] = useState<string | null>(null);

    useEffect(() => {
        if (deleting === 'scene') {
            const idx = scenes.findIndex(scene => scene.sequence === currentScene);
            scenes.splice(idx, 1);
            for (let i = idx; i < scenes.length; i++) {
                scenes[i].sequence--;
            }
            setDeleting('');
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [deleting]);

    const clickEditScene = () => {
        setEdit(true);
        const idx = currentScene - 1;
        setChallengeText(scenes[idx].challenge || '');
        setSettingText(scenes[idx].setting || '');
        setEncounters(scenes[idx].encounter_set);
        setPlotTwist(scenes[idx].plot_twist ? scenes[idx].plot_twist : '');
        setClue(scenes[idx].clue ? scenes[idx].clue : '');
    }

    const saveScene = () => {
        const idx = currentScene - 1;
        scenes[idx].challenge = challengeText;
        scenes[idx].setting = settingText;
        scenes[idx].encounter_set = encounters;
        scenes[idx].plot_twist = plotTwist !== null && plotTwist.length > 0 ? plotTwist : null;
        scenes[idx].clue = clue !== null && clue.length > 0 ? clue : null;
        setEdit(false);
    }

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        e.preventDefault();

        const { target } = e;
        const inputId = target.id;
        const inputValue = target.tagName === 'INPUT' ? target.value : target.innerText;

        switch (inputId) {
            case 'challenge-field':
                setChallengeText(inputValue);
                break;
            case 'setting-field':
                setSettingText(inputValue);
                break;
            case 'plot-twist-field':
                setPlotTwist(inputValue);
                break;
            case 'clue-field':
                setClue(inputValue);
                break;
            default:
                console.error('Cannot update form. Invalid field ID');
                saveScene();
        }
    }

    return (
        <section className={``}></section>
    );
}