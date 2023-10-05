import React, { useEffect, useState, useRef } from 'react';
import { useTheme } from '../utils/ThemeContext';
import { useNavigate, useLocation, useParams } from 'react-router-dom';
import Auth from '../utils/auth';
import axios, { AxiosError } from 'axios';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTrashAlt, faPencil, faFloppyDisk } from '@fortawesome/free-solid-svg-icons';
import { Carousel } from 'react-responsive-carousel';
import 'react-responsive-carousel/lib/styles/carousel.min.css';
import DeleteConfirm from '../components/DeleteConfirm';
import Stage from '../components/Stage';
import SceneDetails from '../components/SceneDetails';
import CSRFToken from '../components/CSRFToken';
import Spinner from '../components/Spinner';
import Cookies from 'js-cookie';

interface AdventureDetailsProps {
    handlePageChange: (page: string) => void;
    deleteConfirm: boolean;
    setDeleteConfirm: (value: boolean) => void;
}

type adventure = {
    id: number;
    title: string;
    created_at: Date;
    last_modified: Date;
    game: string;
    campaign_setting: string | null;
    exposition: string | null;
    incitement: string | null;
    scene_set: [{
        id: number;
        sequence: number;
        challenge: string | null;
        setting: string | null;
        encounter_set: [{
            id: number;
            encounter_type: string | null;
            description: string | null;
            stats: string | null;
            progress: string;
        } | null];
        plot_twist: string | null;
        clue: string | null;
        progress: string;
    } | null];
    climax: string | null;
    climax_progress: number;
    denoument: string | null;
    progress: number;
    status: string;
};

type isoAdventure = {
    id: number;
    title: string;
    created_at: Date;
    last_modified: Date;
    game: string;
    campaign_setting: string | null;
    exposition: string | null;
    incitement: string | null;
    climax: string | null;
    climax_progress: number;
    denoument: string | null;
    progress: number;
    status: string;
};

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

