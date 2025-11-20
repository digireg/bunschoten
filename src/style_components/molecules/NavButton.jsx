import React from "react";
import { NavButtonStyle } from "../atoms/ButtonVariants";

export function NavButton({
  icon,
  children,
  hideText = false,
  iconPosition = "left",
  ...props
}) {
  return (
    <NavButtonStyle
      className={iconPosition === "right" ? "icon-right" : ""}
      {...props}
    >
      {icon && <span>{icon}</span>}
      {!hideText && children}
    </NavButtonStyle>
  );
}
