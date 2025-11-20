import React, { useEffect, useRef, useState } from "react";
import { FiEye } from "react-icons/fi";
import {
  TransparantieLaagContainer,
  TransparantieLaagPanel,
  TextInput,
  NoResults,
  OpacitySlider,
  Header,
  TitleGroup,
  Content,
} from "../style_components";
import { flattenDataLayers } from "./flattenDataLayers";

export default function TransparantieLaagSelect({
  isOpen,
  setActivePanel,
  dataLayers,
  setLayerOpacity,
}) {
  const panelRef = useRef(null);
  const [searchQuery, setSearchQuery] = useState("");

  const flattenedLayers = flattenDataLayers(dataLayers);

  const filteredLayers = flattenedLayers.filter(
    (layer) =>
      (layer.label || "").toLowerCase().includes(searchQuery.toLowerCase()) &&
      layer.active
  );

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (panelRef.current && !panelRef.current.contains(event.target)) {
        setActivePanel(null);
      }
    };
    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isOpen, setActivePanel]);

  return (
    <TransparantieLaagContainer>
      <TransparantieLaagPanel ref={panelRef} $isOpen={isOpen}>
        <Header>
          <TitleGroup>
            <FiEye size={20} />
            <h1>Layer opacity</h1>
          </TitleGroup>
          <TextInput
            id="filterTransparatieLagen"
            type="text"
            placeholder="Filter layers..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </Header>

        <Content>
          {filteredLayers.length > 0 ? (
            filteredLayers.map(({ groupId, id, label, key }) => {
              const group = dataLayers.find((g) => g.id === groupId);
              if (!group) return null;

              const layer = group.children.find((l) => l.id === id);
              if (!layer) return null;

              return (
                <OpacitySlider
                  key={key} // ✅ guaranteed unique
                  label={label || layer.title || "Unnamed Layer"}
                  value={layer.opacity}
                  onChange={(newOpacity) =>
                    setLayerOpacity(groupId, layer.id, newOpacity)
                  }
                />
              );
            })
          ) : (
            <NoResults>No layers found.</NoResults>
          )}
        </Content>
      </TransparantieLaagPanel>
    </TransparantieLaagContainer>
  );
}
