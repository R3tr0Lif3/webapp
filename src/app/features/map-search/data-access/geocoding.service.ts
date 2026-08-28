import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable, of } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { MapConfigService } from '../../../core/config/map-config.service';
import { GeocodingResult } from './geocoding-result.model';

/** HERE Platform endpoints (free tier geocoding/revgeocoding). */
const GEOCODE_URL = 'https://geocode.search.hereapi.com/v1/geocode';
const REVERSED_GEOCODE_URL =
  'https://revgeocode.search.hereapi.com/v1/revgeocode';

interface HerePosition {
  lat: number;
  lng: number;
}

interface HereGeocodeItem {
  id: string;
  title: string;
  position: HerePosition;
}

interface HereGeocodeResponse {
  items: HereGeocodeItem[];
}

interface HereReverseGeocodeItem {
  title: string;
  position: HerePosition;
}

interface HereReverseGeocodeResponse {
  items: HereReverseGeocodeItem[];
}

/**
 * Thin client for the HERE Platform (HERE Geocoding & Search API). The API key
 * comes from MapConfigService (loaded at runtime), so the key can be rotated
 * without rebuilding the app.
 */
@Injectable({ providedIn: 'root' })
export class GeocodingService {
  private readonly http = inject(HttpClient);
  private readonly config = inject(MapConfigService);

  search(query: string): Observable<GeocodingResult[]> {
    const { hereApiKey, countryCode } = this.config.get();
    const params = new HttpParams()
      .set('q', query)
      .set('apiKey', hereApiKey)
      .set('limit', '6')
      .set('countryCode', countryCode);

    return this.http
      .get<HereGeocodeResponse>(GEOCODE_URL, { params })
      .pipe(
        map((response) =>
          response.items.map((item) => ({
            id: item.id,
            label: item.title,
            lat: item.position.lat,
            lon: item.position.lng,
          })),
        ),
      );
  }

  /** Reverse geocodes a point clicked directly on the map. Resolves to
   * `null` (rather than erroring) when no address is found nearby. */
  reverse(lat: number, lon: number): Observable<string | null> {
    const { hereApiKey } = this.config.get();
    const params = new HttpParams()
      .set('at', `${lat},${lon}`)
      .set('apiKey', hereApiKey);

    return this.http
      .get<HereReverseGeocodeResponse>(REVERSED_GEOCODE_URL, { params })
      .pipe(
        map((response) => response.items[0]?.title ?? null),
        catchError(() => of(null)),
      );
  }
}