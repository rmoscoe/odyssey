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
}

export default function Stage({ title, content, edit, setRef, inputText, loading }: StageProps) {
    const { theme } = useTheme();

    const stageInputRef = useRef<HTMLTextAreaElement | null>(null);

    useEffect(() => {
        setRef(stageInputRef);
    }, [stageInputRef]);

    return (
        <section className={`m-2 bg-${theme}-stage-background rounded-2xl p-2 w-full`}>
            <h3 className={`font-${theme}-heading text-${theme}-form-heading text-xl`}>{title}</h3>
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
                    {...title === "Background" && {maxLength: 499}}
                    value={inputText}
                    disabled={loading}
                    ref={stageInputRef}
                    data-name="Title"
                >
                    {inputText}
                </textarea>
            }
        </section>
    );
}