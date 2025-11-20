import styled from "styled-components";
import { tokens } from "../themes/light";

export const Panel = styled.div`
  max-height: ${({ $isOpen, $maxHeight }) =>
    $isOpen ? $maxHeight || "500px" : "0"};
  height: fit-content;
  overflow-y: ${({ $isOpen }) => ($isOpen ? "auto" : "hidden")};
  background-color: white;
  border-radius: ${({ $radius }) => $radius || `${tokens.radii[4]}`};
  width: ${({ $width }) => $width || "fit-content"};
  ${"" /* max-width: ${({ $maxWidth }) => $maxWidth || "fit-content"}; */}
  min-width: ${({ $minWidth }) => $minWidth || "0"};
  display: flex;
  flex-direction: column;
  gap: ${({ $gap }) => $gap || `${tokens.space[5]}`};
  padding: ${({ $isOpen, $padding }) =>
    $isOpen ? $padding || `${tokens.space[5]}` : `${tokens.space[0]}`};
  box-shadow: ${({ $isOpen, $shadow }) =>
    $isOpen ? $shadow || `${tokens.shadows[2]}` : "0"};
  ${
    "" /* transition: ${({ $transition }) =>
    $transition ||
    "padding 0.2s ease, max-height 0.2s ease, max-width 0.2s ease"}; */
  }

  /* Optional scrollable content container (like DataLaagSelectPanel) */
  #dataContent {
    overflow-y: auto;

    &::-webkit-scrollbar {
      width: 8px;
    }
    &::-webkit-scrollbar-thumb {
      background: rgba(0, 0, 0, 0.3);
      border-radius: 4px;
    }
    scrollbar-width: thin;
    scrollbar-color: rgba(0, 0, 0, 0.3) transparent;
  }
`;
