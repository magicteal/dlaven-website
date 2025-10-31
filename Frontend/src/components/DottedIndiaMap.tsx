"use client";

import React, { useEffect, useMemo, useState } from "react";
import DottedMap from "dotted-map";

// (Keep existing type definitions for GridType, ShapeType, DottedPin, DottedIndiaMapProps)
export type GridType = "vertical" | "diagonal";
export type ShapeType = "circle" | "hexagon";

export type DottedPin = {
  lat: number;
  lng: number;
  color?: string;
  radius?: number;
};

export interface DottedIndiaMapProps {
  /** Tailwind or custom classes applied to wrapper <div> */
  className?: string;
  /** Inline styles for wrapper */
  style?: React.CSSProperties;
  /** Title/alt text for a11y */
  title?: string;
  /** Number of rows in the dot grid (affects detail/perf). Default: 60 */
  mapHeight?: number;
  /** Dot layout grid. Default: "diagonal" */
  grid?: GridType;
  /** Dot shape. Default: "hexagon" (pairs nicely with diagonal) */
  shape?: ShapeType;
  /** Default dot radius. Default: 0.22 */
  dotRadius?: number;
  /** Default dot color. Default: #423B38 */
  dotColor?: string;
  /** Background color for SVG. Default: transparent (undefined) */
  bgColor?: string;
  /** Optional pins to highlight specific cities/points */
  pins?: DottedPin[];
}

// ** NEW CONSTANTS FOR CITY COORDINATES **
const MUMBAI = { lat: 19.076, lng: 72.8777, name: "Mumbai" };
const VARANASI = { lat: 25.3176, lng: 82.9739, name: "Varanasi" };
const DELHI = { lat: 28.6139, lng: 77.209, name: "Delhi" };

/**
 * Dotted map of India rendered as an SVG, generated with the `dotted-map` package.
 */
