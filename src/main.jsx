import { createRoot } from "react-dom/client";
import App from "./App.jsx";
import { GlobalStyle } from "./style_components";
import { ThemeProvider } from "styled-components";
import theme from "./style_components/themes/light.js";

createRoot(document.getElementById("root")).render(
  <>
    <GlobalStyle />
    <ThemeProvider theme={theme}>
      <App />
    </ThemeProvider>
  </>
);
