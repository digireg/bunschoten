// import React, { useEffect, useRef, useState } from "react";
// import { MdLabel } from "react-icons/md";
// import Accordion from "../style_components/Accordion";

// import {
//   DataLaagSelectContainer,
//   DataLaagSelectPanel,
//   Header,
//   TopRow,
//   TitleGroup,
//   FilterInput,
//   Content,
//   BottomSpacer,
//   NoResults,
// } from "../style_components/DataLabelContainerStyle";

// export default function DataLabel({ isOpen, setActivePanel }) {
//   const panelRef = useRef(null); // Reference for detecting outside clicks
//   const [filterQuery, setFilterQuery] = useState(""); // Controlled input state for filter

//   /**
//    * Static accordion data representing label groups and their items.
//    * Can later be fetched from backend or configured externally.
//    */
//   const accordionData = [
//     {
//       title: "BAG",
//       count: 5,
//       children: ["gebouw", "perceel", "adres", "ligplaats", "standplaats"],
//     },
//     {
//       title: "BGT",
//       count: 6,
//       children: [
//         "wegdeel",
//         "waterdeel",
//         "groenvoorziening",
//         "begroeidterreindeel",
//         "onbegroeidterreindeel",
//       ],
//     },
//     {
//       title: "Kadastrale Kaart",
//       count: 2,
//       children: ["sectie", "perceel"],
//     },
//     {
//       title: "Kadastrale Kaart (WMS)",
//       count: 10,
//       children: ["laag 1", "laag 2", "laag 3", "laag 4", "laag 5"],
//     },
//   ];

//   /**
//    * Filter the accordion groups and their children based on the filter query.
//    * - Show entire group if group title matches
//    * - Show only matching children if any child matches
//    * - Exclude group otherwise
//    */
//   const filteredAccordions = accordionData
//     .map((group) => {
//       const titleMatches = group.title
//         .toLowerCase()
//         .includes(filterQuery.toLowerCase());
//       const matchingChildren = group.children.filter((child) =>
//         child.toLowerCase().includes(filterQuery.toLowerCase())
//       );

//       if (titleMatches) {
//         return group; // Show whole group
//       } else if (matchingChildren.length > 0) {
//         return { ...group, children: matchingChildren }; // Partial children match
//       }
//       return null; // No match
//     })
//     .filter(Boolean); // Remove null groups

//   /**
//    * Effect to close the panel when clicking outside.
//    */
//   useEffect(() => {
//     const handleClickOutside = (event) => {
//       if (panelRef.current && !panelRef.current.contains(event.target)) {
//         setActivePanel(null);
//       }
//     };

//     if (isOpen) {
//       document.addEventListener("mousedown", handleClickOutside);
//     }

//     return () => {
//       document.removeEventListener("mousedown", handleClickOutside);
//     };
//   }, [isOpen, setActivePanel]);

//   return (
//     <DataLaagSelectContainer>
//       <DataLaagSelectPanel ref={panelRef} $isOpen={isOpen}>
//         <Header>
//           <TopRow>
//             <TitleGroup>
//               <MdLabel size={20} />
//               <h1>Datalabel</h1>
//             </TitleGroup>
//           </TopRow>

//           {/* Filter input field */}
//           <FilterInput
//             id="FilterDataLabelLagen"
//             type="text"
//             placeholder="Filter lagen..."
//             value={filterQuery}
//             onChange={(e) => setFilterQuery(e.target.value)}
//             aria-label="Filter lagen"
//           />
//         </Header>

//         <Content>
//           {filteredAccordions.length > 0 ? (
//             filteredAccordions.map((group) => (
//               <Accordion
//                 key={group.title}
//                 title={group.title}
//                 count={group.count}
//               >
//                 {group.children.map((child) => (
//                   <div key={child}>{child}</div>
//                 ))}
//               </Accordion>
//             ))
//           ) : (
//             <NoResults>Geen resultaten gevonden.</NoResults>
//           )}
//         </Content>

//         {/* Spacer to prevent overlap with fixed UI at the bottom */}
//         <BottomSpacer />
//       </DataLaagSelectPanel>
//     </DataLaagSelectContainer>
//   );
// }
