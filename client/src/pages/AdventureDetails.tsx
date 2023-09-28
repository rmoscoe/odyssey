import React, { useEffect, useState, useRef } from 'react';
import { useTheme } from '../utils/ThemeContext';
import { useNavigate, useLocation, useParams } from 'react-router-dom';
import Auth from '../utils/auth';
import Adventure from '../components/Adventure';
import axios, { AxiosError } from 'axios';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTrashAlt, faPencil, faFloppyDisk, faPlus } from '@fortawesome/free-solid-svg-icons';
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
    denoument: string | null;
    progress: number;
    status: string;
};

type isoScenes = [{
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

    const { id, title, created_at, last_modified, game, campaign_setting, exposition, incitement, scene_set, climax, denoument, progress, status } = location.state || {};

    const [titleText, setTitleText] = useState(title);
    const [expositionRef, setExpositionRef] = useState<React.MutableRefObject<HTMLDivElement | null>>(useRef(null));
    const [expositionText, setExpositionText] = useState(exposition);
    const [incitementRef, setIncitementRef] = useState<React.MutableRefObject<HTMLDivElement | null>>(useRef(null));
    const [incitementText, setIncitementText] = useState(incitement);
    const [climaxRef, setClimaxRef] = useState<React.MutableRefObject<HTMLDivElement | null>>(useRef(null));
    const [climaxText, setClimaxText] = useState(climax);
    const [denoumentRef, setDenoumentRef] = useState<React.MutableRefObject<HTMLDivElement | null>>(useRef(null));
    const [denoumentText, setDenoumentText] = useState(denoument);

    const titleInputRef = useRef<HTMLInputElement | null>(null);

    useEffect(() => {
        if (!Auth.loggedIn()) {
            navigate('/login');
            return;
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

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
                denoument,
                progress,
                status
            });
            setScenes(scene_set);
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
            // TypeScript error on "current", below, should go away once the <Stage> component is written.
            expositionRef ?? expositionRef?.current.classList.add("invalid-entry");
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
                setAdventureId(response.data.id);
                type Scene = {
                    sequence: number,
                    challenge: string,
                    setting: string,
                    encounters: {
                        id?: number,
                        type: string,
                        description: string,
                        stats?: string
                    }[],
                    plot_twist: string | null,
                    clue: string | null
                }
                const scenesArr = Array.isArray(risingActionChapter.chapterContent) ? risingActionChapter.chapterContent : [];

                scenesArr?.forEach(async (scene, idx) => {
                    setNotification(`Saving Scene ${idx + 1}`);
                    const { sequence, challenge, setting, plot_twist, clue } = scene as Scene;
                    const scenePayload = {
                        adventure_id: response.data.id,
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
                        const { encounters } = scene as Scene;

                        encounters?.forEach(async encounter => {
                            setNotification('Saving encounters');
                            const { type, description } = encounter;
                            const encounterPayload = {
                                scene_id: sceneId,
                                type,
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
            setAdventure(false);
            setLoading(false);
            setAdventureSaved(true);
        } catch (err) {
            console.error(err);
            setNotification("Oops! Something went wrong. Please try again.");
            setLoading(false);
        }
    }

    const savingNotifications = ['Validating', 'Saving adventure', ...Array.from({ length: 7 }, (_, i) => `Saving scene ${i + 1}`), 'Saving encounters'];

    return (
        <main className="mt-[5.5rem] mb-6 w-full h-overlay p-2 max-w-[100vw]">
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
                <h2 className={`font-${theme}-heading text-${theme}-heading text-center text-3xl mx-auto`}>{adventure?.title}</h2>
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
                <CSRFToken />
                <Stage key="exposition" content={exposition} edit={edit} setRef={setExpositionRef} />
                <Stage key="incitement" content={incitement} edit={edit} setRef={setIncitementRef} />
                <Carousel dynamicHeight={true} preventMovementUntilSwipeScrollTolerance={true} swipeScrollTolerance={edit ? 250 : 25} emulateTouch={!edit} centerMode={true} centerSlidePercentage={100} showStatus={false} showThumbs={false}>
                    {scenes?.map((scene, i) => (
                        <SceneDetails key={scene?.id || i} scene={scene} scenes={scenes} sceneIndex={i} edit={edit} />
                    ))}
                </Carousel>
                <Stage key="climax" content={climax} edit={edit} setRef={setClimaxRef} />
                <Stage key="denoument" content={denoument} edit={edit} setRef={setDenoumentRef} />
            </section>

            {deleteConfirm &&
                <DeleteConfirm deleteType={deleteType} deleteId={deleteId} setDeleteConfirm={setDeleteConfirm} setReloadRequired={setReloadRequired} redirectRequired={redirectRequired} />
            }
        </main>
    );
}