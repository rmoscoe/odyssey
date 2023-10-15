/* eslint-disable @typescript-eslint/no-non-null-assertion */
/* eslint-disable react-hooks/exhaustive-deps */
import React, { useState, useEffect, useRef, Dispatch, SetStateAction } from 'react';
import { useTheme } from '../utils/ThemeContext';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTrashAlt, faPlus } from '@fortawesome/free-solid-svg-icons';
import EncounterDetails from './EncounterDetails';
import { Carousel } from 'react-responsive-carousel';
import 'react-responsive-carousel/lib/styles/carousel.min.css';

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
    // adventureDetails: React.MutableRefObject<HTMLElement | null>
}

export default function SceneDetails({ scene, scenes, setScenes, sceneIndex, edit, handleDeleteClick, startScene, completeScene, startEncounter, completeEncounter, loading, setActiveScene }: SceneDetailsProps) {
    const { theme } = useTheme();

    const { id, sequence, challenge, setting, encounter_set, plot_twist, clue, progress } = scene || {};
    // let { progress } = scene || {};

    const [challengeText, setChallengeText] = useState(challenge);
    const [settingText, setSettingText] = useState(setting);
    const [plotTwistText, setPlotTwistText] = useState(plot_twist);
    const [clueText, setClueText] = useState(clue);
    const [statefulScene, setStatefulScene] = useState(scene);
    const [activeEncounter, setActiveEncounter] = useState(0);
    const [progressPct, setProgressPct] = useState(progress === "In Progress" ? 50 : progress === "Complete" ? 100 : 0);

    const sceneDetailsRef = useRef<HTMLElement | null>(null);
    const challengeRef = useRef(null);
    const settingRef = useRef(null);
    const plotTwistRef = useRef(null);
    const clueRef = useRef(null);

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

    const cols = window.innerWidth < 1024 ? 30 : 47;

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
                        <button onClick={() => handleDeleteClick("scenes", id || 0)} className={`border-${theme}-accent border-[3px] rounded-xl text-lg bg-${theme}-primary text-${theme}-accent font-${theme}-text py-1 px-2 aspect-square`}>
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
                            <button onClick={() => handleDeleteClick("scenes", id || 0)} className={`border-${theme}-accent border-[3px] rounded-xl text-lg bg-${theme}-primary text-${theme}-accent font-${theme}-text py-1 px-2 aspect-square`}>
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
                            <label htmlFor="challenge-textarea" className={`${theme}-label block`}>Goal:</label>
                            <textarea
                                id={`challenge-textarea-${id}`}
                                name="challenge-textarea"
                                rows={5}
                                className={`bg-${theme}-field border-${theme}-primary border-[3px] rounded-xl text-${theme}-text text-lg px-1 py-2 block`}
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
                            <label htmlFor="setting-textarea" className={`${theme}-label block`}>Setting:</label>
                            <textarea
                                id={`setting-textarea-${id}`}
                                name={`setting-textarea-${id}`}
                                rows={5}
                                className={`bg-${theme}-field border-${theme}-primary border-[3px] rounded-xl text-${theme}-text text-lg px-1 py-2 block`}
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

            <section className="mt-2">
                <Carousel dynamicHeight={true} preventMovementUntilSwipeScrollTolerance={true} swipeScrollTolerance={edit ? 250 : 25} emulateTouch={!edit} centerMode={true} centerSlidePercentage={100} showStatus={false} showThumbs={false} selectedItem={activeEncounter} onChange={handleSlideChange} >
                    {encounter_set?.map((encounter, i) => (
                        <EncounterDetails key={encounter?.id || i} encounter={encounter!} encounters={encounter_set} encounterIndex={i} edit={edit} handleDeleteClick={handleDeleteClick} startEncounter={startEncounter} completeEncounter={completeEncounter} loading={loading} scene={scene!} setStatefulScene={setStatefulScene} setActiveEncounter={setActiveEncounter} />
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
                            <label htmlFor="plot-twist-textarea" className={`${theme}-label block`}>Plot Twist:</label>
                            <textarea
                                id={`plot-twist-textarea-${id}`}
                                name={`plot-twist-textarea-${id}`}
                                rows={5}
                                className={`bg-${theme}-field border-${theme}-primary border-[3px] rounded-xl text-${theme}-text text-lg px-1 py-2 block`}
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
                            <label htmlFor="clue-textarea" className={`${theme}-label block`}>Clue:</label>
                            <textarea
                                id={`clue-textarea-${id}`}
                                name={`clue-textarea-${id}`}
                                rows={5}
                                className={`bg-${theme}-field border-${theme}-primary border-[3px] rounded-xl text-${theme}-text text-lg px-1 py-2 block`}
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
                <div className={theme === "fantasy" ? "absolute inset-0 z-10 bg-black/[.30]" : "absolute inset-0 z-10 bg-white/[.30]"}></div>
            }

        </section>
    );
}