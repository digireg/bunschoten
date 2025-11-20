// import logoSrc from "../../assets/digireg-seeklogo.png"; // adjust path
import logoSrc from "../../assets/gemeente-bunschoten-logo.png";
import styled from "styled-components";

const StyledLogo = styled.img`
  width: 40px; /* or any size that fits nicely */
  height: auto;
  object-fit: contain;
  display: block;
`;
export function Logo(props) {
  return <StyledLogo src={logoSrc} alt="Gemeente Bunschoten logo" {...props} />;
}
