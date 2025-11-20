import { useMemo } from "react";

/**
 * Normalizes layer titles by removing prefixes and ensuring children are normalized recursively
 * @param {Array} layers - Array of layer groups from fetch
 * @param {string} prefixToRemove - Optional prefix to strip from titles
 * @returns {Array} normalized layers
 */
export default function useNormalizeLayers(
  layers,
  prefixToRemove = "test_mombasa:"
) {
  const normalize = (layersArray) =>
    layersArray.map((layer) => ({
      ...layer,
      title:
        layer.title?.replace(new RegExp(`^${prefixToRemove}`), "") ||
        layer.name ||
        layer.id ||
        "",
      children: layer.children ? normalize(layer.children) : [],
    }));

  return useMemo(() => {
    if (!Array.isArray(layers)) return [];
    return normalize(layers);
  }, [layers, prefixToRemove]);
}
