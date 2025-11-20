// src/utils/baseLayerFactory.js V1
// import TileLayer from "ol/layer/Tile";
// import OSM from "ol/source/OSM";
// import WMTS from "ol/source/WMTS";
// import TileWMS from "ol/source/TileWMS";
// import { get as getProjection } from "ol/proj";
// import {
//   createPdokTileGrid28992,
//   createEsriTileGrid3857,
// } from "./projectionsAndTileGrids";

// export function createBaseLayer(projectionCode, backgroundId) {
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
//             version: "1.3.0",
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

//   // fallback
//   return new TileLayer({ source: new OSM(), zIndex: 0, preload: Infinity });
// }
