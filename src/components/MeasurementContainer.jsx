import React, { useEffect, useRef } from "react";
import PropTypes from "prop-types";
import {
  MeasurementContainer,
  MeasurementPanel,
  PanelHeader,
  PreviewGrid,
  PreviewTile,
  TileThumbnail,
} from "../style_components";
import { TbPolygon } from "react-icons/tb";
import { FaRuler, FaStopCircle } from "react-icons/fa";
import { TiImageOutline } from "react-icons/ti";
import { AiOutlineClear } from "react-icons/ai";
import { MdDelete } from "react-icons/md";

export default function Measurement({ isOpen, setActivePanel, onSelectTool }) {
  const panelRef = useRef(null); // Ref to detect clicks outside panel

  /**
   * Define Measurement tools.
   * Each has an id (for logic), a display name, and a thumbnail path.
   * Note: ids correspond exactly to the keys used in map.jsx createBaseLayer().
   */
  const MeasurementTools = [
    {
      id: "lijnMeten",
      name: "Measure line",
      Icon: TiImageOutline,
    },
    { id: "polygonMeten", name: "Measure polygon", Icon: TbPolygon },

    {
      id: "stopMeting",
      name: "Stop measurement",
      Icon: FaStopCircle,
    },
    {
      id: "wisMeting",
      name: "Clear measurement",
      Icon: AiOutlineClear,
    },
    {
      id: "stopEnWisMeting",
      name: "Stop and clear measurement",
      Icon: MdDelete,
    },
  ];

  /**
   * Close the panel if user clicks outside of it.
   * Runs whenever `isOpen` changes.
   */
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
    <MeasurementContainer>
      <MeasurementPanel ref={panelRef} $isOpen={isOpen}>
        <PanelHeader>
          <FaRuler size={20} />
          <h1>Measuring tools</h1>
        </PanelHeader>

        <PreviewGrid>
          {MeasurementTools.map((tool) => (
            <PreviewTile key={tool.id} onClick={() => onSelectTool(tool.id)}>
              <TileThumbnail style={{ display: "grid", placeItems: "center" }}>
                <tool.Icon size={36} />
              </TileThumbnail>
              <p>{tool.name}</p>
            </PreviewTile>
          ))}
        </PreviewGrid>
      </MeasurementPanel>
    </MeasurementContainer>
  );
}

// ✅ Prop validation for correct usage and documentation
Measurement.propTypes = {
  isOpen: PropTypes.bool.isRequired, // Whether the panel is open
  setActivePanel: PropTypes.func.isRequired, // Function to open/close panels
  onSelectTool: PropTypes.func.isRequired,
};
