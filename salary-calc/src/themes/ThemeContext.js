import { useState, createContext } from "react";
import { lightTheme } from "src/themes/themes";

// Create a context for themes
const ThemeContext = createContext();

// Create a provider for ThemeContext
const ThemeProvider = ({ children }) => {
    // Store the selected theme
    const [theme, setTheme] = useState(lightTheme);

    // Create and return the provider
    return (
        <ThemeContext.Provider value={{ theme, setTheme }}>
            {children}
        </ThemeContext.Provider>
    );
}

// Export everything
export { ThemeContext, ThemeProvider };