/* eslint-disable react-hooks/exhaustive-deps */
import { useState, useEffect } from 'react';
import { useTheme } from '../utils/ThemeContext';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTrashAlt, faPencil, faFloppyDisk, faPlus } from '@fortawesome/free-solid-svg-icons';
import Scene from './Scene';
import { Carousel } from 'react-responsive-carousel';
import 'react-responsive-carousel/lib/styles/carousel.min.css';

type Encounter = {
    id?: number | undefined;
    type: string | null;
    description: string | null;
    stats?: string | null;
}

type SceneData = {
    sequence: number;
    challenge: string | null;
    setting: string | null;
    encounters: Encounter[];
    plot_twist: string | null;
    clue: string | null;
}

type chapterObject = {
    chapterTitle: string;
    chapterContent: string | SceneData[] | null;
}

interface ChapterProps {
    chapter: chapterObject;
    setChapter: React.Dispatch<React.SetStateAction<chapterObject>>;
    handleDeleteClick: () => void;
    deleting: string;
    setDeleting: (value: string) => void;
    chapterToDelete: string;
    setChapterToDelete: (value: string) => void;
    setDeleteType: (value: string) => void;
}

export default function Chapter({ chapter, setChapter, handleDeleteClick, deleting, setDeleting, chapterToDelete, setChapterToDelete, setDeleteType }: ChapterProps) {
    const { theme } = useTheme();
    const [editContent, setEditContent] = useState(false);
    const [content, setContent] = useState('');
    const [editScene, setEditScene] = useState(false);

    const [currentScene, setCurrentScene] = useState(1);

    let { chapterTitle, chapterContent } = chapter;

    const [scenes, setScenes] = useState<SceneData[]>([]);

    useEffect(() => {
        if (typeof chapterContent !== 'string') {
            setScenes(chapterContent?.slice() ?? []);
        } else {
            setContent(chapterContent);
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [chapterContent]);



    useEffect(() => {
        if (deleting === 'chapter' && chapterToDelete === chapterTitle) {
            setChapter(chapterTitle === 'Rising Action' ? { chapterTitle, chapterContent: [] } : { chapterTitle, chapterContent: '' });
            setDeleting('');
            setDeleteType('');
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [deleting, chapterToDelete]);

    useEffect(() => {
        const updateChapter = () => {
            chapterTitle = chapter.chapterTitle;
            chapterContent = chapter.chapterContent;
        }

        updateChapter();
    }, [chapter]);

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
        if (typeof chapterContent === 'string') {
            setContent(chapterContent);
        }
    }

    const saveChapter = () => {
        // const newContent = content ?? scenes;
        // setContent('');
        setChapter({
            chapterTitle,
            chapterContent: content ?? scenes
        });
        setEditContent(false);
    }

    const deleteChapter = () => {
        setChapterToDelete(chapterTitle);
        setDeleteType('chapters')
        handleDeleteClick();
    }

    const addScene = (pos = 0) => {
        if (typeof chapterContent === 'string') {
            return;
        }

        let updatedChapterContent: SceneData[];
        if (!chapterContent) {
            updatedChapterContent = [];
        } else {
            updatedChapterContent = chapterContent.slice();
        }

        if (updatedChapterContent.length > 0) {
            for (let i = updatedChapterContent.length - 1; i >= pos; i--) {
                // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
                updatedChapterContent[i + 1] = chapterContent!.slice(i, i + 1)[0];
                updatedChapterContent[i + 1].sequence++;
            }
        }

        const newScene = {
            sequence: pos + 1,
            challenge: '',
            setting: '',
            encounters: [],
            plot_twist: null,
            clue: null
        }

        updatedChapterContent[pos] = newScene;

        setScenes(updatedChapterContent);

        setCurrentScene(newScene.sequence);
        setEditScene(true);
    }

    const handleInputChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
        const { target } = e;
        const inputValue = target.value;

        setContent(inputValue);
    }

    return (
        <section className={`m-2 bg-${theme}-contrast rounded-2xl p-2 w-full`}>
            <section className="flex justify-between w-full mb-2">
                <h3 className={`font-${theme}-heading text-${theme}-heading text-xl`}>{title}</h3>
                {title !== 'Plot' && !editContent &&
                    <div className="button-container flex basis-[5.75rem] shrink-0 ml-2 space-x-0.5 justify-between">
                        <button className={`border-${theme}-button-alt-border bg-${theme}-primary border-2 rounded-xl p-1 aspect-square shrink-0 basis-11`} onClick={editChapter}>
                            <FontAwesomeIcon className={`text-${theme}-accent text-xl`} icon={faPencil} />
                        </button>
                        <button className={`border-${theme}-button-alt-border bg-${theme}-primary border-2 rounded-xl p-1 aspect-square shrink-0 basis-11`} onClick={deleteChapter}>
                            <FontAwesomeIcon className={`text-${theme}-accent text-xl`} icon={faTrashAlt} />
                        </button>
                    </div>
                }
                {title !== 'Plot' && editContent &&
                    <div className="button-container flex basis-12 shrink-0 ml-2 space-x-0.5">
                        <button className={`border-${theme}-button-alt-border bg-${theme}-primary border-2 rounded-xl p-1 aspect-square shrink-0 basis-11`} onClick={saveChapter}>
                            <FontAwesomeIcon className={`text-${theme}-accent text-xl`} icon={faFloppyDisk} />
                        </button>
                    </div>
                }
                {title === 'Plot' && !editScene &&
                    <div className="button-container flex basis-12 shrink-0 ml-2 space-x-0.5">
                        <button className={`border-${theme}-button-alt-border bg-${theme}-primary border-2 rounded-xl p-1 aspect-square shrink-0 basis-11`} onClick={() => addScene(chapterContent !== null ? chapterContent.length : 0)}>
                            <FontAwesomeIcon className={`text-${theme}-accent text-xl`} icon={faPlus} />
                        </button>
                    </div>
                }
            </section>

            <section className="w-full p-2">
                {title !== 'Plot' && !editContent &&
                    <p className={`${theme}-text chapter`}>{typeof chapterContent === 'string' ? chapterContent : 'Cannot display scenes here.'}</p>
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
                        {typeof chapterContent === 'string' ? content : 'Cannot display scenes here.'}
                    </textarea>
                }
                {title === 'Plot' &&
                    <Carousel dynamicHeight={true} preventMovementUntilSwipeScrollTolerance={true} swipeScrollTolerance={editScene ? 250 : 25} emulateTouch={!editScene} centerMode={true} centerSlidePercentage={100} showStatus={false} showThumbs={false}>
                        {scenes.map((scene, i) => (
                            <Scene key={`scene-${i}`} scene={scene} scenes={scenes} sceneIndex={i} setScenes={setScenes} handleDeleteClick={handleDeleteClick} editScene={editScene} setEditScene={setEditScene} deleting={deleting} setDeleting={setDeleting} currentScene={currentScene} setDeleteType={setDeleteType} chapter={chapter} setChapter={setChapter} addScene={addScene} />
                        ))}
                    </Carousel>
                }
            </section>
        </section>
    );
}