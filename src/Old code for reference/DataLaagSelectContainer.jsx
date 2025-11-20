// import React, { useEffect, useRef, useState } from "react";
// import { FiLayers } from "react-icons/fi";
// import { Switch } from "../style_components/FormStyles";
// import Accordion from "../style_components/Accordion";

// import {
//   DataLaagSelectContainer,
//   DataLaagSelectPanel,
//   Header,
//   TopRow,
//   TitleGroup,
//   SwitchGroup,
//   FilterInput,
//   Content,
//   BottomSpacer,
//   NoResults,
// } from "../style_components/DataLaagSelectContainerStyle";

// import Spinner from "../style_components/Spinner";

// function findLayerById(groupId, layerId, dataLayers) {
//   const group = dataLayers.find((g) => g.id === groupId);
//   if (!group) return null;

//   const search = (layers) => {
//     for (const layer of layers) {
//       if (layer.id === layerId) return layer;
//       if (layer.children?.length) {
//         const found = search(layer.children);
//         if (found) return found;
//       }
//     }
//     return null;
//   };

//   return search(group.children || []);
// }

// export default function DataLaagSelect({
//   isOpen,
//   setActivePanel,
//   dataLayers,
//   setLayerActive,
//   mapRef,
//   wmsWmtsLayersRef,
//   currentProjectionCode,
// }) {
//   const panelRef = useRef(null);
//   const [showOnlyActive, setShowOnlyActive] = useState(false);
//   const [filterQuery, setFilterQuery] = useState("");
//   const [loadingLayers, setLoadingLayers] = useState({});

//   // ----------------------------
//   // Close panel on outside click
//   // ----------------------------
//   useEffect(() => {
//     const handleClickOutside = (e) => {
//       if (panelRef.current && !panelRef.current.contains(e.target)) {
//         setActivePanel(null);
//       }
//     };
//     if (isOpen) document.addEventListener("mousedown", handleClickOutside);
//     return () => document.removeEventListener("mousedown", handleClickOutside);
//   }, [isOpen, setActivePanel]);

//   // ----------------------------
//   // Toggle layer
//   // ----------------------------
//   // const onToggleLayer = async (groupId, layerId, inputType) => {
//   //   if (!setLayerActive || !mapRef?.current) return;

//   //   const layerKey = `${groupId}:${layerId}`;

//   //   // Start spinner
//   //   setLoadingLayers((prev) => ({ ...prev, [layerKey]: true }));

//   //   try {
//   //     // This is async, so the spinner shows until it resolves
//   //     await setLayerActive(mapRef.current, groupId, layerId, inputType);
//   //   } finally {
//   //     // Stop spinner
//   //     setLoadingLayers((prev) => ({ ...prev, [layerKey]: false }));
//   //   }
//   // };

//   const onToggleLayer = async (groupId, layerId, inputType) => {
//     if (!setLayerActive || !mapRef?.current) return;

//     const layer = findLayerById(groupId, layerId, dataLayers); // from flattened data
//     if (!layer) return;

//     // Spinner
//     setLoadingLayers((prev) => ({ ...prev, [layer.key]: true }));

//     try {
//       // Pass OL/WMS layerName for addMapLayer
//       await setLayerActive(
//         mapRef.current,
//         groupId,
//         layer.id, // OL identity
//         inputType,
//         layer.wmsLayerName // WMS name
//       );
//     } finally {
//       setLoadingLayers((prev) => ({ ...prev, [layer.key]: false }));
//     }
//   };

//   // ----------------------------
//   // Filter layers recursively
//   // ----------------------------
//   const filterGroup = (group) => {
//     const filteredChildren = (group.children || [])
//       .map((child) => filterGroup(child))
//       .filter(Boolean);

//     const matchesGroupTitle = group.title
//       ?.toLowerCase()
//       .includes(filterQuery.toLowerCase());

//     if (showOnlyActive) {
//       return filteredChildren.length > 0 || group.active
//         ? { ...group, children: filteredChildren }
//         : null;
//     }

//     return matchesGroupTitle || filteredChildren.length > 0
//       ? {
//           ...group,
//           children: matchesGroupTitle ? group.children : filteredChildren,
//         }
//       : null;
//   };

//   const filteredDataLayers = (dataLayers || [])
//     .map(filterGroup)
//     .filter(Boolean);

//   // ----------------------------
//   // Recursive render
//   // ----------------------------
//   const renderLayer = (layer, groupId, level = 0) => {
//     const inputId = `input-${layer.key || layer.id}`;

//     return (
//       <div key={inputId} style={{ marginLeft: level * 16, marginBottom: 6 }}>
//         <label style={{ display: "flex", alignItems: "center", gap: 8 }}>
//           <input
//             id={inputId}
//             type={layer.inputType || "checkbox"}
//             checked={!!layer.active}
//             disabled={!!loadingLayers[`${groupId}:${layer.id}`]}
//             onChange={() => onToggleLayer(groupId, layer.id, layer.inputType)}
//           />
//           {layer.title || "Untitled"}
//           {loadingLayers[`${groupId}:${layer.id}`] && <Spinner size={14} />}
//         </label>

//         {layer.active &&
//           layer.children &&
//           layer.children.map((child) => renderLayer(child, groupId, level + 1))}
//       </div>
//     );
//   };

//   return (
//     <DataLaagSelectContainer>
//       <DataLaagSelectPanel ref={panelRef} $isOpen={isOpen}>
//         <Header>
//           <TopRow>
//             <TitleGroup>
//               <FiLayers size={20} />
//               <h1>Data Layers</h1>
//             </TitleGroup>

