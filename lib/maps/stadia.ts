/**
 * Stadia Maps style URL utilities
 *
 * Available Stadia style IDs:
 * - alidade_smooth (clean, modern)
 * - alidade_smooth_dark (dark variant)
 * - outdoors (topographic/hiking)
 * - osm_bright (colorful OSM style)
 * - stamen_toner (high contrast B&W)
 * - stamen_terrain (terrain with shading)
 * - stamen_watercolor (artistic watercolor)
 *
 * Environment variable required:
 * NEXT_PUBLIC_STADIA_API_KEY=your_api_key_here
 */

const STADIA_BASE_URL = 'https://tiles.stadiamaps.com/styles';

// Fallback to MapLibre demo tiles when no API key is present
const DEMO_STYLE_URL =
  'https://demotiles.maplibre.org/style.json';

export type StadiaStyleId =
  | 'alidade_smooth'
  | 'alidade_smooth_dark'
  | 'outdoors'
  | 'osm_bright'
  | 'stamen_toner'
  | 'stamen_terrain'
  | 'stamen_watercolor';

/**
 * Generate a Stadia Maps style URL with API key authentication
 *
 * @param styleId - The Stadia style identifier
 * @param apiKey - The Stadia Maps API key
 * @returns The full style URL with api_key query parameter
 */
export function getStadiaStyleUrl(
  styleId: StadiaStyleId = 'alidade_smooth',
  apiKey?: string
): string {
  const key = apiKey ?? process.env.NEXT_PUBLIC_STADIA_API_KEY;

  if (!key) {
    if (process.env.NODE_ENV === 'development') {
      console.warn(
        '[Stadia Maps] No API key found. Set NEXT_PUBLIC_STADIA_API_KEY in .env.local\n' +
          'Falling back to MapLibre demo tiles (limited functionality).'
      );
    }
    return DEMO_STYLE_URL;
  }

  return `${STADIA_BASE_URL}/${styleId}.json?api_key=${encodeURIComponent(key)}`;
}

/**
 * Get the default Stadia style URL using environment variable
 */
export function getDefaultStadiaStyleUrl(): string {
  return getStadiaStyleUrl('alidade_smooth');
}

