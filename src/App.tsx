import React from "react";
import Header1 from "./components/header/Header1";
import Header2 from "./components/header/Header2";
import Header3 from "./components/header/Header3";
import { Box, CssBaseline, ThemeProvider } from "@mui/material";
import { Outlet, useLocation } from "react-router-dom";
import ErrorBoundary from "./components/ErrorBoundary";
import { ColorModeContext, useMode } from "./theme";
import Hero from "./components/hero/Hero";
import Footer from "./components/footer/footer";
import ScrollToTop from "./components/scroll/ScrollToTop";
import Chatbot from "./components/Chatbot/Chatbot";

function App() {
  const [theme, colorMode] = useMode();
  const location = useLocation();



  return (
    <ColorModeContext.Provider value={colorMode}>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <Header1 />
        <Header2 />
        
        <Box
          bgcolor={
            theme?.palette?.bg?.main ?? theme?.palette?.background?.default
          }
          sx={{ pb: 6 }}
        >
         
          <ErrorBoundary>
            <Outlet />
          </ErrorBoundary>
        </Box>
        <Footer />
        <ScrollToTop />
        <Chatbot />
      </ThemeProvider>
    </ColorModeContext.Provider>
  );
}

export default App;
