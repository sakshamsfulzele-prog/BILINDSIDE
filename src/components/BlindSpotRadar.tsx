import React, { useState } from 'react';
import { RadarCategory } from '../types/blindspot';
import { AlertTriangle, Info, Eye } from 'lucide-react';

interface BlindSpotRadarProps {
  categories: RadarCategory[];
}

export const BlindSpotRadar: React.FC<BlindSpotRadarProps> = ({ categories }) => {
  const [activeCategoryIndex, setActiveCategoryIndex] = useState<number | null>(null);

  if (!categories || categories.length === 0) return null;

  const count = categories.length;
  const size = 340;
  const center = size / 2;
  const radius = size * 0.38;

  // Compute coordinate on radar for index and normalized value (0 to 1)
  const getCoordinates = (index: number, value: number) => {
    // start from top (-PI/2)
    const angle = (Math.PI * 2 / count) * index - Math.PI / 2;
    const r = radius * value;
    const x = center + r * Math.cos(angle);
    const y = center + r * Math.sin(angle);
    return { x, y, angle };
  };

  // Concentric polygon rings (0.2, 0.4, 0.6, 0.8, 1.0)
  const levels = [0.25, 0.5, 0.75, 1.0];

  const getPolygonPoints = (level: number) => {
    return Array.from({ length: count }, (_, i) => {
      const { x, y } = getCoordinates(i, level);
      return `${x.toFixed(1)},${y.toFixed(1)}`;
    }).join(' ');
  };

  // Data polygon points
  const dataPoints = categories.map((cat, i) => {
    const norm = Math.min(Math.max(cat.score / 100, 0.1), 1.0);
    return getCoordinates(i, norm);
  });

  const dataPolygonString = dataPoints
    .map(p => `${p.x.toFixed(1)},${p.y.toFixed(1)}`)
    .join(' ');

  const activeCategory = activeCategoryIndex !== null ? categories[activeCategoryIndex] : null;

  return (
    <div className="bg-white rounded-2xl border border-black/[0.08] shadow-xs p-6 sm:p-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-6 border-b border-neutral-100 gap-2">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-xs font-bold uppercase tracking-wider text-neutral-400">Feature 01</span>
            <span className="text-neutral-300">/</span>
            <span className="text-xs font-semibold text-neutral-600">Exposure Mapping</span>
          </div>
          <h2 className="text-xl sm:text-2xl font-bold text-neutral-900 tracking-tight flex items-center gap-2">
            <Eye className="h-5 w-5 text-neutral-800" />
            <span>Blind Spot Radar</span>
          </h2>
        </div>
        <div className="text-xs text-neutral-500 max-w-xs text-left sm:text-right">
          Higher score indicates higher unexamined risk or blind spot exposure in that domain.
        </div>
      </div>

      {/* Main Radar Layout */}
      <div className="mt-6 grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
        {/* Radar Graphic */}
        <div className="lg:col-span-6 flex flex-col items-center justify-center">
          <div className="relative w-full max-w-[340px] aspect-square">
            <svg
              viewBox={`0 0 ${size} ${size}`}
              className="w-full h-full overflow-visible drop-shadow-xs"
            >
              {/* Concentric Guide Polygons */}
              {levels.map((level, lvlIdx) => (
                <polygon
                  key={lvlIdx}
                  points={getPolygonPoints(level)}
                  fill={lvlIdx === levels.length - 1 ? 'none' : 'none'}
                  stroke="#E5E5E5"
                  strokeWidth="1"
                  strokeDasharray={lvlIdx < levels.length - 1 ? '2 2' : 'none'}
                />
              ))}

              {/* Axis spokes */}
              {Array.from({ length: count }, (_, i) => {
                const { x, y } = getCoordinates(i, 1.0);
                return (
                  <line
                    key={i}
                    x1={center}
                    y1={center}
                    x2={x}
                    y2={y}
                    stroke="#E5E5E5"
                    strokeWidth="1"
                  />
                );
              })}

              {/* Filled Data Polygon */}
              <polygon
                points={dataPolygonString}
                fill="rgba(23, 23, 23, 0.08)"
                stroke="#171717"
                strokeWidth="2"
                className="transition-all duration-300 ease-out"
              />

              {/* Data Vertices */}
              {dataPoints.map((pt, i) => {
                const isHovered = activeCategoryIndex === i;
                return (
                  <g
                    key={i}
                    className="cursor-pointer transition-transform"
                    onMouseEnter={() => setActiveCategoryIndex(i)}
                    onClick={() => setActiveCategoryIndex(i)}
                  >
                    <circle
                      cx={pt.x}
                      cy={pt.y}
                      r={isHovered ? 6 : 4}
                      fill={isHovered ? '#000000' : '#262626'}
                      stroke="#FFFFFF"
                      strokeWidth="2"
                      className="transition-all duration-150"
                    />
                  </g>
                );
              })}

              {/* Labels on Perimeter */}
              {categories.map((cat, i) => {
                const labelRadius = 1.18;
                const { x, y } = getCoordinates(i, labelRadius);
                const isSelected = activeCategoryIndex === i;

                // Simple text alignment depending on x relative to center
                let textAnchor: 'start' | 'middle' | 'end' = 'middle';
                if (x < center - 20) textAnchor = 'end';
                else if (x > center + 20) textAnchor = 'start';

                return (
                  <text
                    key={i}
                    x={x}
                    y={y}
                    textAnchor={textAnchor}
                    dominantBaseline="middle"
                    className={`text-[10.5px] cursor-pointer transition-all ${
                      isSelected
                        ? 'fill-neutral-950 font-bold'
                        : 'fill-neutral-600 font-medium hover:fill-neutral-900'
                    }`}
                    onMouseEnter={() => setActiveCategoryIndex(i)}
                    onClick={() => setActiveCategoryIndex(i)}
                  >
                    {cat.category} ({cat.score})
                  </text>
                );
              })}
            </svg>
          </div>

          <p className="mt-3 text-[11px] text-neutral-400 text-center">
            Click or hover any axis to inspect detailed hazard profile
          </p>
        </div>

        {/* Detailed Breakdown Panel */}
        <div className="lg:col-span-6 space-y-3">
          {categories.map((cat, idx) => {
            const isSelected = activeCategoryIndex === idx;
            const isCritical = cat.score >= 75;
            const isMedium = cat.score >= 50 && cat.score < 75;

            return (
              <div
                key={idx}
                onClick={() => setActiveCategoryIndex(idx)}
                className={`p-4 rounded-xl border transition-all cursor-pointer ${
                  isSelected
                    ? 'border-neutral-900 bg-neutral-50/70 shadow-xs ring-1 ring-neutral-900/10'
                    : 'border-neutral-100 bg-white hover:border-neutral-300 hover:bg-neutral-50/30'
                }`}
              >
                <div className="flex items-center justify-between gap-3 mb-1.5">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold text-neutral-800">
                      {cat.category}
                    </span>
                    <span
                      className={`text-[10px] font-semibold uppercase tracking-wider ${
                        isCritical
                          ? 'text-red-700'
                          : isMedium
                          ? 'text-amber-700'
                          : 'text-neutral-500'
                      }`}
                    >
                      · {cat.label}
                    </span>
                  </div>

                  <div className="flex items-center gap-1.5 font-mono text-xs font-semibold text-neutral-800">
                    <div className="w-16 h-1.5 rounded-full bg-neutral-100 overflow-hidden">
                      <div
                        className={`h-full rounded-full ${
                          isCritical
                            ? 'bg-neutral-900'
                            : isMedium
                            ? 'bg-neutral-700'
                            : 'bg-neutral-400'
                        }`}
                        style={{ width: `${cat.score}%` }}
                      />
                    </div>
                    <span>{cat.score}%</span>
                  </div>
                </div>

                <p className="text-xs text-neutral-600 leading-relaxed mb-2">
                  {cat.description}
                </p>

                {cat.keyFlag && (
                  <div className="flex items-start gap-1.5 text-[11px] text-neutral-700 bg-neutral-100/60 p-2 rounded-lg font-medium">
                    <AlertTriangle className="h-3.5 w-3.5 shrink-0 mt-0.5 text-neutral-500" />
                    <span>{cat.keyFlag}</span>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
