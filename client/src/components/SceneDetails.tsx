/* eslint-disable react-hooks/exhaustive-deps */
import React, { useState, useEffect, useRef } from 'react';
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
    loading: boolean;
}

export default function SceneDetails({ scene, scenes, sceneIndex, edit, setDeleteType, setDeleteId, handleDeleteClick, startScene, completeScene, startEncounter, completeEncounter, loading }: SceneDetailsProps) {
    const { theme } = useTheme();

    const { id, sequence, challenge, setting, encounter_set, plot_twist, clue } = scene || {};
    let { progress } = scene;

    const [challengeText, setChallengeText] = useState(challenge);
    const [settingText, setSettingText] = useState(setting);
    const [plotTwistText, setPlotTwistText] = useState(plot_twist);
    const [clueText, setClueText] = useState(clue);

    const cols = window.innerWidth < 1024 ? 30 : 47;


    return (
        <section className={`m-2 bg-${theme}-stage-background rounded-2xl py-2 px-10 w-full`}>
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

            <section className="flex flex-wrap justify-between content-around lg:mt-2 w-full">
                <section className={`bg-${theme}-secondary rounded-l p-2 w-full lg:w-5/12`}>
                    {!edit &&
                        <p className={`${theme}-text`}>{scene?.challenge && scene.challenge !== "" ? `Goal: ${scene.challenge}` : ""}</p>
                    }
                    {edit &&
                        <>
                            <label htmlFor="challenge-textarea" className={`${theme}-label block`}>Goal:</label>
                            <textarea
                                id="challenge-textarea"
                                name="challenge-textarea"
                                rows={5}
                                className={`bg-${theme}-field border-${theme}-primary border-[3px] rounded-xl text-${theme}-text text-lg px-1 py-2 block`}
                                cols={cols}
                                onChange={handleInputChange}
                                disabled={loading}
                                key={'challenge-textarea'}
                                value={challengeText || ""}
                                data-name="Challenge"
                            >
                                {challengeText}
                            </textarea>
                        </>
                    }
                </section>
                <section className={`bg-${theme}-secondary rounded-l p-2 w-full lg:w-5/12`}>
                    {!edit &&
                        <p className={`${theme}-text`}>{scene?.setting && scene.setting !== "" ? `Setting: ${scene.setting}` : ""}</p>
                    }
                    {edit &&
                        <>
                            <label htmlFor="setting-textarea" className={`${theme}-label block`}>Goal:</label>
                            <textarea
                                id="setting-textarea"
                                name="setting-textarea"
                                rows={5}
                                className={`bg-${theme}-field border-${theme}-primary border-[3px] rounded-xl text-${theme}-text text-lg px-1 py-2 block`}
                                cols={cols}
                                onChange={handleInputChange}
                                disabled={loading}
                                key={'setting-textarea'}
                                value={settingText || ""}
                                data-name="Setting"
                            >
                                {settingText}
                            </textarea>
                        </>
                    }
                </section>
            </section>

            <section className="w-5/6 mx-auto mt-2">
                <Carousel dynamicHeight={true} preventMovementUntilSwipeScrollTolerance={true} swipeScrollTolerance={edit ? 250 : 25} emulateTouch={!edit} centerMode={true} centerSlidePercentage={100} showStatus={false} showThumbs={false}>
                    {encounter_set?.map((encounter, i) => (
                        <EncounterDetails key={encounter?.id || i} encounter={encounter} encounters={encounter_set} encounterIndex={i} edit={edit} setDeleteType={setDeleteType} setDeleteId={setDeleteId} handleDeleteClick={handleDeleteClick} startEncounter={startEncounter} completeEncounter={completeEncounter} loading={loading} />
                    ))}
                </Carousel>
            </section>

            <section className="flex flex-wrap justify-between content-around lg:mt-2 w-full">
                <section className={`bg-${theme}-secondary rounded-l p-2 w-full lg:w-5/12`}>
                    {!edit &&
                        <p className={`${theme}-text`}>{scene?.plot_twist && scene.plot_twist !== "" ? `Plot Twist: ${scene.challenge}` : ""}</p>
                    }
                    {edit &&
                        <>
                            <label htmlFor="plot-twist-textarea" className={`${theme}-label block`}>Plot Twist:</label>
                            <textarea
                                id="plot-twist-textarea"
                                name="plot-twist-textarea"
                                rows={5}
                                className={`bg-${theme}-field border-${theme}-primary border-[3px] rounded-xl text-${theme}-text text-lg px-1 py-2 block`}
                                cols={cols}
                                onChange={handleInputChange}
                                disabled={loading}
                                key={'plot-twist-textarea'}
                                value={plotTwistText || ""}
                                data-name="Plot Twist"
                            >
                                {plotTwistText || ""}
                            </textarea>
                        </>
                    }
                </section>
                <section className={`bg-${theme}-secondary rounded-l p-2 w-full lg:w-5/12`}>
                    {!edit &&
                        <p className={`${theme}-text`}>{scene?.clue && scene.clue !== "" ? `Clue: ${scene.clue}` : ""}</p>
                    }
                    {edit &&
                        <>
                            <label htmlFor="clue-textarea" className={`${theme}-label block`}>Clue:</label>
                            <textarea
                                id="clue-textarea"
                                name="clue-textarea"
                                rows={5}
                                className={`bg-${theme}-field border-${theme}-primary border-[3px] rounded-xl text-${theme}-text text-lg px-1 py-2 block`}
                                cols={cols}
                                onChange={handleInputChange}
                                disabled={loading}
                                key={'clue-textarea'}
                                value={clueText || ""}
                                data-name="Clue"
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
                        <button onClick={() => {startScene(id || 0)}} className={`border-${theme}-button-alt-border border-[3px] rounded-xl text-lg bg-${theme}-primary text-${theme}-accent font-${theme}-text py-1`}>Start</button>
                    }
                    {progress === "In Progress" &&
                        <button onClick={() => {completeScene(id || 0)}} className={`border-${theme}-button-alt-border border-[3px] rounded-xl text-lg bg-${theme}-primary text-${theme}-accent font-${theme}-text py-1`}>Complete</button>
                    }
                </section>
            }

        </section>
    );
}