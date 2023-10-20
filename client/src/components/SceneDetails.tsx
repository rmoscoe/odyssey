/* eslint-disable @typescript-eslint/no-non-null-assertion */
/* eslint-disable react-hooks/exhaustive-deps */
import React, { useState, useEffect, useRef, Dispatch, SetStateAction } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTheme } from '../utils/ThemeContext';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTrashAlt, faPlus } from '@fortawesome/free-solid-svg-icons';
import EncounterDetails from './EncounterDetails';
import { Carousel } from 'react-responsive-carousel';
import 'react-responsive-carousel/lib/styles/carousel.min.css';
import axios from 'axios';
import Cookies from 'js-cookie';

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

type isoScenes = Array<isoScene | null>;

interface SceneDetailsProps {
    scene: isoScene | null,
    scenes: isoScenes,
    setScenes: Dispatch<SetStateAction<isoScenes | undefined>>
    sceneIndex: number,
    edit: boolean,
    handleDeleteClick: (dType: string, dId: number) => void;
    startScene: (sceneId: number) => void;
    completeScene: (sceneId: number) => void;
    startEncounter: (encounterId: number) => void;
    completeEncounter: (encounterId: number) => void;
    loading: boolean;
    setActiveScene: (value: number) => void;
    deleting: string;
    setDeleting: (value: string) => void;
    sceneDelIdx: number | undefined;
    setSceneDelIdx: (value: number | undefined) => void;
    carouselKey: number;
    setCarouselKey: (value: number) => void;
    reloadRequired: boolean;
    setReloadRequired: (value: boolean) => void;
    removeScene: boolean;
    setRemoveScene: (value: boolean) => void;
    adventureId: number;
    saveScene: boolean;
    sceneSaved: boolean[];
    setSceneSaved: (arr: boolean[]) => void;
    setNotification: (value: string) => void;
    // adventureDetails: React.MutableRefObject<HTMLElement | null>
}

