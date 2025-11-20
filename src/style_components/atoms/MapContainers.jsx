import styled from "styled-components";
import { tokens, components } from "../themes/light";

export const MapContainer = styled.main`
  width: 100%;
  height: 100vh;
  ${"" /* display: grid; */}
  /* Columns: left controls, map, right controls */
  ${"" /* grid-template-columns: auto 1fr auto; */}

  /* Rows: top controls, map, bottom controls */
  ${"" /* grid-template-rows: auto 1fr auto; */}

  /* Define areas */
  ${
    "" /* grid-template-areas:
    "SearchBar SearchBar SearchBar"
    "HamburgerMenu map ZoomButtons"
    "LegendButton map DataButton"; */
  }

  ${"" /* gap: 0.5rem; */}
`;
export const MapStyleContainer = styled.main`
  width: 100%;
  height: 100%;
  background-color: ${tokens.colors.grays[100]};
`;
