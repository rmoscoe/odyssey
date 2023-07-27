import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom'
import { useTheme } from '../utils/ThemeContext';
import axios from 'axios';
import Auth from '../utils/auth';
import CSRFToken from '../components/CSRFToken';
import Spinner from '../components/Spinner';

interface PageProps {
    handlePageChange: (page: string) => void;
}

const games = {
    'Ars Magica': {
        settings: ["", "Mythic Europe", "Realms of Power", "The New World", "The Mythic North", "The Mythic East"],
        experience: ["points"]
    },
    'Blade of the Iron Throne': {
        settings: null,
        experience: ["points"]
    },
    'Burning Wheel': {
        settings: null,
        experience: ["points"]
    },
    'Call of Cthulhu': {
        settings: ["", "Miskatonic University", "Cthulu Mythos", "Delta Green", "Trail of Cthulu", "Dreamlands"],
        experience: ["points"]
    },
    'Changeling: The Lost': {
        settings: ["", "The Hedge", "The Seelie Court", "The Unseelie Court", "The Freehold", "The Wyld"],
        experience: ["points"]
    },
    'Chronicles of Darkness: Changeling: The Lost': {
        settings: null,
        experience: ["points"]
    },
    'Chronicles of Darkness: Dark Eras': {
        settings: null,
        experience: ["points"]
    },
    'Chronicles of Darkness: Hunter: The Vigil': {
        settings: null,
        experience: ["points"]
    },
    'Chronicles of Darkness: Mage: The Awakening': {
        settings: null,
        experience: ["points"]
    },
    'Chronicles of Darkness: Mummy: The Resurrection': {
        settings: null,
        experience: ["points"]
    },
    'Chronicles of Darkness: Promethean: The Created': {
        settings: null,
        experience: ["points"]
    },
    'Chronicles of Darkness: Second Inquisition': {
        settings: null,
        experience: ["points"]
    },
    'Chronicles of Darkness: Trinity Continuum': {
        settings: null,
        experience: ["points"]
    },
    'Chronicles of Darkness: Werewolf: The Forsaken': {
        settings: null,
        experience: ["points"]
    },
    'Chronicles of Darkness: Wraith: The Oblivion': {
        settings: null,
        experience: ["points"]
    },
    'City of Mist': {
        settings: ["City of Mist", "Shadows & Showdowns", "Nights of Payne Town", "A Cold Fire Within", "The Bronx"],
        experience: ["points"]
    },
    'Cyberpunk 2020': {
        settings: ["", "Night City", "Deep Space", "Pacific Rim", "Eurosource Plus"],
        experience: ["points"]
    },
    'Cyberpunk Red': {
        settings: null,
        experience: ["points"]
    },
    'Dungeons & Dragons': {
        settings: ["", "Forgotten Realms", "Ravenloft", "Eberron", "Greyhawk", "Dragonlance", "Dark Sun", "Planescape", "Spelljammer", "Mystara", "Birthright"],
        experience: ["levels"]
    },
    'Fate': {
        settings: ["", "Fate Worlds: Worlds Take Flight", "Fate Worlds: Worlds Rise Up", "Fate Worlds: Worlds in Shadow", "Fate Worlds in Shadow: War of Ashes", "Fate Worlds in Shadow: Tower of the Serpents", "Fate Worlds in Shadow: Tachyon Squadron", "Fate Worlds in Shadow: Ehdrigohr", "Venture City", "Atomic Robo"],
        experience: ["points"]
    },
    'GURPS': {
        settings: ["", "GURPS Fantasy", "GURPS Space", "GURPS Cyberpunk", "GURPS Steampunk", "GURPS Historical Settings", "GURPS Horror"],
        experience: ["points"]
    },
    'homebrew (unpublished)': {
        settings: null,
        experience: ["points", "levels"]
    },
    'Hunter: The Vigil': {
        settings: null,
        experience: ["points"]
    },
    'Ironsworn': {
        settings: null,
        experience: ["points"]
    },
    'Mage: The Ascension': {
        settings: null,
        experience: ["points"]
    },
    'Marvel Heroic Roleplaying': {
        settings: ["", "Civil War", "Annihilation", "X-Men", "Breakout", "Civil War: X-Men"],
        experience: ["points"]
    },
    'Mummy: The Resurrection': {
        settings: null,
        experience: ["points"]
    },
    'Mutant Year Zero': {
        settings: null,
        experience: ["points"]
    },
    'Mutants & Masterminds': {
        settings: ["", "Freedom City", "Emerald City"],
        experience: ["points"]
    },
    'Numenera': {
        settings: ["", "Ninth World", "Into the Night", "Into the Deep", "Into the Outside", "The Devil's Spine"],
        experience: ["points"]
    },
    'Other': {
        settings: null,
        experience: ["points", "levels"]
    },
    'Paranoia XP': {
        settings: null,
        experience: ["points"]
    },
    'Pathfinder': {
        settings: ["", "The Inner Sea", "Lost Cities of Golarion"],
        experience: ["levels"]
    },
    'Promethean: The Created': {
        settings: null,
        experience: ["points"]
    },
    'Rifts': {
        settings: ["", "Vampire Kingdoms", "Atlantis", "England", "Africa", "Triax & the NGR", "South America 1", "Underseas", "Japan", "South America 2", "Juicer Uprising", "Coalition War Campaign", "Psyscape", "Lone Star", "New West", "Spirit West", "Federation of Magic", "Warlords of Russia", "Mystic Russia", "Australia", "Canada", "Splynn Dimensional Market", "Free Quebec", "Xiticix Invasion", "China 1", "China 2", "Dinosaur Swamp", "Adventures in Dinosaur Swamp", "Arzno", "Madhaven", "D-Bees of North America", "Triax 2", "Lemuria", "Northern Gun 1", "Northern Gun 2", "Megaverse in Flames"],
        experience: ["levels"]
    },
    'Savage Worlds': {
        settings: ["", "Deadlands", "Rippers", "Necessary Evil", "The Last Parsec", "The Savage World of Solomon Kane", "Interface Zero", "Beasts & Barbarians", "Hellfrost", "East Texas University", "50 Fathoms"],
        experience: ["points"]
    },
    'Shadowrun': {
        settings: ["", "Seattle", "London Falling", "Denver", "New York", "Hong Kong", "California Free State", "Seattle 2072"],
        experience: ["points"]
    },
    'Song of Ice and Fire Roleplaying': {
        settings: null,
        experience: ["points"]
    },
    'Star Trek Adventures': {
        settings: ["", "Alpha Quadrant", "Beta Quadrant", "Deep Space Nine", "Voyager", "Klingon Empire"],
        experience: ["points"]
    },
    'Star Wars: The Roleplaying Game': {
        settings: null,
        experience: ["points"]
    },
    'Stars Without Number': {
        settings: null,
        experience: ["points"]
    },
    'Tales from the Loop': {
        settings: ["", "Tales from the Flood", "Things from the Flood"],
        experience: ["points"]
    },
    'The Laundry Files': {
        settings: null,
        experience: ["points"]
    },
    'The One Ring': {
        settings: ["", "Rivendell", "Tales from Wilderland", "Ruins of the North"],
        experience: ["points"]
    },
    'The Veil': {
        settings: null,
        experience: ["points"]
    },
    'The World of Darkness': {
        settings: null,
        experience: ["points"]
    },
    'Traveller':{
        settings: ["", "Reft Sector", "The Trojan Reach"],
        experience: ["points"]
    },
    'Vampire: The Masquerade': {
        settings: null,
        experience: ["points"]
    },
    'Werewolf: The Apocalypse': {
        settings: null,
        experience: ["points"]
    },
    'Wraith: The Oblivion:': {
        settings: null,
        experience: ["points"]
    }
}

