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
      color: '#d70400',
      lat: 16.4121,
      lng: 120.5968,
      terminals: [
        { no: 1, name: 'Aurora Hill Jeepney Stop', lat: 16.412450, lng: 120.5959 },
        { no: 2, name: 'Camp 8', lat: 16.412650, lng: 120.5961 },
        { no: 3, name: 'PNR', lat: 16.412780, lng: 120.59623 },
        { no: 4, name: 'Hillside', lat: 16.412530, lng: 120.5965 },
        { no: 5, name: 'Dagsian', lat: 16.412350, lng: 120.5967 },
        { no: 6, name: 'Loakan', lat: 16.412350, lng: 120.59705 },
        { no: 7, name: 'Navy Base', lat: 16.4122, lng: 120.5970 },
        { no: 8, name: 'Liteng', lat: 16.412150, lng: 120.596830 },
        { no: 9, name: 'Tiptop', lat: 16.4120, lng: 120.596680 },
        { no: 10, name: 'Maria Basa', lat: 16.4119, lng: 120.596580 },
        { no: 11, name: 'Camp 7', lat: 16.411870, lng: 120.596610 },
        { no: 12, name: 'Mines View', lat: 16.412050, lng: 120.597130 },
        { no: 13, name: 'Acupan', lat: 16.4113, lng: 120.597250 },
        { no: 14, name: 'Lucnab', lat: 16.4113, lng: 120.597450 },
        { no: 15, name: 'Country Club', lat: 16.411160, lng: 120.5976 },
      ],
    },
    {
      id: 'igorot-park',
      name: 'Igorot Park',
      color: '#f09800',
      lat: 16.41294,
      lng: 120.5948,
      terminals: [
        { no: 1, name: 'Campo Sioco', lat: 16.41294, lng: 120.5948 },
        { no: 2, name: 'Scout Barrio', lat: 16.41294, lng: 120.5948 },
        { no: 3, name: 'PMAIKIAS', lat: 16.41294, lng: 120.5948 },
        { no: 4, name: 'Bakakeng Sur', lat: 16.41294, lng: 120.5948 },
        { no: 5, name: 'Bakakeng Norte', lat: 16.41294, lng: 120.5948 },
        { no: 6, name: 'Greenwater Village', lat: 16.41294, lng: 120.5948 },
        { no: 7, name: 'Atok Trail', lat: 16.41294, lng: 120.5948 },
        { no: 8, name: 'Gabriela Silang', lat: 16.41294, lng: 120.5948 },
        { no: 9, name: 'Purok 1 Asin Rd via Crystal Cave', lat: 16.41294, lng: 120.5948 },
        { no: 10, name: 'City Camp', lat: 16.41294, lng: 120.5948 },
        { no: 11, name: 'Kitma', lat: 16.41294, lng: 120.5948 },
        { no: 12, name: 'Irisan', lat: 16.41294, lng: 120.5948 },
        { no: 13, name: 'Dontogan', lat: 16.41294, lng: 120.5948 },
        { no: 14, name: 'Sto. Tomas Proper (Balacbac)', lat: 16.41294, lng: 120.5948 },
        { no: 15, name: 'Long-Long via Tam-awan', lat: 16.41294, lng: 120.5948 },
      ],
    },
    {
      id: 'rizal-park',
      name: 'Rizal Park',
      color: '#eded05',
      lat: 16.4130,
      lng: 120.5925,
      terminals: [
        { no: 1, name: 'Bengao', lat: 16.4130, lng: 120.5925 },
        { no: 2, name: 'La Trinidad – Upper Tomay', lat: 16.4130, lng: 120.5925 },
        { no: 3, name: 'Tuba', lat: 16.4130, lng: 120.5925 },
        { no: 4, name: 'Cabuyao (Sto. Tomas)', lat: 16.4130, lng: 120.5925 },
        { no: 5, name: 'Sablan', lat: 16.4130, lng: 120.5925 },
        { no: 6, name: 'Asin', lat: 16.4130, lng: 120.5925 },
        { no: 7, name: 'Camp 6', lat: 16.4130, lng: 120.5925 },
        { no: 8, name: 'Agoo, La Union', lat: 16.4130, lng: 120.5925 },
        { no: 9, name: 'Camp 1, Tuba', lat: 16.4130, lng: 120.5925 },
      ],
    },
    {
      id: 'public-market',
      name: 'Baguio Public Market',
      color: '#6AA42D',
      lat: 16.4146,
      lng: 120.5947,
      terminals: [
        { no: 1, name: 'Guisad', lat: 16.4146, lng: 120.5947 },
        { no: 2, name: 'Lourdes Dominican', lat: 16.4146, lng: 120.5947 },
        { no: 3, name: 'Fairview', lat: 16.4146, lng: 120.5947 },
        { no: 4, name: 'Quezon Hill Ext.', lat: 16.4146, lng: 120.5947 },
        { no: 5, name: 'Quezon Hill', lat: 16.4146, lng: 120.5947 },
        { no: 6, name: 'St. Patrick | Idogan', lat: 16.4146, lng: 120.5947 },
        { no: 7, name: 'KM 6 EXT', lat: 16.4146, lng: 120.5947 },
        { no: 8, name: 'KM 6', lat: 16.4146, lng: 120.5947 },
        { no: 9, name: 'San Luis', lat: 16.4146, lng: 120.5947 },
        { no: 10, name: 'San Luis Ext.', lat: 16.4146, lng: 120.5947 },
        { no: 11, name: 'Pinsao', lat: 16.4146, lng: 120.5947 },
        { no: 12, name: 'San Carlos Hts.', lat: 16.4146, lng: 120.5947 },
        { no: 13, name: 'Tam-awan', lat: 16.4146, lng: 120.5947 },
      ],
    },
    {
      id: 'malcolm-square',
      name: 'Malcolm Square',
      color: '#2680bd',
      lat: 16.4141,
      lng: 120.5957,
      terminals: [
        { no: 1, name: 'Aurora Hill', lat: 16.41415, lng: 120.59555 },
        { no: 2, name: 'Trancoville', lat: 16.4143, lng: 120.59558 },
      ],
    },
    {
      id: 'center-mall',
      name: 'Center Mall',
      color: '#5A51A4',
      lat: 16.4155,
      lng: 120.5946,
      terminals: [
        { no: 1, name: 'Ampucao', lat: 16.4155, lng: 120.5946 },
        { no: 2, name: 'Brgy. Sitio*Bua*Tuding*Itogon', lat: 16.4155, lng: 120.5946 },
        { no: 3, name: 'Ucab*Midas', lat: 16.4155, lng: 120.5946 },
        { no: 4, name: 'Keystone*Ucab', lat: 16.4155, lng: 120.5946 },
        { no: 5, name: 'Ucab Trail', lat: 16.4155, lng: 120.5946 },
        { no: 6, name: 'Atok Mines', lat: 16.4155, lng: 120.5946 },
        { no: 7, name: 'Itogon Dalupirip', lat: 16.4155, lng: 120.5946 },
        { no: 8, name: 'Mangga*Tuding', lat: 16.4155, lng: 120.5946 },
        { no: 9, name: 'Tuding', lat: 16.4155, lng: 120.5946 },
        { no: 10, name: 'Beckel', lat: 16.4155, lng: 120.5946 },
        { no: 11, name: 'Backong*Sabkil, Itogon', lat: 16.4155, lng: 120.5946 },
        { no: 12, name: 'Amoyao*Ampucao', lat: 16.4155, lng: 120.5946 },
        { no: 13, name: 'Mines View', lat: 16.4155, lng: 120.5946 },
        { no: 14, name: 'Ambiong Terminals', lat: 16.4155, lng: 120.5946 },
        { no: 15, name: 'Brookside', lat: 16.4155, lng: 120.5946 },
      ],
    },
    {
      id: 'magsaysay',
      name: 'Magsaysay Ave.',
      color: '#C37493',
      lat: 16.4165,
      lng: 120.5935,
      terminals: [
        { no: 1, name: 'Upper Tomay', lat: 16.4165, lng: 120.5935 },
        { no: 2, name: 'Pico*Puguis Motorpool', lat: 16.4165, lng: 120.5935 },
        { no: 3, name: 'Buyagan Motorpool', lat: 16.4165, lng: 120.5935 },
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