import React, { useState } from "react";
import OLMap from "./components/Map";
import "react-toastify/dist/ReactToastify.css";
import { ToastContainer } from "react-toastify";
import { Helmet } from "react-helmet";
import MenuContainer from "./components/MenuContainer";

export default function App() {
  /**
   * State to track which side panel is currently active/open.
   * E.g. 'achtergrond', 'lagen', 'labels', etc. or null if none is open.
   */
  const [activePanel, setActivePanel] = useState(null);

  /**
   * State to track which background layer is active..
   * Default is 'openstreet' so the map shows OpenStreetMap on load.
   */
  const [activeBackgroundLayer, setActiveBackgroundLayer] =
    useState("openstreet");

  return (
    <>
      {/* Helmet manages document <head>, e.g. adding Google Fonts */}
      <Helmet>
        <link
          href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap"
          rel="stylesheet"
        />
      </Helmet>

      {/* Top/side menu: lets user open panels like background selector, data layers, etc. */}
      <MenuContainer
        activePanel={activePanel}
        setActivePanel={setActivePanel}
      />

      {/* The main OpenLayers map component */}
      <OLMap
        activePanel={activePanel}
        setActivePanel={setActivePanel}
        activeBackgroundLayer={activeBackgroundLayer}
        setActiveBackgroundLayer={setActiveBackgroundLayer}
      />
      <ToastContainer
        position="top-right"
        autoClose={5000} // 5 seconds
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
      />
    </>
  );
}
