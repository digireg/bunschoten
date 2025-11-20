//V3
// import TileLayer from "ol/layer/Tile";
// import TileWMS from "ol/source/TileWMS";
// import { DATASET_CONFIG } from "../config/datasetConfig";
// import { transformExtent } from "ol/proj";
// import { loadWMSLayers } from "./wmsLoader";
// import { fetchLayerBBoxes } from "./fetchLayerBBoxes";
// import { zoomToLayer } from "./zoomToLayer";

// export async function addMapLayer({
//   mapInstance,
//   groupId,
//   layerId,
//   isActive,
//   type = "wms",
//   styleId = "",
//   wmsWmtsLayersRef,
//   projectionCode = "EPSG:3857",
//   highlightSource,
// }) {
//   if (!wmsWmtsLayersRef?.current) return;
//   if (!mapInstance) return;

//   const key = styleId
//     ? `${groupId}:${layerId}:${styleId}`
//     : `${groupId}:${layerId}`;

//   const dataset = DATASET_CONFIG[groupId];
//   if (!dataset) {
//     console.error(`[addMapLayer] No dataset config for groupId: ${groupId}`);
//     return;
//   }

//   const layerIdToUse = layerId || dataset.layer || dataset.id;
//   if (!layerIdToUse) {
//     console.error("[addMapLayer] missing layerId!", { groupId, layerId });
//     return;
//   }

//   // Remove old layer if exists
//   if (wmsWmtsLayersRef.current[key]) {
//     mapInstance.removeLayer(wmsWmtsLayersRef.current[key]);
//     delete wmsWmtsLayersRef.current[key];
//   }

//   if (!isActive) {
//     highlightSource?.clear();
//     return;
//   }

//   let newLayer = null;

//   if (type === "wms") {
//     newLayer = new TileLayer({
//       source: new TileWMS({
//         url: dataset.url,
//         params: {
//           SERVICE: "WMS",
//           REQUEST: "GetMap",
//           VERSION: "1.3.0",
//           LAYERS: layerIdToUse,
//           STYLES: styleId || "",
//           CRS: projectionCode,
//           FORMAT: "image/png",
//           TRANSPARENT: true,
//         },
//         serverType: "geoserver",
//         crossOrigin: "anonymous",
//       }),
//       zIndex: 10,
//       opacity: 1.0,
//     });

//     newLayer.set("id", layerIdToUse);
//   }

//   // Add layer to map
//   if (newLayer) {
//     mapInstance.addLayer(newLayer);
//     wmsWmtsLayersRef.current[key] = newLayer;
//     console.log("[addMapLayer] added layer:", key);

//     // -----------------------------
//     // Fetch BBox and zoom
//     // -----------------------------
//     try {
//       const bboxes = await fetchLayerBBoxes(dataset);
//       const bbox = bboxes[layerIdToUse];

//       if (bbox) {
//         console.log(`[addMapLayer] fetched bbox for ${key}:`, bbox);
//         zoomToLayer(mapInstance, bbox.extent, bbox.crs);
//       } else {
//         console.warn(`[addMapLayer] no bbox found for ${key}`);
//       }
//     } catch (err) {
//       console.warn(`[addMapLayer] failed to fetch bbox for ${key}:`, err);
//     }
//   }

//   return newLayer;
// }

//v4
// addMapLayer — BBox fix for sub-layers & styles
// import TileLayer from "ol/layer/Tile";
// import TileWMS from "ol/source/TileWMS";
// import { DATASET_CONFIG } from "../config/datasetConfig";
// import { fetchLayerBBoxes } from "./fetchLayerBBoxes";
// import { zoomToLayer } from "./zoomToLayer";

// export async function addMapLayer({
//   mapInstance,
//   groupId,
//   layerId,
//   isActive,
//   type = "wms",
//   styleId = "",
//   wmsWmtsLayersRef,
//   projectionCode = "EPSG:3857",
//   highlightSource,
//   parentLayer = null, // optional, for BBox fallback
// }) {
//   if (!wmsWmtsLayersRef?.current || !mapInstance) return;

