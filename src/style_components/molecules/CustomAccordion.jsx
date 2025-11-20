import styled from "styled-components";
import Accordion from "../molecules/Accordion";

export const CustomAccordion = styled(Accordion)`
  /* Override the title and hide the icon */
  button {
    background: transparent !important;
    padding: 8px 0 !important;
    color: #333 !important;
    font-weight: 600 !important;
    font-size: 1.05rem !important;
    box-shadow: none !important;
    border: none !important;
  }

  svg:last-child {
    /* This targets the chevron icon */
    display: none;
  }

  /* Optional: remove folder icon too */
  svg:first-child {
    display: none;
  }

  /* Optional: tweak paragraph spacing */
  p {
    margin: 0;
  }

  /* Override content styling if needed */
  div[role="region"] {
    padding: 0 !important;
    background: none !important;
  }
`;
