import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Output, inject, signal } from '@angular/core';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import {
  catchError,
  debounceTime,
  distinctUntilChanged,
  of,
  switchMap,
  tap,
} from 'rxjs';
import { toSignal } from '@angular/core/rxjs-interop';
import { GeocodingService } from '../data-access/geocoding.service';
import { GeocodingResult } from '../data-access/geocoding-result.model';

@Component({
  selector: 'app-search-bar',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './search-bar.component.html',
  styleUrl: './search-bar.component.css',
})
export class SearchBarComponent {
  private readonly geocodingService = inject(GeocodingService);

  readonly queryControl = new FormControl('', { nonNullable: true });

  /** Hides the suggestions dropdown right after a result is picked, even
   * though the input keeps that result's label as its text. */
  private readonly suggestionsDismissed = signal(false);

  @Output() readonly resultSelected = new EventEmitter<GeocodingResult>();

  private readonly searchResults = toSignal(
    this.queryControl.valueChanges.pipe(
      tap(() => this.suggestionsDismissed.set(false)),
      debounceTime(300),
      distinctUntilChanged(),
      switchMap((query) =>
        query.trim().length < 3
          ? of([] as GeocodingResult[])
          : this.geocodingService
              .search(query)
              .pipe(catchError(() => of([] as GeocodingResult[]))),
      ),
    ),
    { initialValue: [] as GeocodingResult[] },
  );

  readonly results = () =>
    this.suggestionsDismissed() ? [] : this.searchResults();

  select(result: GeocodingResult): void {
    this.suggestionsDismissed.set(true);
    this.queryControl.setValue(result.label, { emitEvent: false });
    this.resultSelected.emit(result);
  }
}
