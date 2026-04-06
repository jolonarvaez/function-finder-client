"use client";

import { useCallback, useMemo, useState } from "react";
import Map, { Marker, NavigationControl, AttributionControl } from "react-map-gl/maplibre";
import type { MapLayerMouseEvent, MarkerDragEvent } from "react-map-gl/maplibre";
import "maplibre-gl/dist/maplibre-gl.css";

import { getStadiaStyleUrl, type StadiaStyleId } from "@/lib/maps/stadia";
import type { Waypoint, MapViewState } from "@/lib/maps/types";

interface StadiaMapProps {
  /** Stadia Maps style ID */
  styleId?: StadiaStyleId;
  /** Initial view state (center, zoom, etc.) */
  initialViewState?: Partial<MapViewState>;
  /** Map container height */
  height?: string | number;
  /** Map container width */
  width?: string | number;
  /** Initial waypoints */
  initialWaypoints?: Waypoint[];
  /** Callback when waypoints change */
  onWaypointsChange?: (waypoints: Waypoint[]) => void;
  /** Enable marker dragging */
  draggableMarkers?: boolean;
}

// Default view centered on Manila, Philippines
const DEFAULT_VIEW_STATE: MapViewState = {
  longitude: 120.9842,
  latitude: 14.5995,
  zoom: 12,
};

