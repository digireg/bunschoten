import React from "react";
import styled from "styled-components";
import { tokens, components } from "../themes/light";

export const FieldRow = styled.div`
  display: grid;
  grid-template-columns: 2fr 1fr;
  column-gap: 10px;
  align-items: start;
  border-bottom: ${(props) =>
    props.$isLast ? "none" : `1px solid ${tokens.colors.Company.Secondary}`};
  padding: 15px 10px;
  transition: background-color 0.2s;

  &:hover {
    background-color: ${tokens.colors.Company
      .Primary}; // subtle light gray on hover
    color: #fff;
    border-bottom: ${(props) =>
      props.$isLast ? "none" : `1px solid ${tokens.colors.Company.Secondary}`};
  }
`;
