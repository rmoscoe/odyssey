// import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTheme } from '../utils/ThemeContext';
import axios from 'axios';
import Cookies from 'js-cookie';

type DeleteProps = {
    deleteType: string;
    deleteId: number;
}

export default function DeleteConfirm({ deleteType, deleteId }: DeleteProps) {
    const { theme } = useTheme();
    const navigate = useNavigate();

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
            const response = await axios.delete(`/api/${deleteType}/${deleteId}`, { headers: { 'X-CSRFToken': Cookies.get('csrftoken') } });
            if (response.status === 401) {
                navigate('/login');
            }
        } catch (err) {
            console.error(err);
        }
    }

    return (
        <div className="modal">
            <div className="modal-background" onClick={closeModal}></div>
            <div className={`modal-card lg:my-0 lg:mx-auto lg:w-[640px] rounded-[6px] bg-${theme}-contrast`}>
                <header className={`modal-card-head bg-${theme}-primary`}>
                    <p className={`modal-card-title font-${theme}-heading text-${theme}-heading text-2xl`}>{cardHeading}</p>
                    <button className="delete" aria-label="close" onClick={closeModal}></button>
                </header>
                <section className="modal-card-body">
                    <p className={`${theme}-text`}>Are you sure you wish to delete this {deleteContent}? This action cannot be undone.</p>
                </section>
                <footer className={`modal-card-foot bg-${theme}-primary`}>
                    <button className="button" onClick={closeModal}>Cancel</button>
                    <button className="button" onClick={handleDeleteConfirm}>Delete</button>
                </footer>
            </div>
        </div>
    );
}