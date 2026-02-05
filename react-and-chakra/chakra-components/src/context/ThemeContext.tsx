import { createContext, useContext, useReducer, ReactNode } from 'react';

// Types
type ColorMode = 'light' | 'dark';

interface ThemeState {
  colorMode: ColorMode;
  primaryColor: string;
  fontSize: 'sm' | 'md' | 'lg';
}

type ThemeAction =
  | { type: 'TOGGLE_COLOR_MODE' }
  | { type: 'SET_PRIMARY_COLOR'; payload: string }
  | { type: 'SET_FONT_SIZE'; payload: 'sm' | 'md' | 'lg' }
  | { type: 'RESET_THEME' };

interface ThemeContextType {
  state: ThemeState;
  dispatch: React.Dispatch<ThemeAction>;
  toggleColorMode: () => void;
  setPrimaryColor: (color: string) => void;
  setFontSize: (size: 'sm' | 'md' | 'lg') => void;
  resetTheme: () => void;
}

// Initial state
const initialThemeState: ThemeState = {
  colorMode: 'light',
  primaryColor: 'teal',
  fontSize: 'md',
};

// Reducer
function themeReducer(state: ThemeState, action: ThemeAction): ThemeState {
  switch (action.type) {
    case 'TOGGLE_COLOR_MODE':
      return {
        ...state,
        colorMode: state.colorMode === 'light' ? 'dark' : 'light',
      };
    case 'SET_PRIMARY_COLOR':
      return {
        ...state,
        primaryColor: action.payload,
      };
    case 'SET_FONT_SIZE':
      return {
        ...state,
        fontSize: action.payload,
      };
    case 'RESET_THEME':
      return initialThemeState;
    default:
      return state;
  }
}

// Context
const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

// Provider component
export function ThemeProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(themeReducer, initialThemeState);

  // Helper functions that wrap dispatch
  const toggleColorMode = () => dispatch({ type: 'TOGGLE_COLOR_MODE' });
  const setPrimaryColor = (color: string) => 
    dispatch({ type: 'SET_PRIMARY_COLOR', payload: color });
  const setFontSize = (size: 'sm' | 'md' | 'lg') => 
    dispatch({ type: 'SET_FONT_SIZE', payload: size });
  const resetTheme = () => dispatch({ type: 'RESET_THEME' });

  const value: ThemeContextType = {
    state,
    dispatch,
    toggleColorMode,
    setPrimaryColor,
    setFontSize,
    resetTheme,
  };

  return (
    <ThemeContext.Provider value={value}>
      {children}
    </ThemeContext.Provider>
  );
}

// Custom hook for consuming theme context
export function useTheme(): ThemeContextType {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
}

export type { ThemeState, ThemeAction, ColorMode };
