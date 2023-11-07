/* eslint-disable react-hooks/exhaustive-deps */
import React, { useState, useEffect, useRef } from 'react';
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
    sceneIdx: number;
    setSceneIdx: (value: number) => void;
    encounterIdx: number;
    setEncounterIdx: (value: number) => void;
}

export default function Scene({ scene, scenes, sceneIndex, setScenes, handleDeleteClick, editScene, setEditScene, deleting, setDeleting, currentScene, setDeleteType, chapter, setChapter, addScene, sceneIdx, setSceneIdx, encounterIdx, setEncounterIdx }: SceneProps) {
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

    const sceneRef = useRef<HTMLElement | null>(null);

    useEffect(() => {
        if (deleting === 'scene') {
            const newScenes = scenes.filter((_s, i) => {
                return i !== deleteIdx;
            });
            for (let i = deleteIdx; i < newScenes.length; i++) {
                newScenes[i].sequence = i + 1;
            }
            setScenes(newScenes.slice());
            setChapter({ chapterTitle, chapterContent: newScenes.slice() });
            setDeleting('');
            setDeleteType('');
        }

        if (deleting === 'encounter') {
            const updatedScenes = scenes.map((s, i) => {
                if (i === sceneIdx) {
                    const updatedEncounters = s.encounters.filter((_e, i) => i !== encounterIdx);
                    return {
                        ...s,
                        encounters: updatedEncounters,
                    };
                }
                return s;
            });
            setScenes(updatedScenes.slice());
            setChapter({ chapterTitle, chapterContent: updatedScenes.slice() });
            setDeleting('');
            setDeleteType('');
        }

        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [deleting]);

    useEffect(() => {
        if (editScene && currentScene === scene.sequence) {
            setEdit(true);
            resizeCarousel();
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
                encounters: scene.encounters,
                plot_twist: plotTwist,
                clue: clue
            }

            const newScenes: SceneData[] = scenes.map((s) => {
                return s.sequence === updatedScene.sequence ? updatedScene : s
            });
            setChapter({ chapterTitle, chapterContent: newScenes });
        }
    }, [edit]);

    useEffect(() => {
        resizeCarousel();
    }, [scenes, encounterEditMode, encounters]);

    const resizeCarousel = () => {
        const carousel = document.querySelector(".slider-wrapper");
        const sceneHeight = sceneRef.current?.offsetHeight;
        carousel?.setAttribute("style", `height: ${sceneHeight}px;`);
    }

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
                return;
            }
            setEncounterEditMode(false);
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

        const newScene: SceneData = JSON.parse(JSON.stringify(scene));
        let newEncounters: Encounter[];
        if (!newScene.encounters || newScene.encounters.length === 0) {
            newEncounters = [newEncounter];
        } else {
            newEncounters = [...newScene.encounters.slice(0, idx), newEncounter, ...newScene.encounters.slice(idx)];
        }
        
        newScene.encounters = newEncounters;

        const newScenes: SceneData[] = scenes.map((s) => {
            return s.sequence === newScene.sequence ? newScene : s
        });
        setChapter({ chapterTitle, chapterContent: newScenes });
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
        const inputId = target.id;
        const inputValue = target.value;

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
        <section ref={sceneRef} className={`px-10 py-2 bg-${theme}-scene rounded-2xl w-full`}>
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
                <p className={`mx-auto text-center font-bold mb-1 text-${theme}-accent`}>Goal:</p>
                {!edit &&
                    <p className={`mb-3 text-${theme}-toggle-border`}>{scene.challenge}</p>
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
                <p className={`mx-auto text-center font-bold mb-1 text-${theme}-accent`}>Setting:</p>
                {!edit &&
                    <p className={`mb-3 text-${theme}-toggle-border`}>{scene.setting}</p>
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
                    <p className={`mx-auto text-center font-bold mb-1 text-${theme}-accent`}>Encounters:</p>
                }
                {edit &&
                    <div className="relative h-14">
                        <p className={`mx-auto text-center font-bold mb-1 text-${theme}-accent`}>Encounters:</p>
                        <div className="flex absolute right-0 inset-y-0 h-11">
                            <button className={`border-${theme}-button-border bg-${theme}-primary border-2 rounded-xl p-1 aspect-square shrink-0 basis-11`} onClick={(event) => addEncounterBefore(event, scene.encounters.length > 0 ? scene.encounters.length : 0)}>
                                <FontAwesomeIcon className={`text-${theme}-accent text-xl`} icon={faPlus} />
                            </button>
                        </div>
                    </div>
                }
                <div className="space-y-2 mb-3">
                    {scene.encounters?.map((encounter, j) => (
                        <Encounter encounter={encounter} handleDeleteClick={handleDeleteClick} editEncounter={editEncounter[j]} setEditEncounter={setEditSingleEncounter} deleting={deleting} setDeleting={setDeleting} key={`encounter-${currentScene}-${j}`} sequence={j} editScene={edit} setEncounterIdx={setEncounterIdx} addEncounterBefore={addEncounterBefore} setDeleteType={setDeleteType} scenes={scenes} setScenes={setScenes} currentScene={currentScene} chapter={chapter} setChapter={setChapter} setSceneIdx={setSceneIdx} scene={scene} />
                    ))}
                </div>
                {scene.plot_twist &&
                    <>
                        <p className={`mx-auto text-center font-bold mb-1 text-${theme}-accent`}>Plot Twist:</p>
                        {!edit &&
                            <p className={`mb-3 text-${theme}-toggle-border`}>{scene.plot_twist}</p>
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
                        <p className={`mx-auto text-center font-bold mb-1 text-${theme}-accent`}>Plot Twist:</p>
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
                        <p className={`mx-auto text-center font-bold mb-1 text-${theme}-accent`}>Clue:</p>
                        {!edit &&
                            <p className={`mb-3 text-${theme}-toggle-border`}>{scene.clue}</p>
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
                        <p className={`mx-auto text-center font-bold mb-1 text-${theme}-accent`}>Clue:</p>
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