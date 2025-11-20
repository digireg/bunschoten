// import React from "react";
// import styled from "styled-components";
// import Spinner from "../style_components/Spinner";

// // ----------------------------
// // Styled Components
// // ----------------------------
// const LayerWrapper = styled.div`
//   margin-bottom: 10px;
// `;

// const LayerRow = styled.div`
//   display: flex;
//   align-items: center;
//   gap: 8px;
//   margin-left: ${({ $level }) => $level * 20}px;
// `;

// const StylesRow = styled.div`
//   margin-left: ${({ $level }) => $level * 20 + 20}px;
//   margin-top: 6px;
//   display: flex;
//   flex-wrap: wrap;
//   gap: 12px;
// `;

// const StyleLabel = styled.label`
//   cursor: pointer;
//   font-size: 0.9rem;
//   display: flex;
//   align-items: center;
//   gap: 4px;
// `;

// // ----------------------------
// // Pure helper function (NOT async, NOT a component)
// // ----------------------------
// export const renderLayer = (
//   layer,
//   groupId,
//   level = 0,
//   parentActive = true,
//   onToggleLayer,
//   loadingLayers
// ) => {
//   const inputId = `input-${layer.key || layer.id}`;
//   const layerEnabled = !!layer.active && parentActive;

//   return (
//     <LayerWrapper key={inputId}>
//       {/* Layer toggle */}
//       <LayerRow $level={level}>
//         <input
//           id={inputId}
//           type={layer.inputType || "checkbox"}
//           checked={!!layer.active}
//           disabled={!!loadingLayers[`${groupId}:${layer.id}`]}
//           onChange={() =>
//             onToggleLayer(groupId, layer.id, layer.inputType || "checkbox")
//           }
//         />
//         <label htmlFor={inputId}>{layer.title || "Untitled"}</label>
//         {loadingLayers[`${groupId}:${layer.id}`] && <Spinner size={14} />}
//       </LayerRow>

//       {/* Styles as radios */}
//       {layer.styles && layer.active && (
//         <StylesRow $level={level}>
//           {layer.styles.map((s) => (
//             <StyleLabel key={s}>
//               <input
//                 type="radio"
//                 name={`style-${layer.id}`}
//                 value={s}
//                 checked={layer.style === s}
//                 onChange={() => onToggleLayer(groupId, layer.id, "radio", s)}
//               />
//               {s}
//             </StyleLabel>
//           ))}
//         </StylesRow>
//       )}

//       {/* Recursive children */}
//       {layer.children &&
//         layer.children.map((child) =>
//           renderLayer(
//             child,
//             groupId,
//             level + 1,
//             layerEnabled,
//             onToggleLayer,
//             loadingLayers
//           )
//         )}
//     </LayerWrapper>
//   );
// };

// style_components/RenderLayerStyle.js
// import React from "react";
// import Spinner from "./Spinner";

/**
 * Recursive layer renderer
 */
// export const renderLayer = (
//   layer,
//   groupId,
//   level = 0,
//   parentActive = true,
//   onToggleLayer,
//   loadingLayers
// ) => {
//   const inputId = `input-${layer.key || layer.id}`;
//   const layerEnabled = !!layer.active && parentActive;

//   return (
//     <div key={inputId} style={{ marginBottom: 10 }}>
//       {/* Checkbox / Radio row */}
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
//           onChange={() =>
//             onToggleLayer(groupId, layer.id, layer.inputType || "checkbox")
//           }
//         />
//         <label htmlFor={inputId}>{layer.title || "Untitled"}</label>
//         {loadingLayers[`${groupId}:${layer.id}`] && <Spinner size={14} />}
//       </div>

//       {/* Styles row */}
//       {layer.styles && layer.active && (
//         <div style={{ marginLeft: level * 20 + 20, marginTop: 6 }}>
//           {layer.styles.map((s) => (
//             <label key={s} style={{ marginRight: 12 }}>
//               <input
//                 type="radio"
//                 name={`style-${layer.id}`}
//                 value={s}
//                 checked={layer.style === s}
//                 onChange={() => onToggleLayer(groupId, layer.id, "radio", s)}
//               />
//               {s}
//             </label>
//           ))}
//         </div>
//       )}

//       {/* Children */}
//       {layer.children &&
//         layer.children.map((child) =>
//           renderLayer(
//             child,
//             groupId,
//             level + 1,
//             layerEnabled,
//             onToggleLayer,
//             loadingLayers
//           )
//         )}
//     </div>
//   );
// };

// export const renderLayer = (
//   layer,
//   groupId,
//   level = 0,
//   parentActive = true,
//   onToggleLayer,
//   loadingLayers,
//   activeStyles // <-- pass this from DataLaagSelect
// ) => {
//   const inputId = `input-${layer.key || layer.id}`;
//   const layerEnabled = !!layer.active && parentActive;

