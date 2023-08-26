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
    deleting: string;
    setDeleting: (value: string) => void;
    currentScene: number;
    setDeleteType: (value: string) => void;
    chapter: chapterObject;
    setChapter: (value: chapterObject) => void;
    addScene: (pos?: number) => void;
}

export default function Scene({ scene, scenes, sceneIndex, setScenes, handleDeleteClick, editScene, deleting, setDeleting, currentScene, setDeleteType, chapter, setChapter, addScene }: SceneProps) {
    const { theme } = useTheme();
    const [edit, setEdit] = useState(editScene);
    const [editEncounter, setEditEncounter] = useState(false);
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
                newScenes[i].sequence--;
            }
            setScenes(newScenes.slice());
            setChapter({ chapterTitle, chapterContent: scenes });
            setDeleting('');
            setDeleteType('');
        }

        if (deleting === 'encounter') {
            const newEncounters = [...scene.encounters.slice(0, deleteIdx), ...scene.encounters.slice(deleteIdx + 1)];
            const newScene = {...scene};
            newScene.encounters = newEncounters;

            setScenes([...scenes.slice(0, currentScene - 1), newScene, ...scenes.slice(currentScene)]);
            setChapter({ chapterTitle, chapterContent: scenes });
            setDeleting('');
            setDeleteType('');
        }

        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [deleting]);

    const clickEditScene = () => {
        setEdit(true);
        setChallengeText(scene.challenge || '');
        setSettingText(scene.setting || '');
        setEncounters(scene.encounters);
        setPlotTwist(scene.plot_twist ? scene.plot_twist : '');
        setClue(scene.clue ? scene.clue : '');
    }

    const deleteScene = (idx: number) => {
        setDeleteIdx(idx);
        setDeleteType('scene')
        handleDeleteClick();
    }

    const addEncounterBefore = (idx: number) => {
        const encounterSet = scene.encounters;
        const newEncounter = {
            id: undefined,
            type: '',
            description: '',
            stats: null
        }
        const newEncounters = [...encounterSet.slice(0, idx), newEncounter, ...encounterSet.slice(idx)];
        const newScene = {...scene};
        newScene.encounters = newEncounters;
        
        setScenes([...scenes.slice(0, currentScene - 1), newScene, ...scenes.slice(currentScene)]);
        setChapter({ chapterTitle, chapterContent: scenes });
        setEditEncounter(true);
    }

    const saveScene = () => {
        const updatedScene = {
            sequence: scene.sequence,
            challenge: challengeText,
            setting: settingText,
            encounters: encounters,
            plot_twist: plotTwist,
            clue: clue
        }
        
        const newScenes = [...scenes.slice(0, sceneIndex), updatedScene, ...scenes.slice(sceneIndex + 1)];

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
        <section className={`mx-4 px-6 py-2 bg-${theme}-scene rounded-2xl w-full`}>
            <section className="flex justify-between w-full mb-2">
                <h4 className={`font-${theme}-heading text-${theme}-accent text-lg`}>Scene {scene.sequence}</h4>
                {!edit &&
                    <div className="button-container flex shrink-0 basis-[5.75rem] ml-2 space-x-0.5 justify-between">
                        <button className={`border-${theme}-button-border bg-${theme}-primary border-2 rounded-xl p-1 aspect-square shrink-0 basis-11`} onClick={clickEditScene}>
                            <FontAwesomeIcon className={`text-${theme}-accent text-xl`} icon={faPencil} />
                        </button>
                        <button className={`border-${theme}-button-border bg-${theme}-primary border-2 rounded-xl p-1 aspect-square shrink-0 basis-11`} onClick={() => deleteScene(sceneIndex)}>
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
                        <button className={`absolute right-0 inset-y-0 border-${theme}-button-border bg-${theme}-primary border-2 rounded-xl p-1 aspect-square shrink-0 basis-11`} onClick={() => addEncounterBefore(scene.encounters !== null ? scene.encounters.length : 0)}>
                            <FontAwesomeIcon className={`text-${theme}-accent text-xl`} icon={faPlus} />
                        </button>
                    </div>
                }
                <div className="space-y-2 mb-3">
                    {scene.encounters?.map((encounter, j) => (
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
            <button className={`border-${theme}-accent border-[3px] rounded-xl text-lg bg-${theme}-primary text-${theme}-accent font-${theme}-text py-1.5 px-6 mb-2`} onClick={() => addScene(sceneIndex)}>Add Scene Before</button>
        </section>
    );
}