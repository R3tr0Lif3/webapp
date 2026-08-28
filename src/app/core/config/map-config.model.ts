export interface MapConfig {
  /** API key for the HERE Platform Geocoding & Search API. */
  hereApiKey: string;
  /** Raster tile URL template served by tileserver-gl, e.g. http://host:8080/styles/basic/{z}/{x}/{y}.png */
  tileUrlTemplate: string;
  /** Attribution text shown on the map. */
  tileAttribution: string;
  /** ISO 3166-1 alpha-3 country code used by HERE to bias/filter geocoding results, e.g. "COL". */
  countryCode: string;
  /** [lat, lng] used as the initial map center. */
  defaultCenter: [number, number];
  defaultZoom: number;
  minZoom: number;
  maxZoom: number;
}
