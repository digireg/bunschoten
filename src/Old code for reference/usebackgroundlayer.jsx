// hooks/useBackgroundLayer.jsx V1
// import { useEffect, useRef, useState } from "react";
// import { fromLonLat, toLonLat } from "ol/proj";
// import proj4 from "proj4";
// import { NL_BBOX } from "../utils/geoHelpers";
// import { createBaseLayer } from "../utils/baseLayerFactory";

// export default function useBackgroundLayer({
//   mapInstance,
//   backgroundLayerRef,
//   currentProjectionCode,
//   setCurrentProjectionCode,
//   activeBackgroundLayer,
//   setActiveBackgroundLayer,
//   createMap, // <-- passed from useMapInstance
// }) {
//   // Update base layer when activeBackgroundLayer changes
//   useEffect(() => {
//     if (!backgroundLayerRef.current || !mapInstance.current) return;

//     const baseLayer = createBaseLayer(
//       currentProjectionCode,
//       activeBackgroundLayer
//     );
//     backgroundLayerRef.current.setSource(baseLayer.getSource());
//     backgroundLayerRef.current.setZIndex(0);
//   }, [activeBackgroundLayer, currentProjectionCode]);

//   // Handle zoom/center changes and NL projection switching
//   useEffect(() => {
//     if (!mapInstance.current) return;
//     const view = mapInstance.current.getView();

//     const handleViewChange = () => {
//       if (!mapInstance.current) return;

//       const centerProj = view.getCenter();
//       const zoom = view.getZoom();
//       const centerLonLat =
//         currentProjectionCode === "EPSG:28992"
//           ? proj4("EPSG:28992", "EPSG:4326", centerProj)
//           : toLonLat(centerProj);

//       const insideNL =
//         centerLonLat[0] >= NL_BBOX[0] &&
//         centerLonLat[0] <= NL_BBOX[2] &&
//         centerLonLat[1] >= NL_BBOX[1] &&
//         centerLonLat[1] <= NL_BBOX[3];

//       const zoomThreshold = 10;

//       if (
//         insideNL &&
//         zoom >= zoomThreshold &&
//         currentProjectionCode !== "EPSG:28992"
//       ) {
//         setActiveBackgroundLayer("pdok_BRT");
//         if (createMap) createMap("EPSG:28992", centerLonLat, zoom, "pdok_BRT");
//         setCurrentProjectionCode("EPSG:28992");
//         return;
//       }

//       if (
//         (!insideNL || zoom < zoomThreshold) &&
//         currentProjectionCode !== "EPSG:3857"
//       ) {
//         setActiveBackgroundLayer("openstreet");
//         if (createMap) createMap("EPSG:3857", centerLonLat, zoom, "openstreet");
//         setCurrentProjectionCode("EPSG:3857");
//       }
//     };

//     let debounceTimer;
//     const onChange = () => {
//       clearTimeout(debounceTimer);
//       debounceTimer = setTimeout(handleViewChange, 300);
//     };

//     view.on("change:center", onChange);
//     view.on("change:resolution", onChange);

//     return () => {
//       view.un("change:center", onChange);
//       view.un("change:resolution", onChange);
//       clearTimeout(debounceTimer);
//     };
//   }, [currentProjectionCode, setActiveBackgroundLayer, createMap]);
// }

//V2
// hooks / useBackgroundLayer.jsx;
// import { useEffect } from "react";
// import { toLonLat } from "ol/proj";
// import proj4 from "proj4";
// import { NL_BBOX } from "../utils/geoHelpers";
// import { createBaseLayer } from "../utils/baseLayerFactory";
// import { backgroundLayersConfig } from "../config/backgroundLayersConfig";

// export default function useBackgroundLayer({
//   mapInstance,
//   backgroundLayerRef,
//   currentProjectionCode,
//   setCurrentProjectionCode,
//   activeBackgroundLayer,
//   setActiveBackgroundLayer,
//   createMap, // from useMapInstance
// }) {
//   // Update base layer when activeBackgroundLayer changes
//   useEffect(() => {
//     if (!backgroundLayerRef.current || !mapInstance.current) return;

//     const baseLayer = createBaseLayer(
//       currentProjectionCode,
//       activeBackgroundLayer
//     );
//     backgroundLayerRef.current.setSource(baseLayer.getSource());
//     backgroundLayerRef.current.setZIndex(0);
//   }, [activeBackgroundLayer, currentProjectionCode]);

//   // Handle zoom/center changes and NL/world projection switching
//   useEffect(() => {
//     if (!mapInstance.current) return;
//     const view = mapInstance.current.getView();

//     const handleViewChange = () => {
//       if (!mapInstance.current) return;

