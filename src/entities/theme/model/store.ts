import { create } from 'zustand';

type Theme = 'light' | 'dark';

interface ThemeState {
    theme: Theme;
    toggleTheme: () => void;
    setTheme: (theme: Theme) => void;
}

const getInitialTheme = (): Theme => {
    if (typeof window === 'undefined') return 'light';
    const stored = localStorage.getItem('theme');
    if (stored === 'light' || stored === 'dark') return stored;
    return 'light';
};

export const useThemeStore = create<ThemeState>((set) => ({
    theme: getInitialTheme(),
    
    toggleTheme: () => {
        set((state) => {
            const newTheme = state.theme === 'light' ? 'dark' : 'light';
            localStorage.setItem('theme', newTheme);
            document.documentElement.classList.toggle('dark', newTheme === 'dark');
            return { theme: newTheme };
        });
    },
    
    setTheme: (theme: Theme) => {
        localStorage.setItem('theme', theme);
        document.documentElement.classList.toggle('dark', theme === 'dark');
        set({ theme });
    },
}));

// Инициализация темы при загрузке
if (typeof window !== 'undefined') {
    const initialTheme = getInitialTheme();
    document.documentElement.classList.toggle('dark', initialTheme === 'dark');
}

export type { Theme };