//             <SwitchGroup>
//               <Switch
//                 checked={showOnlyActive}
//                 onChange={() => setShowOnlyActive(!showOnlyActive)}
//               />
//               <span>Show active only</span>
//             </SwitchGroup>
//           </TopRow>

//           <FilterInput
//             type="text"
//             placeholder="Filter layers..."
//             value={filterQuery}
//             onChange={(e) => setFilterQuery(e.target.value)}
//           />
//         </Header>

//         <Content>
//           {filteredDataLayers.length > 0 ? (
//             filteredDataLayers.map((group) => (
//               <Accordion key={group.id} title={group.title}>
//                 {group.children.map((layer) => renderLayer(layer, group.id))}
//               </Accordion>
//             ))
//           ) : (
//             <NoResults>No results found</NoResults>
//           )}
//         </Content>
//         <BottomSpacer />
//       </DataLaagSelectPanel>
//     </DataLaagSelectContainer>
//   );
// }

// ----------------------------
// Toggle layer (with optional style)
// ----------------------------

// const onToggleLayer = async (groupId, layerId, inputType, style = null) => {
//   if (!setLayerActive || !mapRef?.current) return;

//   const layer = findLayerById(groupId, layerId, dataLayers);
//   if (!layer) return;

//   // Spinner
//   setLoadingLayers((prev) => ({ ...prev, [layer.key]: true }));

//   try {
//     // Pass style if provided
//     await setLayerActive(
//       mapRef.current,
//       groupId,
//       layer.id,
//       inputType,
//       layer.wmsLayerName,
//       style
//     );
//   } finally {
//     setLoadingLayers((prev) => ({ ...prev, [layer.key]: false }));
//   }
// };

// const onToggleLayer = async (groupId, layerId, inputType, style = null) => {
//   console.log("[onToggleLayer] called", {
//     groupId,
//     layerId,
//     inputType,
//     style,
//   });
//   if (!setLayerActive || !mapRef?.current) return;

//   const layer = findLayerById(groupId, layerId, dataLayers);
//   if (!layer) {
//     console.warn("[onToggleLayer] layer not found", { groupId, layerId });
//     return;
//   }

//   console.log("[onToggleLayer] layer found", layer);

//   setLoadingLayers((prev) => ({ ...prev, [`${groupId}:${layer.id}`]: true }));

//   try {
//     await setLayerActive(
//       mapRef.current,
//       groupId,
//       layerId,
//       inputType,
//       layer.wmsLayerName,
//       style
//     );
//     console.log("[onToggleLayer] setLayerActive done");
//   } finally {
//     setLoadingLayers((prev) => ({
//       ...prev,
//       [`${groupId}:${layer.id}`]: false,
//     }));
//     console.log("[onToggleLayer] spinner cleared");
//   }
// };

// const onToggleLayer = async (groupId, layerId, inputType, style = null) => {
//   console.log("[onToggleLayer] called", {
//     groupId,
//     layerId,
//     inputType,
//     style,
//   });

//   if (!setLayerActive || !mapRef?.current) return;

//   const layer = findLayerById(groupId, layerId, dataLayers);
//   if (!layer) {
//     console.warn("[onToggleLayer] layer not found", { groupId, layerId });
//     return;
//   }

//   console.log("[onToggleLayer] layer found", layer);

//   // If this layer is a "style child", update the parent layer ID
//   const actualLayerId = layer.parentId || layer.id;

//   setLoadingLayers((prev) => ({
//     ...prev,
//     [`${groupId}:${actualLayerId}`]: true,
//   }));

//   try {
//     await setLayerActive(
//       mapRef.current,
//       groupId,
//       actualLayerId,
//       inputType,
//       layer.wmsLayerName,
//       style
//     );
//     console.log("[onToggleLayer] setLayerActive done");
//   } finally {
//     setLoadingLayers((prev) => ({
//       ...prev,
//       [`${groupId}:${actualLayerId}`]: false,
//     }));
//     console.log("[onToggleLayer] spinner cleared");
//   }
// };

//Working version
// const onToggleLayer = async (groupId, layerId, inputType, style = null) => {
//   if (!setLayerActive || !mapRef?.current) return;

//   const layer = findLayerById(groupId, layerId, dataLayers);
//   if (!layer) return;

//   if (inputType === "radio" && style) {
//     setActiveStyles((prev) => ({ ...prev, [layer.id]: style }));
//   }

//   setLoadingLayers((prev) => ({
//     ...prev,
//     [`${groupId}:${layerId}`]: true,
//   }));

//   try {
//     await setLayerActive(mapRef.current, groupId, layerId, inputType, style);
//   } finally {
//     setLoadingLayers((prev) => ({
//       ...prev,
//       [`${groupId}:${layerId}`]: false,
//     }));
//   }
// };

// const onToggleLayer = (groupId, layerId, type, styleName) => {
//   setDataLayers((prev) =>
//     prev.map((group) =>
//       group.id === groupId
//         ? {
//             ...group,
//             children: group.children.map((layer) =>
//               layer.id === layerId
//                 ? {
//                     ...layer,
//                     active:
//                       type === "checkbox" ? !layer.active : layer.active,
//                   }
//                 : layer
//             ),
//           }
//         : group
//     )
//   );

//   if (type === "radio") {
//     setActiveStyles((prev) => ({
//       ...prev,
//       [layerId]: styleName,
//     }));

//     // update OL layer style param
//     const olLayer = mapRef.current
//       .getLayers()
//       .getArray()
//       .find((l) => l.get("id") === layerId);

//     if (olLayer) {
//       olLayer.getSource().updateParams({ STYLES: styleName });
//     }
//   }

