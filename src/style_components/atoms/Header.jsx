import styled from "styled-components";
import { tokens, components } from "../themes/light";
export const Header = styled.header`
  display: flex;
  flex-direction: column;
  gap: 12px;
  position: sticky;
  top: 0;
  background-color: ${tokens.colors.white};
  ${"" /* padding: 20px 0; */}
  z-index: 1; /* stay above scrolling content */
`;
