// molecules/OverlayMenuHeader.jsx
import styled from "styled-components";
import { tokens, components } from "../themes/light";

const Header = styled.div`
  display: flex;
  flex-direction: row;
  gap: ${tokens.space[0]};
  align-items: center;
  justify-content: space-between;
  border-bottom: 1px solid ${tokens.colors.Company.Secondary};
  padding-bottom: ${tokens.space[5]};
`;

export default function OverlayMenuHeader({ children }) {
  return <Header>{children}</Header>;
}
