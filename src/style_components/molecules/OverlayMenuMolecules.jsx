// style_components/molecules/OverlayMenuMolecules.jsx
import OverlayMenuSection from "./OverlayMenuSection";

export const OverlayMenuToolsSection = ({ children }) => (
  <OverlayMenuSection hasBorder>{children}</OverlayMenuSection>
);

export const OverlayMenuUtilsSection = ({ children }) => (
  <OverlayMenuSection hasBorder>{children}</OverlayMenuSection>
);

export const OverlayMenuSettingsSection = ({ children }) => (
  <OverlayMenuSection hasBorder>{children}</OverlayMenuSection>
);

export const OverlayMenuDashboardSection = ({ children }) => (
  <OverlayMenuSection hasBorder={false}>{children}</OverlayMenuSection>
);