//   if (type === "checkbox") {
//     // toggle add/remove layer from map
//     setLayerActive(mapRef.current, groupId, layerId, type);
//   }
// };

// const onToggleLayer = (groupId, layerId, type, styleName) => {
//   if (type === "radio") {
//     setActiveStyles((prev) => ({
//       ...prev,
//       [layerId]: styleName,
//     }));

//     // update OL layer style param
//     const olLayer = mapRef.current
//       .getLayers()
//       .getArray()
//       .find((l) => l.get("id") === layerId);

//     if (olLayer) {
//       olLayer.getSource().updateParams({ STYLES: styleName });
//     }
//   }

//   if (type === "checkbox") {
//     // toggle add/remove layer from map AND update active in state
//     setLayerActive(mapRef.current, groupId, layerId, type);
//   }
// };

// const onToggleLayer = (groupId, layerId, type, styleName) => {
//   const layer = findLayerById(groupId, layerId, dataLayers);
//   if (!layer) return;

//   if (type === "radio") {
//     // Update state
//     setActiveStyles((prev) => ({
//       ...prev,
//       [layerId]: styleName,
//     }));

//     // Only update map if layer is active
//     if (layer.active) {
//       setLayerActive(mapRef.current, groupId, layerId, "checkbox", styleName);
//     }
//   }

//   if (type === "checkbox") {
//     // Toggle parent layer
//     setLayerActive(mapRef.current, groupId, layerId, "checkbox");

//     // If turning off, clear activeStyles for this layer
//     if (layer.active) {
//       setActiveStyles((prev) => {
//         const copy = { ...prev };
//         delete copy[layerId];
//         return copy;
//       });
//     }
//   }
// };

// const onToggleLayer = (groupId, layerId, type, styleName) => {
//   const layer = findLayerById(groupId, layerId, dataLayers);
//   if (!layer) return;

//   if (type === "checkbox") {
//     // toggle parent layer
//     setLayerActive(mapRef.current, groupId, layerId, "checkbox");

//     // Clear activeStyles if turning off
//     if (layer.active) {
//       setActiveStyles((prev) => {
//         const copy = { ...prev };
//         delete copy[layerId];
//         return copy;
//       });
//     } else {
//       // If parent has radio children, keep the first child as default style
//       if (layer.children?.length) {
//         const firstStyleChild = layer.children.find(
//           (c) => c.inputType === "radio"
//         );
//         if (firstStyleChild) {
//           setActiveStyles((prev) => ({
//             ...prev,
//             [layerId]: firstStyleChild.styleName || firstStyleChild.id,
//           }));

//           const olLayer = wmsWmtsLayersRef.current[layerId];
//           if (olLayer) {
//             olLayer.getSource().updateParams({
//               STYLES: firstStyleChild.styleName || firstStyleChild.id,
//             });
//           }

//           // mark first child active
//           setDataLayers((prev) =>
//             prev.map((group) =>
//               group.id === groupId
//                 ? {
//                     ...group,
//                     children: group.children.map((l) =>
//                       l.id === layerId
//                         ? {
//                             ...l,
//                             children: l.children.map((c) => ({
//                               ...c,
//                               active: c.id === firstStyleChild.id,
//                             })),
//                           }
//                         : l
//                     ),
//                   }
//                 : group
//             )
//           );
//         }
//       }
//     }
//   }

//   if (type === "radio") {
//     // Only update style if parent is active
//     const parentLayer = layer.parentId
//       ? findLayerById(groupId, layer.parentId, dataLayers)
//       : layer;

//     if (!parentLayer?.active) {
//       console.log("[onToggleLayer] parent not active, skipping style change");
//       return;
//     }

//     // update activeStyles
//     setActiveStyles((prev) => ({
//       ...prev,
//       [parentLayer.id]: styleName,
//     }));

//     // update OL layer STYLES
//     const olLayer = wmsWmtsLayersRef.current[parentLayer.id];
//     if (olLayer) {
//       olLayer.getSource().updateParams({ STYLES: styleName });
//     }

//     // mark only clicked child as active
//     setDataLayers((prev) =>
//       prev.map((group) =>
//         group.id === groupId
//           ? {
//               ...group,
//               children: group.children.map((l) =>
//                 l.id === parentLayer.id
//                   ? {
//                       ...l,
//                       children: l.children.map((c) => ({
//                         ...c,
//                         active: c.id === layerId,
//                       })),
//                     }
//                   : l
//               ),
//             }
//           : group
//       )
//     );
//   }
// };

// ----------------------------
// Recursive render
// ----------------------------
// const renderLayer = (layer, groupId, level = 0, parentActive = true) => {
//   const inputId = `input-${layer.key || layer.id}`;
//   const layerEnabled = !!layer.active && parentActive;

//   return (
//     <div
//       key={inputId}
//       style={{ marginLeft: level * 20, marginBottom: 10, marginTop: 10 }}
//     >
//       <label style={{ display: "flex", alignItems: "center", gap: 8 }}>
//         <input
//           id={inputId}
//           type={layer.inputType || "checkbox"}
//           checked={!!layer.active}
//           disabled={!!loadingLayers[`${groupId}:${layer.id}`]}
//           onChange={() => onToggleLayer(groupId, layer.id, layer.inputType)}
//         />
//         {layer.title || "Untitled"}
//         {loadingLayers[`${groupId}:${layer.id}`] && <Spinner size={14} />}
//       </label>

