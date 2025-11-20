import styled from "styled-components";
import { tokens, components } from "../themes/light";

export const TitleGroup = styled.div`
  display: flex;
  align-items: center;
  gap: ${tokens.space[1]};

  h1 {
    margin: 0;
  }
`;
