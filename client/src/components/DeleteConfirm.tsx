import { useNavigate } from 'react-router-dom';
import { useTheme } from '../utils/ThemeContext';
import axios from 'axios';
import Cookies from 'js-cookie';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faX, faSkull, faRadiation } from '@fortawesome/free-solid-svg-icons';

type DeleteProps = {
    deleteType: string;
    deleteId?: number;
    setDeleting?: (value: string) => void;
    setDeleteConfirm: (value: boolean) => void;
    setReloadRequired?: (value: boolean) => void;
}

export default function DeleteConfirm({ deleteType, deleteId, setDeleting, setDeleteConfirm, setReloadRequired }: DeleteProps) {
    const { theme } = useTheme();
    const navigate = useNavigate();

    let deleteContent: string;

    switch (deleteType) {
        case 'adventures':
            deleteContent = "adventure";
            break;
        case 'scenes':
            deleteContent = "scene";
            break;
        case 'encounters':
            deleteContent = "encounter";
            break;
        case 'custom-fields':
            deleteContent = "custom field";
            break;
        case 'chapters':
            deleteContent = "part of the adventure";
            break;
        case 'scene':
            deleteContent = "scene";
            break;
        case 'encounter':
            deleteContent = "encounter";
            break;
        default:
            deleteContent = "unknown content";
    }

    const closeModal = () => {
        setDeleteConfirm(false);
    }

    const handleDeleteConfirm = async () => {
        if (deleteType === 'adventures') {
            try {
                closeModal();
                const response = await axios.delete(`/api/${deleteType}/${deleteId}/`, { headers: { 'X-CSRFToken': Cookies.get('csrftoken') } });
                if (response.status === 401) {
                    navigate('/login');
                }
                if (response.status === 204 && setReloadRequired) {
                    setReloadRequired(true);
                }
            } catch (err) {
                console.error(err);
            }
        }

        if (deleteType === 'chapters') {
            setDeleting ? setDeleting('chapter') : console.error("Cannot delete chapter because setDeleting() is not available");
            closeModal();
        }

        if (deleteType === 'scene') {
            setDeleting ? setDeleting('scene') : console.error("Cannot delete scene because setDeleting() is not available");
            closeModal();
        }

        if (deleteType === 'encounter') {
            setDeleting ? setDeleting('encounter') : console.error("Cannot delete encounter because setDeleting() is not available");
            closeModal();
        }

        if (deleteContent === 'unknown content') {
            closeModal();
        }
    }

    return (
        <div id="delete-modal" className="modal is-active">
            <div className="modal-background" onClick={closeModal}></div>
            <div className={`modal-card w-11/12 lg:my-0 lg:mx-auto lg:w-[640px] rounded-[6px] bg-${theme}-primary`}>
                <header className={`modal-card-head`}>
                    <p className={`modal-card-title font-${theme}-heading text-${theme}-accent text-2xl`}>Danger</p>
                    <button className={`delete bg-${theme}-primary aspect-square`} aria-label="close" onClick={closeModal}>
                        <FontAwesomeIcon className={`font-${theme}-text text-${theme}-accent text-xl ml-auto`} icon={faX} />
                    </button>
                </header>
                <section className="modal-card-body min-h-fit py-11">
                    <div className={`hidden lg:block lg:w-1/4`}>
                        <FontAwesomeIcon className={`text-${theme}-accent h-24 w-24`} icon={theme === 'fantasy' ? faSkull : faRadiation} />
                    </div>
                    <div className="w-full lg:w-3/4 lg:pl-6">
                        <p className={`font-${theme}-text text-${theme}-accent text-lg w-full`}>Are you sure you wish to delete this {deleteContent}? This action cannot be undone.</p>
                        <div className="hidden items-center shrink-0 justify-end p-2 w-full lg:flex">
                            <button className={`button border-${theme}-accent border-[3px] rounded-xl text-lg bg-${theme}-primary text-${theme}-accent font-${theme}-text py-1.5 px-6 ml-3`} onClick={closeModal}>Cancel</button>
                            <button className={`button border-${theme}-accent border-[3px] rounded-xl text-lg bg-${theme}-primary text-${theme}-accent font-${theme}-text py-1.5 px-6 ml-3`} onClick={handleDeleteConfirm}>Delete</button>
                        </div>
                    </div>

                </section>
                <footer className={`modal-card-foot bg-${theme}-primary`}>
                    <div className="flex justify-around mt-5 w-full lg:hidden">
                        <button className={`button border-${theme}-accent border-[3px] rounded-xl text-lg bg-${theme}-primary text-${theme}-accent font-${theme}-text py-1.5 px-6`} onClick={closeModal}>Cancel</button>
                        <button className={`button border-${theme}-accent border-[3px] rounded-xl text-lg bg-${theme}-primary text-${theme}-accent font-${theme}-text py-1.5 px-6`} onClick={handleDeleteConfirm}>Delete</button>
                    </div>
                </footer>
            </div>
        </div>
    );
}