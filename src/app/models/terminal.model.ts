export interface Terminal {
  no: number;
  name: string;
  lat?: number;
  lng?: number;
}

export interface TerminalHub {
  id: string;
  name: string;
  color: string;
  lat: number;
  lng: number;
  terminals: Terminal[];
}