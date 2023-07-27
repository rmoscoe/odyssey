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
    'Ars Magica': ["", "Mythic Europe", "Realms of Power", "The New World", "The Mythic North", "The Mythic East"],
    'Blade of the Iron Throne': null,
    'Burning Wheel': null,
    'Call of Cthulhu': ["", "Miskatonic University", "Cthulu Mythos", "Delta Green", "Trail of Cthulu", "Dreamlands"],
    'Changeling: The Lost': ["", "The Hedge", "The Seelie Court", "The Unseelie Court", "The Freehold", "The Wyld"],
    'Chronicles of Darkness: Changeling: The Lost': null,
    'Chronicles of Darkness: Dark Eras': null,
    'Chronicles of Darkness: Hunter: The Vigil': null,
    'Chronicles of Darkness: Mage: The Awakening': null,
    'Chronicles of Darkness: Mummy: The Resurrection': null,
    'Chronicles of Darkness: Promethean: The Created': null,
    'Chronicles of Darkness: Second Inquisition': null,
    'Chronicles of Darkness: Trinity Continuum': null,
    'Chronicles of Darkness: Werewolf: The Forsaken': null,
    'Chronicles of Darkness: Wraith: The Oblivion': null,
    'City of Mist': ["City of Mist", "Shadows & Showdowns", "Nights of Payne Town", "A Cold Fire Within", "The Bronx"],
    'Cyberpunk 2020': ["", "Night City", "Deep Space", "Pacific Rim", "Eurosource Plus"],
    'Cyberpunk Red': null,
    'Dungeons & Dragons': ["", "Forgotten Realms", "Ravenloft", "Eberron", "Greyhawk", "Dragonlance", "Dark Sun", "Planescape", "Spelljammer", "Mystara", "Birthright"],
    'Fate': ["", "Fate Worlds: Worlds Take Flight", "Fate Worlds: Worlds Rise Up", "Fate Worlds: Worlds in Shadow", "Fate Worlds in Shadow: War of Ashes", "Fate Worlds in Shadow: Tower of the Serpents", "Fate Worlds in Shadow: Tachyon Squadron", "Fate Worlds in Shadow: Ehdrigohr", "Venture City", "Atomic Robo"],
    'GURPS': ["", "GURPS Fantasy", "GURPS Space", "GURPS Cyberpunk", "GURPS Steampunk", "GURPS Historical Settings", "GURPS Horror"],
    'homebrew (unpublished)': null,
    'Hunter: The Vigil': null,
    'Ironsworn': null,
    'Mage: The Ascension': null,
    'Marvel Heroic Roleplaying': ["", "Civil War", "Annihilation", "X-Men", "Breakout", "Civil War: X-Men"],
    'Mummy: The Resurrection': null,
    'Mutant Year Zero': null,
    'Mutants & Masterminds': ["", "Freedom City", "Emerald City"],
    'Numenera': ["", "Ninth World", "Into the Night", "Into the Deep", "Into the Outside", "The Devil's Spine"],
    'Other': null,
    'Paranoia XP': null,
    'Pathfinder': ["", "The Inner Sea", "Lost Cities of Golarion"],
    'Promethean: The Created': null,
    'Rifts': ["", "Vampire Kingdoms", "Atlantis", "England", "Africa", "Triax & the NGR", "South America 1", "Underseas", "Japan", "South America 2", "Juicer Uprising", "Coalition War Campaign", "Psyscape", "Lone Star", "New West", "Spirit West", "Federation of Magic", "Warlords of Russia", "Mystic Russia", "Australia", "Canada", "Splynn Dimensional Market", "Free Quebec", "Xiticix Invasion", "China 1", "China 2", "Dinosaur Swamp", "Adventures in Dinosaur Swamp", "Arzno", "Madhaven", "D-Bees of North America", "Triax 2", "Lemuria", "Northern Gun 1", "Northern Gun 2", "Megaverse in Flames"],
    'Savage Worlds': ["", "Deadlands", "Rippers", "Necessary Evil", "The Last Parsec", "The Savage World of Solomon Kane", "Interface Zero", "Beasts & Barbarians", "Hellfrost", "East Texas University", "50 Fathoms"],
    'Shadowrun': ["", "Seattle", "London Falling", "Denver", "New York", "Hong Kong", "California Free State", "Seattle 2072"],
    'Song of Ice and Fire Roleplaying': null,
    'Star Trek Adventures': ["", "Alpha Quadrant", "Beta Quadrant", "Deep Space Nine", "Voyager", "Klingon Empire"],
    'Star Wars: The Roleplaying Game': null,
    'Stars Without Number': null,
    'Tales from the Loop': ["", "Tales from the Flood", "Things from the Flood"],
    'The Laundry Files': null,
    'The One Ring': ["", "Rivendell", "Tales from Wilderland", "Ruins of the North"],
    'The Veil': null,
    'The World of Darkness': null,
    'Traveller':["", "Reft Sector", "The Trojan Reach"],
    'Vampire: The Masquerade': null,
    'Werewolf: The Apocalypse': null,
    'Wraith: The Oblivion:': null
}

export default function NewAdventure({ handlePageChange }: PageProps) {
    const { theme } = useTheme();
    const navigate = useNavigate();
    const [gameTitle, setGameTitle] = useState('');
    const [campaignSetting, setCampaignSetting] = useState<string | null>(null);
    const [homebrewDescription, setHomebrewDescription] = useState<string | null>(null);

    return (
        <></>
    );
}