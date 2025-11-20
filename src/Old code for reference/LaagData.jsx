// import React, { useState, useEffect } from "react";
// import { MapButton } from "../style_components/Buttons";
// import { FaMapMarkedAlt } from "react-icons/fa";
// import {
//   LaagDataContainer,
//   DataPanel,
//   Label,
//   Data,
//   CustomAccordion,
//   PanelTitle,
// } from "../style_components/LaagDataStyle";

// // List of technical fields to ignore
// const TECHNICAL_FIELDS = ["geometry", "layerName", "typeName", "__id", "__fid"];

// const renderFeatureValue = (val) => {
//   if (val === undefined || val === null) return "-";
//   if (typeof val === "function") return "[Function]";

//   if (typeof val === "object") {
//     if (Array.isArray(val)) {
//       return val.map((item, idx) => (
//         <div key={idx}>{renderFeatureValue(item)}</div>
//       ));
//     } else {
//       return (
//         <div style={{ paddingLeft: "10px" }}>
//           {Object.entries(val).map(([k, v]) => (
//             <div key={k}>
//               <strong>{k}:</strong> {renderFeatureValue(v)}
//             </div>
//           ))}
//         </div>
//       );
//     }
//   }

//   return val;
// };

// // ----------------------------
// // Safe dynamic panel title
// // ----------------------------
// const getDynamicPanelTitle = (feature, dataLayers) => {
//   if (!feature) return "Geselecteerd object";

//   const id = feature.identificatie || "-";
//   const rawType = feature.featureType || "";

//   // Fallback if dataLayers not yet ready
//   if (!Array.isArray(dataLayers)) return `${rawType || "Object"} ${id}`;

//   // Map layer IDs to display names
//   const typeMap = {};
//   dataLayers.forEach((group) => {
//     if (!group.children) return;
//     group.children.forEach((layer) => {
//       typeMap[layer.id.toLowerCase()] = layer.name;
//     });
//   });

//   const typeName = typeMap[rawType.toLowerCase()] || "Object";
//   return `${typeName} ${id}`;
// };

// export default function LaagData({
//   selectedFeature,
//   isOpen,
//   setActivePanel,
//   dataLayers,
// }) {
//   const [featureData, setFeatureData] = useState(null);

//   const toggleData = () => {
//     if (isOpen) setActivePanel(null);
//     else setActivePanel("laagdata");
//   };

//   // useEffect(() => {
//   //   if (!selectedFeature) {
//   //     setFeatureData(null);
//   //     return;
//   //   }

//   //   const panelTitle = getDynamicPanelTitle(selectedFeature, dataLayers);

//   //   const sections = [];
//   //   Object.entries(selectedFeature).forEach(([key, value]) => {
//   //     if (TECHNICAL_FIELDS.includes(key)) return;

//   //     if (value && typeof value === "object") {
//   //       sections.push({
//   //         title: key.charAt(0).toUpperCase() + key.slice(1),
//   //         fields: Object.entries(value)
//   //           .filter(([k]) => !TECHNICAL_FIELDS.includes(k))
//   //           .map(([k, v]) => ({ label: k, value: renderFeatureValue(v) })),
//   //       });
//   //     } else {
//   //       let algemeenSection = sections.find((s) => s.title === "General");
//   //       if (!algemeenSection) {
//   //         algemeenSection = { title: "General", fields: [] };
//   //         sections.push(algemeenSection);
//   //       }
//   //       algemeenSection.fields.push({
//   //         label: key,
//   //         value: renderFeatureValue(value),
//   //       });
//   //     }
//   //   });

//   //   setFeatureData({ title: panelTitle, sections });
//   // }, [selectedFeature, dataLayers]);

//   useEffect(() => {
//     if (!selectedFeature) {
//       setFeatureData(null);
//       return;
//     }

//     // --- Handle multiple layers
//     const resultsArray = Array.isArray(selectedFeature)
//       ? selectedFeature
//       : [{ layer: null, features: [selectedFeature] }];

//     const processed = resultsArray.map((res) => {
//       const { layer, features } = res;
//       const layerTitle = layer?.name || layer?.id || "Onbekende laag";

//       const featureSections = features.map((feature) => {
//         const id = feature.getId?.() || feature.get("identificatie") || "-";
//         const props = feature.getProperties();

//         const sections = [];
//         Object.entries(props).forEach(([key, value]) => {
//           if (TECHNICAL_FIELDS.includes(key)) return;

//           if (value && typeof value === "object") {
//             sections.push({
//               title: key.charAt(0).toUpperCase() + key.slice(1),
//               fields: Object.entries(value)
//                 .filter(([k]) => !TECHNICAL_FIELDS.includes(k))
//                 .map(([k, v]) => ({ label: k, value: renderFeatureValue(v) })),
//             });
//           } else {
//             let algemeen = sections.find((s) => s.title === "Algemeen");
//             if (!algemeen) {
//               algemeen = { title: "Algemeen", fields: [] };
//               sections.push(algemeen);
//             }
//             algemeen.fields.push({
//               label: key,
//               value: renderFeatureValue(value),
//             });
//           }
//         });

//         return { id, sections };
//       });

//       return { layerTitle, featureSections };
//     });

//     setFeatureData(processed);
//   }, [selectedFeature, dataLayers]);

//   return (
//     <LaagDataContainer>
//       <MapButton
//         icon={<FaMapMarkedAlt />}
//         $active={isOpen}
//         onClick={toggleData}
//         hideText
//         aria-expanded={isOpen}
//         aria-controls="laagdata-panel"
//         aria-label="Toggle laag data panel"
//       >
//         Layer data
//       </MapButton>

//       <DataPanel
//         id="laagdata-panel"
//         $isOpen={isOpen}
//         role="region"
//         aria-live="polite"
//       >
//         {/* {featureData ? (
//           <>
//             <PanelTitle>{featureData.title}</PanelTitle>
//             {featureData.sections.map((section, idx) => (
//               <CustomAccordion key={idx} title={section.title}>
//                 {section.fields.map(({ label, value }, i) => (
//                   <div
//                     key={i}
//                     style={{
//                       display: "flex",
//                       justifyContent: "space-between",
//                       marginBottom: "6px",
//                     }}
//                   >
//                     <Label>{label}</Label>
//                     <Data>{value}</Data>
//                   </div>
//                 ))}
//               </CustomAccordion>
//             ))}
//           </>
//         ) : (
//           <p>Select an object on the map</p>
//         )} */}

//         {featureData ? (
//           featureData.map((group, gi) => (
//             <div key={gi}>
//               <PanelTitle>{group.layerTitle}</PanelTitle>
//               {group.featureSections.map((feat, fi) => (
//                 <CustomAccordion key={fi} title={`Feature ${feat.id}`}>
//                   {feat.sections.map((section, si) => (
//                     <CustomAccordion key={si} title={section.title}>
//                       {section.fields.map(({ label, value }, i) => (
//                         <div
//                           key={i}
//                           style={{
//                             display: "flex",
//                             justifyContent: "space-between",
//                             marginBottom: "6px",
//                           }}
//                         >
//                           <Label>{label}</Label>
//                           <Data>{value}</Data>
//                         </div>
//                       ))}
//                     </CustomAccordion>
//                   ))}
//                 </CustomAccordion>
//               ))}
//             </div>
//           ))
//         ) : (
//           <p>Select an object on the map</p>
//         )}
//       </DataPanel>
//     </LaagDataContainer>
//   );
// }
