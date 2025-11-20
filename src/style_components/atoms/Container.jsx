import styled from "styled-components";
import { tokens, components } from "../themes/light";

export const Container = styled.div`
  position: absolute;
  display: flex;
  box-sizing: border-box;
  border-radius: ${({ $radius }) => $radius || "0px"};
  align-items: ${({ $align }) => $align || "center"};
  justify-content: ${({ $justify }) => $justify || "center"};
  z-index: ${({ $zIndex }) => $zIndex || 999};

  /* Optional focus/hover/active states */
  ${({ $focusable }) =>
    $focusable &&
    `
    &:focus,
    &:focus-visible,
    &:hover,
    &:active {
      border-color: $tokens.colors.DigiregColors[1];
      outline: none;
    }
  `}
`;
