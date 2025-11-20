import styled from "styled-components";
import { tokens, components } from "../themes/light";

export const TextInput = styled.input`
  width: 100%;
  padding: ${tokens.space[2]};
  font-size: ${tokens.fontSizes[3]};
  border: 1px solid ${tokens.colors.grays[600]};
  border-radius: ${tokens.radii[2]};
`;
