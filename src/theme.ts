import { createTheme } from "@mui/material/styles";
import { createContext, useMemo, useState } from "react";

export interface ColorModeContextType {
  toggleColorMode: () => void;
  mode: "light" | "dark";
}

export const ColorModeContext = createContext<ColorModeContextType>({
  toggleColorMode: () => {},
  mode: "light",
});

export const useMode = () => {
  const [mode, setMode] = useState<"light" | "dark">(
    (localStorage.getItem("mode") as "light" | "dark") || "light"
  );

  const colorMode = useMemo(
    () => ({
      toggleColorMode: () => {
        const newMode = mode === "light" ? "dark" : "light";
        setMode(newMode);
        localStorage.setItem("mode", newMode);
      },
      mode,
    }),
    [mode]
  );

  const theme = useMemo(
    () =>
      createTheme({
        palette: {
          mode,
          ...(mode === "light"
            ? {
                bg: {
                  main: "#f5f5f5",
                  light: "#ffffff",
                  dark: "#e0e0e0",
                },
                background: {
                  default: "#ffffff",
                  paper: "#ffffff",
                },
                text: {
                  primary: "#212121",
                  secondary: "#757575",
                },
              }
            : {
                bg: {
                  main: "#121212",
                  light: "#1e1e1e",
                  dark: "#000000",
                },
                background: {
                  default: "#121212",
                  paper: "#121212",
                },
                text: {
                  primary: "#ffffff",
                  secondary: "#bdbdbd",
                },
              }),
        },
        typography: {
          fontFamily: '"Open Sans", sans-serif',
        },
      }),
    [mode]
  );

  return [theme, colorMode] as const;
};
