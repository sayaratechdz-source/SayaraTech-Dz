import "@mui/material/styles";

declare module "@mui/material/styles" {
  interface Palette {
    bg: {
      main: string;
      light?: string;
      dark?: string;
    };
  }
  interface PaletteOptions {
    bg?: {
      main?: string;
      light?: string;
      dark?: string;
    };
  }
}
