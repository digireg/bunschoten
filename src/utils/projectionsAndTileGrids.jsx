import { register } from "ol/proj/proj4";
import proj4 from "proj4";
import WMTSTileGrid from "ol/tilegrid/WMTS";

// ----------------------------
// Register EPSG:28992
// ----------------------------
export function registerEPSG28992() {
  proj4.defs(
    "EPSG:28992",
    "+proj=sterea +lat_0=52.15616055555555 +lon_0=5.38763888888889 " +
      "+k=0.9999079 +x_0=155000 +y_0=463000 +ellps=bessel " +
      "+units=m +no_defs"
  );
  register(proj4);
}

// ----------------------------
// PDOK TileGrid (EPSG:28992)
// ----------------------------
const pdokMatrixIds28992 = Array.from({ length: 16 }, (_, i) => i.toString());
const pdokResolutions28992 = [
  3440.64, 1720.32, 860.16, 430.08, 215.04, 107.52, 53.76, 26.88, 13.44, 6.72,
  3.36, 1.68, 0.84, 0.42, 0.21, 0.105,
];
const pdokOrigin28992 = [-285401.92, 903401.92];

export function createPdokTileGrid28992() {
  return new WMTSTileGrid({
    origin: pdokOrigin28992,
    resolutions: pdokResolutions28992,
    matrixIds: pdokMatrixIds28992,
  });
}

// ----------------------------
// Esri TileGrid (EPSG:3857)
// ----------------------------
const esriMatrixIds3857 = [];
const esriResolutions3857 = [];
for (let z = 0; z <= 19; z++) {
  esriMatrixIds3857.push(z.toString());
  esriResolutions3857.push(156543.03392804097 / Math.pow(2, z));
}
const esriOrigin3857 = [-20037508.342789244, 20037508.342789244];

export function createEsriTileGrid3857() {
  return new WMTSTileGrid({
    origin: esriOrigin3857,
    resolutions: esriResolutions3857,
    matrixIds: esriMatrixIds3857,
  });
}
