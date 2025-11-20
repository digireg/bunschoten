import { useRef, useState, useEffect } from "react";
import Map from "ol/Map";
import View from "ol/View";
import { get as getProjection } from "ol/proj";
import { Style, Fill, Stroke } from "ol/style";
import { Vector as VectorLayer } from "ol/layer";
import { Vector as VectorSource } from "ol/source";

import { ScaleLine, Attribution } from "ol/control"; // <-- normal import
import useBackgroundLayer from "../hooks/UseBackgroundLayer";
import {
  highlightLayerFactory,
  measureLayerFactory,
  createBaseLayer,
} from "../utils/olHelper";
import proj4 from "proj4";

export default function useMapInstance({
  mapRef,
  initialProjection = "EPSG:3857",
  initialCenter = [0, 0],
  initialZoom = 14,
  activeBackgroundLayer,
  setActiveBackgroundLayer,
}) {
  const mapInstance = useRef(null);
  const [currentProjectionCode, setCurrentProjectionCode] =
    useState(initialProjection);

  const highlightLayer = useRef(highlightLayerFactory());
  const measureLayer = useRef(measureLayerFactory());

  const { switchBackgroundIfNeeded } = useBackgroundLayer({
    mapRef,
    mapInstance,
    activeBackgroundLayer,
    setActiveBackgroundLayer,
    currentProjectionCode,
    setCurrentProjectionCode,
  });

  const createMap = (
    projCode = currentProjectionCode,
    center = initialCenter,
    zoom = initialZoom,
    backgroundId = activeBackgroundLayer
  ) => {
    if (mapInstance.current) {
      mapInstance.current.setTarget(null);
      mapInstance.current = null;
    }

    const baseLayer = createBaseLayer(projCode, backgroundId);
    const centerProj =
      projCode === "EPSG:28992"
        ? proj4("EPSG:4326", "EPSG:28992", center)
        : center;

    const map = new Map({
      target: mapRef.current,
      layers: [
        baseLayer || new VectorLayer({ source: new VectorSource() }),
        highlightLayer.current,
        measureLayer.current,
      ],
      view: new View({
        projection: getProjection(projCode),
        center: centerProj,
        zoom,
      }),
      controls: [],
      renderer: "canvas",
    });

    map.addControl(
      new ScaleLine({ units: "metric", bar: true, steps: 4, text: true })
    );
    map.addControl(new Attribution({ collapsible: true }));

    mapInstance.current = map;
    return map;
  };

  useEffect(() => {
    if (!mapInstance.current) return;
    const view = mapInstance.current.getView();
    const onChange = () => switchBackgroundIfNeeded();
    view.on("change:center", onChange);
    view.on("change:resolution", onChange);
    return () => {
      view.un("change:center", onChange);
      view.un("change:resolution", onChange);
    };
  }, [mapInstance.current, currentProjectionCode, activeBackgroundLayer]);

  return {
    mapRef,
    mapInstance,
    createMap,
    highlightLayer,
    measureLayer,
    currentProjectionCode,
    setCurrentProjectionCode,
  };
}
