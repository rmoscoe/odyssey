/* eslint-disable react-hooks/exhaustive-deps */
import { useState, useEffect } from 'react';
import { useTheme } from '../utils/ThemeContext';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTrashAlt, faPencil, faFloppyDisk, faPlus } from '@fortawesome/free-solid-svg-icons';

type stageObject = {
    stageTitle: string,
    stageContent: string,
}

interface StageProps {
    title: string;
    content: string;
    edit: boolean;
    setRef: React.Dispatch<React.SetStateAction<React.MutableRefObject<HTMLTextAreaElement | null>>>;
    inputText: string;
    setDeleteType: (value: string) => void;
    setDeleteId: (value: number) => void;
    handleDeleteClick: (dType: string, dId: number) => void;
}

export default function Stage({ title, content, edit, setRef, inputText, setDeleteType, setDeleteId, handleDeleteClick }: StageProps) {
    const { theme } = useTheme();
    
    return (
        <></>
    );
}