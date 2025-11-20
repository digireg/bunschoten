import {
  createPdokTileGrid28992,
  createEsriTileGrid3857,
} from "../utils/projectionsAndTileGrids";

export const backgroundLayersConfig = {
  "EPSG:28992": {
    pdok_BRT: {
      id: "pdok_BRT",
      title: "PDOK BRT Achtergrondkaart",
      type: "WMTS",
      url: "https://service.pdok.nl/brt/achtergrondkaart/wmts/v2_0/{Layer}/{TileMatrixSet}/{TileMatrix}/{TileCol}/{TileRow}.png",
      layer: "standaard",
      matrixSet: "EPSG:28992",
      format: "image/png",
      style: "default",
      attribution: "© PDOK BRT Achtergrondkaart",
      tileGridFunc: createPdokTileGrid28992,
      requestEncoding: "REST",
    },
    pdok_luchtfoto: {
      id: "pdok_luchtfoto",
      title: "PDOK Luchtfoto Actueel",
      type: "WMTS",
      url: "https://service.pdok.nl/hwh/luchtfotorgb/wmts/v1_0?",
      layer: "Actueel_ortho25",
      matrixSet: "EPSG:28992",
      format: "image/png",
      style: "default",
      attribution: "© PDOK",
      tileGridFunc: createPdokTileGrid28992,
    },

    // bunschoten: {
    //   id: "bunschoten",
    //   title: "Digireg Luchtfoto Bunschoten",
    //   type: "WMS",
    //   url: "https://services.digireg.com/mapserver/buns?",
    //   params: {
    //     LAYERS: "F25002_Bunschoten_50",
    //     FORMAT: "image/png",
    //     TILED: true,
    //   },
    //   serverType: "mapserver",
    //   version: "7.6.4",
    //   matrixSet: "EPSG:28992",
    //   attribution: "© Digireg Luchtfoto Bunschoten",
    //   tileGridFunc: createPdokTileGrid28992,
    // },

    /* Same as PDOK Luchtfoto */
    // NL_Actueel_ortho25: {
    //   id: "NL_Actueel_ortho25",
    //   title: "Luchtfoto 2025 Ortho",
    //   type: "WMS",
    //   url: "https://service.pdok.nl/hwh/luchtfotorgb/wms/v1_0?",
    //   params: {
    //     LAYERS: "Actueel_ortho25",
    //     FORMAT: "image/png",
    //     TILED: true,
    //   },
    //   serverType: "geoserver",
    //   version: "1.3.0",
    //   attribution: "© PDOK",
    // },
  },

  "EPSG:3857": {
    openstreet: {
      id: "openstreet",
      title: "OpenStreetMap",
      type: "XYZ", // <-- use "XYZ" instead of "tile" to match factory handling
      url: "https://tile.openstreetmap.org/{z}/{x}/{y}.png",
      projection: "EPSG:3857",
      attribution: "© OpenStreetMap contributors",
    },
    esri: {
      id: "esri",
      title: "Esri Wereldbeeld",
      type: "WMTS",
      url: "https://services.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/WMTS/",
      layer: "World_Imagery",
      matrixSet: "EPSG:3857",
      format: "image/png",
      style: "default",
      attribution: "© Esri",
      tileGridFunc: createEsriTileGrid3857,
    },
    // mombasa: {
    //   id: "mombasa",
    //   title: "Mombasa Orthofoto",
    //   type: "WMS",
    //   url: "https://services.digireg.com/wms/test/mombasa-ortho/ows?",
    //   params: {
    //     LAYERS: "ortho:mombasa2019",
    //     FORMAT: "image/png",
    //     TILED: true,
    //   },
    //   serverType: "geoserver",
    //   version: "1.3.0",
    //   attribution: "© Digireg",
    // },
  },
};
