/* eslint-disable @typescript-eslint/no-non-null-assertion */
import React, { SetStateAction, useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom'
import { useTheme } from '../utils/ThemeContext';
import axios from 'axios';
import Auth from '../utils/auth';
import CSRFToken from '../components/CSRFToken';
import Spinner from '../components/Spinner';
import DropdownChoice from '../components/DropdownChoice';
import Chapter from '../components/Chapter';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faX, faFloppyDisk } from '@fortawesome/free-solid-svg-icons';
import Cookies from 'js-cookie';
import DeleteConfirm from '../components/DeleteConfirm';

interface PageProps {
    handlePageChange: (page: string) => void;
}

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

type ChapterObject = {
    chapterTitle: string,
    chapterContent: string | SceneData[] | null
}

const games = {
    'Ars Magica': {
        settings: ["", "Mythic Europe", "Realms of Power", "The New World", "The Mythic North", "The Mythic East"],
        experience: ["points"]
    },
    'Blade of the Iron Throne': {
        settings: null,
        experience: ["points"]
    },
    'Burning Wheel': {
        settings: null,
        experience: ["points"]
    },
    'Call of Cthulhu': {
        settings: ["", "Miskatonic University", "Cthulu Mythos", "Delta Green", "Trail of Cthulu", "Dreamlands"],
        experience: ["points"]
    },
    'Changeling: The Lost': {
        settings: ["", "The Hedge", "The Seelie Court", "The Unseelie Court", "The Freehold", "The Wyld"],
        experience: ["points"]
    },
    'Chronicles of Darkness: Changeling: The Lost': {
        settings: null,
        experience: ["points"]
    },
    'Chronicles of Darkness: Dark Eras': {
        settings: null,
        experience: ["points"]
    },
    'Chronicles of Darkness: Hunter: The Vigil': {
        settings: null,
        experience: ["points"]
    },
    'Chronicles of Darkness: Mage: The Awakening': {
        settings: null,
        experience: ["points"]
    },
    'Chronicles of Darkness: Mummy: The Resurrection': {
        settings: null,
        experience: ["points"]
    },
    'Chronicles of Darkness: Promethean: The Created': {
        settings: null,
        experience: ["points"]
    },
    'Chronicles of Darkness: Second Inquisition': {
        settings: null,
        experience: ["points"]
    },
    'Chronicles of Darkness: Trinity Continuum': {
        settings: null,
        experience: ["points"]
    },
    'Chronicles of Darkness: Werewolf: The Forsaken': {
        settings: null,
        experience: ["points"]
    },
    'Chronicles of Darkness: Wraith: The Oblivion': {
        settings: null,
        experience: ["points"]
    },
    'City of Mist': {
        settings: ["City of Mist", "Shadows & Showdowns", "Nights of Payne Town", "A Cold Fire Within", "The Bronx"],
        experience: ["points"]
    },
    'Cyberpunk 2020': {
        settings: ["", "Night City", "Deep Space", "Pacific Rim", "Eurosource Plus"],
        experience: ["points"]
    },
    'Cyberpunk Red': {
        settings: null,
        experience: ["points"]
    },
    'Dungeons & Dragons': {
        settings: ["", "Forgotten Realms", "Ravenloft", "Eberron", "Greyhawk", "Dragonlance", "Dark Sun", "Planescape", "Spelljammer", "Mystara", "Birthright"],
        experience: ["levels"]
    },
    'Fate': {
        settings: ["", "Fate Worlds: Worlds Take Flight", "Fate Worlds: Worlds Rise Up", "Fate Worlds: Worlds in Shadow", "Fate Worlds in Shadow: War of Ashes", "Fate Worlds in Shadow: Tower of the Serpents", "Fate Worlds in Shadow: Tachyon Squadron", "Fate Worlds in Shadow: Ehdrigohr", "Venture City", "Atomic Robo"],
        experience: ["points"]
    },
    'GURPS': {
        settings: ["", "GURPS Fantasy", "GURPS Space", "GURPS Cyberpunk", "GURPS Steampunk", "GURPS Historical Settings", "GURPS Horror"],
        experience: ["points"]
    },
    'homebrew (unpublished)': {
        settings: null,
        experience: ["points", "levels"]
    },
    'Hunter: The Vigil': {
        settings: null,
        experience: ["points"]
    },
    'Ironsworn': {
        settings: null,
        experience: ["points"]
    },
    'Mage: The Ascension': {
        settings: null,
        experience: ["points"]
    },
    'Marvel Heroic Roleplaying': {
        settings: ["", "Civil War", "Annihilation", "X-Men", "Breakout", "Civil War: X-Men"],
        experience: ["points"]
    },
    'Mummy: The Resurrection': {
        settings: null,
        experience: ["points"]
    },
    'Mutant Year Zero': {
        settings: null,
        experience: ["points"]
    },
    'Mutants & Masterminds': {
        settings: ["", "Freedom City", "Emerald City"],
        experience: ["points"]
    },
    'Numenera': {
        settings: ["", "Ninth World", "Into the Night", "Into the Deep", "Into the Outside", "The Devil's Spine"],
        experience: ["points"]
    },
    'Other': {
        settings: null,
        experience: ["points", "levels"]
    },
    'Paranoia XP': {
        settings: null,
        experience: ["points"]
    },
    'Pathfinder': {
        settings: ["", "The Inner Sea", "Lost Cities of Golarion"],
        experience: ["levels"]
    },
    'Promethean: The Created': {
        settings: null,
        experience: ["points"]
    },
    'Rifts': {
        settings: ["", "Vampire Kingdoms", "Atlantis", "England", "Africa", "Triax & the NGR", "South America 1", "Underseas", "Japan", "South America 2", "Juicer Uprising", "Coalition War Campaign", "Psyscape", "Lone Star", "New West", "Spirit West", "Federation of Magic", "Warlords of Russia", "Mystic Russia", "Australia", "Canada", "Splynn Dimensional Market", "Free Quebec", "Xiticix Invasion", "China 1", "China 2", "Dinosaur Swamp", "Adventures in Dinosaur Swamp", "Arzno", "Madhaven", "D-Bees of North America", "Triax 2", "Lemuria", "Northern Gun 1", "Northern Gun 2", "Megaverse in Flames"],
        experience: ["levels"]
    },
    'Savage Worlds': {
        settings: ["", "Deadlands", "Rippers", "Necessary Evil", "The Last Parsec", "The Savage World of Solomon Kane", "Interface Zero", "Beasts & Barbarians", "Hellfrost", "East Texas University", "50 Fathoms"],
        experience: ["points"]
    },
    'Shadowrun': {
        settings: ["", "Seattle", "London Falling", "Denver", "New York", "Hong Kong", "California Free State", "Seattle 2072"],
        experience: ["points"]
    },
    'Song of Ice and Fire Roleplaying': {
        settings: null,
        experience: ["points"]
    },
    'Star Trek Adventures': {
        settings: ["", "Alpha Quadrant", "Beta Quadrant", "Deep Space Nine", "Voyager", "Klingon Empire"],
        experience: ["points"]
    },
    'Star Wars: The Roleplaying Game': {
        settings: null,
        experience: ["points"]
    },
    'Stars Without Number': {
        settings: null,
        experience: ["points"]
    },
    'Tales from the Loop': {
        settings: ["", "Tales from the Flood", "Things from the Flood"],
        experience: ["points"]
    },
    'The Laundry Files': {
        settings: null,
        experience: ["points"]
    },
    'The One Ring': {
        settings: ["", "Rivendell", "Tales from Wilderland", "Ruins of the North"],
        experience: ["points"]
    },
    'The Veil': {
        settings: null,
        experience: ["points"]
    },
    'The World of Darkness': {
        settings: null,
        experience: ["points"]
    },
    'Traveller': {
        settings: ["", "Reft Sector", "The Trojan Reach"],
        experience: ["points"]
    },
    'Vampire: The Masquerade': {
        settings: null,
        experience: ["points"]
    },
    'Werewolf: The Apocalypse': {
        settings: null,
        experience: ["points"]
    },
    'Wraith: The Oblivion': {
        settings: null,
        experience: ["points"]
    }
}

