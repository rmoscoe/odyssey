/* eslint-disable react-hooks/exhaustive-deps */
import React, { useState, useEffect } from 'react';
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
type Chapter = {
    chapterTitle: string;
    chapterContent: string | SceneData[] | null;
}


interface EncounterProps {
    encounter: Encounter;
    handleDeleteClick: () => void;
    editEncounter: boolean;
    setEditEncounter: (idx: number, value: boolean) => void;
    deleting: string;
    setDeleting: (value: string) => void;
    sequence: number;
    editScene: boolean;
    setDeleteIdx: (value: number) => void;
    addEncounterBefore: (event: React.MouseEvent, idx: number) => void;
    setDeleteType: (value: string) => void;
    scenes: SceneData[];
    setScenes: (value: SceneData[]) => void;
    currentScene: number;
    chapter: Chapter;
    setChapter: (value: Chapter) => void;
}

export default function Encounter({ encounter, handleDeleteClick, editEncounter, setEditEncounter, sequence, editScene, setDeleteIdx, addEncounterBefore, setDeleteType, scenes, currentScene, chapter, setChapter }: EncounterProps) {
    const { theme } = useTheme();
    const [encounterType, setEncounterType] = useState(encounter.type);
    const [encounterDescription, setEncounterDescription] = useState(encounter.description);
    const [edit, setEdit] = useState(editEncounter);
    const [typeText, setTypeText] = useState('');
    const [descriptionText, setDescriptionText] = useState('');
    const [edited, setEdited] = useState(false);

    const eSeq = sequence;

    useEffect(() => {
        if (!edit && edited) {
            setEncounterType(typeText);
            setEncounterDescription(descriptionText);

            const updatedEncounter = {
                type: typeText,
                description: descriptionText
            }

            const { sequence, challenge, setting, encounters, plot_twist, clue } = JSON.parse(JSON.stringify(scenes[currentScene - 1]));
            const updatedEncounterSet = JSON.parse(JSON.stringify(encounters));
            updatedEncounterSet[eSeq] = updatedEncounter;
            const updatedScene = {
                sequence,
                challenge,
                setting,
                encounters: updatedEncounterSet,
                plot_twist,
                clue
            }
            const newScenes: SceneData[] = scenes.map((s) => {
                return s.sequence === updatedScene.sequence ? updatedScene : s
            });
            setEdited(false);

            // setScenes(updatedScenes);
            setChapter({ chapterTitle: chapter.chapterTitle, chapterContent: newScenes });
        }
    }, [edit, edited]);

    const clickEditEncounter = (event: React.MouseEvent) => {
        event.stopPropagation();
        setEdit(true);
        setEditEncounter(eSeq, true);
        setTypeText(encounterType || '');
        setDescriptionText(encounterDescription || '');
    }

    const deleteEncounter = (event: React.MouseEvent, idx: number) => {
        event?.stopPropagation()
        setDeleteIdx(idx);
        setDeleteType('encounter');
        handleDeleteClick();
    }

    const clickAddEncounterBefore = (event: React.MouseEvent, idx: number) => {
        event.stopPropagation();
        addEncounterBefore(event, idx);
        setEdit(true);
        setEditEncounter(eSeq, true);
    }

    const saveEncounter = (event: React.MouseEvent) => {
        event.stopPropagation();
        // console.log("Saving encounter...")
        // setEncounterType(typeText);
        // setEncounterDescription(descriptionText);

        // const updatedEncounter = {
        //     type: encounterType,
        //     description: encounterDescription
        // }

        // console.log("Updated Encounter: ", updatedEncounter);

        // const {sequence, challenge, setting, encounters, plot_twist, clue} = scenes[currentScene - 1];
        // const updatedEncounterSet = [...encounters.slice(0, eSeq), updatedEncounter, ...encounters.slice(eSeq)];
        // console.log("Updated Encounter Set: ", JSON.stringify(updatedEncounterSet));
        // const updatedScene = {
        //     sequence,
        //     challenge,
        //     setting,
        //     encounters: updatedEncounterSet,
        //     plot_twist,
        //     clue
        // }
        // console.log("Updated Scene: ", JSON.stringify(updatedScene));
        // const updatedScenes = [...scenes.slice(0, currentScene - 1), updatedScene, ...scenes.slice(currentScene - 1)];
        // console.log("Updated Scenes: ", JSON.stringify(updatedScenes));

        // setScenes(updatedScenes);
        // setChapter({ chapterTitle: chapter.chapterTitle, chapterContent: scenes });

        // setTypeText('');
        // setDescriptionText('');
        setEditEncounter(eSeq, false);
        setEdit(false);
        setEdited(true);
    }

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        e.stopPropagation();

        const { target } = e;
        const inputId = target.id;
        const inputValue = target.value;

        switch (inputId) {
            case 'type-field':
                setTypeText(inputValue);
                break;
            case 'description-field':
                setDescriptionText(inputValue);
                break;
            default:
                console.error('Cannot update form. Invalid field ID');
        }
    }

    return (
        <section className={`p-2 bg-${theme}-secondary rounded-2xl w-full overflow-auto`}>
            <section className="flex justify-between w-full items-start overflow-auto">
                {!edit &&
                    <p className={`font-${theme}-text text-${theme}-text text-base`}>Type: {encounter.type}</p>
                }
                {edit &&
                    <div className="flex flex-wrap basis-full mr-3">
                        <label htmlFor="type-field" className={`${theme}-label`}>Type:</label>
                        <input
                            type="text"
                            id="type-field"
                            name="type-field"
                            className={`bg-${theme}-field border-${theme}-primary border-[3px] rounded-xl text-${theme}-text flex shrink-0 basis-full w-full text-lg px-1 py-2 mt-2`}
                            value={typeText || ''}
                            onChange={handleInputChange}
                        />
                    </div>
                }
                {!edit && editScene &&
                    <div className="button-container flex shrink-0 basis-[5.75rem] ml-2 space-x-0.5 mb-1 justify-between">
                        <button className={`border-${theme}-button-border bg-${theme}-primary border-2 rounded-xl p-1 aspect-square shrink-0 basis-11`} onClick={clickEditEncounter}>
                            <FontAwesomeIcon className={`text-${theme}-accent text-xl`} icon={faPencil} />
                        </button>
                        <button className={`border-${theme}-button-border bg-${theme}-primary border-2 rounded-xl p-1 aspect-square shrink-0 basis-11`} onClick={(event) => deleteEncounter(event, sequence)}>
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
                        key={"description-field"}
                        id="description-field"
                        name="description-field"
                        className={`bg-${theme}-field border-${theme}-primary border-[3px] rounded-xl text-${theme}-text w-full text-lg px-1 py-2 mb-2`}
                        onChange={handleInputChange}
                        rows={4}
                        value={descriptionText}
                    >
                        {descriptionText}
                    </textarea>
                </>
            }
            {!edit && editScene &&
                <button className={`border-${theme}-accent border-[3px] rounded-xl text-lg bg-${theme}-primary text-${theme}-accent font-${theme}-text py-1.5 px-6 my-2`} onClick={(event) => clickAddEncounterBefore(event, sequence)}>Add Encounter Before</button>
            }
        </section>
    );
}