import styled, { keyframes } from "styled-components";

const spin = keyframes`
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
`;

const Spinner = styled.div`
  width: ${(props) => props.size || "16px"};
  height: ${(props) => props.size || "16px"};
  border: ${(props) => (props.size ? props.size / 8 : 2)}px solid #ccc;
  border-top: ${(props) => (props.size ? props.size / 8 : 2)}px solid #333;
  border-radius: 50%;
  animation: ${spin} 0.8s linear infinite;
`;

export default Spinner;
