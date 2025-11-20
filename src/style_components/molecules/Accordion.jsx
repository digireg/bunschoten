import React, { useState } from "react";
import styled from "styled-components";
import { FaChevronDown, FaFolder } from "react-icons/fa";
import { tokens, components } from "../themes/light";

// Container for the whole accordion section
const AccordionSection = styled.div`
  /* You can add borders or margins here if needed */
`;

// The clickable header bar of the accordion
const AccordionHeader = styled.button`
  width: 100%;
  background: ${({ $isOpen }) => ($isOpen ? "#f0f4fa" : "#f5f5f5")};
  border: none;
  outline: none;
  padding: ${tokens.space[5]};
  text-align: left;
  font-size: ${tokens.fontSizes[3]};
  font-weight: ${tokens.fontWeights.bold};
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: space-between;
  color: ${({ $isOpen }) =>
    $isOpen ? tokens.colors.Company.Primary : "inherit"};
  transition: background-color 0.2s ease, color 0.2s ease;

  /* Hover styles for better UX */
  &:hover {
    background: ${({ $isOpen }) =>
      $isOpen ? tokens.colors.Company.PrimaryLight : tokens.colors.grays[100]};
    color: ${tokens.colors.Company.Primary}; /* Consistent hover color */
  }
`;

// Wrapper for the title text and folder icon in the header
const TitleWrapper = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;

  /* Reset default margin on paragraph */
  p {
    margin: 0;
  }
`;

// Chevron icon that indicates open/close state, rotates on toggle
const ChevronIcon = styled(FaChevronDown)`
  transition: transform 0.3s ease;
  transform: ${({ $isOpen }) => ($isOpen ? "rotate(180deg)" : "rotate(0deg)")};
`;

// Content area of the accordion which expands/collapses
const AccordionContent = styled.div`
  max-height: ${({ $isOpen }) =>
    $isOpen ? "fit-content" : "0"}; // smooth collapse
  overflow: hidden; // hide content when collapsed
  transition: max-height 0.1s ease;
  padding: ${({ $isOpen }) =>
    $isOpen ? "20px 30px" : "0px 30px"}; // add padding only when open
  background: ${tokens.colors.Company.PrimaryLight};
`;

// Accordion component function
export default function Accordion({
  title,
  count,
  children,
  startIcon: StartIcon,
}) {
  // Local state to track open/close of this accordion item
  const [isOpen, setIsOpen] = useState(false);

  return (
    <AccordionSection>
      {/* Header is a button to toggle the accordion */}
      <AccordionHeader
        onClick={() => setIsOpen(!isOpen)}
        $isOpen={isOpen} // styled prop to adjust styles based on state
        aria-expanded={isOpen} // accessibility attribute
        aria-controls={`accordion-content-${title}`}
      >
        <TitleWrapper>
          {/* Folder icon next to the title */}
          {StartIcon && <StartIcon style={{ fontSize: "16px" }} />}
          {/* Title and count */}
          <p>
            {title}
            {typeof count !== "undefined" && ` (${count})`}
          </p>
        </TitleWrapper>
        {/* Chevron icon rotates based on open state */}
        <ChevronIcon $isOpen={isOpen} />
      </AccordionHeader>

      {/* Accordion content area, collapses when closed */}
      <AccordionContent
        id={`accordion-content-${title}`}
        $isOpen={isOpen}
        role="region"
        aria-hidden={!isOpen}
      >
        {children}
      </AccordionContent>
    </AccordionSection>
  );
}
