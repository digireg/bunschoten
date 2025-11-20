import { useMemo, useEffect, useRef } from "react";
import { Draw } from "ol/interaction";
import { Vector as VectorSource } from "ol/source";
import { Vector as VectorLayer } from "ol/layer";
import { Style, Stroke, Fill } from "ol/style";

export function UseMeasurement(map) {
  // Vector layer to hold measurements
  const measureSource = useMemo(() => new VectorSource(), []);
  const measureLayer = useMemo(
    () =>
      new VectorLayer({
        source: measureSource,
        style: new Style({
          stroke: new Stroke({ color: "red", width: 2 }),
          fill: new Fill({ color: "rgba(255,0,0,0.2)" }),
        }),
      }),
    [measureSource]
  );

  const drawRef = useRef(null);

  useEffect(() => {
    if (map) {
      map.addLayer(measureLayer);
      return () => map.removeLayer(measureLayer);
    }
  }, [map, measureLayer]);

  const startMeasurement = (geomType) => {
    if (!map) return;

    if (drawRef.current) {
      map.removeInteraction(drawRef.current);
    }

    drawRef.current = new Draw({
      source: measureSource,
      type: geomType,
    });

    map.addInteraction(drawRef.current);

    drawRef.current.on("drawend", (event) => {
      console.log("Feature drawn:", event.feature);
      // calculate length/area here
    });
  };

  const clearMeasurements = () => {
    measureSource.clear();
  };

  return { startMeasurement, clearMeasurements, measureLayer, measureSource };
}