//       {/* Render style selector if layer has styles */}
//       {layer.styles && layer.active && (
//         <div style={{ marginLeft: 5, marginTop: 4, marginBottom: 10 }}>
//           {layer.styles.map((s) => (
//             <label key={s} style={{ marginRight: 8 }}>
//               <input
//                 type="radio"
//                 name={`style-${layer.id}`}
//                 value={s}
//                 checked={layer.style === s}
//                 onChange={() =>
//                   onToggleLayer(groupId, layer.id, layer.inputType, s)
//                 }
//               />
//               {s}
//             </label>
//           ))}
//         </div>
//       )}

//       {/* Render children independently */}
//       {layer.children &&
//         layer.children.map((child) =>
//           renderLayer(child, groupId, level + 1, layerEnabled)
//         )}
//     </div>
//   );
// };

// const renderLayer = (layer, groupId, level = 0, parentActive = true) => {
//   const inputId = `input-${layer.key || layer.id}`;
//   const layerEnabled = !!layer.active && parentActive;

//   return (
//     <div key={inputId} style={{ marginBottom: 10 }}>
//       {/* Checkbox row (indented) */}
//       <div
//         style={{
//           marginLeft: level * 20,
//           display: "flex",
//           alignItems: "center",
//           gap: 8,
//         }}
//       >
//         <input
//           id={inputId}
//           type={layer.inputType || "checkbox"}
//           checked={!!layer.active}
//           disabled={!!loadingLayers[`${groupId}:${layer.id}`]}
//           onChange={() => onToggleLayer(groupId, layer.id, layer.inputType)}
//         />
//         <label htmlFor={inputId}>{layer.title || "Untitled"}</label>
//         {loadingLayers[`${groupId}:${layer.id}`] && <Spinner size={14} />}
//       </div>

//       {/* Styles row (extra indent, but independent) */}
//       {layer.styles && layer.active && (
//         <div style={{ marginLeft: level * 20 + 20, marginTop: 6 }}>
//           {layer.styles.map((s) => (
//             <label key={s} style={{ marginRight: 12 }}>
//               <input
//                 type="radio"
//                 name={`style-${layer.id}`} // group radios per layer
//                 value={s}
//                 checked={layer.style === s}
//                 onChange={
//                   () => onToggleLayer(groupId, layer.id, "radio", s) // <-- must update layer.style in state
//                 }
//               />
//               {s}
//             </label>
//           ))}
//         </div>
//       )}

//       {/* Children */}
//       {layer.children &&
//         layer.children.map((child) =>
//           renderLayer(child, groupId, level + 1, layerEnabled)
//         )}
//     </div>
//   );
// };

/// new code 8-10-2025
// const onToggleLayer = (groupId, layerId, type, styleName = null) => {
//   const layer = findLayerById(groupId, layerId, dataLayers);
//   if (!layer) return;

//   if (type === "checkbox") {
//     setLayerActive(mapRef.current, groupId, layerId, "checkbox");

//     if (layer.active) {
//       setActiveStyles((prev) => {
//         const copy = { ...prev };
//         delete copy[layerId];
//         return copy;
//       });
//     }
//   }

//   if (type === "radio") {
//     const parentLayerFull = dataLayers
//       .find((g) => g.id === groupId)
//       ?.children.find((l) => l.children?.some((c) => c.id === layerId));

//     if (!parentLayerFull) return;

//     const parentId = parentLayerFull.id;
//     const parentActive = parentLayerFull.active;

//     // 1️⃣ Update UI state
//     setDataLayers((prev) =>
//       prev.map((group) =>
//         group.id === groupId
//           ? {
//               ...group,
//               children: group.children.map((l) =>
//                 l.id === parentId
//                   ? {
//                       ...l,
//                       children: l.children.map((c) => ({
//                         ...c,
//                         active: c.id === layerId,
//                       })),
//                     }
//                   : l
//               ),
//             }
//           : group
//       )
//     );

//     // 2️⃣ Save active style
//     setActiveStyles((prev) => ({ ...prev, [parentId]: styleName }));

//     // 3️⃣ Update OL WMS params dynamically
//     if (parentActive) {
//       const olLayerKey = `${groupId}:${parentId}`;
//       const olLayer = wmsWmtsLayersRef.current[olLayerKey];
//       if (olLayer && olLayer.getSource) {
//         // Get style dynamically if available
//         const availableStyles = wmsCapabilities[parentId] || [];
//         const styleObj =
//           availableStyles.find((s) => s.name.endsWith(styleName)) || {};

//         const params = olLayer.getSource().getParams();
//         olLayer.getSource().updateParams({
//           ...params,
//           STYLES: styleObj.name || styleName, // fallback to provided styleName
//         });
//         olLayer.getSource().refresh();
//       }
//     }
//   }
// };

// const onToggleLayer = (groupId, layerId, type, styleName = null) => {
//   const layer = findLayerById(groupId, layerId, dataLayers);
//   if (!layer) return;

//   console.log(
//     "[TOGGLE] type:",
//     type,
//     "layerId:",
//     layerId,
//     "style:",
//     styleName
//   );

//   if (type === "checkbox") {
//     setLayerActive(mapRef.current, groupId, layerId, "checkbox");

//     if (layer.active) {
//       setActiveStyles((prev) => {
//         const copy = { ...prev };
//         delete copy[layerId];
//         return copy;
//       });
//     }
//   }

//   if (type === "radio") {
//     const parentLayerFull = dataLayers
//       .find((g) => g.id === groupId)
//       ?.children.find((l) => l.children?.some((c) => c.id === layerId));

//     if (!parentLayerFull) {
//       console.warn("[TOGGLE][radio] Cannot find parent layer for", layerId);
//       return;
//     }

//     const parentId = parentLayerFull.id;
//     console.log(
//       "[TOGGLE][radio] parentId:",
//       parentId,
//       "parent active?",
//       parentLayerFull.active
//     );

