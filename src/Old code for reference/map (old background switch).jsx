//v1
// import React, { useEffect, useRef, useState } from "react";
// import "ol/ol.css";
// import Map from "ol/Map";
// import View from "ol/View";
// import TileLayer from "ol/layer/Tile";
// import OSM from "ol/source/OSM";
// import WMTS from "ol/source/WMTS";
// import WMTSTileGrid from "ol/tilegrid/WMTS";
// import TileWMS from "ol/source/TileWMS";
// import { get as getProjection } from "ol/proj";
// import { Vector as VectorLayer } from "ol/layer";
// import { Vector as VectorSource } from "ol/source";
// import GeoJSON from "ol/format/GeoJSON";
// import { Style, Fill, Stroke } from "ol/style";
// import proj4 from "proj4";
// import { register } from "ol/proj/proj4";
// import { ScaleLine, Attribution } from "ol/control";
// import useMeasurementTool from "../hooks/UseMeasurementTools";
// import Measurement from "./MeasurementContainer";

// import SearchBar from "./Searchbar";
// import ZoomControl from "./ZoomControl";
// import Legend from "./Legend";
// import LaagData from "./LaagData";
// import AchtergrondLaag from "./AchtergrondLaagContainer";
// import TransparantieLaagSelect from "./TransparantieLaagContainer";
// import DataLaagSelect from "./DataLaagSelectContainer";
// import DataLabel from "./DataLabelContainer";
// import useMapLayers from "../hooks/UseMapLayers";
// import useBackgroundLayer from "../hooks/UseBackgroundLayer";
// import useHighlightLayer from "../hooks/useHighlightLayer";
// import { createBaseLayer } from "../utils/baseLayerFactory";
// import useMeasurementLayer from "../hooks/useMeasurementLayer";
// import { useDatasetSources } from "../hooks/UseDatasetSources";
// import useDataLayerFetch from "../hooks/UseDataLayerFetch";
// import { useMapClickHandler } from "../hooks/UseMapClickHandler";
// import { DATASET_CONFIG } from "../config/datasetConfig";

// import {
//   registerEPSG28992,
//   createPdokTileGrid28992,
//   createEsriTileGrid3857,
// } from "../utils/projectionsAndTileGrids";
// import { isInsideNL } from "../utils/geoHelpers";
// import { getWmsLegendUrl, getWmtsLegendUrl } from "../utils/legendHelpers";
// import { toProjection } from "../utils/projections";

// import {
//   MapContainer,
//   FloatingSearch,
//   MapStyleContainer,
// } from "../style_components/MapStyle";
// import GlobalStyle from "../style_components/GlobalStyle";

// ----------------------------
// Register projections
// ----------------------------
// registerEPSG28992();
// createPdokTileGrid28992();
// createEsriTileGrid3857();

// ----------------------------
// OLMap Component
// ----------------------------
// export default function OLMap({
//   activePanel,
//   setActivePanel,
//   activeBackgroundLayer,
//   setActiveBackgroundLayer,
// }) {
//   const mapRef = useRef(null);
//   const mapInstance = useRef(null);
//   const backgroundLayerRef = useRef(null);
//   const [currentProjectionCode, setCurrentProjectionCode] =
//     useState("EPSG:3857");

//   const [activeLegendLayers, setActiveLegendLayers] = useState([]);

//   const wmsSourcesRef = useRef({});

//   // Highlight Layer
//   const { highlightLayer, addFeatures, clearFeatures, highlightSource } =
//     useHighlightLayer();

//   const proj3857 = getProjection("EPSG:3857");
//   const proj28992 = getProjection("EPSG:28992");

//   const {
//     dataLayers,
//     flattenedLayers,
//     loading,
//     error,
//     setLayerActive,
//     setLayerOpacity,
//     addMapLayer,
//     selectedFeatureId,
//     setSelectedFeatureId,
//     wmsWmtsLayersRef,
//   } = useMapLayers({
//     projectionCode: currentProjectionCode,
//     olProjection: currentProjectionCode === "EPSG:28992" ? proj28992 : proj3857,
//     highlightSource,
//   });

