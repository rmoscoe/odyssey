import { useEffect, useState } from 'react';
import { useTheme } from '../utils/ThemeContext';
import { useNavigate } from 'react-router-dom';
import Auth from '../utils/auth';
import Adventure from '../components/Adventure';
import DeleteConfirm from '../components/DeleteConfirm';
import axios from 'axios';

interface AdventureDetailsProps {
    handlePageChange: (page: string) => void;
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

export default function AdventureDetails({ handlePageChange }: AdventureDetailsProps) {
    const { theme } = useTheme();
    const navigate = useNavigate();
    const [adventures, setAdventures] = useState<adventure[]>([]);
    const [deleteTarget, setDeleteTarget] = useState(0);

    if (!Auth.loggedIn()) {
        navigate('/login');
    }

    handlePageChange('My Adventures');

    useEffect(() => {
        const getAdventures = async () => {
            try {
                const token = Auth.getToken();
                const userId = token.user_id;
                const response = await axios.get(`/api/adventures/?user_id=${userId}`)
                if (response.status === 401) {
                    navigate('/login');
                } else {
                    const adventuresData: adventure[] = JSON.parse(response.data);
                setAdventures(adventuresData);
                }
            } catch (err) {
                console.error(err);
            }
        }

        getAdventures();
    });

    const newAdventureHandler = () => navigate('/adventures/new');

    const handleDeleteClick = (id: number) => {
        setDeleteTarget(id);        
        document.querySelector('.modal')?.classList.add('is-active');
    }

    return (
        <main className="mt-[5.5rem] w-full h-overlay p-2">
            <section className="flex mx-auto justify-between px-2 my-2 lg:hidden">
                <button onClick={newAdventureHandler} className={`border-${theme}-accent border-[3px] rounded-xl text-lg bg-${theme}-primary text-${theme}-accent font-${theme}-text py-1`}>New Adventure</button>
            </section>
            <h2 className={`font-${theme}-heading text-${theme}-heading text-3xl mx-auto mt-2 lg:mx-0`}>My Adventures</h2>
            <section className="hidden justify-between w-3/5 mt-2 lg:flex">
                <button onClick={newAdventureHandler} className={`border-${theme}-accent border-[3px] rounded-xl text-lg bg-${theme}-primary text-${theme}-accent font-${theme}-text py-1`}>New Adventure</button>
            </section>
            <section className="mt-2 flex justify-around content-around">
                {adventures.map((adventure, i) => (
                    <div key={i}>
                        <Adventure adventure={adventure} handleDeleteClick={handleDeleteClick} key={`adventure-${i}`} />
                    </div>
                ))}
            </section>
            <DeleteConfirm deleteType="adventures" deleteId={deleteTarget}/>
        </main>
    );
}