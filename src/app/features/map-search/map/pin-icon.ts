/** Google-Maps-style teardrop pin, drawn inline so no marker image assets need to be bundled/served. */
const PIN_SVG = `
<svg width="32" height="42" viewBox="0 0 32 42" xmlns="http://www.w3.org/2000/svg">
  <path d="M16 0C7.163 0 0 7.163 0 16c0 11 16 26 16 26s16-15 16-26C32 7.163 24.837 0 16 0z" fill="#EA4335"/>
  <circle cx="16" cy="16" r="6" fill="#ffffff"/>
</svg>`;

/** Builds the DOM element used as the MapLibre GL marker. */
export function createPinElement(): HTMLDivElement {
  const el = document.createElement('div');
  el.className = 'app-pin-icon';
  el.innerHTML = PIN_SVG;
  return el;
}