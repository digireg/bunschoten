// import React, { useEffect, useRef, useState } from "react";
// import "ol/ol.css";
// import Map from "ol/Map";
// import View from "ol/View";
// import TileLayer from "ol/layer/Tile";
// import OSM from "ol/source/OSM";
// import WMTS from "ol/source/WMTS";
// import WMTSTileGrid from "ol/tilegrid/WMTS";
// import TileWMS from "ol/source/TileWMS";
// import { fromLonLat, toLonLat, get as getProjection } from "ol/proj";
// import { Vector as VectorLayer } from "ol/layer";
// import { Vector as VectorSource } from "ol/source";
// import GeoJSON from "ol/format/GeoJSON";
// import { Style, Fill, Stroke, Text } from "ol/style";
// import proj4 from "proj4";
// import { register } from "ol/proj/proj4";
// import { ScaleLine, Attribution } from "ol/control";
// import useMeasurementTool from "./MeasurementTools";
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

// import {
//   MapContainer,
//   FloatingSearch,
//   MapStyleContainer,
// } from "../style_components/MapStyle";
// import GlobalStyle from "../style_components/GlobalStyle";

// // ----------------------------
// // Register EPSG:28992
// // ----------------------------
// proj4.defs(
//   "EPSG:28992",
//   "+proj=sterea +lat_0=52.15616055555555 +lon_0=5.38763888888889 " +
//     "+k=0.9999079 +x_0=155000 +y_0=463000 +ellps=bessel " +
//     "+units=m +no_defs"
// );
// register(proj4);

// // ----------------------------
// // NL bounding box in WGS84
// // ----------------------------
// const NL_BBOX = [3.35, 50.75, 7.23, 53.68];

// // ----------------------------
// // TileGrids
// // ----------------------------
// const pdokMatrixIds28992 = Array.from({ length: 16 }, (_, i) => i.toString());
// const pdokResolutions28992 = [
//   3440.64, 1720.32, 860.16, 430.08, 215.04, 107.52, 53.76, 26.88, 13.44, 6.72,
//   3.36, 1.68, 0.84, 0.42, 0.21, 0.105,
// ];
// const pdokOrigin28992 = [-285401.92, 903401.92];
// const createPdokTileGrid28992 = () =>
//   new WMTSTileGrid({
//     origin: pdokOrigin28992,
//     resolutions: pdokResolutions28992,
//     matrixIds: pdokMatrixIds28992,
//   });

// const esriMatrixIds3857 = [];
// const esriResolutions3857 = [];
// for (let z = 0; z <= 19; z++) {
//   esriMatrixIds3857.push(z.toString());
//   esriResolutions3857.push(156543.03392804097 / Math.pow(2, z));
// }
// const esriOrigin3857 = [-20037508.342789244, 20037508.342789244];
// const createEsriTileGrid3857 = () =>
//   new WMTSTileGrid({
//     origin: esriOrigin3857,
//     resolutions: esriResolutions3857,
//     matrixIds: esriMatrixIds3857,
//   });

// const highlightSource = new VectorSource();
// const highlightLayer = new VectorLayer({
//   source: highlightSource,
//   style: new Style({
//     stroke: new Stroke({ color: "#284F97", width: 2 }),
//     fill: new Fill({ color: "#e3e9f5" }),
//   }),
//   zIndex: 999,
// });

// // ----------------------------
// // Base layer factory
// // ----------------------------
// function createBaseLayer(projectionCode, backgroundId) {
//   const proj3857 = getProjection("EPSG:3857");
//   const proj28992 = getProjection("EPSG:28992");

