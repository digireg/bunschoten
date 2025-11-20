//v8

// import axios from "axios";

// /**
//  * Fetch WMS GetCapabilities and return a dataLayers array compatible with useMapLayers.
//  * Handles any depth of parent/child layers and styles, keeps checkboxes and radio styles independent.
//  */
// export async function DataLayerCreate(
//   wmsUrl,
//   datasetName = "WMS Layer",
//   type = "wms"
// ) {
//   if (type.toLowerCase() !== "wms") {
//     console.warn(`[DataLayerCreate] Skipping non-WMS layer: ${wmsUrl}`);
//     return [];
//   }

//   const safeDatasetName = String(datasetName || "WMS Layer");

//   try {
//     const response = await axios.get(wmsUrl);
//     const xmlDoc = new DOMParser().parseFromString(response.data, "text/xml");

//     const rootLayer = xmlDoc.querySelector("Capability > Layer");
//     if (!rootLayer) return [];

//     const traverseLayer = (layerNode, parentKey = "") => {
//       const name = layerNode.querySelector(":scope > Name")?.textContent;
//       const title =
//         layerNode.querySelector(":scope > Title")?.textContent ||
//         name ||
//         "unnamed";

//       const safeName = (name || title).replace(/\s+/g, "_");
//       const layerKey = parentKey ? `${parentKey}_${safeName}` : safeName;

//       // Fetch legend URL from <Style> if available
//       let legendUrl = null;
//       const styleNode = layerNode.querySelector(":scope > Style");
//       if (styleNode) {
//         // Some servers use xlink:href, some href
//         legendUrl =
//           styleNode
//             .querySelector("LegendURL > OnlineResource")
//             ?.getAttribute("xlink:href") ||
//           styleNode
//             .querySelector("LegendURL > OnlineResource")
//             ?.getAttribute("href") ||
//           null;
//       }

//       const baseLayer = {
//         id: layerKey,
//         wmsLayerName: name || title,
//         title,
//         inputType: "checkbox",
//         type: "wms",
//         opacity: 100,
//         active: false,
//         children: [],
//         groupTitle: safeDatasetName,
//         legendUrl,
//       };

//       // Recursively handle child layers
//       const childNodes = Array.from(
//         layerNode.querySelectorAll(":scope > Layer")
//       );
//       childNodes.forEach((childNode) => {
//         const child = traverseLayer(childNode, layerKey);
//         if (child) baseLayer.children.push(child);
//       });

//       // Add styles as separate radio children
//       const styleNodes = Array.from(
//         layerNode.querySelectorAll(":scope > Style")
//       );
//       styleNodes.forEach((styleNode, idx) => {
//         const styleName = (
//           styleNode.querySelector(":scope > Name")?.textContent ||
//           `style-${idx}`
//         ).replace(/\s+/g, "_");
//         const styleLegendUrl =
//           styleNode
//             .querySelector("LegendURL > OnlineResource")
//             ?.getAttribute("xlink:href") ||
//           styleNode
//             .querySelector("LegendURL > OnlineResource")
//             ?.getAttribute("href") ||
//           null;

//         baseLayer.children.push({
//           id: styleName,
//           wmsLayerName: name || title, // parent WMS layer
//           title: styleName,
//           inputType: "radio",
//           type: "wms",
//           active: false,
//           children: [],
//           groupTitle: safeDatasetName,
//           legendUrl: styleLegendUrl || legendUrl, // fallback to layer legend
//         });
//       });

//       return name || baseLayer.children.length ? baseLayer : null;
//     };

//     // Collect first-level layers
//     const firstLevelLayers = Array.from(
//       rootLayer.querySelectorAll(":scope > Layer")
//     )
//       .map((l) => traverseLayer(l))
//       .filter(Boolean);

//     // Include root layer itself if it has a Name
//     if (rootLayer.querySelector(":scope > Name")) {
//       const rootAsLayer = traverseLayer(rootLayer);
//       if (rootAsLayer) firstLevelLayers.unshift(rootAsLayer);
//     }

//     return firstLevelLayers;
//   } catch (err) {
//     console.error("Error fetching or parsing WMS GetCapabilities:", err);
//     return [];
//   }
// }

//v9
// import axios from "axios";
// import { parseWMTSCapabilities } from "../utils/parseWMTSCapabilities";

// /**
//  * Fetch WMS or WMTS GetCapabilities and return a dataLayers array compatible with useMapLayers.
//  * Handles child layers, styles (radio/checkbox), keeps WMS and WMTS compatible.
//  */
// export async function DataLayerCreate(
//   wmsOrWmtsUrl,
//   datasetName = "Layer",
//   type = "wms"
// ) {
//   const safeDatasetName = String(datasetName || "Layer");

