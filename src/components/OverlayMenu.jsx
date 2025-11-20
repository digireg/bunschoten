import React from "react";
import {
  Overlay,
  Drawer,
  CloseButton,
  OverlayMenuToolsSection,
  OverlayMenuHeader,
  OverlayMenuUtilsSection,
  OverlayMenuSettingsSection,
  OverlayMenuDashboardSection,
  Logo,
  NavButton,
} from "../style_components";
import {
  FiX,
  FiMap,
  FiLayers,
  FiEye,
  FiFilter,
  FiLink2,
  FiPrinter,
  FiHelpCircle,
} from "react-icons/fi";
import { FaRuler } from "react-icons/fa";
import { MdLabel, MdLanguage } from "react-icons/md";

export default function OverlayMenu({
  isOpen,
  onClose,
  onOpenOverlay,
  activePanel,
  setActivePanel,
}) {
  const handleOpenPanel = (panelName) => {
    setActivePanel(activePanel === panelName ? null : panelName);
    onClose();
  };

  return (
    <>
      <Overlay $isOpen={isOpen} onClick={onClose} />
      <Drawer $isOpen={isOpen}>
        <OverlayMenuHeader>
          <Logo />
          <CloseButton onClick={onClose} aria-label="Close menu">
            <FiX />
          </CloseButton>
        </OverlayMenuHeader>
        <OverlayMenuToolsSection>
          <NavButton
            icon={<FiMap />}
            onClick={() => handleOpenPanel("achtergrond")}
          >
            Background layers
          </NavButton>

          <NavButton
            icon={<FiLayers />}
            onClick={() => handleOpenPanel("lagen")}
          >
            Data layers
          </NavButton>

          <NavButton
            icon={<FiEye />}
            onClick={() => handleOpenPanel("transparantie")}
          >
            Layer Opacity
          </NavButton>

          <NavButton
            icon={<FaRuler />}
            onClick={() => handleOpenPanel("metingen")}
          >
            Measuring tools
          </NavButton>

          {/* <NavButton
            icon={<FiFilter />}
            onClick={() => handleOpenPanel("filter")}
          >
            Filters
          </NavButton>

          <NavButton
            icon={<MdLabel />}
            onClick={() => handleOpenPanel("labels")}
          >
            Label settings
          </NavButton> */}
        </OverlayMenuToolsSection>
        {/* <OverlayMenuUtilsSection>
          <NavButton icon={<FiLink2 />}>Share</NavButton>
          <NavButton icon={<FiPrinter />}>Print settings</NavButton>
        </OverlayMenuUtilsSection>
        <OverlayMenuSettingsSection>
          <NavButton icon={<FiHelpCircle />}>Manuals</NavButton>
          <NavButton icon={<MdLanguage />}>Language</NavButton>
        </OverlayMenuSettingsSection>
        <OverlayMenuDashboardSection></OverlayMenuDashboardSection> */}
      </Drawer>
    </>
  );
}
