import { Component, OnInit, OnDestroy, AfterViewInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NavbarComponent } from '../../components/navbar/navbar';

declare const L: any;

export interface Terminal {
  no: number;
  name: string;
}

export interface TerminalHub {
  id: string;
  name: string;
  color: string;
  lat: number;
  lng: number;
  terminals: Terminal[];
}

@Component({
  selector: 'app-dashboard',
  imports: [CommonModule, NavbarComponent],
  templateUrl: './dashboard.html',
  styleUrl: './dashboard.css',
})
export class Dashboard implements OnInit, AfterViewInit, OnDestroy {
  private map: any;
  private markers: any[] = [];
  selectedHub: TerminalHub | null = null;

  terminalHubs: TerminalHub[] = [
    {
      id: 'session-harrison',
      name: 'Session–Harrison',
      color: '#1D9E75',
      lat: 16.4116,
      lng: 120.5934,
      terminals: [
        { no: 1, name: 'Aurora Hill Jeepney Stop' },
        { no: 2, name: 'Camp 8' },
        { no: 3, name: 'PNR' },
        { no: 4, name: 'Hillside' },
        { no: 5, name: 'Dagsian' },
        { no: 6, name: 'Loakan' },
        { no: 7, name: 'Navy Base' },
        { no: 8, name: 'Liteng' },
        { no: 9, name: 'Tiptop' },
        { no: 10, name: 'Maria Basa' },
        { no: 11, name: 'Camp 7' },
        { no: 12, name: 'Mines View' },
        { no: 13, name: 'Acupan' },
        { no: 14, name: 'Lucnab' },
        { no: 15, name: 'Country Club' },
      ]
    },
    {
      id: 'igorot-park',
      name: 'Igorot Park',
      color: '#E67E22',
      lat: 16.4094,
      lng: 120.5980,
      terminals: [
        { no: 1, name: 'Campo Sioco' },
        { no: 2, name: 'Scout Barrio' },
        { no: 3, name: 'PMAIKIAS' },
        { no: 4, name: 'Bakakeng Sur' },
        { no: 5, name: 'Bakakeng Norte' },
        { no: 6, name: 'Greenwater Village' },
        { no: 7, name: 'Atok Trail' },
        { no: 8, name: 'Gabriela Silang' },
        { no: 9, name: 'Purok 1 Asin Rd via Crystal Cave' },
        { no: 10, name: 'City Camp' },
        { no: 11, name: 'Kitma' },
        { no: 12, name: 'Irisan' },
        { no: 13, name: 'Dontogan' },
        { no: 14, name: 'Sto. Tomas Proper (Balacbac)' },
        { no: 15, name: 'Long-Long via Tam-awan' },
      ]
    },
    {
      id: 'rizal-park',
      name: 'Rizal Park',
      color: '#9B59B6',
      lat: 16.4080,
      lng: 120.5960,
      terminals: [
        { no: 1, name: 'Bengao' },
        { no: 2, name: 'La Trinidad – Upper Tomay' },
        { no: 3, name: 'Tuba' },
        { no: 4, name: 'Cabuyao (Sto. Tomas)' },
        { no: 5, name: 'Sablan' },
        { no: 6, name: 'Asin' },
        { no: 7, name: 'Camp 6' },
        { no: 8, name: 'Agoo, La Union' },
        { no: 9, name: 'Camp 1, Tuba' },
      ]
    },
    {
      id: 'public-market',
      name: 'Baguio Public Market',
      color: '#E74C3C',
      lat: 16.4145,
      lng: 120.5968,
      terminals: [
        { no: 1, name: 'Guisad' },
        { no: 2, name: 'Lourdes Dominican' },
        { no: 3, name: 'Fairview' },
        { no: 4, name: 'Quezon Hill Ext.' },
        { no: 5, name: 'Quezon Hill' },
        { no: 6, name: 'St. Patrick | Idogan' },
        { no: 7, name: 'KM 6 EXT' },
        { no: 8, name: 'KM 6' },
        { no: 9, name: 'San Luis' },
        { no: 10, name: 'San Luis Ext.' },
        { no: 11, name: 'Pinsao' },
        { no: 12, name: 'San Carlos Hts.' },
        { no: 13, name: 'Tam-awan' },
      ]
    },
    {
      id: 'malcolm-square',
      name: 'Malcolm Square',
      color: '#3498DB',
      lat: 16.4120,
      lng: 120.5948,
      terminals: [
        { no: 1, name: 'Aurora Hill' },
        { no: 2, name: 'Trancoville' },
      ]
    },
    {
      id: 'center-mall',
      name: 'Center Mall',
      color: '#F39C12',
      lat: 16.4160,
      lng: 120.5990,
      terminals: [
        { no: 1, name: 'Ampucao' },
        { no: 2, name: 'Brgy. Sitio*Bua*Tuding*Itogon' },
        { no: 3, name: 'Ucab*Midas' },
        { no: 4, name: 'Keystone*Ucab' },
        { no: 5, name: 'Ucab Trail' },
        { no: 6, name: 'Atok Mines' },
        { no: 7, name: 'Itogon Dalupirip' },
        { no: 8, name: 'Mangga*Tuding' },
        { no: 9, name: 'Tuding' },
        { no: 10, name: 'Beckel' },
        { no: 11, name: 'Backong*Sabkil, Itogon' },
        { no: 12, name: 'Amoyao*Ampucao' },
        { no: 13, name: 'Mines View' },
        { no: 14, name: 'Ambiong Terminals' },
        { no: 15, name: 'Brookside' },
      ]
    },
    {
      id: 'magsaysay',
      name: 'Magsaysay Ave.',
      color: '#1ABC9C',
      lat: 16.4175,
      lng: 120.5970,
      terminals: [
        { no: 1, name: 'Upper Tomay' },
        { no: 2, name: 'Pico*Puguis Motorpool' },
        { no: 3, name: 'Buyagan Motorpool' },
      ]
    },
  ];

