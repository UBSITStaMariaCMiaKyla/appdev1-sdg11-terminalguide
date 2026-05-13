import { TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting, HttpTestingController } from '@angular/common/http/testing';
import { TerminalService } from './terminal';
import { TerminalHub } from '../models/terminal.model';

describe('TerminalService', () => {
  let service: TerminalService;
  let httpMock: HttpTestingController;

  const mockHubs: TerminalHub[] = [
    {
      id: 'igorot-park',
      name: 'Igorot Park',
      color: '#F59E0B',
      lat: 16.4123,
      lng: 120.5960,
      terminals: [
        { no: 1, name: 'Campo Sioco' },
        { no: 2, name: 'Scout Barrio' },
      ]
    }
  ];

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        provideHttpClient(),
        provideHttpClientTesting(),
      ]
    });
    service = TestBed.inject(TerminalService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should fetch hubs from assets/terminals.json', () => {
    service.getHubs().subscribe(hubs => {
      expect(hubs.length).toBe(1);
      expect(hubs[0].name).toBe('Igorot Park');
    });

    const req = httpMock.expectOne('assets/terminals.json');
    expect(req.request.method).toBe('GET');
    req.flush(mockHubs);
  });

  it('should filter hubs by hub name', () => {
    const result = service.searchHubs('igorot', mockHubs);
    expect(result.length).toBe(1);
    expect(result[0].name).toBe('Igorot Park');
  });

  it('should filter hubs by terminal name', () => {
    const result = service.searchHubs('campo', mockHubs);
    expect(result.length).toBe(1);
    expect(result[0].terminals[0].name).toBe('Campo Sioco');
  });

  it('should return empty array when no match found', () => {
    const result = service.searchHubs('xyz123', mockHubs);
    expect(result.length).toBe(0);
  });
});