export default function DottedIndiaMap({
  className,
  style,
  title = "Dotted map of India",
  mapHeight = 60,
  grid = "diagonal",
  shape = "hexagon",
  dotRadius = 0.22,
  dotColor = "#423B38",
  bgColor,
  pins = [],
}: DottedIndiaMapProps) {
  const [svg, setSvg] = useState<string | null>(null);
  const VIEWBOX_SIZE = 1000; // overlay coordinate space

  // India bounding box (approximate)
  const INDIA_BOUNDS = useMemo(
    () => ({ latMin: 6, latMax: 36, lngMin: 68, lngMax: 98 }),
    []
  );

  // Default cities to highlight if none provided
  const defaultPins: DottedPin[] = useMemo(
    () => [
      MUMBAI, // Mumbai
      VARANASI, // Varanasi
      DELHI, // Delhi
    ],
    []
  );

  const effectivePins = useMemo(
    () => (pins && pins.length ? pins : defaultPins),
    [pins, defaultPins]
  );

  // Simple equirectangular projection to overlay coords
  const project = useMemo(() => {
    return (lat: number, lng: number) => {
      const x =
        ((lng - INDIA_BOUNDS.lngMin) /
          (INDIA_BOUNDS.lngMax - INDIA_BOUNDS.lngMin)) *
        VIEWBOX_SIZE;
      const y =
        (1 -
          (lat - INDIA_BOUNDS.latMin) /
            (INDIA_BOUNDS.latMax - INDIA_BOUNDS.latMin)) *
        VIEWBOX_SIZE;
      return { x, y };
    };
  }, [INDIA_BOUNDS]);

  const overlayPoints = useMemo(() => {
    return effectivePins.map((p) => {
      const { x, y } = project(p.lat, p.lng);
      return { x, y, color: p.color ?? "#0ea5e9" };
    });
  }, [effectivePins, project]);

  // ** NEW: Calculate projected coordinates for VNS, DELHI, MUMBAI **
  const { x: vnsX, y: vnsY } = useMemo(
    () => project(VARANASI.lat, VARANASI.lng),
    [project]
  );
  const { x: delX, y: delY } = useMemo(
    () => project(DELHI.lat, DELHI.lng),
    [project]
  );
  const { x: mumX, y: mumY } = useMemo(
    () => project(MUMBAI.lat, MUMBAI.lng),
    [project]
  );

  // ** NEW: Define the curved SVG paths **
  const VNS_TO_DELHI_PATH = useMemo(() => {
    const cpX = (vnsX + delX) / 2; // Midpoint X
    const cpY = Math.min(vnsY, delY) - 150; // High control point Y for arc
    return `M ${vnsX} ${vnsY} C ${cpX} ${cpY}, ${cpX} ${cpY}, ${delX} ${delY}`;
  }, [vnsX, vnsY, delX, delY]);

  const DELHI_TO_MUMBAI_PATH = useMemo(() => {
    const cpX = (delX + mumX) / 2 - 50; // Midpoint X, adjusted left
    const cpY = Math.min(delY, mumY) - 100; // Control point Y for arc
    return `M ${delX} ${delY} C ${cpX} ${cpY}, ${cpX} ${cpY}, ${mumX} ${mumY}`;
  }, [delX, delY, mumX, mumY]);

  const MUMBAI_TO_VNS_PATH = useMemo(() => {
    const cpX = (mumX + vnsX) / 2 + 50; // Midpoint X, adjusted right
    const cpY = Math.min(mumY, vnsY) - 150; // Control point Y for arc
    return `M ${mumX} ${mumY} C ${cpX} ${cpY}, ${cpX} ${cpY}, ${vnsX} ${vnsY}`;
  }, [mumX, mumY, vnsX, vnsY]);

  // Memoize the stable options object so effect deps are minimal and clear
  const options = useMemo(
    () => ({ mapHeight, grid, shape, dotRadius, dotColor, bgColor, pins }),
    [mapHeight, grid, shape, dotRadius, dotColor, bgColor, pins]
  );

  useEffect(() => {
    // Compute on client to keep SSR fast and avoid mismatches
    try {
      const map = new DottedMap({
        height: options.mapHeight,
        grid: options.grid,
        countries: ["IND"],
        avoidOuterPins: true,
      });

      // Add optional pins (e.g., Mumbai, Delhi, etc.) - The animation will use defaultPins
      if (options.pins?.length) {
        for (const p of options.pins) {
          try {
            map.addPin({
              lat: p.lat,
              lng: p.lng,
              svgOptions: {
                color: p.color ?? "#d6ff79",
                radius: p.radius ?? Math.max(0.28, options.dotRadius),
              },
            });
          } catch (pinErr) {
            // Some versions/bundles of dotted-map can throw "poly is not defined" on addPin
            console.warn(
              "[DottedIndiaMap] Skipping a pin due to error:",
              pinErr
            );
          }
        }
      }

      const svgStr = map.getSVG({
        shape: options.shape,
        // Force transparent background regardless of prop
        backgroundColor: undefined,
        color: options.dotColor,
        radius: options.dotRadius,
      });

      setSvg(svgStr);
    } catch (err) {
      console.error("[DottedIndiaMap] Failed to render map:", err);
      setSvg(null);
    }
  }, [options]);

  if (!svg) {
    // Lightweight placeholder while SVG is computed
    return (
      <div
        className={className}
        style={{
          ...(style || {}),
          display: "block",
          width: "100%",
          aspectRatio: "16 / 9",
          // no background fill
          background: "transparent",
        }}
        aria-busy="true"
        aria-label={title}
      />
    );
  }

  return (
    <div
      className={`${className ?? ""} relative`}
      style={style}
      aria-label={title}
    >
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={`data:image/svg+xml;utf8,${encodeURIComponent(svg)}`}
        alt={title}
        style={{ display: "block", width: "100%", height: "auto" }}
      />

      {/* Overlay paths and pins */}
      <svg
        className="pointer-events-none absolute inset-0 h-full w-full"
        viewBox={`0 0 ${VIEWBOX_SIZE} ${VIEWBOX_SIZE}`}
        aria-hidden="true"
      >
        {/* ** NEW: Animated Curved Paths ** */}
        <path
          d={VNS_TO_DELHI_PATH}
          fill="none"
          stroke="#0ea5e9"
          strokeWidth="4"
          className="travel-path path-1"
          strokeLinecap="round"
        />
        <path
          d={DELHI_TO_MUMBAI_PATH}
          fill="none"
          stroke="#0ea5e9"
          strokeWidth="4"
          className="travel-path path-2"
          strokeLinecap="round"
        />
        <path
          d={MUMBAI_TO_VNS_PATH}
          fill="none"
          stroke="#0ea5e9"
          strokeWidth="4"
          className="travel-path path-3"
          strokeLinecap="round"
        />

        {/* Existing: Pin Overlay with blinking/pulse effect */}
        {overlayPoints.map((p, i) => (
          <g key={`pin-${i}`}>
            <circle cx={p.x} cy={p.y} r={8} fill={p.color} />
          </g>
        ))}

        {/* City labels that appear when each path reaches the destination */}
        {/* Delhi appears after Varanasi->Delhi completes */}
        <text
          x={delX}
          y={delY - 18}
          textAnchor="middle"
          fontSize="32"
          fill="#111827"
          className="city-label label-delhi"
        >
          Delhi
        </text>
        {/* Mumbai appears after Delhi->Mumbai completes */}
        <text
          x={mumX}
          y={mumY - 18}
          textAnchor="middle"
          fontSize="32"
          fill="#111827"
          className="city-label label-mumbai"
        >
          Mumbai
        </text>
        {/* Varanasi appears after Mumbai->Varanasi completes */}
        <text
          x={vnsX}
          y={vnsY - 18}
          textAnchor="middle"
          fontSize="32"
          fill="#111827"
          className="city-label label-varanasi"
        >
          Varanasi
        </text>

        {/* ** MODIFIED: Combined CSS Styles ** */}
        <style>
          {`
            /* Path Animation */
            .travel-path {
              stroke-dasharray: 1000; /* Must be larger than the path length */
              stroke-dashoffset: 1000;
              opacity: 0;
            }
            
            /* Animation timing: 
             * Total cycle: 6s (2s per segment)
             * Segment duration: 1.5s (drawing) + 0.5s (wait) = 2s
            */
            .path-1 {
              animation: dash-draw 6s linear infinite;
            }
            .path-2 {
              animation: dash-draw 6s linear infinite;
              animation-delay: 2s; /* Starts when path-1 finishes its segment */
            }
            .path-3 {
              animation: dash-draw 6s linear infinite;
              animation-delay: 4s; /* Starts when path-2 finishes its segment */
            }

            @keyframes dash-draw {
              /* Start: Hidden */
              0% { stroke-dashoffset: 1000; opacity: 0; }

              /* Draw segment (0.5s - 1.5s of the 6s cycle) */
              8.33% { /* 0.5s */ stroke-dashoffset: 1000; opacity: 1; }
              25% { /* 1.5s */ stroke-dashoffset: 0; opacity: 1; }

              /* Hold and fade out (1.5s - 2s of the 6s cycle) */
              33.33% { /* 2.0s */ stroke-dashoffset: 0; opacity: 0; }

              /* Invisible until next cycle (2s - 6s of the 6s cycle) */
              100% { stroke-dashoffset: 1000; opacity: 0; }
            }

            /* City labels: fade/slide in briefly when arc arrives */
            .city-label { opacity: 0; }
            .label-delhi { animation: label-pop 6s linear infinite; animation-delay: 1.5s; }
            .label-mumbai { animation: label-pop 6s linear infinite; animation-delay: 3.5s; }
            .label-varanasi { animation: label-pop 6s linear infinite; animation-delay: 5.5s; }

            @keyframes label-pop {
              0% { opacity: 0; transform: translateY(-4px); }
              8% { opacity: 1; transform: translateY(0); }
              16% { opacity: 1; }
              20% { opacity: 0; }
              100% { opacity: 0; }
            }

          `}
        </style>
      </svg>
    </div>
  );
}
