import { useEffect } from "react";
import TileWMS from "ol/source/TileWMS";
import GeoJSON from "ol/format/GeoJSON";

export function useMapClickHandler({
  mapInstance,
  dataLayers,
  wmsWmtsLayersRef,
  setSelectedFeature,
  setSelectedFeatureId,
  setActivePanel,
  clearFeatures,
  addFeatures,
}) {
  useEffect(() => {
    if (!mapInstance.current) return;

    const map = mapInstance.current;

    const onClick = async (evt) => {
      const coordinate = evt.coordinate;
      const view = map.getView();
      const resolution = view.getResolution();
      const projection = view.getProjection().getCode();

      console.log("[CLICK] Map clicked", coordinate);
      console.log("[CLICK] Resolution:", resolution, "Projection:", projection);

      let clickedFeature = null;
      let clickedLayerId = null;

      // Recursive function to check layer and children
      async function checkLayer(layer) {
        if (!layer.active) return null;

        let features = null;

        if (layer.type === "WMS") {
          // Ensure WMS source exists
          if (!wmsWmtsLayersRef.current[layer.id]) {
            const source = new TileWMS({
              url: layer.url,
              params: { LAYERS: layer.wmsLayerName || layer.id, TILED: true },
              serverType: "mapserver",
              crossOrigin: "anonymous",
            });
            wmsWmtsLayersRef.current[layer.id] = source;
            layer.sourceRef = source;
            console.log("[DEBUG] WMS source created for:", layer.id);
          }

          const source = wmsWmtsLayersRef.current[layer.id];
          if (!source) return null;

          const url = source.getFeatureInfoUrl(
            coordinate,
            resolution,
            projection,
            {
              INFO_FORMAT: "application/json",
              QUERY_LAYERS: layer.wmsLayerName || layer.id,
              FEATURE_COUNT: 10,
            }
          );

          if (!url) return null;

          try {
            const res = await fetch(url);
            if (!res.ok) return null;
            const json = await res.json();

            if (json?.features?.length > 0) {
              const format = new GeoJSON();
              features = format.readFeatures(json, {
                featureProjection: projection,
              });
              console.log("[CHECKLAYER] Parsed features:", features);
            }
          } catch (err) {
            console.warn(
              "[CHECKLAYER] GetFeatureInfo failed for",
              layer.id,
              err
            );
          }
        }

        if (features && features.length > 0) {
          clickedLayerId = layer.id;
          return features;
        }

        if (layer.children?.length) {
          for (const child of layer.children) {
            const childFeatures = await checkLayer(child);
            if (childFeatures) return childFeatures;
          }
        }

        return null;
      }

      // Loop through all groups and layers
      for (const group of dataLayers) {
        for (const layer of group.children) {
          const features = await checkLayer(layer);
          if (features) {
            clickedFeature = features[0];
            clearFeatures();
            addFeatures(features);
            setSelectedFeature(clickedFeature.getProperties());
            setSelectedFeatureId(clickedFeature.getId() || clickedLayerId);
            setActivePanel("laagdata");
            break;
          }
        }
        if (clickedFeature) break;
      }

      if (!clickedFeature) {
        console.log("[CLICK] No features found");
        clearFeatures();
        setSelectedFeature(null);
        setSelectedFeatureId(null);
      }
    };

    map.on("singleclick", onClick);

    return () => map.un("singleclick", onClick); // cleanup
  }, [
    mapInstance,
    dataLayers,
    wmsWmtsLayersRef,
    setSelectedFeature,
    setSelectedFeatureId,
    setActivePanel,
    clearFeatures,
    addFeatures,
  ]);
}
