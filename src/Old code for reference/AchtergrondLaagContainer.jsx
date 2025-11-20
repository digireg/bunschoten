//v1
// import React, { useEffect, useRef } from "react";
// import PropTypes from "prop-types";
// import {
//   AchtergrondLaagContainer,
//   AchtergrondLaagPanel,
//   PanelHeader,
//   PreviewGrid,
//   PreviewTile,
//   TileThumbnail,
// } from "../style_components/AchtergrondLaagContainerStyle";
// import { FiMap } from "react-icons/fi";

// export default function AchtergrondLaag({
//   isOpen,
//   setActivePanel,
//   setActiveBackgroundLayer,
//   activeBackgroundLayer,
// }) {
//   const panelRef = useRef(null); // Ref to detect clicks outside panel

//   /**
//    * Define available background layers.
//    * Each has an id (for logic), a display name, and a thumbnail path.
//    * Note: ids correspond exactly to the keys used in map.jsx createBaseLayer().
//    */
//   const backgroundLayers = [
//     {
//       id: "openstreet",
//       name: "OpenStreetMap",
//       thumbnail: "/demo-kenia/thumbnails/openstreet.png",
//     },
//     {
//       id: "esri",
//       name: "Satellite Map",
//       thumbnail: "/demo-kenia/thumbnails/esri.png",
//     },
//     {
//       id: "mombasa",
//       name: "Digireg Mombasa Satellite",
//       thumbnail: "/demo-kenia/thumbnails/mombasa.png",
//     },
//     { id: "pdok_BRT", name: "PDOK BRT", thumbnail: "/thumbnails/pdok_BRT.png" },
//     {
//       id: "pdok_luchtfoto",
//       name: "PDOK Luchtfoto",
//       thumbnail: "/thumbnails/pdok_luchtfoto.png",
//     },
//   ];

//   /**
//    * Close the panel if user clicks outside of it.
//    * Runs whenever `isOpen` changes.
//    */
//   useEffect(() => {
//     const handleClickOutside = (event) => {
//       if (panelRef.current && !panelRef.current.contains(event.target)) {
//         setActivePanel(null);
//       }
//     };

//     if (isOpen) {
//       document.addEventListener("mousedown", handleClickOutside);
//     }

//     return () => {
//       document.removeEventListener("mousedown", handleClickOutside);
//     };
//   }, [isOpen, setActivePanel]);

//   return (
//     <AchtergrondLaagContainer>
//       <AchtergrondLaagPanel ref={panelRef} $isOpen={isOpen}>
//         <PanelHeader>
//           <FiMap size={20} />
//           <h1>Background layers</h1>
//         </PanelHeader>

//         <PreviewGrid>
//           {backgroundLayers.map((layer) => (
//             <PreviewTile
//               key={layer.id}
//               onClick={() => setActiveBackgroundLayer(layer.id)}
//               $active={activeBackgroundLayer === layer.id}
//             >
//               <TileThumbnail
//                 as="img"
//                 src={layer.thumbnail}
//                 alt={`${layer.name} thumbnail`}
//               />
//               <p>{layer.name}</p>
//             </PreviewTile>
//           ))}
//         </PreviewGrid>
//       </AchtergrondLaagPanel>
//     </AchtergrondLaagContainer>
//   );
// }

// // ✅ Prop validation for correct usage and documentation
// AchtergrondLaag.propTypes = {
//   isOpen: PropTypes.bool.isRequired, // Whether the panel is open
//   setActivePanel: PropTypes.func.isRequired, // Function to open/close panels
//   setActiveBackgroundLayer: PropTypes.func.isRequired, // Function to set active background layer
//   activeBackgroundLayer: PropTypes.string.isRequired, // Currently active background layer id
// };
