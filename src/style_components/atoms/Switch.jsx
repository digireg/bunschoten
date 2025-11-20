import React from "react";
import styled from "styled-components";
import { tokens, components } from "../themes/light";

const SwitchLabel = styled.label`
  display: inline-flex;
  align-items: center;
  cursor: pointer;
`;

const HiddenCheckbox = styled.input.attrs({ type: "checkbox" })`
  opacity: 0;
  width: 0;
  height: 0;

  &:checked + span {
    background-color: ${tokens.colors.Company.Primary};
  }

  &:checked + span::before {
    transform: translateX(15px);
    border: 1px solid ${tokens.colors.Company.Primary};
  }

  &:disabled + span {
    opacity: 0.6;
    cursor: not-allowed;
  }
`;

const Slider = styled.span`
  position: relative;
  width: 26px;
  height: 14px;
  background-color: #ccc;
  border-radius: 34px;
  transition: background-color 0.4s;

  &::before {
    content: "";
    position: absolute;
    height: 14px;
    width: 14px;
    left: 0;
    bottom: 0;
    background-color: white;
    border-radius: 50%;
    border: 1px solid ${tokens.colors.grays[500]};
    transition: transform 0.4s;
  }
`;

export function Switch({ checked, onChange, disabled /*, label */ }) {
  return (
    <SwitchLabel>
      {/* {label && <span>{label}</span>} */}
      <HiddenCheckbox
        checked={checked}
        onChange={onChange}
        disabled={disabled}
        id="activeLayers"
      />
      <Slider />
    </SwitchLabel>
  );
}