//   const key = styleId
//     ? `${groupId}:${layerId}:${styleId}`
//     : `${groupId}:${layerId}`;
//   const dataset = DATASET_CONFIG[groupId];
//   if (!dataset) {
//     console.error(`[addMapLayer] No dataset config for groupId: ${groupId}`);
//     return;
//   }

//   // Use actual WMS layer name for BBox lookup
//   const layerNameToUse =
//     wmsWmtsLayersRef.current[layerId]?.get("wmsLayerName") || layerId;

//   // Remove existing layer if present
//   if (wmsWmtsLayersRef.current[key]) {
//     mapInstance.removeLayer(wmsWmtsLayersRef.current[key]);
//     delete wmsWmtsLayersRef.current[key];
//   }

//   if (!isActive) {
//     highlightSource?.clear();
//     return;
//   }

//   let newLayer = null;

//   if (type === "wms") {
//     newLayer = new TileLayer({
//       source: new TileWMS({
//         url: dataset.url,
//         params: {
//           SERVICE: "WMS",
//           REQUEST: "GetMap",
//           VERSION: "1.3.0",
//           LAYERS: layerNameToUse,
//           STYLES: styleId || "",
//           CRS: projectionCode,
//           FORMAT: "image/png",
//           TRANSPARENT: true,
//         },
//         serverType: "geoserver",
//         crossOrigin: "anonymous",
//       }),
//       zIndex: 10,
//       opacity: 1.0,
//     });

//     newLayer.set("id", layerId);
//     newLayer.set("wmsLayerName", layerNameToUse);
//   }

//   if (newLayer) {
//     mapInstance.addLayer(newLayer);
//     wmsWmtsLayersRef.current[key] = newLayer;
//     console.log("[addMapLayer] added layer:", key);

//     // -----------------------------
//     // Fetch BBox and zoom
//     // -----------------------------
//     try {
//       const bboxes = await fetchLayerBBoxes(dataset);

//       // Try direct layer BBox, fallback to parent layer BBox if missing
//       const bbox =
//         bboxes[layerNameToUse] ||
//         (parentLayer && bboxes[parentLayer.wmsLayerName]);

//       if (bbox) {
//         console.log(`[addMapLayer] fetched bbox for ${key}:`, bbox);
//         zoomToLayer(mapInstance, bbox.extent, bbox.crs);
//       } else {
//         console.warn(
//           `[addMapLayer] no bbox found for ${key} (tried parent fallback)`
//         );
//       }
//     } catch (err) {
//       console.warn(`[addMapLayer] failed to fetch bbox for ${key}:`, err);
//     }
//   }

//   return newLayer;
// }

//v5
// import TileLayer from "ol/layer/Tile";
// import TileWMS from "ol/source/TileWMS";
// import { DATASET_CONFIG } from "../config/datasetConfig";
// import { fetchLayerBBoxes } from "./fetchLayerBBoxes";
// import { zoomToLayer } from "./zoomToLayer";

// export async function addMapLayer({
//   mapInstance,
//   groupId,
//   layerId,
//   isActive,
//   type = "wms",
//   styleId = "",
//   wmsWmtsLayersRef,
//   projectionCode = "EPSG:3857",
//   highlightSource,
//   parentLayer = null, // optional, for BBox fallback
// }) {
//   if (!wmsWmtsLayersRef?.current || !mapInstance) return;

//   const key = styleId
//     ? `${groupId}:${layerId}:${styleId}`
//     : `${groupId}:${layerId}`;

//   const dataset = DATASET_CONFIG[groupId];
//   if (!dataset) {
//     console.error(`[addMapLayer] No dataset config for groupId: ${groupId}`);
//     return;
//   }

//   // Use actual WMS layer name for BBox lookup
//   const possibleNames = [
//     layerId,
//     layerId.includes(":") ? layerId.split(":")[1] : layerId,
//   ];
//   const layerNameToUse =
//     possibleNames.find((name) => dataset.layers?.includes(name)) ||
//     possibleNames[1];

//   // before creating the new TileLayer
//   const bboxes = await fetchLayerBBoxes(dataset);
//   const bbox =
//     bboxes[layerNameToUse] || (parentLayer && bboxes[parentLayer.wmsLayerName]);

//   // fallback: if still no bbox, log once
//   if (!bbox && parentLayer) {
//     console.warn(`[addMapLayer] Using parent extent fallback for ${key}`);
//   }