export default function NewAdventure({ handlePageChange }: PageProps) {
    const { theme } = useTheme();
    const navigate = useNavigate();
    const [game, setGame] = useState('');
    const [gameTitle, setGameTitle] = useState<string | null>(null);
    const [campaignSetting, setCampaignSetting] = useState<string | null>(null);
    const [homebrewDescription, setHomebrewDescription] = useState<string | null>(null);
    const [loading, setLoading] = useState(false);
    const [players, setPlayers] = useState<number | undefined>();
    const [level, setLevel] = useState<number | null>(null);
    const [experience, setExperience] = useState<number | null>(null);
    const [numScenes, setNumScenes] = useState(1);
    const [maxEncounters, setMaxEncounters] = useState(1);
    const [withPlotTwists, setWithPlotTwists] = useState<number | undefined>();
    const [withClues, setWithClues] = useState<number | undefined>();
    const [context, setContext] = useState('');
    const [notification, setNotification] = useState('');
    const [expositionChapter, setExpositionChapter] = useState<ChapterObject>({
        chapterTitle: '',
        chapterContent: ''
    });
    const [incitementChapter, setIncitementChapter] = useState<ChapterObject>({
        chapterTitle: '',
        chapterContent: ''
    });
    const [risingActionChapter, setRisingActionChapter] = useState<ChapterObject>({
        chapterTitle: '',
        chapterContent: []
    });
    const [climaxChapter, setClimaxChapter] = useState<ChapterObject>({
        chapterTitle: '',
        chapterContent: ''
    });
    const [denoumentChapter, setDenoumentChapter] = useState<ChapterObject>({
        chapterTitle: '',
        chapterContent: ''
    });
    const [adventureTitle, setAdventureTitle] = useState('');
    const [deleting, setDeleting] = useState('');
    const [chapterToDelete, setChapterToDelete] = useState('');
    const [deleteType, setDeleteType] = useState('');
    const [finalGameTitle, setFinalGameTitle] = useState('');
    const [finalCampaignSetting, setFinalCampaignSetting] = useState('');
    const [adventure, setAdventure] = useState(false);
    const formRef = useRef<HTMLFormElement>(null);
    const [contentHeight, setContentHeight] = useState(document.getElementById('content-container')?.offsetHeight);
    const [inputHeight, setInputHeight] = useState(document.querySelector('input')?.offsetHeight);

    const contentContainerRef = useRef<HTMLElement | null>(null);
    const inputRef = useRef<HTMLInputElement | null>(null);

    useEffect(() => {
        const contentContainer = contentContainerRef.current;

        if (!contentContainer) return;

        const handleResize = () => {
            const newOffsetHeight = contentContainer.offsetHeight;

            if (newOffsetHeight !== contentHeight) {
                setContentHeight(newOffsetHeight);
            }
        };

        const observer = new ResizeObserver(handleResize);

        observer.observe(contentContainer);

        return () => {
            observer.unobserve(contentContainer);
        };
    }, [contentHeight]);

    useEffect(() => {
        const inputEl = inputRef.current;

        if (!inputEl) return;

        const handleResize = () => {
            const newInputHeight = inputEl.offsetHeight;

            if (newInputHeight !== inputHeight) {
                setInputHeight(newInputHeight);
            }
        };

        const observer = new ResizeObserver(handleResize);

        observer.observe(inputEl);

        return () => {
            observer.unobserve(inputEl);
        }
    }, [inputHeight]);

    useEffect(() => {
        if (game !== 'homebrew (unpublished)' && game !== 'Other') {
            setGameTitle(null)
        }
        if (gameTitle !== null && gameTitle !== '') {
            setFinalGameTitle(gameTitle);
        } else {
            setFinalGameTitle(game);
        }
    }, [game, gameTitle]);

    if (!Auth.loggedIn()) {
        navigate('/login');
    }

    handlePageChange('New Adventure');

    const cols = window.innerWidth < 1024 ? 30 : 47;
    const sectionStyle = window.innerWidth >= 1024 ? { height: `${contentHeight}px` } : {};
    const inputHeightStyle = { height: `${inputHeight}px` };
    const arrowButtonContainerStyle = {
        width: `${inputHeight ? inputHeight / 2 : 26.5}px`,
        height: `${inputHeight}px`
    }

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        const { target } = e;
        const inputId = target.id;
        const inputValue: string | number | undefined = target.tagName === 'TEXTAREA' ? target.innerText : target.value;

        target.classList.remove("invalid-entry");
        setNotification('');

        switch (inputId) {
            case 'game-select':
                setGame(inputValue);
                break;
            case 'game-title-input':
                setGameTitle(inputValue);
                break;
            case 'homebrew-description-textarea':
                setHomebrewDescription(inputValue);
                break;
            case 'campaign-setting-select':
                setCampaignSetting(inputValue);
                break;
            case 'players-input':
                setPlayers(Number(inputValue));
                break;
            case 'level-input':
                setLevel(Number(inputValue));
                break;
            case 'experience-input':
                setExperience(Number(inputValue));
                break;
            case 'num-scenes-select':
                setNumScenes(Number(inputValue));
                break;
            case 'max-encounters-select':
                setMaxEncounters(Number(inputValue));
                break;
            case 'with-plot-twists-input':
                setWithPlotTwists(Number(inputValue));
                break;
            case 'with-clues-input':
                setWithClues(Number(inputValue));
                break;
            case 'context-textarea':
                setContext(inputValue);
                break;
            case 'adventure-title-input':
                setAdventureTitle(inputValue);
                break;
            default:
                console.error(`Error: Input field ${inputId} not recognized.`);
        }
    }

    const fieldLoseFocus = (e: React.FocusEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        const { target } = e;
        const inputValue: string | number | undefined = target.tagName === 'TEXTAREA' ? target.innerText : target.value;

        if (target.required && inputValue === ('' || null || undefined)) {
            target.classList.add("invalid-entry");
        }
    }

    const generateNewAdventure = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        setLoading(true);

        const form: HTMLElement | null = document.getElementById('adventure-form');
        if (form instanceof HTMLFormElement) {
            const inputElements: (HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement)[] = Array.from(form.querySelectorAll('input, textarea, select'));
            inputElements.forEach(input => {
                if (input.required && (((input.tagName === 'INPUT' || input.tagName === 'SELECT') && (input.value === '' || input.value === null || input.value === undefined)) || (input.tagName === 'TEXTAREA' && input.innerText === ''))) {
                    input.classList.add('invalid-entry');
                    setNotification("One or more required fields is missing input.");
                }
            });

            if (notification === "One or more required fields is missing input.") {
                setLoading(false);
                return;
            }
        }

        interface AdventureParams {
            game: string,
            players: number,
            scenes: number,
            encounters: number,
            plot_twists: number,
            clues: number,
            homebrew_description?: string | null,
            campaign_setting?: string | null,
            level?: number | null,
            experience?: number | null,
            context?: string | undefined,
        }

        const adventureParams: AdventureParams = {
            "game": finalGameTitle,
            "players": players!,
            "scenes": numScenes,
            "encounters": maxEncounters,
            "plot_twists": withPlotTwists!,
            "clues": withClues!,
        }

        const optionalParams: (keyof AdventureParams)[] = [
            "homebrew_description",
            "campaign_setting",
            "level",
            "experience",
        ];

        const stateVariables = [homebrewDescription, campaignSetting, level, experience, context];

        const updateOptionalProperty = <T extends keyof AdventureParams>(
            key: T,
            value: AdventureParams[T] | null | undefined
        ) => {
            if (value) {
                adventureParams[key] = value;
            }
        };

        optionalParams.forEach((param, idx) => {
            updateOptionalProperty(param, stateVariables[idx]);
        });

        try {
            const response = await axios.post('/api/generate-adventure/', adventureParams, { headers: { 'X-CSRFToken': Cookies.get('csrftoken') } });
            if (response.status === 401) {
                navigate('/login');
            } else if (response.data) {
                type EncounterData = {
                    type: string | null;
                    description: string | null;
                    stats?: string | null;
                }

                type SceneData = {
                    challenge: string | null;
                    setting: string | null;
                    encounters: EncounterData[];
                    plot_twist: string | null;
                    clue: string | null;
                }

                const { Exposition, Incitement, "Rising Action": Rising_Action, Climax, Denoument } = response.data;
                const chapterData = [{
                    chapterTitle: "Exposition",
                    chapterContent: Exposition
                }, {
                    chapterTitle: "Incitement",
                    chapterContent: Incitement
                }, {
                    chapterTitle: "Rising Action",
                    chapterContent: []
                }, {
                    chapterTitle: "Climax",
                    chapterContent: Climax
                }, {
                    chapterTitle: "Denoument",
                    chapterContent: Denoument
                }];

                Rising_Action.forEach((plotObj: SceneData, idx: number) => {
                    const sequence = idx + 1;
                    const scene = {
                        sequence: sequence,
                        challenge: plotObj.challenge,
                        setting: plotObj.setting,
                        encounters: plotObj.encounters,
                        plot_twist: plotObj.plot_twist,
                        clue: plotObj.clue
                    }
                    chapterData[2].chapterContent.push(scene);
                });

                const assignChapters = (fn: React.Dispatch<SetStateAction<ChapterObject>>[]) => {
                    fn.forEach((func, idx) => {
                        func(chapterData[idx]);
                    });
                }

                assignChapters([setExpositionChapter, setIncitementChapter, setRisingActionChapter, setClimaxChapter, setDenoumentChapter]);
                setAdventure(true);


            } else {
                setNotification("Oops! Something went wrong. Please try again.");
            }

            setContentHeight(() => document.getElementById('content-container')?.offsetHeight);
            setNotification('');
            setLoading(false);
            setGame(() => '');
            setGameTitle(() => '');
            setHomebrewDescription(() => '');
            setFinalCampaignSetting(() => campaignSetting ?? '');
            setCampaignSetting(() => '');
            setPlayers(() => undefined);
            setLevel(() => null);
            setExperience(() => null);
            setNumScenes(() => 1);
            setMaxEncounters(() => 1);
            setWithPlotTwists(() => undefined);
            setWithClues(() => undefined);
            setContext(() => '');

            formRef.current?.reset();
        } catch (error) {
            console.error(error);
            setNotification("Oops! Something went wrong. Please try again.");
            setLoading(false);
        }
    }

    const handleDeleteClick = () => {
        document.querySelector('.modal')?.classList.add('is-active');
    }

    const saveAdventure = async () => {
        setLoading(true);

        // Validate
        setNotification("Validating");
        if (adventureTitle === '') {
            setNotification("Please give your adventure a title.");
            document.getElementById('adventure-title-input')?.classList.add("invalid-entry");
            setLoading(false);
            return;
        }

        // assemble Adventure
        setNotification("Saving adventure");
        const adventurePayload = {
            title: adventureTitle,
            user_id: Auth.getToken().fields.user,
            game: finalGameTitle,
            campaign_setting: finalCampaignSetting,
            exposition: expositionChapter.chapterContent,
            incitement: incitementChapter.chapterContent,
            climax: climaxChapter.chapterContent,
            denoument: denoumentChapter.chapterContent
        }

        try {
            const response = await axios.post('/api/adventures/', adventurePayload, { headers: { 'X-CSRFToken': Cookies.get('csrftoken') } });

            if (response.status === 401) {
                navigate('/login');
            } else if (response.data) {
                type Scene = {
                    sequence: number,
                    challenge: string,
                    setting: string,
                    encounter_set: {
                        id?: number,
                        encounter_type: string,
                        description: string,
                        stats?: string
                    }[],
                    plot_twist: string | null,
                    clue: string | null
                }
                const adventureId = response.data.id;
                const scenesArr = Array.isArray(risingActionChapter.chapterContent) ? risingActionChapter.chapterContent : [];

                scenesArr?.forEach(async (scene, idx) => {
                    setNotification(`Saving Scene ${idx + 1}`);
                    const { sequence, challenge, setting, plot_twist, clue } = scene as Scene;
                    const scenePayload = {
                        adventure_id: adventureId,
                        sequence,
                        challenge,
                        setting,
                        plot_twist,
                        clue
                    }

                    const sceneResponse = await axios.post('/api/scenes/', scenePayload, { headers: { 'X-CSRFToken': Cookies.get('csrftoken') } });

                    if (sceneResponse.status === 401) {
                        navigate('/login');
                    } else if (sceneResponse.data) {
                        const sceneId = sceneResponse.data.id;
                        const { encounter_set } = scene as Scene;

                        encounter_set?.forEach(async encounter => {
                            setNotification('Saving encounters');
                            const { encounter_type, description } = encounter;
                            const encounterPayload = {
                                scene_id: sceneId,
                                encounter_type,
                                description
                            }

                            const encounterResponse = await axios.post('/api/encounters/', encounterPayload, { headers: { 'X-CSRFToken': Cookies.get('csrftoken') } });

                            if (encounterResponse.status !== 201) {
                                setNotification('Oops! Something went wrong. Please try again.');
                            }
                        });
                    } else {
                        setNotification('Oops! Something went wrong. Please try again.');
                    }
                })
            } else {
                setNotification('Oops! Something went wrong. Please try again.');
            }

            setLoading(false);
        } catch (err) {
            console.error(err);
            setNotification("Oops! Something went wrong. Please try again.");
            setLoading(false);
        }
    }

    const savingNotifications = ['Validating', 'Saving adventure', ...Array.from({ length: 7 }, (_, i) => `Saving scene ${i + 1}`), 'Saving encounters'];

    const chapterSet = [expositionChapter, incitementChapter, risingActionChapter, climaxChapter, denoumentChapter];
    const setChapterSet = [setExpositionChapter, setIncitementChapter, setRisingActionChapter, setClimaxChapter, setDenoumentChapter];

    return (
        <main className="mt-[5.5rem] mb-6 w-full h-overlay p-2 max-w-[100vw]">
            <section className="relative w-full mb-3">
                <h2 className={`font-${theme}-heading text-${theme}-heading text-center text-3xl mx-auto`}>New Adventure</h2>
                <button className={`absolute inset-y-0 right-0 border-${theme}-accent bg-${theme}-primary border-2 rounded-full p-1 aspect-square lg:rounded-2xl`} onClick={() => navigate('/adventures')}>
                    <FontAwesomeIcon className={`text-${theme}-accent text-xl`} icon={faX} />
                </button>
                {notification && !savingNotifications.includes(notification) && notification !== 'One or more required fields is missing input.' &&
                    <p className={`${theme}-text my-3 text-center`}>{notification}</p>
                }
            </section>
            {loading &&
                <section className="modal-background z-20 flex justify-center items-center">
                    <Spinner />
                    {savingNotifications.includes(notification) &&
                        <p className={`${theme}-text mt-3 text-center z-40`}>{notification}</p>
                    }
                </section>
            }

            <section className="block w-full lg:flex" id="content-container" ref={contentContainerRef}>
                <form autoComplete="off" id="new-adventure-form" className="mx-auto w-full lg:w-[48%] pt-3" onSubmit={generateNewAdventure} ref={formRef}>
                    <CSRFToken />
                    {notification === 'One or more required fields is missing input.' &&
                        <p className={`${theme}-text mb-3 text-center`}>{notification}</p>
                    }

                    <section className="flex flex-wrap space-x-3 space-y-3 items-end">
                        <div className="ml-3">
                            <label htmlFor="game-select" className={`${theme}-label block`}>Game*</label>
                            <select
                                id="game-select"
                                name="game-select"
                                className={`bg-${theme}-field border-${theme}-primary border-[3px] rounded-xl text-${theme}-text text-lg px-1 py-2 max-w-full block h-[${inputHeight}px]`}
                                onChange={handleInputChange}
                                onBlur={fieldLoseFocus}
                                disabled={loading}
                                required
                                key={'game-select'}
                                value={game}
                                style={inputHeightStyle}
                            >
                                <option value="" className={`${theme}-dropdown-choice`}>Select a game</option>
                                <DropdownChoice choices={Object.keys(games)} />
                            </select>
                        </div>
                        {(game === 'homebrew (unpublished)' || game === 'Other') &&
                            <div>
                                <p className={`${theme}-text mb-1.5`}>Enter the title of the unlisted game here.</p>
                                <label htmlFor="game-title-input" className={`${theme}-label block`}>Game Title*</label>
                                <input
                                    type="text"
                                    id="game-title-input"
                                    name="game-title-input"
                                    className={`bg-${theme}-field border-${theme}-primary border-[3px] rounded-xl text-${theme}-text text-lg px-1 py-2 block`}
                                    autoComplete="off"
                                    onChange={handleInputChange}
                                    onBlur={fieldLoseFocus}
                                    value={gameTitle ?? ''}
                                    disabled={loading}
                                    required
                                    key={'game-title-input'}
                                    defaultValue={gameTitle ?? ''}
                                />
                            </div>
                        }
                        {game === 'homebrew (unpublished)' &&
                            <div>
                                <p className={`${theme}-text mb-1.5`}>Enter a description of the unpublished game here. For best results, include the genre and a short description of the world or setting of the game.</p>
                                <label htmlFor="homebrew-description-textarea" className={`${theme}-label block`}>Description*</label>
                                <textarea
                                    id="homebrew-description-textarea"
                                    name="homebrew-description-textarea"
                                    rows={6}
                                    className={`bg-${theme}-field border-${theme}-primary border-[3px] rounded-xl text-${theme}-text text-lg px-1 py-2 block`}
                                    maxLength={300}
                                    cols={cols}
                                    onChange={handleInputChange}
                                    onBlur={fieldLoseFocus}
                                    disabled={loading}
                                    required
                                    key={'homebrew-description-textarea'}
                                >
                                    {homebrewDescription}
                                </textarea>
                            </div>
                        }
                        {games[game as keyof typeof games]?.settings &&
                            <div>
                                <label htmlFor="campaign-setting-select" className={`${theme}-label block`}>Campaign Setting</label>
                                <select
                                    id="campaign-setting-select"
                                    name="campaign-setting-select"
                                    className={`bg-${theme}-field border-${theme}-primary border-[3px] rounded-xl text-${theme}-text text-lg px-1 py-2 block h-[${inputHeight}px]`}
                                    onChange={handleInputChange}
                                    onBlur={fieldLoseFocus}
                                    disabled={loading}
                                    key={'campaign-setting-select'}
                                    style={inputHeightStyle}
                                >
                                    <option value="" className={`${theme}-dropdown-choice`}>Select a campaign setting</option>
                                    <DropdownChoice choices={games[game as keyof typeof games].settings ?? ['']} />
                                </select>
                            </div>
                        }
                        <div>
                            <label htmlFor="players-input" className={`${theme}-label block`}>Players*</label>
                            <div className="flex">
                                <input
                                    type="number"
                                    id="players-input"
                                    name="players-input"
                                    className={`bg-${theme}-field border-${theme}-primary border-[3px] rounded-xl text-${theme}-text text-lg px-1 py-2 block [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none`}
                                    autoComplete="off"
                                    step={1}
                                    onChange={handleInputChange}
                                    onBlur={fieldLoseFocus}
                                    value={players}
                                    disabled={loading}
                                    required
                                    key={'players-input'}
                                    defaultValue={players}
                                    ref={inputRef}
                                />
                                <div className="box-border" style={arrowButtonContainerStyle}>
                                    <button type="button" className={`${theme}-increase-button h-1/2 box-border aspect-square`} onClick={() => setPlayers(players ? players + 1 : 1)}>▲</button>
                                    <button type="button" className={`${theme}-decrease-button h-1/2 box-border aspect-square`} onClick={() => setPlayers(players && players > 1 ? players - 1 : 1)}>▼</button>
                                </div>
                            </div>
                        </div>
                        {games[game as keyof typeof games]?.experience.includes('levels') &&
                            <div>
                                <label htmlFor="level-input" className={`${theme}-label block`}>Experience Level</label>
                                <div className="flex">
                                    <input
                                        type="number"
                                        id="level-input"
                                        name="level-input"
                                        className={`bg-${theme}-field border-${theme}-primary border-[3px] rounded-xl text-${theme}-text text-lg px-1 py-2 block [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none`}
                                        autoComplete="off"
                                        onChange={handleInputChange}
                                        onBlur={fieldLoseFocus}
                                        value={level ?? undefined}
                                        disabled={loading}
                                        key={'level-input'}
                                        defaultValue={level ?? undefined}
                                    />
                                    <div className="box-border" style={arrowButtonContainerStyle}>
                                        <button type="button" className={`${theme}-increase-button h-1/2 box-border aspect-square`} onClick={() => setLevel(level ? level + 1 : 1)}>▲</button>
                                        <button type="button" className={`${theme}-decrease-button h-1/2 box-border aspect-square`} onClick={() => setLevel(level && level > 1 ? level - 1 : 1)}>▼</button>
                                    </div>
                                </div>
                            </div>
                        }
                        {games[game as keyof typeof games]?.experience.includes('points') &&
                            <div>
                                <label htmlFor="experience-input" className={`${theme}-label block`}>Experience Points</label>
                                <div className="flex">
                                    <input
                                        type="number"
                                        id="experience-input"
                                        name="experience-input"
                                        className={`bg-${theme}-field border-${theme}-primary border-[3px] rounded-xl text-${theme}-text text-lg px-1 py-2 block [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none`}
                                        autoComplete="off"
                                        onChange={handleInputChange}
                                        onBlur={fieldLoseFocus}
                                        value={experience ?? undefined}
                                        disabled={loading}
                                        key={'experience-input'}
                                        defaultValue={experience ?? undefined}
                                    />
                                    <div className="box-border" style={arrowButtonContainerStyle}>
                                        <button type="button" className={`${theme}-increase-button h-1/2 box-border aspect-square`} onClick={() => setExperience(experience ? experience + 1 : 1)}>▲</button>
                                        <button type="button" className={`${theme}-decrease-button h-1/2 box-border aspect-square`} onClick={() => setExperience(experience && experience > 0 ? experience - 1 : 0)}>▼</button>
                                    </div>
                                </div>
                            </div>
                        }
                        <div>
                            <label htmlFor="num-scenes-select" className={`${theme}-label block`}># of Scenes*</label>
                            <select
                                id="num-scenes-select"
                                name="num-scenes-select"
                                className={`bg-${theme}-field border-${theme}-primary border-[3px] rounded-xl text-${theme}-text text-lg px-1 py-2 block h-[${inputHeight}px]`}
                                onChange={handleInputChange}
                                onBlur={fieldLoseFocus}
                                disabled={loading}
                                required
                                key={'num-scenes-select'}
                                style={inputHeightStyle}
                            >
                                <option value={1} className={`${theme}-dropdown-choice`} selected>1</option>
                                <DropdownChoice choices={Array.from({ length: 6 }, (_, i) => i + 2)} />
                            </select>
                        </div>
                        <div>
                            <label htmlFor="max-encounters-select" className={`${theme}-label block`}>Max Encounters per Scene*</label>
                            <select
                                id="max-encounters-select"
                                name="max-encounters-select"
                                className={`bg-${theme}-field border-${theme}-primary border-[3px] rounded-xl text-${theme}-text text-lg px-1 py-2 block h-[${inputHeight}px]`}
                                onChange={handleInputChange}
                                onBlur={fieldLoseFocus}
                                disabled={loading}
                                required
                                key={'max-encounters-select'}
                                style={inputHeightStyle}
                            >
                                <option value={1} className={`${theme}-dropdown-choice`} selected>1</option>
                                <DropdownChoice choices={Array.from({ length: 6 }, (_, i) => i + 2)} />
                            </select>
                        </div>
                        <div>
                            <label htmlFor="with-plot-twists-input" className={`${theme}-label block`}>Scenes with Plot Twists*</label>
                            <div className="flex">
                                <input
                                    type="number"
                                    id="with-plot-twists-input"
                                    name="with-plot-twists-input"
                                    className={`bg-${theme}-field border-${theme}-primary border-[3px] rounded-xl text-${theme}-text text-lg px-1 py-2 block [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none`}
                                    autoComplete="off"
                                    onChange={handleInputChange}
                                    onBlur={fieldLoseFocus}
                                    value={withPlotTwists}
                                    disabled={loading}
                                    key={'with-plot-twists-input'}
                                    defaultValue={withPlotTwists}
                                />
                                <div className="box-border" style={arrowButtonContainerStyle}>
                                    <button type="button" className={`${theme}-increase-button h-1/2 box-border aspect-square`} onClick={() => setWithPlotTwists(withPlotTwists && withPlotTwists < 100 ? (Math.floor(withPlotTwists / 5) + 1) * 5 : withPlotTwists ? 100 : 5)}>▲</button>
                                    <button type="button" className={`${theme}-decrease-button h-1/2 box-border aspect-square`} onClick={() => setWithPlotTwists(withPlotTwists && withPlotTwists > 5 ? (Math.floor(withPlotTwists / 5) - 1) * 5 : 0)}>▼</button>
                                </div>
                                <p className={`${theme}-label my-auto ml-1`}>%</p>
                            </div>
                        </div>
                        <div>
                            <label htmlFor="with-clues-input" className={`${theme}-label block`}>Scenes with Clues*</label>
                            <div className="flex">
                                <input
                                    type="number"
                                    id="with-clues-input"
                                    name="with-clues-input"
                                    className={`bg-${theme}-field border-${theme}-primary border-[3px] rounded-xl text-${theme}-text text-lg px-1 py-2 block [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none`}
                                    autoComplete="off"
                                    onChange={handleInputChange}
                                    onBlur={fieldLoseFocus}
                                    value={withClues}
                                    disabled={loading}
                                    key={'with-clues-input'}
                                    defaultValue={withClues}
                                />
                                <div className="box-border" style={arrowButtonContainerStyle}>
                                    <button type="button" className={`${theme}-increase-button h-1/2 box-border aspect-square`} onClick={() => setWithClues(withClues && withClues < 100 ? (Math.floor(withClues / 5) + 1) * 5 : withClues ? 100 : 5)}>▲</button>
                                    <button type="button" className={`${theme}-decrease-button h-1/2 box-border aspect-square`} onClick={() => setWithClues(withClues && withClues > 5 ? (Math.floor(withClues / 5) - 1) * 5 : 0)}>▼</button>
                                </div>
                                <p className={`${theme}-label my-auto ml-1`}>%</p>
                            </div>
                        </div>
                    </section>

                    <section className="space-y-3 ml-3 mt-3">
                        <label htmlFor="context-textarea" className={`${theme}-label block`}>Additional Context &#40;optional&#41;. You may add additional information for the AI to consider, such as a summary of past adventures, an inspiration or theme you have in mind, or a description of the players' nemesis:*</label>
                        <textarea
                            id="context-textarea"
                            name="context-textarea"
                            rows={5}
                            className={`bg-${theme}-field border-${theme}-primary border-[3px] rounded-xl text-${theme}-text text-lg px-1 py-2 block`}
                            maxLength={250}
                            cols={cols}
                            onChange={handleInputChange}
                            onBlur={fieldLoseFocus}
                            disabled={loading}
                            key={'context-textarea'}
                        >
                            {context}
                        </textarea>
                    </section>
                    <input
                        type="submit"
                        id="submit-generate-adventure"
                        className={`mt-4 py-2 px-3 ml-auto border-${theme}-accent border-[3px] rounded-xl bg-${theme}-primary text-${theme}-accent text-lg font-${theme}-text w-full lg:w-fit lg:ml-auto`}
                        value="Submit"
                        disabled={loading}
                    />
                </form>

                <section className={`block static h-6 w-full lg:flex lg:w-[4%] lg:h-[${contentHeight}px]`} style={sectionStyle}>
                    <div className={`rounded-t-lg w-full h-3 ${theme}-gradient-start lg:w-1/2 lg:h-full lg:rounded-l-lg lg:rounded-tr-none`}></div>
                    <div className={`rounded-b-lg w-full h-3 ${theme}-gradient-end lg:w-1/2 lg:h-full lg:rounded-r-lg lg:rounded-bl-none`}></div>
                </section>

                <section className="block static w-full lg:w-[48%]">
                    {!adventure &&
                        <p className={`${theme}-text mt-3 text-center w-full`}>Adventure will display here once generated.</p>
                    }

                    {adventure && chapterSet &&
                        <section className="flex flex-wrap content-end">
                            <div>
                                <div className="mr-2 w-full">
                                    <label htmlFor="adventure-title-input" className={`${theme}-label block`}>Enter a Title*</label>
                                    <input
                                        type="text"
                                        id="adventure-title-input"
                                        name="adventure-title-input"
                                        className={`bg-${theme}-field border-${theme}-primary border-[3px] rounded-xl text-${theme}-text text-lg px-1 py-2 block`}
                                        autoComplete="off"
                                        onChange={handleInputChange}
                                        onBlur={fieldLoseFocus}
                                        value={adventureTitle}
                                        disabled={loading}
                                        required
                                    />
                                </div>
                                <button className={`border-${theme}-accent bg-${theme}-primary border-2 rounded-xl p-1 aspect-square shrink-0 basis-11`} onClick={saveAdventure}>
                                    <FontAwesomeIcon className={`text-${theme}-accent text-xl`} icon={faFloppyDisk} />
                                </button>
                            </div>
                            {chapterSet?.map((chapter, i) => (
                                <Chapter chapter={chapter} key={`chapter-${i}`} setChapter={setChapterSet[i]} handleDeleteClick={handleDeleteClick} deleting={deleting} setDeleting={setDeleting} chapterToDelete={chapterToDelete} setChapterToDelete={setChapterToDelete} setDeleteType={setDeleteType} />
                            ))}
                        </section>
                    }
                </section>
            </section>

            <DeleteConfirm deleteType={deleteType} setDeleting={setDeleting} />
        </main>
    );
}