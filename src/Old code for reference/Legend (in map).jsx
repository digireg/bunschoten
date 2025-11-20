// const generateWmsLegend = React.useCallback((layers) => {
//   return layers.map((layer) => {
//     const legendUrl = layer.legendUrl ?? getWmsLegendUrl(layer);
//     console.log(
//       "Generating legend URL → layer.id:",
//       layer.id,
//       "URL:",
//       legendUrl
//     );
//     return { ...layer, legendUrl };
//   });
// }, []);

// React.useEffect(() => {
//   if (!flattenedLayers || flattenedLayers.length === 0) {
//     console.log("Legend effect skipped — no flattened layers");
//     return;
//   }

//   // Only active WMS layers
//   const activeWmsLayers = flattenedLayers.filter(
//     (layer) => layer.active && layer.type === "wms"
//   );

//   console.log("Legend effect running — active WMS layers:", activeWmsLayers);

//   const activeLayersWithLegend = generateWmsLegend(
//     activeWmsLayers.map((layer) => ({
//       ...layer,
//       groupTitle: layer.groupTitle || layer.title || "UnknownGroup",
//     }))
//   );

//   setActiveLegendLayers(activeLayersWithLegend);
// }, [flattenedLayers, generateWmsLegend]);

// function generateWmsLegend(layer) {
//   if (!layer.url || !layer.id) return null;

//   const params = new URLSearchParams({
//     SERVICE: "WMS",
//     REQUEST: "GetLegendGraphic",
//     FORMAT: "image/png",
//     LAYER: layer.id,
//     VERSION: "1.3.0",
//     STYLE: layer.style || "default",
//     SLD_VERSION: "1.1.0",
//   });

//   const url = `${layer.url}?${params.toString()}`;
//   console.log("Generating legend URL → layer:", layer.id, "URL:", url);
//   return url;
// }

// useEffect(() => {
//   if (!dataLayers || dataLayers.length === 0) {
//     console.log("[LegendEffect] No data layers yet.");
//     return;
//   }

//   const flattened = flattenDataLayers(dataLayers);
//   console.log("[LegendEffect] Flattened layers:", flattened);

//   const activeWmsLayers = flattened.filter(
//     (layer) => layer.active && layer.type === "wms"
//   );

//   console.log("[LegendEffect] Active WMS layers:", activeWmsLayers);

//   setActiveLegendLayers(activeWmsLayers);
// }, [dataLayers]);

// useEffect(() => {
//   if (!dataLayers || dataLayers.length === 0) return;

//   const flattened = flattenDataLayers(dataLayers);

//   const activeWmsLayers = flattened
//     .filter((layer) => layer.active && layer.type === "wms")
//     .map((layer) => ({
//       ...layer,
//       // Auto-generate legend URL only if missing
//       legendUrl: layer.legendUrl || getWmsLegendUrl(layer),
//     }));

//   setActiveLegendLayers(activeWmsLayers);
// }, [dataLayers]);

// const wmsLayers = flattenDataLayers(dataLayers).filter(
//   (layer) => layer.active && layer.type === "wms"
// );

// const legendUrls = useWMSLegends(wmsLayers);

// useEffect(() => {
//   const flattened = flattenDataLayers(dataLayers);
//   const activeLayers = flattened.filter((layer) => layer.active);

//   const activeLayersWithLegends = activeLayers.map((layer) => {
//     if (layer.type === "wms") {
//       return { ...layer, legendUrl: legendUrls[layer.layerName] };
//     }
//     return layer;
//   });

//   setActiveLegendLayers(activeLayersWithLegends);
// }, [dataLayers, legendUrls]);

// useEffect(() => {
//   const flattened = flattenDataLayers(dataLayers);
//   const activeLayers = flattened.filter((layer) => layer.active);

//   const activeLayersWithLegends = activeLayers.map((layer) => {
//     if (layer.type === "wms") {
//       // attach legends directly from the layer fetched by useDataLayerFetch
//       return { ...layer, legendUrls: layer.legends || [] };
//     }
//     return layer;
//   });

//   setActiveLegendLayers(activeLayersWithLegends);
// }, [dataLayers]);

// useEffect(() => {
//   console.log("[LegendEffect] Original dataLayers:", dataLayers);

//   if (!dataLayers || dataLayers.length === 0) {
//     console.log("[LegendEffect] No data layers found.");
//     setActiveLegendLayers([]);
//     return;
//   }

//   const flattened = flattenDataLayers(dataLayers);
//   const activeLayers = flattened.filter((layer) => layer.active);

//   const activeLayersWithLegends = activeLayers.map((layer) => {
//     let legendUrl = layer.legendUrl || null;

//     // PDOK override for pre-generated legend images
//     if (layer.url?.includes("pdok.nl") && layer.type === "wms") {
//       const [group, layerId] = layer.id.split(":");
//       legendUrl = `${layer.url.replace(/\?$/, "")}/legend/${layerId}/${layer.id}.png`;
//       console.log(`[LegendEffect] Active layer ${layer.id} → legendUrl: ${legendUrl}`);
//     } else {
//       console.log(`[LegendEffect] Active layer ${layer.id} → existing legendUrl: ${legendUrl}`);
//     }

//     return {
//       ...layer,
//       legendUrl,
//     };
//   });

//   console.log("[LegendEffect] Active legend layers:", activeLayersWithLegends);
//   setActiveLegendLayers(activeLayersWithLegends);
// }, [dataLayers]);