//   // Remove existing layer if present
//   if (wmsWmtsLayersRef.current[key]) {
//     mapInstance.removeLayer(wmsWmtsLayersRef.current[key]);
//     delete wmsWmtsLayersRef.current[key];
//   }

//   if (!isActive) {
//     highlightSource?.clear();
//     return;
//   }

//   let newLayer = null;

//   const srsParam = projectionCode === "EPSG:4326" ? "CRS" : "SRS";

//   if (type === "wms") {
//     newLayer = new TileLayer({
//       source: new TileWMS({
//         url: dataset.url,
//         params: {
//           SERVICE: "WMS",
//           REQUEST: "GetMap",
//           VERSION: "1.3.0",
//           LAYERS: layerNameToUse,
//           STYLES: styleId || "",
//           [srsParam]: projectionCode,
//           FORMAT: "image/png",
//           TRANSPARENT: true,
//         },
//         serverType: "geoserver",
//         crossOrigin: "anonymous",
//       }),
//       zIndex: 10,
//       opacity: 1.0,
//     });

//     // store metadata
//     newLayer.set("id", layerId);
//     newLayer.set("wmsLayerName", layerNameToUse);
//     newLayer.set("parentLayer", parentLayer || null);

//     // add to map immediately
//     mapInstance.addLayer(newLayer);
//     wmsWmtsLayersRef.current[key] = newLayer;
//     console.log("[addMapLayer] added layer:", key);
//   }

//   // -----------------------------
//   // Fetch BBoxes (optional)
//   // -----------------------------
//   try {
//     const bboxes = await fetchLayerBBoxes(dataset);

//     // Only use BBox for zooming, do not block rendering
//     const bbox =
//       bboxes[layerNameToUse] ||
//       (parentLayer && bboxes[parentLayer.wmsLayerName]);

//     if (bbox) {
//       console.log(`[addMapLayer] applying bbox for ${key}:`, bbox);
//       zoomToLayer(mapInstance, bbox.extent, bbox.crs);
//     } else {
//       console.warn(`[addMapLayer] no bbox found for ${key}, layer still added`);
//     }
//   } catch (err) {
//     console.warn(
//       `[addMapLayer] failed to fetch bbox for ${key}, layer still added`,
//       err
//     );
//   }

//   return newLayer;
// }

//v6
// import TileLayer from "ol/layer/Tile";
// import TileWMS from "ol/source/TileWMS";
// import { DATASET_CONFIG } from "../config/datasetConfig";
// import { fetchLayerBBoxes } from "./fetchLayerBBoxes";
// import { zoomToLayer } from "./zoomToLayer";
// import { resolveLayerName } from "./wmsUtils";

// export async function addMapLayer({
//   mapInstance,
//   groupId,
//   layerId,
//   isActive,
//   type = "wms",
//   styleId = "",
//   wmsWmtsLayersRef,
//   projectionCode = "EPSG:3857",
//   highlightSource,
//   parentLayer = null,
// }) {
//   if (!wmsWmtsLayersRef?.current || !mapInstance) return;

//   const key = styleId
//     ? `${groupId}:${layerId}:${styleId}`
//     : `${groupId}:${layerId}`;

//   const dataset = DATASET_CONFIG[groupId];
//   if (!dataset) {
//     console.error(`[addMapLayer] No dataset config for groupId: ${groupId}`);
//     return;
//   }

//   const useRecursiveParsing = dataset.recursiveBBoxes || false;

//   // === Fetch BBoxes first ===
//   const bboxes = await fetchLayerBBoxes(dataset, {
//     recursiveParsing: useRecursiveParsing,
//   });

//   // === Use resolveLayerName instead of manual search ===
//   const layerNameToUse = resolveLayerName(layerId, bboxes, dataset, {
//     verbose: true,
//   });

//   // Now safe to get bbox
//   const bbox =
//     bboxes[layerNameToUse] || (parentLayer && bboxes[parentLayer.wmsLayerName]);

//   if (!bbox && parentLayer) {
//     console.warn(`[addMapLayer] Using parent extent fallback for ${key}`);
//   }

