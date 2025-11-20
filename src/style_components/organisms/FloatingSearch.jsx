import styled, { keyframes } from "styled-components";
import { tokens } from "../themes/light";

// === Animations ===
const fadeSlideDown = keyframes`
  from { opacity: 0; transform: translateY(-4px); }
  to { opacity: 1; transform: translateY(0); }
`;

const spin = keyframes`
  to { transform: rotate(360deg); }
`;

// === Main floating container ===
export const FloatingSearch = styled.div`
  position: absolute;
  top: ${tokens.space[5]};
  left: 50%;
  transform: translateX(-50%);
  z-index: 998;
  border-radius: ${tokens.radii[2]};
  box-shadow: ${tokens.shadows[2]};

  @media (min-width: ${tokens.breakpoints.sm}) {
    left: ${tokens.space[23]};
    transform: none;
  }

  @media (min-width: ${tokens.breakpoints.md}) {
    left: ${tokens.space[23]};
    transform: none;
  }

  /* === Scoped form === */
  .map-search-form {
    display: flex;
    align-items: stretch;
    width: 100%;
  }

  /* === Input + button scoped inside .search-form only === */
  .map-search-form input,
  .map-search-form button {
    box-sizing: border-box;
    font-size: ${tokens.fontSizes[4]};
    line-height: ${tokens.lineHeights.compact};
    padding: ${tokens.space[3]} ${tokens.space[4]};
    transition: border-color 0.2s ease, background-color 0.2s ease,
      color 0.2s ease;
    outline: none;
  }

  /* === Input === */
  .map-search-form input {
    border: 1px solid transparent;
    border-right: none;
    border-top-left-radius: ${tokens.radii[2]};
    border-bottom-left-radius: ${tokens.radii[2]};
    background-color: ${tokens.colors.white};
    width: 75vw;

    @media (min-width: ${tokens.breakpoints.sm}) {
      width: 79vw;
    }

    @media (min-width: ${tokens.breakpoints.md}) {
      width: 32.5vw;
    }

    &:hover,
    &:focus {
      border-left: 1px solid ${tokens.colors.Company.Primary};
      border-top: 1px solid ${tokens.colors.Company.Primary};
      border-bottom: 1px solid ${tokens.colors.Company.Primary};
      border-right: none;
    }
  }

  /* === Button === */
  .map-search-form button {
    display: flex;
    align-items: center;
    justify-content: center;
    gap: ${tokens.space[2]};
    border: 1px solid ${tokens.colors.Company.Primary};
    border-top-right-radius: ${tokens.radii[2]};
    border-bottom-right-radius: ${tokens.radii[2]};
    background-color: ${tokens.colors.Company.Primary};
    color: ${tokens.colors.white};
    cursor: pointer;

    &:hover,
    &:active {
      background-color: ${tokens.colors.white};
      color: ${tokens.colors.Company.Primary};
      border-color: ${tokens.colors.Company.Primary};
    }
  }

  /* === Autofill fix (scoped) === */
  .map-search-form input:-webkit-autofill {
    -webkit-box-shadow: 0 0 0px 1000px ${tokens.colors.white} inset !important;
    -webkit-text-fill-color: #000 !important;
  }
`;

// === Other utilities (unchanged) ===
export const SearchWrapper = styled.div`
  position: relative;
  width: fit-content;
`;

export const Spinner = styled.div`
  width: 18px;
  height: 18px;
  border: 2px solid rgba(40, 79, 151, 0.3);
  border-top-color: ${tokens.colors.Company.Primary};
  border-radius: 50%;
  animation: ${spin} 0.8s linear infinite;
  margin-left: 8px;
`;

export const SuggestionsList = styled.ul`
  position: absolute;
  top: 100%;
  left: 0;
  width: 100%;
  background: ${tokens.colors.white};
  border: 1px solid ${tokens.colors.grays[200]};
  max-height: 200px;
  overflow-y: auto;
  z-index: 10;
  margin: 0;
  padding: 0;
  list-style: none;
  animation: ${fadeSlideDown} 0.15s ease;
`;

export const SuggestionItem = styled.li`
  padding: 8px 12px;
  cursor: pointer;
  transition: background-color 0.15s ease;
  background-color: ${({ $isHighlighted }) =>
    $isHighlighted ? tokens.colors.grays[100] : "transparent"};

  &:hover {
    background-color: ${tokens.colors.Company.Secondary};
    color: ${tokens.colors.white};
  }
`;
