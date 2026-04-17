import { Injectable } from '@angular/core';
import { TerminalHub } from '../models/terminal.model';

@Injectable({
  providedIn: 'root',
})
export class TerminalService {
  private hubs: TerminalHub[] = [
    {
      id: 'session-harrison',
      name: 'Session–Harrison',
      color: '#1D9E75',
      // Along Session Road / Harrison Road intersection area
      lat: 16.4121,
      lng: 120.5968,
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
      ],
    },
    {
      id: 'igorot-park',
      name: 'Igorot Park',
      color: '#ebeb09',
      // Igorot Garden / Burnham Park area, near Lake Drive & Perfecto St
      lat: 16.41294,
      lng: 120.5948,
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
      ],
    },
    {
      id: 'rizal-park',
      name: 'Rizal Park',
      color: '#9B59B6',
      // Along Kisad Rd beside Burnham Park, near Otek St
      lat: 16.4130,
      lng: 120.5925,
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
      ],
    },
    {
      id: 'public-market',
      name: 'Baguio Public Market',
      color: '#E74C3C',
      // Along Kayang St near Baguio City Market / Public Market
      lat: 16.4172,
      lng: 120.5962,
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
      ],
    },
    {
      id: 'malcolm-square',
      name: 'Malcolm Square',
      color: '#3498DB',
      // Malcolm Square, near Perfecto St and Harrison Road junction
      lat: 16.4118,
      lng: 120.5940,
      terminals: [
        { no: 1, name: 'Aurora Hill' },
        { no: 2, name: 'Trancoville' },
      ],
    },
    {
      id: 'center-mall',
      name: 'Center Mall',
      color: '#F39C12',
      // Baguio Center Mall along Magsaysay Ave / Lakandula St
      lat: 16.4155,
      lng: 120.5946,
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
      ],
    },
    {
      id: 'magsaysay',
      name: 'Magsaysay Ave.',
      color: '#1ABC9C',
      // Along Magsaysay Ave near T. Alonzo St / Lower Bonifacio St
      lat: 16.4165,
      lng: 120.5935,
      terminals: [
        { no: 1, name: 'Upper Tomay' },
        { no: 2, name: 'Pico*Puguis Motorpool' },
        { no: 3, name: 'Buyagan Motorpool' },
      ],
    },
  ];

  getHubs(): TerminalHub[] {
    return this.hubs;
  }

  getHubById(id: string): TerminalHub | undefined {
    return this.hubs.find(hub => hub.id === id);
  }

  searchHubs(query: string): TerminalHub[] {
    const q = query.toLowerCase();
    return this.hubs.filter(hub =>
      hub.name.toLowerCase().includes(q) ||
      hub.terminals.some(t => t.name.toLowerCase().includes(q))
    );
  }
}