//   // ----------------------------
//   // Map creation
//   // ----------------------------
//   const createMap = (
//     projCode,
//     centerLonLat,
//     zoom = 15,
//     backgroundId = "openstreet"
//   ) => {
//     if (mapInstance.current) {
//       mapInstance.current.setTarget(null);
//       mapInstance.current = null;
//     }

//     const baseLayer = createBaseLayer(projCode, backgroundId);
//     backgroundLayerRef.current = baseLayer;

//     const center = toProjection(centerLonLat, projCode);

//     const map = new Map({
//       target: mapRef.current,
//       layers: [baseLayer],
//       view: new View({
//         projection: getProjection(projCode),
//         center,
//         zoom,
//       }),
//       controls: [],
//       renderer: "canvas",
//       canvas: { willReadFrequently: true },
//     });
//     mapInstance.current = map;
//     map.addLayer(highlightLayer);
//     map.addLayer(measureLayer);
//     map.addControl(
//       new ScaleLine({ units: "metric", bar: true, steps: 4, text: true })
//     );
//     map.addControl(new Attribution({ collapsible: true }));

//     // ----------------------------
//     // Feature info click handler
//     // ----------------------------
//     //v1
//     map.on("singleclick", async (evt) => {
//       if (!mapInstance.current) return;

//       const view = mapInstance.current.getView();
//       const resolution = view.getResolution();
//       const coordinate = evt.coordinate;
//       let clickedFeature = null;
//       let clickedLayerId = null;

//       async function checkLayer(layer) {
//         if (!layer.active) return null;

//         let geojson = null;

//         if (layer.sourceType === "bag") {
//           const source = wmsSourceRef.current;
//           const url = source?.getFeatureInfoUrl(
//             coordinate,
//             resolution,
//             view.getProjection().getCode(),
//             {
//               INFO_FORMAT: "application/json",
//               QUERY_LAYERS: layer.id,
//               FEATURE_COUNT: 10,
//             }
//           );
//           if (!url) return null;
//           geojson = await fetch(url).then((r) => r.json());
//         } else if (layer.sourceType === "bgt") {
//           geojson = await getBgtWmtsFeatureInfo(coordinate);
//         } else if (layer.sourceType === "kadastrale") {
//           const url = getKadasterFeatureInfoUrl(
//             mapInstance.current,
//             layer.id,
//             coordinate,
//             view.getProjection()
//           );
//           geojson = await fetch(url).then((r) => r.json());
//         } else if (layer.sourceType === "wms") {
//           let source = null;
//           let queryLayerName = layer.id;

//           if (layer.id.startsWith("test_mombasa:")) {
//             source = MombasaSourceRef.current;
//           } else if (layer.id.toLowerCase() === "vihaga") {
//             source = MbaleSourceRef.current;
//             queryLayerName = "vihaga";
//           }

//           if (!source) return null;

//           const projection = view.getProjection().getCode();
//           let infoFormat = "application/json";
//           if (queryLayerName === "vihaga") {
//             infoFormat = "application/json; subtype=geojson";
//           }

//           const url = source.getFeatureInfoUrl(
//             coordinate,
//             resolution,
//             projection,
//             {
//               INFO_FORMAT: infoFormat,
//               QUERY_LAYERS: queryLayerName,
//               FEATURE_COUNT: 10,
//             }
//           );

//           if (!url) return null;

//           try {
//             const res = await fetch(url);
//             const text = await res.text();
//             let geojson;
//             try {
//               geojson = JSON.parse(text);
//             } catch (parseErr) {
//               console.warn(`${layer.id} JSON parse failed`, parseErr);
//               return null;
//             }

//             if (!geojson?.features?.length) return null;

//             const format = new GeoJSON();
//             const features = format.readFeatures(geojson, {
//               featureProjection: view.getProjection(),
//             });
//             if (features.length > 0) return features;
//           } catch (err) {
//             console.warn(`${layer.id} GetFeatureInfo failed`, err);
//             return null;
//           }
//         }