//   // NL backgrounds
//   if (projectionCode === "EPSG:28992") {
//     switch (backgroundId) {
//       case "pdok_BRT":
//         return new TileLayer({
//           source: new WMTS({
//             url: "https://service.pdok.nl/brt/achtergrondkaart/wmts/v2_0/{Layer}/{TileMatrixSet}/{TileMatrix}/{TileCol}/{TileRow}.png",
//             layer: "standaard",
//             matrixSet: "EPSG:28992",
//             format: "image/png",
//             projection: proj28992,
//             tileGrid: createPdokTileGrid28992(),
//             style: "default",
//             attributions: "© PDOK BRT Achtergrondkaart",
//             crossOrigin: "anonymous",
//             requestEncoding: "REST",
//           }),
//           zIndex: 0,
//           preload: Infinity,
//         });
//       case "pdok_luchtfoto":
//         return new TileLayer({
//           source: new WMTS({
//             url: "https://service.pdok.nl/hwh/luchtfotorgb/wmts/v1_0/",
//             layer: "Actueel_ortho25",
//             matrixSet: "EPSG:28992",
//             format: "image/png",
//             projection: proj28992,
//             tileGrid: createPdokTileGrid28992(),
//             style: "default",
//             attributions: "© PDOK",
//             crossOrigin: "anonymous",
//           }),
//           zIndex: 0,
//           preload: Infinity,
//         });
//       default:
//         return new TileLayer({
//           source: new OSM(),
//           zIndex: 0,
//           preload: Infinity,
//         });
//     }
//   }

//   // World backgrounds (EPSG:3857)
//   if (projectionCode === "EPSG:3857") {
//     switch (backgroundId) {
//       case "esri":
//         return new TileLayer({
//           source: new WMTS({
//             url: "https://services.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/WMTS/",
//             layer: "World_Imagery",
//             matrixSet: "EPSG:3857",
//             format: "image/png",
//             projection: proj3857,
//             tileGrid: createEsriTileGrid3857(),
//             style: "default",
//             attributions: "© Esri",
//             crossOrigin: "anonymous",
//           }),
//           zIndex: 0,
//           preload: Infinity,
//         });

//       case "mombasa":
//         return new TileLayer({
//           source: new TileWMS({
//             url: "https://services.digireg.com/wms/test/mombasa-ortho/ows?",
//             params: {
//               LAYERS: "ortho:mombasa2019",
//               FORMAT: "image/png",
//               TILED: true,
//               CRS: "EPSG:4326",
//             },
//             serverType: "mapserver",
//             version: "1.3.0", // ensure correct WMS version
//             crossOrigin: "anonymous",
//           }),
//           zIndex: 0,
//         });

//       default:
//         return new TileLayer({
//           source: new OSM(),
//           zIndex: 0,
//           preload: Infinity,
//         });
//     }
//   }

//   // fallback (just in case)
//   return new TileLayer({ source: new OSM(), zIndex: 0, preload: Infinity });
// }

// // ----------------------------
// // Inside NL check
// // ----------------------------
// const isInsideNL = (lonLat) => {
//   const [lon, lat] = lonLat;
//   return (
//     lon >= NL_BBOX[0] &&
//     lon <= NL_BBOX[2] &&
//     lat >= NL_BBOX[1] &&
//     lat <= NL_BBOX[3]
//   );
// };

// // ----------------------------
// // WMS Legend URL
// // ----------------------------
// function getWmsLegendUrl(layer) {
//   if (!layer.url || !layer.id) return null;

//   const params = new URLSearchParams({
//     SERVICE: "WMS",
//     REQUEST: "GetLegendGraphic",
//     FORMAT: "image/png",
//     LAYER: layer.id,
//     VERSION: "1.3.0",
//     STYLE: "",
//   });

//   return `${layer.url}?${params.toString()}`;
// }

// // ----------------------------
// // WMTS Legend URL (async)
// // ----------------------------
// async function getWmtsLegendUrl(layer) {
//   if (!layer.url || !layer.layerName) return null;

//   const getCapabilitiesUrl =
//     layer.url.replace(/\?.*$/, "") + "?SERVICE=WMTS&REQUEST=GetCapabilities";
//   try {
//     const res = await fetch(getCapabilitiesUrl);
//     const xmlText = await res.text();
//     const parser = new DOMParser();
//     const xml = parser.parseFromString(xmlText, "application/xml");

