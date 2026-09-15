import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { AppComponent } from './app.component';
import { MapConfigService } from './core/config/map-config.service';

describe('AppComponent', () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AppComponent],
      providers: [
        provideHttpClient(),
        provideHttpClientTesting(),
        {
          provide: MapConfigService,
          useValue: {
            get: () => ({
              hereApiKey: 'test-api-key',
              tileUrlTemplate: 'http://localhost:8083/styles/basic-preview/{z}/{x}/{y}.png',
              tileAttribution: '',
              countryCode: 'COL',
              defaultCenter: [4.5709, -74.2973],
              defaultZoom: 6,
              minZoom: 5,
              maxZoom: 19,
            }),
          },
        },
      ],
    }).compileComponents();
  });

  it('should create the app', () => {
    const fixture = TestBed.createComponent(AppComponent);
    const app = fixture.componentInstance;
    expect(app).toBeTruthy();
  });

  it('should render the search bar and the map', () => {
    const fixture = TestBed.createComponent(AppComponent);
    fixture.detectChanges();
    const compiled = fixture.nativeElement as HTMLElement;
    expect(compiled.querySelector('app-search-bar')).toBeTruthy();
    expect(compiled.querySelector('app-map')).toBeTruthy();
  });
});
