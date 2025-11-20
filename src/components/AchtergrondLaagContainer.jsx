//v2
// src/components/AchtergrondLaag.jsx
import React, { useRef, useEffect } from "react";
import PropTypes from "prop-types";
import {
  AchtergrondLaagContainer,
  AchtergrondLaagPanel,
  PanelHeader,
  PreviewGrid,
  PreviewTile,
  TileThumbnail,
} from "../style_components";
import { FiMap } from "react-icons/fi";
import { backgroundLayersConfig } from "../config/backgroundLayersConfig";

export default function AchtergrondLaag({
  isOpen,
  setActivePanel,
  setActiveBackgroundLayer,
  activeBackgroundLayer,
}) {
  const panelRef = useRef(null);

  // Flatten config into an array for display
  const backgroundLayers = Object.values(backgroundLayersConfig).flatMap(
    (projLayers) =>
      Object.values(projLayers).map((layer) => ({
        id: layer.id,
        name: layer.title,
        // Optional: add thumbnails; fallback if none
        thumbnail: layer.thumbnail || `/demo-kenia/thumbnails/${layer.id}.png`,
      }))
  );

  // Close panel if click outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (panelRef.current && !panelRef.current.contains(event.target)) {
        setActivePanel(null);
      }
    };

    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isOpen, setActivePanel]);

  return (
    <AchtergrondLaagContainer>
      <AchtergrondLaagPanel ref={panelRef} $isOpen={isOpen}>
        <PanelHeader>
          <FiMap size={20} />
          <h1>Background layers</h1>
        </PanelHeader>

        <PreviewGrid>
          {backgroundLayers.map((layer) => (
            <PreviewTile
              key={layer.id}
              onClick={() => setActiveBackgroundLayer(layer.id)}
              $active={activeBackgroundLayer === layer.id}
            >
              <TileThumbnail
                as="img"
                src={layer.thumbnail}
                alt={`${layer.name} thumbnail`}
              />
              <p>{layer.name}</p>
            </PreviewTile>
          ))}
        </PreviewGrid>
      </AchtergrondLaagPanel>
    </AchtergrondLaagContainer>
  );
}

AchtergrondLaag.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  setActivePanel: PropTypes.func.isRequired,
  setActiveBackgroundLayer: PropTypes.func.isRequired,
  activeBackgroundLayer: PropTypes.string.isRequired,
};