//     const layerElements = xml.querySelectorAll(
//       "Layer[ows\\:Identifier], Layer Identifier"
//     );
//     for (let l of layerElements) {
//       const identifier = l.querySelector(
//         "ows\\:Identifier, Identifier"
//       )?.textContent;
//       if (identifier === layer.layerName) {
//         const legendUrl =
//           l
//             .querySelector("LegendURL OnlineResource")
//             ?.getAttribute("xlink:href") ||
//           l.querySelector("LegendURL OnlineResource")?.getAttribute("href");
//         return legendUrl || null;
//       }
//     }
//   } catch (err) {
//     console.warn("Failed to fetch WMTS legend URL:", err);
//     return null;
//   }

//   return null;
// }

// // ----------------------------
// // OLMap Component
// // ----------------------------
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

//   const [activeLegendLayers, setActiveLegendLayers] = useState([]); // <-- new state

//   const proj3857 = getProjection("EPSG:3857");
//   const proj28992 = getProjection("EPSG:28992");

//   const {
//     dataLayers,
//     setDataLayers,
//     setLayerActive,
//     setLayerOpacity,
//     selectedFeatureId,
//     setSelectedFeatureId,
//     wmsWmtsLayersRef,
//   } = useMapLayers({
//     projectionCode: currentProjectionCode,
//     olProjection: currentProjectionCode === "EPSG:28992" ? proj28992 : proj3857,
//     highlightSource,
//   });

//   const dataLayersRef = useRef([]);
//   useEffect(() => {
//     dataLayersRef.current = dataLayers;
//   }, [dataLayers]);

//   const [selectedFeature, setSelectedFeature] = useState(null);

//   // ----------------------------
//   // BAG WMS source
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

//   // ----------------------------
//   // BGT WMTS source
//   // ----------------------------
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

//   // ----------------------------
//   // Kadaster Kaart source
//   // ----------------------------

//   const kadastraleSourceRef = useRef(
//     new TileWMS({
//       url: "https://service.pdok.nl/kadaster/kadastralekaart/wms/v5_0",
//       params: { TILED: true },
//       serverType: "mapserver",
//       crossOrigin: "anonymous",
//     })
//   );

//   // ----------------------------
//   // Mombasa source
//   // ----------------------------

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

//   // ----------------------------
//   // Mbale source
//   // ----------------------------

//   const MbaleSourceRef = useRef(
//     new TileWMS({
//       url: "https://services.digireg.com/mapserver/mbale",
//       params: {
//         LAYERS: "vihaga", // MapServer layer name (check case sensitivity!)
//         TILED: true,
//         TRANSPARENT: true,
//       },
//       serverType: "mapserver",
//       crossOrigin: "anonymous",
//     })
//   );

//   // ----------------------------
//   // WMTS GetFeatureInfo helper for BGT
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

//     const center =
//       projCode === "EPSG:28992"
//         ? proj4("EPSG:4326", "EPSG:28992", centerLonLat)
//         : fromLonLat(centerLonLat);

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

//     map.addControl(
//       new ScaleLine({ units: "metric", bar: true, steps: 4, text: true })
//     );
//     map.addControl(new Attribution({ collapsible: true }));

//     // ----------------------------
//     // Helper: fetch feature info safely
//     // ----------------------------
//     async function fetchFeatureInfo(
//       source,
//       coordinate,
//       resolution,
//       projectionCode,
//       layerId
//     ) {
//       if (!source) return null;

//       // Build the URL
//       const url = source.getFeatureInfoUrl(
//         coordinate,
//         resolution,
//         projectionCode,
//         {
//           INFO_FORMAT: "application/json",
//           QUERY_LAYERS: layerId,
//           FEATURE_COUNT: 10,
//         }
//       );

//       if (!url) return null;

//       try {
//         const res = await fetch(url);
//         if (!res.ok) return null;