export default function NewAdventure({ handlePageChange }: PageProps) {
    const { theme } = useTheme();
    const navigate = useNavigate();
    const [game, setGame] = useState('');
    const [gameTitle, setGameTitle] = useState<string | null>(null);
    const [campaignSetting, setCampaignSetting] = useState<string | null>(null);
    const [homebrewDescription, setHomebrewDescription] = useState<string | null>(null);
    const [loading, setLoading] = useState(false);
    const [players, setPlayers] = useState<number | undefined>();
    const [level, setLevel] = useState<number | null>(null);
    const [experience, setExperience] = useState<number | null>(null);
    const [numScenes, setNumScenes] = useState(1);
    const [maxEncounters, setMaxEncounters] = useState(1);
    const [withPlotTwists, setWithPlotTwists] = useState<number | undefined>();
    const [withClues, setWithClues] = useState<number | undefined>();
    const [context, setContext] = useState('');
    const [notification, setNotification] = useState('');

    if (!Auth.loggedIn()) {
        navigate('/login');
    }

    handlePageChange('New Adventure');

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { target } = e;
        const inputId = target.id;
        const inputValue: string | number | undefined = target.tagName === 'INPUT' ? target.value : target.innerText;

        target.classList.remove("invalid-entry");

        switch (inputId) {
            case 'game-input':
                setGame(inputValue);
                break;
            case 'game-title-input':
                setGameTitle(inputValue);
                break;
            case 'homebrew-description-textarea':
                setHomebrewDescription(inputValue);
                break;
            case 'campaign-setting-input':
                setCampaignSetting(inputValue);
                break;
            case 'players-input':
                setPlayers(Number(inputValue));
                break;
            case 'level-input':
                setLevel(Number(inputValue));
                break;
            case 'experience-input':
                setExperience(Number(inputValue));
                break;
            case 'num-scenes-input':
                setNumScenes(Number(inputValue));
                break;
            case 'max-encounters-input':
                setMaxEncounters(Number(inputValue));
                break;
            case 'with-plot-twists-input':
                setWithPlotTwists(Number(inputValue));
                break;
            case 'with-clues-input':
                setWithClues(Number(inputValue));
                break;
            case 'context-textarea':
                setContext(inputValue);
                break;
            default:
                console.error(`Error: Input field ${inputId} not recognized.`);
        }
    }

    const fieldLoseFocus = (e: React.FocusEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { target } = e;
        const inputValue: string | number | undefined = target.tagName === 'INPUT' ? target.value : target.innerText;

        if (target.required && inputValue === ('' || null || undefined)) {
            target.classList.add("invalid-entry");
        }
    }

    const generateNewAdventure = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        setLoading(true);

        const form: HTMLElement | null = document.getElementById('adventure-form');
        if (form instanceof HTMLFormElement) {
            const inputElements: (HTMLInputElement | HTMLTextAreaElement)[] = Array.from(form.querySelectorAll('input, textarea'));
            inputElements.forEach(input => {
                if (input.required && ((input.tagName === 'INPUT' && input.value === ('' || null || undefined)) || (input.tagName === 'TEXTAREA' && input.innerText === ''))) {
                    input.classList.add('invalid-entry');
                    setNotification("One or more required fields is missing input.");
                }
            });

            if (notification==="One or more required fields is missing input.") {
                setLoading(false);
                return;
            }
        }

    }

    return (
        <></>
    );
}