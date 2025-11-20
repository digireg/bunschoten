import React, { useEffect, useRef, useState } from "react";
import { FiLayers } from "react-icons/fi";
import { DATASET_CONFIG } from "../config/datasetConfig";
import { addMapLayer } from "../utils/addMapLayer";

import {
  Switch,
  Accordion,
  renderLayer,
  DataLaagSelectContainer,
  DataLaagSelectPanel,
  Header,
  TopRow,
  TitleGroup,
  SwitchGroup,
  TextInput,
  Content,
  BottomSpacer,
  NoResults,
} from "../style_components";

function findLayerById(groupId, layerId, dataLayers) {
  const group = dataLayers.find((g) => g.id === groupId);
  if (!group) return null;

  const search = (layers) => {
    for (const layer of layers) {
      if (layer.id === layerId) return layer;
      if (layer.children?.length) {
        const found = search(layer.children);
        if (found) return found;
      }
    }
    return null;
  };

  return search(group.children || []);
}

export default function DataLaagSelect({
  isOpen,
  setActivePanel,
  dataLayers,
  setDataLayers,
  setLayerActive,
  mapRef,
  wmsWmtsLayersRef,
  currentProjectionCode,
}) {
  const panelRef = useRef(null);
  const [showOnlyActive, setShowOnlyActive] = useState(false);
  const [filterQuery, setFilterQuery] = useState("");
  const [loadingLayers, setLoadingLayers] = useState({});
  const [activeStyles, setActiveStyles] = useState({});
  const [wmsCapabilities, setWmsCapabilities] = useState({}); // <-- dynamic WMS styles

  // Close panel on outside click
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (panelRef.current && !panelRef.current.contains(e.target)) {
        setActivePanel(null);
      }
    };
    if (isOpen) document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [isOpen, setActivePanel]);

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
  //     console.log("[TOGGLE CHECKBOX]", layerId, "was active:", layer.active);

  //     const newActive = !layer.active; // the *next* intended state
  //     setLayerActive(mapRef.current, groupId, layerId, "checkbox");

  //     // 🟢 Auto-activate a single radio style if this checkbox layer just got turned ON
  //     if (newActive) {
  //       const radioChildren =
  //         layer.children?.filter((c) => c.inputType === "radio") || [];

  //       if (radioChildren.length === 1) {
  //         const singleRadio = radioChildren[0];
  //         console.log(
  //           "[Auto-select single style]",
  //           singleRadio.id,
  //           "for parent",
  //           layerId
  //         );

  //         // Mark it as active in state
  //         setDataLayers((prev) =>
  //           prev.map((group) =>
  //             group.id === groupId
  //               ? {
  //                   ...group,
  //                   children: group.children.map((l) =>
  //                     l.id === layerId
  //                       ? {
  //                           ...l,
  //                           children: l.children.map((c) =>
  //                             c.id === singleRadio.id
  //                               ? { ...c, active: true }
  //                               : c
  //                           ),
  //                         }
  //                       : l
  //                   ),
  //                 }
  //               : group
  //           )
  //         );

  //         // Update WMS style + activeStyles map
  //         setActiveStyles((prev) => ({
  //           ...prev,
  //           [layerId]: singleRadio.styles?.[0]?.name || singleRadio.id,
  //         }));
  //       }
  //     }

  //     // 🔴 If turning OFF → deactivate any active styles and radios
  //     if (!newActive) {
  //       console.log("[Checkbox OFF] Clearing active styles for", layerId);

  //       setActiveStyles((prev) => {
  //         const copy = { ...prev };
  //         delete copy[layerId];
  //         return copy;
  //       });

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
  //                           c.inputType === "radio" || c.styles
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

  //   // === Radio toggle ===
  //   if (type === "radio") {
  //     const parentId = parentIdOverride || layer.parentId;
  //     if (!parentId) return;

  //     // Update UI: only this style is active for its parent
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

  //     // Update WMS layer params for active style
  //     const parentLayer = findLayerById(groupId, parentId, dataLayers);
  //     if (parentLayer?.active) {
  //       const olLayerKey = `${groupId}:${parentId}`;
  //       const olLayer = wmsWmtsLayersRef.current[olLayerKey];
  //       if (!olLayer?.getSource) return;

  //       const source = olLayer.getSource();
  //       const params = source.getParams();
  //       const newParams = { ...params, STYLES: styleName };
  //       source.updateParams(newParams);
  //       source.refresh();
  //     }

  //     // Sync the activeStyles state
  //     setActiveStyles((prev) => {
  //       const updated = { ...prev };
  //       if (parentLayer?.active) {
  //         updated[parentId] = styleName;
  //       } else {
  //         delete updated[parentId];
  //       }
  //       console.log("[activeStyles][before]", prev);
  //       console.log("[activeStyles][after]", updated);
  //       return updated;
  //     });
  //   }
  // };

  const onToggleLayer = async (
    groupId,
    layerId,
    type,
    styleName = null,
    parentIdOverride = null
  ) => {
    const layer = findLayerById(groupId, layerId, dataLayers);
    if (!layer) return;

    console.log("[TOGGLE]", {
      type,
      layerId,
      style: styleName,
      layerType: layer.type,
    });

    // =================
    // Checkbox toggle
    // =================
    if (type === "checkbox") {
      const newActive = !layer.active; // intended next state

      // =================
      // WMS
      // =================
      if (layer.type === "wms") {
        setLayerActive(mapRef.current, groupId, layerId, "checkbox");

        if (newActive) {
          const radioChildren =
            layer.children?.filter((c) => c.inputType === "radio") || [];

          if (radioChildren.length === 1) {
            const singleRadio = radioChildren[0];

            setDataLayers((prev) =>
              prev.map((group) =>
                group.id === groupId
                  ? {
                      ...group,
                      children: group.children.map((l) =>
                        l.id === layerId
                          ? {
                              ...l,
                              children: l.children.map((c) =>
                                c.id === singleRadio.id
                                  ? { ...c, active: true }
                                  : c
                              ),
                            }
                          : l
                      ),
                    }
                  : group
              )
            );

            setActiveStyles((prev) => ({
              ...prev,
              [layerId]: singleRadio.styles?.[0]?.name || singleRadio.id,
            }));
          }
        }

        if (!newActive) {
          setActiveStyles((prev) => {
            const copy = { ...prev };
            delete copy[layerId];
            return copy;
          });

          setDataLayers((prev) =>
            prev.map((group) =>
              group.id === groupId
                ? {
                    ...group,
                    children: group.children.map((l) =>
                      l.id === layerId
                        ? {
                            ...l,
                            children: l.children.map((c) =>
                              c.inputType === "radio" || c.styles
                                ? { ...c, active: false }
                                : c
                            ),
                          }
                        : l
                    ),
                  }
                : group
            )
          );
        }
      }

      // =================
      // WMTS
      // =================
      else if (layer.type === "wmts") {
        const olLayerKey = `${groupId}:${layerId}`;

        if (newActive) {
          // Pass parentLayer so wmtsOptions exists
          const newLayer = await addMapLayer({
            mapInstance: mapRef.current,
            groupId,
            layerId,
            isActive: true,
            type: "wmts",
            styleId: activeStyles[layerId] || "",
            wmsWmtsLayersRef,
            projectionCode: currentProjectionCode,
            parentLayer: layer, // <-- important
          });

          if (newLayer) {
            console.log("[WMTS] added via addMapLayer", olLayerKey, newLayer);
          }
        } else {
          // Turn off visibility
          const olLayer = wmsWmtsLayersRef.current[olLayerKey];
          if (olLayer) olLayer.setVisible(false);
        }

        // Auto-select first style if turning on
        if (newActive && layer.availableStyles?.length === 1) {
          setActiveStyles((prev) => ({
            ...prev,
            [layerId]: layer.availableStyles[0],
          }));
        }

        // Clear style if turning off
        if (!newActive) {
          setActiveStyles((prev) => {
            const copy = { ...prev };
            delete copy[layerId];
            return copy;
          });
        }

        // Update children active flags
        setDataLayers((prev) =>
          prev.map((group) =>
            group.id === groupId
              ? {
                  ...group,
                  children: group.children.map((l) =>
                    l.id === layerId
                      ? {
                          ...l,
                          active: newActive,
                          children: (l.children || []).map((c) => ({
                            ...c,
                            active:
                              newActive && l.availableStyles?.includes(c.id),
                          })),
                        }
                      : l
                  ),
                }
              : group
          )
        );

        return;
      }

      return;
    }

    // =================
    // Radio toggle (styles)
    // =================
    if (type === "radio") {
      const parentId = parentIdOverride || layer.parentId;
      if (!parentId) return;

      // Update UI: only this style active for its parent
      setDataLayers((prev) =>
        prev.map((group) =>
          group.id === groupId
            ? {
                ...group,
                children: group.children.map((l) =>
                  l.id === parentId
                    ? {
                        ...l,
                        children: l.children.map((c) => ({
                          ...c,
                          active: c.id === layerId,
                        })),
                      }
                    : l
                ),
              }
            : group
        )
      );

      const parentLayer = findLayerById(groupId, parentId, dataLayers);

      if (parentLayer?.type === "wms" && parentLayer.active) {
        const olLayerKey = `${groupId}:${parentId}`;
        const olLayer = wmsWmtsLayersRef.current[olLayerKey];
        if (!olLayer?.getSource) return;

        const params = olLayer.getSource().getParams();
        olLayer.getSource().updateParams({ ...params, STYLES: styleName });
        olLayer.getSource().refresh();
      }

      if (parentLayer?.type === "wmts" && parentLayer.active) {
        const olLayerKey = `${groupId}:${parentId}`;
        const olLayer = wmsWmtsLayersRef.current[olLayerKey];
        if (!olLayer?.getSource) return;

        const source = olLayer.getSource();
        source.updateParams({ STYLE: styleName });
      }

      // Sync activeStyles
      setActiveStyles((prev) => {
        const updated = { ...prev };
        if (parentLayer?.active) updated[parentId] = styleName;
        else delete updated[parentId];
        return updated;
      });
    }
  };

  const filterGroup = (group) => {
    const filteredChildren = (group.children || [])
      .map((child) => filterGroup(child))
      .filter(Boolean);

    const matchesGroupTitle = group.title
      ?.toLowerCase()
      .includes(filterQuery.toLowerCase());

    if (showOnlyActive) {
      return filteredChildren.length > 0 || group.active
        ? { ...group, children: filteredChildren }
        : null;
    }

    return matchesGroupTitle || filteredChildren.length > 0
      ? {
          ...group,
          children: matchesGroupTitle ? group.children : filteredChildren,
        }
      : null;
  };

  const filteredDataLayers = (dataLayers || [])
    .map(filterGroup)
    .filter(Boolean);

  return (
    <DataLaagSelectContainer>
      <DataLaagSelectPanel ref={panelRef} $isOpen={isOpen}>
        <Header>
          <TopRow>
            <TitleGroup>
              <FiLayers size={20} />
              <h1>Data Layers</h1>
            </TitleGroup>
            <SwitchGroup>
              <Switch
                checked={showOnlyActive}
                onChange={() => setShowOnlyActive(!showOnlyActive)}
              />
              <span>Show active only</span>
            </SwitchGroup>
          </TopRow>

          <TextInput
            type="text"
            placeholder="Filter layers..."
            value={filterQuery}
            onChange={(e) => setFilterQuery(e.target.value)}
          />
        </Header>

        <Content>
          {filteredDataLayers.length > 0 ? (
            filteredDataLayers.map((group) => (
              <Accordion key={group.id} title={group.title}>
                {group.children.map((layer) =>
                  renderLayer(
                    layer,
                    group.id,
                    0,
                    true, // parentActive
                    onToggleLayer,
                    loadingLayers,
                    layer.id, // parentId
                    activeStyles // activeStyles
                  )
                )}
              </Accordion>
            ))
          ) : (
            <NoResults>No results found</NoResults>
          )}
        </Content>
        <BottomSpacer />
      </DataLaagSelectPanel>
    </DataLaagSelectContainer>
  );
}

