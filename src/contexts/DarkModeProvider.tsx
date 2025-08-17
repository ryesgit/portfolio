import { ReactNode, createContext, useState, useEffect } from 'react';

interface DarkModeContext {
    dark?: boolean;
    setDark?: (dark: boolean) => void;
}

const DarkModeContext = createContext<DarkModeContext>({});

const DARK_MODE_KEY = 'portfolio-dark-mode';

export const DarkModeProvider = ({ children }: { children: ReactNode }) => {

    const [dark, setDark] = useState(() => {
        const savedMode = localStorage.getItem(DARK_MODE_KEY);
        if (savedMode !== null) {
            return JSON.parse(savedMode);
        }
        return window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
    });

    useEffect(() => {
        localStorage.setItem(DARK_MODE_KEY, JSON.stringify(dark));
    }, [dark]);

    const context = { dark, setDark };

  return (
    <DarkModeContext.Provider value={ context }>
        { children }
    </DarkModeContext.Provider>
  )
}

export default DarkModeContext;