//     // 1️⃣ Update UI state
//     setDataLayers((prev) =>
//       prev.map((group) =>
//         group.id === groupId
//           ? {
//               ...group,
//               children: group.children.map((l) =>
//                 l.id === parentId
//                   ? {
//                       ...l,
//                       children: l.children.map((c) => ({
//                         ...c,
//                         active: c.id === layerId,
//                       })),
//                     }
//                   : l
//               ),
//             }
//           : group
//       )
//     );

//     // 2️⃣ Save active style
//     setActiveStyles((prev) => ({ ...prev, [parentId]: styleName }));

//     // 3️⃣ Update OL WMS params **after next tick** to ensure state is updated
//     setTimeout(() => {
//       const olLayerKey = `${groupId}:${parentId}`;
//       const olLayer = wmsWmtsLayersRef.current[olLayerKey];

//       if (!olLayer) {
//         console.warn("[TOGGLE][radio] No OL layer found for", olLayerKey);
//         return;
//       }

//       const params = olLayer.getSource().getParams();
//       const availableStyles = wmsCapabilities[parentId] || [];
//       const styleObj =
//         availableStyles.find((s) => s.name.endsWith(styleName)) || {};

//       console.log("[TOGGLE][radio] Updating OL WMS params for", olLayerKey, {
//         oldParams: params,
//         newStyle: styleObj.name || styleName,
//       });

//       olLayer.getSource().updateParams({
//         ...params,
//         STYLES: styleObj.name || styleName,
//       });
//       olLayer.getSource().refresh();
//     }, 0);
//   }
// };

// const onToggleLayer = (groupId, layerId, type, styleName = null) => {
//   const layer = findLayerById(groupId, layerId, dataLayers);
//   if (!layer) return;

//   console.log(
//     "[TOGGLE] type:",
//     type,
//     "layerId:",
//     layerId,
//     "style:",
//     styleName
//   );

//   if (type === "checkbox") {
//     setLayerActive(mapRef.current, groupId, layerId, "checkbox");

//     if (layer.active) {
//       setActiveStyles((prev) => {
//         const copy = { ...prev };
//         delete copy[layerId];
//         return copy;
//       });
//     }
//     return;
//   }

//   if (type === "radio") {
//     // 1️⃣ Find parent layer that holds this radio child
//     const parentLayerFull = dataLayers
//       .find((g) => g.id === groupId)
//       ?.children.find((l) => l.children?.some((c) => c.id === layerId));

//     if (!parentLayerFull) {
//       console.warn("[TOGGLE][radio] Cannot find parent for:", layerId);
//       return;
//     }

//     const parentId = parentLayerFull.id;
//     const parentActive = parentLayerFull.active;

//     console.log(
//       "[TOGGLE][radio] parentId:",
//       parentId,
//       "parent active?",
//       parentActive
//     );

//     // 2️⃣ Update UI state: mark only this radio child as active
//     setDataLayers((prev) =>
//       prev.map((group) =>
//         group.id === groupId
//           ? {
//               ...group,
//               children: group.children.map((l) =>
//                 l.id === parentId
//                   ? {
//                       ...l,
//                       children: l.children.map((c) => ({
//                         ...c,
//                         active: c.id === layerId,
//                       })),
//                     }
//                   : l
//               ),
//             }
//           : group
//       )
//     );

//     // 3️⃣ Save active style for parent
//     setActiveStyles((prev) => ({ ...prev, [parentId]: styleName }));

//     // 4️⃣ Update OL WMS layer if parent is active
//     if (parentActive) {
//       const olLayerKey = `${groupId}:${parentId}`;
//       const olLayer = wmsWmtsLayersRef.current[olLayerKey];

//       if (!olLayer || !olLayer.getSource) {
//         console.warn("[TOGGLE][radio] OL layer not found for:", olLayerKey);
//         return;
//       }

//       const source = olLayer.getSource();
//       const params = source.getParams();

//       // ✅ Get available styles dynamically from wmsCapabilities
//       const availableStyles = wmsCapabilities[parentId] || [];
//       let validStyleName = styleName;

//       // match style exactly if exists
//       const styleObj = availableStyles.find((s) =>
//         s.name.endsWith(styleName)
//       );
//       if (styleObj?.name) {
//         validStyleName = styleObj.name;
//       }

//       // normalize style for PDOK WMS (remove prefix if any)
//       if (validStyleName.includes(":")) {
//         validStyleName = validStyleName.split(":")[1];
//       }

//       const newParams = { ...params, STYLES: validStyleName };
//       console.log("[TOGGLE][radio] Updating OL WMS params for", olLayerKey, {
//         oldParams: params,
//         newStyle: validStyleName,
//       });

//       source.updateParams(newParams);
//       source.refresh();

//       // log after refresh
//       console.log("[OL WMS] New params:", source.getParams());
//     } else {
//       console.log("[TOGGLE][radio] parent not active, skipping OL update");
//     }
//   }
// };

// const onToggleLayer = (groupId, layerId, type, styleName = null) => {
//   const layer = findLayerById(groupId, layerId, dataLayers);
//   if (!layer) return;

//   console.log(
//     "[TOGGLE] type:",
//     type,
//     "layerId:",
//     layerId,
//     "style:",
//     styleName
//   );

//   if (type === "checkbox") {
//     setLayerActive(mapRef.current, groupId, layerId, "checkbox");

//     if (layer.active) {
//       setActiveStyles((prev) => {
//         const copy = { ...prev };
//         delete copy[layerId];
//         return copy;
//       });
//     }
//     return;
//   }

