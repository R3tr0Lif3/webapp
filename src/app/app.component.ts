import { Component, ViewChild, inject } from '@angular/core';
import { GeocodingService } from './features/map-search/data-access/geocoding.service';
import { GeocodingResult } from './features/map-search/data-access/geocoding-result.model';
import { LatLon, MapComponent } from './features/map-search/map/map.component';
import { SearchBarComponent } from './features/map-search/search-bar/search-bar.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [MapComponent, SearchBarComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css',
})
export class AppComponent {
  @ViewChild(MapComponent) private readonly map!: MapComponent;

  private readonly geocodingService = inject(GeocodingService);

  onResultSelected(result: GeocodingResult): void {
    this.map.flyTo(result.lat, result.lon, result.label);
  }

  onMapClick(point: LatLon): void {
    // Show the coordinates immediately, then upgrade the popup with the
    // reverse-geocoded address once it resolves (if one is found nearby).
    this.map.placeMarker(point.lat, point.lon);
    this.geocodingService.reverse(point.lat, point.lon).subscribe((label) => {
      if (label) {
        this.map.placeMarker(point.lat, point.lon, label);
      }
    });
  }
}
