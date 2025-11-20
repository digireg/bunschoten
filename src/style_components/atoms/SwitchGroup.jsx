import styled from "styled-components";
import { tokens, components } from "../themes/light";

export const SwitchGroup = styled.div`
  display: flex;
  align-items: center;
  gap: ${tokens.space[1]};

  span {
    font-size: ${tokens.fontSizes[2]};
    font-weight: ${tokens.fontWeights.semibold};
  }
`;
