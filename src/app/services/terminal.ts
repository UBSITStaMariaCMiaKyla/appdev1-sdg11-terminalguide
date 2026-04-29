import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, shareReplay } from 'rxjs';
import { TerminalHub } from '../models/terminal.model';

@Injectable({
  providedIn: 'root',
})
export class TerminalService {
  private http = inject(HttpClient);

  private hubs$: Observable<TerminalHub[]> = this.http
    .get<TerminalHub[]>('assets/terminals.json')
    .pipe(shareReplay(1));

  getHubs(): Observable<TerminalHub[]> {
    return this.hubs$;
  }

  searchHubs(query: string, hubs: TerminalHub[]): TerminalHub[] {
    const q = query.toLowerCase();
    return hubs.filter(hub =>
      hub.name.toLowerCase().includes(q) ||
      hub.terminals.some(t => t.name.toLowerCase().includes(q))
    );
  }
}