import styled from "styled-components";
import { tokens, components } from "../themes/light";

export const Content = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: ${tokens.space[5]};
  overflow-y: auto;
`;