//         if (geojson) {
//           const format = new GeoJSON();
//           const features = format.readFeatures(geojson, {
//             featureProjection: view.getProjection(),
//           });
//           if (features.length > 0) {
//             clickedLayerId = layer.id;
//             return features;
//           }
//         }

//         if (layer.children?.length) {
//           for (const child of layer.children) {
//             const childFeatures = await checkLayer(child);
//             if (childFeatures) return childFeatures;
//           }
//         }

//         return null;
//       }

//       for (const group of dataLayersRef.current) {
//         for (const layer of group.children) {
//           const features = await checkLayer(layer);
//           if (features) {
//             clickedFeature = features[0];
//             clearFeatures();
//             addFeatures(features);
//             setSelectedFeature(clickedFeature.getProperties());
//             setSelectedFeatureId(clickedFeature.getId() || clickedLayerId);
//             setActivePanel("laagdata");
//             break;
//           }
//         }
//         if (clickedFeature) break;
//       }

//       if (!clickedFeature) {
//         clearFeatures();
//         setSelectedFeature(null);
//         setSelectedFeatureId(null);
//       }
//     });
//     //v2
map.on("singleclick", async (evt) => {
  if (!mapInstance.current) return;

  const view = mapInstance.current.getView();
  const resolution = view.getResolution();
  const coordinate = evt.coordinate;
  let clickedFeature = null;
  let clickedLayerId = null;

  async function checkLayer(layer) {
    if (!layer.active) return null;

    let features = null;

    // WMS layers
    if (layer.type === "WMS") {
      const source = wmsWmtsLayersRef.current[layer.id];
      if (!source) return null;

      const url = source.getFeatureInfoUrl(
        coordinate,
        resolution,
        view.getProjection().getCode(),
        {
          INFO_FORMAT: "application/json",
          QUERY_LAYERS: layer.id,
          FEATURE_COUNT: 10,
        }
      );
      if (!url) return null;

      try {
        const res = await fetch(url);
        const json = await res.json();
        if (json?.features?.length > 0) {
          const format = new GeoJSON();
          features = format.readFeatures(json, {
            featureProjection: view.getProjection(),
          });
        }
      } catch (err) {
        console.warn(`${layer.id} GetFeatureInfo failed`, err);
      }
    }

    // WMTS or other types can be handled here if needed
    // if (layer.type === "WMTS") { ... }

    if (features && features.length > 0) {
      clickedLayerId = layer.id;
      return features;
    }

    // Recursively check children
    if (layer.children?.length) {
      for (const child of layer.children) {
        const childFeatures = await checkLayer(child);
        if (childFeatures) return childFeatures;
      }
    }

    return null;
  }

  // Loop through all dataLayers
  for (const group of dataLayers) {
    for (const layer of group.children) {
      const features = await checkLayer(layer);
      if (features) {
        clickedFeature = features[0];
        clearFeatures();
        addFeatures(features);
        setSelectedFeature(clickedFeature.getProperties());
        setSelectedFeatureId(clickedFeature.getId() || clickedLayerId);
        setActivePanel("laagdata");
        break;
      }
    }
    if (clickedFeature) break;
  }

  if (!clickedFeature) {
    clearFeatures();
    setSelectedFeature(null);
    setSelectedFeatureId(null);
  }
});
//     //v2 debug
//     // console.log("[DEBUG] Current WMS sources:", wmsWmtsLayersRef.current);

//     // map.on("singleclick", async (evt) => {
//     //   console.log("[CLICK] Map clicked", evt.coordinate);

//     //   if (!mapInstance.current) {
//     //     console.log("[CLICK] No map instance");
//     //     return;
//     //   }

//     //   const view = mapInstance.current.getView();
//     //   const resolution = view.getResolution();
//     //   const coordinate = evt.coordinate;
//     //   let clickedFeature = null;
//     //   let clickedLayerId = null;

//     //   console.log(
//     //     "[CLICK] Resolution:",
//     //     resolution,
//     //     "Projection:",
//     //     view.getProjection().getCode()
//     //   );

