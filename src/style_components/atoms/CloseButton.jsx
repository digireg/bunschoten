import styled from "styled-components";
import { tokens, components } from "../themes/light";

export const CloseButton = styled.button`
  ${"" /* align-self: flex-end; */}
  background: none;
  border: none;
  font-size: ${tokens.fontSizes[6]};
  cursor: pointer;
  color: ${tokens.colors.black};

  &:hover {
    color: ${tokens.colors.Company.Primary};
  }
`;