//       const centerProj = view.getCenter();
//       const zoom = view.getZoom();
//       const centerLonLat =
//         currentProjectionCode === "EPSG:28992"
//           ? proj4("EPSG:28992", "EPSG:4326", centerProj)
//           : toLonLat(centerProj);

//       const insideNL =
//         centerLonLat[0] >= NL_BBOX[0] &&
//         centerLonLat[0] <= NL_BBOX[2] &&
//         centerLonLat[1] >= NL_BBOX[1] &&
//         centerLonLat[1] <= NL_BBOX[3];

//       const zoomThreshold = 10;

//       if (
//         insideNL &&
//         zoom >= zoomThreshold &&
//         currentProjectionCode !== "EPSG:28992"
//       ) {
//         const defaultNLLayer = Object.keys(
//           backgroundLayersConfig["EPSG:28992"]
//         )[0];
//         setActiveBackgroundLayer(defaultNLLayer);
//         if (createMap)
//           createMap("EPSG:28992", centerLonLat, zoom, defaultNLLayer);
//         setCurrentProjectionCode("EPSG:28992");
//         return;
//       }

//       if (
//         (!insideNL || zoom < zoomThreshold) &&
//         currentProjectionCode !== "EPSG:3857"
//       ) {
//         const defaultWorldLayer = Object.keys(
//           backgroundLayersConfig["EPSG:3857"]
//         )[0];
//         setActiveBackgroundLayer(defaultWorldLayer);
//         if (createMap)
//           createMap("EPSG:3857", centerLonLat, zoom, defaultWorldLayer);
//         setCurrentProjectionCode("EPSG:3857");
//       }
//     };

//     let debounceTimer;
//     const onChange = () => {
//       clearTimeout(debounceTimer);
//       debounceTimer = setTimeout(handleViewChange, 300);
//     };

//     view.on("change:center", onChange);
//     view.on("change:resolution", onChange);

//     return () => {
//       view.un("change:center", onChange);
//       view.un("change:resolution", onChange);
//       clearTimeout(debounceTimer);
//     };
//   }, [currentProjectionCode, setActiveBackgroundLayer, createMap]);
// }

//v3
// import { useEffect } from "react";
// import { toLonLat } from "ol/proj";
// import View from "ol/View";
// import proj4 from "proj4";
// import { NL_BBOX } from "../utils/geoHelpers";
// import { createBaseLayer } from "../utils/baseLayerFactory";
// import { backgroundLayersConfig } from "../config/backgroundLayersConfig";

// export default function useBackgroundLayer({
//   mapInstance,
//   backgroundLayerRef,
//   currentProjectionCode,
//   setCurrentProjectionCode,
//   activeBackgroundLayer,
//   setActiveBackgroundLayer,
//   createMap, // optional: used if you need to reinitialize map
// }) {
//   // Update base layer when activeBackgroundLayer changes
//   useEffect(() => {
//     if (!backgroundLayerRef.current || !mapInstance.current) return;

//     const baseLayer = createBaseLayer(
//       currentProjectionCode,
//       activeBackgroundLayer
//     );
//     backgroundLayerRef.current.setSource(baseLayer.getSource());
//     backgroundLayerRef.current.setZIndex(0);
//   }, [activeBackgroundLayer, currentProjectionCode]);

//   // Handle EPSG switch based on NL bbox
//   useEffect(() => {
//     if (!mapInstance.current) return;
//     const view = mapInstance.current.getView();

//     const handleViewChange = () => {
//       if (!mapInstance.current) return;

//       const centerProj = view.getCenter();
//       const zoom = view.getZoom();
//       const centerLonLat =
//         currentProjectionCode === "EPSG:28992"
//           ? proj4("EPSG:28992", "EPSG:4326", centerProj)
//           : toLonLat(centerProj);

//       const insideNL =
//         centerLonLat[0] >= NL_BBOX[0] &&
//         centerLonLat[0] <= NL_BBOX[2] &&
//         centerLonLat[1] >= NL_BBOX[1] &&
//         centerLonLat[1] <= NL_BBOX[3];

//       let targetEPSG = currentProjectionCode;

//       if (insideNL && currentProjectionCode !== "EPSG:28992") {
//         targetEPSG = "EPSG:28992";
//       } else if (!insideNL && currentProjectionCode !== "EPSG:3857") {
//         targetEPSG = "EPSG:3857";
//       }

//       if (targetEPSG !== currentProjectionCode) {
//         // switch projection safely
//         const newView = new View({
//           projection: targetEPSG,
//           center:
//             targetEPSG === "EPSG:28992"
//               ? proj4("EPSG:4326", "EPSG:28992", centerLonLat)
//               : proj4("EPSG:28992", "EPSG:3857", centerProj),
//           zoom,
//           minZoom: view.getMinZoom(),
//           maxZoom: view.getMaxZoom(),
//         });

