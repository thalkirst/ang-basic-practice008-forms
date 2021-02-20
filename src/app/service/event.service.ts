import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, of } from 'rxjs';
import { tap } from 'rxjs/operators';
import { Event } from '../model/event';
import { ToastrService } from 'ngx-toastr';

@Injectable({
  providedIn: 'root'
})
export class EventService {

  apiUrl: string = `http://localhost:3000/list`;

  list$: BehaviorSubject<Event[]> = new BehaviorSubject<Event[]>([]);

  constructor(private http: HttpClient, private toastr: ToastrService) { }

  getAll(): void {
    this.list$.next([]);
    this.http.get<Event[]>(this.apiUrl).subscribe(
      products => this.list$.next(products)
    );
  }

  get(id: number | string): Observable<Event> {
    id = parseInt(('' + id), 10);
    return this.http.get<Event>(`${this.apiUrl}/${id}`);
  }

  update(event: Event): Observable<Event> {
    return this.http.patch<Event>(
      `${this.apiUrl}/${event.id}`,
      event
    ).pipe(
      tap( () => {
        this.getAll();
        this.toastr.info('The event has been updated.', 'UPDATED'); 
      })
    );
  }

  create(event: Event): void {
    this.http.post<Event>(
      `${this.apiUrl}`,
      event
    ).subscribe(
      () => this.getAll()
    );
    this.toastr.success('The event has been created.', 'NEW EVENT');
  }

  remove(event: Event): void {
    this.http.delete<Event>(
      `${this.apiUrl}/${event.id}`
    ).subscribe(
      () => this.getAll()
    );
    this.toastr.warning('The event has been deleted.', 'DELETED');
  }

}
