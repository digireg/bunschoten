import React from "react";
import {
  SideMenu,
  SideBarIconContainer,
  SideBarMenuIconContainer,
  NavButton,
  Logo,
} from "../style_components";
import { FiSidebar, FiMap, FiLayers, FiEye, FiFilter } from "react-icons/fi";
import { FaRuler } from "react-icons/fa";
import { MdLabel } from "react-icons/md";

export default function SideBarMenu({
  onOpenOverlay,
  activePanel,
  setActivePanel,
}) {
  return (
    <SideMenu>
      <div>
        <SideBarIconContainer>
          <NavButton
            icon={<FiSidebar />}
            onClick={onOpenOverlay}
            aria-label="Open menu"
          />
        </SideBarIconContainer>
        <SideBarMenuIconContainer>
          <NavButton
            icon={<FiMap />}
            hideText
            onClick={() =>
              setActivePanel(
                activePanel === "achtergrond" ? null : "achtergrond"
              )
            }
          >
            Kaarten
          </NavButton>
          <NavButton
            icon={<FiLayers />}
            hideText
            onClick={() =>
              setActivePanel(activePanel === "lagen" ? null : "lagen")
            }
          >
            Lagen
          </NavButton>
          <NavButton
            icon={<FiEye />}
            hideText
            onClick={() =>
              setActivePanel(
                activePanel === "transparantie" ? null : "transparantie"
              )
            }
          ></NavButton>
          <NavButton
            icon={<FaRuler />}
            onClick={() =>
              setActivePanel(activePanel === "metingen" ? null : "metingen")
            }
            hideText
          >
            Metingen
          </NavButton>
          {/* <NavButton icon={<FiFilter />} hideText>
          Algemene Filter
        </NavButton>
        <NavButton
          icon={<MdLabel />}
          hideText
          onClick={() =>
            setActivePanel(activePanel === "labels" ? null : "labels")
          }
        >
          Labelinstellingen
        </NavButton> */}
        </SideBarMenuIconContainer>
      </div>

      <Logo />
    </SideMenu>
  );
}
