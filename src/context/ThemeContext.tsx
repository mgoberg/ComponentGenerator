import React, { createContext, useContext } from "react";

interface ThemeContextType {
  theme: "dark";
}

const ThemeContext = createContext<ThemeContextType>({
  theme: "dark",
});

export const useTheme = () => useContext(ThemeContext);

export const ThemeProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  // Always use dark theme
  const theme = "dark";

  // Add dark mode class to document on mount
  React.useEffect(() => {
    document.documentElement.classList.add("dark");
  }, []);

  return (
    <ThemeContext.Provider value={{ theme }}>{children}</ThemeContext.Provider>
  );
};