//     //   // ----------------------------
//     //   // Recursive function to check WMS layers
//     //   // ----------------------------
//     //   async function checkLayer(layer) {
//     //     if (!layer.active) return null;

//     //     let features = null;

//     //     if (layer.type === "WMS") {
//     //       // Step 2: Lazy-create WMS source if missing
//     //       if (!wmsWmtsLayersRef.current[layer.id]) {
//     //         const source = new TileWMS({
//     //           url: layer.url,
//     //           params: { LAYERS: layer.wmsLayerName || layer.id, TILED: true },
//     //           serverType: "mapserver",
//     //           crossOrigin: "anonymous",
//     //         });
//     //         wmsWmtsLayersRef.current[layer.id] = source;
//     //         layer.sourceRef = source;
//     //         console.log("[DEBUG] WMS source created for:", layer.id);
//     //       }

//     //       const source = wmsWmtsLayersRef.current[layer.id];
//     //       if (!source) return null;

//     //       // Step 1: Fix QUERY_LAYERS parameter
//     //       const url = source.getFeatureInfoUrl(
//     //         coordinate,
//     //         resolution,
//     //         view.getProjection().getCode(),
//     //         {
//     //           INFO_FORMAT: "application/json",
//     //           QUERY_LAYERS: layer.wmsLayerName || layer.id,
//     //           FEATURE_COUNT: 10,
//     //         }
//     //       );

//     //       console.log("[CHECKLAYER] GetFeatureInfo URL:", url);
//     //       if (!url) return null;

//     //       try {
//     //         // Step 3: Debug fetch
//     //         const res = await fetch(url);
//     //         console.log("[CHECKLAYER] Fetch response status:", res.status);
//     //         const json = await res.json();
//     //         console.log(
//     //           "[CHECKLAYER] JSON features length:",
//     //           json?.features?.length
//     //         );

//     //         if (json?.features?.length > 0) {
//     //           const format = new GeoJSON();
//     //           features = format.readFeatures(json, {
//     //             featureProjection: view.getProjection(),
//     //           });
//     //           console.log("[CHECKLAYER] Parsed features:", features);
//     //         }
//     //       } catch (err) {
//     //         console.warn(
//     //           "[CHECKLAYER] GetFeatureInfo failed for",
//     //           layer.id,
//     //           err
//     //         );
//     //       }
//     //     }

//     //     if (features && features.length > 0) {
//     //       clickedLayerId = layer.id;
//     //       return features;
//     //     }

//     //     if (layer.children?.length) {
//     //       for (const child of layer.children) {
//     //         const childFeatures = await checkLayer(child);
//     //         if (childFeatures) return childFeatures;
//     //       }
//     //     }

//     //     return null;
//     //   }

//     //   // ----------------------------
//     //   // Step 4: Iterate over groups/layers and handle selection
//     //   // ----------------------------
//     //   for (const group of dataLayers) {
//     //     for (const layer of group.children) {
//     //       const features = await checkLayer(layer);
//     //       if (features) {
//     //         clickedFeature = features[0];
//     //         clearFeatures();
//     //         addFeatures(features);
//     //         setSelectedFeature(clickedFeature.getProperties());
//     //         setSelectedFeatureId(clickedFeature.getId() || clickedLayerId);
//     //         setActivePanel("laagdata");
//     //         break;
//     //       }
//     //     }
//     //     if (clickedFeature) break;
//     //   }

//     //   if (!clickedFeature) {
//     //     clearFeatures();
//     //     setSelectedFeature(null);
//     //     setSelectedFeatureId(null);
//     //     console.log("[CLICK] No features found");
//     //   }
//     // });
//   };

//   useBackgroundLayer({
//     mapInstance,
//     backgroundLayerRef,
//     currentProjectionCode,
//     setCurrentProjectionCode,
//     activeBackgroundLayer,
//     setActiveBackgroundLayer,
//     createMap,
//   });

//   const dataLayersRef = useRef([]);
//   useEffect(() => {
//     dataLayersRef.current = dataLayers;
//   }, [dataLayers]);

