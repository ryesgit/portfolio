import { createContext, ReactNode } from 'react';

interface BlogDarkModeContextType {
  dark: boolean;
  toggleDarkMode: () => void;
}

const BlogDarkModeContext = createContext<BlogDarkModeContextType>({
  dark: true,
  toggleDarkMode: () => {},
});

interface BlogDarkModeProviderProps {
  children: ReactNode;
}

export const BlogDarkModeProvider = ({ children }: BlogDarkModeProviderProps) => {
  // Always return dark mode for blog
  const value = {
    dark: true,
    toggleDarkMode: () => {}, // No-op function since blog is always dark
  };

  return (
    <BlogDarkModeContext.Provider value={value}>
      {children}
    </BlogDarkModeContext.Provider>
  );
};

export default BlogDarkModeContext;