//         const contentType = res.headers.get("Content-Type") || "";
//         if (contentType.includes("application/json")) {
//           const geojson = await res.json();
//           if (!geojson?.features?.length) return null;

//           const format = new GeoJSON();
//           return format.readFeatures(geojson, {
//             featureProjection: mapInstance.current.getView().getProjection(),
//           });
//         } else if (contentType.includes("image")) {
//           console.warn(`${layerId} returned image instead of JSON`);
//           return null;
//         } else {
//           console.warn(`${layerId} unknown response type:`, contentType);
//           return null;
//         }
//       } catch (err) {
//         console.warn(`${layerId} GetFeatureInfo failed`, err);
//         return null;
//       }
//     }

//     // Click handler
//     // ----------------------------

//     function getKadasterFeatureInfoUrl(map, layerId, coordinate, projection) {
//       const view = map.getView();
//       const size = map.getSize();
//       const url = new URL(
//         "https://service.pdok.nl/kadaster/kadastralekaart/wms/v5_0"
//       );

//       url.searchParams.set("SERVICE", "WMS");
//       url.searchParams.set("VERSION", "1.3.0");
//       url.searchParams.set("REQUEST", "GetFeatureInfo");
//       url.searchParams.set("LAYERS", layerId);
//       url.searchParams.set("QUERY_LAYERS", layerId);
//       url.searchParams.set("INFO_FORMAT", "application/json"); // <-- JSON supported
//       url.searchParams.set("CRS", projection.getCode());

//       // BBOX and size
//       const extent = view.calculateExtent(size);
//       url.searchParams.set("BBOX", extent.join(","));
//       url.searchParams.set("WIDTH", size[0]);
//       url.searchParams.set("HEIGHT", size[1]);

//       // Convert map coordinate to pixel
//       const [i, j] = map.getPixelFromCoordinate(coordinate);
//       url.searchParams.set("I", Math.round(i));
//       url.searchParams.set("J", Math.round(j));

//       return url.toString();
//     }

//     map.on("singleclick", async (evt) => {
//       if (!mapInstance.current) return;

//       const view = mapInstance.current.getView();
//       const resolution = view.getResolution();
//       const coordinate = evt.coordinate;
//       let clickedFeature = null;
//       let clickedLayerId = null;

//       async function checkLayer(layer) {
//         console.log("Layer ID being checked:", layer.id);

//         // console.log(
//         //   "Checking layer:",
//         //   layer.id,
//         //   "active:",
//         //   layer.active,
//         //   "sourceType:",
//         //   layer.sourceType
//         // );
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
//           // <-- Use helper instead of missing source
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
//             queryLayerName = "vihaga"; // force correct lowercase for server
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

//           console.log(`${layer.id} GetFeatureInfo URL:`, url);

//           if (!url) return null;

//           try {
//             const res = await fetch(url);

//             // Always read as text, regardless of MIME type
//             const text = await res.text();
//             console.log(`${layer.id} raw response:`, text);

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
//               featureProjection: mapInstance.current.getView().getProjection(),
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
//             highlightSource.clear();
//             highlightSource.addFeatures(features);
//             setSelectedFeature(clickedFeature.getProperties());
//             setSelectedFeatureId(clickedFeature.getId() || clickedLayerId);
//             setActivePanel("laagdata");
//             break;
//           }
//         }
//         if (clickedFeature) break;
//       }

//       if (!clickedFeature) {
//         highlightSource.clear();
//         setSelectedFeature(null);
//         setSelectedFeatureId(null);
//       }
//     });

//     mapInstance.current = map;
//     map.addLayer(highlightLayer);
//     map.addLayer(measureLayer);
//   };

//   // ----------------------------
//   // Initial map setup
//   // ----------------------------
//   useEffect(() => {
//     // Calculate center from Vihiga bounding box
//     const vihigaCenter = [
//       (34.708 + 34.7368) / 2, // longitude
//       (0.0722392 + 0.102843) / 2, // latitude
//     ];

