//v6
// import axios from "axios";

// /**
// //  * Fetch WMS GetCapabilities and return dataLayers array compatible with useMapLayers
// //  * @param {string} wmsUrl - Full URL of WMS GetCapabilities
// //  * @param {string} groupTitle - Group title (like 'BAG' or 'Mombasa')
// //  */
// export async function DataLayerCreate(wmsUrl, groupTitle = "WMS Layer") {
//   // Ensure groupTitle is always a string
//   const safeGroupTitle = String(groupTitle || "WMS Layer");

//   try {
//     const response = await axios.get(wmsUrl);
//     const xmlString = response.data;

//     const parser = new DOMParser();
//     const xmlDoc = parser.parseFromString(xmlString, "text/xml");

//     const rootLayer = xmlDoc.querySelector("Capability > Layer");
//     if (!rootLayer) return [];

//     const traverseLayer = (layerNode) => {
//       const name = layerNode.querySelector(":scope > Name")?.textContent;
//       const title =
//         layerNode.querySelector(":scope > Title")?.textContent ||
//         name ||
//         "unknown";

//       // Parent layer defaults to checkbox
//       const parentLayer = {
//         id: name || title,
//         key: `${safeGroupTitle}:${name || title}`,
//         name: name || title,
//         title,
//         inputType: "checkbox",
//         type: "wms",
//         opacity: 100,
//         active: false,
//         sourceType: safeGroupTitle.toLowerCase() === "bag" ? "bag" : "wms",
//         children: [],
//         legendUrl: null,
//         groupTitle: safeGroupTitle,
//       };

//       const childNodes = Array.from(
//         layerNode.querySelectorAll(":scope > Layer")
//       );
//       parentLayer.children = childNodes
//         .map((child) => {
//           const childName = child.querySelector(":scope > Name")?.textContent;
//           if (!childName) return null;

//           const childTitle =
//             child.querySelector(":scope > Title")?.textContent || childName;

//           // If child has <Style>, treat as radiobutton; otherwise checkbox
//           const hasStyle = !!child.querySelector(":scope > Style");
//           const childStyleNode = child.querySelector(":scope > Style");
//           const childLegendNode = childStyleNode?.querySelector(
//             "LegendURL > OnlineResource"
//           );
//           const childLegendUrl =
//             childLegendNode?.getAttribute("xlink:href") || null;

//           return {
//             id: childName,
//             key: `${parentLayer.key}:${childName}`,
//             wmsLayerName: name || title,
//             name: childName,
//             title: childTitle,
//             inputType: hasStyle ? "radio" : "checkbox",
//             type: "wms",
//             opacity: 100,
//             active: false,
//             children: [],
//             sourceType: parentLayer.sourceType,
//             legendUrl: childLegendUrl,
//             groupTitle: safeGroupTitle,
//           };
//         })
//         .filter(Boolean);

//       // Extract legend URL for parent if available
//       const parentStyleNode = layerNode.querySelector(":scope > Style");
//       const parentLegendNode = parentStyleNode?.querySelector(
//         "LegendURL > OnlineResource"
//       );
//       if (parentLegendNode) {
//         parentLayer.legendUrl =
//           parentLegendNode.getAttribute("xlink:href") || null;
//       }

//       return parentLayer;
//     };

//     const firstLevelLayers = Array.from(
//       rootLayer.querySelectorAll(":scope > Layer")
//     )
//       .map(traverseLayer)
//       .filter(Boolean);

//     return firstLevelLayers;
//   } catch (err) {
//     console.error("Error fetching or parsing WMS GetCapabilities:", err);
//     return [];
//   }
// }

// v7
// import axios from "axios";

// /**
//  * Fetch WMS GetCapabilities and return dataLayers array compatible with useMapLayers
//  * Handles any depth of parent/child layers and styles, keeps each checkbox independent.
//  * @param {string} wmsUrl - Full URL of WMS GetCapabilities
//  * @param {string} datasetName - Name of dataset (used for Legend accordion)
//  */
// export async function DataLayerCreate(wmsUrl, datasetName = "WMS Layer") {
//   const safeDatasetName = String(datasetName || "WMS Layer");

//   try {
//     const response = await axios.get(wmsUrl);
//     const xmlString = response.data;
//     const parser = new DOMParser();
//     const xmlDoc = parser.parseFromString(xmlString, "text/xml");

//     const rootLayer = xmlDoc.querySelector("Capability > Layer");
//     if (!rootLayer) return [];

//     // Recursive function for any layer
//     // const traverseLayer = (layerNode, parentKey = "") => {
//     //   const name = layerNode.querySelector(":scope > Name")?.textContent;
//     //   const title =
//     //     layerNode.querySelector(":scope > Title")?.textContent ||
//     //     name ||
//     //     "unknown";

//     //   // Determine key prefix
//     //   const layerKey = parentKey
//     //     ? `${parentKey}:${name || title}`
//     //     : `${safeDatasetName}:${name || title}`;

