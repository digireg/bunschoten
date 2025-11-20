//V1 no zoom
// import TileLayer from "ol/layer/Tile";
// import TileWMS from "ol/source/TileWMS";
// import { DATASET_CONFIG } from "../config/datasetConfig";

// export function addMapLayer({
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
//   if (!wmsWmtsLayersRef || !wmsWmtsLayersRef.current) {
//     console.warn("[addMapLayer] wmsWmtsLayersRef not provided!");
//     return;
//   }
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

//   if (wmsWmtsLayersRef.current[key]) {
//     mapInstance.removeLayer(wmsWmtsLayersRef.current[key]);
//     delete wmsWmtsLayersRef.current[key];
//   }

//   if (!isActive) {
//     if (highlightSource) highlightSource.clear();
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
//   }

//   if (newLayer) {
//     mapInstance.addLayer(newLayer);
//     if (wmsWmtsLayersRef) {
//       wmsWmtsLayersRef.current[key] = newLayer;
//     }
//     console.log("[addMapLayer] added layer:", key);
//   }

//   return newLayer;
// }

//V2 zoom works, but broken coordinates
// import TileLayer from "ol/layer/Tile";
// import TileWMS from "ol/source/TileWMS";
// import { DATASET_CONFIG } from "../config/datasetConfig";
// import { zoomToLayer } from "./zoomToLayer";
// import { loadWMSLayers } from "./wmsLoader";

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
//   if (!wmsWmtsLayersRef || !wmsWmtsLayersRef.current) {
//     console.warn("[addMapLayer] wmsWmtsLayersRef not provided!");
//     return;
//   }
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

//   if (wmsWmtsLayersRef.current[key]) {
//     mapInstance.removeLayer(wmsWmtsLayersRef.current[key]);
//     delete wmsWmtsLayersRef.current[key];
//   }

//   if (!isActive) {
//     if (highlightSource) highlightSource.clear();
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
//   }

//   if (newLayer) {
//     mapInstance.addLayer(newLayer);
//     wmsWmtsLayersRef.current[key] = newLayer;
//     console.log("[addMapLayer] added layer:", key);

//     // -----------------------------
//     // Safe dynamic bbox zoom
//     // -----------------------------
//     try {
//       const bbox = await loadWMSLayers(groupId, layerIdToUse);

//       console.log(`[addMapLayer] fetched bbox for ${key}:`, bbox);
//       zoomToLayer(mapInstance, bbox, projectionCode);
//     } catch (err) {
//       console.warn(`[addMapLayer] failed to fetch bbox for ${key}:`, err);
//     }
//   }

//   return newLayer;
// }

// v4

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
//   layerId, // fully qualified UI ID
//   styleId = "",
//   isActive,
//   type = "wms",
//   wmsWmtsLayersRef,
//   projectionCode = "EPSG:3857",
//   highlightSource,
//   wmsLayerName, // pass original WMS name
//   dataset, // optional, can be passed in
// }) {
//   if (!mapInstance || !wmsWmtsLayersRef?.current) return;

//   // Use passed dataset, or fallback to DATASET_CONFIG lookup
//   const datasetToUse = dataset || DATASET_CONFIG[groupId];
//   if (!datasetToUse) {
//     console.error("[addMapLayer] dataset not found for groupId:", groupId);
//     return;
//   }

//   const key = styleId ? `${layerId}:${styleId}` : layerId;

//   if (wmsWmtsLayersRef.current[key]) {
//     mapInstance.removeLayer(wmsWmtsLayersRef.current[key]);
//     delete wmsWmtsLayersRef.current[key];
//   }

//   if (!isActive) {
//     highlightSource?.clear();
//     return;
//   }

//   if (type === "wms") {
//     const newLayer = new TileLayer({
//       source: new TileWMS({
//         url: datasetToUse.url,
//         params: {
//           SERVICE: "WMS",
//           REQUEST: "GetMap",
//           VERSION: "1.3.0",
//           LAYERS: wmsLayerName,
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

//     mapInstance.addLayer(newLayer);
//     wmsWmtsLayersRef.current[key] = newLayer;

//     console.log("[addMapLayer] added layer:", key);

//     try {
//       const bboxes = await fetchLayerBBoxes(datasetToUse);
//       const bbox = bboxes[wmsLayerName];
//       if (bbox) zoomToLayer(mapInstance, bbox.extent, bbox.crs);
//     } catch (err) {
//       console.warn(`[addMapLayer] failed to fetch bbox for ${key}:`, err);
//     }

//     return newLayer;
//   }
// }
