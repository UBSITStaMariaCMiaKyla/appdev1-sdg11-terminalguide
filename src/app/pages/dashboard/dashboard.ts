import { Component, OnInit, OnDestroy, AfterViewInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TerminalService } from '../../services/terminal';
import { TerminalHub } from '../../models/terminal.model';

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
  private map: any;
  private hubMarkers: any[] = [];
  private terminalMarkers: any[] = [];

  constructor(private terminalService: TerminalService) {}

  ngOnInit(): void {
    this.terminalHubs = this.terminalService.getHubs();
  }

  ngAfterViewInit(): void {
    this.initMap();
  }

  ngOnDestroy(): void {
    if (this.map) {
      this.map.remove();
    }
  }

  private initMap(): void {
    this.map = L.map('leaflet-map', {
      center: [16.4123, 120.5960],
      zoom: 15,
      zoomControl: true,
    });

    L.tileLayer('https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png', {
      attribution: '&copy; <a href="https://carto.com/">CARTO</a>',
      subdomains: 'abcd',
      maxZoom: 20,
    }).addTo(this.map);

    this.addHubMarkers();
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
        });

      this.terminalMarkers.push(marker);
    });
  }

  private clearTerminalMarkers(): void {
    this.terminalMarkers.forEach(m => m.remove());
    this.terminalMarkers = [];
  }

  selectHub(hub: TerminalHub): void {
    if (this.selectedHub?.id === hub.id) {
      this.selectedHub = null;
      this.clearTerminalMarkers();
    } else {
      this.selectedHub = hub;
      this.map.setView([hub.lat, hub.lng], 16);
      this.addTerminalMarkers(hub);
    }
  }

  closePanel(): void {
    this.selectedHub = null;
    this.clearTerminalMarkers();
  }
}