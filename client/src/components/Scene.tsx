/* eslint-disable react-hooks/exhaustive-deps */
import React, { useState, useEffect } from 'react';
import { useTheme } from '../utils/ThemeContext';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTrashAlt, faPencil, faFloppyDisk, faPlus } from '@fortawesome/free-solid-svg-icons';
import Encounter from './Encounter';

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

interface SceneProps {
    scene: SceneData;
    scenes: SceneData[];
    sceneIndex: number;
    setScenes: (value: SceneData[]) => void;
    handleDeleteClick: () => void;
    editScene: boolean;
    setEditScene: (value: boolean) => void;
    deleting: string;
    setDeleting: (value: string) => void;
    currentScene: number;
    setDeleteType: (value: string) => void;
    chapter: chapterObject;
    setChapter: (value: chapterObject) => void;
    addScene: (pos?: number) => void;
}

export default function Scene({ scene, scenes, sceneIndex, setScenes, handleDeleteClick, editScene, setEditScene, deleting, setDeleting, currentScene, setDeleteType, chapter, setChapter, addScene }: SceneProps) {
    const { theme } = useTheme();
    const [edit, setEdit] = useState(false);
    const [editEncounter, setEditEncounter] = useState<boolean[]>(new Array(scene.encounters?.length || 0).fill(false));
    const [challengeText, setChallengeText] = useState(scene.challenge ?? " ");
    const [settingText, setSettingText] = useState(scene.setting ?? " ");
    const [encounters, setEncounters] = useState<Encounter[]>(scene.encounters || []);
    const [plotTwist, setPlotTwist] = useState<string>(scene.plot_twist ?? " ");
    const [clue, setClue] = useState<string>(scene.clue ?? " ");
    const [addPlotTwist, setAddPlotTwist] = useState(false);
    const [addClue, setAddClue] = useState(false);
    const [deleteIdx, setDeleteIdx] = useState(0);
    const [encounterEditMode, setEncounterEditMode] = useState(false);

    const { chapterTitle } = chapter;

    useEffect(() => {
        if (deleting === 'scene') {
            const newScenes = [...scenes.slice(0, deleteIdx), ...scenes.slice(deleteIdx + 1)];
            for (let i = deleteIdx; i < newScenes.length; i++) {
                newScenes[i].sequence--;
            }
            setScenes(newScenes.slice());
            setChapter({ chapterTitle, chapterContent: scenes });
            setDeleting('');
            setDeleteType('');
        }

        if (deleting === 'encounter') {
            const newEncounters = [...scene.encounters.slice(0, deleteIdx), ...scene.encounters.slice(deleteIdx + 1)];
            const newScene = { ...scene };
            newScene.encounters = newEncounters;

            setScenes([...scenes.slice(0, currentScene - 1), newScene, ...scenes.slice(currentScene)]);
            setChapter({ chapterTitle, chapterContent: scenes });
            setDeleting('');
            setDeleteType('');
        }

        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [deleting]);

    useEffect(() => {
        if (editScene && currentScene === scene.sequence) {
            setEdit(true);
        }
        if (editScene && currentScene !== scene.sequence) {
            setEdit(false);
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [editScene, currentScene]);

    useEffect(() => {
        if (!edit) {
            const updatedScene = {
                sequence: scene.sequence,
                challenge: challengeText,
                setting: settingText,
                encounters: encounters,
                plot_twist: plotTwist,
                clue: clue
            }

            const newScenes = [...scenes.slice(0, sceneIndex), updatedScene, ...scenes.slice(sceneIndex + 1)];

            setChapter({ chapterTitle, chapterContent: newScenes });
        }
    }, [edit]);

    useEffect(() => {
        console.log("Rerendering. Encounters: ", scene.encounters);
        return;
    }, [scenes, encounterEditMode, encounters]);

    function clickEditScene(event: React.MouseEvent) {
        event.stopPropagation();
        setEditScene(true);
        setEdit(true);
        setChallengeText(scene.challenge ?? '');
        setSettingText(scene.setting ?? '');
        setEncounters(scene.encounters);
        setPlotTwist(scene.plot_twist ?? '');
        setClue(scene.clue ?? '');
    }

    const deleteScene = (event: React.MouseEvent, idx: number) => {
        event.stopPropagation();
        setDeleteIdx(idx);
        setDeleteType('scene')
        handleDeleteClick();
    }

    const setEditSingleEncounter = (idx: number, value: boolean) => {
        const editValues = [...editEncounter];
        editValues[idx] = value;
        setEditEncounter(editValues);
        for (let i = 0; i < editValues.length; i++) {
            if (editValues[i]) {
                setEncounterEditMode(true);
                console.log("Setting EncounterEditMode to True...");
                return;
            }
            setEncounterEditMode(false);
            console.log("Setting EncounterEditMode to False...");
        }
    }

    const addEncounterBefore = (event: React.MouseEvent, idx = 0) => {
        event.stopPropagation();
        const newEncounter = {
            id: undefined,
            type: '',
            description: '',
            stats: null
        }

        let newEncounters: Encounter[];
        if (!scene.encounters || scene.encounters.length === 0) {
            newEncounters = [newEncounter];
        } else {
            newEncounters = [...scene.encounters.slice(0, idx), newEncounter, ...scene.encounters.slice(idx)];
        }
        // if (newEncounters.length > 0) {
        //     for (let i = newEncounters.length - 1; i > idx; i--) {
        //         //eslint-disable-next-line @typescript-eslint/no-non-null-assertion
        //         newEncounters[i + 1] = scene.encounters!.slice(i, i+1)[0];
        //     }
        // }
        

        // newEncounters[idx] = newEncounter;

        // const updatedChapterContent = scenes.slice();

        const newScene = JSON.parse(JSON.stringify(scene));
        newScene.encounters = newEncounters;

        // updatedChapterContent[idx] = newScene;

        // setScenes(updatedChapterContent);
        // setChapter({ chapterTitle, chapterContent: updatedChapterContent });
        const newScenes = [...scenes.slice(0, currentScene - 1), newScene, ...scenes.slice(currentScene)];
        setScenes(newScenes);
        setEditSingleEncounter(idx, true);
    }

    const saveScene = (event: React.MouseEvent) => {
        event.stopPropagation();
        setAddPlotTwist(false);
        setAddClue(false);
        setEditScene(false);
        setEdit(false);
    }

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        e.stopPropagation();

        const { target } = e;
        console.log("Input ID: ", target.id);
        const inputId = target.id;
        const inputValue = target.value;
        console.log("Input Value: ", inputValue);

        switch (inputId) {
            case 'challenge-field':
                setChallengeText(inputValue);
                break;
            case 'setting-field':
                setSettingText(inputValue);
                break;
            case 'plot-twist-field-1':
                setPlotTwist(inputValue);
                break;
            case 'plot-twist-field-2':
                setPlotTwist(inputValue);
                break;
            case 'clue-field-1':
                setClue(inputValue);
                break;
            case 'clue-field-2':
                setClue(inputValue);
                break;
            default:
                console.error('Cannot update form. Invalid field ID');
        }
    }

    return (
        <section className={`px-10 py-2 bg-${theme}-scene rounded-2xl w-full`}>
            <section className="flex justify-between w-full mb-2">
                <h4 className={`font-${theme}-heading text-${theme}-accent text-lg`}>Scene {scene.sequence}</h4>
                {!edit &&
                    <div className="button-container flex shrink-0 basis-[5.75rem] ml-2 space-x-0.5 justify-between">
                        <button className={`border-${theme}-button-border bg-${theme}-primary border-2 rounded-xl p-1 aspect-square shrink-0 basis-11`} onClick={clickEditScene}>
                            <FontAwesomeIcon className={`text-${theme}-accent text-xl`} icon={faPencil} />
                        </button>
                        <button className={`border-${theme}-button-border bg-${theme}-primary border-2 rounded-xl p-1 aspect-square shrink-0 basis-11`} onClick={(event) => deleteScene(event, sceneIndex)}>
                            <FontAwesomeIcon className={`text-${theme}-accent text-xl`} icon={faTrashAlt} />
                        </button>
                    </div>
                }
                {edit &&
                    <div className="button-container flex shrink-0 basis-12 ml-2 space-x-0.5">
                        <button className={`border-${theme}-button-border bg-${theme}-primary border-2 rounded-xl p-1 aspect-square shrink-0 basis-11`} onClick={saveScene}>
                            <FontAwesomeIcon className={`text-${theme}-accent text-xl`} icon={faFloppyDisk} />
                        </button>
                    </div>
                }
            </section>

            <section className={`w-full p-2 mb-3 font-${theme}-text text-${theme}-scene-text text-base`}>
                <p className="mx-auto text-center font-bold mb-1">Goal:</p>
                {!edit &&
                    <p className="mb-3">{scene.challenge}</p>
                }
                {edit &&
                    <textarea
                        autoComplete="off"
                        key={"challenge-field"}
                        id="challenge-field"
                        name="challenge-field"
                        className={`bg-${theme}-field border-${theme}-neutral border-[3px] rounded-xl text-${theme}-text w-full text-lg px-1 py-2 mb-3`}
                        onChange={handleInputChange}
                        rows={4}
                        value={challengeText}
                    >
                        {challengeText}
                    </textarea>
                }
                <p className="mx-auto text-center font-bold mb-1">Setting:</p>
                {!edit &&
                    <p className="mb-3">{scene.setting}</p>
                }
                {edit &&
                    <textarea
                        autoComplete="off"
                        key={"setting-field"}
                        id="setting-field"
                        name="setting-field"
                        className={`bg-${theme}-field border-${theme}-neutral border-[3px] rounded-xl text-${theme}-text w-full text-lg px-1 py-2 mb-3`}
                        onChange={handleInputChange}
                        rows={4}
                        value={settingText}
                    >
                        {settingText}
                    </textarea>
                }
                {!edit &&
                    <p className="mx-auto text-center font-bold mb-1">Encounters:</p>
                }
                {edit &&
                    <div className="relative">
                        <p className="mx-auto text-center font-bold mb-1">Encounters:</p>
                        <button className={`absolute right-0 inset-y-0 border-${theme}-button-border bg-${theme}-primary border-2 rounded-xl p-1 aspect-square shrink-0 basis-11`} onClick={(event) => addEncounterBefore(event, scene.encounters.length > 0 ? scene.encounters.length : 0)}>
                            <FontAwesomeIcon className={`text-${theme}-accent text-xl`} icon={faPlus} />
                        </button>
                    </div>
                }
                <div className="space-y-2 mb-3">
                    {scene.encounters?.map((encounter, j) => (
                        <Encounter encounter={encounter} handleDeleteClick={handleDeleteClick} editEncounter={editEncounter[j]} setEditEncounter={setEditSingleEncounter} deleting={deleting} setDeleting={setDeleting} key={`encounter-${j}`} sequence={j} editScene={edit} setDeleteIdx={setDeleteIdx} addEncounterBefore={addEncounterBefore} setDeleteType={setDeleteType} scenes={scenes} setScenes={setScenes} currentScene={currentScene} chapter={chapter} setChapter={setChapter} />
                    ))}
                </div>
                {scene.plot_twist &&
                    <>
                        <p className="mx-auto text-center font-bold mb-1">Plot Twist:</p>
                        {!edit &&
                            <p className="mb-3">{scene.plot_twist}</p>
                        }
                        {edit &&
                            <textarea
                                autoComplete="off"
                                key={"plot-twist-field-1"}
                                id="plot-twist-field-1"
                                name="plot-twist-field-1"
                                className={`bg-${theme}-field border-${theme}-neutral border-[3px] rounded-xl text-${theme}-text w-full text-lg px-1 py-2 mb-3`}
                                onChange={handleInputChange}
                                rows={4}
                                value={plotTwist}
                            >
                                {plotTwist}
                            </textarea>
                        }
                    </>
                }
                {!scene.plot_twist && edit && !addPlotTwist &&
                    <button className={`border-${theme}-accent border-[3px] rounded-xl text-lg bg-${theme}-primary text-${theme}-accent font-${theme}-text py-1.5 px-6 mb-3`} onClick={() => setAddPlotTwist(true)}>Add Plot Twist</button>
                }
                {!scene.plot_twist && edit && addPlotTwist &&
                    <>
                        <p className="mx-auto text-center font-bold mb-1">Plot Twist:</p>
                        <textarea
                            autoComplete="off"
                            key={"plot-twist-field-2"}
                            id="plot-twist-field-2"
                            name="plot-twist-field-2"
                            className={`bg-${theme}-field border-${theme}-neutral border-[3px] rounded-xl text-${theme}-text w-full text-lg px-1 py-2 mb-3`}
                            onChange={handleInputChange}
                            rows={4}
                            value={plotTwist}
                        >
                            {plotTwist}
                        </textarea>
                    </>
                }
                {scene.clue &&
                    <>
                        <p className="mx-auto text-center font-bold mb-1">Clue:</p>
                        {!edit &&
                            <p className="mb-3">{scene.clue}</p>
                        }
                        {edit &&
                            <textarea
                                autoComplete="off"
                                key={"clue-field-1"}
                                id="clue-field-1"
                                name="clue-field-1"
                                className={`bg-${theme}-field border-${theme}-neutral border-[3px] rounded-xl text-${theme}-text w-full text-lg px-1 py-2 mb-3`}
                                onChange={handleInputChange}
                                rows={4}
                                value={clue}
                            >
                                {clue}
                            </textarea>
                        }
                    </>
                }
                {!scene.clue && edit && !addClue &&
                    <button className={`border-${theme}-accent border-[3px] rounded-xl text-lg bg-${theme}-primary text-${theme}-accent font-${theme}-text py-1.5 px-6 mb-3`} onClick={() => setAddClue(true)}>Add Clue</button>
                }
                {!scene.clue && edit && addClue &&
                    <>
                        <p className="mx-auto text-center font-bold mb-1">Clue:</p>
                        <textarea
                            autoComplete="off"
                            key={"clue-field-2"}
                            id="clue-field-2"
                            name="clue-field-2"
                            className={`bg-${theme}-field border-${theme}-neutral border-[3px] rounded-xl text-${theme}-text w-full text-lg px-1 py-2 mb-3`}
                            onChange={handleInputChange}
                            rows={4}
                            value={clue}
                        >
                            {clue}
                        </textarea>
                    </>
                }
            </section>
            {!edit &&
                <button className={`border-${theme}-accent border-[3px] rounded-xl text-lg bg-${theme}-primary text-${theme}-accent font-${theme}-text py-1.5 px-6 mb-2`} onClick={() => addScene(sceneIndex)}>Add Scene Before</button>
            }
        </section>
    );
}