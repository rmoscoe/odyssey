import React, { useState } from 'react';
import { useTheme } from '../utils/ThemeContext';

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
    handleDeleteClick: (id: number) => void;
    editScene: boolean;
    sceneToEdit: number;
}

export default function Scene({ scenes, handleDeleteClick, editScene, sceneToEdit }: SceneProps) {
    const { theme } = useTheme();
    const [edit, setEdit] = useState(editScene);
    const [currentScene, setCurrentScene] = useState(sceneToEdit);

    const editScene = () => {

    }

    const saveScene = () => {
        
    }

    return (
        <></>
    );
}