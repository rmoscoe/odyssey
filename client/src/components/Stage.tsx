/* eslint-disable react-hooks/exhaustive-deps */
import { useEffect, useRef } from 'react';
import { useTheme } from '../utils/ThemeContext';

// type stageObject = {
//     stageTitle: string,
//     stageContent: string,
// }

interface StageProps {
    title: string;
    content: string;
    edit: boolean;
    setRef: React.Dispatch<React.SetStateAction<React.MutableRefObject<HTMLTextAreaElement | null>>>;
    inputText: string;
    loading: boolean;
    climax_progress?: number;
    scenes_complete?: boolean;
    startClimax?: () => void;
    completeClimax?: () => void;
}

export default function Stage({ title, content, edit, setRef, inputText, loading, climax_progress, scenes_complete, startClimax, completeClimax }: StageProps) {
    const { theme } = useTheme();

    const stageInputRef = useRef<HTMLTextAreaElement | null>(null);

    useEffect(() => {
        setRef(stageInputRef);
    }, [stageInputRef]);

    return (
        <section className={`m-2 bg-${theme}-stage-background rounded-2xl p-2 w-full`}>
            <section className="flex justify-between w-full mb-2">
                <h3 className={`font-${theme}-heading text-${theme}-form-heading text-xl`}>{title}</h3>
                {title === "Climax" &&
                    <div className={`h-3 mt-1.5 w-full border-${theme}-progress-border border-2 bg-${theme}-progress-void rounded-full lg:hidden`}>
                        <div className={`h-full bg-${theme}-progress-fill rounded-full`} style={{ width: `${climax_progress}%` }}></div>
                    </div>
                }
            </section>

            {!edit &&
                <p className={`${theme}-text chapter`}>{content}</p>
            }
            {edit &&
                <textarea
                    autoComplete="off"
                    id={`adventure-${title}-input`}
                    name={`adventure-${title}-input`}
                    className={`bg-${theme}-field border-${theme}-primary border-[3px] rounded-xl text-${theme}-text w-full text-lg px-1 py-2 mt-2`}
                    // onChange={handleInputChange}
                    rows={4}
                    {...title === "Background" && { maxLength: 499 }}
                    value={inputText}
                    disabled={loading}
                    ref={stageInputRef}
                    data-name="Title"
                >
                    {inputText}
                </textarea>
            }

            {title === "Climax" && climax_progress !== undefined && climax_progress < 100 && scenes_complete &&
                <section className="flex justify-end w-full mt-2">
                    {climax_progress === 0 &&
                        <button onClick={startClimax} className={`border-${theme}-button-alt-border border-[3px] rounded-xl text-lg bg-${theme}-primary text-${theme}-accent font-${theme}-text py-1 px-2`}>Start</button>
                    }
                    {climax_progress > 0 &&
                        <button onClick={completeClimax} className={`border-${theme}-button-alt-border border-[3px] rounded-xl text-lg bg-${theme}-primary text-${theme}-accent font-${theme}-text py-1 px-2`}>Complete</button>
                    }
                </section>
            }
        </section>
    );
}