//     createMap(
//       "EPSG:3857",
//       vihigaCenter,
//       18, // adjust zoom as needed for area
//       activeBackgroundLayer || "openstreet"
//     );

//     setCurrentProjectionCode("EPSG:3857");
//   }, []);

//   // ----------------------------
//   // Background switching on zoom/center
//   // ----------------------------
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

//       const insideNL = isInsideNL(centerLonLat);
//       const zoomThreshold = 10;

//       if (
//         insideNL &&
//         zoom >= zoomThreshold &&
//         currentProjectionCode !== "EPSG:28992"
//       ) {
//         setActiveBackgroundLayer("pdok_BRT");
//         createMap("EPSG:28992", centerLonLat, zoom, "pdok_BRT");
//         setCurrentProjectionCode("EPSG:28992");
//         return;
//       }

//       if (
//         (!insideNL || zoom < zoomThreshold) &&
//         currentProjectionCode !== "EPSG:3857"
//       ) {
//         setActiveBackgroundLayer("openstreet");
//         createMap("EPSG:3857", centerLonLat, zoom, "openstreet");
//         setCurrentProjectionCode("EPSG:3857");
//       }
//     };

//     let debounceTimer;
//     const onChangeCenter = () => {
//       clearTimeout(debounceTimer);
//       debounceTimer = setTimeout(handleViewChange, 300);
//     };
//     const onChangeResolution = () => {
//       clearTimeout(debounceTimer);
//       debounceTimer = setTimeout(handleViewChange, 300);
//     };

//     view.on("change:center", onChangeCenter);
//     view.on("change:resolution", onChangeResolution);

//     return () => {
//       view.un("change:center", onChangeCenter);
//       view.un("change:resolution", onChangeResolution);
//       clearTimeout(debounceTimer);
//     };
//   }, [currentProjectionCode, activeBackgroundLayer, setActiveBackgroundLayer]);

//   // ----------------------------
//   // Update background source
//   // ----------------------------
//   useEffect(() => {
//     if (!backgroundLayerRef.current) return;
//     const baseLayer = createBaseLayer(
//       currentProjectionCode,
//       activeBackgroundLayer
//     );
//     backgroundLayerRef.current.setSource(baseLayer.getSource());
//     backgroundLayerRef.current.setZIndex(0);
//   }, [activeBackgroundLayer, currentProjectionCode]);

//   // ----------------------------
//   // Hardcoded legend mapping
//   // ----------------------------
//   const LEGEND_URLS = {
//     // // BAG WMS layers
//     // pand: "https://service.pdok.nl/lv/bag/wms/v2_0/legend/pand/bag:pand.png",
//     // ligplaats:
//     //   "https://service.pdok.nl/lv/bag/wms/v2_0/legend/ligplaats/bag:ligplaats.png",
//     // standplaats:
//     //   "https://service.pdok.nl/lv/bag/wms/v2_0/legend/standplaats/bag:standplaats.png",
//     // verblijfsobject:
//     //   "https://service.pdok.nl/lv/bag/wms/v2_0/legend/verblijfsobject/bag:verblijfsobject.png",
//     // woonplaats:
//     //   "https://service.pdok.nl/lv/bag/wms/v2_0/legend/woonplaats/bag:woonplaats.png",

//     // // BGT WMTS layers
//     // standaardvisualisatie:
//     //   "https://service.pdok.nl/lv/bgt/wmts/v1_0/standaardvisualisatie/legend.png",
//     // achtergrondvisualisatie:
//     //   "https://service.pdok.nl/lv/bgt/wmts/v1_0/achtergrondvisualisatie/legend.png",
//     // icoonvisualisatie:
//     //   "https://service.pdok.nl/lv/bgt/wmts/v1_0/icoonvisualisatie/legend.png",
//     // omtrekgerichtevisualisatie:
//     //   "https://service.pdok.nl/lv/bgt/wmts/v1_0/omtrekgerichtevisualisatie/legend.png",
//     // pastelvisualisatie:
//     //   "https://service.pdok.nl/lv/bgt/wmts/v1_0/pastelvisualisatie/legend.png",
//     // planvisualisatie:
//     //   "https://service.pdok.nl/lv/bgt/wmts/v1_0/planvisualisatie/legend.png",