//   try {
//     if (type.toLowerCase() === "wms") {
//       const response = await axios.get(wmsOrWmtsUrl);
//       const xmlDoc = new DOMParser().parseFromString(response.data, "text/xml");

//       const rootLayer = xmlDoc.querySelector("Capability > Layer");
//       if (!rootLayer) return [];

//       const traverseLayer = (layerNode, parentKey = "") => {
//         const name = layerNode.querySelector(":scope > Name")?.textContent;
//         const title =
//           layerNode.querySelector(":scope > Title")?.textContent ||
//           name ||
//           "unnamed";

//         const safeName = (name || title).replace(/\s+/g, "_");
//         const layerKey = parentKey ? `${parentKey}_${safeName}` : safeName;

//         let legendUrl = null;
//         const styleNode = layerNode.querySelector(":scope > Style");
//         if (styleNode) {
//           legendUrl =
//             styleNode
//               .querySelector("LegendURL > OnlineResource")
//               ?.getAttribute("xlink:href") ||
//             styleNode
//               .querySelector("LegendURL > OnlineResource")
//               ?.getAttribute("href") ||
//             null;
//         }

//         const baseLayer = {
//           id: layerKey,
//           wmsLayerName: name || title,
//           title,
//           inputType: "checkbox",
//           type: "wms",
//           active: false,
//           children: [],
//           groupTitle: safeDatasetName,
//           legendUrl,
//         };

//         // Recursively handle child layers
//         const childNodes = Array.from(
//           layerNode.querySelectorAll(":scope > Layer")
//         );
//         childNodes.forEach((childNode) => {
//           const child = traverseLayer(childNode, layerKey);
//           if (child) baseLayer.children.push(child);
//         });

//         // Add styles as separate radio children
//         const styleNodes = Array.from(
//           layerNode.querySelectorAll(":scope > Style")
//         );
//         styleNodes.forEach((styleNode, idx) => {
//           const styleName = (
//             styleNode.querySelector(":scope > Name")?.textContent ||
//             `style-${idx}`
//           ).replace(/\s+/g, "_");
//           const styleLegendUrl =
//             styleNode
//               .querySelector("LegendURL > OnlineResource")
//               ?.getAttribute("xlink:href") ||
//             styleNode
//               .querySelector("LegendURL > OnlineResource")
//               ?.getAttribute("href") ||
//             null;

//           baseLayer.children.push({
//             id: styleName,
//             wmsLayerName: name || title,
//             title: styleName,
//             inputType: "radio",
//             type: "wms",
//             active: false,
//             children: [],
//             groupTitle: safeDatasetName,
//             legendUrl: styleLegendUrl || legendUrl,
//           });
//         });

//         return name || baseLayer.children.length ? baseLayer : null;
//       };

//       const firstLevelLayers = Array.from(
//         rootLayer.querySelectorAll(":scope > Layer")
//       )
//         .map((l) => traverseLayer(l))
//         .filter(Boolean);

//       if (rootLayer.querySelector(":scope > Name")) {
//         const rootAsLayer = traverseLayer(rootLayer);
//         if (rootAsLayer) firstLevelLayers.unshift(rootAsLayer);
//       }

//       return firstLevelLayers;
//     }

//     if (type.toLowerCase() === "wmts") {
//       const wmtsLayers = await parseWMTSCapabilities(wmsOrWmtsUrl);
//       return wmtsLayers.map((l) => ({
//         ...l,
//         type: "wmts",
//         inputType: "checkbox",
//         active: false,
//         children: l.children || [],
//         groupTitle: safeDatasetName,
//       }));
//     }

//     console.warn(`[DataLayerCreate] Unsupported layer type: ${type}`);
//     return [];
//   } catch (err) {
//     // console.error(
//     //   `[DataLayerCreate][${type.toUpperCase()}] Error fetching/parsing:`,
//     //   err
//     // );
//     return [];
//   }
// }

//v10
import axios from "axios";
import { parseWMTSCapabilities } from "../utils/parseWMTSCapabilities";

/**
 * Fetch WMS or WMTS GetCapabilities and return a dataLayers array compatible with useMapLayers.
 * Handles child layers, styles (radio/checkbox), keeps WMS and WMTS compatible.
 */
