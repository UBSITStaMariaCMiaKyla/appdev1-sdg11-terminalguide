import { Component, OnInit, OnDestroy, AfterViewInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute } from '@angular/router';
import { Observable, combineLatest, map, startWith, tap } from 'rxjs';
import { TerminalService } from '../../services/terminal';
import { TerminalHub, Terminal } from '../../models/terminal.model';
import { LoadingSpinner } from '../../components/loading-spinner/loading-spinner';
import { WeatherWidget } from '../../components/weather-widget/weather-widget';

declare const L: any;

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, LoadingSpinner, WeatherWidget],
  templateUrl: './dashboard.html',
  styleUrl: './dashboard.css',
})
export class Dashboard implements OnInit, AfterViewInit, OnDestroy {
  // Observable exposed for async pipe
  hubs$!: Observable<TerminalHub[]>;
  filteredHubs$!: Observable<TerminalHub[]>;
  isLoading = true;

  selectedHub: TerminalHub | null = null;
  searchQuery: string = '';
  highlightedTerminalNo: number | null = null;

  mapLoading = false;
  private loadingTimer: any;

  selectedTerminal: Terminal | null = null;
  selectedTerminalLat: number | null = null;
  selectedTerminalLng: number | null = null;
  isRouting = false;
  routingError = '';

  private map: any;
  private hubMarkers: any[] = [];
  private terminalMarkers: any[] = [];
  routingControl: any = null;
  private userMarker: any = null;
  private mapReady = false;
  private allHubs: TerminalHub[] = [];

  constructor(
    private terminalService: TerminalService,
    private route: ActivatedRoute
  ) {}

  ngOnInit(): void {
    // HTTP GET via service — satisfies requirement #2
    this.hubs$ = this.terminalService.getHubs().pipe(
      tap(hubs => {
        this.allHubs = hubs;
        this.isLoading = false;
        if (this.mapReady) {
          this.renderHubMarkers(hubs);
          if (this.searchQuery) {
            setTimeout(() => this.applySearch(this.searchQuery), 100);
          }
        }
      })
    );

    // filteredHubs$ reacts to search query params
    this.filteredHubs$ = combineLatest([
      this.hubs$,
      this.route.queryParams.pipe(startWith({ search: '' }))
    ]).pipe(
      map(([hubs, params]) => {
        const query = params['search'] || '';
        this.searchQuery = query;
        if (!query.trim()) return hubs;
        const q = query.toLowerCase().replace(/[-–—]/g, '-');
        return hubs.filter(hub =>
          hub.name.toLowerCase().replace(/[-–—]/g, '-').includes(q) ||
          hub.terminals.some(t =>
            t.name.toLowerCase().replace(/[-–—]/g, '-').includes(q)
          )
        );
      })
    );
  }

  ngAfterViewInit(): void {
    this.initMap();
    this.mapReady = true;

    // If hubs already loaded, render markers now
    if (this.allHubs.length) {
      this.renderHubMarkers(this.allHubs);
      if (this.searchQuery) {
        setTimeout(() => this.applySearch(this.searchQuery), 300);
      }
    }
  }

  ngOnDestroy(): void {
    if (this.map) this.map.remove();
    if (this.loadingTimer) clearTimeout(this.loadingTimer);
  }

  private normalize(s: string): string {
    return s.toLowerCase().replace(/[-–—]/g, '-');
  }

  private applySearch(query: string): void {
    if (!query.trim()) {
      this.selectedHub = null;
      this.highlightedTerminalNo = null;
      this.clearTerminalMarkers();
      return;
    }

    const q = this.normalize(query);
    const hubs = this.allHubs;

    const exactHub = hubs.find(h => this.normalize(h.name).includes(q));

    if (exactHub) {
      this.highlightedTerminalNo = null;
      setTimeout(() => {
        this.closeParaPoCard();
        this.selectedHub = exactHub;
        this.map.setView([exactHub.lat, exactHub.lng], 17);
        this.addTerminalMarkers(exactHub);
      }, 150);
      return;
    }

    for (const hub of hubs) {
      const matchedTerminal = hub.terminals.find(t =>
        this.normalize(t.name).includes(q)
      );
      if (matchedTerminal) {
        this.highlightedTerminalNo = matchedTerminal.no;
        setTimeout(() => {
          this.closeParaPoCard();
          this.selectedHub = hub;
          this.addTerminalMarkers(hub);
          setTimeout(() => {
            const lat = matchedTerminal.lat ?? hub.lat;
            const lng = matchedTerminal.lng ?? hub.lng;
            this.map.setView([lat, lng], 19);
            this.selectedTerminal = matchedTerminal;
            this.selectedTerminalLat = lat;
            this.selectedTerminalLng = lng;
            this.routingError = '';
          }, 100);
        }, 150);
        break;
      }
    }
  }

