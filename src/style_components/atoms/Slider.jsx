import React from "react";
import styled from "styled-components";
import { tokens, components } from "../themes/light";

const SliderWrapper = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${tokens.space[5]};
  width: 100%;

  &:not(:last-child) {
    border-bottom: 1px solid ${tokens.colors.Company.Secondary};
    padding-bottom: ${tokens.space[6]};
    margin-bottom: ${tokens.space[6]};
  }
`;

const TopRow = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
`;

const Label = styled.label`
  font-size: ${tokens.fontSizes[3]};
  font-weight: ${tokens.fontWeights.medium};
  color: ${tokens.colors.grays[800]};
`;

const InputGroup = styled.div`
  display: flex;
  align-items: center;
  gap: ${tokens.space[1]};
`;

const NumberInput = styled.input`
  width: 50px;
  text-align: right;
  padding: ${tokens.space[2]} ${tokens.space[1]};
  border-radius: ${tokens.radii[2]};
  border: ${tokens.colors.black} solid 1px;
`;

const Slider = styled.input.attrs({ type: "range" })`
  -webkit-appearance: none;
  width: 100%;
  height: 4px;
  border-radius: ${tokens.radii[1]};
  background: ${({ value }) =>
    `linear-gradient(to right, ${tokens.colors.Company.Primary} 0%, ${tokens.colors.Company.Primary} ${value}%, ${tokens.colors.Company.Secondary} ${value}%, ${tokens.colors.Company.Secondary} 100%)`};
  outline: none;
  margin: 0;
  padding: 0;
  cursor: pointer;
  box-sizing: border-box;
  transition: background 0.3s ease;

  &::-webkit-slider-thumb {
    -webkit-appearance: none;
    appearance: none;
    width: 14px;
    height: 14px;
    border-radius: 50%;
    background: ${tokens.colors.Company.Primary};
    border: none;
    transition: background 0.2s ease;
    margin-top: -5px; /* center thumb vertically on 4px track (half of thumb minus half of track) */
  }

  &::-moz-range-thumb {
    width: 14px;
    height: 14px;
    border-radius: 50%;
    background: ${tokens.colors.Company.Primary};
    border: none;
    transition: background 0.2s ease;
  }

  &::-moz-range-track {
    background: ${tokens.colors.Company.Secondary};
    height: 4px;
    border-radius: ${tokens.radii[1]};
  }

  &::-moz-range-progress {
    background: ${tokens.colors.Company.Primary};
    height: 4px;
    border-radius: ${tokens.radii[1]};
  }

  &:hover::-webkit-slider-thumb {
    background: ${tokens.colors.Company.Primary};
  }

  &:hover::-moz-range-thumb {
    background: ${tokens.colors.Company.Primary};
  }
`;

export default function OpacitySlider({
  label = "Layer Transparency",
  value = 100,
  onChange,
}) {
  // Handle slider change event and notify parent with new value
  const handleSliderChange = (e) => {
    const newValue = Number(e.target.value);
    onChange?.(newValue);
  };

  // Handle number input change and validate the value before notifying parent
  const handleInputChange = (e) => {
    let newValue = Number(e.target.value);
    if (isNaN(newValue)) return;
    if (newValue > 100) newValue = 100;
    if (newValue < 0) newValue = 0;
    onChange?.(newValue);
  };

  return (
    <SliderWrapper>
      <TopRow>
        <Label>{label}</Label>
        <InputGroup>
          <NumberInput
            type="number"
            min="0"
            max="100"
            value={value}
            onChange={handleInputChange}
          />
          <span>%</span>
        </InputGroup>
      </TopRow>
      <Slider value={value} onChange={handleSliderChange} />
    </SliderWrapper>
  );
}