//   const [selectedFeature, setSelectedFeature] = useState(null);

//   // useMapClickHandler({
//   //   mapInstance,
//   //   dataLayers,
//   //   wmsWmtsLayersRef,
//   //   setSelectedFeature,
//   //   setSelectedFeatureId,
//   //   setActivePanel,
//   //   clearFeatures,
//   //   addFeatures,
//   // });

//   // useEffect(() => {
//   //   const sources = {};
//   //   for (const [key, cfg] of Object.entries(DATASET_CONFIG)) {
//   //     if (cfg.type === "WMS") {
//   //       sources[key] = new TileWMS({
//   //         url: cfg.url,
//   //         params: cfg.params,
//   //         serverType: "mapserver",
//   //         crossOrigin: "anonymous",
//   //       });
//   //     }
//   //   }
//   //   wmsSourcesRef.current = sources;
//   // }, []);

//   // ----------------------------
//   // WMS / WMTS sources
//   // ----------------------------
//   const wmsSourceRef = useRef(
//     new TileWMS({
//       url: "https://service.pdok.nl/lv/bag/wms/v2_0",
//       params: {
//         LAYERS: "pand,verblijfsobject,ligplaats,standplaats,woonplaats",
//         TILED: true,
//       },
//       serverType: "mapserver",
//       crossOrigin: "anonymous",
//     })
//   );

//   const bgtWmsSourceRef = useRef(
//     new WMTS({
//       url: "https://service.pdok.nl/lv/bgt/wmts/v1_0?",
//       layer: "bgt",
//       matrixSet: "EPSG:28992",
//       format: "image/png",
//       tileGrid: createPdokTileGrid28992(),
//       style: "default",
//       crossOrigin: "anonymous",
//     })
//   );

//   const kadastraleSourceRef = useRef(
//     new TileWMS({
//       url: "https://service.pdok.nl/kadaster/kadastralekaart/wms/v5_0",
//       params: { TILED: true },
//       serverType: "mapserver",
//       crossOrigin: "anonymous",
//     })
//   );

//   const MombasaSourceRef = useRef(
//     new TileWMS({
//       url: "https://services.digireg.com/wms/test/mombasa/ows?",
//       params: {
//         LAYERS:
//           "test_mombasa:Barriers,test_mombasa:Bridges,test_mombasa:Buildings,test_mombasa:Civil Engineering Structures,test_mombasa:Greenery,test_mombasa:Open Terrain,test_mombasa:Other Structures,test_mombasa:Roads and Paths,test_mombasa:Roadside,test_mombasa:Shore,test_mombasa:Water",
//         TILED: true,
//         FORMAT: "image/png",
//       },
//       serverType: "mapserver",
//       crossOrigin: "anonymous",
//     })
//   );

//   const MbaleSourceRef = useRef(
//     new TileWMS({
//       url: "https://services.digireg.com/mapserver/mbale",
//       params: {
//         LAYERS: "vihaga",
//         TILED: true,
//         TRANSPARENT: true,
//       },
//       serverType: "mapserver",
//       crossOrigin: "anonymous",
//     })
//   );

//   // ----------------------------
//   // BGT WMTS GetFeatureInfo
//   // ----------------------------
//   const getBgtWmtsFeatureInfo = async (coordinate) => {
//     if (!mapInstance.current) return null;

//     const view = mapInstance.current.getView();
//     const resolution = view.getResolution();
//     const source = bgtWmsSourceRef.current;
//     if (!source) return null;

//     const tileGrid = source.getTileGrid();
//     if (!tileGrid) return null;

//     const tileCoord = tileGrid.getTileCoordForCoordAndResolution(
//       coordinate,
//       resolution
//     );
//     if (!tileCoord) return null;

//     const tileMatrix = tileGrid.getMatrixId(tileCoord[0]);
//     const tileCol = tileCoord[1];
//     const tileRow = tileCoord[2];

