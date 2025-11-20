import styled from "styled-components";
import { tokens } from "../themes/light";

export const OpacitySlider = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: ${tokens.space[3]};
  margin-bottom: ${tokens.space[4]};

  label {
    flex: 1;
    font-size: ${tokens.fontSizes[3]};
    color: ${tokens.colors.grays[700]};
  }

  input[type="range"] {
    flex: 2;
    width: 100%;
    height: 4px;
    appearance: none;
    background: ${tokens.colors.grays[300]};
    border-radius: 2px;
    cursor: pointer;

    &::-webkit-slider-thumb {
      appearance: none;
      width: 14px;
      height: 14px;
      border-radius: 50%;
      background: ${tokens.colors.Company.Primary};
      transition: background 0.2s ease;
    }

    &::-webkit-slider-thumb:hover {
      background: ${tokens.colors.Company.Secondary};
    }

    &::-moz-range-thumb {
      width: 14px;
      height: 14px;
      border-radius: 50%;
      background: ${tokens.colors.Company.Primary};
      transition: background 0.2s ease;
    }
  }
`;
