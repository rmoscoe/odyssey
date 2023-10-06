/* eslint-disable react-hooks/exhaustive-deps */
import React, { useState, useRef } from 'react';
import { useTheme } from '../utils/ThemeContext';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTrashAlt, faPlus } from '@fortawesome/free-solid-svg-icons';

type isoEncounter = {
    id?: number;
    encounter_type: string | null;
    description: string | null;
    stats?: string | null;
    progress?: string;
};

type isoEncounterSet = Array<isoEncounter | null>;

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

interface EncounterDetailsProps {
    encounter: isoEncounter,
    encounters: isoEncounterSet,
    encounterIndex: number,
    edit: boolean,
    handleDeleteClick: (dType: string, dId: number) => void,
    startEncounter: (encounterId: number) => void,
    completeEncounter: (encounterId: number) => void,
    loading: boolean,
    scene: isoScene,
    setStatefulScene: (scene: isoScene) => void,
    setActiveEncounter: (idx: number) => void,
}

export default function EncounterDetails({ encounter, encounters, encounterIndex, edit, handleDeleteClick, startEncounter, completeEncounter, loading, scene, setStatefulScene, setActiveEncounter }: EncounterDetailsProps) {
    const { theme } = useTheme();

    const { id, encounter_type, description, progress } = encounter;

    const [typeText, setTypeText] = useState<string | undefined>(encounter_type || "");
    const [descriptionText, setDescriptionText] = useState<string | undefined>(description || "");

    const typeRef = useRef<HTMLInputElement | null>(null);
    const descriptionRef = useRef<HTMLTextAreaElement | null>(null);

    const cols = window.innerWidth < 1024 ? 24 : 75;

    const addEncounterBefore = () => {
        const newEncounter: isoEncounter = {
            encounter_type: "",
            description: ""
        }

        let updatedEncounters = scene.encounter_set;
        if (!encounters || encounters.length === 0) {
            updatedEncounters = [newEncounter];
        } else {
            if (updatedEncounters.length > 0) {
                for (let i = updatedEncounters.length - 1; i >= encounterIndex; i--) {
                    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
                    updatedEncounters[i + 1] = encounters!.slice(i, i + 1)[0];
                }
            }

            updatedEncounters[encounterIndex] = newEncounter;
        }

        const updatedScene = scene;
        updatedScene.encounter_set = updatedEncounters;

        setStatefulScene(updatedScene);
    }

    const addEncounterAfter = () => {
        const newEncounter: isoEncounter = {
            encounter_type: "",
            description: ""
        }

        const newIndex = encounterIndex + 1;
        let updatedEncounters = scene.encounter_set;
        if (!encounters || encounters.length === 0) {
            updatedEncounters = [newEncounter];
        } else {
            if (updatedEncounters.length > 0) {
                for (let i = updatedEncounters.length - 1; i > encounterIndex; i--) {
                    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
                    updatedEncounters[i + 1] = encounters!.slice(i, i + 1)[0];
                }
            }

            updatedEncounters[newIndex] = newEncounter;
        }

        const updatedScene = scene;
        updatedScene.encounter_set = updatedEncounters;

        setStatefulScene(updatedScene);
        setActiveEncounter(newIndex);
    }

    const handleInputChange = (field: React.MutableRefObject<HTMLInputElement | HTMLTextAreaElement | null>) => {
        const { current } = field;
        const inputValue: string | undefined = current?.value;

        switch (field) {
            case typeRef:
                setTypeText(inputValue);
                break;
            case descriptionRef:
                setDescriptionText(inputValue);
                break;
            default:
                console.error(`Error: Input field ${current?.tagName} ID ${current?.id || ""} with Value ${current?.value || ""} not recognized.`);
        }
    }

    return (
        <section className={`relative m-2 bg-${theme}-contrast rounded-2xl py-2 px-10 w-full`}>
            {edit && window.innerWidth < 1024 &&
                <section className="flex justify-between w-full px-2 mb-2 z-20">
                    <button onClick={addEncounterBefore} className={`border-${theme}-button-alt-border border-[3px] rounded-xl text-lg bg-${theme}-primary text-${theme}-accent font-${theme}-text py-1`}>
                        <FontAwesomeIcon className={`text-${theme}-accent text-xl`} icon={faPlus} />
                        &nbsp; Before
                    </button>
                    <button onClick={addEncounterAfter} className={`border-${theme}-button-alt-border border-[3px] rounded-xl text-lg bg-${theme}-primary text-${theme}-accent font-${theme}-text py-1`}>
                        <FontAwesomeIcon className={`text-${theme}-accent text-xl`} icon={faPlus} />
                        &nbsp; After
                    </button>
                    {progress === "Not Started" &&
                        <button onClick={() => handleDeleteClick("encounters", id || 0)} className={`border-${theme}-button-alt-border border-[3px] rounded-xl text-lg bg-${theme}-primary text-${theme}-accent font-${theme}-text py-1 aspect-square`}>
                            <FontAwesomeIcon className={`text-${theme}-accent text-xl`} icon={faTrashAlt} />
                        </button>
                    }
                </section>
            }

            <section className={`flex flex-wrap justify-between w-full px-2 mb-2 md:flex-nowrap`}>
                {!edit &&
                    <h4 className={`font-${theme}-heading text-${theme}-form-heading text-[1.18rem]`}>{encounter_type}</h4>
                }
                {edit &&
                    <>
                        <label htmlFor="type-input" className={`${theme}-label block`}>Type of Encounter:</label>
                        <input
                            id={`type-input-${id}`}
                            name={`type-input-${id}`}
                            className={`bg-${theme}-field border-${theme}-primary border-[3px] rounded-xl text-${theme}-text text-lg px-1 py-2 block`}
                            onChange={() => handleInputChange(typeRef)}
                            disabled={loading}
                            key={'type-input'}
                            value={typeText || ""}
                            data-name="Type"
                            ref={typeRef}
                        />
                    </>
                }
                <div className={`h-3 mt-1.5 w-full border-${theme}-progress-border border-2 bg-${theme}-progress-void rounded-full z-20 lg:hidden`}>
                    <div className={`h-full bg-${theme}-progress-fill rounded-full`} style={{ width: `${progress}%` }}></div>
                </div>
                {edit && window.innerWidth >= 1024 &&
                    <section className="flex justify-between space-x-2 z-20">
                        <button onClick={addEncounterBefore} className={`border-${theme}-button-alt-border border-[3px] rounded-xl text-lg bg-${theme}-primary text-${theme}-accent font-${theme}-text py-1`}>
                            <FontAwesomeIcon className={`text-${theme}-accent text-xl`} icon={faPlus} />
                            &nbsp; Before
                        </button>
                        <button onClick={addEncounterAfter} className={`border-${theme}-button-alt-border border-[3px] rounded-xl text-lg bg-${theme}-primary text-${theme}-accent font-${theme}-text py-1`}>
                            <FontAwesomeIcon className={`text-${theme}-accent text-xl`} icon={faPlus} />
                            &nbsp; After
                        </button>
                        {progress === "Not Started" &&
                            <button onClick={() => handleDeleteClick("encounters", id || 0)} className={`border-${theme}-button-alt-border border-[3px] rounded-xl text-lg bg-${theme}-primary text-${theme}-accent font-${theme}-text py-1 aspect-square`}>
                                <FontAwesomeIcon className={`text-${theme}-accent text-xl`} icon={faTrashAlt} />
                            </button>
                        }
                    </section>
                }
            </section>

            <section className="w-full px-2 lg:mt-2">
                {!edit &&
                    <p className={`${theme}-text`}>{description}</p>
                }
                {edit &&
                    <>
                        <label htmlFor="description-textarea" className={`${theme}-label block`}>Description:</label>
                        <textarea
                            id={`description-textarea-${id}`}
                            name={`description-textarea-${id}`}
                            rows={4}
                            className={`bg-${theme}-field border-${theme}-primary border-[3px] rounded-xl text-${theme}-text text-lg px-1 py-2 block`}
                            cols={cols}
                            onChange={() => handleInputChange(descriptionRef)}
                            disabled={loading}
                            key={'description-textarea'}
                            value={descriptionText || ""}
                            data-name="Description"
                            ref={descriptionRef}
                        >
                            {descriptionText}
                        </textarea>
                    </>
                }
            </section>

            {progress !== "Complete" && (encounterIndex === 0 || encounters[encounterIndex - 1]?.progress === "Complete") &&
                <section className="flex justify-end w-full mt-2">
                    {progress === "Not Started" &&
                        <button onClick={() => { startEncounter(id || 0) }} className={`border-${theme}-button-alt-border border-[3px] rounded-xl text-lg bg-${theme}-primary text-${theme}-accent font-${theme}-text py-1`}>Start</button>
                    }
                    {progress === "In Progress" &&
                        <button onClick={() => { completeEncounter(id || 0) }} className={`border-${theme}-button-alt-border border-[3px] rounded-xl text-lg bg-${theme}-primary text-${theme}-accent font-${theme}-text py-1`}>Complete</button>
                    }
                </section>
            }

        </section>
    );
}