export async function DataLayerCreate(
  wmsOrWmtsUrl,
  datasetName = "Layer",
  type = "wms"
) {
  const safeDatasetName = String(datasetName || "Layer");

  try {
    if (type.toLowerCase() === "wms") {
      const response = await axios.get(wmsOrWmtsUrl);
      const xmlDoc = new DOMParser().parseFromString(response.data, "text/xml");

      const rootLayer = xmlDoc.querySelector("Capability > Layer");
      if (!rootLayer) return [];

      const traverseLayer = (layerNode, parentKey = "", parentBbox = null) => {
        const name = layerNode.querySelector(":scope > Name")?.textContent;
        const title =
          layerNode.querySelector(":scope > Title")?.textContent ||
          name ||
          "unnamed";

        const safeName = (name || title).replace(/\s+/g, "_");
        const layerKey = parentKey ? `${parentKey}_${safeName}` : safeName;

        // --- NEW: Get bounding box ---
        let extent = null;
        let crs = null;

        const bboxNodes = Array.from(
          layerNode.getElementsByTagName("BoundingBox")
        );
        if (bboxNodes.length) {
          // Prefer a CRS matching map needs (e.g., EPSG:3857), fallback to first
          const bbox =
            bboxNodes.find((b) => b.getAttribute("CRS") === "EPSG:3857") ||
            bboxNodes[0];

          extent = [
            parseFloat(bbox.getAttribute("minx")),
            parseFloat(bbox.getAttribute("miny")),
            parseFloat(bbox.getAttribute("maxx")),
            parseFloat(bbox.getAttribute("maxy")),
          ];
          crs =
            bbox.getAttribute("CRS") || bbox.getAttribute("SRS") || "EPSG:4326";
        } else if (parentBbox) {
          // Fallback to parent bbox if missing
          extent = parentBbox.extent;
          crs = parentBbox.crs;
        }

        let legendUrl = null;
        const styleNode = layerNode.querySelector(":scope > Style");
        if (styleNode) {
          legendUrl =
            styleNode
              .querySelector("LegendURL > OnlineResource")
              ?.getAttribute("xlink:href") ||
            styleNode
              .querySelector("LegendURL > OnlineResource")
              ?.getAttribute("href") ||
            null;
        }

        const baseLayer = {
          id: layerKey,
          wmsLayerName: name || title,
          title,
          inputType: "checkbox",
          type: "wms",
          active: false,
          children: [],
          groupTitle: safeDatasetName,
          legendUrl,
          bbox: extent && crs ? { extent, crs } : null, // store bbox for zoom
        };

        // Recursively handle child layers, passing current bbox as fallback
        const childNodes = Array.from(
          layerNode.querySelectorAll(":scope > Layer")
        );
        childNodes.forEach((childNode) => {
          const child = traverseLayer(childNode, layerKey, baseLayer.bbox);
          if (child) baseLayer.children.push(child);
        });

        // Add styles as separate radio children
        const styleNodes = Array.from(
          layerNode.querySelectorAll(":scope > Style")
        );
        styleNodes.forEach((styleNode, idx) => {
          const styleName = (
            styleNode.querySelector(":scope > Name")?.textContent ||
            `style-${idx}`
          ).replace(/\s+/g, "_");
          const styleLegendUrl =
            styleNode
              .querySelector("LegendURL > OnlineResource")
              ?.getAttribute("xlink:href") ||
            styleNode
              .querySelector("LegendURL > OnlineResource")
              ?.getAttribute("href") ||
            null;

          baseLayer.children.push({
            id: styleName,
            wmsLayerName: name || title,
            title: styleName,
            inputType: "radio",
            type: "wms",
            active: false,
            children: [],
            groupTitle: safeDatasetName,
            legendUrl: styleLegendUrl || legendUrl,
            bbox: baseLayer.bbox, // inherit bbox
          });
        });

        return name || baseLayer.children.length ? baseLayer : null;
      };

      const firstLevelLayers = Array.from(
        rootLayer.querySelectorAll(":scope > Layer")
      )
        .map((l) => traverseLayer(l))
        .filter(Boolean);

      if (rootLayer.querySelector(":scope > Name")) {
        const rootAsLayer = traverseLayer(rootLayer);
        if (rootAsLayer) firstLevelLayers.unshift(rootAsLayer);
      }

      return firstLevelLayers;
    }

    if (type.toLowerCase() === "wmts") {
      const wmtsLayers = await parseWMTSCapabilities(wmsOrWmtsUrl);
      return wmtsLayers.map((l) => ({
        ...l,
        type: "wmts",
        inputType: "checkbox",
        active: false,
        children: l.children || [],
        groupTitle: safeDatasetName,
        wmtsOptions: l.wmtsOptions,
      }));
    }

    console.warn(`[DataLayerCreate] Unsupported layer type: ${type}`);
    return [];
  } catch (err) {
    console.error(
      `[DataLayerCreate][${type.toUpperCase()}] Error fetching/parsing:`,
      err
    );
    return [];
  }
}
