import styled from "styled-components";

export const PreviewGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(150px, 1fr));
  gap: 10px; /* consistent spacing */
  align-items: start;
`;
