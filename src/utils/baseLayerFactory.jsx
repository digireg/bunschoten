// src/utils/baseLayerFactory.js v2
import TileLayer from "ol/layer/Tile";
import WMTS from "ol/source/WMTS";
import TileWMS from "ol/source/TileWMS";
import XYZ from "ol/source/XYZ";
import OSM from "ol/source/OSM";
import { get as getProjection } from "ol/proj";
import { backgroundLayersConfig } from "../config/backgroundLayersConfig";

export function createBaseLayer(projectionCode, backgroundId) {
  // Get OL projection
  const proj = getProjection(projectionCode);

  // Lookup config
  const config = backgroundLayersConfig[projectionCode]?.[backgroundId];

  // Fallback to OSM if config missing
  if (!config) {
    console.warn(
      `[baseLayerFactory] No config found for projection "${projectionCode}" and background "${backgroundId}". Using OSM fallback.`
    );
    return new TileLayer({
      source: new OSM(),
      zIndex: 0,
      preload: Infinity,
    });
  }

  // Decide tileGrid from config if provided
  const tileGrid = config.tileGridFunc ? config.tileGridFunc() : undefined;

  switch (config.type) {
    case "WMTS":
      // Only add REST encoding if explicitly requested in config
      const wmtsOptions = {
        url: config.url,
        layer: config.layer,
        matrixSet: config.matrixSet,
        format: config.format,
        projection: proj,
        tileGrid: tileGrid,
        style: config.style,
        attributions: config.attribution,
        crossOrigin: "anonymous",
      };
      if (config.requestEncoding)
        wmtsOptions.requestEncoding = config.requestEncoding;

      return new TileLayer({
        source: new WMTS(wmtsOptions),
        zIndex: 0,
        preload: Infinity,
      });

    case "WMS":
      return new TileLayer({
        source: new TileWMS({
          url: config.url,
          params: config.params,
          serverType: config.serverType,
          version: config.version,
          attributions: config.attribution,
          crossOrigin: "anonymous",
        }),
        zIndex: 0,
      });

    case "XYZ": // <-- handle OSM or any XYZ tiles
      return new TileLayer({
        source: new XYZ({
          url: config.url,
          projection: proj,
          attributions: config.attribution,
          crossOrigin: "anonymous",
        }),
        zIndex: 0,
        preload: Infinity,
      });

    default:
      console.warn(
        `[baseLayerFactory] Unknown layer type "${config.type}". Using OSM fallback.`
      );
      return new TileLayer({
        source: new OSM(),
        zIndex: 0,
        preload: Infinity,
      });
  }
}