//     // // Kadastrale Kaart WMS layers
//     // KadastraleKaartv5:
//     //   "https://service.pdok.nl/kadaster/kadastralekaart/wms/v5_0/legend/Kadastralekaart/standaard.png",
//     // Bebouwing:
//     //   "https://service.pdok.nl/kadaster/kadastralekaart/wms/v5_0/legend/Bebouwing.png",
//     // Bebouwingvlak:
//     //   "https://service.pdok.nl/kadaster/kadastralekaart/wms/v5_0/legend/Bebouwingvlak.png",
//     // Nummeraanduidingreeks:
//     //   "https://service.pdok.nl/kadaster/kadastralekaart/wms/v5_0/legend/Nummeraanduidingreeks.png",
//     // OpenbareRuimteNaam:
//     //   "https://service.pdok.nl/kadaster/kadastralekaart/wms/v5_0/legend/OpenbareRuimteNaam.png",
//     // Perceel:
//     //   "https://service.pdok.nl/kadaster/kadastralekaart/wms/v5_0/legend/Perceel.png",
//     // Perceelvlak:
//     //   "https://service.pdok.nl/kadaster/kadastralekaart/wms/v5_0/legend/Perceelvlak.png",
//     // Label:
//     //   "https://service.pdok.nl/kadaster/kadastralekaart/wms/v5_0/legend/Label.png",
//     // Bijpijling:
//     //   "https://service.pdok.nl/kadaster/kadastralekaart/wms/v5_0/legend/Bijpijling.png",
//     // KadastraleGrens:
//     //   "https://service.pdok.nl/kadaster/kadastralekaart/wms/v5_0/legend/KadastraleGrens.png",

//     //Mombasa
//     MombasaData:
//       "https://services.digireg.com/wms/test/mombasa/ows?service=WMS&version=1.3.0&request=GetLegendGraphic&format=image%2Fpng&width=20&height=20&layer=test_mombasa%3ARoads%20and%20Paths",

//     vihaga:
//       "https://services.digireg.com/mapserver/mbale?version=1.3.0&service=WMS&request=GetLegendGraphic&sld_version=1.1.0&layer=vihaga&format=image/png&STYLE=default",
//   };

//   // ----------------------------
//   // Update Legend URLs dynamically (hardcoded)
//   // ----------------------------
//   useEffect(() => {
//     // Start with all non-Mombasa active layers

//     let updatedLayers = dataLayers
//       .flatMap((group) => group.children)
//       .filter((l) => l.active && !l.id.startsWith("test_mombasa:"))
//       .map((l) => ({
//         ...l,
//         legendUrl: LEGEND_URLS[l.id] || LEGEND_URLS[l.layerName] || null,
//       }));

//     // Add a single Mombasa legend entry if any Mombasa layer is active
//     const mombasaActive = dataLayers
//       .flatMap((group) => group.children)
//       .some((l) => l.active && l.id.startsWith("test_mombasa:"));

//     if (mombasaActive) {
//       updatedLayers.push({
//         id: "Mombasa",
//         layerName: "Mombasa",
//         legendUrl: LEGEND_URLS["MombasaData"],
//       });
//     }
//     // console.log("Active layers:", dataLayers.flatMap(g => g.children).filter(l => l.active));
//     // console.log("Mombasa active?", mombasaActive);
//     // console.log("Updated legend layers:", updatedLayers);

//     setActiveLegendLayers(updatedLayers);
//   }, [dataLayers]);

//   // ----------------------------
//   // Search handler
//   // ----------------------------
//   const handleSearchResult = (coordsLonLat) => {
//     if (!mapInstance.current) return;
//     const targetCoords =
//       currentProjectionCode === "EPSG:28992"
//         ? proj4("EPSG:4326", "EPSG:28992", coordsLonLat)
//         : fromLonLat(coordsLonLat);
//     const view = mapInstance.current.getView();
//     view.animate(
//       { center: targetCoords, zoom: 14, duration: 1000 },
//       { zoom: 18, duration: 800 }
//     );
//   };