//   if (type === "radio") {
//     // Find parent layer in OL layers
//     let parentId = null;
//     let olLayerKey = null;
//     for (const key of Object.keys(wmsWmtsLayersRef.current)) {
//       const [gId, lId] = key.split(":");
//       const parentLayer = findLayerById(gId, lId, dataLayers);
//       if (parentLayer?.children?.some((c) => c.id === layerId)) {
//         parentId = lId;
//         olLayerKey = key;
//         break;
//       }
//     }

//     if (!parentId) return;

//     // Update UI
//     setDataLayers((prev) =>
//       prev.map((group) =>
//         group.id === groupId
//           ? {
//               ...group,
//               children: group.children.map((l) =>
//                 l.id === parentId
//                   ? {
//                       ...l,
//                       children: l.children.map((c) => ({
//                         ...c,
//                         active: c.id === layerId,
//                       })),
//                     }
//                   : l
//               ),
//             }
//           : group
//       )
//     );

//     setActiveStyles((prev) => ({ ...prev, [parentId]: styleName }));

//     // Update OL WMS layer
//     const olLayer = wmsWmtsLayersRef.current[olLayerKey];
//     if (!olLayer?.getSource) return;

//     const source = olLayer.getSource();
//     const params = source.getParams();

//     // ✅ Use full style name from capabilities, don’t strip prefix
//     const availableStyles = wmsCapabilities[parentId] || [];
//     let validStyleName =
//       availableStyles.find((s) => s.name === styleName)?.name || styleName;

//     source.updateParams({ ...params, STYLES: validStyleName });
//     source.refresh();

//     console.log(
//       "[TOGGLE][radio] OL WMS updated:",
//       olLayerKey,
//       validStyleName
//     );
//   }
// };

/* 9-10-2025 */
//-----works------//
// const onToggleLayer = (
//   groupId,
//   layerId,
//   type,
//   styleName = null,
//   parentIdOverride = null
// ) => {
//   const layer = findLayerById(groupId, layerId, dataLayers);
//   if (!layer) return;

//   console.log(
//     "[TOGGLE] type:",
//     type,
//     "layerId:",
//     layerId,
//     "style:",
//     styleName
//   );

//   if (type === "checkbox") {
//     // Toggle layer active state on map
//     setLayerActive(mapRef.current, groupId, layerId, "checkbox");

//     // Remove active style if layer turned off
//     if (layer.active) {
//       setActiveStyles((prev) => {
//         const copy = { ...prev };
//         delete copy[layerId];
//         return copy;
//       });
//     }
//     return;
//   }

//   if (type === "radio") {
//     // Determine parent layer id
//     const parentId = parentIdOverride || layer.parentId;
//     if (!parentId) {
//       console.warn("[TOGGLE][radio] No parentId for layer:", layerId);
//       return;
//     }

//     // Update UI: only this radio child is active
//     setDataLayers((prev) =>
//       prev.map((group) =>
//         group.id === groupId
//           ? {
//               ...group,
//               children: group.children.map((l) =>
//                 l.id === parentId
//                   ? {
//                       ...l,
//                       children: l.children.map((c) => ({
//                         ...c,
//                         active: c.id === layerId,
//                       })),
//                     }
//                   : l
//               ),
//             }
//           : group
//       )
//     );

//     // Save active style for parent
//     setActiveStyles((prev) => ({ ...prev, [parentId]: styleName }));

//     // Update OL WMS style if parent layer is active
//     const parentLayer = findLayerById(groupId, parentId, dataLayers);
//     if (parentLayer?.active) {
//       const olLayerKey = `${groupId}:${parentId}`;
//       const olLayer = wmsWmtsLayersRef.current[olLayerKey];

//       if (!olLayer || !olLayer.getSource) {
//         console.warn("[TOGGLE][radio] OL layer not found:", olLayerKey);
//         return;
//       }

//       const source = olLayer.getSource();
//       const params = source.getParams();

//       // Use exact style name from UI (no endsWith or split)
//       const newParams = { ...params, STYLES: styleName };
//       console.log("[TOGGLE][radio] Updating OL WMS params for", olLayerKey, {
//         oldParams: params,
//         newStyle: styleName,
//       });

//       source.updateParams(newParams);
//       source.refresh();
//       console.log("[OL WMS] New params:", source.getParams());
//     }
//   }
// };

//------new------//
// const onToggleLayer = (
//   groupId,
//   layerId,
//   type,
//   styleName = null,
//   parentIdOverride = null
// ) => {
//   const layer = findLayerById(groupId, layerId, dataLayers);
//   if (!layer) return;

//   console.log(
//     "[TOGGLE] type:",
//     type,
//     "layerId:",
//     layerId,
//     "style:",
//     styleName
//   );

//   if (type === "checkbox") {
//     // Toggle layer active state on map
//     setLayerActive(mapRef.current, groupId, layerId, "checkbox");

//     // When turning off a parent layer, also deactivate any active styles (radio children)
//     if (layer.active) {
//       setActiveStyles((prev) => {
//         const copy = { ...prev };
//         delete copy[layerId];
//         return copy;
//       });

//       // Deactivate radio children in dataLayers UI
//       setDataLayers((prev) =>
//         prev.map((group) =>
//           group.id === groupId
//             ? {
//                 ...group,
//                 children: group.children.map((l) =>
//                   l.id === layerId
//                     ? {
//                         ...l,
//                         children: l.children.map((c) =>
//                           c.inputType === "radio"
//                             ? { ...c, active: false }
//                             : c
//                         ),
//                       }
//                     : l
//                 ),
//               }
//             : group
//         )
//       );
//     }

//     return;
//   }

//   if (type === "radio") {
//     const parentId = parentIdOverride || layer.parentId;
//     if (!parentId) {
//       console.warn("[TOGGLE][radio] No parentId for layer:", layerId);
//       return;
//     }

