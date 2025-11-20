import styled from "styled-components";
import { tokens, components } from "../themes/light";

export const Data = styled.div`
  font-size: ${tokens.fontSizes[3]};
  word-break: break-word;

  a {
    color: ${tokens.colors.Company.Primary};
    text-decoration: underline;
  }
`;
