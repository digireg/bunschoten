// molecules/OverlayMenuSection.jsx
import styled from "styled-components";
import { tokens, components } from "../themes/light";

const Section = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${tokens.space[0]};
  border-bottom: ${({ $hasBorder }) =>
    $hasBorder ? `1px solid ${tokens.colors.Company.Secondary}` : "none"};
  padding-bottom: ${({ $hasBorder }) =>
    $hasBorder ? `${tokens.space[4]}` : "0"};
`;

/**
 * Props:
 *  - hasBorder (boolean) default true
 * Usage:
 *  <OverlayMenuSection>...</OverlayMenuSection>
 *  <OverlayMenuSection hasBorder={false}>...</OverlayMenuSection>
 */
export default function OverlayMenuSection({ children, hasBorder = true }) {
  return <Section $hasBorder={hasBorder}>{children}</Section>;
}
