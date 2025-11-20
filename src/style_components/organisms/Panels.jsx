import styled from "styled-components";
import { Panel } from "../atoms/Panel";
import { tokens } from "../themes/light";

// === Base Top-Left Panel ===
const TopLeftPanel = styled(Panel).attrs({
  $maxHeight: "87vh",
  $width: "90vw",
  $padding: "20px",
})`
  width: 90vw !important;

  @media (min-width: ${tokens.breakpoints.sm}) {
    width: 78.5vw !important;
  }

  @media (min-width: ${tokens.breakpoints.md}) {
    width: 36vw !important;
  }
`;

// === Specific Top-Left Panels ===
export const AchtergrondLaagPanel = styled(TopLeftPanel)``;

export const DataLaagSelectPanel = styled(TopLeftPanel).attrs({
  $maxHeight: "575px",
})`
  ${"" /* overflow: hidden; */}
`;

export const MeasurementPanel = styled(TopLeftPanel).attrs({
  $maxHeight: "575px",
})``;

export const TransparantieLaagPanel = styled(TopLeftPanel).attrs({
  $maxHeight: "575px",
})``;

// === Base Bottom Panel ===
const BottomPanel = styled(Panel).attrs({
  $padding: "20px",
  $transition: "padding 0.3s ease, max-height 0.3s ease, max-width 0.3s ease",
})`
  margin-top: 10px;
`;

// === Specific Bottom Panels ===
export const LegendaPanel = styled(BottomPanel).attrs({
  $maxHeight: "300px",
  $width: "90vw",
})`
  width: 90vw !important;
  z-index: 90; /* lower than active DataPanel */

  @media (min-width: ${tokens.breakpoints.sm}) {
    width: 36vw !important;
  }

  @media (min-width: ${tokens.breakpoints.md}) {
    width: 36vw !important;
  }
`;

export const DataPanel = styled(BottomPanel).attrs({
  $maxHeight: "550px",
  $width: "90vw",
  $gap: "0",
})`
  width: 90vw !important;
  z-index: 100; /* default */

  @media (min-width: ${tokens.breakpoints.sm}) {
    width: 45vw !important;
  }

  @media (min-width: ${tokens.breakpoints.md}) {
    width: 36vw !important;
  }
`;
