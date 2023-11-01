import React, { useState, useContext } from 'react';

interface ProviderProps {
    children: React.ReactNode
}

const SaveContext = React.createContext<{scenesSaved: number, encountersSaved: number}>({ scenesSaved: 0, encountersSaved: 0});
// eslint-disable-next-line @typescript-eslint/no-empty-function
const SaveUpdateContext = React.createContext<{incScenesSaved: () => void, resetScenesSaved: () => void, incEncountersSaved: () => void, resetEncountersSaved: () => void}>({incScenesSaved: () => {}, resetScenesSaved: () => {}, incEncountersSaved: () => {}, resetEncountersSaved: () => {}});

const SaveEncountersContext = React.createContext<number>(0);
// eslint-disable-next-line @typescript-eslint/no-empty-function
const SaveEncountersUpdateContext = React.createContext<{incEncountersSaved: () => void, resetEncountersSaved: () => void}>({incEncountersSaved: () => {}, resetEncountersSaved: () => {}});

export function useSave() {
    return useContext(SaveContext);
}

export function useSaveUpdate() {
    return useContext(SaveUpdateContext);
}

export function useSaveEncounters() {
    return useContext(SaveEncountersContext);
}

export function useSaveEncountersUpdate() {
    return useContext(SaveEncountersUpdateContext);
}

export function SaveProvider({ children }: ProviderProps) {
    const [scenesSaved, setScenesSaved] = useState(0);
    const [encountersSaved, setEncountersSaved] = useState(0);

    function incScenesSaved() {
        setScenesSaved(prevScenesSaved => prevScenesSaved + 1);
    }

    function resetScenesSaved() {
        setScenesSaved(0);
    }

    function incEncountersSaved() {
        setEncountersSaved(prevEncountersSaved => prevEncountersSaved + 1);
    }

    function resetEncountersSaved() {
        setEncountersSaved(0);
    }

    return (
        <SaveContext.Provider value={{ scenesSaved, encountersSaved }}>
            <SaveUpdateContext.Provider value={{ incScenesSaved, resetScenesSaved, incEncountersSaved, resetEncountersSaved }}>
                {children}
            </SaveUpdateContext.Provider>
        </SaveContext.Provider>
    );
}