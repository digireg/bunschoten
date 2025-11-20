import { useRef, useState } from "react";
import Draw from "ol/interaction/Draw";
import { getLength, getArea } from "ol/sphere";
import Point from "ol/geom/Point";
import LineString from "ol/geom/LineString";
import { Style, Fill, Stroke, Text } from "ol/style";

export default function useMeasurementTool(mapInstance, measureLayer) {
  const drawRef = useRef(null);
  const [activeTool, setActiveTool] = useState(null);

  // --- update measurement label ---
  const updateMeasurement = (feature) => {
    const geom = feature.getGeometry();
    let output = "";

    if (geom instanceof LineString) {
      output = `${getLength(geom).toFixed(2)} m`;
    } else if (geom instanceof Point) {
      output = geom.getCoordinates().map((c) => c.toFixed(2)).join(", ");
    } else {
      output = `${getArea(geom).toFixed(2)} m²`;
    }

    feature.setStyle(
      new Style({
        fill: new Fill({ color: "rgba(255, 255, 255, 0.2)" }),
        stroke: new Stroke({ color: "#ffcc33", width: 2 }),
        text: new Text({
          text: output,
          font: "14px Calibri,sans-serif",
          fill: new Fill({ color: "#000" }),
          stroke: new Stroke({ color: "#fff", width: 3 }),
        }),
      })
    );
  };

  // --- start measurement tool ---
  const startMeasurement = (type) => {
    if (!mapInstance || !measureLayer) return;

    stopMeasurement();

    const draw = new Draw({
      source: measureLayer.getSource(),
      type,
    });

    draw.on("drawstart", (evt) => {
      evt.feature.getGeometry().on("change", () => {
        updateMeasurement(evt.feature);
      });
    });

    mapInstance.addInteraction(draw);
    drawRef.current = draw;
  };

  // --- stop measuring ---
  const stopMeasurement = () => {
    if (drawRef.current && mapInstance) {
      mapInstance.removeInteraction(drawRef.current);
      drawRef.current = null;
    }
  };

  // --- clear all measurements ---
  const clearMeasurements = () => {
    if (measureLayer) {
      measureLayer.getSource().clear();
    }
  };

  // --- stop & clear ---
  const stopAndClearMeasurement = () => {
    if (drawRef.current && mapInstance) {
      if (drawRef.current.abortDrawing) {
        drawRef.current.abortDrawing(); // correct OL method
      }
      mapInstance.removeInteraction(drawRef.current);
      drawRef.current = null;
      setActiveTool(null);
    }
    if (measureLayer) {
      measureLayer.getSource().clear();
    }
  };

  // --- select tool ---
  const handleSelectTool = (toolId) => {
    setActiveTool(toolId);

    switch (toolId) {
      case "lijnMeten":
        startMeasurement("LineString");
        break;
      case "polygonMeten":
        startMeasurement("Polygon");
        break;
      case "wisMeting":
        clearMeasurements();
        break;
      case "stopMeting":
        stopMeasurement();
        break;
      case "stopEnWisMeting":
        stopAndClearMeasurement();
        break;
      default:
        break;
    }
  };

  return {
    activeTool,
    handleSelectTool,
    stopMeasurement,
    clearMeasurements,
    stopAndClearMeasurement,
  };
}
