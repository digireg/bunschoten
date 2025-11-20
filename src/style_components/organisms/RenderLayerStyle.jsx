import React from "react";
import styled from "styled-components";
import Spinner from "../atoms/Spinner";
import { tokens, components } from "../themes/light";

const LayerWrapper = styled.div`
  margin-bottom: 10px;
`;

const LayerRow = styled.div`
  display: flex;
  align-items: center;
  gap: ${tokens.space[2]};
  margin-left: ${({ $level }) => $level * 20}px;
`;

const StylesRow = styled.div`
  ${
    "" /* margin-left: ${({ $level }) => $level * 20 + 20}px;
  margin-top: 6px;
  display: flex;
  flex-wrap: wrap;
  gap: 12px; */
  }
  margin-left: ${({ $level }) => $level * 20 + 20}px;
  margin-top: 6px;
  display: flex;
  flex-direction: column; /* 🧩 stack radios vertically */
  gap: 8px; /* a bit less vertical space looks cleaner */
`;

const StyleLabel = styled.label`
  cursor: pointer;
  font-size: ${tokens.fontSizes[3]};
  display: flex;
  align-items: center;
  gap: ${tokens.space[1]};
`;

export const renderLayer = (
  layer,
  groupId,
  level = 0,
  parentActive = true,
  onToggleLayer,
  loadingLayers,
  parentId = null,
  activeStyles = {}
) => {
  const inputId = `input-${layer.key || layer.id}`;
  const isRadioInput = layer.inputType === "radio";

  // If parent is inactive, force child inactive visually
  const effectiveActive = parentActive && !!layer.active;

  // Compute style value for radio groups
  let radioValue;
  if (isRadioInput) {
    radioValue = activeStyles[layer.id] || layer.styles?.[0]?.name || layer.id;
  }

  return (
    <LayerWrapper key={inputId}>
      <LayerRow $level={level}>
        <input
          id={inputId}
          type={isRadioInput ? "radio" : "checkbox"}
          name={isRadioInput ? `style-${parentId || layer.id}` : undefined}
          value={isRadioInput ? radioValue : undefined}
          checked={!!layer.active}
          disabled={!!loadingLayers[`${groupId}:${layer.id}`]}
          onChange={() =>
            onToggleLayer(
              groupId,
              layer.id,
              isRadioInput ? "radio" : "checkbox",
              radioValue,
              parentId
            )
          }
        />
        <label htmlFor={inputId}>{layer.title || "Untitled"}</label>
        {loadingLayers[`${groupId}:${layer.id}`] && <Spinner size={14} />}
      </LayerRow>

      {/* === Render WMS styles (radio buttons) === */}
      {(() => {
        const isParentActive = parentActive;
        const isLayerActive = !!layer.active;
        const hasStyles =
          Array.isArray(layer.styles) && layer.styles.length > 0;
        const hasMultipleStyles = layer.styles?.length > 1;
        const hasSelectedStyle = !!activeStyles[layer.id];

        // Only show radios if parent & self active AND more than one style
        const shouldRenderRadios =
          isParentActive &&
          isLayerActive &&
          hasStyles &&
          hasMultipleStyles &&
          hasSelectedStyle;

        if (!shouldRenderRadios) return null;

        return (
          <StylesRow $level={level}>
            {layer.styles.map((style) => (
              <StyleLabel key={style.name}>
                <input
                  type="radio"
                  name={`style-${layer.id}`}
                  value={style.name}
                  checked={activeStyles[layer.id] === style.name}
                  onChange={() =>
                    onToggleLayer(
                      groupId,
                      style.id,
                      "radio",
                      style.name,
                      layer.id
                    )
                  }
                />
                {style.title || style.name}
              </StyleLabel>
            ))}
          </StylesRow>
        );
      })()}

      {/* === Render children recursively === */}
      {/* {layer.children?.length > 0 &&
        (() => {
          const radioChildren =
            layer.children?.filter((c) => c.inputType === "radio") || [];
          const parentHasMultipleStyles = radioChildren.length > 1;

          return (
            layer.children
              // Hide radios unless parent active AND parent has >1 style option
              .filter((child) => {
                if (child.inputType !== "radio") return true;
                return parentActive && layer.active && parentHasMultipleStyles;
              })
              .map((child) =>
                renderLayer(
                  child,
                  groupId,
                  level + 1,
                  parentActive && layer.active,
                  onToggleLayer,
                  loadingLayers,
                  layer.id,
                  activeStyles
                )
              )
          );
        })()} */}
      {/* === Render radio-style children (styles) ONLY — no sublayer checkboxes === */}
      {(() => {
        if (!parentActive || !layer.active) return null;

        // radio children declared as child nodes (inputType === 'radio')
        const radioChildren = (layer.children || []).filter(
          (c) => c.inputType === "radio"
        );

        // or styles declared directly on the layer (from WMS capabilities)
        const stylesFromLayer = Array.isArray(layer.styles) ? layer.styles : [];

        // nothing to render
        if (radioChildren.length === 0 && stylesFromLayer.length === 0)
          return null;

        // Build options. For radioChildren prefer child's own style name if present,
        // otherwise fall back to child's id. For stylesFromLayer, use style.name.
        const options =
          radioChildren.length > 0
            ? radioChildren.map((c) => ({
                id: c.id,
                label: c.title || c.id,
                value: (c.styles && c.styles[0] && c.styles[0].name) || c.id,
                sourceChild: c,
              }))
            : stylesFromLayer.map((s) => ({
                id: s.name,
                label: s.title || s.name,
                value: s.name,
                sourceStyle: s,
              }));

        // current selected style value (prefer activeStyles entry, otherwise default to first)
        const currentValue =
          activeStyles[layer.id] || (options[0] && options[0].value);

        if (options.length <= 1) return null;

        return (
          <StylesRow $level={level}>
            {options.map((opt, idx) => (
              <StyleLabel key={opt.id}>
                <input
                  type="radio"
                  name={`style-${layer.id}`}
                  value={opt.value}
                  checked={currentValue === opt.value}
                  onChange={() => {
                    // If this option came from an actual child node, pass that child's id (so findLayerById succeeds).
                    // Otherwise (stylesFromLayer) pass the parent layer id and the style name (parentId override).
                    if (opt.sourceChild) {
                      onToggleLayer(
                        groupId,
                        opt.sourceChild.id,
                        "radio",
                        opt.value,
                        layer.id
                      );
                    } else {
                      onToggleLayer(
                        groupId,
                        layer.id,
                        "radio",
                        opt.value,
                        layer.id
                      );
                    }
                  }}
                />
                {opt.label}
              </StyleLabel>
            ))}
          </StylesRow>
        );
      })()}
    </LayerWrapper>
  );
};
