import { useNavigate } from 'react-router-dom';
import { useTheme } from '../utils/ThemeContext';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTrashAlt } from '@fortawesome/free-solid-svg-icons';

type AdventureProps = {
    adventure: {
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
    handleDeleteClick: (id: number) => void;
}

export default function Adventure({ adventure, handleDeleteClick }: AdventureProps) {
    const theme = useTheme();
    const navigate = useNavigate();
    const { id, title, created_at, last_modified, game, campaign_setting, exposition, incitement, scene_set, climax, denoument, progress, status } = adventure;

    const handleTileClick = () => {
        navigate('/adventures/:adventureId', { state: { id, title, created_at, last_modified, game, campaign_setting, exposition, incitement, scene_set, climax, denoument, progress, status } });
    }

    const handleDelete = async (e: React.MouseEvent) => {
        e.stopPropagation();
        handleDeleteClick(id);
    }

    let currentScene = scene_set[0];
    let adventureText = '';

    for (let i = 1; i < scene_set.length; i++) {
        if (scene_set[i]?.progress === 'In Progress') {
            currentScene = scene_set[i];
        }
    }

    if (currentScene?.progress === 'Complete') {
        adventureText = climax ? climax : 'This adventure has no content.';
    } else {
        let currentEncounter = currentScene?.encounter_set[0];
        const maxI = currentScene ? (currentScene.encounter_set.length) : 0;
        for (let i = 1; i < maxI; i++) {
            if (currentScene?.encounter_set[i]?.progress === 'In Progress') {
                currentEncounter = currentScene.encounter_set[i];
            }
        }

        if (!currentEncounter) {
            adventureText = currentScene?.challenge ? currentScene.challenge : 'This scene has no content.';
        } else {
            adventureText = currentEncounter.description ? currentEncounter.description : 'This encounter has no content.';
        }
    }

    return (
        <section className={`adventure m-1.5 bg-${theme}-contrast rounded-2xl p-2 w-full lg:m-3 lg:w-5/12`} onClick={handleTileClick}>
            <h3 className={`font-${theme}-heading text-${theme}-heading text-xl`}>{title}</h3>
            <section className="flex justify-between w-full mb-2">
                <div className="mr-0.5">
                    <h4 className={`font-${theme}-heading text-${theme}-game-name text-l`}>{game}</h4>
                    <div className={`h-2 w-full border-${theme}-progress-border bg-${theme}-void rounded-full lg:hidden`}>
                        <div className={`h-full w-[${progress}%] bg-${theme}-fill rounded-l-full`}></div>
                    </div>
                </div>
                <div className="button-container flex ml-auto space-x-0.5">
                    <button className={`border-${theme}-button-alt-border bg-${theme}-primary border-2 rounded-xl p-1`} onClick={handleDelete}>
                        <FontAwesomeIcon className={`text-${theme}-accent text-xl`} icon={faTrashAlt} />
                    </button>
                </div>
            </section>
            <p className={`hidden font-${theme}-text text-${theme}-neutral mt-1 mb-2 w-full h-64 truncate overflow-hidden fade bg-gradient-to-t from-black via-transparent to-transparent lg:block`}>{adventureText}</p>
            <div className={`hidden mt-2 mx-auto h-3 w-10/12 border-${theme}-progress-border bg-${theme}-void rounded-full lg:block`}>
                <div className={`h-full w-[${progress}%] bg-${theme}-fill rounded-l-full`}></div>
            </div>
        </section>
    );
}