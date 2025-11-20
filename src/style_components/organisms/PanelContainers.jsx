import styled from "styled-components";
import { Container } from "../atoms/Container";
import { tokens } from "../themes/light";

// ===========================
// Base containers for corners
// ===========================

// --- Top-left ---
export const TopLeftBase = styled(Container).attrs({
  $focusable: true,
  $align: "flex-end",
  $justify: "center",
  $radius: tokens.radii[4],
  $zIndex: 999,
  $shadow: tokens.shadows[2], // if your Container supports shadows
})`
  top: ${tokens.space[20]};
  left: ${tokens.space[5]};
  box-shadow: 0px 4px 4px rgba(0, 0, 0, 0.25);

  @media (min-width: ${tokens.breakpoints.sm}) {
    top: ${tokens.space[20]};
    left: ${tokens.space[23]};
  }
`;

// --- Top-right ---
const TopRightBase = styled(Container).attrs({
  $focusable: true,
  $zIndex: 995,
})`
  top: ${tokens.space[20]};
  right: ${tokens.space[5]};
  flex-direction: column;
  gap: 0;
  box-shadow: 0px 4px 4px rgba(0, 0, 0, 0.25);

  @media (min-width: ${tokens.breakpoints.md}) {
    top: ${tokens.space[5]};
    right: ${tokens.space[5]};
  }
`;

// --- Bottom-left ---
const BottomLeftBase = styled(Container).attrs({
  $zIndex: 500,
})`
  bottom: ${tokens.space[5]};
  left: ${tokens.space[5]};
  flex-direction: column;
  box-shadow: 0px 4px 4px rgba(0, 0, 0, 0.25);

  @media (min-width: ${tokens.breakpoints.sm}) {
    left: ${tokens.space[23]};
  }

  &.active {
    z-index: 995;
  }
`;

// --- Bottom-right ---
const BottomRightBase = styled(Container).attrs({
  $zIndex: 500,
})`
  bottom: ${tokens.space[5]};
  right: ${tokens.space[5]};
  flex-direction: column;
  box-shadow: 0px 4px 4px rgba(0, 0, 0, 0.25);

  &.active {
    z-index: 995;
  }
`;

// ===========================
// Top-left panels
// ===========================
export const AchtergrondLaagContainer = styled(TopLeftBase).attrs({
  $align: "flex-end",
  $justify: "center",
})``;

export const DataLaagSelectContainer = styled(TopLeftBase).attrs({
  $align: "flex-start", // <--- left-align contents
  $justify: "flex-start", // <--- start from top
})``;

export const MeasurementContainer = styled(TopLeftBase).attrs({
  $align: "flex-end",
  $justify: "center",
})``;

export const TransparantieLaagContainer = styled(TopLeftBase).attrs({
  $align: "flex-end",
  $justify: "center",
})``;

export const HamburgerContainer = styled(TopLeftBase).attrs({
  $align: "flex-end",
  $justify: "center",
})`
  top: ${tokens.space[20]};
  left: ${tokens.space[5]};
  z-index: 999 @media (min-width: ${tokens.breakpoints.sm}) {
    display: none;
`;

// ===========================
// Top-right panel
// ===========================
export const ZoomControlContainer = styled(TopRightBase).attrs({
  $align: "center",
  $justify: "center",
  $radius: "10px",
})``;

// ===========================
// Bottom-left panel
// ===========================
export const LegendButtonContainer = styled(BottomLeftBase).attrs({
  $align: "flex-start",
  $justify: "flex-start",
  $radius: "0px",
})``;

// ===========================
// Bottom-right panel
// ===========================
export const LaagDataContainer = styled(BottomRightBase).attrs({
  $align: "flex-end",
  $justify: "flex-end",
  $radius: "0px",
})``;