export default function AdventureDetails({ handlePageChange, deleteConfirm, setDeleteConfirm }: AdventureDetailsProps) {
    const { theme } = useTheme();
    const navigate = useNavigate();
    const location = useLocation();
    const { adventureId } = useParams();
    const [adventure, setAdventure] = useState<isoAdventure | undefined>(undefined);
    const [scenes, setScenes] = useState<isoScenes | undefined>(undefined);
    const [deleteType, setDeleteType] = useState("");
    const [deleteId, setDeleteId] = useState(0);
    const [redirectRequired, setRedirectRequired] = useState(false);
    const [edit, setEdit] = useState(false);
    const [loading, setLoading] = useState(false);
    const [notification, setNotification] = useState("");

    const { id, title, created_at, last_modified, game, campaign_setting, exposition, incitement, scene_set, climax, denoument, status } = location.state || {};
    let { progress, climax_progress } = location.state || {};

    const [titleText, setTitleText] = useState(title);
    const [expositionRef, setExpositionRef] = useState<React.MutableRefObject<HTMLTextAreaElement | null>>(useRef(null));
    const [expositionText, setExpositionText] = useState(exposition);
    const [incitementRef, setIncitementRef] = useState<React.MutableRefObject<HTMLTextAreaElement | null>>(useRef(null));
    const [incitementText, setIncitementText] = useState(incitement);
    const [climaxRef, setClimaxRef] = useState<React.MutableRefObject<HTMLTextAreaElement | null>>(useRef(null));
    const [climaxText, setClimaxText] = useState(climax);
    const [denoumentRef, setDenoumentRef] = useState<React.MutableRefObject<HTMLTextAreaElement | null>>(useRef(null));
    const [denoumentText, setDenoumentText] = useState(denoument);
    const [reloadRequired, setReloadRequired] = useState(false);
    const [scenes_complete, setScenesComplete] = useState(false);
    const [activeScene, setActiveScene] = useState(0);

    const titleInputRef = useRef<HTMLInputElement | null>(null);

    useEffect(() => {
        if (!Auth.loggedIn()) {
            navigate('/login');
            return;
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    useEffect(() => {
        if (reloadRequired) {
            console.log("Reload required");
        }
    }, [reloadRequired]);

    handlePageChange('Adventure Details');

    useEffect(() => {
        const getAdventure = async () => {
            try {
                if (!Auth.loggedIn()) {
                    navigate('/login');
                    return;
                }
                const response = await axios.get(`/api/adventures/${adventureId}/`);
                if (response.status === 401) {
                    navigate('/login');
                } else if (response.data) {
                    const data: adventure = response.data;
                    const isoAdventure: isoAdventure = {
                        id: data.id,
                        title: data.title,
                        created_at: data.created_at,
                        last_modified: data.last_modified,
                        game: data.game,
                        campaign_setting: data.campaign_setting,
                        exposition: data.exposition,
                        incitement: data.incitement,
                        climax: data.climax,
                        climax_progress: data.climax_progress,
                        denoument: data.denoument,
                        progress: data.progress,
                        status: data.status,
                    }
                    const isoScenes: isoScenes = data.scene_set;
                    setAdventure(isoAdventure);
                    setScenes(isoScenes);
                    setTitleText(isoAdventure.title);
                    setExpositionText(isoAdventure.exposition);
                    setIncitementText(isoAdventure.incitement);
                    setClimaxText(isoAdventure.climax);
                    setDenoumentText(isoAdventure.denoument);
                    for (let i = 0; i < isoScenes.length; i++) {
                        const scene = isoScenes[i]
                        if (scene?.progress !== "Complete") {
                            return;
                        } else {
                            continue;
                        }
                    }
                    setScenesComplete(true);
                } else {
                    setAdventure(undefined);
                    setScenes(undefined);
                }
            } catch (err) {
                console.error(err);
                if (err instanceof Error) {
                    if (err instanceof AxiosError && err.response?.status === 401) {
                        navigate('/login');
                    }
                }
            }
        }

        if (id) {
            setAdventure({
                id,
                title,
                created_at,
                last_modified,
                game,
                campaign_setting,
                exposition,
                incitement,
                climax,
                climax_progress,
                denoument,
                progress,
                status
            });
            setScenes(scene_set);
            let allScenesComplete = true;
            for (let i = 0; i < scene_set.length; i++) {
                if (scene_set[i].progress === "Complete") {
                    continue;
                } else {
                    allScenesComplete = false;
                }
            }
            setScenesComplete(allScenesComplete);
        } else {
            getAdventure();
        }

        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const handleDeleteClick = (dType: string, dId: number) => {
        setDeleteType(dType);
        setDeleteId(dId);
        setRedirectRequired(dType === "adventures");
        setDeleteConfirm(true);
    }

    const saveAdventure = async () => {
        setLoading(true);

        // Validate
        setNotification("Validating");
        if (titleText === '') {
            setNotification("Title is required");
            titleInputRef.current?.classList.add("invalid-entry");
            setLoading(false);
            return;
        }
        if (expositionText.length > 499) {
            setNotification("Background exceeds character limit.");
            expositionRef && expositionRef.current?.classList.add("invalid-entry");
            setLoading(false);
            return;
        }

        // assemble Adventure
        setNotification("Saving adventure");
        const adventurePayload = {
            title: titleText,
            exposition: expositionText,
            incitement: incitementText,
            climax: climaxText,
            denoument: denoumentText
        }

        try {
            // save Adventure
            const response = await axios.patch(`/api/adventures/${adventureId}/`, adventurePayload, { headers: { 'X-CSRFToken': Cookies.get('csrftoken') } });

            if (response.status === 401) {
                navigate('/login');
            } else if (response.data) {
                setAdventure(response.data);

                // save Scenes
                const scenesArr = Array.isArray(scenes) ? scenes : [];

                scenesArr?.forEach(async (scene, idx) => {
                    setNotification(`Saving Scene ${idx + 1}`);
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
                        // save Encounters
                        const sceneId = sceneResponse.data.id;
                        setNotification('Saving encounters');
                        const encounters = scene?.encounter_set;

                        encounters?.forEach(async encounter => {
                            const encounterPayload = {
                                scene_id: sceneId,
                                encounter_type: encounter?.encounter_type,
                                description: encounter?.description
                            }

                            const encounterResponse = encounter?.id ? await axios.patch(`/api/encounters/${encounter.id}/`, encounterPayload, { headers: { 'X-CSRFToken': Cookies.get('csrftoken') } }) : await axios.post(`/api/encounters/`, encounterPayload, { headers: { 'X-CSRFToken': Cookies.get('csrftoken') } });

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

    const handleInputChange = (field: React.MutableRefObject<HTMLInputElement | HTMLTextAreaElement | null>) => {
        const { current } = field;
        const inputValue: string | number | undefined = current?.value;

        current?.classList.remove("invalid-entry");
        setNotification('');

        switch (field) {
            case titleInputRef:
                setTitleText(inputValue);
                break;
            case expositionRef:
                setExpositionText(inputValue);
                break;
            case incitementRef:
                setIncitementText(inputValue);
                break;
            case climaxRef:
                setClimaxText(inputValue);
                break;
            case denoumentRef:
                setDenoumentText(inputValue);
                break;
            default:
                console.error(`Error: Input field ${current?.tagName} ID ${current?.id || ""} with Value ${current?.value || ""} not recognized.`);
        }
    }

    const fieldLoseFocus = (e: React.FocusEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { target } = e;
        const inputValue: string | number | undefined = target.value;

        if (target.required && inputValue === ('' || null || undefined)) {
            target.classList.add("invalid-entry");
            setNotification(`${target.dataset.name} is a required field.`);
        }

        if (inputValue.length >= target.maxLength) {
            target.classList.add("invalid-entry");
            setNotification(`${target.dataset.name} allows a maximum of ${target.maxLength} characters.`);
        }
    }

    const updateAdventureProgress = async () => {
        let adventureProgress = 0;
        let progressDivisor = 0;

        try {
            const response = await axios.get(`/api/adventures/${adventureId}/`);
            if (response.status === 401) {
                navigate('/login');
            } else if (response.data) {
                for (let i = 0; i < response.data.scene_set.length; i++) {
                    const scene: isoScene = response.data.scene_set[i];
                    progressDivisor += 100;
                    switch (scene.progress) {
                        case "In Progress":
                            adventureProgress += 50;
                            break;
                        case "Complete":
                            adventureProgress += 100;
                            break;
                        default:
                            break;
                    }
                    for (let j = 0; j < scene.encounter_set.length; j++) {
                        const encounter = scene.encounter_set[j];
                        progressDivisor += 100;
                        switch (encounter?.progress) {
                            case "In Progress":
                                adventureProgress += 50;
                                break;
                            case "Complete":
                                adventureProgress += 100;
                                break;
                            default:
                                break;
                        }
                    }
                }
                if (response.data.climax && response.data.climax !== "") {
                    progressDivisor += 100;
                    adventureProgress += response.data.climax_progress;
                }
                const progressPercent = adventureProgress / progressDivisor * 100;
                const updateResponse = await axios.patch(`/api/adventures/${adventureId}/`, { progress: progressPercent }, { headers: { 'X-CSRFToken': Cookies.get('csrftoken') } });
                progress = updateResponse.data.progress;
            }
            else {
                setNotification("Oops! Something went wrong. Please try again.");
            }
        } catch (err) {
            console.error(err);
            setNotification("Unable to update progress. Please try again.");
        }
    }

    const startScene = async (sceneId: number) => {
        try {
            const response = await axios.patch(`/api/scenes/${sceneId}/`, { progress: "In Progress" }, { headers: { 'X-CSRFToken': Cookies.get('csrftoken') } });
            if (response.status === 401) {
                navigate('login');
            } else if (response.data) {
                updateAdventureProgress();
            } else {
                setNotification("Oops! Something went wrong. Please try again.");
            }
        } catch (err) {
            console.error(err);
            setNotification("Unable to start scene. Please try again.");
        }
    }

    const completeScene = async (sceneId: number) => {
        try {
            const response = await axios.patch(`/api/scenes/${sceneId}/`, { progress: "Complete" }, { headers: { 'X-CSRFToken': Cookies.get('csrftoken') } });
            if (response.status === 401) {
                navigate('login');
            } else if (response.data) {
                updateAdventureProgress();
            } else {
                setNotification("Oops! Something went wrong. Please try again.");
            }
        } catch (err) {
            console.error(err);
            setNotification("Unable to complete scene. Please try again.");
        }
    }

    const startEncounter = async (encounterId: number) => {
        try {
            const response = await axios.patch(`/api/encounters/${encounterId}/`, { progress: "In Progress" }, { headers: { 'X-CSRFToken': Cookies.get('csrftoken') } });
            if (response.status === 401) {
                navigate('login');
            } else if (response.data) {
                updateAdventureProgress();
            } else {
                setNotification("Oops! Something went wrong. Please try again.");
            }
        } catch (err) {
            console.error(err);
            setNotification("Unable to start encounter. Please try again.");
        }
    }

    const completeEncounter = async (encounterId: number) => {
        try {
            const response = await axios.patch(`/api/encounters/${encounterId}/`, { progress: "Complete" }, { headers: { 'X-CSRFToken': Cookies.get('csrftoken') } });
            if (response.status === 401) {
                navigate('login');
            } else if (response.data) {
                updateAdventureProgress();
            } else {
                setNotification("Oops! Something went wrong. Please try again.");
            }
        } catch (err) {
            console.error(err);
            setNotification("Unable to complete encounter. Please try again.");
        }
    }

    const startClimax = async () => {
        try {
            const response = await axios.patch(`/api/adventures/${adventureId}/`, { climax_progress: 50 }, { headers: { 'X-CSRFToken': Cookies.get('csrftoken') } });
            if (response.status === 401) {
                navigate('login');
            } else if (response.data) {
                climax_progress = response.data.climax_progress;
                updateAdventureProgress();
            } else {
                setNotification("Oops! Something went wrong. Please try again.");
            }
        } catch (err) {
            console.error(err);
            setNotification("Unable to start Climax stage of this adventure. Please try again.");
        }
    }

    const completeClimax = async () => {
        try {
            const response = await axios.patch(`/api/adventures/${adventureId}/`, { climax_progress: 100 }, { headers: { 'X-CSRFToken': Cookies.get('csrftoken') } });
            if (response.status === 401) {
                navigate('login');
            } else if (response.data) {
                climax_progress = response.data.climax_progress;
                updateAdventureProgress();
            } else {
                setNotification("Oops! Something went wrong. Please try again.");
            }
        } catch (err) {
            console.error(err);
            setNotification("Unable to complete Climax stage of this adventure. Please try again.");
        }
    }

    const handleSlideChange = (idx: number) => setActiveScene(idx);

    const savingNotifications = ['Validating', 'Saving adventure', ...Array.from({ length: 7 }, (_, i) => `Saving Scene ${i + 1}`), 'Saving encounters'];

    return (
        <main className="mt-[5.5rem] mb-6 w-full h-overlay p-2 max-w-[100vw]">
            {notification && !savingNotifications.includes(notification) &&
                <p className={`${theme}-text my-3 text-center`}>{notification}</p>
            }
            <section className="w-full mb-3 lg:relative">
                <div className="absolute flex justify-between inset-x-0 top-0">
                    <button className={`aspect-square font-${theme}-text text-${theme}-neutral text-xl`} onClick={() => navigate('/adventures')}>&lt;</button>
                    {!edit &&
                        <div className="space-x-3">
                            <button className={`border-${theme}-button-alt-border bg-${theme}-primary border-2 rounded-xl p-1 aspect-square shrink-0 basis-11`} onClick={() => setEdit(true)}>
                                <FontAwesomeIcon className={`text-${theme}-accent text-xl`} icon={faPencil} />
                            </button>
                            <button className={`border-${theme}-button-alt-border bg-${theme}-primary border-2 rounded-xl p-1 aspect-square shrink-0 basis-11`} onClick={() => { handleDeleteClick("adventures", parseInt(adventureId || "0")) }}>
                                <FontAwesomeIcon className={`text-${theme}-accent text-xl`} icon={faTrashAlt} />
                            </button>
                        </div>
                    }
                    {edit &&
                        <div className="space-x-3">
                            <button className={`border-${theme}-button-alt-border bg-${theme}-primary border-2 rounded-xl p-1 aspect-square shrink-0 basis-11`} onClick={saveAdventure}>
                                <FontAwesomeIcon className={`text-${theme}-accent text-xl`} icon={faFloppyDisk} />
                            </button>
                        </div>
                    }
                </div>
                {!edit &&
                    <h2 className={`font-${theme}-heading text-${theme}-heading text-center text-3xl mx-auto`}>{adventure?.title}</h2>
                }
                {edit &&
                    <div className="flex items-end basis-full mb-3 space-y-2">
                        <div className="mr-2 w-full">
                            <label htmlFor="adventure-title-input" className={`${theme}-label block`}>Enter a Title*</label>
                            <input
                                type="text"
                                id="adventure-title-input"
                                name="adventure-title-input"
                                className={`bg-${theme}-field border-${theme}-primary border-[3px] rounded-xl text-${theme}-heading text-3xl font-${theme}-heading px-1 py-2 block w-full text-center`}
                                autoComplete="off"
                                onChange={() => handleInputChange(titleInputRef)}
                                onBlur={fieldLoseFocus}
                                value={titleText}
                                disabled={loading}
                                required
                                ref={titleInputRef}
                                maxLength={80}
                                data-name="Title"
                            />
                        </div>
                    </div>
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

            <section className="w-full mb-3 px-2 lg:px-10">
                <h3 className={`font-${theme}-heading text-${theme}-heading text-center text-2xl mx-auto mb-3`}>{adventure?.campaign_setting}, {adventure?.game[0] === "A" || adventure?.game[0] === "E" || adventure?.game[0] === "I" || adventure?.game[0] === "O" || adventure?.game[0] === "U" || adventure?.game[0] === "Y" ? "an" : "a"} {adventure?.game} campaign setting</h3>
                <div className={`h-3 mt-1.5 mx-auto w-64 border-${theme}-progress-border border-2 bg-${theme}-progress-void rounded-full`}>
                    <div className={`h-full bg-${theme}-progress-fill rounded-full`} style={{ width: `${adventure?.progress}%` }}></div>
                </div>
            </section>

            <section className="w-full px-2 space-y-3 lg:w-4/5">
                {edit &&
                    <CSRFToken />
                }
                <Stage key="exposition" title="Background" content={exposition} edit={edit} setRef={setExpositionRef} inputText={expositionText} loading={loading} />
                <Stage key="incitement" title="Beginning" content={incitement} edit={edit} setRef={setIncitementRef} inputText={incitementText} loading={loading} />
                <Carousel dynamicHeight={true} preventMovementUntilSwipeScrollTolerance={true} swipeScrollTolerance={edit ? 250 : 25} emulateTouch={!edit} centerMode={true} centerSlidePercentage={100} showStatus={false} showThumbs={false} onChange={handleSlideChange} selectedItem={activeScene} >
                    {scenes?.map((scene, i) => (
                        <SceneDetails key={scene?.id || i} scene={scene} scenes={scenes} setScenes={setScenes} sceneIndex={i} edit={edit} setDeleteType={setDeleteType} setDeleteId={setDeleteId} handleDeleteClick={handleDeleteClick} startScene={startScene} completeScene={completeScene} startEncounter={startEncounter} completeEncounter={completeEncounter} loading={loading} setActiveScene={setActiveScene} setDeleteConfirm={setDeleteConfirm} />
                    ))}
                </Carousel>
                <Stage key="climax" title="Climax" content={climax} edit={edit} setRef={setClimaxRef} inputText={climaxText} loading={loading} climax_progress={climax_progress} scenes_complete={scenes_complete} startClimax={startClimax} completeClimax={completeClimax} />
                <Stage key="denoument" title="Epilogue" content={denoument} edit={edit} setRef={setDenoumentRef} inputText={denoumentText} loading={loading} />
            </section>

            {deleteConfirm &&
                <DeleteConfirm deleteType={deleteType} deleteId={deleteId} setDeleteConfirm={setDeleteConfirm} setReloadRequired={setReloadRequired} redirectRequired={redirectRequired} />
            }
        </main>
    );
}