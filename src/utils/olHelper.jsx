// utils/olHelper.jsx
import TileLayer from "ol/layer/Tile";
import OSM from "ol/source/OSM";
import WMTS from "ol/source/WMTS";
import WMTSTileGrid from "ol/tilegrid/WMTS";
import { Vector as VectorLayer } from "ol/layer";
import { Vector as VectorSource } from "ol/source";
import { Style, Fill, Stroke } from "ol/style";

// Highlight vector layer factory
export const highlightLayerFactory = () =>
  new VectorLayer({
    source: new VectorSource(),
    style: new Style({
      stroke: new Stroke({ color: "#284F97", width: 2 }),
      fill: new Fill({ color: "#e3e9f5" }),
    }),
    zIndex: 999,
  });

// Measurement vector layer factory
export const measureLayerFactory = () =>
  new VectorLayer({
    source: new VectorSource(),
    zIndex: 1000,
  });

// Base layer helper placeholder (fill in your WMTS/OSM logic)
export const createBaseLayer = (projCode, backgroundId) => {
  // Your existing base layer logic here
  return new TileLayer({
    source: new OSM(), // placeholder
  });
};

// NL bounding box and helper
export const NL_BBOX = [3.35, 50.75, 7.23, 53.68];
export const isInsideNL = ([lon, lat]) =>
  lon >= NL_BBOX[0] &&
  lon <= NL_BBOX[2] &&
  lat >= NL_BBOX[1] &&
  lat <= NL_BBOX[3];
