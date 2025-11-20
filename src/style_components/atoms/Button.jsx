import styled from "styled-components";
import { tokens, components } from "../themes/light";

export const Button = styled.button`
  display: flex;
  align-items: center;
  justify-content: center;
  gap: ${tokens.space[2]}; /* 8px */
  font-size: ${tokens.fontSizes[components.Button.fontSize]};
  border-radius: ${tokens.radii[components.Button.borderRadius]};
  padding: ${tokens.space[components.Button.paddingX]};
  cursor: pointer;
  border: none;
  transition: background-color ${tokens.durations[5]},
    color ${tokens.durations[5]}, border-color ${tokens.durations[5]};

  span {
    display: flex;
    width: max-content;
    height: max-content;
  }

  svg {
    width: 20px;
    height: 20px;
  }

  &.icon-right {
    flex-direction: row-reverse;
  }

  &:disabled {
    cursor: not-allowed;
    opacity: 0.6;
  }
`;

export const IconWrapper = styled.span`
  display: flex;
  width: max-content;
  height: max-content;
`;
