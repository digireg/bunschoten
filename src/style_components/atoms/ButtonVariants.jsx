import styled from "styled-components";
import { Button } from "./Button";
import { tokens, components } from "../themes/light";

// === NavButton ===
export const NavButtonStyle = styled(Button)`
  justify-content: flex-start;
  width: 100%;
  height: 100%;
  border-radius: ${tokens.radii[2]};
  background-color: ${tokens.colors.white};
  color: ${tokens.colors.black};
  padding: 10px 5px;

  &:hover {
    color: ${tokens.colors.white};
    background-color: ${tokens.colors.Company.Primary};
  }
`;

// === MapButton ===
export const MapButtonStyle = styled(Button)`
  justify-content: center;
  width: max-content;
  height: max-content;
  border-radius: ${tokens.radii[2]};
  padding: ${tokens.space[3]};
  box-shadow: ${tokens.shadows[2]};

  background-color: ${({ $active }) =>
    $active ? tokens.colors.Company.Primary : tokens.colors.white};
  color: ${({ $active }) =>
    $active ? tokens.colors.white : tokens.colors.black};

  &:hover {
    background-color: ${({ $active }) =>
      $active
        ? tokens.colors.Company.PrimaryLight
        : tokens.colors.Company.Primary};
    color: ${({ $active }) =>
      $active ? tokens.colors.black : tokens.colors.white};
  }
`;

export const ZoomButton = styled(Button)`
  padding: ${tokens.space[3]};
  max-width: 50px;
  max-height: 50px;
  font-size: ${tokens.fontSizes[4]};
  line-height: ${tokens.lineHeights.compact};
  border: 1px solid transparent;
  box-shadow: ${tokens.shadows[2]};
  background-color: ${tokens.colors.white};

  /* Conditional border-radius based on position prop */
  border-radius: ${({ $position }) =>
    $position === "top"
      ? "10px 10px 0 0"
      : $position === "bottom"
      ? "0 0 10px 10px"
      : "0"};

  color: ${({ $active }) =>
    $active ? tokens.colors.white : tokens.colors.black};

  &:hover {
    background-color: ${tokens.colors.Company.Primary};
    color: ${tokens.colors.white};
    border-color: ${tokens.colors.Company.Primary};
  }
`;
