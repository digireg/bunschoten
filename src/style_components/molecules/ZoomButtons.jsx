import React from "react";
import { ZoomButton } from "../atoms/ButtonVariants";

export function ZoomInButton(props) {
  return (
    <ZoomButton $position="top" {...props}>
      +
    </ZoomButton>
  );
}

export function ZoomOutButton(props) {
  return (
    <ZoomButton $position="bottom" {...props}>
      −
    </ZoomButton>
  );
}
