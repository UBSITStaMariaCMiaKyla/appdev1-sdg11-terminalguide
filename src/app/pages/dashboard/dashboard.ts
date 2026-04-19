import { Component, OnInit, OnDestroy, AfterViewInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute } from '@angular/router';
import { TerminalService } from '../../services/terminal';
import { TerminalHub, Terminal } from '../../models/terminal.model';

declare const L: any;

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './dashboard.html',
  styleUrl: './dashboard.css',
})
export class Dashboard implements OnInit, AfterViewInit, OnDestroy {
  selectedHub: TerminalHub | null = null;
  terminalHubs: TerminalHub[] = [];
  filteredHubs: TerminalHub[] = [];
  searchQuery: string = '';
  private map: any;
  private hubMarkers: any[] = [];
  private terminalMarkers: any[] = [];
  private mapReady = false;

  constructor(
    private terminalService: TerminalService,
    private route: ActivatedRoute
  ) {}

  ngOnInit(): void {
    this.terminalHubs = this.terminalService.getHubs();
    this.filteredHubs = this.terminalHubs;

    this.route.queryParams.subscribe(params => {
      const search = params['search'] || '';
      this.searchQuery = search;
      this.applySearch(search);
    });
  }

  ngAfterViewInit(): void {
    this.initMap();
    this.mapReady = true;
  }

  ngOnDestroy(): void {
    if (this.map) {
      this.map.remove();
    }
  }

  private normalize(s: string): string {
    return s.toLowerCase().replace(/[-–—]/g, '-');
  }

  private applySearch(query: string): void {
    if (!query.trim()) {
      this.filteredHubs = this.terminalHubs;
      this.selectedHub = null;
      this.clearTerminalMarkers();
      return;
    }

    const q = this.normalize(query);

    this.filteredHubs = this.terminalHubs.filter(hub =>
      this.normalize(hub.name).includes(q) ||
      hub.terminals.some(t => this.normalize(t.name).includes(q))
    );

    // Check if query matches a hub name first
    const exactHub = this.filteredHubs.find(h =>
      this.normalize(h.name).includes(q)
    );

    if (exactHub && this.mapReady) {
      setTimeout(() => this.selectHub(exactHub), 100);
      return;
    }

    // Otherwise check if query matches a specific terminal inside a hub
    if (this.mapReady) {
      for (const hub of this.filteredHubs) {
        const matchedTerminal = hub.terminals.find(t =>
          this.normalize(t.name).includes(q)
        );
        if (matchedTerminal) {
          setTimeout(() => {
            // Open the hub panel and show its terminals
            this.selectHub(hub);
            // Then zoom to the specific terminal
            const lat = matchedTerminal.lat ?? hub.lat;
            const lng = matchedTerminal.lng ?? hub.lng;
            setTimeout(() => this.map.setView([lat, lng], 19), 150);
          }, 100);
          break;
        }
      }
    }
  }

  private initMap(): void {
    const carBounds = L.latLngBounds(
      L.latLng(15.8, 119.9),
      L.latLng(18.0, 121.6)
    );

    this.map = L.map('leaflet-map', {
      center: [16.4123, 120.5960],
      zoom: 13,
      minZoom: 10,
      maxZoom: 20,
      maxBounds: carBounds,
      maxBoundsViscosity: 1.0,
      zoomControl: true,
    });

    L.tileLayer('https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png', {
      attribution: '&copy; <a href="https://carto.com/">CARTO</a>',
      subdomains: 'abcd',
      maxZoom: 20,
    }).addTo(this.map);

    this.addHubMarkers();

    if (this.searchQuery) {
      setTimeout(() => this.applySearch(this.searchQuery), 200);
    }
  }

  private addHubMarkers(): void {
    this.hubMarkers.forEach(m => m.remove());
    this.hubMarkers = [];

    this.terminalHubs.forEach(hub => {
      const markerHtml = `
        <div style="
          background: ${hub.color};
          width: 18px;
          height: 18px;
          border-radius: 50%;
          border: 3px solid white;
          box-shadow: 0 2px 8px rgba(0,0,0,0.5);
          cursor: pointer;
        "></div>`;

      const icon = L.divIcon({
        html: markerHtml,
        className: '',
        iconSize: [18, 18],
        iconAnchor: [9, 9],
      });

      const marker = L.marker([hub.lat, hub.lng], { icon })
        .addTo(this.map)
        .bindTooltip(hub.name, { permanent: false, direction: 'top' })
        .on('click', () => this.selectHub(hub));

      this.hubMarkers.push(marker);
    });
  }

  private addTerminalMarkers(hub: TerminalHub): void {
    this.clearTerminalMarkers();

    const total = hub.terminals.length;
    const radius = 0.0008;

    hub.terminals.forEach((terminal, index) => {
      let lat: number;
      let lng: number;

      if (terminal.lat && terminal.lng) {
        lat = terminal.lat;
        lng = terminal.lng;
      } else {
        const angle = (2 * Math.PI * index) / total - Math.PI / 2;
        lat = hub.lat + radius * Math.cos(angle);
        lng = hub.lng + radius * Math.sin(angle) * 1.5;
      }

      const markerHtml = `
        <div style="
          background: ${hub.color};
          width: 26px;
          height: 26px;
          border-radius: 50%;
          border: 2px solid white;
          box-shadow: 0 2px 6px rgba(0,0,0,0.4);
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 10px;
          font-weight: 700;
          color: white;
          cursor: pointer;
          font-family: Inter, sans-serif;
        ">${terminal.no}</div>`;

      const icon = L.divIcon({
        html: markerHtml,
        className: '',
        iconSize: [26, 26],
        iconAnchor: [13, 13],
      });

      const marker = L.marker([lat, lng], { icon })
        .addTo(this.map)
        .bindTooltip(`${terminal.no}. ${terminal.name}`, {
          permanent: false,
          direction: 'top',
        })
        .on('click', () => {
          this.map.setView([lat, lng], 18);
        });

      this.terminalMarkers.push({ marker, lat, lng });
    });
  }

  private clearTerminalMarkers(): void {
    this.terminalMarkers.forEach(m => m.marker.remove());
    this.terminalMarkers = [];
  }

  selectHub(hub: TerminalHub): void {
    if (this.selectedHub?.id === hub.id) {
      this.selectedHub = null;
      this.clearTerminalMarkers();
    } else {
      this.selectedHub = hub;
      this.map.setView([hub.lat, hub.lng], 19);
      this.addTerminalMarkers(hub);
    }
  }

  selectTerminal(terminal: Terminal): void {
    if (!this.selectedHub) return;

    let lat: number;
    let lng: number;

    if (terminal.lat && terminal.lng) {
      lat = terminal.lat;
      lng = terminal.lng;
    } else {
      lat = this.selectedHub.lat;
      lng = this.selectedHub.lng;
    }

    this.map.setView([lat, lng], 20);
  }

  closePanel(): void {
    this.selectedHub = null;
    this.clearTerminalMarkers();
  }
}