  private initMap(): void {
    this.loadingTimer = setTimeout(() => {
      this.mapLoading = true;
    }, 800);

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

    const tileLayer = L.tileLayer('https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png', {
      attribution: '&copy; <a href="https://carto.com/">CARTO</a>',
      subdomains: 'abcd',
      maxZoom: 20,
    }).addTo(this.map);

    tileLayer.once('load', () => {
      clearTimeout(this.loadingTimer);
      this.mapLoading = false;
    });

    setTimeout(() => {
      clearTimeout(this.loadingTimer);
      this.mapLoading = false;
    }, 6000);
  }

  private renderHubMarkers(hubs: TerminalHub[]): void {
    this.hubMarkers.forEach(m => m.remove());
    this.hubMarkers = [];

    hubs.forEach(hub => {
      const markerHtml = `
        <div style="
          background: ${hub.color};
          width: 18px; height: 18px;
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
          width: 26px; height: 26px;
          border-radius: 50%;
          border: 2px solid white;
          box-shadow: 0 2px 6px rgba(0,0,0,0.4);
          display: flex; align-items: center; justify-content: center;
          font-size: 10px; font-weight: 700;
          color: white; cursor: pointer;
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
          this.selectedTerminal = terminal;
          this.selectedTerminalLat = lat;
          this.selectedTerminalLng = lng;
          this.routingError = '';
        });

      this.terminalMarkers.push({ marker, lat, lng });
    });
  }

  private clearTerminalMarkers(): void {
    this.terminalMarkers.forEach(m => m.marker.remove());
    this.terminalMarkers = [];
  }

  selectHub(hub: TerminalHub): void {
    this.closeParaPoCard();
    this.highlightedTerminalNo = null;
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
    const lat = terminal.lat ?? this.selectedHub.lat;
    const lng = terminal.lng ?? this.selectedHub.lng;
    this.map.setView([lat, lng], 20);
    this.selectedTerminal = terminal;
    this.selectedTerminalLat = lat;
    this.selectedTerminalLng = lng;
    this.highlightedTerminalNo = terminal.no;
    this.routingError = '';
  }

  paraPoClicked(): void {
    if (!this.selectedTerminalLat || !this.selectedTerminalLng) return;
    this.isRouting = true;
    this.routingError = '';

    if (!navigator.geolocation) {
      this.routingError = 'GPS not supported on this device.';
      this.isRouting = false;
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        const userLat = position.coords.latitude;
        const userLng = position.coords.longitude;

        this.clearRoute();

        this.userMarker = L.circleMarker([userLat, userLng], {
          radius: 8,
          color: '#1D9E75',
          fillColor: '#1D9E75',
          fillOpacity: 1,
          weight: 3,
        }).addTo(this.map).bindTooltip('You are here', { direction: 'top' });

        this.routingControl = (L as any).Routing.control({
          waypoints: [
            L.latLng(userLat, userLng),
            L.latLng(this.selectedTerminalLat!, this.selectedTerminalLng!),
          ],
          routeWhileDragging: false,
          addWaypoints: false,
          draggableWaypoints: false,
          fitSelectedRoutes: true,
          show: false,
          lineOptions: {
            styles: [{ color: '#1D9E75', weight: 5, opacity: 0.8 }],
          },
          createMarker: () => null,
        }).addTo(this.map);

        this.isRouting = false;
      },
      (error) => {
        this.isRouting = false;
        if (error.code === error.PERMISSION_DENIED) {
          this.routingError = 'Please allow location access to use navigation.';
        } else {
          this.routingError = 'Could not get your location. Try again.';
        }
      },
      { enableHighAccuracy: true, timeout: 10000 }
    );
  }

  clearRoute(): void {
    if (this.routingControl) {
      this.map.removeControl(this.routingControl);
      this.routingControl = null;
    }
    if (this.userMarker) {
      this.userMarker.remove();
      this.userMarker = null;
    }
  }

  closeParaPoCard(): void {
    this.selectedTerminal = null;
    this.selectedTerminalLat = null;
    this.selectedTerminalLng = null;
    this.routingError = '';
    this.clearRoute();
  }

  closePanel(): void {
    this.selectedHub = null;
    this.clearTerminalMarkers();
    this.closeParaPoCard();
  }
}