export default function SceneDetails({ scene, scenes, setScenes, sceneIndex, edit, handleDeleteClick, startScene, completeScene, startEncounter, completeEncounter, loading, setActiveScene, deleting, setDeleting, sceneDelIdx, setSceneDelIdx, carouselKey, setCarouselKey, reloadRequired, setReloadRequired, removeScene, setRemoveScene, adventureId, saveScene, sceneSaved, setSceneSaved, setNotification }: SceneDetailsProps) {
    const { theme } = useTheme();

    const { sequence, challenge, setting, encounter_set, plot_twist, clue, progress } = scene || {};
    let { id } = scene || {};
    const initialEncounterSaved = [];
    if (encounter_set) {
        for (let i = 0; i < encounter_set.length; i++) {
            initialEncounterSaved.push(true);
        }
    } else {
        initialEncounterSaved.push(true);
    }

    const [challengeText, setChallengeText] = useState(challenge);
    const [settingText, setSettingText] = useState(setting);
    const [plotTwistText, setPlotTwistText] = useState(plot_twist);
    const [clueText, setClueText] = useState(clue);
    const [statefulScene, setStatefulScene] = useState(scene);
    const [activeEncounter, setActiveEncounter] = useState(0);
    const [progressPct, setProgressPct] = useState(progress === "In Progress" ? 50 : progress === "Complete" ? 100 : 0);
    const [encounterCarouselKey, setEncounterCarouselKey] = useState(0);
    const [cols, setCols] = useState(calculateCols());
    const [saveEncounter, setSaveEncounter] = useState(false);
    const [encounterSaved, setEncounterSaved] = useState<boolean[]>([...initialEncounterSaved]);

    const navigate = useNavigate();

    const sceneDetailsRef = useRef<HTMLElement | null>(null);
    const challengeRef = useRef(null);
    const settingRef = useRef(null);
    const plotTwistRef = useRef(null);
    const clueRef = useRef(null);

    useEffect(() => {
        if (deleting === 'scene' && sceneDelIdx === sceneIndex) {
            const newScenes = scenes.filter((_s, i) => {
                return i !== sceneDelIdx;
            });
            if (newScenes.length > 0) {
                for (let i = sceneDelIdx; i < newScenes.length; i++) {
                    newScenes[i]!.sequence = i + 1;
                }
            }

            setScenes(newScenes.slice());
            setSceneDelIdx(undefined);
            setDeleting('');
            setCarouselKey(carouselKey + 1);
            setReloadRequired(true);
        }

        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [deleting]);

    useEffect(() => {
        if (reloadRequired) {
            setCarouselKey(carouselKey + 1);
            setReloadRequired(false);
        }
    }, [reloadRequired]);

    useEffect(() => {
        const executeSaveScene = async () => {
            const scenePayload = {
                adventure_id: adventureId,
                sequence: scene?.sequence,
                challenge: scene?.challenge,
                setting: scene?.setting,
                plot_twist: scene?.plot_twist,
                clue: scene?.clue
            }

            const sceneResponse = scene?.id ? await axios.patch(`/api/scenes/${scene.id}/`, scenePayload, { headers: { 'X-CSRFToken': Cookies.get('csrftoken') } }) : await axios.post(`/api/scenes/`, scenePayload, { headers: { 'X-CSRFToken': Cookies.get('csrftoken') } });

            if (sceneResponse.status === 401) {
                navigate('/login');
            } else if (sceneResponse.data) {
                id = sceneResponse.data.id;
                setSaveEncounter(true);
                if (encounter_set) {
                    const encountersSaved = [];
                    for (let i = 0; i < encounter_set.length; i++) {
                        encountersSaved.push(false)
                    }
                    setEncounterSaved(encountersSaved);
                }
            } else {
                setNotification('Oops! Something went wrong. Please try again.');
            }
        }
        if (saveScene) {
            executeSaveScene();
        }
    }, [saveScene]);

    useEffect(() => {
        if (!encounterSaved.includes(false)) {
            setSaveEncounter(false);
            const scenesSaved = [...sceneSaved];
            scenesSaved[sceneIndex] = true;
            setSceneSaved([...scenesSaved]);
            console.log("SceneSaved: " + scenesSaved);
        }
    }, [...encounterSaved]);

    useEffect(() => {
        let updatedScenes: isoScenes;
        if (!scenes || scenes.length === 0) {
            updatedScenes = [];
        } else {
            updatedScenes = scenes.slice();
        }

        updatedScenes[sceneIndex] = statefulScene;
        setScenes(updatedScenes);
    }, [statefulScene]);

    useEffect(() => {
        const dots = sceneDetailsRef.current?.querySelectorAll('.dot');
        const oldTheme = theme === "fantasy" ? "sci-fi" : "fantasy";
        dots?.forEach(dot => {
            dot.classList.add(`${theme}-dot`);
            dot.classList.remove(`${oldTheme}-dot`);
        });
    }, [activeEncounter]);

    useEffect(() => {
        if (removeScene) {
            const updatedScenes: isoScenes = [];
            scenes.forEach(s => {
                if (!s?.id || s.id !== id) {
                    updatedScenes.push(s);
                }
            });
            setScenes(updatedScenes);
            setCarouselKey(carouselKey + 1);
            setRemoveScene(false);
            setActiveScene(sceneIndex > 0 ? sceneIndex - 1 : sceneIndex);
        }
    }, [removeScene]);

    useEffect(() => {
        setProgressPct(progress === "In Progress" ? 50 : progress === "Complete" ? 100 : 0);
    }, [progress]);

    // useEffect(() => {
    //     resizeCarousel();
    // }, [statefulScene, scenes, edit, encounter_set, activeEncounter, sceneDetailsRef.current?.offsetHeight]);

    // const resizeCarousel = () => {
    //     const carousel = adventureDetails.current?.querySelector(".slider-wrapper");
    //     const sceneHeight = sceneDetailsRef.current?.offsetHeight;
    //     carousel?.setAttribute("style", `height: ${sceneHeight}px!important;`);
    // }

    useEffect(() => {
        const handleResize = () => {
            const newCols = calculateCols();
            setCols(newCols);
        };

        window.addEventListener('resize', handleResize);

        return () => {
            window.removeEventListener('resize', handleResize);
        };
    }, []);

    function calculateCols() {
        return window.innerWidth < 1024
            ? Math.round(88 - (1023 - window.innerWidth) * 0.1042471)
            : Math.round((window.innerWidth - 1024) * 0.03682171 + 28);
    }


    const addSceneBefore = () => {
        let updatedScenes: isoScenes;
        if (!scenes || scenes.length === 0) {
            updatedScenes = [];
        } else {
            updatedScenes = scenes.slice();
        }

        if (updatedScenes.length > 0) {
            for (let i = updatedScenes.length - 1; i >= sceneIndex; i--) {
                // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
                updatedScenes[i + 1] = scenes!.slice(i, i + 1)[0];
                // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
                updatedScenes[i + 1]!.sequence++;
            }
        }

        const newScene: isoScene = {
            sequence: sceneIndex + 1,
            challenge: '',
            setting: '',
            encounter_set: [{
                encounter_type: "",
                description: ""
            }],
            plot_twist: null,
            clue: null
        }

        updatedScenes[sceneIndex] = newScene;

        setScenes(updatedScenes);
    }

    const addSceneAfter = () => {
        let updatedScenes: isoScenes;
        if (!scenes || scenes.length === 0) {
            updatedScenes = [];
        } else {
            updatedScenes = scenes.slice();
        }

        const newScene: isoScene = {
            sequence: sequence ? sequence + 1 : 1,
            challenge: '',
            setting: '',
            encounter_set: [{
                encounter_type: "",
                description: ""
            }],
            plot_twist: null,
            clue: null
        }

        if (updatedScenes.length > 0) {
            for (let i = updatedScenes.length - 1; i > sceneIndex; i--) {
                // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
                updatedScenes[i + 1] = scenes!.slice(i, i + 1)[0];
                // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
                updatedScenes[i + 1]!.sequence++;
            }
        }

        const newIndex = sceneIndex + 1;

        updatedScenes[newIndex] = newScene;

        setScenes(updatedScenes);
        setActiveScene(newIndex)
    }

    const handleInputChange = (field: React.MutableRefObject<HTMLTextAreaElement | null>) => {
        const { current } = field;
        const inputValue: string | undefined = current?.value;

        switch (field) {
            case challengeRef:
                setChallengeText(inputValue);
                break;
            case settingRef:
                setSettingText(inputValue);
                break;
            case plotTwistRef:
                setPlotTwistText(inputValue);
                break;
            case clueRef:
                setClueText(inputValue);
                break;
            default:
                console.error(`Error: Input field ${current?.tagName} ID ${current?.id || ""} with Value ${current?.value || ""} not recognized.`);
        }
    }

    const handleSlideChange = (idx: number) => setActiveEncounter(idx);

    const deleteClickHandler = () => {
        if (id && id > 0) {
            handleDeleteClick("scenes", id);
        } else {
            setSceneDelIdx(sceneIndex);
            handleDeleteClick("scene", 0);
        }
    }

    return (
        <section ref={sceneDetailsRef} className={`bg-${theme}-stage-background rounded-2xl pt-2 pb-8 px-10 w-full`}>
            {edit && window.innerWidth < 1024 &&
                <section className="flex justify-between w-full px-2 mb-2 z-20">
                    <button onClick={addSceneBefore} className={`border-${theme}-accent border-[3px] rounded-xl text-lg bg-${theme}-primary text-${theme}-accent font-${theme}-text py-1 px-2`}>
                        <FontAwesomeIcon className={`text-${theme}-accent text-xl`} icon={faPlus} />
                        &nbsp; Before
                    </button>
                    <button onClick={addSceneAfter} className={`border-${theme}-accent border-[3px] rounded-xl text-lg bg-${theme}-primary text-${theme}-accent font-${theme}-text py-1 px-2`}>
                        <FontAwesomeIcon className={`text-${theme}-accent text-xl`} icon={faPlus} />
                        &nbsp; After
                    </button>
                    {progress !== "In Progress" && progress !== "Complete" &&
                        <button onClick={deleteClickHandler} className={`border-${theme}-accent border-[3px] rounded-xl text-lg bg-${theme}-primary text-${theme}-accent font-${theme}-text py-1 px-2 aspect-square`}>
                            <FontAwesomeIcon className={`text-${theme}-accent text-xl`} icon={faTrashAlt} />
                        </button>
                    }
                </section>
            }

            <section className="flex flex-wrap justify-between w-full px-2 mb-2 md:flex-nowrap">
                <h3 className={`font-${theme}-heading text-${theme}-form-heading text-xl`}>Scene {sequence}</h3>
                <div className={`h-3 mt-1.5 w-full border-${theme}-progress-border border-2 bg-${theme}-progress-void rounded-full z-20 lg:w-64`}>
                    <div className={`h-full bg-${theme}-progress-fill rounded-full`} style={{ width: `${progressPct}%` }}></div>
                </div>
                {edit && window.innerWidth >= 1024 &&
                    <section className="flex justify-between space-x-2 z-20">
                        <button onClick={addSceneBefore} className={`border-${theme}-accent border-[3px] rounded-xl text-lg bg-${theme}-primary text-${theme}-accent font-${theme}-text py-1 px-2`}>
                            <FontAwesomeIcon className={`text-${theme}-accent text-xl`} icon={faPlus} />
                            &nbsp; Before
                        </button>
                        <button onClick={addSceneAfter} className={`border-${theme}-accent border-[3px] rounded-xl text-lg bg-${theme}-primary text-${theme}-accent font-${theme}-text py-1 px-2`}>
                            <FontAwesomeIcon className={`text-${theme}-accent text-xl`} icon={faPlus} />
                            &nbsp; After
                        </button>
                        {progress !== "In Progress" && progress !== "Complete" &&
                            <button onClick={deleteClickHandler} className={`border-${theme}-accent border-[3px] rounded-xl text-lg bg-${theme}-primary text-${theme}-accent font-${theme}-text py-1 px-2 aspect-square`}>
                                <FontAwesomeIcon className={`text-${theme}-accent text-xl`} icon={faTrashAlt} />
                            </button>
                        }
                    </section>
                }
            </section>

            <section className="flex flex-wrap justify-between content-around w-full">
                <section className={`bg-${theme}-secondary rounded-lg p-2 w-full mt-2 lg:w-[45%]`}>
                    {!edit &&
                        <p className={`${theme}-text text-left`}>{scene?.challenge && scene.challenge !== "" ? `Goal: ${scene.challenge}` : ""}</p>
                    }
                    {edit &&
                        <>
                            <label htmlFor="challenge-textarea" className={`${theme}-label text-left block`}>Goal:</label>
                            <textarea
                                id={`challenge-textarea-${id}`}
                                name="challenge-textarea"
                                rows={5}
                                className={`bg-${theme}-field border-${theme}-primary border-[3px] rounded-xl text-${theme}-text text-lg px-1 py-2 mx-auto block`}
                                cols={cols}
                                onChange={() => handleInputChange(challengeRef)}
                                disabled={loading}
                                key={'challenge-textarea'}
                                value={challengeText || ""}
                                data-name="Challenge"
                                ref={challengeRef}
                            >
                                {challengeText}
                            </textarea>
                        </>
                    }
                </section>
                <section className={`bg-${theme}-secondary rounded-lg p-2 w-full mt-2 lg:w-[45%]`}>
                    {!edit &&
                        <p className={`${theme}-text text-left`}>{scene?.setting && scene.setting !== "" ? `Setting: ${scene.setting}` : ""}</p>
                    }
                    {edit &&
                        <>
                            <label htmlFor="setting-textarea" className={`${theme}-label text-left block`}>Setting:</label>
                            <textarea
                                id={`setting-textarea-${id}`}
                                name={`setting-textarea-${id}`}
                                rows={5}
                                className={`bg-${theme}-field border-${theme}-primary border-[3px] rounded-xl text-${theme}-text text-lg px-1 py-2 mx-auto block`}
                                cols={cols}
                                onChange={() => handleInputChange(settingRef)}
                                disabled={loading}
                                key={'setting-textarea'}
                                value={settingText || ""}
                                data-name="Setting"
                                ref={settingRef}
                            >
                                {settingText}
                            </textarea>
                        </>
                    }
                </section>
            </section>

            <section key={encounterCarouselKey} className="mt-2">
                <Carousel dynamicHeight={true} preventMovementUntilSwipeScrollTolerance={true} swipeScrollTolerance={edit ? 250 : 25} emulateTouch={!edit} centerMode={true} centerSlidePercentage={100} showStatus={false} showThumbs={false} selectedItem={activeEncounter} onChange={handleSlideChange} >
                    {encounter_set?.map((encounter, i) => (
                        <EncounterDetails key={encounter?.id || i} encounter={encounter!} encounters={encounter_set} encounterIndex={i} edit={edit} handleDeleteClick={handleDeleteClick} startEncounter={startEncounter} completeEncounter={completeEncounter} loading={loading} scene={scene!} statefulScene={statefulScene!} setStatefulScene={setStatefulScene} setActiveEncounter={setActiveEncounter} deleting={deleting} setDeleting={setDeleting} deleteEncounter={sceneDelIdx === sceneIndex} sceneIndex={sceneIndex} setSceneDelIdx={setSceneDelIdx} reloadRequired={reloadRequired} setReloadRequired={setReloadRequired} encounterCarouselKey={encounterCarouselKey} setEncounterCarouselKey={setEncounterCarouselKey} sceneId={id} saveEncounter={saveEncounter} encounterSaved={encounterSaved} setEncounterSaved={setEncounterSaved} setNotification={setNotification} />
                    ))}
                </Carousel>
            </section>

            <section className="flex flex-wrap justify-between content-around w-full">
                <section className={`bg-${theme}-secondary rounded-lg p-2 w-full mt-2 lg:w-[45%]`}>
                    {!edit &&
                        <p className={`${theme}-text text-left`}>{scene?.plot_twist && scene.plot_twist !== "" ? `Plot Twist: ${scene.challenge}` : ""}</p>
                    }
                    {edit &&
                        <>
                            <label htmlFor="plot-twist-textarea" className={`${theme}-label text-left block`}>Plot Twist:</label>
                            <textarea
                                id={`plot-twist-textarea-${id}`}
                                name={`plot-twist-textarea-${id}`}
                                rows={5}
                                className={`bg-${theme}-field border-${theme}-primary border-[3px] rounded-xl text-${theme}-text text-lg px-1 py-2 mx-auto block`}
                                cols={cols}
                                onChange={() => handleInputChange(plotTwistRef)}
                                disabled={loading}
                                key={'plot-twist-textarea'}
                                value={plotTwistText || ""}
                                data-name="Plot Twist"
                                ref={plotTwistRef}
                            >
                                {plotTwistText || ""}
                            </textarea>
                        </>
                    }
                </section>
                <section className={`bg-${theme}-secondary rounded-lg p-2 w-full mt-2 lg:w-[45%]`}>
                    {!edit &&
                        <p className={`${theme}-text text-left`}>{scene?.clue && scene.clue !== "" ? `Clue: ${scene.clue}` : ""}</p>
                    }
                    {edit &&
                        <>
                            <label htmlFor="clue-textarea" className={`${theme}-label text-left block`}>Clue:</label>
                            <textarea
                                id={`clue-textarea-${id}`}
                                name={`clue-textarea-${id}`}
                                rows={5}
                                className={`bg-${theme}-field border-${theme}-primary border-[3px] rounded-xl text-${theme}-text text-lg px-1 py-2 mx-auto block`}
                                cols={cols}
                                onChange={() => handleInputChange(clueRef)}
                                disabled={loading}
                                key={'clue-textarea'}
                                value={clueText || ""}
                                data-name="Clue"
                                ref={clueRef}
                            >
                                {clueText}
                            </textarea>
                        </>
                    }
                </section>
            </section>

            {progress !== "Complete" && (sceneIndex === 0 || scenes[sceneIndex - 1]?.progress === "Complete") &&
                <section className="flex justify-end w-full mt-2">
                    {progress === "Not Started" &&
                        <button onClick={() => { startScene(id || 0) }} className={`border-${theme}-accent border-[3px] rounded-xl text-lg bg-${theme}-primary text-${theme}-accent font-${theme}-text py-1 px-2`}>Start</button>
                    }
                    {progress === "In Progress" &&
                        <button onClick={() => { completeScene(id || 0) }} className={`border-${theme}-accent border-[3px] rounded-xl text-lg bg-${theme}-primary text-${theme}-accent font-${theme}-text py-1 px-2`}>Complete</button>
                    }
                </section>
            }

            {progress === "Complete" && !edit &&
                <div className={theme === "fantasy" ? "absolute inset-0 z-10 rounded-2xl bg-black/[.30]" : "absolute inset-0 z-10 rounded-2xl bg-white/[.30]"}></div>
            }

        </section>
    );
}