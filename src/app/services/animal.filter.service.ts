import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AnimalFilterService {
  private filterSubject = new BehaviorSubject<string | null>(null);
  filter$ = this.filterSubject.asObservable();

  setFilter(servicePet: string | null): void {
    this.filterSubject.next(servicePet);
  }
}