//   // Remove existing layer if present
//   if (wmsWmtsLayersRef.current[key]) {
//     mapInstance.removeLayer(wmsWmtsLayersRef.current[key]);
//     delete wmsWmtsLayersRef.current[key];
//   }

//   if (!isActive) {
//     highlightSource?.clear();
//     return;
//   }

//   let newLayer = null;
//   const srsParam = projectionCode === "EPSG:4326" ? "CRS" : "SRS";

//   if (type === "wms") {
//     newLayer = new TileLayer({
//       source: new TileWMS({
//         url: dataset.url,
//         params: {
//           SERVICE: "WMS",
//           REQUEST: "GetMap",
//           VERSION: "1.3.0",
//           LAYERS: layerNameToUse,
//           STYLES: styleId || "",
//           [srsParam]: projectionCode,
//           FORMAT: "image/png",
//           TRANSPARENT: true,
//         },
//         serverType: "geoserver",
//         crossOrigin: "anonymous",
//       }),
//       zIndex: 10,
//       opacity: 1.0,
//     });

//     newLayer.set("id", layerId);
//     newLayer.set("wmsLayerName", layerNameToUse);
//     newLayer.set("parentLayer", parentLayer || null);

//     mapInstance.addLayer(newLayer);
//     wmsWmtsLayersRef.current[key] = newLayer;
//     console.log("[addMapLayer] added layer:", key);
//   }

//   // Apply zoom
//   if (bbox) {
//     console.log(`[addMapLayer] applying bbox for ${key}:`, bbox);
//     zoomToLayer(mapInstance, bbox.extent, bbox.crs);
//   } else {
//     console.warn(`[addMapLayer] no bbox found for ${key}, layer still added`);
//   }

//   return newLayer;
// }

//v7
import TileLayer from "ol/layer/Tile";
import TileWMS from "ol/source/TileWMS";
import WMTS from "ol/source/WMTS";
import WMTSTileGrid from "ol/tilegrid/WMTS";
import { get as getProjection } from "ol/proj";
import { getTopLeft, getWidth } from "ol/extent";

import { DATASET_CONFIG } from "../config/datasetConfig";
import { fetchLayerBBoxes } from "./fetchLayerBBoxes";
import { zoomToLayer } from "./zoomToLayer";