//     const pixel = mapInstance.current.getPixelFromCoordinate(coordinate);
//     const tileExtent = tileGrid.getTileCoordExtent(tileCoord);
//     const tileSize = source.getTilePixelSize(tileMatrix);

//     const I = Math.floor(
//       ((coordinate[0] - tileExtent[0]) / (tileExtent[2] - tileExtent[0])) *
//         tileSize[0]
//     );
//     const J = Math.floor(
//       ((tileExtent[3] - coordinate[1]) / (tileExtent[3] - tileExtent[1])) *
//         tileSize[1]
//     );

//     const matrixSet = source.getMatrixSet();
//     const baseUrl =
//       "https://service.pdok.nl/lv/bgt/wmts/v1_0/achtergrondvisualisatie";
//     const url = `${baseUrl}/${matrixSet}/${tileMatrix}/${tileCol}/${tileRow}/${I}/${J}.json`;

//     try {
//       const res = await fetch(url);
//       if (!res.ok) throw new Error(`HTTP ${res.status}`);
//       return await res.json();
//     } catch (err) {
//       console.warn("WMTS BGT GetFeatureInfo fetch error", err);
//       return null;
//     }
//   };

//   // ----------------------------
//   // Initial map setup
//   // ----------------------------
//   useEffect(() => {
//     const vihigaCenter = [(34.708 + 34.7368) / 2, (0.0722392 + 0.102843) / 2];

//     createMap(
//       "EPSG:3857",
//       vihigaCenter,
//       18,
//       activeBackgroundLayer || "openstreet"
//     );

//     setCurrentProjectionCode("EPSG:3857");
//   }, []);

//   // ----------------------------
//   // Search handler
//   // ----------------------------
//   const handleSearchResult = (coordsLonLat) => {
//     if (!mapInstance.current) return;
//     const targetCoords = toProjection(coordsLonLat, currentProjectionCode);
//     const view = mapInstance.current.getView();
//     view.animate(
//       { center: targetCoords, zoom: 14, duration: 1000 },
//       { zoom: 18, duration: 800 }
//     );
//   };

//   // ------------------------------
//   // Measurement
//   // -----------------------------
//   const measureLayer = useMeasurementLayer(); // or via your UseMeasurement hook
//   const { activeTool, handleSelectTool, stopMeasurement, clearMeasurements } =
//     useMeasurementTool(mapInstance.current, measureLayer);

//   // ----------------------------
//   // Render
//   // ----------------------------
//   return (
//     <MapContainer>
//       <GlobalStyle />
//       <FloatingSearch>
//         <SearchBar onSearchResult={handleSearchResult} />
//       </FloatingSearch>

//       <ZoomControl mapRef={mapInstance} />
//       <MapStyleContainer ref={mapRef} />

//       <AchtergrondLaag
//         isOpen={activePanel === "achtergrond"}
//         setActivePanel={setActivePanel}
//         activeBackgroundLayer={activeBackgroundLayer}
//         setActiveBackgroundLayer={setActiveBackgroundLayer}
//       />

//       <TransparantieLaagSelect
//         isOpen={activePanel === "transparantie"}
//         setActivePanel={setActivePanel}
//         dataLayers={dataLayers}
//         setLayerOpacity={setLayerOpacity}
//       />

//       <DataLaagSelect
//         isOpen={activePanel === "lagen"}
//         setActivePanel={setActivePanel}
//         dataLayers={dataLayers}
//         setLayerActive={setLayerActive}
//         mapRef={mapInstance}
//         wmsWmtsLayersRef={wmsWmtsLayersRef}
//         currentProjectionCode={currentProjectionCode}
//       />

//       <LaagData
//         isOpen={activePanel === "laagdata"}
//         setActivePanel={setActivePanel}
//         selectedFeature={selectedFeature}
//       />

//       <Measurement
//         isOpen={activePanel === "metingen"}
//         setActivePanel={setActivePanel}
//         onSelectTool={handleSelectTool}
//       />

//       <DataLabel dataLayers={dataLayers} />
//       <Legend activeLayers={activeLegendLayers} />
//     </MapContainer>
//   );
// }