//         mapInstance.current.setView(newView);

//         // update background layer to match new projection
//         const defaultLayer = Object.keys(backgroundLayersConfig[targetEPSG])[0];
//         setActiveBackgroundLayer(defaultLayer);
//         setCurrentProjectionCode(targetEPSG);
//       }
//     };

//     let debounceTimer;
//     const onChange = () => {
//       clearTimeout(debounceTimer);
//       debounceTimer = setTimeout(handleViewChange, 300);
//     };

//     view.on("change:center", onChange);
//     view.on("change:resolution", onChange);

//     return () => {
//       view.un("change:center", onChange);
//       view.un("change:resolution", onChange);
//       clearTimeout(debounceTimer);
//     };
//   }, [currentProjectionCode, setActiveBackgroundLayer]);
// }

/****** */

//v5 memory leak issue

// import { useEffect } from "react";
// import { toLonLat } from "ol/proj";
// import proj4 from "proj4";
// import { NL_BBOX } from "../utils/geoHelpers";
// import { createBaseLayer } from "../utils/baseLayerFactory";
// import { backgroundLayersConfig } from "../config/backgroundLayersConfig";

// export default function useBackgroundLayer({
//   mapInstance,
//   backgroundLayerRef,
//   currentProjectionCode,
//   setCurrentProjectionCode,
//   activeBackgroundLayer,
//   setActiveBackgroundLayer,
//   zoomThresholdNL = 10, // default zoom threshold for NL
//   dataLayerZIndex = 10, // z-index to keep data layers above background
// }) {
//   // -----------------------------
//   // Update base layer
//   // -----------------------------
//   useEffect(() => {
//     if (!backgroundLayerRef.current || !mapInstance.current) return;

//     const baseLayer = createBaseLayer(
//       currentProjectionCode,
//       activeBackgroundLayer
//     );

//     backgroundLayerRef.current.setSource(baseLayer.getSource());

//     // Keep background always below data layers
//     backgroundLayerRef.current.setZIndex(0);

//     // Adjust z-index of all other layers
//     mapInstance.current.getLayers().forEach((layer) => {
//       if (layer !== backgroundLayerRef.current) {
//         const currentZ = layer.getZIndex();
//         if (!currentZ || currentZ <= 0) layer.setZIndex(dataLayerZIndex);
//       }
//     });
//   }, [
//     activeBackgroundLayer,
//     currentProjectionCode,
//     mapInstance,
//     backgroundLayerRef,
//     dataLayerZIndex,
//   ]);

//   // -----------------------------
//   // Auto EPSG/background switch
//   // -----------------------------
//   useEffect(() => {
//     if (!mapInstance.current) return;
//     const view = mapInstance.current.getView();

//     const handleViewChange = () => {
//       if (!mapInstance.current) return;

//       const centerProj = view.getCenter();
//       const zoom = view.getZoom();
//       const centerLonLat =
//         currentProjectionCode === "EPSG:28992"
//           ? proj4("EPSG:28992", "EPSG:4326", centerProj)
//           : toLonLat(centerProj);

//       const insideNL =
//         centerLonLat[0] >= NL_BBOX[0] &&
//         centerLonLat[0] <= NL_BBOX[2] &&
//         centerLonLat[1] >= NL_BBOX[1] &&
//         centerLonLat[1] <= NL_BBOX[3];

//       if (
//         insideNL &&
//         zoom >= zoomThresholdNL &&
//         currentProjectionCode !== "EPSG:28992"
//       ) {
//         setCurrentProjectionCode("EPSG:28992");
//         setActiveBackgroundLayer("pdok_BRT");
//         return;
//       }

//       if (
//         (!insideNL || zoom < zoomThresholdNL) &&
//         currentProjectionCode !== "EPSG:3857"
//       ) {
//         setCurrentProjectionCode("EPSG:3857");
//         setActiveBackgroundLayer("openstreet");
//       }
//     };

//     let debounceTimer;
//     const onChange = () => {
//       clearTimeout(debounceTimer);
//       debounceTimer = setTimeout(handleViewChange, 200);
//     };

//     view.on("change:center", onChange);
//     view.on("change:resolution", onChange);

//     return () => {
//       view.un("change:center", onChange);
//       view.un("change:resolution", onChange);
//       clearTimeout(debounceTimer);
//     };
//   }, [
//     currentProjectionCode,
//     setActiveBackgroundLayer,
//     setCurrentProjectionCode,
//     zoomThresholdNL,
//   ]);
// }