export default function StadiaMap({
  styleId = "alidade_smooth",
  initialViewState,
  height = "100%",
  width = "100%",
  initialWaypoints = [],
  onWaypointsChange,
  draggableMarkers = true,
}: StadiaMapProps) {
  const [waypoints, setWaypoints] = useState<Waypoint[]>(initialWaypoints);

  // Memoize the style URL to prevent unnecessary map reloads
  const mapStyle = useMemo(() => getStadiaStyleUrl(styleId), [styleId]);

  // Merge default view state with props
  const viewState = useMemo(
    () => ({
      ...DEFAULT_VIEW_STATE,
      ...initialViewState,
    }),
    [initialViewState]
  );

  // Generate unique ID for waypoints
  const generateId = useCallback(() => {
    return `wp_${Date.now()}_${Math.random().toString(36).slice(2, 9)}`;
  }, []);

  // Handle map click to add waypoint
  const handleMapClick = useCallback(
    (event: MapLayerMouseEvent) => {
      const { lngLat } = event;
      const newWaypoint: Waypoint = {
        id: generateId(),
        lng: lngLat.lng,
        lat: lngLat.lat,
        label: `Point ${waypoints.length + 1}`,
      };

      const updated = [...waypoints, newWaypoint];
      setWaypoints(updated);
      onWaypointsChange?.(updated);
    },
    [waypoints, generateId, onWaypointsChange]
  );

  // Handle waypoint removal
  const handleRemoveWaypoint = useCallback(
    (id: string) => {
      const updated = waypoints.filter((wp) => wp.id !== id);
      setWaypoints(updated);
      onWaypointsChange?.(updated);
    },
    [waypoints, onWaypointsChange]
  );

  // Handle marker drag end
  const handleMarkerDragEnd = useCallback(
    (id: string, event: MarkerDragEvent) => {
      const { lngLat } = event;
      const updated = waypoints.map((wp) =>
        wp.id === id ? { ...wp, lng: lngLat.lng, lat: lngLat.lat } : wp
      );
      setWaypoints(updated);
      onWaypointsChange?.(updated);
    },
    [waypoints, onWaypointsChange]
  );

  // Clear all waypoints
  const handleClearAll = useCallback(() => {
    setWaypoints([]);
    onWaypointsChange?.([]);
  }, [onWaypointsChange]);

  return (
    <div className="stadia-map-container" style={{ position: "relative", width, height }}>
      <Map
        initialViewState={viewState}
        mapStyle={mapStyle}
        onClick={handleMapClick}
        attributionControl={false}
        style={{ width: "100%", height: "100%" }}
      >
        <NavigationControl position="top-right" />
        <AttributionControl
          position="bottom-right"
          customAttribution="© Stadia Maps © OpenStreetMap contributors"
        />

        {/* Render waypoint markers */}
        {waypoints.map((waypoint) => (
          <Marker
            key={waypoint.id}
            longitude={waypoint.lng}
            latitude={waypoint.lat}
            anchor="bottom"
            draggable={draggableMarkers}
            onDragEnd={(e) => handleMarkerDragEnd(waypoint.id, e)}
          >
            <div
              className="waypoint-marker"
              style={{
                width: 28,
                height: 28,
                borderRadius: "50% 50% 50% 0",
                background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
                transform: "rotate(-45deg)",
                border: "3px solid white",
                boxShadow: "0 3px 10px rgba(0,0,0,0.3)",
                cursor: draggableMarkers ? "grab" : "pointer",
              }}
            />
          </Marker>
        ))}
      </Map>

      {/* Waypoints Panel */}
      <div
        className="waypoints-panel"
        style={{
          position: "absolute",
          top: 12,
          left: 12,
          background: "rgba(255, 255, 255, 0.95)",
          backdropFilter: "blur(8px)",
          borderRadius: 12,
          padding: 16,
          minWidth: 260,
          maxWidth: 320,
          maxHeight: "calc(100% - 24px)",
          overflowY: "auto",
          boxShadow: "0 4px 20px rgba(0,0,0,0.15)",
          fontFamily: "system-ui, -apple-system, sans-serif",
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            marginBottom: 12,
            paddingBottom: 12,
            borderBottom: "1px solid #eee",
          }}
        >
          <h3 style={{ margin: 0, fontSize: 15, fontWeight: 600, color: "#333" }}>
            📍 Waypoints ({waypoints.length})
          </h3>
          {waypoints.length > 0 && (
            <button
              onClick={handleClearAll}
              style={{
                background: "#ff4757",
                color: "white",
                border: "none",
                borderRadius: 6,
                padding: "4px 10px",
                fontSize: 12,
                cursor: "pointer",
                fontWeight: 500,
              }}
            >
              Clear All
            </button>
          )}
        </div>

        {waypoints.length === 0 ? (
          <p style={{ margin: 0, fontSize: 13, color: "#666", lineHeight: 1.5 }}>
            Click anywhere on the map to add waypoints.
            {draggableMarkers && " Drag markers to reposition them."}
          </p>
        ) : (
          <ul style={{ margin: 0, padding: 0, listStyle: "none" }}>
            {waypoints.map((waypoint, index) => (
              <li
                key={waypoint.id}
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  padding: "8px 0",
                  borderBottom: index < waypoints.length - 1 ? "1px solid #f0f0f0" : "none",
                }}
              >
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div
                    style={{
                      fontSize: 13,
                      fontWeight: 500,
                      color: "#333",
                      marginBottom: 2,
                    }}
                  >
                    {waypoint.label}
                  </div>
                  <div
                    style={{
                      fontSize: 11,
                      color: "#888",
                      fontFamily: "ui-monospace, monospace",
                    }}
                  >
                    {waypoint.lat.toFixed(5)}, {waypoint.lng.toFixed(5)}
                  </div>
                </div>
                <button
                  onClick={() => handleRemoveWaypoint(waypoint.id)}
                  style={{
                    background: "transparent",
                    border: "none",
                    color: "#999",
                    cursor: "pointer",
                    padding: 4,
                    fontSize: 18,
                    lineHeight: 1,
                    borderRadius: 4,
                    transition: "color 0.15s",
                  }}
                  onMouseOver={(e) => (e.currentTarget.style.color = "#ff4757")}
                  onMouseOut={(e) => (e.currentTarget.style.color = "#999")}
                  aria-label={`Remove ${waypoint.label}`}
                >
                  ×
                </button>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
