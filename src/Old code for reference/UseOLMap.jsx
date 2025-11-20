// // src/hooks/useOLMap.jsx
// import { useEffect, useRef, useState, useCallback } from "react";
// import Map from "ol/Map";
// import View from "ol/View";
// import { Tile as TileLayer, Vector as VectorLayer } from "ol/layer";
// import { OSM, TileWMS, XYZ, Vector as VectorSource } from "ol/source";
// import { fromLonLat, transform } from "ol/proj";
// import { defaults as defaultControls } from "ol/control";
// import { defaults as defaultInteractions } from "ol/interaction";

// import { backgroundLayersConfig } from "../config/backgroundLayersConfig";
// import { initDatasets } from "../utils/initDatasets";
// import { addMapLayer } from "../utils/addMapLayer";
// import { zoomToLayer } from "../utils/zoomToLayer";
// import { handleLayerActive } from "../utils/handleLayerActive";
// import { updateLayerOpacity } from "../utils/updateLayerOpacity";

// export default function useOLMap({
//   activeBackgroundLayer,
//   setActiveBackgroundLayer,
//   setActivePanel,
// }) {
//   const mapRef = useRef(null);
//   const [mapInstance, setMapInstance] = useState(null);
//   const [dataLayers, setDataLayers] = useState([]);
//   const wmsWmtsLayersRef = useRef({});
//   const [selectedFeature, setSelectedFeature] = useState(null);
//   const [selectedFeatureId, setSelectedFeatureId] = useState(null);
//   const [currentProjectionCode, setCurrentProjectionCode] =
//     useState("EPSG:3857");
//   const [activeLegendLayers, setActiveLegendLayers] = useState([]);
//   const [measureLayer, setMeasureLayer] = useState(null);

//   // Initialize map
//   // useEffect(() => {
//   //   if (!mapRef.current) return;

//   //   const view = new View({
//   //     center: fromLonLat([4.3, 52.1]), // default NL center
//   //     zoom: 8,
//   //     projection: currentProjectionCode,
//   //   });

//   //   const map = new Map({
//   //     target: mapRef.current,
//   //     layers: [
//   //       new TileLayer({ source: new OSM() }), // default base
//   //     ],
//   //     view,
//   //     controls: defaultControls(),
//   //     interactions: defaultInteractions(),
//   //   });

//   //   setMapInstance(map);

//   //   // Initialize background layers
//   //   Object.entries(backgroundLayersConfig).forEach(([id, cfg]) => {
//   //     const layer = new TileLayer({
//   //       source: cfg.source === "OSM" ? new OSM() : new XYZ(cfg.options),
//   //       visible: activeBackgroundLayer === id,
//   //     });
//   //     map.addLayer(layer);
//   //     wmsWmtsLayersRef.current[id] = layer;
//   //   });

//   //   // Initialize data layers from dataset config
//   //   initDatasets(map, setDataLayers, wmsWmtsLayersRef);
//   // }, [mapRef]);

//   // Background layer switching
//   useEffect(() => {
//     if (!mapInstance) return;
//     Object.entries(wmsWmtsLayersRef.current).forEach(([id, layer]) => {
//       layer.setVisible(id === activeBackgroundLayer);
//     });
//   }, [activeBackgroundLayer, mapInstance]);

//   // Click handling for feature info
//   const handleMapClick = useCallback(
//     (evt) => {
//       if (!mapInstance) return;

//       mapInstance.forEachLayerAtPixel(evt.pixel, (layer, pixel) => {
//         if (layer.get("type") === "data") {
//           const features = layer.getSource().getFeaturesAtPixel(evt.pixel);
//           if (features && features.length > 0) {
//             setSelectedFeature(features[0].getProperties());
//             setSelectedFeatureId(features[0].getId());
//           } else {
//             setSelectedFeature(null);
//             setSelectedFeatureId(null);
//           }
//         }
//       });
//     },
//     [mapInstance]
//   );

//   // Attach map click listener
//   useEffect(() => {
//     if (!mapInstance) return;
//     mapInstance.on("click", handleMapClick);
//     return () => mapInstance.un("click", handleMapClick);
//   }, [mapInstance, handleMapClick]);

//   // Layer toggling
//   const setLayerActive = useCallback(
//     (layerId, active) => {
//       handleLayerActive(layerId, active, dataLayers, setDataLayers);
//     },
//     [dataLayers]
//   );

//   // Opacity update
//   const setLayerOpacity = useCallback(
//     (layerId, opacity) => {
//       updateLayerOpacity(layerId, opacity, dataLayers, setDataLayers);
//     },
//     [dataLayers]
//   );

//   // Search / Zoom handling
//   const handleSearchResult = useCallback(
//     (coords) => {
//       if (!mapInstance) return;
//       const [lon, lat] = coords;
//       mapInstance.getView().animate({
//         center: fromLonLat([lon, lat]),
//         zoom: 15,
//         duration: 500,
//       });
//     },
//     [mapInstance]
//   );

//   // Measurement controls placeholder
//   const measurementControls = {
//     handleSelectTool: (tool) => {
//       console.log("Selected measurement tool:", tool);
//     },
//   };

//   return {
//     mapRef,
//     mapInstance,
//     dataLayers,
//     setLayerActive,
//     setLayerOpacity,
//     wmsWmtsLayersRef,
//     selectedFeature,
//     setSelectedFeature,
//     selectedFeatureId,
//     setSelectedFeatureId,
//     currentProjectionCode,
//     handleSearchResult,
//     measureLayer,
//     measurementControls,
//     activeLegendLayers,
//   };
// }
