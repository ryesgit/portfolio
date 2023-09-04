import { ReactNode, createContext, useState } from 'react';

interface DarkModeContext {
    dark?: boolean;
    setDark?: (dark: boolean) => void;
}

const DarkModeContext = createContext<DarkModeContext>({});

export const DarkModeProvider = ({ children }: { children: ReactNode }) => {

    const [dark, setDark] = useState(true);
    const context = { dark, setDark };

  return (
    <DarkModeContext.Provider value={ context }>
        { children }
    </DarkModeContext.Provider>
  )
}

export default DarkModeContext;