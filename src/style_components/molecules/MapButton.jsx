import React from "react";
import { MapButtonStyle } from "../atoms/ButtonVariants";

export function MapButton({
  icon,
  children,
  hideText = false,
  iconPosition = "left",
  $active = false,
  ...props
}) {
  return (
    <MapButtonStyle
      className={iconPosition === "right" ? "icon-right" : ""}
      $active={$active}
      {...props}
    >
      {icon && <span>{icon}</span>}
      {!hideText && children}
    </MapButtonStyle>
  );
}