  ngOnInit(): void {}

  ngAfterViewInit(): void {
    this.loadLeaflet();
  }

  private loadLeaflet(): void {
    const link = document.createElement('link');
    link.rel = 'stylesheet';
    link.href = 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.css';
    document.head.appendChild(link);

    const script = document.createElement('script');
    script.src = 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.js';
    script.onload = () => this.initMap();
    document.head.appendChild(script);
  }

  private initMap(): void {
    this.map = L.map('baguio-map', {
      center: [16.4123, 120.5960],
      zoom: 15,
      zoomControl: true,
    });

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '© OpenStreetMap contributors',
      maxZoom: 19,
    }).addTo(this.map);

    this.terminalHubs.forEach(hub => {
      const icon = L.divIcon({
        html: `
          <div style="
            background: ${hub.color};
            width: 16px;
            height: 16px;
            border-radius: 50%;
            border: 3px solid white;
            box-shadow: 0 2px 8px rgba(0,0,0,0.4);
            cursor: pointer;
          "></div>
        `,
        className: '',
        iconSize: [16, 16],
        iconAnchor: [8, 8],
      });

      const marker = L.marker([hub.lat, hub.lng], { icon })
        .addTo(this.map)
        .bindTooltip(`<strong>${hub.name}</strong><br>${hub.terminals.length} terminals`, {
          permanent: false,
          direction: 'top',
          offset: [0, -10],
        })
        .on('click', () => this.selectHub(hub));

      this.markers.push({ hub, marker });
    });
  }

  selectHub(hub: TerminalHub): void {
    this.selectedHub = hub;
    if (this.map) {
      this.map.setView([hub.lat, hub.lng], 16, { animate: true });
    }
  }

  ngOnDestroy(): void {
    if (this.map) {
      this.map.remove();
    }
  }
}