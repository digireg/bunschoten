import { useMemo } from "react";
import { Vector as VectorLayer } from "ol/layer";
import { Vector as VectorSource } from "ol/source";

export default function useMeasurementLayer(updateMeasurement) {
  return useMemo(
    () =>
      new VectorLayer({
        source: new VectorSource(),
        zIndex: 1000,
        style: updateMeasurement,
      }),
    [updateMeasurement]
  );
}
