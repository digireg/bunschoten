import styled from "styled-components";
import { tokens, components } from "../themes/light";

export const SideBarIconContainer = styled.div`
  border-bottom: 1px solid ${tokens.colors.Company.Secondary};
  padding: 0 0 20px 0;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
`;
