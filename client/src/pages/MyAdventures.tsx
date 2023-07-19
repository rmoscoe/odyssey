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
                const userId = token.fields.user;
                console.log(`userId: ${userId}\tMyAdventures 61`);
                const response = await axios.get(`/api/adventures/?user_id=${userId}`)
                if (response.status === 401) {
                    navigate('/login');
                } else if (response.data) {
                    console.log(`response.data: ${response.data}\tMyAdventures 66`)
                    const adventuresData: adventure[] = response.data;
                    setAdventures(adventuresData);
                } else {
                    setAdventures([]);
                }
            } catch (err) {
                console.error(err);
            }
        }

        getAdventures();
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const newAdventureHandler = () => navigate('/adventures/new');

    const handleDeleteClick = (id: number) => {
        setDeleteTarget(id);
        document.querySelector('.modal')?.classList.add('is-active');
    }

    return (
        <main className="mt-[5.5rem] w-full h-overlay p-2">
            <div className="flex justify-center w-full my-3">
                <section className="flex mx-auto justify-between px-3 my-3 lg:hidden">
                    <button onClick={newAdventureHandler} className={`border-${theme}-accent border-[3px] rounded-xl text-lg bg-${theme}-primary text-${theme}-accent font-${theme}-text py-1 px-6`}>New Adventure</button>
                </section>
            </div>

            <h2 className={`font-${theme}-heading text-${theme}-heading text-3xl mx-auto my-3 lg:mx-0 lg:my-5`}>My Adventures</h2>

            <section className="hidden justify-between w-3/5 my-3.5 lg:flex">
                <button onClick={newAdventureHandler} className={`border-${theme}-accent border-[3px] rounded-xl text-xl bg-${theme}-primary text-${theme}-accent font-${theme}-text py-1.5 px-6`}>New Adventure</button>
            </section>

            {adventures.length === 0 &&
                <p className={`${theme}-text my-3 text-center mx-auto`}>No adventures to display. Try creating a new adventure.</p>
            }

            <section className="my-3.5 flex flex-wrap justify-around content-around">
                {adventures.map((adventure, i) => (
                    <Adventure adventure={adventure} handleDeleteClick={handleDeleteClick} key={`adventure-${i}`} />
                ))}
            </section>

            <DeleteConfirm deleteType="adventures" deleteId={deleteTarget} />
        </main>
    );
}