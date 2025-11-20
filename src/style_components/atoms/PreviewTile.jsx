import styled, { css } from "styled-components";
import { tokens } from "../themes/light";

export const PreviewTile = styled.div`
  position: relative;
  display: flex;
  flex-direction: column;
  justify-content: flex-start; /* top align */
  align-items: center;
  gap: ${tokens.space[3]};
  width: 100%;
  max-width: 150px;
  height: 175px;
  padding: ${tokens.space[3]};
  border-radius: ${tokens.radii[4]};
  border: 1px solid
    ${({ $active }) =>
      $active ? tokens.colors.Company.Primary : tokens.colors.grays[300]};
  background-color: ${tokens.colors.white};
  cursor: pointer;
  transition: border-color 0.2s ease, transform 0.15s ease,
    box-shadow 0.15s ease;

  /* === Hover + Active States === */
  &:hover {
    ${({ $active }) =>
      !$active &&
      css`
        border-color: ${tokens.colors.Company.PrimaryLight};
        transform: translateY(-2px);
        box-shadow: ${tokens.shadows[1]};
      `}
  }

  &:active {
    transform: translateY(0);
    box-shadow: none;
  }

  &:hover::before {
    ${({ $active }) =>
      !$active &&
      css`
        content: "";
        position: absolute;
        inset: 0;
        border-radius: ${tokens.radii[4]};
        background-color: ${tokens.colors.Company.PrimaryLight};
        opacity: 0.05;
        pointer-events: none;
        z-index: 1;
      `}
  }

  /* Keep all content above overlay */
  & > * {
    position: relative;
    z-index: 2;
  }

  /* Optional title consistency */
  p {
    min-height: 2.4em;
    text-align: center;
  }
`;
