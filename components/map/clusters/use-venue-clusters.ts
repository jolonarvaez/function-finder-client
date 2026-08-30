"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import Supercluster from "supercluster";
import type { MapRef } from "@/components/ui/map";

/** A single point fed into the cluster index. */
export type ClusterInput<T> = Readonly<{ lng: number; lat: number; data: T }>;

/** What the map should draw at a given position: a cluster bubble, or one event. */
export type ClusterResult<T> =
  | Readonly<{ kind: "cluster"; id: number; lng: number; lat: number; count: number }>
  | Readonly<{ kind: "point"; lng: number; lat: number; data: T }>;

type UseVenueClustersProps<T> = Readonly<{
  map: MapRef | null;
  points: readonly ClusterInput<T>[];
  /** Cluster radius in pixels — larger groups points more aggressively. */
  radius?: number;
  /** Zoom past which nothing clusters and every event stands on its own. */
  maxZoom?: number;
}>;

type PointProps<T> = { data: T };

/**
 * Groups nearby events into clusters that split apart as the map zooms in.
 *
 * Clustering runs in JS (rather than through MapLibre's native GeoJSON source
 * clustering) so that both cluster bubbles and individual events stay DOM
 * markers — that's what lets VenueMarker keep its hover card and live pulse,
 * which a GL circle layer can't render.
 */
export function useVenueClusters<T>({
  map,
  points,
  radius = 60,
  maxZoom = 16,
}: UseVenueClustersProps<T>) {
  const index = useMemo(() => {
    const supercluster = new Supercluster<PointProps<T>>({ radius, maxZoom });
    supercluster.load(
      points.map((p) => ({
        type: "Feature" as const,
        properties: { data: p.data },
        geometry: { type: "Point" as const, coordinates: [p.lng, p.lat] },
      }))
    );
    return supercluster;
  }, [points, radius, maxZoom]);

  const [viewport, setViewport] = useState<{
    bbox: [number, number, number, number];
    zoom: number;
  } | null>(null);

  // Panning fires `move` every frame; only re-cluster when the viewport has
  // actually shifted enough to change the result.
  const lastKeyRef = useRef("");

  useEffect(() => {
    if (!map) return;

    const update = () => {
      const bounds = map.getBounds();
      const bbox: [number, number, number, number] = [
        bounds.getWest(),
        bounds.getSouth(),
        bounds.getEast(),
        bounds.getNorth(),
      ];
      const zoom = Math.round(map.getZoom());

      const key = `${zoom}|${bbox.map((n) => n.toFixed(4)).join(",")}`;
      if (key === lastKeyRef.current) return;
      lastKeyRef.current = key;

      setViewport({ bbox, zoom });
    };

    update();
    map.on("move", update);
    return () => {
      map.off("move", update);
    };
  }, [map]);

  const clusters = useMemo<ClusterResult<T>[]>(() => {
    if (!viewport) return [];

    return index.getClusters(viewport.bbox, viewport.zoom).map((feature) => {
      const [lng, lat] = feature.geometry.coordinates;
      const props = feature.properties;

      if ("cluster" in props && props.cluster) {
        return { kind: "cluster", id: props.cluster_id, lng, lat, count: props.point_count };
      }
      return { kind: "point", lng, lat, data: (props as PointProps<T>).data };
    });
  }, [index, viewport]);

  /** The zoom at which a given cluster breaks apart into its members. */
  const getExpansionZoom = useCallback(
    (clusterId: number) => index.getClusterExpansionZoom(clusterId),
    [index]
  );

  return { clusters, getExpansionZoom };
}