//   return (
//     <LayerWrapper key={inputId}>
//       {/* Parent checkbox */}
//       <LayerRow $level={level}>
//         <input
//           id={inputId}
//           type="checkbox"
//           checked={!!layer.active}
//           disabled={!!loadingLayers[`${groupId}:${layer.id}`]}
//           onChange={() => onToggleLayer(groupId, layer.id, "checkbox")}
//         />
//         <label htmlFor={inputId}>{layer.title || "Untitled"}</label>
//         {loadingLayers[`${groupId}:${layer.id}`] && <Spinner size={14} />}
//       </LayerRow>

//       {/* Styles radios */}
//       {layer.styles?.length > 0 && layer.active && (
//         <StylesRow $level={level}>
//           {layer.styles.map((styleName) => (
//             <StyleLabel key={styleName}>
//               <input
//                 type="radio"
//                 name={`style-${layer.id}`}
//                 value={styleName}
//                 checked={layer.activeStyle === styleName} // ✅ now bound
//                 disabled={!layer.active}
//                 onChange={() =>
//                   onToggleLayer(groupId, layer.id, "radio", styleName)
//                 }
//               />
//               {styleName}
//             </StyleLabel>
//           ))}
//         </StylesRow>
//       )}

//       {/* Children */}
//       {layer.children?.length > 0 &&
//         layer.children.map((child) =>
//           renderLayer(
//             child,
//             groupId,
//             level + 1,
//             layerEnabled,
//             onToggleLayer,
//             loadingLayers,
//             activeStyles
//           )
//         )}
//     </LayerWrapper>
//   );
// };

//9-10-2025
// export const renderLayer = (
//   layer,
//   groupId,
//   level = 0,
//   parentActive = true,
//   onToggleLayer,
//   loadingLayers,
//   parentId = null, // for radio grouping
//   activeStyles = {} // keep radio checked states consistent
// ) => {
//   const inputId = `input-${layer.key || layer.id}`;
//   const layerEnabled = !!layer.active && parentActive;
//   const isRadioInput = layer.inputType === "radio";

//   // ✅ Determine the WMS style to send to onToggleLayer
//   let radioValue;
//   if (isRadioInput) {
//     // if the layer has multiple styles, use the active one
//     radioValue = activeStyles[layer.id] || layer.styles?.[0] || layer.id;
//   }

//   return (
//     <LayerWrapper key={inputId}>
//       <LayerRow $level={level}>
//         <input
//           id={inputId}
//           type={isRadioInput ? "radio" : "checkbox"}
//           name={isRadioInput ? `style-${parentId || layer.id}` : undefined}
//           value={isRadioInput ? radioValue : undefined}
//           checked={!!layer.active}
//           disabled={!!loadingLayers[`${groupId}:${layer.id}`]}
//           onChange={() => {
//             console.log("[UI] toggled:", {
//               id: layer.id,
//               type: isRadioInput ? "radio" : "checkbox",
//               radioValue,
//               parentId,
//             });

//             onToggleLayer(
//               groupId,
//               layer.id,
//               isRadioInput ? "radio" : "checkbox",
//               radioValue, // now always correct style
//               parentId
//             );
//           }}
//         />
//         <label htmlFor={inputId}>{layer.title || "Untitled"}</label>
//         {loadingLayers[`${groupId}:${layer.id}`] && <Spinner size={14} />}
//       </LayerRow>

//       {/* Child style radios (legacy 'styles' array) */}
//       {/* === Child style radios === */}
//       {layer.active &&
//         parentActive &&
//         Array.isArray(layer.styles) &&
//         layer.styles.length > 1 && (
//           <div className="style-options">
//             {layer.styles.map((style) => (
//               <label key={style.name} className="style-radio">
//                 <input
//                   type="radio"
//                   name={`style-${layer.id}`}
//                   value={style.name}
//                   checked={activeStyles[layer.id] === style.name}
//                   onChange={() =>
//                     onToggleLayer(
//                       groupId,
//                       style.id,
//                       "radio",
//                       style.name,
//                       layer.id
//                     )
//                   }
//                 />
//                 {style.title || style.name}
//               </label>
//             ))}
//           </div>
//         )}

//       {/* Children */}
//       {layer.children?.length > 0 &&
//         layer.children.map((child) =>
//           renderLayer(
//             child,
//             groupId,
//             level + 1,
//             layerEnabled,
//             onToggleLayer,
//             loadingLayers,
//             layer.id,
//             activeStyles
//           )
//         )}
//     </LayerWrapper>
//   );
// };
