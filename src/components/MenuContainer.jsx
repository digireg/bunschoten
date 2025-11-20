import React, { useState } from "react";
import SideBarMenu from "./SideBarMenu";
import OverlayMenu from "./OverlayMenu";
import HamburgerMenu from "../style_components/molecules/HamburgerMenu";

export default function MenuContainer({ activePanel, setActivePanel }) {
  const [isOverlayOpen, setIsOverlayOpen] = useState(false);

  return (
    <>
      <SideBarMenu
        onOpenOverlay={() => setIsOverlayOpen(true)}
        activePanel={activePanel}
        setActivePanel={setActivePanel}
      />
      <OverlayMenu
        isOpen={isOverlayOpen}
        onClose={() => setIsOverlayOpen(false)}
        activePanel={activePanel}
        setActivePanel={setActivePanel}
      />
      <HamburgerMenu
        onOpenOverlay={() => setIsOverlayOpen(true)}
        activePanel={activePanel}
        setActivePanel={setActivePanel}
      />
    </>
  );
}
