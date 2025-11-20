import React, { useState } from "react";
import { MdLegendToggle } from "react-icons/md"; // Icon for legend toggle
import {
  MapButton, // Styled button component
  LegendButtonContainer,
  LegendaPanel, // Legend container styles
  Accordion, // Accordion component for grouped layers
} from "../style_components";

/**
 * Legend component
 * Shows a toggleable panel of active layers with their legend symbols
 * @param {Array} activeLayers - Array of active layers from useMapLayers
 */

/* Ver 3*/
export default function Legend({ activeLayers = [] }) {
  const [isOpen, setIsOpen] = useState(false);
  const toggleLegenda = () => setIsOpen((prev) => !prev);

  const totalCount = activeLayers.length;

  return (
    <LegendButtonContainer className={isOpen ? "active" : null}>
      <MapButton
        icon={<MdLegendToggle />}
        $active={isOpen}
        onClick={toggleLegenda}
        aria-expanded={isOpen}
        aria-controls="legend-panel"
      >
        Legende ({totalCount})
      </MapButton>

      <LegendaPanel
        $isOpen={isOpen}
        id="legend-panel"
        role="region"
        aria-hidden={!isOpen}
        style={{
          display: isOpen ? "block" : "none",
          opacity: isOpen ? 1 : 0,
          transform: isOpen ? "translateY(0)" : "translateY(120%)",
          transition: "transform 0.3s ease, opacity 0.3s ease",
        }}
      >
        {activeLayers.length > 0 ? (
          activeLayers.map((layer) => {
            // Accordion title: "Dataset | Layer"
            const accordionTitle = `${layer.groupTitle || "Dataset"} | ${
              layer.label || layer.layerName
            }`;

            return (
              <Accordion key={layer.id} title={accordionTitle}>
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    marginBottom: 4,
                  }}
                >
                  {layer.legendUrl ? (
                    <img
                      src={layer.legendUrl}
                      alt={accordionTitle}
                      style={{ width: "auto", height: "auto", marginRight: 6 }}
                    />
                  ) : (
                    <div
                      style={{
                        width: 24,
                        height: 24,
                        marginRight: 6,
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        fontSize: 10,
                        textAlign: "center",
                        backgroundColor: "#eee",
                        borderRadius: 4,
                      }}
                    >
                      {accordionTitle}
                    </div>
                  )}
                </div>
              </Accordion>
            );
          })
        ) : (
          <div>
            <p>
              <em>Geen legende beschikbaar</em>
            </p>
          </div>
        )}
      </LegendaPanel>
    </LegendButtonContainer>
  );
}
