import React, { useState } from 'react';
import { useTheme } from '../utils/ThemeContext';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTrashAlt, faPencil, faFloppyDisk } from '@fortawesome/free-solid-svg-icons';

type Encounter = {
    id?: number | undefined;
    type: string | null;
    description: string | null;
    stats?: string | null;
}

type SceneData = {
    sequence: number;
    challenge: string | null;
    setting: string | null;
    encounters: Encounter[];
    plot_twist: string | null;
    clue: string | null;
}

type chapterObject = {
    chapterTitle: string;
    chapterContent: string | SceneData[] | null;
}

interface EncounterProps {
    encounter: Encounter;
    handleDeleteClick: () => void;
    editEncounter: boolean;
    deleting: string;
    setDeleting: (value: string) => void;
    sequence: number;
    editScene: boolean;
    setDeleteIdx: (value: number) => void;
    addEncounterBefore: (idx: number) => void;
    setDeleteType: (value: string) => void;
    chapter: chapterObject;
    setChapter: (value: chapterObject) => void;
    scenes: SceneData[];
    setScenes: (value: SceneData[]) => void;
    currentScene: number;
}

export default function Encounter({ encounter, handleDeleteClick, editEncounter, sequence, editScene, setDeleteIdx, addEncounterBefore, setDeleteType, chapter, setChapter, scenes, setScenes, currentScene }: EncounterProps) {
    const { theme } = useTheme();
    const [encounterType, setEncounterType] = useState(encounter.type);
    const [encounterDescription, setEncounterDescription] = useState(encounter.description);
    const [edit, setEdit] = useState(editEncounter);
    const [typeText, setTypeText] = useState('');
    const [descriptionText, setDescriptionText] = useState('');

    const eSeq = sequence;

    const clickEditEncounter = () => {
        setEdit(true);
        setTypeText(encounterType || '');
        setDescriptionText(encounterDescription || '');
    }

    const deleteEncounter = (idx: number) => {
        setDeleteIdx(idx);
        setDeleteType('encounter');
        handleDeleteClick();
    }

    const clickAddEncounterBefore = (idx: number) => {
        addEncounterBefore(idx);
        setEdit(true);
    }

    const saveEncounter = () => {
        setEncounterType(typeText);
        setEncounterDescription(descriptionText);

        const updatedEncounter = {
            type: encounterType,
            description: encounterDescription
        }

        const {sequence, challenge, setting, encounters, plot_twist, clue} = scenes[currentScene - 1];
        const updatedEncounterSet = [...encounters.slice(0, eSeq), updatedEncounter, ...encounters.slice(eSeq)];
        const updatedScene = {
            sequence,
            challenge,
            setting,
            encounters: updatedEncounterSet,
            plot_twist,
            clue
        }
        const updatedScenes = [...scenes.slice(0, currentScene - 1), updatedScene, ...scenes.slice(currentScene - 1)];

        setScenes(updatedScenes);
        setChapter({ chapterTitle: chapter.chapterTitle, chapterContent: scenes });

        setTypeText('');
        setDescriptionText('');
        setEdit(false);
    }

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        e.preventDefault();

        const { target } = e;
        const inputId = target.id;
        const inputValue = target.tagName === 'INPUT' ? target.value : target.innerText;

        switch (inputId) {
            case 'type-field':
                setTypeText(inputValue);
                break;
            case 'description-field':
                setDescriptionText(inputValue);
                break;
            default:
                console.error('Cannot update form. Invalid field ID');
                saveEncounter();
        }
    }

    return (
        <section className={`p-2 bg-${theme}-secondary rounded-2xl w-full`}>
            <section className="flex justify-between w-full">
                {!edit &&
                    <p className={`font-${theme}-text text-${theme}-text text-base`}>Type: {encounter.type}</p>
                }
                {edit &&
                    <>
                        <label htmlFor="type-field" className={`${theme}-label`}>Type:</label>
                        <input
                            type="text"
                            id="type-field"
                            name="type-field"
                            className={`bg-${theme}-field border-${theme}-primary border-[3px] rounded-xl text-${theme}-text flex shrink-0 basis-full text-lg px-1 py-2 mt-2`}
                            value={encounterType || ''}
                            onChange={handleInputChange}
                        />
                    </>
                }
                {!edit && editScene &&
                    <div className="button-container flex shrink-0 basis-12 ml-2 space-x-0.5 mb-1">
                        <button className={`border-${theme}-button-border bg-${theme}-primary border-2 rounded-xl p-1 aspect-square shrink-0 basis-11`} onClick={clickEditEncounter}>
                            <FontAwesomeIcon className={`text-${theme}-accent text-xl`} icon={faPencil} />
                        </button>
                        <button className={`border-${theme}-button-border bg-${theme}-primary border-2 rounded-xl p-1 aspect-square shrink-0 basis-11`} onClick={() => deleteEncounter(sequence)}>
                            <FontAwesomeIcon className={`text-${theme}-accent text-xl`} icon={faTrashAlt} />
                        </button>
                    </div>
                }
                {edit &&
                    <div className="button-container flex shrink-0 basis-12 ml-2 space-x-0.5 mb-1">
                        <button className={`border-${theme}-button-border bg-${theme}-primary border-2 rounded-xl p-1 aspect-square shrink-0 basis-11`} onClick={saveEncounter}>
                            <FontAwesomeIcon className={`text-${theme}-accent text-xl`} icon={faFloppyDisk} />
                        </button>
                    </div>
                }
            </section>
            {!edit &&
                <p className={`font-${theme}-text text-${theme}-text text-base`}>Description: {encounter.description}</p>
            }
            {edit &&
                <>
                    <label htmlFor="description-field" className={`${theme}-label`}>Description:</label>
                    <textarea
                        autoComplete="off"
                        id="description-field"
                        name="description-field"
                        className={`bg-${theme}-field border-${theme}-primary border-[3px] rounded-xl text-${theme}-text w-full text-lg px-1 py-2 mb-2`}
                        onChange={handleInputChange}
                        rows={4}
                    >
                        {encounterDescription || ''}
                    </textarea>
                </>
            }
            <button className={`border-${theme}-accent border-[3px] rounded-xl text-lg bg-${theme}-primary text-${theme}-accent font-${theme}-text py-1.5 px-6 my-2`} onClick={() => clickAddEncounterBefore(sequence)}>Add Encounter Before</button>
        </section>
    );
}