/* eslint-disable react-hooks/exhaustive-deps */
import React, { useState, useEffect, useRef, Dispatch, SetStateAction } from 'react';
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

interface EncounterDetailsProps {
    encounter: isoEncounter,
    encounters: isoEncounterSet,
    encounterIndex: number,
    edit: boolean,
    handleDeleteClick: (dType: string, dId: number) => void,
    startEncounter: (encounterId: number) => void,
    completeEncounter: (encounterId: number) => void,
    loading: boolean
}

export default function EncounterDetails({ encounter, encounters, encounterIndex, edit, handleDeleteClick, startEncounter, completeEncounter, loading }: EncounterDetailsProps) {
    const { theme } = useTheme();

    const { id, encounter_type, description, progress } = encounter;

    const [typeText, setTypeText] = useState(encounter_type);
    const [descriptionText, setDescriptionText] = useState(description);

    const typeRef = useRef<HTMLInputElement | null>(null);
    const descriptionRef = useRef<HTMLTextAreaElement | null>(null);

    const cols = window.innerWidth < 1024 ? 24 : 75;

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
                        <button onClick={addSceneBefore} className={`border-${theme}-button-alt-border border-[3px] rounded-xl text-lg bg-${theme}-primary text-${theme}-accent font-${theme}-text py-1`}>
                            <FontAwesomeIcon className={`text-${theme}-accent text-xl`} icon={faPlus} />
                            &nbsp; Before
                        </button>
                        <button onClick={addSceneAfter} className={`border-${theme}-button-alt-border border-[3px] rounded-xl text-lg bg-${theme}-primary text-${theme}-accent font-${theme}-text py-1`}>
                            <FontAwesomeIcon className={`text-${theme}-accent text-xl`} icon={faPlus} />
                            &nbsp; After
                        </button>
                        {progress === "Not Started" &&
                            <button onClick={() => handleDeleteClick("scenes", id || 0)} className={`border-${theme}-button-alt-border border-[3px] rounded-xl text-lg bg-${theme}-primary text-${theme}-accent font-${theme}-text py-1 aspect-square`}>
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