//   // ------------------------------
//   // Measurement
//   // -----------------------------
//   const [measureLayer] = useState(
//     new VectorLayer({
//       source: new VectorSource(),
//       zIndex: 1000,
//       style: (feature) => updateMeasurement(feature),
//     })
//   );

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

//v2

//v4 Click Handler
// map.on("singleclick", async (evt) => {
//   if (!mapInstance.current) return;

//   const view = mapInstance.current.getView();
//   const resolution = view.getResolution();
//   const coordinate = evt.coordinate;

//   let clickedFeature = null;
//   let clickedLayerId = null;

//   // Supported GetFeatureInfo formats in order
//   const INFO_FORMATS = [
//     "application/json",
//     "application/json; subtype=geojson",
//     "application/vnd.ogc.gml/3.1.1",
//     "application/vnd.ogc.gml",
//     "text/xml; subtype=gml/3.1.1",
//     "text/xml",
//     "text/plain",
//     "text/html",
//   ];

//   async function checkLayer(layer) {
//     if (!layer.active) return null;

//     let features = null;
//     const source = wmsWmtsLayersRef.current[layer.id];

//     if (layer.type === "wms" && source) {
//       for (const format of INFO_FORMATS) {
//         try {
//           const url = source.getFeatureInfoUrl(
//             coordinate,
//             resolution,
//             view.getProjection().getCode(),
//             {
//               INFO_FORMAT: format,
//               QUERY_LAYERS: layer.wmsLayerName || layer.id,
//               FEATURE_COUNT: 10,
//             }
//           );

//           if (!url) continue;

//           const res = await fetch(url);
//           const text = await res.text();
//           if (!text.trim()) continue;

//           if (format.includes("json") && text.trim().startsWith("{")) {
//             const json = JSON.parse(text);
//             if (json?.features?.length > 0) {
//               features = new GeoJSON().readFeatures(json, {
//                 featureProjection: view.getProjection(),
//               });
//               break;
//             }
//           } else {
//             const parsedFeatures = new WMSGetFeatureInfo().readFeatures(
//               text,
//               {
//                 featureProjection: view.getProjection(),
//               }
//             );
//             if (parsedFeatures && parsedFeatures.length > 0) {
//               features = parsedFeatures;
//               break;
//             }
//           }
//         } catch (err) {
//           console.warn(
//             `[${layer.id}] GetFeatureInfo failed for format ${format}`,
//             err
//           );
//           continue; // try next format
//         }
//       }
//     }

//     if (features && features.length > 0) {
//       clickedLayerId = layer.id;
//       return features;
//     }

//     // Recurse into children if grouped
//     if (layer.children?.length) {
//       for (const child of layer.children) {
//         const childFeatures = await checkLayer(child);
//         if (childFeatures) return childFeatures;
//       }
//     }

//     return null;
//   }

//   for (const group of dataLayersRef.current) {
//     for (const layer of group.children) {
//       const features = await checkLayer(layer);
//       if (features) {
//         clickedFeature = features[0];
//         clearFeatures();
//         addFeatures(features);
//         setSelectedFeature(clickedFeature.getProperties());
//         setSelectedFeatureId(clickedFeature.getId() || clickedLayerId);
//         setActivePanel("laagdata");
//         break;
//       }
//     }
//     if (clickedFeature) break;
//   }

//   if (!clickedFeature) {
//     clearFeatures();
//     setSelectedFeature(null);
//     setSelectedFeatureId(null);
//     console.log("[No feature found on click]");
//   }
// });

// map.on("singleclick", async (evt) => {
//   if (!mapInstance.current) return;

//   const view = mapInstance.current.getView();
//   const resolution = view.getResolution();
//   const coordinate = evt.coordinate;

