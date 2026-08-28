import { provideHttpClient } from '@angular/common/http';
import {
  APP_INITIALIZER,
  ApplicationConfig,
  provideZoneChangeDetection,
} from '@angular/core';
import { MapConfigService } from './core/config/map-config.service';

export const appConfig: ApplicationConfig = {
  providers: [
    provideZoneChangeDetection({ eventCoalescing: true }),
    provideHttpClient(),
    {
      provide: APP_INITIALIZER,
      multi: true,
      useFactory: (config: MapConfigService) => () => config.load(),
      deps: [MapConfigService],
    },
  ],
};
