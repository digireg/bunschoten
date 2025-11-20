import styled from "styled-components";
import { FiMenu } from "react-icons/fi";
import { tokens } from "../themes/light";
import { NavButton } from "./NavButton";
import { HamburgerContainer } from "../organisms/PanelContainers";

const HamburgerButton = styled.button`
  height: fit-content;
  width: auto;

  @media (min-width: ${tokens.breakpoints.sm}) {
    display: none;
  }
`;

export default function HamburgerMenu({ onOpenOverlay }) {
  return (
    <HamburgerContainer>
      <HamburgerButton
        as={NavButton}
        icon={<FiMenu />}
        onClick={onOpenOverlay}
        aria-label="Open menu"
      />
    </HamburgerContainer>
  );
}
