// Convert hex to RGB for dynamic shadow effect
export const hexToRgb = (hex) => {
  hex = hex.replace(/^#/, '');
  if (hex.length === 3) {
    hex = hex.split('').map((c) => c + c).join('');
  }
  const bigint = parseInt(hex, 16);
  const r = (bigint >> 16) & 255;
  const g = (bigint >> 8) & 255;
  const b = bigint & 255;
  return `${r}, ${g}, ${b}`;
};

// Generate dynamic box shadow based on color
export const getDynamicBoxShadow = (color, isHovered = false, isActive = false) => {
  if (!color) return '';

  const rgbColor = hexToRgb(color);

  if (isActive) {
    // Stronger shadow for active state
    return `rgba(${rgbColor}, 0.15) 0px 1px 1px 0px inset,
            rgba(${rgbColor}, 0.35) 0px 50px 100px -20px,
            rgba(${rgbColor}, 0.4) 0px 30px 60px -30px`;
  }

  if (isHovered) {
    // Subtle colored shadow on hover
    return `rgba(${rgbColor}, 0.1) 0px 1px 1px 0px inset,
            rgba(${rgbColor}, 0.25) 0px 50px 100px -20px,
            rgba(${rgbColor}, 0.3) 0px 30px 60px -30px`;
  }

  return '';
};

// Map box types to their signature colors
export const getBoxColor = (type) => {
  const colorMap = {
    root: '#6c757d',          // Dark gray
    context: '#00b7ff',       // Sky Blue
    meaningmaking: '#ff6b9d',  // Bubblegum Pink
    research: '#06ffa5',       // Cyan
    synthesis: '#7209b7',      // Violet
    tension: '#ff6b35',        // Coral Orange
    decision: '#00ff33'        // Lime Green
  };

  return colorMap[type] || '#6c757d';
};