// Utility to fetch and parse WMS capabilities
// async function fetchWMSCapabilities(url) {
//   const response = await fetch(`${url}SERVICE=WMS&REQUEST=GetCapabilities`);
//   const text = await response.text();
//   const parser = new DOMParser();
//   return parser.parseFromString(text, "text/xml");
// }

// function parseLayerStyles(xml, layerName) {
//   const layers = Array.from(xml.getElementsByTagName("Layer"));
//   const layer = layers.find(
//     (l) => l.getElementsByTagName("Name")[0]?.textContent === layerName
//   );
//   if (!layer) return [];
//   return Array.from(layer.getElementsByTagName("Style")).map((s) => ({
//     name: s.getElementsByTagName("Name")[0].textContent,
//     title: s.getElementsByTagName("Title")[0].textContent,
//   }));
// }

// Fetch WMS capabilities once on mount
// useEffect(() => {
//   const fetchAllCapabilities = async () => {
//     const results = {};

//     // Loop over all datasets in your config
//     for (const datasetKey of Object.keys(DATASET_CONFIG)) {
//       const dataset = DATASET_CONFIG[datasetKey];

//       if (dataset.type === "wms" && dataset.url) {
//         try {
//           const xml = await fetchWMSCapabilities(dataset.url);
//           const layers = Array.from(xml.getElementsByTagName("Layer"))
//             .map((l) => l.getElementsByTagName("Name")[0]?.textContent)
//             .filter(Boolean);

