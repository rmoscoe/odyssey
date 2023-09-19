import { useEffect, useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTheme } from '../utils/ThemeContext';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faX, faDiceD20 } from '@fortawesome/free-solid-svg-icons';

type SaveProps = {
    adventureId: number;
    setAdventureSaved: (value: boolean) => void;
}

export default function SaveConfirm({ adventureId, setAdventureSaved }: SaveProps) {
    const { theme } = useTheme();
    const navigate = useNavigate();
    const [reloadRequired, setReloadRequired] = useState(false);

    const modalRef = useRef<HTMLDivElement | null>(null);

    useEffect(() => {
        if (reloadRequired) {
            window.location.reload();
            setReloadRequired(false);
        }
    }, [reloadRequired]);

    const closeModal = () => {
        setAdventureSaved(false);
    }

    const viewAdventureDetails = () => {
        closeModal();
        navigate(`/adventures/${adventureId}`);
    }

    const viewAdventures = () => {
        closeModal();
        navigate('/adventures');
    }

    const generateAnotherAdventure = () => {
        closeModal();
        setReloadRequired(true);
    }

    return (
        <div className="modal is-active" ref={modalRef}>
            <div className="modal-background" onClick={closeModal}></div>
            <div className={`modal-card w-11/12 lg:my-0 lg:mx-auto lg:w-[640px] rounded-[6px] bg-${theme}-primary`}>
                <header className={`modal-card-head`}>
                    <p className={`modal-card-title font-${theme}-heading text-${theme}-accent text-2xl`}>Adventure Saved</p>
                    <button className={`delete bg-${theme}-primary aspect-square`} aria-label="close" onClick={closeModal}>
                        <FontAwesomeIcon className={`font-${theme}-text text-${theme}-accent text-xl ml-auto`} icon={faX} />
                    </button>
                </header>
                <section className="modal-card-body min-h-fit py-11">
                    <div className={`w-full lg:block lg:w-1/2`}>
                        <FontAwesomeIcon className={`text-${theme}-accent h-24 w-24`} icon={faDiceD20} />
                    </div>
                    <div className="w-full lg:w-1/2 lg:pl-6">
                        <p className={`font-${theme}-text text-${theme}-accent text-lg w-full`}>Success! Your adventure has been saved. What would you like to do next?</p>
                    </div>
                </section>
                <footer className={`modal-card-foot bg-${theme}-primary`}>
                    <div className="block mt-5 w-full">
                        <button className={`button border-${theme}-accent border-[3px] rounded-xl text-lg bg-${theme}-primary text-${theme}-accent font-${theme}-text mb-3 py-1.5 px-6 w-full`} onClick={viewAdventureDetails}>View Adventure Details</button>
                        <button className={`button border-${theme}-accent border-[3px] rounded-xl text-lg bg-${theme}-primary text-${theme}-accent font-${theme}-text mb-3 py-1.5 px-6 w-full`} onClick={viewAdventures}>View All Adventures</button>
                        <button className={`button border-${theme}-accent border-[3px] rounded-xl text-lg bg-${theme}-primary text-${theme}-accent font-${theme}-text mb-1 py-1.5 px-6 w-full`} onClick={generateAnotherAdventure}>Generate Another Adventure</button>
                    </div>
                </footer>
            </div>
        </div>
    );
}