//V2

// import {
//   createPdokTileGrid28992,
//   createEsriTileGrid3857,
// } from "../utils/projectionsAndTileGrids";

// export const DATASET_CONFIG = {
//   Mombasa: {
//     id: "Mombasa",
//     title: "Mombasa",
//     type: "wms",
//     url: "https://services.digireg.com/wms/test/mombasa/wms?",
//     legendUrl: null, // auto-generate if null
//     featureInfo: true,
//     dependencies: [],
//     children: [],
//   },

//   Mbale: {
//     id: "Mbale",
//     title: "Mbale",
//     type: "wms",
//     url: "https://services.digireg.com/mapserver/mbale?",
//     legendUrl: null,
//     featureInfo: true,
//     dependencies: [],
//     children: [],
//   },

//   /* WMTS not yet pluggable */
//   // BGT: {
//   //   id: "BGT",
//   //   title: "BGT WMTS",
//   //   type: "WMTS",
//   //   url: "https://service.pdok.nl/lv/bgt/wmts/v1_0",
//   //   layer: "BGT standaardvisualisatie",
//   //   matrixSet: "EPSG:28992",
//   //   format: "image/png",
//   //   style: "default",
//   //   attribution: "© PDOK",
//   //   tileGridFunc: createPdokTileGrid28992,
//   // },

//   BAG: {
//     id: "BAG",
//     title: "Basisregistratie Adressen en Gebouwen",
//     type: "wms",
//     url: "https://service.pdok.nl/lv/bag/wms/v2_0?",
//     legendUrl: null,
//     featureInfo: true,
//     dependencies: ["BRT_Standaard"],
//     children: [
//       // you can later inject: "pand", "verblijfsobject", etc.
//     ],
//   },

//   KadastraleKaart: {
//     id: "KadastraleKaartV5",
//     title: "Kadastrale kaart",
//     type: "wms",
//     url: "https://service.pdok.nl/kadaster/kadastralekaart/wms/v5_0?",
//     legendUrl: null,
//     featureInfo: true,
//     dependencies: ["BRT_Standaard"],
//     children: [],
//   },

//   CBS_Postcode6_statistieken_2023: {
//     id: "CBS_Postcode6_2023",
//     title: "CBS Postcode6 statistieken 2023",
//     type: "wms",
//     url: "https://service.pdok.nl/cbs/postcode6/2023/wms/v1_0?",
//     legendUrl: null,
//     featureInfo: true,
//     dependencies: ["BRT_Standaard"],
//     children: [],
//   },
// };

//v3
// datasetConfig.js
import {
  createPdokTileGrid28992,
  createEsriTileGrid3857,
} from "../utils/projectionsAndTileGrids";

export const DATASET_CONFIG = {
  // Mombasa: {
  //   id: "Mombasa",
  //   title: "Mombasa",
  //   type: "wms",
  //   url: "https://services.digireg.com/wms/test/mombasa/wms?",
  //   legendUrl: null,
  //   featureInfo: true,
  //   dependencies: [],
  //   children: [],
  //   projectionPriority: ["EPSG:3857", "EPSG:4326"],
  //   recursiveBBoxes: true, // ✅ only this dataset uses recursive parsing
  // },

  // Mbale: {
  //   id: "Mbale",
  //   title: "Mbale",
  //   type: "wms",
  //   url: "https://services.digireg.com/mapserver/mbale?",
  //   legendUrl: null,
  //   featureInfo: true,
  //   dependencies: [],
  //   children: [],
  //   projectionPriority: ["EPSG:3857", "EPSG:4326"],
  // },

  Bunschoten: {
    id: "Bunschoten",
    title: "Vigerend beleid",
    type: "wms",
    url: "https://services.digireg.com/bunschoten/bestemming?",
    legendUrl: null,
    featureInfo: true,
    dependencies: ["BRT_Standaard"],
    children: [
      // "Enkelbestemming",
      // "Maatvoering",
      // "Gebiedsaanduiding",
      // "Functieaanduiding",
      // "Dubbelbestemming",
      // "Bouwvlak",
      // "Bouwaanduiding",
    ],
    projectionPriority: ["EPSG:28992"],

    allowedFields: [
      "naam",
      "bestemmingshoofdgroep",
      "artikelnummer",
      "typeplanobject",
      // "type1",
      // "waarde1",
      // "type2",
      // "waarde2",
      // "plangebied.xlink_href",
    ],
  },

  BGT: {
    id: "BGT",
    title: "Basisregistratie Grootschalige Topografie (BGT)",
    type: "wmts",
    url: "https://service.pdok.nl/lv/bgt/wmts/v1_0?request=GetCapabilities&service=WMTS",
    layer: "standaardvisualisatie", // default WMTS layer
    matrixSet: "EPSG:28992",
    format: "image/png",
    style: "standaardvisualisatie", // default style
    availableStyles: [
      "standaardvisualisatie",
      "achtergrondvisualisatie",
      "icoonvisualisatie",
      "omtrekgerichtevisualisatie",
      "pastelvisualisatie",
      "planvisualisatie",
    ],
    attribution: "© Basisregistratie Grootschalige Topografie (BGT), PDOK",
    projectionPriority: ["EPSG:28992"],
    children: [],
    featureInfo: true, // we will use this in Step 2
    dependencies: [], // none for now
  },

  BAG: {
    id: "BAG",
    title: "Basisregistratie Adressen en Gebouwen (BAG)",
    type: "wms",
    url: "https://service.pdok.nl/lv/bag/wms/v2_0?",
    legendUrl: null,
    featureInfo: true,
    dependencies: ["BRT_Standaard"],
    children: [],
    projectionPriority: ["EPSG:28992", "EPSG:3857"],
  },

  KadastraleKaart: {
    id: "KadastraleKaartV5",
    title: "Kadastrale kaart",
    type: "wms",
    url: "https://service.pdok.nl/kadaster/kadastralekaart/wms/v5_0?",
    legendUrl: null,
    featureInfo: true,
    dependencies: ["BRT_Standaard"],
    children: [],
    projectionPriority: ["EPSG:28992", "EPSG:3857"],
  },

  // CBS_Postcode6_statistieken_2023: {
  //   id: "CBS_Postcode6_2023",
  //   title: "CBS Postcode6 statistieken 2023",
  //   type: "wms",
  //   url: "https://service.pdok.nl/cbs/postcode6/2023/wms/v1_0?",
  //   legendUrl: null,
  //   featureInfo: true,
  //   dependencies: ["BRT_Standaard"],
  //   children: [],
  //   projectionPriority: ["EPSG:3857", "EPSG:4326"],
  // },

  Bunschoten_lufo: {
    id: "Bunschoten_lufo",
    title: "Luchtfoto",
    type: "wms",
    url: "https://services.digireg.com/bunschoten/lufo?",
    legendUrl: null,
    featureInfo: true,
    dependencies: [],
    children: [],
    projectionPriority: ["EPSG:28992"],
  },
};
