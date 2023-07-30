import React, { useState, useEffect } from 'react';
import { useTheme } from '../utils/ThemeContext';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTrashAlt, faPencil, faFloppyDisk, faPlus } from '@fortawesome/free-solid-svg-icons';
import Encounter from './Encounter';

type Encounter = {
    id?: number | undefined;
    encounter_type: string | null;
    description: string | null;
    stats?: string | null;
}

type SceneData = {
    sequence: number;
    challenge: string | null;
    setting: string | null;
    encounter_set: Encounter[];
    plot_twist: string | null;
    clue: string | null;
}

type chapterObject = {
    chapterTitle: string;
    chapterContent: string | SceneData[] | null;
}

interface SceneProps {
    scenes: SceneData[];
    setScenes: (value: SceneData[]) => void;
    handleDeleteClick: () => void;
    editScene: boolean;
    deleting: string;
    setDeleting: (value: string) => void;
    currentScene: number;
    setDeleteType: (value: string) => void;
    chapter: chapterObject;
    setChapter: (value: chapterObject) => void;
    addScene: (pos?: number) => void;
}

export default function Scene({ scenes, setScenes, handleDeleteClick, editScene, deleting, setDeleting, currentScene, setDeleteType, chapter, setChapter, addScene }: SceneProps) {
    const { theme } = useTheme();
    const [edit, setEdit] = useState(editScene);
    const [editEncounter, setEditEncounter] = useState(false);
    // const [encounterToEdit, setEncounterToEdit] = useState(0);
    const [challengeText, setChallengeText] = useState('');
    const [settingText, setSettingText] = useState('');
    const [encounters, setEncounters] = useState<Encounter[]>([]);
    const [plotTwist, setPlotTwist] = useState<string | null>(null);
    const [clue, setClue] = useState<string | null>(null);
    const [addPlotTwist, setAddPlotTwist] = useState(false);
    const [addClue, setAddClue] = useState(false);
    const [deleteIdx, setDeleteIdx] = useState(0);

    const { chapterTitle } = chapter;

    useEffect(() => {
        if (deleting === 'scene') {
            const newScenes = [...scenes.slice(0, deleteIdx), ...scenes.slice(deleteIdx + 1)];
            for (let i = deleteIdx; i < newScenes.length; i++) {
                scenes[i].sequence--;
            }
            setScenes(newScenes.slice());
            setChapter({ chapterTitle, chapterContent: scenes });
            setDeleting('');
            setDeleteType('');
        }

        if (deleting === 'encounter') {
            const newEncounters = [...scenes[currentScene - 1].encounter_set.slice(0, deleteIdx), ...scenes[currentScene - 1].encounter_set.slice(deleteIdx + 1)]
            const scene = scenes[currentScene - 1];
            scene.encounter_set = newEncounters;

            setScenes([...scenes.slice(0, currentScene - 1), scene, ...scenes.slice(currentScene + 1)]);
            setChapter({ chapterTitle, chapterContent: scenes });
            setDeleting('');
            setDeleteType('');
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

    const deleteScene = (idx: number) => {
        setDeleteIdx(idx);
        setDeleteType('scene')
        handleDeleteClick();
    }

    const addEncounterBefore = (idx: number) => {
        const encounterSet = scenes[currentScene - 1].encounter_set;
        const newEncounter = {
            id: undefined,
            encounter_type: '',
            description: '',
            stats: null
        }
        const newEncounters = [...encounterSet.slice(0, idx), newEncounter, ...encounterSet.slice(idx)];
        const scene = scenes[currentScene - 1];
        scene.encounter_set = newEncounters;
        
        setScenes([...scenes.slice(0, currentScene - 1), scene, ...scenes.slice(currentScene + 1)]);
        setChapter({ chapterTitle, chapterContent: scenes });
        setEditEncounter(true);
    }

    const saveScene = () => {
        const idx = currentScene - 1;
        const existingScene = scenes[idx];
        const updatedScene = {
            sequence: existingScene.sequence,
            challenge: challengeText,
            setting: settingText,
            encounter_set: encounters,
            plot_twist: plotTwist,
            clue: clue
        }
        
        const newScenes = [...scenes.slice(0, idx), updatedScene, ...scenes.slice(idx + 1)];

        setScenes(newScenes);
        setChapter({ chapterTitle, chapterContent: scenes });

        setChallengeText('');
        setSettingText('');
        setEncounters([]);
        setPlotTwist(null);
        setClue(null);
        setAddPlotTwist(false);
        setAddClue(false);
        setEdit(false);
    }

    // const addEncounter = (pos = 0) => {
    //     if (scenes[sceneToEdit].encounter_set.length > 0) {
    //         for (let i = scenes[sceneToEdit].encounter_set.length; i >= pos; i--) {
    //             scenes[sceneToEdit].encounter_set[i] = scenes[sceneToEdit].encounter_set[i - 1];
    //         }
    //     }

    //     scenes[sceneToEdit].encounter_set[pos] = {
    //         id: undefined,
    //         encounter_type: '',
    //         description: '',
    //         stats: null
    //     }

    //     // setEncounterToEdit(pos + 1);
    //     setEditEncounter(true);
    // }

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

    return scenes.map((scene, i) => (
        <section className={`p-2 bg-${theme}-scene rounded-2xl w-full`} key={`scene-${i}`}>
            <section className="flex justify-between w-full mb-2">
                <h4 className={`font-${theme}-heading text-${theme}-accent text-lg`}>Scene {scene.sequence}</h4>
                {!edit &&
                    <div className="button-container flex shrink-0 basis-12 ml-2 space-x-0.5">
                        <button className={`border-${theme}-button-border bg-${theme}-primary border-2 rounded-xl p-1 aspect-square shrink-0 basis-11`} onClick={clickEditScene}>
                            <FontAwesomeIcon className={`text-${theme}-accent text-xl`} icon={faPencil} />
                        </button>
                        <button className={`border-${theme}-button-border bg-${theme}-primary border-2 rounded-xl p-1 aspect-square shrink-0 basis-11`} onClick={() => deleteScene(i)}>
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
                        id="challenge-field"
                        name="challenge-field"
                        className={`bg-${theme}-field border-${theme}-neutral border-[3px] rounded-xl text-${theme}-text w-full text-lg px-1 py-2 mb-3`}
                        onChange={handleInputChange}
                        rows={4}
                    >
                        {scene.challenge}
                    </textarea>
                }
                <p className="mx-auto text-center font-bold mb-1">Setting:</p>
                {!edit &&
                    <p className="mb-3">{scene.setting}</p>
                }
                {edit &&
                    <textarea
                        autoComplete="off"
                        id="setting-field"
                        name="setting-field"
                        className={`bg-${theme}-field border-${theme}-neutral border-[3px] rounded-xl text-${theme}-text w-full text-lg px-1 py-2 mb-3`}
                        onChange={handleInputChange}
                        rows={4}
                    >
                        {scene.setting}
                    </textarea>
                }
                {!edit &&
                    <p className="mx-auto text-center font-bold mb-1">Encounters:</p>
                }
                {edit &&
                    <div className="relative">
                        <p className="mx-auto text-center font-bold mb-1">Encounters:</p>
                        <button className={`absolute right-0 inset-y-0 border-${theme}-button-border bg-${theme}-primary border-2 rounded-xl p-1 aspect-square shrink-0 basis-11`} onClick={() => addEncounterBefore(scene.encounter_set !== null ? scene.encounter_set.length : 0)}>
                            <FontAwesomeIcon className={`text-${theme}-accent text-xl`} icon={faPlus} />
                        </button>
                    </div>
                }
                <div className="space-y-2 mb-3">
                    {scene.encounter_set.map((encounter, j) => (
                        <Encounter encounter={encounter} handleDeleteClick={handleDeleteClick} editEncounter={editEncounter} deleting={deleting} setDeleting={setDeleting} key={`encounter-${j}`} sequence={j} editScene={edit} setDeleteIdx={setDeleteIdx} addEncounterBefore={addEncounterBefore} setDeleteType={setDeleteType} chapter={chapter} setChapter={setChapter} scenes={scenes} setScenes={setScenes} currentScene={currentScene}/>
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
                                id="plot-twist-field"
                                name="plot-twist-field"
                                className={`bg-${theme}-field border-${theme}-neutral border-[3px] rounded-xl text-${theme}-text w-full text-lg px-1 py-2 mb-3`}
                                onChange={handleInputChange}
                                rows={4}
                            >
                                {scene.setting}
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
                            id="plot-twist-field"
                            name="plot-twist-field"
                            className={`bg-${theme}-field border-${theme}-neutral border-[3px] rounded-xl text-${theme}-text w-full text-lg px-1 py-2 mb-3`}
                            onChange={handleInputChange}
                            rows={4}
                        >
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
                                id="clue-field"
                                name="clue-field"
                                className={`bg-${theme}-field border-${theme}-neutral border-[3px] rounded-xl text-${theme}-text w-full text-lg px-1 py-2 mb-3`}
                                onChange={handleInputChange}
                                rows={4}
                            >
                                {scene.clue}
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
                            id="clue-field"
                            name="clue-field"
                            className={`bg-${theme}-field border-${theme}-neutral border-[3px] rounded-xl text-${theme}-text w-full text-lg px-1 py-2 mb-3`}
                            onChange={handleInputChange}
                            rows={4}
                        >
                        </textarea>
                    </>
                }
            </section>
            <button className={`border-${theme}-accent border-[3px] rounded-xl text-lg bg-${theme}-primary text-${theme}-accent font-${theme}-text py-1.5 px-6 mb-2`} onClick={() => addScene(i)}>Add Scene Before</button>
        </section>
    ));
}