//   let clickedFeature = null;
//   let clickedLayerId = null;

//   const INFO_FORMATS = [
//     "application/json",
//     "application/json; subtype=geojson",
//     "application/vnd.ogc.gml/3.1.1",
//     "application/vnd.ogc.gml",
//     "text/xml; subtype=gml/3.1.1",
//     "text/xml",
//     "text/plain",
//     "text/html",
//   ];

//   const getFeaturesFromWMS = async (layer) => {
//     const source = wmsWmtsLayersRef.current[layer.id];
//     if (!source) {
//       console.log(`[WMS] No source found for layer: ${layer.id}`);
//       return null;
//     }

//     for (const format of INFO_FORMATS) {
//       try {
//         // const url = source.getFeatureInfoUrl(
//         //   coordinate,
//         //   resolution,
//         //   view.getProjection().getCode(),
//         //   {
//         //     INFO_FORMAT: format,
//         //     QUERY_LAYERS: layer.wmsLayerName || layer.id,
//         //     FEATURE_COUNT: 10,
//         //   }
//         // );
//         const url = getWMSFeatureInfoUrlDebug(
//           layer,
//           coordinate,
//           resolution,
//           view.getProjection().getCode()
//         );
//         if (!url) continue;
//         console.log("URL generated:", url);

//         if (!url) {
//           console.log(
//             `[WMS] No URL generated for layer: ${layer.id}, format: ${format}`
//           );
//           continue;
//         }

//         console.log(`[WMS] Fetching URL: ${url} (format: ${format})`);
//         const res = await fetch(url);
//         const text = await res.text();

//         if (!text.trim()) {
//           console.log(
//             `[WMS] Empty response for layer: ${layer.id}, format: ${format}`
//           );
//           continue;
//         }

//         console.log(
//           `[WMS] Response received for layer: ${layer.id}, format: ${format}`
//         );
//         if (format.includes("json") && text.trim().startsWith("{")) {
//           const json = JSON.parse(text);
//           console.log(
//             `[WMS] JSON features length: ${json?.features?.length || 0}`
//           );
//           if (json?.features?.length > 0) {
//             return new GeoJSON().readFeatures(json, {
//               featureProjection: view.getProjection(),
//             });
//           }
//         } else {
//           const parsedFeatures = new WMSGetFeatureInfo().readFeatures(
//             text,
//             {
//               featureProjection: view.getProjection(),
//             }
//           );
//           console.log(
//             `[WMS] Parsed features length: ${parsedFeatures?.length || 0}`
//           );
//           if (parsedFeatures?.length) return parsedFeatures;
//         }
//       } catch (err) {
//         console.warn(
//           `[WMS] GetFeatureInfo failed for layer ${layer.id}, format: ${format}`,
//           err
//         );
//         continue;
//       }
//     }

//     return null;
//   };

//   for (const group of dataLayersRef.current) {
//     console.log(`[Click] Checking group: ${group.id}`);
//     for (const parentLayer of group.children ?? []) {
//       console.log(
//         `[Click] Checking layer: ${parentLayer.id}, active: ${parentLayer.active}`
//       );
//       if (!parentLayer.active) continue;

//       const features = await getFeaturesFromWMS(parentLayer);
//       if (features?.length) {
//         clickedFeature = features[0];
//         clickedLayerId = parentLayer.id;

//         console.log(
//           `[Click] Feature found on layer: ${
//             parentLayer.id
//           }, feature ID: ${clickedFeature.getId()}`
//         );
//         clearFeatures();
//         addFeatures(features);
//         setSelectedFeature(clickedFeature.getProperties());
//         setSelectedFeatureId(clickedLayerId);
//         setActivePanel("laagdata");
//         break;
//       }
//     }
//     if (clickedFeature) break;
//   }

//   if (!clickedFeature) {
//     console.log("[Click] No feature found on click");
//     clearFeatures();
//     setSelectedFeature(null);
//     setSelectedFeatureId(null);
//   }
// });
