import styled from "styled-components";
import { tokens, components } from "../themes/light";

export const SideMenu = styled.aside`
  background-color: ${tokens.colors.white};
  position: absolute;
  top: 0;
  left: 0;
  height: 100%;
  width: ${tokens.space[18]};
  padding: ${tokens.space[8]} ${tokens.space[3]};
  align-items: center;
  z-index: 10;
  transition: width 0.3s ease;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  box-shadow: ${tokens.shadows[1]};

  @media (max-width: ${tokens.breakpoints.xs}) {
    display: none;
  }
`;

export const hamburgerMenu = styled.button`
   {
    position: absolute;
    top: 0;
    left: 0;
  }
`;
