import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTheme } from '../utils/ThemeContext';
import axios from 'axios';
import Cookies from 'js-cookie';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faX } from '@fortawesome/free-solid-svg-icons';

type DeleteProps = {
    deleteType: string;
    deleteId: number;
}

export default function DeleteConfirm({ deleteType, deleteId }: DeleteProps) {
    const { theme } = useTheme();
    const navigate = useNavigate();
    const [deleting, setDeleting] = useState(false);

    useEffect(() => {
        if (deleting) {
            window.location.reload();
            setDeleting(false);
        }
    }, [deleting]);

    let cardHeading = "Delete ";
    let deleteContent: string;

    switch (deleteType) {
        case 'adventures':
            cardHeading += "Adventure";
            deleteContent = "adventure";
            break;
        case 'scenes':
            cardHeading += "Scene";
            deleteContent = "scene";
            break;
        case 'encounters':
            cardHeading += "Encounter";
            deleteContent = "encounter";
            break;
        case 'custom-fields':
            cardHeading += "Custom Field";
            deleteContent = "custom field";
            break;
        default:
            cardHeading += "Unknown";
            deleteContent = "unknown content";
    }

    const closeModal = () => {
        document.querySelector('.modal')?.classList.remove('is-active');
    }

    const handleDeleteConfirm = async () => {
        try {
            closeModal();
            const response = await axios.delete(`/api/${deleteType}/${deleteId}/`, { headers: { 'X-CSRFToken': Cookies.get('csrftoken') } });
            if (response.status === 401) {
                navigate('/login');
            }
            if (response.status === 204) {
                setDeleting(true);
            }
        } catch (err) {
            console.error(err);
        }
    }

    return (
        <div className="modal">
            <div className="modal-background" onClick={closeModal}></div>
            <div className={`modal-card w-11/12 lg:my-0 lg:mx-auto lg:w-[640px] rounded-[6px] bg-${theme}-contrast`}>
                <header className={`modal-card-head bg-${theme}-primary`}>
                    <p className={`modal-card-title font-${theme}-heading text-${theme}-heading text-2xl`}>{cardHeading}</p>
                    <button className={`delete border-${theme}-accent bg-${theme}-primary border-2 rounded-full aspect-square`} aria-label="close" onClick={closeModal}>
                        <FontAwesomeIcon className={`font-${theme}-text text-${theme}-accent text-xl ml-auto`} icon={faX} />
                    </button>
                </header>
                <section className="modal-card-body min-h-fit py-11">
                    <p className={`${theme}-text`}>Are you sure you wish to delete this {deleteContent}? This action cannot be undone.</p>
                </section>
                <footer className={`modal-card-foot bg-${theme}-primary`}>
                    <button className={`button border-${theme}-accent border-[3px] rounded-xl text-lg bg-${theme}-primary text-${theme}-accent font-${theme}-text py-1.5 px-6 ml-3`} onClick={closeModal}>Cancel</button>
                    <button className={`button border-${theme}-accent border-[3px] rounded-xl text-lg bg-${theme}-primary text-${theme}-accent font-${theme}-text py-1.5 px-6 ml-3`} onClick={handleDeleteConfirm}>Delete</button>
                </footer>
            </div>
        </div>
    );
}