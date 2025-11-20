import styled from "styled-components";
import { tokens, components } from "../themes/light";

export const PanelHeader = styled.header`
  display: flex;
  flex-direction: row;
  gap: ${tokens.space[2]};
  align-items: center;
`;
