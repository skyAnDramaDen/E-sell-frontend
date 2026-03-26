import React, {createContext, useState, useContext, ReactNode, useMemo} from 'react';
import { lightTheme, darkTheme } from '../src/theme/theme';
import { useColorScheme } from "react-native";

import { ThemeContextType } from "../types/interfaces";

export const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export const ThemeProvider = ({ children }: { children: ReactNode }) => {
    const deviceTheme = useColorScheme();
    const [isDark, setIsDark] = useState(false);

    const toggleTheme = () => setIsDark(prev => !prev);

    const value = useMemo(() => ({
        theme: isDark ? darkTheme : lightTheme,
        isDark,
        toggleTheme,
    }), [isDark]);

    return (
        <ThemeContext.Provider
            value={value}
        >
            {children}
        </ThemeContext.Provider>
    );
};
