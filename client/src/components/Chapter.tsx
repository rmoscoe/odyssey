import { useState, useEffect } from 'react';
import { useTheme } from '../utils/ThemeContext';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTrashAlt, faPencil, faFloppyDisk, faPlus } from '@fortawesome/free-solid-svg-icons';
import Scene from './Scene';
import Carousel, { ScrollMode } from 'nuka-carousel';

type Encounter = {
    id: number | undefined;
    encounter_type: string | null;
    description: string | null;
    stats: string | null;
}

type SceneData = {
    sequence: number;
    challenge: string | null;
    setting: string | null;
    encounter_set: Encounter[];
    plot_twist: string | null;
    clue: string | null;
}

interface ChapterProps {
    chapterTitle: string;
    chapterContent: string | SceneData[] | null;
    handleDeleteClick: () => void;
    deleting: string;
    setDeleting: (value: string) => void;
    chapterToDelete: string;
    setChapterToDelete: (value: string) => void;
    setDeleteType: (value: string) => void;
}

export default function Chapter({ chapterTitle, chapterContent, handleDeleteClick, deleting, setDeleting, chapterToDelete, setChapterToDelete, setDeleteType }: ChapterProps) {
    const { theme } = useTheme();
    const [chapterText, setChapterText] = useState('');
    const [editContent, setEditContent] = useState(false);
    const [content, setContent] = useState('');
    const [editScene, setEditScene] = useState(false);
    const [sceneToEdit, setSceneToEdit] = useState(1);
    const [currentScene, setCurrentScene] = useState(1);

    if (typeof chapterContent === 'string') {
        setChapterText(chapterContent);
    }

    useEffect(() => {
        if (deleting === 'chapter' && chapterToDelete === chapterTitle) {
            setChapterText('');
            setDeleting('');
            setDeleteType('');
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [deleting, chapterToDelete]);

    let title = '';

    switch (chapterTitle) {
        case 'Exposition':
            title = 'Background';
            break;
        case 'Incitement':
            title = 'Beginning';
            break;
        case 'Rising Action':
            title = 'Plot';
            break;
        case 'Climax':
            title = 'Climax';
            break;
        case 'Denoument':
            title = 'Epilogue';
            break;
        default:
            title = chapterTitle;
    }

    const editChapter = () => {
        setEditContent(true);
        setContent(chapterText);
    }

    const saveChapter = () => {
        setChapterText(content);
        setContent('');
        setEditContent(false);
    }

    const deleteChapter = () => {
        setChapterToDelete(chapterTitle);
        setDeleteType('chapters')
        handleDeleteClick();
    }

    const addScene = (pos = 0) => {
        if (typeof chapterContent === 'string') {
            console.error("Invalid. Scenes can only be added to Plot component");
            return;
        }

        if (chapterContent === null) {
            chapterContent = [];
        }

        if (chapterContent.length > 0) {
            for (let i = chapterContent.length; i >= pos; i--) {
                chapterContent[i] = chapterContent[i - 1];
                chapterContent[i].sequence ++;
            }
        }

        chapterContent[pos] = {
            sequence: pos + 1,
            challenge: '',
            setting: '',
            encounter_set: [],
            plot_twist: null,
            clue: null
        }

        setSceneToEdit(pos + 1);
        setEditScene(true);
    }

    const handleInputChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
        const { target } = e;
        const inputValue = target.innerText;

        setChapterText(inputValue);
    }

    const defaultControlsConfig = {
        nextButtonClassName: `${theme}-next`,
        pagingDotsClassName: `${theme}-dot`,
        prevButtonClassName: `${theme}-prev`,
        afterSlide: (idx: number) => {setCurrentScene(idx + 1);}
    }

    return (
        <section className={`m-2 bg-${theme}-contrast rounded-2xl p-2 w-full`}>
            <section className="flex justify-between w-full mb-2">
                <h3 className={`font-${theme}-heading text-${theme}-heading text-xl`}>{title}</h3>
                {title !== 'Plot' && !editContent &&
                    <div className="button-container flex shrink-0 basis-12 ml-2 space-x-0.5">
                        <button className={`border-${theme}-button-alt-border bg-${theme}-primary border-2 rounded-xl p-1 aspect-square shrink-0 basis-11`} onClick={editChapter}>
                            <FontAwesomeIcon className={`text-${theme}-accent text-xl`} icon={faPencil} />
                        </button>
                        <button className={`border-${theme}-button-alt-border bg-${theme}-primary border-2 rounded-xl p-1 aspect-square shrink-0 basis-11`} onClick={deleteChapter}>
                            <FontAwesomeIcon className={`text-${theme}-accent text-xl`} icon={faTrashAlt} />
                        </button>
                    </div>
                }
                {title !== 'Plot' && editContent &&
                    <div className="button-container flex shrink-0 basis-12 ml-2 space-x-0.5">
                        <button className={`border-${theme}-button-alt-border bg-${theme}-primary border-2 rounded-xl p-1 aspect-square shrink-0 basis-11`} onClick={saveChapter}>
                            <FontAwesomeIcon className={`text-${theme}-accent text-xl`} icon={faFloppyDisk} />
                        </button>
                    </div>
                }
                {title === 'Plot' && !editScene &&
                    <div className="button-container flex shrink-0 basis-12 ml-2 space-x-0.5">
                        <button className={`border-${theme}-button-alt-border bg-${theme}-primary border-2 rounded-xl p-1 aspect-square shrink-0 basis-11`} onClick={() => addScene(chapterContent !== null ? chapterContent.length : 0)}>
                            <FontAwesomeIcon className={`text-${theme}-accent text-xl`} icon={faPlus} />
                        </button>
                    </div>
                }
            </section>

            <section className="w-full p-2">
                {title !== 'Plot' && !editContent &&
                    <p className={`${theme}-text chapter`}>{chapterText}</p>
                }
                {title !== 'Plot' && editContent &&
                    <textarea
                        autoComplete="off"
                        id={`${title}-content`}
                        name={`${title}-content`}
                        className={`bg-${theme}-field border-${theme}-primary border-[3px] rounded-xl text-${theme}-text w-full text-lg px-1 py-2 mt-2`}
                        onChange={handleInputChange}
                        rows={4}
                    >
                        {chapterText}
                    </textarea>
                }
                {title === 'Plot' &&
                    <Carousel adaptiveHeight={true} scrollMode={"remainder" as ScrollMode} cellSpacing={18} className="p-3" defaultControlsConfig={defaultControlsConfig} >
                        <Scene scenes={Array.isArray(chapterContent) ? chapterContent : []} handleDeleteClick={handleDeleteClick} editScene={editScene} sceneToEdit={sceneToEdit} deleting={deleting} setDeleting={setDeleting} currentScene={currentScene} setCurrentScene={setCurrentScene} setDeleteType={setDeleteType}/>
                    </Carousel>
                }
            </section>
        </section>
    );
}