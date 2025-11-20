//V1
// export const DATASET_CONFIG = {
//   // WMS dataset example
//   Mombasa: {
//     id: "Mombasa",
//     title: "Mombasa",
//     type: "WMS",
//     url: "https://services.digireg.com/wms/test/mombasa/wms?",
//     layer: "base_layer", // main WMS layer
//     legendUrl: null, // auto-generated if null
//     featureInfo: true, // enable GetFeatureInfo
//     dependencies: [], // no dependencies
//     children: [
//       {
//         id: "Mombasa_roads",
//         title: "Roads",
//         layer: "roads",
//         bbox: [39.640446, -4.079365, 39.682888, -4.029777], // hardcoded bbox
//       },
//       {
//         id: "Mombasa_buildings",
//         title: "Buildings",
//         layer: "buildings",
//         bbox: [39.640446, -4.079365, 39.682888, -4.029777], // hardcoded bbox
//       },
//     ],
//   },

//   // Another WMS dataset example
//   Mbale: {
//     id: "Mbale",
//     title: "Mbale",
//     type: "WMS",
//     url: "https://services.digireg.com/mapserver/mbale?",
//     layer: "base_layer",
//     legendUrl: null,
//     featureInfo: true,
//     dependencies: [],
//     children: [],
//   },

//   // WMTS dataset example
//   // BRT_Standaard: {
//   //   id: "BRT_Standaard",
//   //   title: "BRT Standaard Achtergrond",
//   //   type: "WMTS",
//   //   url: "https://service.pdok.nl/brt/achtergrondkaart/wmts/v2_0",
//   //   layer: "standaard",
//   //   legendUrl: null,
//   //   featureInfo: false, // WMTS usually doesn’t support GetFeatureInfo
//   //   dependencies: [],
//   //   children: [],
//   // },

//   // Dataset with a dependency example
//   BAG: {
//     id: "BAG",
//     title: "Basisregistratie Adressen en Gebouwen",
//     type: "WMS",
//     url: "https://service.pdok.nl/lv/bag/wms/v2_0?",
//     layer: "pand",
//     legendUrl: null,
//     featureInfo: true,
//     dependencies: ["BRT_Standaard"], // require background active first
//     children: [
//       {
//         id: "BAG_verblijfsobject",
//         title: "Verblijfsobject",
//         layer: "verblijfsobject",
//       },
//       { id: "BAG_standplaats", title: "Standplaats", layer: "standplaats" },
//     ],
//   },
// };

//V3
// import TileWMS from "ol/source/TileWMS";
// import WMTS from "ol/source/WMTS";
// import { createPdokTileGrid28992 } from "../utils/projectionsAndTileGrids"; // adjust if needed

// // --- Source registry ---
// export const SOURCE_REGISTRY = {
//   Mombasa: new TileWMS({
//     url: "https://services.digireg.com/wms/test/mombasa/ows?",
//     params: {
//       LAYERS:
//         "test_mombasa:Barriers,test_mombasa:Bridges,test_mombasa:Buildings,test_mombasa:Civil Engineering Structures,test_mombasa:Greenery,test_mombasa:Open Terrain,test_mombasa:Other Structures,test_mombasa:Roads and Paths,test_mombasa:Roadside,test_mombasa:Shore,test_mombasa:Water",
//       TILED: true,
//       FORMAT: "image/png",
//     },
//     serverType: "mapserver",
//     crossOrigin: "anonymous",
//   }),

//   Mbale: new TileWMS({
//     url: "https://services.digireg.com/mapserver/mbale",
//     params: {
//       LAYERS: "vihaga",
//       TILED: true,
//       TRANSPARENT: true,
//     },
//     serverType: "mapserver",
//     crossOrigin: "anonymous",
//   }),

//   BAG: new TileWMS({
//     url: "https://service.pdok.nl/lv/bag/wms/v2_0",
//     params: {
//       LAYERS: "pand,verblijfsobject,ligplaats,standplaats,woonplaats",
//       TILED: true,
//     },
//     serverType: "mapserver",
//     crossOrigin: "anonymous",
//   }),

//   BGT: new WMTS({
//     url: "https://service.pdok.nl/lv/bgt/wmts/v1_0?",
//     layer: "bgt",
//     matrixSet: "EPSG:28992",
//     format: "image/png",
//     tileGrid: createPdokTileGrid28992(),
//     style: "default",
//     crossOrigin: "anonymous",
//   }),
// };

// // --- Updated dataset config ---
// export const DATASET_CONFIG = {
//   Mombasa: {
//     id: "Mombasa",
//     title: "Mombasa",
//     type: "wms",
//     source: SOURCE_REGISTRY.Mombasa,
//     legendUrl: null,
//     featureInfo: true,
//     dependencies: [],
//     children: [],
//   },

//   Mbale: {
//     id: "Mbale",
//     title: "Mbale",
//     type: "wms",
//     source: SOURCE_REGISTRY.Mbale,
//     legendUrl: null,
//     featureInfo: true,
//     dependencies: [],
//     children: [],
//   },

//   BAG: {
//     id: "BAG",
//     title: "Basisregistratie Adressen en Gebouwen",
//     type: "wms",
//     source: SOURCE_REGISTRY.BAG,
//     legendUrl: null,
//     featureInfo: true,
//     dependencies: ["BRT_Standaard"],
//     children: [
//       // later inject: "pand", "verblijfsobject", etc.
//     ],
//   },

//   BGT: {
//     id: "BGT",
//     title: "Basisregistratie Grootschalige Topografie",
//     type: "wmts",
//     source: SOURCE_REGISTRY.BGT,
//     legendUrl: null,
//     featureInfo: true,
//     dependencies: [],
//     children: [],
//   },
// };
