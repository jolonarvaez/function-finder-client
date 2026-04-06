/**
 * Shared types for map components
 */

export interface Waypoint {
  id: string;
  lng: number;
  lat: number;
  label: string;
}

export interface MapViewState {
  longitude: number;
  latitude: number;
  zoom: number;
  pitch?: number;
  bearing?: number;
}
