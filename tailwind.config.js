import forms from '@tailwindcss/forms';
import containerQueries from '@tailwindcss/container-queries';

/** @type {import('tailwindcss').Config} */
export default {
    content: [
        "./index.html",
        "./src/**/*.{js,ts,jsx,tsx}",
    ],
    darkMode: "class",
    theme: {
        extend: {
            colors: {
                "primary": "#788E6E",
                "accent": "#C0A172",
                "background-light": "#F9F6F2",
                "background-dark": "#1F1D1B",
                "text-light": "#4A4441",
                "text-dark": "#E2DFDC",
                "card-light": "#FFFFFF",
                "card-dark": "#2B2926",
                "border-light": "#EAE5E0",
                "border-dark": "#3A3734"
            },
            fontFamily: {
                "display": ["Manrope", "sans-serif"],
                "serif": ["Playfair Display", "serif"]
            },
            borderRadius: {
                "DEFAULT": "0.5rem",
                "lg": "0.75rem",
                "xl": "1rem",
                "full": "9999px"
            },
        },
    },
    plugins: [
        forms,
        containerQueries,
    ],
}
