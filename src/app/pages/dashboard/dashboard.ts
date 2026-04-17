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
  private markers: any[] = [];

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

    L.tileLayer('https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png', {
      attribution: '&copy; <a href="https://carto.com/">CARTO</a>',
      subdomains: 'abcd',
      maxZoom: 20,
    }).addTo(this.map);

    this.addMarkers();
  }

  private addMarkers(): void {
    this.markers.forEach(m => m.remove());
    this.markers = [];

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

      this.markers.push(marker);
    });
  }

  selectHub(hub: TerminalHub): void {
    this.selectedHub = hub;
    this.map.setView([hub.lat, hub.lng], 16);
  }

  closePanel(): void {
    this.selectedHub = null;
  }
}