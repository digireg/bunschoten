import { createGlobalStyle } from "styled-components";
import { tokens } from "./themes/light";

const GlobalStyle = createGlobalStyle`
  *, *::before, *::after {
    box-sizing: border-box;
  }

  html, body, #root {
    margin: 0;
    padding: 0;
    width: 100%;
    height: 100%;
    min-height: 100%;
    overflow: hidden;
    font-size: ${tokens.fontSizes[3]};
    font-family: Inter, sans-serif;
    background-color: ${tokens.colors.white};
  }

  /* Fix mobile viewport height issues */
  :root {
    --vh: 100vh;
  }

  .map {
    width: 100%;
    height: 100%;
  }

  h1,h2,h3,h4,h5,h6 {
    margin: 0;
    padding: 0;
    font-size: inherit;
    font-weight: inherit;
  }

  h1 {
    font-weight: 600;
    font-size: 1.25rem;
  }

  p {
    font-size: ${tokens.fontSizes[3]};
  }

  .ol-scale-bar {
    position: absolute !important;
    left: 50% !important;
    bottom: ${tokens.space[2]} !important;
    transform: translate(-50%, -50%);
    color: #000;
    font-size: ${tokens.fontSizes[3]};
    ${"" /* padding: 2px 6px; */}
    border-radius: 4px;
    z-index: 1000;
    pointer-events: none;
  }
`;

export default GlobalStyle;
