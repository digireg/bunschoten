import styled from "styled-components";
import { tokens, components } from "../themes/light";
export const PanelTitle = styled.h2`
  font-size: ${tokens.fontSizes[6]};
  font-weight: ${tokens.fontWeights.bold};
  margin-bottom: ${tokens.space[5]};

  a {
    color: inherit; // keep same color as parent
    text-decoration: none; // remove underline
    transition: all 0.15s ease;

    &:hover {
      text-decoration: underline; // underline on hover
      opacity: 0.85; // subtle visual cue
    }

    &:visited,
    &:active {
      color: inherit; // no color change
    }
  }
`;