export async function addMapLayer({
  mapInstance,
  groupId,
  layerId,
  isActive,
  type = "wms",
  styleId = "",
  wmsWmtsLayersRef,
  projectionCode = "EPSG:3857",
  highlightSource,
  parentLayer = null,
}) {
  if (!wmsWmtsLayersRef?.current || !mapInstance) return;

  const key = styleId
    ? `${groupId}:${layerId}:${styleId}`
    : `${groupId}:${layerId}`;

  const dataset = DATASET_CONFIG[groupId];
  if (!dataset) {
    console.error(`[addMapLayer] No dataset config for groupId: ${groupId}`);
    return;
  }

  const possibleNames = [
    layerId,
    layerId.includes(":") ? layerId.split(":")[1] : layerId,
  ];
  const layerNameToUse =
    possibleNames.find((name) => dataset.layers?.includes(name)) ||
    possibleNames[1];

  const bboxes = await fetchLayerBBoxes(dataset);
  const bbox =
    bboxes[layerNameToUse] || (parentLayer && bboxes[parentLayer.wmsLayerName]);

  if (!bbox && parentLayer) {
    console.warn(`[addMapLayer] Using parent extent fallback for ${key}`);
  }

  // Remove existing layer if present
  if (wmsWmtsLayersRef.current[key]) {
    mapInstance.removeLayer(wmsWmtsLayersRef.current[key]);
    delete wmsWmtsLayersRef.current[key];
  }

  if (!isActive) {
    highlightSource?.clear();
    return;
  }

  let newLayer = null;
  const srsParam = projectionCode === "EPSG:4326" ? "CRS" : "SRS";

  // --------------------------------------------------------------------
  // WMS
  // --------------------------------------------------------------------
  if (type === "wms") {
    newLayer = new TileLayer({
      source: new TileWMS({
        url: dataset.url,
        params: {
          SERVICE: "WMS",
          REQUEST: "GetMap",
          VERSION: "1.3.0",
          LAYERS: layerNameToUse,
          STYLES: styleId || "",
          [srsParam]: projectionCode,
          FORMAT: "image/png",
          TRANSPARENT: true,
        },
        serverType: "geoserver",
        crossOrigin: "anonymous",
      }),
      zIndex: 10,
      opacity: 1.0,
    });

    newLayer.set("id", layerId);
    newLayer.set("wmsLayerName", layerNameToUse);
    newLayer.set("parentLayer", parentLayer || null);

    mapInstance.addLayer(newLayer);
    wmsWmtsLayersRef.current[key] = newLayer;
    console.log("[addMapLayer] added WMS layer:", key);
  }

  // // --------------------------------------------------------------------
  // // WMTS
  // // --------------------------------------------------------------------
  // if (type === "wmts") {
  //   const wmtsOptions = parentLayer?.wmtsOptions;
  //   if (!wmtsOptions) {
  //     console.warn(`[addMapLayer] No WMTS options found for ${key}`);
  //     return;
  //   }

  //   // Determine the style to use
  //   const styleToUse =
  //     styleId && wmtsOptions.style?.includes(styleId)
  //       ? styleId
  //       : wmtsOptions.style || undefined;

  //   const layer = new TileLayer({
  //     source: new WMTS({ ...wmtsOptions, style: styleToUse }),
  //     zIndex: 10,
  //     opacity: 1.0,
  //     visible: isActive,
  //   });

  //   layer.set("id", layerId);
  //   layer.set("wmsLayerName", parentLayer.id || layerId);
  //   layer.set("parentLayer", parentLayer || null);

  //   mapInstance.addLayer(layer);
  //   wmsWmtsLayersRef.current[key] = layer;

  //   console.log("[addMapLayer] added WMTS layer:", key);

  //   // Optional zoom
  //   if (parentLayer?.bbox) {
  //     try {
  //       zoomToLayer(mapInstance, parentLayer.bbox.extent, parentLayer.bbox.crs);
  //     } catch (err) {
  //       console.warn(
  //         `[addMapLayer] failed to zoom to WMTS bbox for ${key}`,
  //         err
  //       );
  //     }
  //   }

  //   return layer;
  // }

  // --------------------------------------------------------------------
  // WMTS
  // --------------------------------------------------------------------
  if (type === "wmts") {
    const wmtsOptions = parentLayer?.wmtsOptions;
    if (!wmtsOptions) {
      console.warn(`[addMapLayer] No WMTS options found for ${key}`);
      return;
    }

    const styleToUse =
      styleId && wmtsOptions.style?.includes(styleId)
        ? styleId
        : wmtsOptions.style || undefined;

    const layer = new TileLayer({
      source: new WMTS({ ...wmtsOptions, style: styleToUse }),
      zIndex: 10,
      opacity: 1.0,
      visible: isActive,
    });

    layer.set("id", layerId);
    layer.set("wmsLayerName", parentLayer?.id || layerId);
    layer.set("parentLayer", parentLayer || null);

    mapInstance.addLayer(layer);
    wmsWmtsLayersRef.current[key] = layer;

    console.log("[addMapLayer] added WMTS layer:", key);

    // Skip zoomToLayer for WMTS layers if bbox is not explicitly defined
    if (parentLayer?.bbox) {
      try {
        zoomToLayer(mapInstance, parentLayer.bbox.extent, parentLayer.bbox.crs);
      } catch (err) {
        console.warn(
          `[addMapLayer] failed to zoom to WMTS bbox for ${key}`,
          err
        );
      }
    }

    return layer;
  }

  // --------------------------------------------------------------------
  // BBox zoom (non-blocking)
  // --------------------------------------------------------------------
  try {
    if (type === "wms") {
      if (bbox) {
        console.log(`[addMapLayer] applying bbox for ${key}:`, bbox);
        zoomToLayer(mapInstance, bbox.extent, bbox.crs);
      } else {
        console.warn(
          `[addMapLayer] no bbox found for ${key}, layer still added`
        );
      }
    }
  } catch (err) {
    console.warn(
      `[addMapLayer] failed to fetch bbox for ${key}, layer still added`,
      err
    );
  }

  return newLayer;
}
