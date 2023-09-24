import React, { useEffect, useState } from 'react';
import { useTheme } from '../utils/ThemeContext';
import { useNavigate, useLocation, useParams } from 'react-router-dom';
import Auth from '../utils/auth';
import Adventure from '../components/Adventure';
import axios, { AxiosError } from 'axios';

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
    const [adventure, setAdventure] = useState<isoAdventure | undefined >(undefined);
    const [scenes, setScenes] = useState<isoScenes | undefined >(undefined);
    const [deleteType, setDeleteType] = useState("");
    const [deleteId, setDeleteId] = useState(0);
    const [redirectRequired, setRedirectRequired] = useState(false);

    const { id, title, created_at, last_modified, game, campaign_setting, exposition, incitement, scene_set, climax, denoument, progress, status } = location.state || {};

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
                    const isoScenes: isoScenes =  data.scene_set;
                    setAdventure(isoAdventure);
                    setScenes(isoScenes);
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

    return (
        <></>
    );
}