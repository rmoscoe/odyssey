/* eslint-disable react-hooks/exhaustive-deps */
import React, { useState, useEffect, useRef } from 'react';
import { useTheme } from '../utils/ThemeContext';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTrashAlt, faPlus } from '@fortawesome/free-solid-svg-icons';
import EncounterDetails from './EncounterDetails';

type isoScene = {
    id?: number;
    sequence: number;
    challenge: string | null;
    setting: string | null;
    encounter_set: [{
        id?: number;
        encounter_type: string | null;
        description: string | null;
        stats?: string | null;
        progress?: string;
    } | null];
    plot_twist: string | null;
    clue: string | null;
    progress?: string;
};

interface SceneDetailsProps {
    scene: isoScene | null,
    scenes: Array<isoScene | null>,
    sceneIndex: number,
    edit: boolean,
    setDeleteType: (value: string) => void;
    setDeleteId: (value: number) => void;
    handleDeleteClick: (dType: string, dId: number) => void;
    startScene: (sceneId: number) => void;
    completeScene: (sceneId: number) => void;
    startEncounter: (encounterId: number) => void;
    completeEncounter: (encounterId: number) => void;
}

export default function SceneDetails({ scene, scenes, sceneIndex, edit, setDeleteType, setDeleteId, handleDeleteClick, startScene, completeScene, startEncounter, completeEncounter }: SceneDetailsProps) {
    const { theme } = useTheme();

    const { id, sequence, challenge, setting, encounter_set, plot_twist, clue } = scene || {};
    let { progress } = scene;

    return (
        <section className={`m-2 bg-${theme}-stage-background rounded-2xl p-2 w-full`}>
            {edit && window.innerWidth < 1024 &&
                <section className="flex justify-between w-full px-2 mb-2">
                    <button onClick={addSceneBefore} className={`border-${theme}-button-alt-border border-[3px] rounded-xl text-lg bg-${theme}-primary text-${theme}-accent font-${theme}-text py-1`}>
                        <FontAwesomeIcon className={`text-${theme}-accent text-xl`} icon={faPlus} />
                        &nbsp; Before
                    </button>
                    <button onClick={addSceneAfter} className={`border-${theme}-button-alt-border border-[3px] rounded-xl text-lg bg-${theme}-primary text-${theme}-accent font-${theme}-text py-1`}>
                        <FontAwesomeIcon className={`text-${theme}-accent text-xl`} icon={faPlus} />
                        &nbsp; After
                    </button>
                    <button onClick={deleteScene} className={`border-${theme}-button-alt-border border-[3px] rounded-xl text-lg bg-${theme}-primary text-${theme}-accent font-${theme}-text py-1 aspect-square`}>
                        <FontAwesomeIcon className={`text-${theme}-accent text-xl`} icon={faTrashAlt} />
                    </button>
                </section>
            }

            <section className="flex justify-between w-full px-2 mb-2">
                <h3 className={`font-${theme}-heading text-${theme}-form-heading text-xl`}>Scene &nbsp; {sequence}</h3>
                <div className={`h-3 mt-1.5 w-full border-${theme}-progress-border border-2 bg-${theme}-progress-void rounded-full lg:hidden`}>
                    <div className={`h-full bg-${theme}-progress-fill rounded-full`} style={{ width: `${progress}%` }}></div>
                </div>
                {edit && window.innerWidth >= 1024 &&
                    <section className="flex justify-between space-x-2">
                        <button onClick={addSceneBefore} className={`border-${theme}-button-alt-border border-[3px] rounded-xl text-lg bg-${theme}-primary text-${theme}-accent font-${theme}-text py-1`}>
                            <FontAwesomeIcon className={`text-${theme}-accent text-xl`} icon={faPlus} />
                            &nbsp; Before
                        </button>
                        <button onClick={addSceneAfter} className={`border-${theme}-button-alt-border border-[3px] rounded-xl text-lg bg-${theme}-primary text-${theme}-accent font-${theme}-text py-1`}>
                            <FontAwesomeIcon className={`text-${theme}-accent text-xl`} icon={faPlus} />
                            &nbsp; After
                        </button>
                        <button onClick={deleteScene} className={`border-${theme}-button-alt-border border-[3px] rounded-xl text-lg bg-${theme}-primary text-${theme}-accent font-${theme}-text py-1 aspect-square`}>
                            <FontAwesomeIcon className={`text-${theme}-accent text-xl`} icon={faTrashAlt} />
                        </button>
                    </section>
                }
            </section>

        </section>
    );
}