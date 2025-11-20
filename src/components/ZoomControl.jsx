import React from "react";
import {
  ZoomControlContainer,
  ZoomInButton,
  ZoomOutButton,
} from "../style_components";
import { FiPlus, FiMinus } from "react-icons/fi";

export default function ZoomControl({ mapRef }) {
  const zoomIn = () => {
    if (!mapRef.current) return;
    const view = mapRef.current.getView();
    const zoom = view.getZoom();
    view.animate({ zoom: zoom + 1, duration: 300 });
  };

  const zoomOut = () => {
    if (!mapRef.current) return;
    const view = mapRef.current.getView();
    const zoom = view.getZoom();
    view.animate({ zoom: zoom - 1, duration: 300 });
  };

  return (
    <ZoomControlContainer>
      <ZoomInButton onClick={zoomIn}>
        <FiPlus />
      </ZoomInButton>
      <ZoomOutButton onClick={zoomOut}>
        <FiMinus />
      </ZoomOutButton>
    </ZoomControlContainer>
  );
}