//     // Update UI: only this radio child is active
//     setDataLayers((prev) =>
//       prev.map((group) =>
//         group.id === groupId
//           ? {
//               ...group,
//               children: group.children.map((l) =>
//                 l.id === parentId
//                   ? {
//                       ...l,
//                       children: l.children.map((c) => ({
//                         ...c,
//                         active: c.id === layerId,
//                       })),
//                     }
//                   : l
//               ),
//             }
//           : group
//       )
//     );

//     // Save active style for parent
//     setActiveStyles((prev) => ({ ...prev, [parentId]: styleName }));

//     // Update OL WMS style if parent layer is active
//     const parentLayer = findLayerById(groupId, parentId, dataLayers);
//     if (parentLayer?.active) {
//       const olLayerKey = `${groupId}:${parentId}`;
//       const olLayer = wmsWmtsLayersRef.current[olLayerKey];

//       if (!olLayer || !olLayer.getSource) {
//         console.warn("[TOGGLE][radio] OL layer not found:", olLayerKey);
//         return;
//       }

//       const source = olLayer.getSource();
//       const params = source.getParams();
//       const newParams = { ...params, STYLES: styleName };

//       console.log("[TOGGLE][radio] Updating OL WMS params for", olLayerKey, {
//         oldParams: params,
//         newStyle: styleName,
//       });

//       source.updateParams(newParams);
//       source.refresh();
//       console.log("[OL WMS] New params:", source.getParams());
//     }
//   }
// };

// const onToggleLayer = (
//   groupId,
//   layerId,
//   type,
//   styleName = null,
//   parentIdOverride = null
// ) => {
//   const layer = findLayerById(groupId, layerId, dataLayers);
//   if (!layer) return;

//   console.log("[TOGGLE]", { type, layerId, style: styleName });

//   if (type === "checkbox") {
//     // Toggle layer active state
//     setLayerActive(mapRef.current, groupId, layerId, "checkbox");

//     // If turning OFF → deactivate any active styles too
//     if (layer.active) {
//       setActiveStyles((prev) => {
//         const copy = { ...prev };
//         delete copy[layerId];
//         return copy;
//       });

//       // Ensure UI updates for child styles (hide radios)
//       setDataLayers((prev) =>
//         prev.map((group) =>
//           group.id === groupId
//             ? {
//                 ...group,
//                 children: group.children.map((l) =>
//                   l.id === layerId
//                     ? {
//                         ...l,
//                         children: l.children.map((c) =>
//                           c.inputType === "radio"
//                             ? { ...c, active: false }
//                             : c
//                         ),
//                       }
//                     : l
//                 ),
//               }
//             : group
//         )
//       );
//     }

//     return;
//   }

//   if (type === "radio") {
//     const parentId = parentIdOverride || layer.parentId;
//     if (!parentId) return;

//     setDataLayers((prev) =>
//       prev.map((group) =>
//         group.id === groupId
//           ? {
//               ...group,
//               children: group.children.map((l) =>
//                 l.id === parentId
//                   ? {
//                       ...l,
//                       children: l.children.map((c) => ({
//                         ...c,
//                         active: c.id === layerId,
//                       })),
//                     }
//                   : l
//               ),
//             }
//           : group
//       )
//     );

//     setActiveStyles((prev) => ({ ...prev, [parentId]: styleName }));

//     const parentLayer = findLayerById(groupId, parentId, dataLayers);
//     if (parentLayer?.active) {
//       const olLayerKey = `${groupId}:${parentId}`;
//       const olLayer = wmsWmtsLayersRef.current[olLayerKey];
//       if (!olLayer?.getSource) return;
//       const source = olLayer.getSource();
//       source.updateParams({ ...source.getParams(), STYLES: styleName });
//       source.refresh();
//     }
//   }
// };

//9-10-2025
// import React, { useEffect, useRef, useState } from "react";
// import { FiLayers } from "react-icons/fi";
// import { Switch } from "../style_components/FormStyles";
// import Accordion from "../style_components/Accordion";
// import { renderLayer } from "../style_components/RenderLayerStyle";

// import {
//   DataLaagSelectContainer,
//   DataLaagSelectPanel,
//   Header,
//   TopRow,
//   TitleGroup,
//   SwitchGroup,
//   FilterInput,
//   Content,
//   BottomSpacer,
//   NoResults,
// } from "../style_components/DataLaagSelectContainerStyle";

// import Spinner from "../style_components/Spinner";

// function findLayerById(groupId, layerId, dataLayers) {
//   const group = dataLayers.find((g) => g.id === groupId);
//   if (!group) return null;

//   const search = (layers) => {
//     for (const layer of layers) {
//       if (layer.id === layerId) return layer;
//       if (layer.children?.length) {
//         const found = search(layer.children);
//         if (found) return found;
//       }
//     }
//     return null;
//   };

//   return search(group.children || []);
// }

// export default function DataLaagSelect({
//   isOpen,
//   setActivePanel,
//   dataLayers,
//   setDataLayers,
//   setLayerActive,
//   mapRef,
//   wmsWmtsLayersRef,
//   currentProjectionCode,
// }) {
//   const panelRef = useRef(null);
//   const [showOnlyActive, setShowOnlyActive] = useState(false);
//   const [filterQuery, setFilterQuery] = useState("");
//   const [loadingLayers, setLoadingLayers] = useState({});

//   //-----------------------------
//   // active layer style
//   //-----------------------------
//   const [activeStyles, setActiveStyles] = useState({});