//           for (const layerName of layers) {
//             results[layerName] = parseLayerStyles(xml, layerName);
//           }
//         } catch (err) {
//           console.warn(`[WMS Capabilities] Failed for ${dataset.id}`, err);
//         }
//       }
//     }

//     setWmsCapabilities(results);
//   };

//   fetchAllCapabilities();
// }, []);

//check current state active style
// useEffect(() => {
//   console.log("[activeStyles][current state]", activeStyles);
// }, [activeStyles]);

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
//     console.log("[TOGGLE CHECKBOX]", layerId, "was active:", layer.active);

//     const newActive = !layer.active; // the *next* intended state
//     setLayerActive(mapRef.current, groupId, layerId, "checkbox");

//     // If turning OFF → deactivate any active styles and radios
//     if (!newActive) {
//       console.log("[Checkbox OFF] Clearing active styles for", layerId);

//       setActiveStyles((prev) => {
//         const copy = { ...prev };
//         delete copy[layerId];
//         return copy;
//       });

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
//                           c.inputType === "radio" || c.styles
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

//     // Update UI: only this style is active for its parent
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
//     // setActiveStyles((prev) => ({ ...prev, [parentId]: styleName }));

//     // Update WMS layer if active
//     const parentLayer = findLayerById(groupId, parentId, dataLayers);
//     if (parentLayer?.active) {
//       const olLayerKey = `${groupId}:${parentId}`;
//       const olLayer = wmsWmtsLayersRef.current[olLayerKey];
//       if (!olLayer?.getSource) return;

//       const source = olLayer.getSource();
//       const params = source.getParams();
//       const newParams = { ...params, STYLES: styleName };
//       source.updateParams(newParams);
//       source.refresh();
//     }

//     setActiveStyles((prev) => {
//       const updated = { ...prev };
//       if (parentLayer?.active) {
//         updated[parentId] = styleName;
//       } else {
//         delete updated[parentId];
//       }
//       console.log("[activeStyles][before]", prev);
//       console.log("[activeStyles][after]", updated);
//       return updated;
//     });
//   }
// };
