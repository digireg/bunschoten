//v6
import { useState, useEffect, useRef } from "react";
import useDataLayerFetch from "../hooks/UseDataLayerFetch";
import useNormalizeLayers from "../hooks/useNormalizeLayers";
import TileWMS from "ol/source/TileWMS";
import { Tile } from "ol/layer";
import { get as getProjection } from "ol/proj";
import GeoJSON from "ol/format/GeoJSON";
import { handleLayerActive } from "../utils/handleLayerActive";
import { addMapLayer } from "../utils/addMapLayer";
import { updateLayerOpacity } from "../utils/updateLayerOpacity";
import { zoomToLayer } from "../utils/zoomToLayer";
import { toast } from "react-toastify";

export default function useMapLayers({ projectionCode, highlightSource }) {
  const { dataLayers: fetchedDataLayers, loading, error } = useDataLayerFetch();
  const normalizedLayers = useNormalizeLayers(fetchedDataLayers);
  const [dataLayers, setDataLayers] = useState([]);
  const wmsWmtsLayersRef = useRef({});
  const [selectedFeatureId, setSelectedFeatureId] = useState(null);

  // ----------------------------
  // Recursively register WMS sources and inherit parent URL if missing
  // ----------------------------
  const registerLayerRecursive = (layer, parentUrl = null) => {
    const layerUrl = layer.url || parentUrl;

    if (
      layer.type?.toLowerCase() === "wms" &&
      !wmsWmtsLayersRef.current[layer.id]
    ) {
      const wmsLayerName = layer.wmsLayerName || layer.id;
      const source = new TileWMS({
        url: layerUrl,
        params: { LAYERS: wmsLayerName, TILED: true },
        serverType: "mapserver",
        crossOrigin: "anonymous",
      });
      wmsWmtsLayersRef.current[layer.id] = source;
      layer.sourceRef = source;
      // console.log("[DEBUG] Registered WMS source:", layer.id, {
      //   url: layerUrl,
      //   params: { LAYERS: wmsLayerName },
      // });
    }

    if (layer.children?.length) {
      layer.children.forEach((child) =>
        registerLayerRecursive(child, layerUrl)
      );
    }
  };

  useEffect(() => {
    if (!loading && normalizedLayers?.length) {
      setDataLayers(normalizedLayers);

      normalizedLayers.forEach((group) => {
        group.children.forEach((layer) =>
          registerLayerRecursive(layer, group.url)
        );
      });
    }
  }, [loading, normalizedLayers]);

  // ----------------------------
  // Toggle layer active
  // ----------------------------

  //v3 semi working radiobuttons
  // const setLayerActive = async (
  //   mapInstance,
  //   groupId,
  //   layerId,
  //   inputType = "checkbox",
  //   style = null
  // ) => {
  //   if (!mapInstance) return;
  //   let layerToZoom = null;

  //   // helper to ensure a WMS Tile source is registered for a layer
  //   const ensureSource = (layer, parentUrl = null) => {
  //     const url = layer.url || parentUrl;
  //     if (
  //       layer.type?.toLowerCase() === "wms" &&
  //       !wmsWmtsLayersRef.current[layer.id]
  //     ) {
  //       const wmsLayerName = layer.wmsLayerName || layer.id;
  //       const source = new TileWMS({
  //         url,
  //         params: { LAYERS: wmsLayerName, TILED: true },
  //         serverType: "mapserver",
  //         crossOrigin: "anonymous",
  //       });

  //       const tileLayer = new TileLayer({ source });
  //       wmsWmtsLayersRef.current[layer.id] = tileLayer;
  //       layer.sourceRef = source;

  //       console.log("[DEBUG] Registered WMS Tile layer:", layer.id);
  //     }
  //   };

  //   // Recursively walk and update the dataLayers children (pure data update)
  //   const toggleLayerById = (layers, parent = null, parentUrl = null) => {
  //     return layers.map((layer) => {
  //       // ensure we have a source reference if needed
  //       ensureSource(layer, parentUrl);

  //       // direct match (we hit the layer we toggled)
  //       if (layer.id === layerId) {
  //         // --------------------
  //         // 1) RADIO on parent that has a styles array: change activeStyle
  //         // --------------------
  //         if (inputType === "radio" && style != null && layer.styles?.length) {
  //           const updated = { ...layer, active: true, activeStyle: style };

  //           const handled = handleLayerActive({
  //             parent: updated,
  //             mapInstance,
  //             groupId,
  //             inputType: "radio",
  //             style,
  //             wmsWmtsLayersRef,
  //             projectionCode,
  //             highlightSource,
  //           });

  //           if (handled?.layerToZoom && !layerToZoom)
  //             layerToZoom = handled.layerToZoom;

  //           // ✅ reflect active state of style-children
  //           const newChildren = layer.children?.map((c) => ({
  //             ...c,
  //             active: c.id === layerId,
  //           }));

  //           return { ...updated, children: newChildren };
  //         }

  //         // --------------------
  //         // 2) CHECKBOX toggle for this layer (works like before)
  //         // --------------------
  //         // if (inputType === "checkbox") {
  //         //   const handled = handleLayerActive({
  //         //     parent: layer,
  //         //     mapInstance,
  //         //     groupId,
  //         //     inputType: "checkbox",
  //         //     wmsWmtsLayersRef,
  //         //     projectionCode,
  //         //     highlightSource,
  //         //   });
  //         //   if (handled?.layerToZoom && !layerToZoom)
  //         //     layerToZoom = handled.layerToZoom;

  //         //   // If we just activated a parent AND the parent has radio-style children,
  //         //   // auto-activate the first style-child (so a visible style appears on the map).
  //         //   if (
  //         //     handled.active &&
  //         //     layer.children?.some((c) => c.inputType === "radio")
  //         //   ) {
  //         //     const firstChild = layer.children.find(
  //         //       (c) => c.inputType === "radio"
  //         //     );
  //         //     if (firstChild) {
  //         //       ensureSource(firstChild, layer.url || parentUrl);
  //         //       // add map layer for the first child
  //         //       const handledChild = handleLayerActive({
  //         //         parent: { ...firstChild, active: true },
  //         //         mapInstance,
  //         //         groupId,
  //         //         inputType: "checkbox",
  //         //         wmsWmtsLayersRef,
  //         //         projectionCode,
  //         //         highlightSource,
  //         //       });
  //         //       if (handledChild?.layerToZoom && !layerToZoom)
  //         //         layerToZoom = handledChild.layerToZoom;

  //         //       // reflect children active states in returned data
  //         //       const newChildren = layer.children.map((c) => ({
  //         //         ...c,
  //         //         active: c.id === firstChild.id,
  //         //       }));
  //         //       return { ...handled, children: newChildren };
  //         //     }
  //         //   }

  //         //   return { ...handled, children: layer.children };
  //         // }
  //         if (inputType === "checkbox") {
  //           const handled = handleLayerActive({
  //             parent: layer,
  //             mapInstance,
  //             groupId,
  //             inputType: "checkbox",
  //             wmsWmtsLayersRef,
  //             projectionCode,
  //             highlightSource,
  //             parentLayer: layer, // Pass parent for BBox fallback
  //           });

  //           if (handled?.layerToZoom && !layerToZoom)
  //             layerToZoom = handled.layerToZoom;

  //           // Auto-activate first style child if exists
  //           if (
  //             handled.active &&
  //             layer.children?.some((c) => c.inputType === "radio")
  //           ) {
  //             const firstChild = layer.children.find(
  //               (c) => c.inputType === "radio"
  //             );
  //             if (firstChild) {
  //               const handledChild = handleLayerActive({
  //                 parent: { ...firstChild, active: true },
  //                 mapInstance,
  //                 groupId,
  //                 inputType: "checkbox",
  //                 wmsWmtsLayersRef,
  //                 projectionCode,
  //                 highlightSource,
  //                 parentLayer: layer, // <-- important for BBox fallback
  //               });

  //               if (handledChild?.layerToZoom && !layerToZoom)
  //                 layerToZoom = handledChild.layerToZoom;

  //               const newChildren = layer.children.map((c) => ({
  //                 ...c,
  //                 active: c.id === firstChild.id,
  //               }));

  //               return { ...handled, children: newChildren };
  //             }
  //           }

  //           return { ...handled, children: layer.children };
  //         }
  //         // --------------------
  //         // 3) RADIO clicked on a layer that itself is a radio-type (a child-style node)
  //         //    -> activate this child and let parent remain active
  //         // --------------------
  //         if (inputType === "radio" && layer.inputType === "radio") {
  //           // Activate this child on the map
  //           const handledChild = handleLayerActive({
  //             parent: { ...layer, active: true },
  //             mapInstance,
  //             groupId,
  //             inputType: "checkbox",
  //             wmsWmtsLayersRef,
  //             projectionCode,
  //             highlightSource,
  //           });
  //           if (handledChild?.layerToZoom && !layerToZoom)
  //             layerToZoom = handledChild.layerToZoom;
  //           // mark the child active in state
  //           return { ...layer, active: true, children: layer.children };
  //         }

  //         return layer;
  //       }

  //       // Recurse children
  //       if (layer.children?.length) {
  //         // special-case: target is one of this node's children and we clicked a radio:
  //         //   -> set this parent active, set only the chosen child active, deactivate others,
  //         //      and update map layers accordingly.
  //         if (
  //           inputType === "radio" &&
  //           layer.children.some((c) => c.id === layerId)
  //         ) {
  //           // ensure parent remains active
  //           const newChildren = layer.children.map((c) => {
  //             if (c.id === layerId) {
  //               ensureSource(c, c.url || layer.url || parentUrl);
  //               // activate newly selected child on the map
  //               const handledSel = handleLayerActive({
  //                 parent: { ...c, active: true },
  //                 mapInstance,
  //                 groupId,
  //                 inputType: "checkbox",
  //                 wmsWmtsLayersRef,
  //                 projectionCode,
  //                 highlightSource,
  //               });
  //               if (handledSel?.layerToZoom && !layerToZoom)
  //                 layerToZoom = handledSel.layerToZoom;
  //               return { ...c, active: true };
  //             } else {
  //               // if sibling was active, deactivate it on the map
  //               if (c.active) {
  //                 handleLayerActive({
  //                   parent: { ...c, active: false },
  //                   mapInstance,
  //                   groupId,
  //                   inputType: "checkbox",
  //                   wmsWmtsLayersRef,
  //                   projectionCode,
  //                   highlightSource,
  //                 });
  //               }
  //               return { ...c, active: false };
  //             }
  //           });

  //           return { ...layer, active: true, children: newChildren };
  //         }

  //         // otherwise normal recursion
  //         return {
  //           ...layer,
  //           children: toggleLayerById(
  //             layer.children,
  //             layer,
  //             layer.url || parentUrl
  //           ),
  //         };
  //       }

  //       return layer;
  //     });
  //   };

  //   // apply update to the correct group
  //   setDataLayers((prevGroups) =>
  //     prevGroups.map((group) =>
  //       group.id === groupId
  //         ? {
  //             ...group,
  //             children: toggleLayerById(group.children, null, group.url),
  //           }
  //         : group
  //     )
  //   );

  //   if (layerToZoom)
  //     requestAnimationFrame(() => zoomToLayer(mapInstance, layerToZoom));
  // };

  const setLayerActive = async (
    mapInstance,
    groupId,
    layerId,
    inputType = "checkbox",
    style = null
  ) => {
    if (!mapInstance) return;
    let layerToZoom = null;

    const ensureSource = (layer, parentUrl = null) => {
      const url = layer.url || parentUrl;
      if (
        layer.type?.toLowerCase() === "wms" &&
        !wmsWmtsLayersRef.current[layer.id]
      ) {
        const wmsLayerName = layer.wmsLayerName || layer.id;
        const source = new TileWMS({
          url,
          params: { LAYERS: wmsLayerName, TILED: true },
          serverType: "mapserver",
          crossOrigin: "anonymous",
        });

        const tileLayer = new TileLayer({ source });
        wmsWmtsLayersRef.current[layer.id] = tileLayer;
        layer.sourceRef = source;

        console.log("[DEBUG] Registered WMS Tile layer:", layer.id);
      }
    };

    const toggleLayerById = (layers, parent = null, parentUrl = null) => {
      return layers.map((layer) => {
        ensureSource(layer, parentUrl);

        // direct match
        if (layer.id === layerId) {
          // RADIO on parent with styles
          if (inputType === "radio" && style != null && layer.styles?.length) {
            const updated = { ...layer, active: true, activeStyle: style };

            const handled = handleLayerActive({
              parent: updated,
              mapInstance,
              groupId,
              inputType: "radio",
              style,
              wmsWmtsLayersRef,
              projectionCode,
              highlightSource,
            });

            if (handled?.layerToZoom && !layerToZoom)
              layerToZoom = handled.layerToZoom;

            const newChildren = layer.children?.map((c) => ({
              ...c,
              active: c.id === layerId,
            }));

            return { ...handled, children: newChildren };
          }

          // CHECKBOX toggle (sublayers allowed regardless of parent)
          if (inputType === "checkbox") {
            const handled = handleLayerActive({
              parent: layer,
              mapInstance,
              groupId,
              inputType: "checkbox",
              wmsWmtsLayersRef,
              projectionCode,
              highlightSource,
              parentLayer: layer, // for BBox fallback
            });

            if (handled?.layerToZoom && !layerToZoom)
              layerToZoom = handled.layerToZoom;

            // auto-activate first radio-style child if parent checkbox activated
            if (
              handled.active &&
              layer.children?.some((c) => c.inputType === "radio")
            ) {
              const firstChild = layer.children.find(
                (c) => c.inputType === "radio"
              );
              if (firstChild) {
                const handledChild = handleLayerActive({
                  parent: { ...firstChild, active: true },
                  mapInstance,
                  groupId,
                  inputType: "checkbox",
                  wmsWmtsLayersRef,
                  projectionCode,
                  highlightSource,
                  parentLayer: layer,
                });

                if (handledChild?.layerToZoom && !layerToZoom)
                  layerToZoom = handledChild.layerToZoom;

                const newChildren = layer.children.map((c) => ({
                  ...c,
                  active: c.id === firstChild.id,
                }));

                return { ...handled, children: newChildren };
              }
            }

            return { ...handled, children: layer.children };
          }

          // RADIO clicked on a radio child node
          if (inputType === "radio" && layer.inputType === "radio") {
            const handledChild = handleLayerActive({
              parent: { ...layer, active: true },
              mapInstance,
              groupId,
              inputType: "checkbox",
              wmsWmtsLayersRef,
              projectionCode,
              highlightSource,
              parentLayer: parent, // for BBox fallback
            });
            if (handledChild?.layerToZoom && !layerToZoom)
              layerToZoom = handledChild.layerToZoom;
            return { ...layer, active: true, children: layer.children };
          }

          return layer;
        }

        // Recurse children
        if (layer.children?.length) {
          if (
            inputType === "radio" &&
            layer.children.some((c) => c.id === layerId)
          ) {
            const newChildren = layer.children.map((c) => {
              if (c.id === layerId) {
                ensureSource(c, c.url || layer.url || parentUrl);
                const handledSel = handleLayerActive({
                  parent: { ...c, active: true },
                  mapInstance,
                  groupId,
                  inputType: "checkbox",
                  wmsWmtsLayersRef,
                  projectionCode,
                  highlightSource,
                  parentLayer: layer,
                });
                if (handledSel?.layerToZoom && !layerToZoom)
                  layerToZoom = handledSel.layerToZoom;
                return { ...c, active: true };
              } else {
                if (c.active) {
                  handleLayerActive({
                    parent: { ...c, active: false },
                    mapInstance,
                    groupId,
                    inputType: "checkbox",
                    wmsWmtsLayersRef,
                    projectionCode,
                    highlightSource,
                  });
                }
                return { ...c, active: false };
              }
            });
            return { ...layer, active: true, children: newChildren };
          }

          return {
            ...layer,
            children: toggleLayerById(
              layer.children,
              layer,
              layer.url || parentUrl
            ),
          };
        }

        return layer;
      });
    };

    setDataLayers((prevGroups) =>
      prevGroups.map((group) =>
        group.id === groupId
          ? {
              ...group,
              children: toggleLayerById(group.children, null, group.url),
            }
          : group
      )
    );

    if (layerToZoom)
      requestAnimationFrame(() => zoomToLayer(mapInstance, layerToZoom));
  };

  // ----------------------------
  // Click handler debug helper
  // ----------------------------
  // const getWMSFeatureInfoUrlDebug = (
  //   layer,
  //   coordinate,
  //   resolution,
  //   projectionCode
  // ) => {
  //   const source = wmsWmtsLayersRef.current[layer.id];
  //   if (!source) {
  //     console.warn("[DEBUG] No WMS source for layer:", layer.id);
  //     return null;
  //   }

  //   const url = source.getFeatureInfoUrl(
  //     coordinate,
  //     resolution,
  //     projectionCode,
  //     {
  //       INFO_FORMAT: "application/json",
  //       QUERY_LAYERS: layer.wmsLayerName || layer.id,
  //       FEATURE_COUNT: 10,
  //     }
  //   );

  //   console.log("[DEBUG] getFeatureInfoUrl for layer:", layer.id, { url });
  //   return url;
  // };

  /**
   * Returns a proper GetFeatureInfo URL for a WMS layer, handling style-only IDs.
   * Automatically uses the parent WMS layer if the active style is a style ID.
   *
   * @param {Object} layer - The parent layer object (from your layer config)
   * @param {Array<number>} coordinate - Map click coordinate
   * @param {number} resolution - Map resolution
   * @param {string} projectionCode - EPSG code of the map view
   * @param {Object} activeStyles - Object mapping layerId → style ID (if any)
   * @returns {string|null} - FeatureInfo URL or null if unavailable
   */
  const getWMSFeatureInfoUrlDebug = (
    layer,
    coordinate,
    resolution,
    projectionCode
  ) => {
    // get the real source
    const source = wmsWmtsLayersRef.current[layer.id];
    if (!source) {
      console.warn("[DEBUG] No WMS source for layer:", layer.id);
      return null;
    }

    // use the actual WMS layer name, fallback to layer.id
    const wmsLayer = layer.wmsLayerName || layer.id;

    const url = source.getFeatureInfoUrl(
      coordinate,
      resolution,
      projectionCode,
      {
        INFO_FORMAT: "application/json",
        QUERY_LAYERS: wmsLayer, // 👈 important: real WMS name
        FEATURE_COUNT: 10,
      }
    );

    console.log("[DEBUG] getFeatureInfoUrl for layer:", layer.id, {
      wmsLayer,
      url,
    });
    return url;
  };

  // const getFeaturesFromWMTS = async (layer, evt) => {
  //   const source = wmsWmtsLayersRef.current[layer.id];
  //   if (!source) {
  //     console.warn(`[WMTS] No source found for layer: ${layer.id}`);
  //     toast.warning(`Layer source not found: ${layer.id}`);
  //     return null;
  //   }

  //   try {
  //     const map = mapInstance.current;
  //     const view = map.getView();
  //     const projection = view.getProjection();
  //     const resolution = view.getResolution();
  //     const coordinate = evt.coordinate;

  //     // Check if the source supports getFeatureInfoUrl
  //     if (typeof source.getFeatureInfoUrl === "function") {
  //       const url = source.getFeatureInfoUrl(
  //         coordinate,
  //         resolution,
  //         projection.getCode(),
  //         {
  //           INFO_FORMAT: "application/json",
  //         }
  //       );

  //       if (!url) return null;

  //       const res = await fetch(url);
  //       if (!res.ok) return null;

  //       const json = await res.json();
  //       if (json?.features?.length) {
  //         return new GeoJSON().readFeatures(json, {
  //           featureProjection: projection,
  //         });
  //       }
  //     } else {
  //       // If getFeatureInfoUrl not available, WMTS doesn't support direct GFI
  //       // 🔹 Option: fallback to WMS GetFeatureInfo for the same layer
  //       console.warn(
  //         `[WMTS] Layer ${layer.id} does not support getFeatureInfoUrl. Trying WMS fallback.`
  //       );

  //       if (!layer.wmsFallbackUrl || !layer.wmsLayerName) return null;

  //       const size = map.getSize();
  //       const viewResolution = view.getResolution();

  //       const wmsUrl = `${
  //         layer.wmsFallbackUrl
  //       }?SERVICE=WMS&VERSION=1.3.0&REQUEST=GetFeatureInfo&LAYERS=${
  //         layer.wmsLayerName
  //       }&QUERY_LAYERS=${
  //         layer.wmsLayerName
  //       }&INFO_FORMAT=application/json&FEATURE_COUNT=10&I=${Math.floor(
  //         evt.pixel[0]
  //       )}&J=${Math.floor(evt.pixel[1])}&WIDTH=${size[0]}&HEIGHT=${
  //         size[1]
  //       }&CRS=${projection.getCode()}&BBOX=${view
  //         .calculateExtent(size)
  //         .join(",")}`;

  //       const res = await fetch(wmsUrl);
  //       if (!res.ok) return null;

  //       const json = await res.json();
  //       if (json?.features?.length) {
  //         return new GeoJSON().readFeatures(json, {
  //           featureProjection: projection,
  //         });
  //       }
  //     }

  //     return null;
  //   } catch (err) {
  //     console.error(`[WMTS] GetFeatureInfo failed for layer ${layer.id}`, err);
  //     toast.error(`[WMTS] Error fetching features for layer ${layer.id}`);
  //     return null;
  //   }
  // };
  /*//*/
  // ----------------------------
  // Set layer opacity
  // ----------------------------
  const setLayerOpacity = (groupId, layerId, opacity) => {
    setDataLayers((prevGroups) =>
      prevGroups.map((group) =>
        group.id === groupId
          ? {
              ...group,
              children: updateLayerOpacity({
                layers: group.children,
                groupId,
                layerId,
                opacity,
                wmsWmtsLayersRef,
              }),
            }
          : group
      )
    );
  };

  const flattenedLayers = dataLayers.flatMap((group) => group.children ?? []);

  return {
    dataLayers,
    flattenedLayers,
    loading,
    error,
    setDataLayers,
    setLayerActive,
    setLayerOpacity,
    addMapLayer,
    selectedFeatureId,
    setSelectedFeatureId,
    wmsWmtsLayersRef,
    getWMSFeatureInfoUrlDebug,
    // getFeaturesFromWMTS,
  };
}
