import { useNavigate } from 'react-router-dom';
import { useTheme } from '../utils/ThemeContext';
import axios from 'axios';

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
        scenes: [{
            id: number;
            sequence: number;
            challenge: string | null;
            setting: string | null;
            encounters: [{
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
    const { id, title, created_at, last_modified, game, campaign_setting, exposition, incitement, scenes, climax, denoument, progress, status } = adventure;

    const handleTileClick = () => {
        navigate('/adventures/:adventureId', { state: { id, title, created_at, last_modified, game, campaign_setting, exposition, incitement, scenes, climax, denoument, progress, status } });
    }

    const handleDelete = async (e: React.MouseEvent) => {
        e.stopPropagation();
        handleDeleteClick(id);
    }
    return (
        <section className={`adventure m-1.5 bg-${theme}-contrast rounded-2xl p-2 lg:m-3`} onClick={handleTileClick}>
            <h3 className={`font-${theme}-heading text-${theme}-heading text-xl`}>{title}</h3>
            <section className="flex justify-between w-full mb-2">
                <div className="mr-0.5">
                    <h4 className={`font-${theme}-heading text-${theme}-game-name text-l`}>{game}</h4>
                    <div className={`h-2 w-full border-${theme}-progress-border bg-${theme}-void rounded-full lg:hidden`}>
                        <div className={`h-full w-[${progress}%] bg-${theme}-fill rounded-l-full`}></div>
                    </div>
                </div>
                <div className="button-container flex space-x-0.5">
                    {/* Add delete button here */}
                </div>
            </section>
            {/* Add scene text for size large */}
            {/* Add progress bar for size large */}
        </section>
    );
}