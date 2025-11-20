// export default function Legend({ activeLayers = [], activeStyles = {} }) {
//   // State: whether the legend panel is open or closed
//   const [isOpen, setIsOpen] = useState(false);

//   // Toggle visibility of the legend panel
//   const toggleLegenda = () => setIsOpen((prev) => !prev);

//   // Total count of active layers (used in button)
//   const totalCount = activeLayers.length;

//   // Group layers by their groupTitle
//   const groupedLayers = activeLayers.reduce((acc, layer) => {
//     const datasetName = layer.groupTitle || "Dataset";
//     if (!acc[datasetName]) acc[datasetName] = [];
//     acc[datasetName].push(layer);
//     return acc;
//   }, {});

//   return (
//     <LegendButtonContainer>
//       {/* Button to toggle legend */}
//       <MapButton
//         icon={<MdLegendToggle />}
//         $active={isOpen}
//         onClick={toggleLegenda}
//         aria-expanded={isOpen}
//         aria-controls="legend-panel"
//       >
//         Legend ({totalCount})
//       </MapButton>

//       {/* Collapsible legend panel */}
//       <LegendaPanel
//         $isOpen={isOpen}
//         id="legend-panel"
//         role="region"
//         aria-hidden={!isOpen}
//       >
//         {Object.keys(groupedLayers).length > 0 ? (
//           Object.entries(groupedLayers).map(([groupTitle, layers]) => (
//             <Accordion
//               key={groupTitle}
//               title={groupTitle}
//               count={layers.length}
//             >
//               {layers.map((layer) => {
//                 // Determine current style
//                 const currentStyle =
//                   layer.inputType === "radio" && layer.active
//                     ? layer.id // radio child layer
//                     : layer.active
//                     ? activeStyles[layer.id] || null
//                     : null;

//                 // Build legend URL dynamically
//                 const legendUrl = currentStyle
//                   ? layer.legendUrl.replace(
//                       /STYLE=.*?(&|$)/,
//                       `STYLE=${currentStyle}$1`
//                     ) // if STYLE param exists
//                   : layer.legendUrl;

//                 return (
//                   <div
//                     key={layer.id}
//                     style={{
//                       display: "flex",
//                       alignItems: "center",
//                       marginBottom: 4,
//                     }}
//                   >
//                     {legendUrl ? (
//                       <img
//                         src={legendUrl}
//                         alt={layer.name}
//                         style={{
//                           width: "auto",
//                           height: "auto",
//                           marginRight: 6,
//                         }}
//                       />
//                     ) : (
//                       <div
//                         style={{
//                           width: 24,
//                           height: 24,
//                           marginRight: 6,
//                           display: "flex",
//                           alignItems: "center",
//                           justifyContent: "center",
//                           fontSize: 10,
//                           textAlign: "center",
//                           backgroundColor: "#eee",
//                           borderRadius: 4,
//                         }}
//                       >
//                         {layer.name}
//                       </div>
//                     )}
//                   </div>
//                 );
//               })}
//             </Accordion>
//           ))
//         ) : (
//           <div>
//             <p>
//               <em>No legend available</em>
//             </p>
//           </div>
//         )}
//       </LegendaPanel>
//     </LegendButtonContainer>
//   );
// }

/*Ver 2 */

// export default function Legend({ activeLayers = [] }) {
//   const [isOpen, setIsOpen] = useState(false);
//   const toggleLegenda = () => setIsOpen((prev) => !prev);

//   const totalCount = activeLayers.length;

//   // Group by dataset
//   const groupedLayers = activeLayers.reduce((acc, layer) => {
//     const datasetName = layer.groupTitle || "Dataset";
//     if (!acc[datasetName]) acc[datasetName] = [];
//     acc[datasetName].push(layer);
//     return acc;
//   }, {});

//   return (
//     <LegendButtonContainer>
//       <MapButton
//         icon={<MdLegendToggle />}
//         $active={isOpen}
//         onClick={toggleLegenda}
//         aria-expanded={isOpen}
//         aria-controls="legend-panel"
//       >
//         Legend ({totalCount})
//       </MapButton>

//       <LegendaPanel
//         $isOpen={isOpen}
//         id="legend-panel"
//         role="region"
//         aria-hidden={!isOpen}
//       >
//         {Object.keys(groupedLayers).length > 0 ? (
//           Object.entries(groupedLayers).map(([groupTitle, layers]) => (
//             <Accordion
//               key={groupTitle}
//               title={groupTitle}
//               count={layers.length}
//             >
//               {layers.map((layer) => (
//                 <div
//                   key={layer.id}
//                   style={{
//                     display: "flex",
//                     alignItems: "center",
//                     marginBottom: 4,
//                   }}
//                 >
//                   {layer.legendUrl ? (
//                     <img
//                       src={layer.legendUrl}
//                       alt={layer.layerName}
//                       style={{ width: "auto", height: "auto", marginRight: 6 }}
//                     />
//                   ) : (
//                     <div
//                       style={{
//                         width: 24,
//                         height: 24,
//                         marginRight: 6,
//                         display: "flex",
//                         alignItems: "center",
//                         justifyContent: "center",
//                         fontSize: 10,
//                         textAlign: "center",
//                         backgroundColor: "#eee",
//                         borderRadius: 4,
//                       }}
//                     >
//                       {layer.layerName}
//                     </div>
//                   )}
//                 </div>
//               ))}
//             </Accordion>
//           ))
//         ) : (
//           <div>
//             <p>
//               <em>No legend available</em>
//             </p>
//           </div>
//         )}
//       </LegendaPanel>
//     </LegendButtonContainer>
//   );
// }