//   // ----------------------------
//   // Close panel on outside click
//   // ----------------------------
//   useEffect(() => {
//     const handleClickOutside = (e) => {
//       if (panelRef.current && !panelRef.current.contains(e.target)) {
//         setActivePanel(null);
//       }
//     };
//     if (isOpen) document.addEventListener("mousedown", handleClickOutside);
//     return () => document.removeEventListener("mousedown", handleClickOutside);
//   }, [isOpen, setActivePanel]);

//   // ----------------------------
//   // Toggle layer (with optional style)
//   // ----------------------------

//   const onToggleLayer = (
//     groupId,
//     layerId,
//     type,
//     styleName = null,
//     parentIdFromCall = null
//   ) => {
//     const layer = findLayerById(groupId, layerId, dataLayers);
//     if (!layer) return;

//     if (type === "checkbox") {
//       // ✅ Parent toggle works as before
//       setLayerActive(mapRef.current, groupId, layerId, "checkbox");

//       if (layer.active) {
//         setActiveStyles((prev) => {
//           const copy = { ...prev };
//           delete copy[layerId];
//           return copy;
//         });
//       }
//     }

//     if (type === "radio") {
//       // 1️⃣ Find the parent layer object that holds this radio child
//       const parentLayerFull = dataLayers
//         .find((g) => g.id === groupId)
//         ?.children.find((l) => l.children?.some((c) => c.id === layerId));

//       if (!parentLayerFull) {
//         console.warn(
//           "[onToggleLayer] Cannot find parent layer for radio:",
//           layerId
//         );
//         return;
//       }

//       const parentId = parentLayerFull.id; // full parent ID, matches OL layer key
//       const parentActive = parentLayerFull.active;

//       console.log("[DEBUG] radio toggle:", {
//         groupId,
//         layerId,
//         parentId,
//         parentLayerActive: parentActive,
//       });

//       // 2️⃣ Update UI state: mark only the clicked radio child as active
//       setDataLayers((prev) =>
//         prev.map((group) =>
//           group.id === groupId
//             ? {
//                 ...group,
//                 children: group.children.map((l) =>
//                   l.id === parentId
//                     ? {
//                         ...l,
//                         children: l.children.map((c) => ({
//                           ...c,
//                           active: c.id === layerId,
//                         })),
//                       }
//                     : l
//                 ),
//               }
//             : group
//         )
//       );

//       // 3️⃣ Save active style for this parent
//       setActiveStyles((prev) => ({ ...prev, [parentId]: styleName }));

//       // 4️⃣ Update OL WMS params if parent is active
//       if (parentActive) {
//         const olLayerKey = `${groupId}:${parentId}`; // matches how you stored OL layers
//         const olLayer = wmsWmtsLayersRef.current[olLayerKey];
//         if (olLayer && olLayer.getSource) {
//           const source = olLayer.getSource();
//           const params = source.getParams();
//           const nextParams = { ...params, STYLES: styleName };
//           source.updateParams(nextParams);
//           source.refresh(); // <- force tile re-request

//           console.log(
//             "[DEBUG] WMS params updated for OL layer:",
//             parentId,
//             nextParams
//           );
//         } else {
//           console.warn("[onToggleLayer] No OL layer found for", parentId);
//         }
//       } else {
//         console.log("[onToggleLayer] parent not active, skipping style change");
//       }
//     }
//   };

//   // ----------------------------
//   // Filter layers recursively
//   // ----------------------------
//   const filterGroup = (group) => {
//     const filteredChildren = (group.children || [])
//       .map((child) => filterGroup(child))
//       .filter(Boolean);

//     const matchesGroupTitle = group.title
//       ?.toLowerCase()
//       .includes(filterQuery.toLowerCase());

//     if (showOnlyActive) {
//       return filteredChildren.length > 0 || group.active
//         ? { ...group, children: filteredChildren }
//         : null;
//     }

//     return matchesGroupTitle || filteredChildren.length > 0
//       ? {
//           ...group,
//           children: matchesGroupTitle ? group.children : filteredChildren,
//         }
//       : null;
//   };

//   const filteredDataLayers = (dataLayers || [])
//     .map(filterGroup)
//     .filter(Boolean);

//   return (
//     <DataLaagSelectContainer>
//       <DataLaagSelectPanel ref={panelRef} $isOpen={isOpen}>
//         <Header>
//           <TopRow>
//             <TitleGroup>
//               <FiLayers size={20} />
//               <h1>Data Layers</h1>
//             </TitleGroup>

//             <SwitchGroup>
//               <Switch
//                 checked={showOnlyActive}
//                 onChange={() => setShowOnlyActive(!showOnlyActive)}
//               />
//               <span>Show active only</span>
//             </SwitchGroup>
//           </TopRow>

//           <FilterInput
//             type="text"
//             placeholder="Filter layers..."
//             value={filterQuery}
//             onChange={(e) => setFilterQuery(e.target.value)}
//           />
//         </Header>

//         <Content>
//           {filteredDataLayers.length > 0 ? (
//             filteredDataLayers.map((group) => (
//               <Accordion key={group.id} title={group.title}>
//                 {/* {group.children.map((layer) => renderLayer(layer, group.id))} */}
//                 {group.children.map((layer) =>
//                   renderLayer(
//                     layer,
//                     group.id,
//                     0,
//                     true,
//                     onToggleLayer,
//                     loadingLayers,
//                     {
//                       /* activeStyles */
//                     }
//                   )
//                 )}
//               </Accordion>
//             ))
//           ) : (
//             <NoResults>No results found</NoResults>
//           )}
//         </Content>
//         <BottomSpacer />
//       </DataLaagSelectPanel>
//     </DataLaagSelectContainer>
//   );
// }
