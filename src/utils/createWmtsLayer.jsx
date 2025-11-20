import TileLayer from "ol/layer/Tile";
import WMTS from "ol/source/WMTS";
import WMTSTileGrid from "ol/tilegrid/WMTS";

/**
 * Create a configured OpenLayers WMTS layer
 * @param {object} options
 * @param {string} options.url - WMTS service base URL (e.g. 'https://service.pdok.nl/lv/bgt/wmts/v1_0')
 * @param {string} options.layerId - The WMTS layer name/identifier
 * @param {object} options.projection - OL projection object
 * @param {string} [options.matrixSetId='EPSG:28992'] - MatrixSet ID
 * @param {string} [options.format='image/png'] - Tile format
 * @param {string} [options.style='default'] - Style name
 * @param {number} [options.opacity=1.0] - Opacity (0–1)
 */
export function createWmtsLayer({
  url,
  layerId,
  projection,
  matrixSetId = "EPSG:28992",
  format = "image/png",
  style = "default",
  opacity = 1.0,
}) {
  const resolutions = [
    3440.64, 1720.32, 860.16, 430.08, 215.04, 107.52, 53.76, 26.88, 13.44, 6.72,
    3.36, 1.68, 0.84, 0.42, 0.21, 0.105,
  ];
  const matrixIds = resolutions.map((_, i) => i.toString());

  const tileGrid = new WMTSTileGrid({
    origin: [-285401.92, 903401.92],
    resolutions,
    matrixIds,
  });

  const source = new WMTS({
    url,
    layer: layerId,
    matrixSet: matrixSetId,
    format,
    projection,
    tileGrid,
    style,
    crossOrigin: "anonymous",
    attributions: "© PDOK",
  });

  return new TileLayer({
    source,
    zIndex: 10,
    opacity,
  });
}
