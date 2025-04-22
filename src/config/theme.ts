/**
 * Application theme configuration
 * Contains color palette and theme variables
 */

export const palette = {
  // Base colors
  background: {
    primary: "#0d0f10",
    secondary: "#1a1b1f",
    card: "#1a1b1f",
    input: "#1a1b1f",
  },

  // Text colors
  text: {
    primary: "#ececf1",
    secondary: "#b1b1b8",
    muted: "#7a7a85",
  },

  // Accent colors - more sophisticated muted teal
  accent: {
    primary: "#1a2e29", // Very dark teal
    hover: "#1f3732", // Slightly lighter teal
    active: "#234842", // Medium teal for active states
    light: "#2b4b45", // Lighter teal for highlights
    border: "#383e3c", // Subtle teal for borders
  },

  // UI element colors
  border: {
    default: "#444654",
    subtle: "#2d2d33",
  },

  // Status colors
  status: {
    error: "#912e2c",
    success: "#2a7155",
    warning: "#8a6e27",
    info: "#2a5171",
  },
};

export default {
  palette,
};
