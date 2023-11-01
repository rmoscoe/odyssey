/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/*.tsx",
    "./src/**/*.tsx",
  ],
  theme: {
    extend: {
      colors: {
        'fantasy-primary': '#930C10',
        'fantasy-heading': '#930C10',
        'fantasy-text': '#930C10',
        'fantasy-accent': '#F7CE65',
        'fantasy-secondary': '#FFFEBD',
        'fantasy-neutral': '#290000',
        'fantasy-label': '#290000',
        'fantasy-contrast': '#F7CE65',
        'fantasy-field': '#FFFEE8',
        'fantasy-button-alt-border': '#FFFEBD',
        'fantasy-toggle-switch': '#930C10',
        'fantasy-toggle-void': '#F7CE65',
        'fantasy-toggle-border': '#FFFEBD',
        'fantasy-footer-text': '#FFFEBD',
        'fantasy-form-heading': '#930C10',
        'fantasy-game-name': '#930C10',
        'fantasy-progress-void': '#290000',
        'fantasy-progress-border': '#930C10',
        'fantasy-progress-fill': '#FFFEBD',
        'fantasy-scene': '#930C10',
        'fantasy-scene-text': '#F7CE65',
        'fantasy-stage-background': '#F7CE65',
        'fantasy-encounter': '#930c10',
        'sci-fi-primary': '#1352FF',
        'sci-fi-accent': '#FF54A4',
        'sci-fi-heading': '#D9D9D9',
        'sci-fi-secondary': '#31333B',
        'sci-fi-neutral': '#D9D9D9',
        'sci-fi-text': '#D9D9D9',
        'sci-fi-label': '#D9D9D9',
        'sci-fi-contrast': '#B952E1',
        'sci-fi-field': '#455055',
        'sci-fi-button-alt-border': '#ff54a4',
        'sci-fi-toggle-switch': '#FF54A4',
        'sci-fi-toggle-void': '#31333B',
        'sci-fi-toggle-border': 'D9D9D9',
        'sci-fi-footer-text': '#D9D9D9',
        'sci-fi-form-heading': '#FF54A4',
        'sci-fi-game-name': '#D9D9D9',
        'sci-fi-progress-void': '#FF54A4',
        'sci-fi-progress-border': '#D9D9D9',
        'sci-fi-progress-fill': '#1352FF',
        'sci-fi-scene': '#455055',
        'sci-fi-scene-text': '#D9D9D9',
        'sci-fi-stage-background': '#455055',
        'sci-fi-encounter': '#b952e1'
      },
      fontFamily: {
        'fantasy-title': ['Yatra One', 'Macondo Swash Caps', 'cursive', 'Arial', 'sans-serif'],
        'fantasy-heading': ['Uncial Antiqua', 'Milonga', 'Macondo Swash Caps', 'cursive', 'Arial', 'TrebuchetMS', 'sans-serif'],
        'fantasy-text': ['Milonga', 'cursive', 'Arial', 'TrebuchetMS', 'sans-serif'],
        'fantasy-label': ['Verdana', 'Arial', 'sans-serif'],
        'sci-fi-title': ['Bruno Ace SC', 'Michroma', 'Oxanium', 'cursive', 'Arial', 'sans-serif'],
        'sci-fi-heading': ['Bruno Ace SC', 'Play', 'cursive', 'Arial', 'sans-serif'],
        'sci-fi-text': ['Sunflower', 'Oxanium', 'Tahoma', 'sans-serif'],
        'sci-fi-label': ['Verdana', 'Arial', 'sans-serif'],
      }
    },
  },
  plugins: [],
}

