import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { firstValueFrom } from 'rxjs';
import { MapConfig } from './map-config.model';

/**
 * Loads map-config.json at runtime (not at build time) so the same compiled
 * Angular bundle can point at different map-services deployments (different
 * hosts/ports) just by editing a static JSON file next to the deployed app,
 * with no rebuild required.
 */
@Injectable({ providedIn: 'root' })
export class MapConfigService {
  private readonly http = inject(HttpClient);
  private config?: MapConfig;

  async load(): Promise<void> {
    this.config = await firstValueFrom(
      this.http.get<MapConfig>('map-config.json'),
    );
  }

  get(): MapConfig {
    if (!this.config) {
      throw new Error(
        'MapConfigService.get() called before configuration was loaded',
      );
    }
    return this.config;
  }
}