//     //   // Extract legend URL if available
//     //   const styleNode = layerNode.querySelector(":scope > Style");
//     //   const legendNode = styleNode?.querySelector("LegendURL > OnlineResource");
//     //   const legendUrl = legendNode?.getAttribute("xlink:href") || null;

//     //   // Base layer object
//     //   const baseLayer = {
//     //     id: name || title,
//     //     key: layerKey,
//     //     wmsLayerName: name || title,
//     //     name: name || title,
//     //     title,
//     //     inputType: "checkbox",
//     //     type: "wms",
//     //     opacity: 100,
//     //     active: false,
//     //     sourceType: safeDatasetName.toLowerCase() === "bag" ? "bag" : "wms",
//     //     legendUrl,
//     //     children: [],
//     //     groupTitle: safeDatasetName, // dataset accordion
//     //   };

//     //   // Recursively handle children
//     //   const childNodes = Array.from(
//     //     layerNode.querySelectorAll(":scope > Layer")
//     //   );
//     //   childNodes.forEach((childNode) => {
//     //     const child = traverseLayer(childNode, layerKey);
//     //     if (child) baseLayer.children.push(child);
//     //   });

//     //   // Handle multiple styles as independent children
//     //   const styleNodes = Array.from(
//     //     layerNode.querySelectorAll(":scope > Style")
//     //   );
//     //   styleNodes.forEach((styleNode, idx) => {
//     //     const styleLegendNode = styleNode.querySelector(
//     //       "LegendURL > OnlineResource"
//     //     );
//     //     const styleLegendUrl =
//     //       styleLegendNode?.getAttribute("xlink:href") || null;
//     //     const styleName =
//     //       styleNode.querySelector(":scope > Name")?.textContent ||
//     //       `style-${idx}`;

//     //     baseLayer.children.push({
//     //       id: styleName,
//     //       key: `${layerKey}:style-${idx}`,
//     //       name: styleName,
//     //       title: styleName,
//     //       inputType: "radio", // styles as radio
//     //       type: "wms",
//     //       opacity: 100,
//     //       active: false,
//     //       children: [],
//     //       sourceType: baseLayer.sourceType,
//     //       legendUrl: styleLegendUrl,
//     //       groupTitle: safeDatasetName,
//     //     });
//     //   });

//     //   return baseLayer;
//     // };

//     const traverseLayer = (layerNode, parentKey = "", datasetName) => {
//       const name = layerNode.querySelector(":scope > Name")?.textContent;
//       const title =
//         layerNode.querySelector(":scope > Title")?.textContent ||
//         name ||
//         "unknown";

//       const layerKey = parentKey
//         ? `${parentKey}-${name || title}`
//         : `${datasetName}-${name || title}`;

//       const styleNode = layerNode.querySelector(":scope > Style");
//       const legendNode = styleNode?.querySelector("LegendURL > OnlineResource");
//       const legendUrl = legendNode?.getAttribute("xlink:href") || null;

//       const baseLayer = {
//         id: name || title, // OL / WMS identity
//         wmsLayerName: name || title, // used in addMapLayer
//         key: layerKey, // React list key
//         title,
//         inputType: "checkbox",
//         type: "wms",
//         opacity: 100,
//         active: false,
//         sourceType: datasetName.toLowerCase() === "bag" ? "bag" : "wms",
//         legendUrl,
//         children: [],
//         groupTitle: datasetName,
//       };

//       // Recursively handle children
//       const childNodes = Array.from(
//         layerNode.querySelectorAll(":scope > Layer")
//       );
//       childNodes.forEach((childNode) => {
//         const child = traverseLayer(childNode, layerKey, datasetName);
//         if (child) baseLayer.children.push(child);
//       });

//       // Handle styles as separate radio children
//       const styleNodes = Array.from(
//         layerNode.querySelectorAll(":scope > Style")
//       );
//       styleNodes.forEach((styleNode, idx) => {
//         const styleLegendNode = styleNode.querySelector(
//           "LegendURL > OnlineResource"
//         );
//         const styleLegendUrl =
//           styleLegendNode?.getAttribute("xlink:href") || null;
//         const styleName =
//           styleNode.querySelector(":scope > Name")?.textContent ||
//           `style-${idx}`;

//         baseLayer.children.push({
//           id: styleName, // OL/WMS identity
//           wmsLayerName: name || title, // parent WMS layer
//           key: `${layerKey}-style-${idx}`, // React key
//           name: styleName,
//           title: styleName,
//           inputType: "radio",
//           type: "wms",
//           opacity: 100,
//           active: false,
//           children: [],
//           sourceType: baseLayer.sourceType,
//           legendUrl: styleLegendUrl,
//           groupTitle: datasetName,
//         });
//       });

//       return baseLayer;
//     };

//     // Traverse all first-level layers under root

//     const firstLevelLayers = Array.from(
//       rootLayer.querySelectorAll(":scope > Layer")
//     )
//       .map((layerNode) => traverseLayer(layerNode, "", safeDatasetName))
//       .filter(Boolean);

//     return firstLevelLayers;
//   } catch (err) {
//     console.error("Error fetching or parsing WMS GetCapabilities:", err);
//     return [];
//   }
// }
