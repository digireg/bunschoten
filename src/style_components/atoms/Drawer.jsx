import styled from "styled-components";
import { tokens, components } from "../themes/light";

export const Drawer = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 80vw;
  height: 100vh;
  background-color: ${tokens.colors.white};
  box-shadow: ${tokens.shadows[3]};
  transform: translateX(${({ $isOpen }) => ($isOpen ? "0" : "-100%")});
  transition: transform 0.3s ease;
  z-index: 1000;
  padding: ${tokens.space[5]};
  display: flex;
  flex-direction: column;
  gap: ${tokens.space[5]};

    @media (min-width: ${tokens.breakpoints.sm}) {
    width: 40vw; !important;
  }

      @media (min-width: ${tokens.breakpoints.md}) {
    width: 25vw; !important;
  }
`;
