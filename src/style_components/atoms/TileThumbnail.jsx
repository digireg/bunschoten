import styled from "styled-components";
import { tokens } from "../themes/light";

export const TileThumbnail = styled.div`
  flex-shrink: 0;
  width: 100px;
  height: 75px;
  border-radius: ${tokens.radii[2]};
  background-color: ${tokens.colors.grays[100]};
  background-size: cover;
  background-position: center;
`;
