export function shimmer(width = 16, height = 16) {
  return `
  <svg width="${width}" height="${height}" viewBox="0 0 ${width} ${height}" xmlns="http://www.w3.org/2000/svg" preserveAspectRatio="none">
    <defs>
      <linearGradient id="g">
        <stop stop-color="#f6f7f8" offset="20%" />
        <stop stop-color="#edeef1" offset="50%" />
        <stop stop-color="#f6f7f8" offset="70%" />
      </linearGradient>
    </defs>
    <rect width="${width}" height="${height}" fill="#f6f7f8" />
    <rect id="r" width="${width}" height="${height}" fill="url(#g)" />
    <animate xlink:href="#r" attributeName="x" from="-${width}" to="${width}" dur="1s" repeatCount="indefinite"  />
  </svg>`;
}

export function toBase64(str: string) {
  if (typeof window === "undefined") {
    // Node.js
    return Buffer.from(str).toString("base64");
  }
  return window.btoa(str);
}

export function shimmerBase64(w = 16, h = 16) {
  return `data:image/svg+xml;base64,${toBase64(shimmer(w, h))}`;
}
