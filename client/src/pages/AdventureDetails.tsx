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
    const { title, created_at, last_modified, game, campaign_setting, scene_set, status } = location.state || {};
    let { id } = location.state || {};
    let { progress, climax_progress } = location.state || {};

    const [exposition, setExposition] = useState(location.state.exposition);
    const [incitement, setIncitement] = useState(location.state.incitement);
    const [climax, setClimax] = useState(location.state.climax);
    const [denoument, setDenoument] = useState(location.state.denoument);
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
    const [deleting, setDeleting] = useState("");
    const [sceneDelIdx, setSceneDelIdx] = useState<number | undefined>(undefined);
    const [carouselKey, setCarouselKey] = useState(0);
    const [removeScene, setRemoveScene] = useState(false);
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const [adventureKey, _setAdventureKey] = useState(1);
    const [saveScene, setSaveScene] = useState(false);
    const [saveComplete, setSaveComplete] = useState(true);
    const [rerenderRequired, setRerenderRequired] = useState(false);

    const adventureDetailsRef = useRef<HTMLElement | null>(null);
    const titleInputRef = useRef<HTMLInputElement | null>(null);
    const scenesSaved = useRef(0);

    useEffect(() => {
        if (!Auth.loggedIn()) {
            navigate('/login');
            return;
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    useEffect(() => {
        if (reloadRequired) {
            window.location.reload();
            setReloadRequired(false);
        }
    }, [reloadRequired]);

    handlePageChange('Adventure Details');

    const resetScenesSaved = () => {
        scenesSaved.current = 0;
    }

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
                setExposition(isoAdventure.exposition);
                setIncitement(isoAdventure.incitement);
                setClimax(isoAdventure.climax);
                setDenoument(isoAdventure.denoument);

                const isoScenes: isoScenes = data.scene_set;
                setAdventure(isoAdventure);
                setScenes(isoScenes);
                setTitleText(isoAdventure.title);
                setExpositionText(isoAdventure.exposition);
                setIncitementText(isoAdventure.incitement);
                setClimaxText(isoAdventure.climax);
                setDenoumentText(isoAdventure.denoument);
                let allScenesComplete = true;
                for (let i = 0; i < isoScenes.length; i++) {
                    const scene = isoScenes[i]
                    if (scene?.progress !== "Complete") {
                        allScenesComplete = false;
                    } else {
                        continue;
                    }
                }
                setScenesComplete(allScenesComplete);
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

    const incScenesSaved = async () => {
        scenesSaved.current++;
        if (!scenes || scenes.length === 0 || scenesSaved.current >= scenes.length && saveScene) {
            setSaveScene(false);
            setSaveComplete(true);
            setEdit(false);
            resetScenesSaved();
            id = undefined;
            setLoading(false);
            setAdventure(undefined);
            await getAdventure();
        }
    }

    useEffect(() => {
        if (rerenderRequired) {
            setEdit(false);
            getAdventure();
        }
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [rerenderRequired]);
    
    useEffect(() => {
        if (!edit) {
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
        }

        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [saveComplete, adventureKey]);

    useEffect(() => {
        const dots = document.querySelectorAll('.dot');
        const oldTheme = theme === "fantasy" ? "sci-fi" : "fantasy";
        dots.forEach(dot => {
            dot.classList.add(`${theme}-dot`);
            dot.classList.remove(`${oldTheme}-dot`);
        });
    }, [theme, scenes, activeScene]);

    const handleDeleteClick = (dType: string, dId: number) => {
        setDeleteType(dType);
        setDeleteId(dId);
        setRedirectRequired(dType === "adventures");
        setDeleteConfirm(true);
    }

    const handleEdit = () => {
        setEdit(true);
        setCarouselKey(carouselKey + 1);
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
            exposition: expositionRef.current?.innerText || expositionText,
            incitement: incitementText,
            climax: climaxText,
            denoument: denoumentText
        }

        try {
            // save Adventure
            const response = await axios.patch(`/api/adventures/${id}/`, adventurePayload, { headers: { 'X-CSRFToken': Cookies.get('csrftoken') } });

            if (response.status === 401) {
                navigate('/login');
            } else if (response.data) {
                setAdventure(response.data);
                setSaveComplete(false);
                if (scenes) {
                    resetScenesSaved();
                }
                setSaveScene(true);
            } else {
                setNotification('Oops! Something went wrong. Please try again.');
            }
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
            const response = await axios.get(`/api/adventures/${id}/`);
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
                const updateResponse = await axios.patch(`/api/adventures/${id}/`, { progress: progressPercent }, { headers: { 'X-CSRFToken': Cookies.get('csrftoken') } });
                progress = updateResponse.data.progress;
                setRerenderRequired(true);
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
            const response = await axios.patch(`/api/adventures/${id}/`, { climax_progress: 50 }, { headers: { 'X-CSRFToken': Cookies.get('csrftoken') } });
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
            const response = await axios.patch(`/api/adventures/${id}/`, { climax_progress: 100 }, { headers: { 'X-CSRFToken': Cookies.get('csrftoken') } });
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
        <main ref={adventureDetailsRef} className="mt-[5.5rem] mb-12 w-full h-overlay p-2 max-w-[100vw] overflow-scroll">
            <section className="w-full mb-3 lg:relative">
                <div className="flex basis-[6.5rem] justify-between inset-x-0 top-0 lg:absolute">
                    <button className={`aspect-square font-${theme}-text text-${theme}-neutral text-3xl`} onClick={() => navigate('/adventures')}>&lt;</button>
                    {!edit &&
                        <div className="flex justify-end space-x-3">
                            <button className={`border-${theme}-button-alt-border bg-${theme}-primary border-2 rounded-xl p-1 aspect-square shrink-0 basis-11`} onClick={handleEdit}>
                                <FontAwesomeIcon className={`text-${theme}-accent text-xl`} icon={faPencil} />
                            </button>
                            <button className={`border-${theme}-button-alt-border bg-${theme}-primary border-2 rounded-xl p-1 aspect-square shrink-0 basis-11`} onClick={() => { handleDeleteClick("adventures", id) }}>
                                <FontAwesomeIcon className={`text-${theme}-accent text-xl`} icon={faTrashAlt} />
                            </button>
                        </div>
                    }
                    {edit &&
                        <div className="flex basis-[3.25rem] justify-end space-x-3">
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
                    <div className="flex justify-center items-end basis-full mb-3 space-y-2">
                        <div className="mr-2 w-full lg:w-4/5">
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
                <section className="modal-background z-20 flex flex-wrap justify-center items-center">
                    {savingNotifications.includes(notification) &&
                        <p className={`${theme}-text mt-3 text-center z-40`}>{notification}</p>
                    }
                    <Spinner />
                </section>
            }

            <section className="w-full mb-6 px-2 lg:px-10">
                {campaign_setting ? <h3 className={`font-${theme}-heading text-${theme}-heading text-center text-2xl mx-auto mb-3`}>{campaign_setting}, {game[0] === "A" || game[0] === "E" || game[0] === "I" || game[0] === "O" || game[0] === "U" || game[0] === "Y" ? "an" : "a"} {game} campaign setting</h3> : <h3 className={`font-${theme}-heading text-${theme}-heading text-center text-2xl mx-auto mb-3`}>{game}</h3>}
                <div className={`h-3 mt-1.5 mx-auto w-64 border-${theme}-progress-border border-2 bg-${theme}-progress-void rounded-full`}>
                    <div className={adventure?.progress && adventure?.progress < 97 ? `h-full bg-${theme}-progress-fill rounded-l-full` : `h-full bg-${theme}-progress-fill rounded-full`} style={{ width: `${adventure?.progress}%` }}></div>
                </div>
            </section>

            {notification && !savingNotifications.includes(notification) &&
                <p className={`${theme}-text my-6 text-center`}>{notification}</p>
            }

            <section key={adventureKey} className="w-full px-2 space-y-3 lg:w-4/5 mx-auto">
                {edit &&
                    <CSRFToken />
                }
                <Stage key="exposition" title="Background" content={exposition} edit={edit} setRef={setExpositionRef} inputText={expositionText} loading={loading} handleInputChange={handleInputChange} />
                <Stage key="incitement" title="Beginning" content={incitement} edit={edit} setRef={setIncitementRef} inputText={incitementText} loading={loading} handleInputChange={handleInputChange} />
                <div key={carouselKey} >
                    <Carousel dynamicHeight={true} preventMovementUntilSwipeScrollTolerance={true} swipeScrollTolerance={edit ? 250 : 25} emulateTouch={!edit} centerMode={true} centerSlidePercentage={100} showStatus={false} showThumbs={false} onChange={handleSlideChange} selectedItem={activeScene} >
                        {scenes?.map((scene, i) => (
                            <SceneDetails key={scene?.id || i} scene={scene} scenes={scenes} setScenes={setScenes} sceneIndex={i} edit={edit} handleDeleteClick={handleDeleteClick} startScene={startScene} completeScene={completeScene} startEncounter={startEncounter} completeEncounter={completeEncounter} loading={loading} setActiveScene={setActiveScene} deleting={deleting} setDeleting={setDeleting} sceneDelIdx={sceneDelIdx} setSceneDelIdx={setSceneDelIdx} reloadRequired={reloadRequired} setReloadRequired={setReloadRequired} carouselKey={carouselKey} setCarouselKey={setCarouselKey} removeScene={removeScene} setRemoveScene={setRemoveScene} adventureId={id} saveScene={saveScene} setNotification={setNotification} incScenesSaved={incScenesSaved} rerenderRequired={rerenderRequired} setRerenderRequired={setRerenderRequired} />
                        ))}
                    </Carousel>
                </div>
                <Stage key="climax" title="Climax" content={climax} edit={edit} setRef={setClimaxRef} inputText={climaxText} loading={loading} climax_progress={climax_progress} scenes_complete={scenes_complete} startClimax={startClimax} completeClimax={completeClimax} handleInputChange={handleInputChange} />
                <Stage key="denoument" title="Epilogue" content={denoument} edit={edit} setRef={setDenoumentRef} inputText={denoumentText} loading={loading} handleInputChange={handleInputChange} />
            </section>

            {deleteConfirm &&
                <DeleteConfirm deleteType={deleteType} deleteId={deleteId} setDeleteConfirm={setDeleteConfirm} setReloadRequired={setReloadRequired} redirectRequired={redirectRequired} setDeleting={setDeleting} setRemoveScene={setRemoveScene} setRerenderRequired={setRerenderRequired} />
            }
        </main>
    );
}