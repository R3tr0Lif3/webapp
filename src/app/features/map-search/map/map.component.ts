import {
  AfterViewInit,
  Component,
  ElementRef,
  EventEmitter,
  OnDestroy,
  Output,
  ViewChild,
  inject,
} from '@angular/core';
import {
  AttributionControl,
  Map,
  MapMouseEvent,
  Marker,
  NavigationControl,
  Popup,
} from 'maplibre-gl';
import { MapConfigService } from '../../../core/config/map-config.service';
import { createPinElement } from './pin-icon';

export interface LatLon {
  lat: number;
  lon: number;
}

@Component({
  selector: 'app-map',
  standalone: true,
  templateUrl: './map.component.html',
  styleUrl: './map.component.css',
})
export class MapComponent implements AfterViewInit, OnDestroy {
  @ViewChild('mapContainer', { static: true })
  private readonly mapContainer!: ElementRef<HTMLDivElement>;

  /** Emitted whenever the user clicks on the map, so the host can drop/move the marker. */
  @Output() readonly mapClick = new EventEmitter<LatLon>();

  private readonly configService = inject(MapConfigService);
  private map?: Map;
  private marker?: Marker;
  private popup?: Popup;

  ngAfterViewInit(): void {
    const config = this.configService.get();
    const [lat, lon] = config.defaultCenter;

    this.map = new Map({
      container: this.mapContainer.nativeElement,
      center: [lon, lat],
      zoom: config.defaultZoom,
      minZoom: config.minZoom,
      maxZoom: config.maxZoom,
      attributionControl: false,
      style: {
        version: 8,
        sources: {
          'tileserver-raster': {
            type: 'raster',
            tiles: [config.tileUrlTemplate],
            tileSize: 256,
            attribution: config.tileAttribution,
            minzoom: config.minZoom,
            maxzoom: config.maxZoom,
          },
        },
        layers: [
          {
            id: 'tileserver-raster',
            type: 'raster',
            source: 'tileserver-raster',
          },
        ],
      },
    });

    this.map.addControl(
      new NavigationControl({ showCompass: false }),
      'bottom-right',
    );
    this.map.addControl(
      new AttributionControl({ compact: true }),
      'bottom-right',
    );

    this.map.on('click', (e: MapMouseEvent) => {
      this.mapClick.emit({ lat: e.lngLat.lat, lon: e.lngLat.lng });
    });
  }

  ngOnDestroy(): void {
    this.map?.remove();
  }

  /** Moves the map to the given point and drops (or moves) the single marker there. */
  flyTo(lat: number, lon: number, label?: string): void {
    if (!this.map) {
      return;
    }
    this.map.flyTo({
      center: [lon, lat],
      zoom: Math.max(this.map.getZoom(), 15),
    });
    this.placeMarker(lat, lon, label);
  }

  /** Drops (or moves) the single marker and always shows its coordinates in
   * the popup, plus `label` (e.g. a reverse-geocoded address) when given. */
  placeMarker(lat: number, lon: number, label?: string): void {
    if (!this.map) {
      return;
    }
    if (!this.marker) {
      this.popup = new Popup({ offset: 20 });
      this.marker = new Marker({
        element: createPinElement(),
        anchor: 'bottom',
      })
        .setLngLat([lon, lat])
        .setPopup(this.popup)
        .addTo(this.map);
    } else {
      this.marker.setLngLat([lon, lat]);
    }

    const coords = `${lat.toFixed(5)}, ${lon.toFixed(5)}`;
    const content = label
      ? `<strong>${escapeHtml(label)}</strong><br>${coords}`
      : coords;
    this.popup!.setHTML(content);
    if (!this.popup!.isOpen()) {
      this.popup!.addTo(this.map);
    }
  }
}

function escapeHtml(text: string): string {
  return text
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}